import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SmmApiLog } from '../../types';
import { 
  Activity, 
  Search, 
  Filter, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Play, 
  Send, 
  Server, 
  Wifi, 
  Code, 
  Layers, 
  ExternalLink, 
  Eye, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronDown, 
  Terminal, 
  ShieldAlert,
  Zap,
  Radio,
  FileJson,
  RotateCcw,
  X
} from 'lucide-react';

export const ApiLogsPage: React.FC = () => {
  const { apiLogs, addApiLog, clearApiLogs, showToast, setCurrentPage } = useApp();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '2xx' | '4xx' | '5xx' | 'slow'>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [latencyFilter, setLatencyFilter] = useState<'all' | 'fast' | 'moderate' | 'high'>('all');

  // Selected Log for Inspection Modal
  const [selectedLog, setSelectedLog] = useState<SmmApiLog | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Live Auto-Refresh simulation state
  const [autoRefreshActive, setAutoRefreshActive] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Test Dispatch Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testProvider, setTestProvider] = useState<'peakerr' | 'secsers' | 'hqsmart' | 'jap'>('peakerr');
  const [testAction, setTestAction] = useState<'status' | 'balance' | 'services' | 'add'>('status');
  const [testOrderId, setTestOrderId] = useState('9941024');
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);

  // Clear confirmation modal
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  // Copy helper
  const handleCopyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    showToast('Copied to clipboard!');
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  // Live auto-refresh background simulation (every 12 seconds if active)
  useEffect(() => {
    if (!autoRefreshActive) return;

    const interval = setInterval(() => {
      // Simulate periodic upstream background worker status check
      const providers = [
        { name: 'Secsers Direct SMM', id: 'secsers-v2', url: 'https://secsers.com/api/v2' },
        { name: 'Peakerr Primary API', id: 'peakerr-v2', url: 'https://api.peakerr.com/v2' },
        { name: 'HQSmartPanel Asia', id: 'hqsmart-v2', url: 'https://api.hqsmartpanel.io/v2' }
      ];
      const p = providers[Math.floor(Math.random() * providers.length)];
      const randomOrder = Math.floor(881900 + Math.random() * 500);
      const latency = Math.floor(75 + Math.random() * 95);

      const backgroundLog: SmmApiLog = {
        id: `LOG-${Math.floor(79050 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        providerName: p.name,
        providerId: p.id,
        endpoint: p.url,
        action: 'status',
        httpMethod: 'POST',
        httpStatus: 200,
        statusText: 'OK',
        latencyMs: latency,
        timing: {
          dnsMs: 8,
          tlsMs: 18,
          ttfbMs: latency - 30,
          transferMs: 6
        },
        internalOrderId: `#SF-${Math.floor(98400 + Math.random() * 30)}`,
        providerOrderId: randomOrder.toString(),
        ipAddress: '198.51.100.42',
        workerNode: 'worker-us-east-1a',
        requestHeaders: {
          'User-Agent': 'SocialFlow-Worker/2.4 (Status Poll)',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        requestPayload: {
          key: 'sf_live_********************710b',
          action: 'status',
          order: randomOrder.toString()
        },
        responseHeaders: {
          'content-type': 'application/json',
          'x-ratelimit-remaining': '992'
        },
        responseBody: {
          status: Math.random() > 0.3 ? 'In progress' : 'Completed',
          charge: (Math.random() * 4 + 1).toFixed(2),
          start_count: Math.floor(Math.random() * 1000 + 100).toString(),
          remains: Math.floor(Math.random() * 200).toString(),
          currency: 'USD'
        },
        retryCount: 0
      };

      addApiLog(backgroundLog);
    }, 12000);

    return () => clearInterval(interval);
  }, [autoRefreshActive, addApiLog]);

  // Distinct providers list
  const availableProviders = useMemo(() => {
    const set = new Set<string>();
    apiLogs.forEach(l => set.add(l.providerName));
    return Array.from(set);
  }, [apiLogs]);

  // Filtered logs calculation
  const filteredLogs = useMemo(() => {
    return apiLogs.filter(log => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          log.id.toLowerCase().includes(query) ||
          log.providerName.toLowerCase().includes(query) ||
          log.endpoint.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.httpStatus.toString().includes(query) ||
          (log.internalOrderId && log.internalOrderId.toLowerCase().includes(query)) ||
          (log.providerOrderId && log.providerOrderId.toLowerCase().includes(query)) ||
          (log.serviceName && log.serviceName.toLowerCase().includes(query)) ||
          JSON.stringify(log.requestPayload).toLowerCase().includes(query) ||
          JSON.stringify(log.responseBody).toLowerCase().includes(query);

        if (!matchesQuery) return false;
      }

      // Status filter
      if (statusFilter === '2xx' && (log.httpStatus < 200 || log.httpStatus >= 300)) return false;
      if (statusFilter === '4xx' && (log.httpStatus < 400 || log.httpStatus >= 500)) return false;
      if (statusFilter === '5xx' && log.httpStatus < 500) return false;
      if (statusFilter === 'slow' && log.latencyMs < 300) return false;

      // Provider filter
      if (providerFilter !== 'all' && log.providerName !== providerFilter) return false;

      // Action filter
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;

      // Latency filter
      if (latencyFilter === 'fast' && log.latencyMs >= 150) return false;
      if (latencyFilter === 'moderate' && (log.latencyMs < 150 || log.latencyMs > 500)) return false;
      if (latencyFilter === 'high' && log.latencyMs <= 500) return false;

      return true;
    });
  }, [apiLogs, searchQuery, statusFilter, providerFilter, actionFilter, latencyFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = apiLogs.length;
    if (total === 0) {
      return { total: 0, avgLatency: 0, p95Latency: 0, successRate: 100, errorCount: 0 };
    }

    const latencies = [...apiLogs].map(l => l.latencyMs).sort((a, b) => a - b);
    const sumLatency = latencies.reduce((acc, v) => acc + v, 0);
    const avgLatency = Math.round(sumLatency / total);
    const p95Index = Math.min(Math.floor(latencies.length * 0.95), latencies.length - 1);
    const p95Latency = latencies[p95Index] || avgLatency;

    const successCount = apiLogs.filter(l => l.httpStatus >= 200 && l.httpStatus < 300).length;
    const errorCount = apiLogs.filter(l => l.httpStatus >= 400).length;
    const successRate = Math.round((successCount / total) * 1000) / 10;

    return { total, avgLatency, p95Latency, successRate, errorCount };
  }, [apiLogs]);

  // Handle Manual Refresh
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('API logs synced with provider cluster.');
    }, 600);
  };

  // Handle CSV Export
  const handleExportCsv = () => {
    if (filteredLogs.length === 0) {
      showToast('No logs to export.');
      return;
    }

    const headers = [
      'Log ID',
      'Timestamp',
      'Provider',
      'Endpoint',
      'Action',
      'HTTP Status',
      'Latency (ms)',
      'Internal Order',
      'Provider Order',
      'Payload',
      'Response'
    ];

    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.providerName}"`,
      `"${l.endpoint}"`,
      `"${l.action}"`,
      l.httpStatus,
      l.latencyMs,
      `"${l.internalOrderId || ''}"`,
      `"${l.providerOrderId || ''}"`,
      `"${JSON.stringify(l.requestPayload).replace(/"/g, '""')}"`,
      `"${JSON.stringify(l.responseBody).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smm_api_logs_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported API logs to CSV successfully.');
  };

  // Submit Interactive Test Dispatch
  const handleExecuteTestCall = () => {
    setIsSubmittingTest(true);
    const start = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start + 80 + Math.random() * 90);
      setIsSubmittingTest(false);
      setTestModalOpen(false);

      let providerName = 'Peakerr Primary API';
      let endpoint = 'https://api.peakerr.com/v2';
      let providerId = 'peakerr-v2';

      if (testProvider === 'secsers') {
        providerName = 'Secsers Direct SMM';
        endpoint = 'https://secsers.com/api/v2';
        providerId = 'secsers-v2';
      } else if (testProvider === 'hqsmart') {
        providerName = 'HQSmartPanel Asia';
        endpoint = 'https://api.hqsmartpanel.io/v2';
        providerId = 'hqsmart-v2';
      } else if (testProvider === 'jap') {
        providerName = 'JustAnotherPanel v2';
        endpoint = 'https://justanotherpanel.com/api/v2';
        providerId = 'jap-v2';
      }

      let payload: Record<string, any> = {
        key: 'sf_live_********************test',
        action: testAction
      };
      let responseBody: Record<string, any> = {};

      if (testAction === 'status') {
        payload.order = testOrderId;
        responseBody = {
          charge: '2.40',
          start_count: '512',
          status: 'In progress',
          remains: '140',
          currency: 'USD'
        };
      } else if (testAction === 'balance') {
        responseBody = {
          balance: '1,420.75',
          currency: 'USD',
          rate: '1.0'
        };
      } else if (testAction === 'services') {
        responseBody = {
          status: 'success',
          services_synced: 618,
          catalog_version: 'v2.8'
        };
      } else if (testAction === 'add') {
        payload = {
          ...payload,
          service: '1402',
          link: 'https://youtube.com/watch?v=sampleTestVideo',
          quantity: 1000
        };
        responseBody = {
          order: Math.floor(9000000 + Math.random() * 999999),
          charge: '3.60',
          currency: 'USD',
          status: 'Pending'
        };
      }

      const newLog: SmmApiLog = {
        id: `LOG-${Math.floor(79100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        providerName,
        providerId,
        endpoint,
        action: testAction,
        httpMethod: 'POST',
        httpStatus: 200,
        statusText: 'OK',
        latencyMs: elapsed,
        timing: {
          dnsMs: 12,
          tlsMs: 24,
          ttfbMs: elapsed - 25,
          transferMs: 9
        },
        providerOrderId: testAction === 'status' ? testOrderId : undefined,
        ipAddress: '198.51.100.42',
        workerNode: 'test-runner-local',
        requestHeaders: {
          'User-Agent': 'SocialFlow-Worker/2.4 (Manual Probe)',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        requestPayload: payload,
        responseHeaders: {
          'server': 'cloudflare',
          'content-type': 'application/json; charset=utf-8',
          'x-probe-test': 'true'
        },
        responseBody,
        retryCount: 0
      };

      addApiLog(newLog);
      showToast(`Test request to ${providerName} completed in ${elapsed}ms!`);
      setSelectedLog(newLog);
    }, 700);
  };

  // Replay an existing log
  const handleReplayLog = (log: SmmApiLog) => {
    showToast(`Replaying outgoing request to ${log.providerName}...`);
    setTimeout(() => {
      const elapsed = Math.round(log.latencyMs * (0.85 + Math.random() * 0.3));
      const replayedLog: SmmApiLog = {
        ...log,
        id: `LOG-${Math.floor(79200 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        latencyMs: elapsed,
        timing: {
          dnsMs: log.timing.dnsMs,
          tlsMs: log.timing.tlsMs,
          ttfbMs: Math.max(10, elapsed - 20),
          transferMs: log.timing.transferMs
        }
      };
      addApiLog(replayedLog);
      setSelectedLog(replayedLog);
      showToast(`Replayed request successfully! Latency: ${elapsed}ms.`);
    }, 500);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setProviderFilter('all');
    setActionFilter('all');
    setLatencyFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || providerFilter !== 'all' || actionFilter !== 'all' || latencyFilter !== 'all';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Developer Tools</span>
            <span aria-hidden="true">·</span>
            <span>Upstream Integration</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-semibold">Outgoing SMM Provider Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Server className="w-7 h-7 text-emerald-600 shrink-0" />
            <span>SMM Provider API Logs</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Audit live outgoing HTTP requests dispatched to upstream SMM panel APIs, inspect complete request payloads, verify HTTP response codes, and analyze latency metrics.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Live stream toggle */}
          <button
            onClick={() => {
              setAutoRefreshActive(!autoRefreshActive);
              showToast(autoRefreshActive ? 'Live auto-refresh paused.' : 'Live auto-refresh resumed.');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              autoRefreshActive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80' 
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
            title="Toggle live simulated background polling"
          >
            <span className={`w-2 h-2 rounded-full ${autoRefreshActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{autoRefreshActive ? 'Live Stream: ON' : 'Live Stream: Paused'}</span>
          </button>

          {/* Test Call button */}
          <button
            onClick={() => setTestModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Test Provider Dispatch</span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Manual Refresh button */}
          <button
            onClick={handleManualRefresh}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Clear Logs */}
          <button
            onClick={() => setClearConfirmOpen(true)}
            className="p-2 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/90 hover:border-rose-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            title="Clear logs buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Latency & Reliability Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Outgoing Requests */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Total Dispatches</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {stats.total.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">Active Workers</span>
              <span aria-hidden="true">·</span>
              <span>Cluster healthy</span>
            </div>
          </div>
        </div>

        {/* Average Latency */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Average Latency</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono flex items-baseline gap-1">
              <span>{stats.avgLatency}</span>
              <span className="text-sm font-sans font-medium text-slate-500">ms</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
              <span>P95: {stats.p95Latency}ms</span>
              <span aria-hidden="true" className="font-sans">·</span>
              <span className={stats.avgLatency < 250 ? 'text-emerald-600 font-sans font-medium' : 'text-amber-600 font-sans font-medium'}>
                {stats.avgLatency < 250 ? 'Fast' : 'Moderate'}
              </span>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Provider Success Rate</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight font-mono">
              {stats.successRate}%
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>HTTP 2xx Acknowledged</span>
            </div>
          </div>
        </div>

        {/* Error / Timeout Count */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Errors & Timeouts</span>
            <span className={`p-1.5 rounded-lg ${stats.errorCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${stats.errorCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {stats.errorCount}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {stats.errorCount > 0 ? (
                <button
                  onClick={() => setStatusFilter('4xx')}
                  className="text-rose-600 font-semibold hover:underline"
                >
                  View Errored Requests →
                </button>
              ) : (
                <span className="text-slate-400">Zero error rate in current buffer</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Search & Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Log ID, Provider, URL, Action, Order ID (#SF-...), payload param, or error code..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Status Buttons (Interactive Segmented Filter) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({apiLogs.length})
            </button>
            <button
              onClick={() => setStatusFilter('2xx')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === '2xx'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              2xx Success
            </button>
            <button
              onClick={() => setStatusFilter('4xx')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === '4xx'
                  ? 'bg-amber-600 text-white shadow-2xs font-bold'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              4xx Client Error
            </button>
            <button
              onClick={() => setStatusFilter('5xx')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === '5xx'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-rose-800 hover:bg-rose-50'
              }`}
            >
              5xx Provider Error
            </button>
            <button
              onClick={() => setStatusFilter('slow')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'slow'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-blue-800 hover:bg-blue-50'
              }`}
            >
              Slow (&gt;300ms)
            </button>
          </div>
        </div>

        {/* Secondary Filters Dropdown Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Provider:</span>
            <select
              value={providerFilter}
              onChange={e => setProviderFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            >
              <option value="all">All Providers ({availableProviders.length})</option>
              {availableProviders.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Action:</span>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500 focus:bg-white font-mono"
            >
              <option value="all">All Actions</option>
              <option value="add">add (Order Create)</option>
              <option value="status">status (Check Order)</option>
              <option value="refill">refill (Refill Request)</option>
              <option value="balance">balance (Provider Sync)</option>
              <option value="services">services (Catalog Sync)</option>
            </select>
          </div>

          {/* Latency Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Latency:</span>
            <select
              value={latencyFilter}
              onChange={e => setLatencyFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            >
              <option value="all">All Latencies</option>
              <option value="fast">&lt; 150ms (Ultra Fast)</option>
              <option value="moderate">150ms - 500ms (Normal)</option>
              <option value="high">&gt; 500ms (High Latency)</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="ml-auto px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Outgoing Dispatches
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredLogs.length} of {apiLogs.length} logs)
            </span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="hidden sm:inline">Click any row to inspect complete payload & headers</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No outgoing API logs found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {hasActiveFilters
                ? 'Try broadening your search criteria or resetting applied status and provider filters.'
                : 'No outgoing provider requests have been logged yet. Place an order or click Test Provider Dispatch above.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Log ID & Time</th>
                  <th className="py-3 px-4">Provider & URL</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">HTTP Status</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Associated Order</th>
                  <th className="py-3 px-4">Payload Summary</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => {
                  const isSuccess = log.httpStatus >= 200 && log.httpStatus < 300;
                  const isClientError = log.httpStatus >= 400 && log.httpStatus < 500;
                  const isServerError = log.httpStatus >= 500;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-emerald-50/30 transition-colors cursor-pointer group"
                    >
                      {/* Log ID & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {log.id}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {log.timestamp.split(' ')[1]}
                        </div>
                      </td>

                      {/* Provider & Endpoint */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{log.providerName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[180px] mt-0.5" title={log.endpoint}>
                          {log.endpoint}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono px-2 py-0.5 rounded-md font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                          {log.httpMethod}
                        </span>
                      </td>

                      {/* HTTP Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isSuccess && (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{log.httpStatus} {log.statusText}</span>
                          </span>
                        )}
                        {isClientError && (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{log.httpStatus} {log.statusText}</span>
                          </span>
                        )}
                        {isServerError && (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>{log.httpStatus} {log.statusText}</span>
                          </span>
                        )}
                      </td>

                      {/* Latency */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            log.latencyMs < 150 ? 'bg-emerald-500' :
                            log.latencyMs < 500 ? 'bg-blue-500' : 'bg-amber-500'
                          }`} />
                          <span className="font-mono font-bold text-slate-800">
                            {log.latencyMs}ms
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          TTFB: {log.timing.ttfbMs}ms
                        </div>
                      </td>

                      {/* Associated Order */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.internalOrderId ? (
                          <div>
                            <span className="font-mono font-bold text-blue-700 hover:underline">
                              {log.internalOrderId}
                            </span>
                            {log.serviceName && (
                              <div className="text-[11px] text-slate-500 truncate max-w-[140px]" title={log.serviceName}>
                                {log.serviceName}
                              </div>
                            )}
                          </div>
                        ) : log.providerOrderId ? (
                          <div className="font-mono text-slate-600">
                            P-Order #{log.providerOrderId}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">System Call</span>
                        )}
                      </td>

                      {/* Payload Summary */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="truncate font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200/60" title={JSON.stringify(log.requestPayload)}>
                          {Object.entries(log.requestPayload)
                            .filter(([k]) => k !== 'key')
                            .map(([k, v]) => `${k}:${v}`)
                            .join(' ')}
                        </div>
                      </td>

                      {/* Inspect Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Inspection Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Top Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-extrabold text-slate-900">
                  {selectedLog.id}
                </span>
                <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                  selectedLog.httpStatus >= 200 && selectedLog.httpStatus < 300
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedLog.httpStatus >= 400 && selectedLog.httpStatus < 500
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedLog.httpStatus} {selectedLog.statusText}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedLog.latencyMs}ms
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReplayLog(selectedLog)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Re-send this exact request to provider"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Call</span>
                </button>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
              {/* Endpoint & Overview Grid */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Provider:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedLog.providerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Endpoint URL:</span>
                  <span className="font-mono font-bold text-slate-800 break-all">{selectedLog.endpoint}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Action / Method:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedLog.httpMethod} {selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Timestamp:</span>
                  <span className="font-mono text-slate-800">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Internal Order ID:</span>
                  <span className="font-mono font-semibold text-blue-700">
                    {selectedLog.internalOrderId || 'None (System Poll)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Worker Node & IP:</span>
                  <span className="font-mono text-slate-800">
                    {selectedLog.workerNode} ({selectedLog.ipAddress})
                  </span>
                </div>
              </div>

              {/* Latency Waterfall Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Latency Waterfall Metrics</span>
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">Total: {selectedLog.latencyMs}ms</span>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 font-mono text-xs">
                  {/* Progress bar waterfall segments */}
                  <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden">
                    <div 
                      style={{ width: `${Math.max(5, (selectedLog.timing.dnsMs / selectedLog.latencyMs) * 100)}%` }} 
                      className="bg-blue-500 h-full" 
                      title={`DNS: ${selectedLog.timing.dnsMs}ms`}
                    />
                    <div 
                      style={{ width: `${Math.max(5, (selectedLog.timing.tlsMs / selectedLog.latencyMs) * 100)}%` }} 
                      className="bg-teal-500 h-full" 
                      title={`TLS: ${selectedLog.timing.tlsMs}ms`}
                    />
                    <div 
                      style={{ width: `${Math.max(5, (selectedLog.timing.ttfbMs / selectedLog.latencyMs) * 100)}%` }} 
                      className="bg-emerald-500 h-full" 
                      title={`TTFB: ${selectedLog.timing.ttfbMs}ms`}
                    />
                    <div 
                      style={{ width: `${Math.max(5, (selectedLog.timing.transferMs / selectedLog.latencyMs) * 100)}%` }} 
                      className="bg-amber-500 h-full" 
                      title={`Transfer: ${selectedLog.timing.transferMs}ms`}
                    />
                  </div>

                  {/* Legend values */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      <span>DNS: {selectedLog.timing.dnsMs}ms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                      <span>TLS: {selectedLog.timing.tlsMs}ms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>TTFB: {selectedLog.timing.ttfbMs}ms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <span>Transfer: {selectedLog.timing.transferMs}ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Payload Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-blue-600" />
                    <span>Outgoing Request Payload</span>
                  </span>
                  <button
                    onClick={() => handleCopyText(JSON.stringify(selectedLog.requestPayload, null, 2), 'payload')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copiedSection === 'payload' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'payload' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-slate-800">
                  {JSON.stringify(selectedLog.requestPayload, null, 2)}
                </pre>
              </div>

              {/* Request Headers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Outgoing Headers</span>
                  <button
                    onClick={() => handleCopyText(JSON.stringify(selectedLog.requestHeaders, null, 2), 'req-headers')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copiedSection === 'req-headers' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                  {Object.entries(selectedLog.requestHeaders).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-100/80 pb-0.5">
                      <span className="font-semibold text-slate-900">{k}:</span>
                      <span className="text-slate-600">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Body Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    <span>Upstream Response Body</span>
                  </span>
                  <button
                    onClick={() => handleCopyText(JSON.stringify(selectedLog.responseBody, null, 2), 'response')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copiedSection === 'response' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'response' ? 'Copied' : 'Copy Response'}</span>
                  </button>
                </div>

                <pre className={`p-4 font-mono text-xs rounded-2xl overflow-x-auto border ${
                  selectedLog.httpStatus >= 400
                    ? 'bg-rose-950/90 text-rose-300 border-rose-900'
                    : 'bg-slate-900 text-cyan-300 border-slate-800'
                }`}>
                  {JSON.stringify(selectedLog.responseBody, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const curl = `curl -X POST "${selectedLog.endpoint}" \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d '${new URLSearchParams(selectedLog.requestPayload).toString()}'`;
                  handleCopyText(curl, 'curl');
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedSection === 'curl' ? 'cURL Copied!' : 'Copy cURL Command'}</span>
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Provider Dispatch Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <span>Test Outgoing SMM Provider Request</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Send a live probe to measure actual roundtrip latency and inspect provider JSON acknowledgment.
                </p>
              </div>
              <button
                onClick={() => setTestModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Provider selection */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Target SMM Provider</label>
                <select
                  value={testProvider}
                  onChange={e => setTestProvider(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="peakerr">Peakerr Primary API (https://api.peakerr.com/v2)</option>
                  <option value="secsers">Secsers Direct SMM (https://secsers.com/api/v2)</option>
                  <option value="hqsmart">HQSmartPanel Asia (https://api.hqsmartpanel.io/v2)</option>
                  <option value="jap">JustAnotherPanel v2 (https://justanotherpanel.com/api/v2)</option>
                </select>
              </div>

              {/* Action selection */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">SMM Action</label>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {(['status', 'balance', 'services', 'add'] as const).map(act => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setTestAction(act)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                        testAction === act
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>action = {act}</span>
                      <span className="block text-[10px] font-sans font-normal text-slate-500 mt-0.5">
                        {act === 'status' && 'Query single order status'}
                        {act === 'balance' && 'Sync remaining funds'}
                        {act === 'services' && 'Full catalog fetch'}
                        {act === 'add' && 'Create new order test'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order ID input if status */}
              {testAction === 'status' && (
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Provider Order ID</label>
                  <input
                    type="text"
                    value={testOrderId}
                    onChange={e => setTestOrderId(e.target.value)}
                    placeholder="e.g. 9941024"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingTest}
                onClick={handleExecuteTestCall}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmittingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Outgoing Probe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Logs Confirmation Modal */}
      {clearConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Clear Outgoing API Logs?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to clear all {apiLogs.length} logged outgoing requests? Historical records will be removed from your current local session buffer.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setClearConfirmOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearApiLogs();
                  setClearConfirmOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                Yes, Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
