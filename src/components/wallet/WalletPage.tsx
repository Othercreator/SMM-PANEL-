import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType, TransactionStatus } from '../../types';
import { StatusBadge, TransactionTypeBadge } from '../common/StatusBadge';
import { 
  Wallet, 
  Plus, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  ShieldCheck, 
  TrendingDown, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  DollarSign,
  Download,
  Calendar,
  Filter,
  X,
  FileText,
  Clock,
  ArrowUpDown,
  Copy,
  Receipt
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { 
    currentUser, 
    formatCurrency, 
    transactions, 
    setAddFundsModalOpen, 
    currency, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Credit' | 'Debit'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [chartRange, setChartRange] = useState<'6M' | '1Y'>('6M');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [selectedTxForModal, setSelectedTxForModal] = useState<Transaction | null>(null);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);
  const pageSize = 6;

  // Filter & sort transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(tx => {
      const matchesSearch = 
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.toString().includes(searchQuery);

      const matchesType = typeFilter === 'All' || tx.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortOrder === 'highest') return b.amount - a.amount;
      if (sortOrder === 'lowest') return a.amount - b.amount;
      if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0; // default newest as stored
    });

    return result;
  }, [transactions, searchQuery, typeFilter, statusFilter, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPageNum - 1) * pageSize, 
    currentPageNum * pageSize
  );

  // Stats calculation
  const totalCredits = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Credit' && t.status === 'Completed')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalDebits = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Debit' && t.status === 'Completed')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  // Chart data for 6 months
  const chartData6M = [
    { month: 'Nov', spend: 450, deposit: 600, height: '40%' },
    { month: 'Dec', spend: 890, deposit: 950, height: '70%' },
    { month: 'Jan', spend: 520, deposit: 500, height: '48%' },
    { month: 'Feb', spend: 640, deposit: 700, height: '56%' },
    { month: 'Mar', spend: 1100, deposit: 1250, height: '85%' },
    { month: 'Apr', spend: 1240, deposit: 1750, height: '100%', active: true }
  ];

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedTxId(id);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'Transaction ID,Date,Type,Amount,Status,Description,Payment Method\n';
    const rows = filteredTransactions.map(tx => 
      `"${tx.id}","${tx.createdAt}","${tx.type}",${tx.amount},"${tx.status}","${tx.description}","${tx.method}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialflow-statement-${Date.now()}.csv`;
    a.click();
    showToast('Transaction statement downloaded.');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setStatusFilter('All');
    setSortOrder('newest');
    setCurrentPageNum(1);
  };

  const isFiltered = searchQuery !== '' || typeFilter !== 'All' || statusFilter !== 'All' || sortOrder !== 'newest';

  return (
    <div className="space-y-6">
      {/* Top Section: Hero Balance & Quick Stats (Reference 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Large Green-Blue Balance Card (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 rounded-2xl p-6 sm:p-7 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                TOTAL AVAILABLE BALANCE
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                Active Wallet
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black tabular-nums tracking-tight my-2">
              {formatCurrency(currentUser.balance)}
            </div>
          </div>

          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-teal-50/90 space-y-0.5">
              <p>Auto-Recharge: <span className="font-semibold text-white">Enabled (₹500 threshold)</span></p>
              <p>Primary Currency: <span className="font-semibold text-white">INR (₹)</span></p>
            </div>

            <button
              onClick={() => setAddFundsModalOpen(true)}
              className="px-5 py-2.5 bg-white text-teal-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Funds</span>
            </button>
          </div>
        </div>

        {/* 2 Side Stat Cards (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Total Spent This Month</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {formatCurrency(currentUser.spent > 0 ? currentUser.spent : 85200.00)}
            </span>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>12% less than last month</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Total Added Lifetime</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {formatCurrency(145000.00)}
            </span>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              24 Successful Deposits
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Spending & Deposits Overview Chart + Payment Methods (Reference 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Spending & Deposits Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Spending & Deposits Overview</h3>
              <p className="text-xs text-slate-400">Financial activity for the past 6 months</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setChartRange('6M')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  chartRange === '6M' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                6M
              </button>
              <button
                onClick={() => setChartRange('1Y')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  chartRange === '1Y' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1Y
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2">
            {chartData6M.map(item => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative w-full flex items-end justify-center h-32">
                  <div
                    style={{ height: item.height }}
                    className={`w-full max-w-[42px] rounded-t-lg transition-all ${
                      item.active 
                        ? 'bg-gradient-to-t from-blue-600 to-emerald-500 group-hover:from-blue-700 group-hover:to-emerald-600 shadow-sm' 
                        : 'bg-emerald-100 group-hover:bg-emerald-200'
                    }`}
                  ></div>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none tabular-nums z-10">
                    ₹{item.spend * 50}
                  </div>
                </div>
                <span className={`text-xs font-semibold ${item.active ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">Supported Payment Methods</h3>
              <p className="text-xs text-slate-400">Secure Indian payment gateways & direct rails (INR ₹)</p>
            </div>

            <div className="space-y-3">
              {/* Method 1: UPI Instant */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">UPI Instant QR & Apps</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">0% Fees</span>
                    </div>
                    <span className="text-[11px] text-slate-500">PhonePe · GPay · Paytm · BHIM</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">Active</span>
              </div>

              {/* Method 2: Net Banking & IMPS Bank Transfer */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    NB
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Net Banking & IMPS / NEFT</span>
                    <span className="text-[11px] text-slate-500">HDFC, SBI, ICICI, Axis Direct</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-blue-600">Verified</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAddFundsModalOpen(true)}
            className="w-full mt-4 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Top Up Available Balance</span>
          </button>
        </div>
      </div>

      {/* EXTENDED DETAILED TRANSACTION HISTORY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        {/* Header & Quick Summary Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Detailed Transaction History</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive ledger tracking date, amount, type, and transaction verification status
            </p>
          </div>

          {/* Ledger quick metrics */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200/60 text-xs">
              <span className="text-slate-500 text-[10px] block font-semibold uppercase">Total Credits</span>
              <span className="font-extrabold text-emerald-700 tabular-nums">+{formatCurrency(totalCredits)}</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 text-[10px] block font-semibold uppercase">Total Debits</span>
              <span className="font-extrabold text-slate-800 tabular-nums">-{formatCurrency(totalDebits)}</span>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Download CSV Statement"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export Statement</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar: Search + Type Filter + Status Filter + Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID (#TRX), description, or method..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPageNum(1); }}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value as any); setCurrentPageNum(1); }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Types (±)</option>
              <option value="Credit">+ Credit (Deposits)</option>
              <option value="Debit">- Debit (Orders)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPageNum(1); }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Amount</option>
              <option value="lowest">Sort: Lowest Amount</option>
            </select>

            {isFiltered && (
              <button
                onClick={clearFilters}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors text-xs font-semibold shrink-0"
                title="Reset filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Quick Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Quick Filter:
          </span>
          {[
            { id: 'All', label: 'All Transactions', count: transactions.length },
            { id: 'Completed', label: 'Completed', count: transactions.filter(t => t.status === 'Completed').length },
            { id: 'Pending', label: 'Pending', count: transactions.filter(t => t.status === 'Pending').length },
            { id: 'Failed', label: 'Failed', count: transactions.filter(t => t.status === 'Failed').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setStatusFilter(tab.id); setCurrentPageNum(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.id ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* DETAILED TRANSACTION HISTORY TABLE */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description / Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Transaction Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedTransactions.map(tx => (
                  <tr 
                    key={tx.id} 
                    onClick={() => setSelectedTxForModal(tx)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                  >
                    {/* Date Column */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-900 block tabular-nums">
                            {tx.createdAt.split(',')[0]}
                          </span>
                          <span className="text-[11px] text-slate-400 tabular-nums">
                            {tx.createdAt.split(',')[1] || ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Transaction ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60">
                          {tx.id}
                        </span>
                        <button
                          onClick={e => handleCopyId(tx.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 transition-opacity p-0.5"
                          title="Copy ID"
                        >
                          {copiedTxId === tx.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <TransactionTypeBadge type={tx.type} />
                    </td>

                    {/* Description & Method */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <span className="font-semibold text-slate-900 block truncate">
                        {tx.description}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <CreditCard className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{tx.method}</span>
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap tabular-nums">
                      <span className={`text-sm font-bold ${
                        tx.type === 'Credit' 
                          ? 'text-emerald-600' 
                          : 'text-slate-900'
                      }`}>
                        {tx.type === 'Credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Transaction Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={tx.status} />
                    </td>

                    {/* Action View */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedTxForModal(tx); }}
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 rounded-lg transition-colors"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 px-4 bg-white">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No transactions match your filters</p>
              <p className="text-xs text-slate-400 mt-0.5">Try clearing your search keyword or changing status/type.</p>
              <button
                onClick={clearFilters}
                className="mt-3 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{(currentPageNum - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-slate-800">{Math.min(currentPageNum * pageSize, filteredTransactions.length)}</span> of{' '}
            <span className="font-bold text-slate-800">{filteredTransactions.length}</span> recorded transactions
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
              disabled={currentPageNum === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-xs font-medium"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPageNum(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPageNum === p ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPageNum === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details / Receipt Modal */}
      {selectedTxForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Transaction Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedTxForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span className="text-xs text-slate-400 font-semibold uppercase block">Amount Transacted</span>
                <span className={`text-3xl font-black tabular-nums mt-1 block ${
                  selectedTxForModal.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {selectedTxForModal.type === 'Credit' ? '+' : '-'}{formatCurrency(selectedTxForModal.amount)}
                </span>
                <div className="mt-2 inline-flex items-center gap-2">
                  <TransactionTypeBadge type={selectedTxForModal.type} />
                  <StatusBadge status={selectedTxForModal.status} />
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Transaction Reference ID:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedTxForModal.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{selectedTxForModal.createdAt}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Payment Gateway / Source:</span>
                  <span className="font-semibold text-slate-900">{selectedTxForModal.method}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Description:</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[200px]">{selectedTxForModal.description}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Ledger Security Hash:</span>
                  <span className="font-mono text-[10px] text-slate-400">0x7f4b8... verified</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTxForModal.id);
                    showToast(`Copied ${selectedTxForModal.id}`);
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </button>
                <button
                  onClick={() => setSelectedTxForModal(null)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
