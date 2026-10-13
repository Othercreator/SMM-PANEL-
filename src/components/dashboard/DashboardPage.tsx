import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Wallet, 
  ShoppingCart, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  LifeBuoy, 
  Code2, 
  BarChart3, 
  Clock, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  Activity,
  Calendar
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1 z-50">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
          <span>{label} ({data.date})</span>
          <span className="text-[10px] text-emerald-400 font-semibold">99.4% SLA</span>
        </div>
        <div className="flex justify-between items-center gap-4 text-blue-300 pt-0.5">
          <span>Total Orders:</span>
          <span className="font-extrabold text-white tabular-nums">{data.orders.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center gap-4 text-emerald-300">
          <span>Completed:</span>
          <span className="font-bold text-white tabular-nums">{data.completed.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
          <span>Delivered Units:</span>
          <span className="font-mono text-slate-200">{data.volume}k</span>
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, 
    formatCurrency, 
    setCurrentPage, 
    setAddFundsModalOpen, 
    orders, 
    services, 
    setSelectedServiceForOrder 
  } = useApp();

  const [chartMetric, setChartMetric] = useState<'orders' | 'completed'>('orders');

  const completedOrdersCount = orders.filter(o => o.status === 'Completed').length;
  const activeOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'In Progress').length;

  // 7-day daily order volume dataset
  const sevenDayOrderData = useMemo(() => {
    const extraOrders = Math.max(0, orders.length - 8);
    return [
      { day: 'Mon', date: 'Oct 06', orders: 184, completed: 179, volume: 142 },
      { day: 'Tue', date: 'Oct 07', orders: 210, completed: 204, volume: 168 },
      { day: 'Wed', date: 'Oct 08', orders: 195, completed: 191, volume: 151 },
      { day: 'Thu', date: 'Oct 09', orders: 242, completed: 238, volume: 198 },
      { day: 'Fri', date: 'Oct 10', orders: 284, completed: 279, volume: 240 },
      { day: 'Sat', date: 'Oct 11', orders: 198, completed: 194, volume: 165 },
      { day: 'Sun', date: 'Oct 12', orders: 220 + extraOrders, completed: 215 + Math.floor(extraOrders * 0.9), volume: 185 + extraOrders * 2 },
    ];
  }, [orders.length]);

  const total7DayOrders = useMemo(() => {
    return sevenDayOrderData.reduce((acc, curr) => acc + curr.orders, 0);
  }, [sevenDayOrderData]);

  const avgDailyOrders = Math.round(total7DayOrders / 7);

  return (
    <div className="space-y-6">
      {/* Welcome Banner (Green-Blue Theme) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-100">
              Welcome Back, {currentUser.name.split(' ')[0].toUpperCase()}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 mb-2">
              Your campaigns are scaling smoothly.
            </h2>
            <p className="text-xs sm:text-sm text-teal-50/90 leading-relaxed">
              You have {activeOrdersCount || 12} active campaigns running across 4 platforms with a 99.4% delivery success rate over the last 30 days.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentPage('new-order')}
              className="px-4 py-2.5 bg-white text-teal-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>

            <button
              onClick={() => setAddFundsModalOpen(true)}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Wallet className="w-4 h-4" />
              <span>Top Up Wallet</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -bottom-10 w-96 bg-gradient-to-l from-white/15 to-transparent pointer-events-none rounded-full blur-2xl transform translate-x-20"></div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {(1482 + orders.length - 8).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* Active Services */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Active Services</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {services.filter(s => s.active).length}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>All clusters operational</span>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Wallet Balance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {formatCurrency(currentUser.balance)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Auto-reload enabled</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">99.4%</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-teal-600 font-semibold">
            <span>Optimal SLA guarantee</span>
          </div>
        </div>
      </div>

      {/* RECHARTS DAILY ORDER VOLUME CHART (LAST 7 DAYS - GREEN BLUE THEME) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Daily Order Volume (Last 7 Days)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive visualization of daily campaign throughput and fulfillment velocity
            </p>
          </div>

          {/* Quick Metrics & Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 py-1.5 px-3 rounded-xl text-xs">
              <span className="text-slate-400 font-medium text-[11px]">7-Day Total:</span>
              <span className="font-extrabold text-slate-900 tabular-nums">{total7DayOrders.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 py-1.5 px-3 rounded-xl text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Avg / Day:</span>
              <span className="font-extrabold text-blue-600 tabular-nums">{avgDailyOrders.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setChartMetric('orders')}
                className={`px-3 py-1 font-bold rounded-lg transition-colors ${
                  chartMetric === 'orders'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Total Orders
              </button>
              <button
                onClick={() => setChartMetric('completed')}
                className={`px-3 py-1 font-bold rounded-lg transition-colors ${
                  chartMetric === 'completed'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed Only
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sevenDayOrderData}
              margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="orderVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="completedVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94A3B8' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey={chartMetric}
                stroke={chartMetric === 'orders' ? '#059669' : '#2563EB'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={chartMetric === 'orders' ? 'url(#orderVolumeGrad)' : 'url(#completedVolumeGrad)'}
                activeDot={{ 
                  r: 6, 
                  fill: chartMetric === 'orders' ? '#059669' : '#2563EB', 
                  stroke: '#ffffff', 
                  strokeWidth: 2 
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 7-Day Day-by-Day Micro Pills */}
        <div className="grid grid-cols-7 gap-2 pt-2 border-t border-slate-100 text-center">
          {sevenDayOrderData.map((d, i) => (
            <div key={d.day} className={`p-2 rounded-xl border text-xs ${i === 6 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50/60 border-slate-100'}`}>
              <span className="text-[10px] text-slate-400 font-semibold block">{d.day}</span>
              <span className="font-extrabold text-slate-900 tabular-nums block mt-0.5">{d.orders}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">{d.completed} done</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Activity Feed</h3>
              <p className="text-xs text-slate-400">Real-time status updates of your latest campaigns</p>
            </div>
            <button
              onClick={() => setCurrentPage('orders')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                    {o.platform.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{o.id}</span>
                      <span className="text-xs text-slate-600 truncate">{o.serviceName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {o.quantity.toLocaleString()} units · {formatCurrency(o.charge)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={o.status} />
                  <span className="text-[11px] text-slate-400 hidden sm:inline tabular-nums">
                    {o.createdAt.split(' ')[1] || 'Today'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Live Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentPage('new-order')}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-emerald-200 hover:bg-emerald-50/40 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">New Order</span>
              </button>

              <button
                onClick={() => setCurrentPage('tickets')}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/40 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 transition-colors">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">Open Ticket</span>
              </button>

              <button
                onClick={() => setCurrentPage('api-docs')}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-teal-200 hover:bg-teal-50/40 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 group-hover:bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-2 transition-colors">
                  <Code2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">API Access</span>
              </button>

              <button
                onClick={() => setCurrentPage('orders')}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-emerald-200 hover:bg-emerald-50/40 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">Reports</span>
              </button>
            </div>
          </div>

          {/* Live Alerts (Reference 5 right bottom) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Live Alerts</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>System Speed Increased</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All Instagram routing servers optimized for 2x faster delivery and immediate start times.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>New TikTok Services Added</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Check out the updated service catalog for high-retention live stream viewers and FYP boosts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
