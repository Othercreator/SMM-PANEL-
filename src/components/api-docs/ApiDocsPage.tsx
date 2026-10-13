import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Code2, 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  Terminal, 
  Play, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const ApiDocsPage: React.FC = () => {
  const { currentUser, setCurrentUser, showToast, services, orders, formatCurrency, setCurrentPage } = useApp();
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'node' | 'python' | 'php'>('curl');
  
  // Interactive API Tester State
  const [testEndpoint, setTestEndpoint] = useState<'services' | 'balance' | 'order_status'>('services');
  const [testOrderId, setTestOrderId] = useState(orders[0]?.id || '#SF-98421');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(currentUser.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `sf_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}`;
    setCurrentUser(prev => ({ ...prev, apiKey: newKey }));
    showToast('New API key generated. Make sure to update your production workers.');
  };

  const handleRunApiTest = () => {
    setIsRunningTest(true);
    setTimeout(() => {
      setIsRunningTest(false);
      if (testEndpoint === 'services') {
        setTestResponse({
          status: 'success',
          count: services.length,
          data: services.slice(0, 3).map(s => ({
            id: s.id,
            name: s.name,
            platform: s.platform,
            rate_per_1000: s.ratePer1000,
            min: s.minQuantity,
            max: s.maxQuantity
          }))
        });
      } else if (testEndpoint === 'balance') {
        setTestResponse({
          status: 'success',
          balance: currentUser.balance,
          currency: 'INR',
          account: currentUser.name,
          email: currentUser.email
        });
      } else {
        const found = orders.find(o => o.id === testOrderId) || orders[0];
        setTestResponse({
          status: 'success',
          order: {
            id: found.id,
            service: found.serviceName,
            status: found.status,
            charge: found.charge,
            start_count: found.startCount,
            remains: found.remains
          }
        });
      }
    }, 400);
  };

  const getCodeSnippet = () => {
    switch (selectedLanguage) {
      case 'curl':
        return `# 1. Place a new order via cURL
curl -X POST https://api.socialflow.io/v2/orders \\
  -H "Authorization: Bearer ${currentUser.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service_id": "#YT-1",
    "link": "https://youtube.com/@channel",
    "quantity": 1000
  }'`;
      case 'node':
        return `// Node.js (Fetch)
const response = await fetch('https://api.socialflow.io/v2/orders', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${currentUser.apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    service_id: '#4002',
    link: 'https://instagram.com/myaccount',
    quantity: 1000
  })
});
const data = await response.json();
console.log(data);`;
      case 'python':
        return `# Python (requests)
import requests

url = "https://api.socialflow.io/v2/orders"
headers = {
    "Authorization": "Bearer ${currentUser.apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "service_id": "#4002",
    "link": "https://instagram.com/myaccount",
    "quantity": 1000
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
      case 'php':
        return `<?php
// PHP cURL
$ch = curl_init('https://api.socialflow.io/v2/orders');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Authorization: Bearer ${currentUser.apiKey}',
  'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'service_id' => '#4002',
  'link' => 'https://instagram.com/myaccount',
  'quantity' => 1000
]));

$response = curl_exec($ch);
curl_close($ch);
print_r(json_decode($response, true));
?>`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 block mb-1">
            Developer Tools
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            REST API v2 Documentation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automate orders, balance inquiries, and service catalogs with sub-50ms programmatic execution.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('api-logs')}
          className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors shadow-2xs"
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>View SMM Provider API Logs →</span>
        </button>
      </div>

      {/* API Key Box */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Production API Key</span>
            </h3>
            <p className="text-xs text-slate-400">Keep this secret. Do not expose this key in public client repositories.</p>
          </div>

          <button
            onClick={handleRegenerateKey}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Key</span>
          </button>
        </div>

        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <input
            type="text"
            readOnly
            value={currentUser.apiKey}
            className="flex-1 bg-transparent font-mono text-xs font-bold text-slate-900 focus:outline-none"
          />
          <button
            onClick={handleCopyKey}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Snippets & Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Snippets (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              <span>Integration Code Snippets</span>
            </h3>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              {(['curl', 'node', 'python', 'php'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase transition-colors ${
                    selectedLanguage === lang ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="relative bg-slate-900 rounded-xl p-4 overflow-x-auto text-xs font-mono text-slate-100 leading-relaxed">
            <pre>{getCodeSnippet()}</pre>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-900 block">Available REST Endpoints</span>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold mr-2 text-[10px]">POST</span>
                  <span className="text-slate-800">/v2/orders</span>
                </div>
                <span className="text-slate-400 text-[11px] font-sans">Dispatch new order</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold mr-2 text-[10px]">GET</span>
                  <span className="text-slate-800">/v2/orders/:id</span>
                </div>
                <span className="text-slate-400 text-[11px] font-sans">Order status & telemetry</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold mr-2 text-[10px]">GET</span>
                  <span className="text-slate-800">/v2/services</span>
                </div>
                <span className="text-slate-400 text-[11px] font-sans">Full catalog & rates</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold mr-2 text-[10px]">GET</span>
                  <span className="text-slate-800">/v2/balance</span>
                </div>
                <span className="text-slate-400 text-[11px] font-sans">Check wallet balance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sandbox Tester (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Interactive Live Sandbox</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              API Live
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Endpoint to Test</label>
              <select
                value={testEndpoint}
                onChange={e => setTestEndpoint(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="services">GET /v2/services</option>
                <option value="balance">GET /v2/balance</option>
                <option value="order_status">GET /v2/orders/:id</option>
              </select>
            </div>

            {testEndpoint === 'order_status' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Order ID</label>
                <input
                  type="text"
                  value={testOrderId}
                  onChange={e => setTestOrderId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            )}

            <button
              onClick={handleRunApiTest}
              disabled={isRunningTest}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunningTest ? 'Sending Request...' : 'Send Live Request'}</span>
            </button>

            {/* Response Console */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                JSON Response (HTTP 200 OK)
              </span>
              <div className="bg-slate-900 rounded-xl p-3.5 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56">
                <pre>
                  {testResponse 
                    ? JSON.stringify(testResponse, null, 2) 
                    : '// Click "Send Live Request" to test endpoint'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
