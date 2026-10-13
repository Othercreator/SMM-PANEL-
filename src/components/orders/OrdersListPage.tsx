import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { OrderReceiptModal } from '../common/OrderReceiptModal';
import { 
  Search, 
  Download, 
  ExternalLink, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  RefreshCw,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  XCircle,
  Plus
} from 'lucide-react';

export const OrdersListPage: React.FC = () => {
  const { orders, formatCurrency, requestRefill, showToast, setCurrentPage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const pageSize = 8;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast('Order records successfully re-fetched from backend cluster.');
    }, 500);
  };

  // Filter orders by search query (Order ID or Service Name, link, service ID) and status (Pending, Processing, Completed, Cancelled)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search matching Order ID or Service Name (as well as link or ID)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        q === '' ||
        order.id.toLowerCase().includes(q) ||
        order.serviceName.toLowerCase().includes(q) ||
        order.serviceId.toLowerCase().includes(q) ||
        order.link.toLowerCase().includes(q) ||
        order.platform.toLowerCase().includes(q);

      // Status filtering: handles Pending, Processing (including In Progress), Completed, Cancelled
      let matchesStatus = true;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Processing') {
          matchesStatus = order.status === 'Processing' || order.status === 'In Progress';
        } else {
          matchesStatus = order.status === statusFilter;
        }
      }

      // Platform filter
      const matchesPlatform = platformFilter === 'All' || order.platform === platformFilter;

      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [orders, searchQuery, statusFilter, platformFilter]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPageNum - 1) * pageSize, currentPageNum * pageSize);

  // Status counts for filtering buttons
  const statusCounts = useMemo(() => {
    return {
      All: orders.length,
      Pending: orders.filter(o => o.status === 'Pending').length,
      Processing: orders.filter(o => o.status === 'Processing' || o.status === 'In Progress').length,
      Completed: orders.filter(o => o.status === 'Completed').length,
      Cancelled: orders.filter(o => o.status === 'Cancelled').length,
    };
  }, [orders]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(paginatedOrders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'Order ID,Service,Platform,Target Link,Quantity,Charge,Status,Date\n';
    const rows = filteredOrders.map(o => 
      `"${o.id}","${o.serviceName}","${o.platform}","${o.link}",${o.quantity},${o.charge},"${o.status}","${o.createdAt}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialflow-orders-${Date.now()}.csv`;
    a.click();
    showToast('Orders exported to CSV.');
  };

  const handleOpenOrder = (order: Order) => {
    setSelectedOrderForModal(order);
    setModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPlatformFilter('All');
    setCurrentPageNum(1);
  };

  const isFilterActive = searchQuery !== '' || statusFilter !== 'All' || platformFilter !== 'All';

  return (
    <div className="space-y-6">
      {/* Top Header with Refresh and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 block mb-1">
            Campaign Monitoring
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Orders Management
          </h2>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
            <span>Track, monitor, and filter live social campaigns</span>
            <span>·</span>
            <span className="text-[11px] text-slate-400">Synced: {lastRefreshed}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/80 transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
            title="Re-fetch latest order data from backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          {/* Export Filtered CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-xs"
            title="Export current filtered order list as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredOrders.length})</span>
          </button>

          {/* Place New Order Action */}
          <button
            onClick={() => setCurrentPage('new-order')}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Order</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Summary Cards with Color Coding */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Orders - Blue */}
        <div 
          onClick={() => { setStatusFilter('All'); setCurrentPageNum(1); }}
          className={`p-4 sm:p-5 bg-white rounded-2xl border shadow-xs cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'All' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {orders.length.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            All campaign records
          </div>
        </div>

        {/* Completed - Green */}
        <div 
          onClick={() => { setStatusFilter('Completed'); setCurrentPageNum(1); }}
          className={`p-4 sm:p-5 bg-white rounded-2xl border shadow-xs cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'Completed' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-emerald-700">Completed (Green)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {statusCounts.Completed.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{orders.length > 0 ? Math.round((statusCounts.Completed / orders.length) * 100) : 0}% success rate</span>
          </div>
        </div>

        {/* Processing - Teal */}
        <div 
          onClick={() => { setStatusFilter('Processing'); setCurrentPageNum(1); }}
          className={`p-4 sm:p-5 bg-white rounded-2xl border shadow-xs cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'Processing' ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-teal-700">Processing (Teal)</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {statusCounts.Processing.toLocaleString()}
          </div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>Active dispatch</span>
          </div>
        </div>

        {/* Pending - Yellow / Amber */}
        <div 
          onClick={() => { setStatusFilter('Pending'); setCurrentPageNum(1); }}
          className={`p-4 sm:p-5 bg-white rounded-2xl border shadow-xs cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'Pending' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-amber-700">Pending (Yellow)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {statusCounts.Pending.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Requires review</span>
          </div>
        </div>

        {/* Cancelled - Red */}
        <div 
          onClick={() => { setStatusFilter('Cancelled'); setCurrentPageNum(1); }}
          className={`p-4 sm:p-5 bg-white rounded-2xl border shadow-xs cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'Cancelled' ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-rose-700">Cancelled (Red)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {statusCounts.Cancelled.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Refunded to wallet</span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR & FILTERING SYSTEM */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        {/* Row 1: Search Bar for Order ID and Service Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Search Orders
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID (e.g. #SF-98421) or service name (e.g. Instagram Followers, YouTube)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Status Filtering System (Pending, Processing, Completed, Cancelled) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status:</span>
            </span>

            {/* Filter Pill: All */}
            <button
              onClick={() => { setStatusFilter('All'); setCurrentPageNum(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'All'
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <span>All Orders</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'All' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {statusCounts.All}
              </span>
            </button>

            {/* Filter Pill: Pending */}
            <button
              onClick={() => { setStatusFilter('Pending'); setCurrentPageNum(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'Pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Pending</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'Pending' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {statusCounts.Pending}
              </span>
            </button>

            {/* Filter Pill: Processing */}
            <button
              onClick={() => { setStatusFilter('Processing'); setCurrentPageNum(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'Processing'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-800 border border-teal-200/60 hover:bg-teal-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>Processing</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'Processing' ? 'bg-teal-700 text-white' : 'bg-teal-100 text-teal-800'
              }`}>
                {statusCounts.Processing}
              </span>
            </button>

            {/* Filter Pill: Completed */}
            <button
              onClick={() => { setStatusFilter('Completed'); setCurrentPageNum(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'Completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Completed</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'Completed' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {statusCounts.Completed}
              </span>
            </button>

            {/* Filter Pill: Cancelled */}
            <button
              onClick={() => { setStatusFilter('Cancelled'); setCurrentPageNum(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'Cancelled'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-200/60 hover:bg-rose-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Cancelled</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'Cancelled' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
              }`}>
                {statusCounts.Cancelled}
              </span>
            </button>
          </div>

          {/* Secondary Controls: Platform Filter & Export CSV */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={platformFilter}
              onChange={e => { setPlatformFilter(e.target.value); setCurrentPageNum(1); }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Twitter / X">Twitter / X</option>
              <option value="Facebook">Facebook</option>
              <option value="Telegram">Telegram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Spotify">Spotify</option>
            </select>

            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                title="Reset search and filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Row 3: Status Color Guide for Visual Clarity */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Status Color Guide:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Green = Completed
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300/90">
              <Clock className="w-3 h-3 text-amber-600" />
              Yellow = Pending
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300/80">
              <XCircle className="w-3 h-3 text-rose-600" />
              Red = Cancelled
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300/80">
              <RefreshCw className="w-3 h-3 text-teal-600" />
              Teal = Processing
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Click any order to inspect details & receipt
          </div>
        </div>

        {/* Search Feedback Banner if active */}
        {searchQuery && (
          <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
            <span>
              Showing orders matching: <strong className="font-mono text-emerald-700">"{searchQuery}"</strong> (Found {filteredOrders.length})
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Orders Table (Reference 6) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length > 0 && selectedOrderIds.length === paginatedOrders.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 border-slate-300"
                  />
                </th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Service Details</th>
                <th className="py-3 px-4">Target Link</th>
                <th className="py-3 px-4">Quantity / Charge</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedOrders.map(order => {
                const getStatusRowBorder = (status: string) => {
                  switch (status) {
                    case 'Completed': return 'border-l-4 border-l-emerald-500';
                    case 'Pending': return 'border-l-4 border-l-amber-500';
                    case 'Cancelled':
                    case 'Failed': return 'border-l-4 border-l-rose-500';
                    case 'Processing': return 'border-l-4 border-l-teal-500';
                    case 'In Progress': return 'border-l-4 border-l-blue-500';
                    case 'Refunded': return 'border-l-4 border-l-purple-500';
                    default: return 'border-l-4 border-l-slate-300';
                  }
                };

                const getStatusDot = (status: string) => {
                  switch (status) {
                    case 'Completed': return 'bg-emerald-500 ring-emerald-200';
                    case 'Pending': return 'bg-amber-500 ring-amber-200';
                    case 'Cancelled':
                    case 'Failed': return 'bg-rose-500 ring-rose-200';
                    case 'Processing': return 'bg-teal-500 ring-teal-200';
                    case 'In Progress': return 'bg-blue-500 ring-blue-200';
                    case 'Refunded': return 'bg-purple-500 ring-purple-200';
                    default: return 'bg-slate-400 ring-slate-200';
                  }
                };

                return (
                  <tr 
                    key={order.id} 
                    onClick={() => handleOpenOrder(order)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${getStatusRowBorder(order.status)}`}
                  >
                    <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.includes(order.id)}
                        onChange={() => handleToggleSelect(order.id)}
                        className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 border-slate-300"
                      />
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ring-2 ${getStatusDot(order.status)}`} />
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60">
                          {order.id}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {order.serviceName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span>{order.platform}</span>
                        <span>·</span>
                        <span className="font-mono">ID: {order.serviceId}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[220px]" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-mono text-[11px] text-slate-600" title={order.link}>
                          {order.link}
                        </span>
                        <button
                          onClick={e => handleCopy(order.link, order.id, e)}
                          className="text-slate-400 hover:text-emerald-600 p-1 rounded transition-colors"
                          title="Copy link"
                        >
                          {copiedId === order.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap tabular-nums">
                      <span className="font-bold text-slate-900 block">
                        {order.quantity.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {formatCurrency(order.charge)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px] tabular-nums">
                      {order.createdAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 px-4 bg-white">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">No orders found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {searchQuery 
                ? `No orders matching "${searchQuery}" with status "${statusFilter}".` 
                : `No orders currently found with status "${statusFilter}".`}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleClearFilters}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Reset Search & Filters
              </button>
              <button
                onClick={() => setCurrentPage('new-order')}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Place New Order</span>
              </button>
            </div>
          </div>
        )}

        {/* Pagination Footer (Reference 6) */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <span className="font-bold text-slate-800">{(currentPageNum - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-slate-800">{Math.min(currentPageNum * pageSize, filteredOrders.length)}</span> of{' '}
              <span className="font-bold text-slate-800">{filteredOrders.length}</span> orders
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
                disabled={currentPageNum === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPageNum(pageNum)}
                    className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                      currentPageNum === pageNum
                        ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPageNum === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderReceiptModal
        order={selectedOrderForModal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
