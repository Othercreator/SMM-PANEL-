import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, UserAccount } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Layers, 
  Activity, 
  RotateCcw, 
  Search, 
  Plus, 
  Edit3, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  Download,
  Trash2,
  X,
  Server
} from 'lucide-react';
import { ApiManagementSection } from './ApiManagementSection';

export const AdminPage: React.FC = () => {
  const { 
    formatCurrency, 
    adminControls, 
    updateAdminControls, 
    usersList, 
    updateUserStatus, 
    adjustUserBalance,
    services, 
    toggleServiceActive, 
    addService,
    orders, 
    transactions, 
    showToast,
    setCurrentPage 
  } = useApp();

  const [adminTab, setAdminTab] = useState<'all' | 'api' | 'users' | 'services'>('all');
  const [analyticsTab, setAnalyticsTab] = useState<'Monthly' | 'Weekly' | 'Daily'>('Monthly');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  
  // Balance adjustment modal
  const [adjustBalanceUser, setAdjustBalanceUser] = useState<UserAccount | null>(null);
  const [newBalanceInput, setNewBalanceInput] = useState<string>('');

  // Add Service Modal
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePlatform, setNewServicePlatform] = useState<Service['platform']>('YouTube');
  const [newServiceRate, setNewServiceRate] = useState(150.00);
  const [newServiceMin, setNewServiceMin] = useState(10);
  const [newServiceMax, setNewServiceMax] = useState(1000000);

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.id.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleFlushCache = () => {
    showToast('Redis & upstream cache successfully flushed. 14 server clusters refreshed.');
  };

  const handleOpenAdjustBalance = (user: UserAccount) => {
    setAdjustBalanceUser(user);
    setNewBalanceInput(user.balance.toString());
  };

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustBalanceUser) return;
    const val = parseFloat(newBalanceInput);
    if (!isNaN(val) && val >= 0) {
      adjustUserBalance(adjustBalanceUser.id, val);
      setAdjustBalanceUser(null);
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    const newId = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const created: Service = {
      id: newId,
      name: newServiceName,
      category: `${newServicePlatform} Growth`,
      platform: newServicePlatform,
      ratePer1000: newServiceRate,
      minQuantity: newServiceMin,
      maxQuantity: newServiceMax,
      description: `High-velocity ${newServicePlatform} campaigns with verified organic retention.`,
      startTime: '0-15 Minutes',
      speed: '10k/day',
      quality: 'Premium Verified',
      refillPolicy: '30 Days Refill',
      averageDropRate: '0-2%',
      linkFormat: `https://${newServicePlatform.toLowerCase().replace(/[^a-z]/g, '')}.com/link`,
      instructions: 'Account or post must be publicly accessible.',
      active: true,
      badgeTag: 'Admin Added'
    };

    addService(created);
    setAddServiceModalOpen(false);
    setNewServiceName('');
  };

  const handleExportAuditCSV = () => {
    const headers = 'Transaction ID,User,Type,Method,Amount,Status,Date\n';
    const rows = transactions.map(tx => 
      `"${tx.id}","Alex Vance","${tx.type}","${tx.method}",${tx.amount},"${tx.status}","${tx.createdAt}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${Date.now()}.csv`;
    a.click();
    showToast('Transaction audit log downloaded.');
  };

  const barData = [
    { label: 'Jan', h: '35%' },
    { label: 'Feb', h: '45%' },
    { label: 'Mar', h: '60%' },
    { label: 'Apr', h: '75%' },
    { label: 'May', h: '85%' },
    { label: 'Jun', h: '100%', active: true }
  ];

  return (
    <div className="space-y-6">
      {/* Top Admin Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Admin Master Console</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage users, catalog services, transactions, and IndianSMM upstream provider synchronization
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setAdminTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              adminTab === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setAdminTab('api')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              adminTab === 'api' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>API Management</span>
            <span className={`px-1.5 py-0.2 text-[9px] font-extrabold rounded-full ${adminTab === 'api' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              IndianSMM
            </span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              adminTab === 'users' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({usersList.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('services')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              adminTab === 'services' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Services ({services.length})</span>
          </button>
        </div>
      </div>
      {/* 4 Top Stats (Reference 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            ₹12,48,290.00
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            +12.4% from last month
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">Active Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            24,892
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            +872 new signups this week
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">Active Orders</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            1,429
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            99.1% completion rate
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">Server Load</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            28.4%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            All nodes operational
          </div>
        </div>
      </div>

      {/* Middle Row: Revenue & Order Analytics + Admin Master Controls (Reference 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Revenue & Order Analytics (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue & Order Analytics</h3>
              <p className="text-xs text-slate-400">Performance overview across all social channels</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['Monthly', 'Weekly', 'Daily'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAnalyticsTab(tab)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                    analyticsTab === tab ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2">
            {barData.map(item => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-32">
                  <div
                    style={{ height: item.h }}
                    className={`w-full max-w-[42px] rounded-t-lg transition-all ${
                      item.active ? 'bg-gradient-to-t from-blue-600 to-emerald-500' : 'bg-emerald-100 hover:bg-emerald-200'
                    }`}
                  ></div>
                </div>
                <span className={`text-xs font-semibold ${item.active ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Master Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">Admin Master Controls</h3>
              <p className="text-xs text-slate-400">Global panel toggles and maintenance states</p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Toggle 1: Maintenance Mode */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">Maintenance Mode</span>
                  <span className="text-[11px] text-slate-500">Disables new orders temporarily</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateAdminControls({ maintenanceMode: !adminControls.maintenanceMode })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    adminControls.maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      adminControls.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Auto-Refill System */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">Auto-Refill System</span>
                  <span className="text-[11px] text-slate-500">Process eligible refill queues automatically</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateAdminControls({ autoRefillSystem: !adminControls.autoRefillSystem })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    adminControls.autoRefillSystem ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      adminControls.autoRefillSystem ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: API Gateways */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">API Gateways</span>
                  <span className="text-[11px] text-slate-500">Connected to 14 upstream providers</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateAdminControls({ apiGateways: !adminControls.apiGateways })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    adminControls.apiGateways ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      adminControls.apiGateways ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => setAdminTab('api')}
              className="flex-1 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
            >
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span>IndianSMM API</span>
            </button>
            <button
              onClick={() => setCurrentPage('api-logs')}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>SMM Logs</span>
            </button>
            <button
              onClick={handleFlushCache}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Flush Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* IndianSMM API Management Section (Visible on 'all' and 'api' tabs) */}
      {(adminTab === 'all' || adminTab === 'api') && (
        <div id="api-management-section">
          <ApiManagementSection />
        </div>
      )}

      {/* User Management Section (Visible on 'all' and 'users' tabs) */}
      {(adminTab === 'all' || adminTab === 'users') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">User Management</h3>
            <p className="text-xs text-slate-400">Manage registered accounts, roles, and balances</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none"
              />
            </div>

            <select
              value={userRoleFilter}
              onChange={e => setUserRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Reseller">Reseller</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{user.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      user.role === 'Admin' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      user.role === 'Reseller' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900 tabular-nums">
                    {formatCurrency(user.balance)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-600 tabular-nums">
                    {formatCurrency(user.spent)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => handleOpenAdjustBalance(user)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg transition-colors"
                    >
                      Balance
                    </button>
                    <button
                      onClick={() => updateUserStatus(user.id, user.status === 'Active' ? 'Suspended' : 'Active')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        user.status === 'Active' 
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* 2 Bottom Cards: Service Moderation & Live Order Monitoring (Visible on 'all' and 'services' tabs) */}
      {(adminTab === 'all' || adminTab === 'services') && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Service Moderation */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Service Moderation</h3>
              <p className="text-xs text-slate-400">Enable/disable catalog products & update prices</p>
            </div>
            <button
              onClick={() => setAddServiceModalOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {services.slice(0, 6).map(s => (
              <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 truncate">{s.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{s.id}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {s.platform} · {formatCurrency(s.ratePer1000)} / 1k
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleServiceActive(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      s.active 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {s.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Order Monitoring */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Order Monitoring</h3>
              <p className="text-xs text-slate-400">Real-time upstream cluster pipeline feed</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-time feed
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Order #98241 • IG Likes</span>
                <span className="text-[11px] text-slate-500">Progress: 4,500 / 5,000 (90%)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">
                Processing
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Order #98240 • TikTok Views</span>
                <span className="text-[11px] text-slate-500">Progress: 50,000 / 50,000 (100%)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                Completed
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Order #98239 • YT Subscribers</span>
                <span className="text-[11px] text-slate-500">Error: Provider API Timeout</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700">
                Failed
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Transaction Audit Log (Visible on 'all' or 'users') */}
      {(adminTab === 'all' || adminTab === 'users') && (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Transaction Audit Log</h3>
            <p className="text-xs text-slate-400">Complete history of financial transfers, deposits, and refunds</p>
          </div>
          <button
            onClick={handleExportAuditCSV}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">TX ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">#TX-884920</td>
                <td className="py-3 px-4 font-semibold text-slate-900">Sarah Jenkins</td>
                <td className="py-3 px-4 text-slate-500">Direct Bank Wire</td>
                <td className="py-3 px-4 font-bold text-emerald-600">+$250.00</td>
                <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">Success</span></td>
                <td className="py-3 px-4 text-slate-400">2 mins ago</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">#TX-884919</td>
                <td className="py-3 px-4 font-semibold text-slate-900">David Chen</td>
                <td className="py-3 px-4 text-slate-500">Corporate Bank Transfer</td>
                <td className="py-3 px-4 font-bold text-emerald-600">+$100.00</td>
                <td className="py-3 px-4"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">Success</span></td>
                <td className="py-3 px-4 text-slate-400">14 mins ago</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">#TX-884918</td>
                <td className="py-3 px-4 font-semibold text-slate-900">Alex Morgan</td>
                <td className="py-3 px-4 text-slate-500">Automated Balance Reversal</td>
                <td className="py-3 px-4 font-bold text-rose-600">-$45.00</td>
                <td className="py-3 px-4"><span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-bold">Refunded</span></td>
                <td className="py-3 px-4 text-slate-400">1 hour ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Adjust Balance Modal */}
      {adjustBalanceUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Adjust Balance for {adjustBalanceUser.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current Balance: {formatCurrency(adjustBalanceUser.balance)}
            </p>

            <form onSubmit={handleSaveBalance} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  New Balance ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newBalanceInput}
                  onChange={e => setNewBalanceInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustBalanceUser(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl shadow-xs"
                >
                  Save Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {addServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Service</h3>
              <button onClick={() => setAddServiceModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instagram Real Likes [Instant]"
                  value={newServiceName}
                  onChange={e => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Platform</label>
                <select
                  value={newServicePlatform}
                  onChange={e => setNewServicePlatform(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Twitter / X">Twitter / X</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Spotify">Spotify</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rate / 1k (₹ INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newServiceRate}
                    onChange={e => setNewServiceRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min Qty</label>
                  <input
                    type="number"
                    required
                    value={newServiceMin}
                    onChange={e => setNewServiceMin(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Qty</label>
                  <input
                    type="number"
                    required
                    value={newServiceMax}
                    onChange={e => setNewServiceMax(parseInt(e.target.value) || 10000)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddServiceModalOpen(false)}
                  className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
