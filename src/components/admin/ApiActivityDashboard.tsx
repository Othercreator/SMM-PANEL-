import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine 
} from 'recharts';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Download, 
  Filter, 
  BarChart3, 
  Layers, 
  Zap, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { generateLast30DaysApiActivity, calculate30DaySummary } from '../../services/apiAnalyticsService';
import { ApiActivityDayStat } from '../../types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomApiTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ApiActivityDayStat;
    return (
      <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-800 text-xs space-y-2 z-50 min-w-[210px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-slate-200">{label} ({data.fullDate})</span>
          <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
            data.successRate >= 98 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {data.successRate}% Success
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Successful Requests:</span>
            </span>
            <span className="font-extrabold tabular-nums text-white">{data.successful.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-rose-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Failed Requests:</span>
            </span>
            <span className="font-extrabold tabular-nums text-white">{data.failed.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/80">
            <span>Total Calls:</span>
            <span className="font-extrabold tabular-nums text-white">{data.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Avg Latency: <strong className="text-sky-300 font-mono">{data.avgLatency}ms</strong></span>
          <span>Backoff Recovered: <strong className="text-emerald-300 font-mono">+{data.retriedRecovered}</strong></span>
        </div>
      </div>
    );
  }
  return null;
};

export const ApiActivityDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30' | '14' | '7'>('30');
  const [chartType, setChartType] = useState<'bar' | 'area' | 'latency'>('bar');
  const [actionFilter, setActionFilter] = useState<'all' | 'orders' | 'status' | 'sync' | 'balance'>('all');

  const all30DaysData = useMemo(() => generateLast30DaysApiActivity(), []);

  // Filter by time range
  const filteredData = useMemo(() => {
    const sliceCount = parseInt(timeRange);
    return all30DaysData.slice(-sliceCount);
  }, [all30DaysData, timeRange]);

  const summary = useMemo(() => calculate30DaySummary(filteredData), [filteredData]);

  // Adjust display numbers based on action filter if selected
  const chartDisplayData = useMemo(() => {
    if (actionFilter === 'all') return filteredData;

    return filteredData.map(d => {
      let multiplier = 1;
      if (actionFilter === 'orders') multiplier = d.ordersCount / d.total;
      else if (actionFilter === 'status') multiplier = d.statusChecksCount / d.total;
      else if (actionFilter === 'sync') multiplier = d.catalogSyncsCount / d.total;
      else if (actionFilter === 'balance') multiplier = d.balanceChecksCount / d.total;

      const total = Math.max(1, Math.round(d.total * multiplier));
      const failed = Math.round(d.failed * multiplier);
      const successful = total - failed;

      return {
        ...d,
        total,
        successful,
        failed,
      };
    });
  }, [filteredData, actionFilter]);

  const handleExportCSV = () => {
    const headers = 'Date,Full Date,Successful,Failed,Total,Success Rate %,Avg Latency (ms),Recovered Via Retries\n';
    const rows = filteredData.map(d => 
      `"${d.date}","${d.fullDate}",${d.successful},${d.failed},${d.total},${d.successRate},${d.avgLatency},${d.retriedRecovered}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indiansmm-api-activity-${timeRange}days-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                IndianSMM API Activity Analytics
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Recharts Telemetry
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing last {timeRange} days of upstream requests, failure telemetry, and exponential backoff recovery
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['30', '14', '7'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === '30' ? 'Last 30 Days' : `${range} Days`}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                chartType === 'bar' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Bar Chart: Success vs Failed"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bars</span>
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                chartType === 'area' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Area Curve Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Area</span>
            </button>
            <button
              onClick={() => setChartType('latency')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                chartType === 'latency' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Latency Trend"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Latency</span>
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 5 Metric Summary KPI Cards for the 30-Day Activity */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Calls */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Total Requests ({timeRange}D)
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {summary.totalRequests30D.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
            Avg {Math.round(summary.totalRequests30D / parseInt(timeRange))} calls / day
          </span>
        </div>

        {/* Successful Calls (Green) */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase text-emerald-800">
              Successful Calls
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-950 tabular-nums">
            {summary.successful30D.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
            {summary.overallSuccessRate}% success rate
          </span>
        </div>

        {/* Failed Calls (Red) */}
        <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase text-rose-800">
              Failed Requests
            </span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-950 tabular-nums">
            {summary.failed30D.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-700 font-semibold block mt-0.5">
            Transient & network drops
          </span>
        </div>

        {/* Retries Auto-Recovered */}
        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase text-teal-800">
              Auto-Recovered
            </span>
            <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-teal-950 tabular-nums">
            {summary.retriesRecovered30D.toLocaleString()}
          </div>
          <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
            Via exponential backoff
          </span>
        </div>

        {/* Average Latency */}
        <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase text-sky-800">
              Average Ping
            </span>
            <Clock className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-sky-950 tabular-nums">
            {summary.avgLatencyMs}ms
          </div>
          <span className="text-[11px] text-sky-700 font-semibold block mt-0.5">
            SSL & upstream TLS 1.3
          </span>
        </div>
      </div>

      {/* Action Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-emerald-600" />
          <span>Action Filter:</span>
        </span>

        <button
          onClick={() => setActionFilter('all')}
          className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
            actionFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Actions (100%)
        </button>

        <button
          onClick={() => setActionFilter('orders')}
          className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
            actionFilter === 'orders'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
          }`}
        >
          Order Placement (`action=add`)
        </button>

        <button
          onClick={() => setActionFilter('status')}
          className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
            actionFilter === 'status'
              ? 'bg-teal-600 text-white'
              : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/60'
          }`}
        >
          Status Check (`action=status`)
        </button>

        <button
          onClick={() => setActionFilter('sync')}
          className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
            actionFilter === 'sync'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/60'
          }`}
        >
          Catalog Sync (`action=services`)
        </button>

        <button
          onClick={() => setActionFilter('balance')}
          className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
            actionFilter === 'balance'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60'
          }`}
        >
          Balance Check (`action=balance`)
        </button>
      </div>

      {/* Main Recharts Visualization Container */}
      <div className="h-80 w-full pt-2">
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartDisplayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip content={<CustomApiTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
              />
              <Bar 
                dataKey="successful" 
                name="Successful Requests (200 OK)" 
                fill="#10b981" 
                stackId="a" 
                radius={[0, 0, 4, 4]} 
              />
              <Bar 
                dataKey="failed" 
                name="Failed Requests (Network/Errors)" 
                fill="#f43f5e" 
                stackId="a" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartDisplayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip content={<CustomApiTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="successful" 
                name="Successful Requests" 
                stroke="#10b981" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorSuccess)" 
              />
              <Area 
                type="monotone" 
                dataKey="failed" 
                name="Failed Requests" 
                stroke="#f43f5e" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorFailed)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartType === 'latency' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartDisplayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
                unit="ms"
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
                domain={[90, 100]}
                unit="%"
              />
              <Tooltip content={<CustomApiTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgLatency" 
                name="Average Response Latency (ms)" 
                stroke="#0284c7" 
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#0284c7' }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="successRate" 
                name="Success Rate % (SLA Target 98%)" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <ReferenceLine yAxisId="right" y={98} stroke="#f59e0b" strokeDasharray="3 3" label="SLA 98%" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend & Interpretation Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">Green = Successful Requests (200 OK)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
            <span className="font-semibold text-slate-700">Red = Failed Requests (Queued for Exponential Retry)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span className="font-semibold text-slate-700">Blue = Latency</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Source: IndianSMM v2 Production Telemetry Pipeline
        </div>
      </div>
    </div>
  );
};
