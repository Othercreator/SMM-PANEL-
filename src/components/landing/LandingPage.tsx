import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  Play, 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  TrendingUp,
  Users,
  Check
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, setIsLoggedIn, setAuthModalOpen, setAuthModalMode, isLoggedIn } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      setCurrentPage('dashboard');
    } else {
      setAuthModalMode('register');
      setAuthModalOpen(true);
    }
  };

  const handleSignIn = () => {
    if (isLoggedIn) {
      setCurrentPage('dashboard');
    } else {
      setAuthModalMode('login');
      setAuthModalOpen(true);
    }
  };

  const faqs = [
    {
      q: 'Can I try SocialFlow before committing?',
      a: 'Yes! You can explore our live services catalog, generate test API keys, and start with minimal orders starting as low as ₹10.00. No monthly lock-in or subscription commitments.'
    },
    {
      q: 'Which social networks and platforms are supported?',
      a: 'We natively support Instagram, TikTok, YouTube, Twitter / X, Telegram, Facebook, LinkedIn, and Spotify, with custom endpoints available for Threads and Twitch.'
    },
    {
      q: 'Can I manage multi-brand agency workspaces?',
      a: 'Absolutely. SocialFlow Pro accounts support unlimited workspaces, custom sub-accounts, white-label API keys, and tiered volume discounts for resellers and digital marketing agencies.'
    },
    {
      q: 'How fast is campaign delivery and order processing?',
      a: 'Over 92% of services initiate instantly within 0–15 minutes. Our server cluster balances order volume across redundant upstream nodes to maintain guaranteed fulfillment.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract (3 zones) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
              Social<span className="text-emerald-600">Flow</span>
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0">Features</a>
            <button onClick={() => { setCurrentPage('services'); }} className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0">Services</button>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0">How It Works</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0">FAQ</a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSignIn}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>{isLoggedIn ? 'Go to Dashboard' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/80 text-xs font-semibold text-emerald-700 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Next-Generation Social Media Growth Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight mb-6">
            Scale Your Social Media Presence Effortlessly
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Accelerate publishing, deep-dive analytics, and dispatch high-velocity engagement across every major network from a single, high-performance command center.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('services')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-slate-400 fill-slate-400" />
              <span>Explore Services</span>
            </button>
          </div>

          {/* Hero Dashboard Preview Card (Reference 3 graphic) */}
          <div className="relative max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 text-left">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 text-white flex items-center justify-center font-bold">
                  SF
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Campaign Acceleration Hub</h4>
                  <p className="text-xs text-slate-400">Real-time distribution telemetry</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  Cluster Operational
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Global Reach</span>
                <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">2.4M+</p>
                <span className="text-[11px] text-emerald-600 font-semibold">↑ +18.4% this week</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Active Campaigns</span>
                <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">48 Active</p>
                <span className="text-[11px] text-blue-600 font-semibold">14 upstream nodes</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Average Delivery</span>
                <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">&lt; 15m</p>
                <span className="text-[11px] text-emerald-600 font-semibold">Ultra low latency</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Success Rate</span>
                <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">99.4%</p>
                <span className="text-[11px] text-slate-500 font-semibold">Automated refills</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-xs sm:text-sm font-semibold text-emerald-950">
                  Campaign Launch Q1: High-Retention Instagram & TikTok Routing
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200">
                Dispatching Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Client Logos */}
      <section className="py-10 border-y border-slate-200/60 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Trusted by modern growth agencies & 25,000+ creators worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70">
            <span className="text-base font-extrabold tracking-tight text-slate-700 font-sans">AcmeCorp</span>
            <span className="text-base font-extrabold tracking-tight text-slate-700 font-sans">GlobalPulse</span>
            <span className="text-base font-extrabold tracking-tight text-slate-700 font-sans">VexuraStack</span>
            <span className="text-base font-extrabold tracking-tight text-slate-700 font-sans">PixelCraft</span>
            <span className="text-base font-extrabold tracking-tight text-slate-700 font-sans">Momentum</span>
          </div>
        </div>
      </section>

      {/* Features: Everything you need to dominate social */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            Everything you need to dominate social
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-14 text-base">
            Engineered with deep API routing, instant automated refill triggers, and complete financial transparent auditing.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Auto-Scheduling</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Configure organic drip feeds, specify target speeds per day, and deliver natural social momentum without triggering platform flags.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Advanced Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Monitor start counts, drop-rate telemetry, remain counters, and fulfillment logs in real time with 100% transparent audit reporting.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Unified Inbox & API</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automate your entire agency workflow using our REST API v2. Connect your CRM, generate keys, and trigger orders in milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Steps */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            Get started in three simple steps
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-14 text-sm">
            Launch scalable campaigns in seconds without technical complexity.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-3xl font-black text-emerald-600 tabular-nums">01</span>
              <h4 className="text-base font-bold text-slate-900 mt-3 mb-2">Choose Service & Platform</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select from over 1,420+ verified services across Instagram, TikTok, YouTube, and X with instant pricing and speed guarantees.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-3xl font-black text-blue-600 tabular-nums">02</span>
              <h4 className="text-base font-bold text-slate-900 mt-3 mb-2">Enter Link & Quantity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste your target profile or post link, choose your preferred quantity, and preview real-time automated total charge calculations.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-3xl font-black text-teal-600 tabular-nums">03</span>
              <h4 className="text-base font-bold text-slate-900 mt-3 mb-2">Track & Accelerate</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch delivery commence within minutes with automated order status updates, start count tracking, and 30-day refill protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Section: Designed to save you 15+ hours */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Built For Scale</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-6">
                Designed to save you 15+ hours every week
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-sm">
                Stop juggling multiple disconnected vendors and unreliable scripts. SocialFlow centralizes automated order routing, wallet reconciliations, and ticket support into one cohesive portal.
              </p>

              <div className="space-y-4">
                {[
                  'Automated 30-day refill triggers with one click',
                  'Instant REST API integration for resellers and automation scripts',
                  'Instant Indian Rupee (₹ INR) payments via UPI QR, Apps & Net Banking',
                  'Atomic database transactions preventing balance overdrafts or duplicate debits'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200/80 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live System Telemetry</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">v2.4 Core</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Dispatch Queue:</span>
                  <span className="text-emerald-600 font-bold">1,429 Orders Processing</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">API Latency:</span>
                  <span className="text-blue-600 font-bold tabular-nums">28ms average</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Cluster Uptime:</span>
                  <span className="text-slate-900 font-bold tabular-nums">99.98% 30-Day SLA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm">Everything you need to know about SocialFlow Panel.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-slate-900 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors text-sm"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-3">
            Ready to scale your social media presence?
          </h2>
          <p className="text-emerald-50 mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Join thousands of marketers, agency owners, and content creators taking advantage of instant automated social distributions.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-white text-teal-800 font-extrabold rounded-xl shadow-lg hover:bg-slate-50 transition-all text-sm"
          >
            Start Your Free Trial Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-500 text-white flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-white font-extrabold text-base">SocialFlow</span>
            </div>
            <div className="flex gap-6">
              <button onClick={() => setCurrentPage('services')} className="hover:text-white transition-colors">Catalog</button>
              <button onClick={() => setCurrentPage('api-docs')} className="hover:text-white transition-colors">API Docs</button>
              <button onClick={() => setCurrentPage('tickets')} className="hover:text-white transition-colors">Support</button>
              <button onClick={handleSignIn} className="hover:text-white transition-colors">Customer Portal</button>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <p>© 2026 SocialFlow Panel. All rights reserved.</p>
            <p>High-Impact Social Growth System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
