import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types';
import { 
  PlatformNavigationMenu, 
  PlatformOption, 
  PLATFORM_CONFIGS 
} from './PlatformNavigationMenu';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  Youtube,
  Instagram,
  Twitter,
  Send,
  Globe,
  Radio,
  Copy,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List,
  Info,
  X,
  Eye,
  ArrowUpDown,
  FileText,
  AlertTriangle,
  Calculator,
  RotateCcw
} from 'lucide-react';

export const ServicesCatalogPage: React.FC = () => {
  const { services, formatCurrency, setCurrentPage, setSelectedServiceForOrder } = useApp();
  
  // Platform selection state
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption>('All Services');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  
  // Real-time search query at the top
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Sorting state - default recommended or price-asc/desc
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'min-qty' | 'name-asc'>('recommended');
  
  // Advanced filters state
  const [priceFilter, setPriceFilter] = useState<'all' | 'under50' | '50-200' | '200-500' | 'above500'>('all');
  const [refillFilter, setRefillFilter] = useState<'all' | 'refill' | 'lifetime' | 'no-refill'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  
  // Quick View Modal state
  const [quickViewService, setQuickViewService] = useState<Service | null>(null);
  const [calculatorQty, setCalculatorQty] = useState<number>(1000);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Helper to match a service to a platform
  const matchServicePlatform = (service: Service, platform: PlatformOption): boolean => {
    if (platform === 'All Services') return true;
    
    const p = service.platform.toLowerCase();
    const c = service.category.toLowerCase();
    const n = service.name.toLowerCase();

    switch (platform) {
      case 'YouTube':
        return p === 'youtube' || c.includes('youtube') || n.includes('youtube');
      case 'Facebook':
        return p === 'facebook' || c.includes('facebook') || n.includes('facebook');
      case 'Instagram':
        return p === 'instagram' || c.includes('instagram') || n.includes('instagram');
      case 'TikTok':
        return p === 'tiktok' || c.includes('tiktok') || n.includes('tiktok');
      case 'Telegram':
        return p === 'telegram' || c.includes('telegram') || n.includes('telegram');
      case 'X / Twitter':
        return p.includes('twitter') || p.includes('x') || c.includes('twitter') || c.includes('x /') || n.includes('twitter') || n.includes('retweet');
      case 'Threads':
        return p === 'threads' || c.includes('threads') || n.includes('threads');
      case 'LinkedIn':
        return p === 'linkedin' || c.includes('linkedin') || n.includes('linkedin');
      case 'Discord':
        return p === 'discord' || c.includes('discord') || n.includes('discord');
      case 'WhatsApp':
        return p === 'whatsapp' || c.includes('whatsapp') || n.includes('whatsapp');
      case 'Spotify':
        return p === 'spotify' || c.includes('spotify') || n.includes('spotify');
      case 'Music & Streaming':
        return p === 'music & streaming' || c.includes('music') || c.includes('apple music') || c.includes('soundcloud') || c.includes('audiomack') || n.includes('apple music') || n.includes('soundcloud');
      case 'Other Services':
        return p === 'other services' || p === 'website traffic' || c.includes('traffic') || c.includes('twitch') || c.includes('pinterest') || n.includes('traffic') || n.includes('twitch');
      default:
        return true;
    }
  };

  // Calculate live count for each platform
  const serviceCounts = useMemo(() => {
    const counts: Record<PlatformOption, number> = {
      'All Services': services.length,
      'Facebook': 0,
      'Instagram': 0,
      'YouTube': 0,
      'TikTok': 0,
      'Telegram': 0,
      'X / Twitter': 0,
      'Threads': 0,
      'LinkedIn': 0,
      'Discord': 0,
      'WhatsApp': 0,
      'Spotify': 0,
      'Music & Streaming': 0,
      'Other Services': 0
    };

    services.forEach(service => {
      PLATFORM_CONFIGS.forEach(config => {
        if (config.id !== 'All Services' && matchServicePlatform(service, config.id)) {
          counts[config.id] = (counts[config.id] || 0) + 1;
        }
      });
    });

    return counts;
  }, [services]);

  // Sub-categories definitions per platform
  const platformSubCategories: Record<PlatformOption, string[]> = {
    'All Services': [
      'All Categories',
      'Subscribers & Followers',
      'Likes & Reactions',
      'Views & Streams',
      'Comments',
      'Livestream & Concurrent',
      'Monetization & Watch Hours'
    ],
    'YouTube': [
      'All',
      'Subscribers',
      'Likes & Dislikes',
      'Comments',
      'Video Views',
      'Livestream Views',
      'Watch Hours',
      'Community Post Likes'
    ],
    'Facebook': [
      'All',
      'Followers & Page Likes',
      'Post Likes & Reactions',
      'Reel Views',
      'Live Stream Views',
      'Group Members'
    ],
    'Instagram': [
      'All',
      'Followers',
      'Likes',
      'Reels Views',
      'Story Views & Likes',
      'Comments'
    ],
    'TikTok': [
      'All',
      'Followers',
      'Likes',
      'Video Views',
      'Live Stream & PK'
    ],
    'Telegram': [
      'All',
      'Channel Members',
      'Premium Members',
      'Post Views',
      'Stars & Bot Starts'
    ],
    'X / Twitter': [
      'All',
      'Followers',
      'Likes & Retweets',
      'Tweet Views & Impressions'
    ],
    'Threads': [
      'All',
      'Followers',
      'Likes & Reposts'
    ],
    'LinkedIn': [
      'All',
      'Company Followers',
      'Post Reactions'
    ],
    'Discord': [
      'All',
      'Server Members',
      'Boosters'
    ],
    'WhatsApp': [
      'All',
      'Channel Members',
      'Post Reactions'
    ],
    'Spotify': [
      'All',
      'Track Plays',
      'Playlist Plays & Saves',
      'Monthly Listeners'
    ],
    'Music & Streaming': [
      'All',
      'Apple Music',
      'SoundCloud'
    ],
    'Other Services': [
      'All',
      'Website Traffic',
      'Twitch'
    ]
  };

  const currentSubCategories = platformSubCategories[selectedPlatform] || ['All'];

  // Handle platform change
  const handleSelectPlatform = (platform: PlatformOption) => {
    setSelectedPlatform(platform);
    setSelectedSubCategory('All');
  };

  // Subcategory matching logic
  const matchesSubCategory = (service: Service, sub: string): boolean => {
    if (sub === 'All' || sub === 'All Categories') return true;
    
    const nameLower = service.name.toLowerCase();
    const descLower = service.description.toLowerCase();
    const catLower = service.category.toLowerCase();
    const combined = `${nameLower} ${descLower} ${catLower}`;

    if (sub === 'Subscribers') return combined.includes('subscriber');
    if (sub === 'Likes & Dislikes') return combined.includes('like') || combined.includes('dislike');
    if (sub === 'Comments') return combined.includes('comment');
    if (sub === 'Video Views') return combined.includes('view') && !combined.includes('livestream') && !combined.includes('live stream');
    if (sub === 'Livestream Views' || sub === 'Live Stream Views') return combined.includes('livestream') || combined.includes('live stream') || combined.includes('concurrent');
    if (sub === 'Watch Hours') return combined.includes('watch hour') || combined.includes('monetization');
    if (sub === 'Community Post Likes') return combined.includes('community');

    if (sub === 'Followers & Page Likes') return combined.includes('page like') || combined.includes('follower');
    if (sub === 'Post Likes & Reactions') return combined.includes('reaction') || combined.includes('post like');
    if (sub === 'Reel Views' || sub === 'Reels Views') return combined.includes('reel');
    if (sub === 'Group Members') return combined.includes('group');

    if (sub === 'Followers') return combined.includes('follower');
    if (sub === 'Likes') return combined.includes('like') && !combined.includes('dislike');
    if (sub === 'Story Views & Likes') return combined.includes('story');
    if (sub === 'Channel Members') return combined.includes('channel member') || combined.includes('member');
    if (sub === 'Premium Members') return combined.includes('premium');
    if (sub === 'Post Views') return combined.includes('post view') || combined.includes('autoview');
    if (sub === 'Stars & Bot Starts') return combined.includes('star') || combined.includes('bot');
    if (sub === 'Likes & Retweets') return combined.includes('retweet') || combined.includes('repost');
    if (sub === 'Tweet Views & Impressions') return combined.includes('impression') || combined.includes('tweet view');
    if (sub === 'Likes & Reposts') return combined.includes('like') || combined.includes('repost');
    if (sub === 'Company Followers') return combined.includes('company') || combined.includes('follower');
    if (sub === 'Post Reactions') return combined.includes('reaction');
    if (sub === 'Server Members') return combined.includes('server') || combined.includes('member');
    if (sub === 'Boosters') return combined.includes('boost');
    if (sub === 'Track Plays') return combined.includes('stream') || combined.includes('play');
    if (sub === 'Playlist Plays & Saves') return combined.includes('playlist') || combined.includes('save');
    if (sub === 'Monthly Listeners') return combined.includes('listener');
    if (sub === 'Apple Music') return combined.includes('apple');
    if (sub === 'SoundCloud') return combined.includes('soundcloud');
    if (sub === 'Website Traffic') return combined.includes('traffic') || combined.includes('website');
    if (sub === 'Twitch') return combined.includes('twitch');
    if (sub === 'Live Stream & PK') return combined.includes('live') || combined.includes('pk');

    if (sub === 'Subscribers & Followers') return combined.includes('subscriber') || combined.includes('follower') || combined.includes('member');
    if (sub === 'Likes & Reactions') return combined.includes('like') || combined.includes('reaction');
    if (sub === 'Views & Streams') return combined.includes('view') || combined.includes('play') || combined.includes('stream');
    if (sub === 'Livestream & Concurrent') return combined.includes('live') || combined.includes('concurrent');
    if (sub === 'Monetization & Watch Hours') return combined.includes('watch hour') || combined.includes('monetization');

    return true;
  };

  // Real-time filtering and sorting of services
  const filteredServices = useMemo(() => {
    let result = services.filter(service => {
      // 1. Platform match
      if (!matchServicePlatform(service, selectedPlatform)) {
        return false;
      }

      // 2. Subcategory match
      if (!matchesSubCategory(service, selectedSubCategory)) {
        return false;
      }

      // 3. Real-time search query matching by name or description
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesDescription = service.description.toLowerCase().includes(query);
        const matchesId = service.id.toLowerCase().includes(query) || 
          (service.providerServiceId && service.providerServiceId.toString().toLowerCase().includes(query));
        const matchesCategory = service.category.toLowerCase().includes(query);
        const matchesPlatform = service.platform.toLowerCase().includes(query);
        const matchesBadge = service.badgeTag ? service.badgeTag.toLowerCase().includes(query) : false;

        if (!matchesName && !matchesDescription && !matchesId && !matchesCategory && !matchesPlatform && !matchesBadge) {
          return false;
        }
      }

      // 4. Price range filter
      if (priceFilter === 'under50' && service.ratePer1000 >= 50) return false;
      if (priceFilter === '50-200' && (service.ratePer1000 < 50 || service.ratePer1000 > 200)) return false;
      if (priceFilter === '200-500' && (service.ratePer1000 < 200 || service.ratePer1000 > 500)) return false;
      if (priceFilter === 'above500' && service.ratePer1000 <= 500) return false;

      // 5. Refill filter
      if (refillFilter === 'refill') {
        const lower = service.refillPolicy.toLowerCase();
        if (lower.includes('no refill')) return false;
      } else if (refillFilter === 'lifetime') {
        if (!service.refillPolicy.toLowerCase().includes('lifetime')) return false;
      } else if (refillFilter === 'no-refill') {
        if (!service.refillPolicy.toLowerCase().includes('no refill')) return false;
      }

      return true;
    });

    // Sorting by price or other criteria
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.ratePer1000 - b.ratePer1000;
      if (sortBy === 'price-desc') return b.ratePer1000 - a.ratePer1000;
      if (sortBy === 'min-qty') return a.minQuantity - b.minQuantity;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // Default recommended
    });

    return result;
  }, [services, selectedPlatform, selectedSubCategory, searchQuery, priceFilter, refillFilter, sortBy]);

  const handleOrderNow = (service: Service) => {
    setSelectedServiceForOrder(service);
    setCurrentPage('new-order');
  };

  const handleOpenQuickView = (service: Service) => {
    setQuickViewService(service);
    setCalculatorQty(service.minQuantity || 1000);
    setCopiedLink(false);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Instagram':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'TikTok':
        return 'text-slate-900 bg-slate-100 border-slate-300';
      case 'Twitter / X':
      case 'X / Twitter':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'Facebook':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Telegram':
        return 'text-cyan-700 bg-cyan-50 border-cyan-200';
      case 'LinkedIn':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Discord':
        return 'text-indigo-800 bg-indigo-50 border-indigo-300';
      case 'WhatsApp':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Spotify':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Threads':
        return 'text-slate-900 bg-slate-100 border-slate-200';
      case 'Music & Streaming':
        return 'text-violet-700 bg-violet-50 border-violet-200';
      case 'Website Traffic':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  // Helper for estimated average completion time
  const getAverageCompletionTime = (service: Service): string => {
    const speedLower = service.speed.toLowerCase();
    const startLower = service.startTime.toLowerCase();
    
    if (speedLower.includes('instant') || startLower.includes('instant')) {
      return '1 - 3 Hours (Instant Priority Route)';
    } else if (speedLower.includes('100k') || speedLower.includes('50k')) {
      return '2 - 6 Hours (High Capacity Dispatch)';
    } else if (speedLower.includes('day') || speedLower.includes('/day')) {
      return '4 - 18 Hours (Natural Organic Pacing)';
    } else {
      return 'Usually 2 - 12 Hours';
    }
  };

  const resetAllFilters = () => {
    setSelectedPlatform('All Services');
    setSelectedSubCategory('All');
    setSearchQuery('');
    setPriceFilter('all');
    setRefillFilter('all');
    setSortBy('recommended');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-600 block mb-1">
            IndianSMM v2 Direct Upstream • Instant Dispatch
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Services Catalog & Wholesale Rates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Real-time catalog across all 14 social media platforms. Direct provider routes with real-time dispatch, automatic refill protection, and pricing in Indian Rupee (₹ INR).
          </p>
        </div>

        {/* Top right stats */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Services</span>
            <span className="text-sm font-extrabold text-slate-900 tabular-nums">{services.length} Active</span>
          </div>
          <div className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pricing</span>
            <span className="text-sm font-extrabold text-emerald-600 tabular-nums">INR (₹) Base</span>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME SEARCH INPUT FIELD AT THE TOP */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search services by name or description in real-time (e.g. YouTube Subscribers, Reel Views, Non-Drop)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search quick badge or clear button */}
          {searchQuery && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                {filteredServices.length} {filteredServices.length === 1 ? 'match' : 'matches'} for "{searchQuery}"
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Quick popular search chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-500 scrollbar-none pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-1">Popular:</span>
          {['Subscribers', 'Followers', 'Reel Views', 'Watch Hours', 'Non-Drop', 'Likes', 'Channel Members', 'Comments'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all whitespace-nowrap ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. RESPONSIVE PLATFORM NAVIGATION MENU */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <PlatformNavigationMenu
          selectedPlatform={selectedPlatform}
          onSelectPlatform={handleSelectPlatform}
          serviceCounts={serviceCounts}
        />
      </div>

      {/* 4. DYNAMIC SUB-CATEGORY CHIPS & CONTROLS TOOLBAR */}
      <div className="space-y-3">
        {/* Sub-category strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 shrink-0 pr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
          </span>
          {currentSubCategories.map((sub) => {
            const isSubSelected = selectedSubCategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-150 ${
                  isSubSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* CONTROLS BAR: SORT DROPDOWN FILTER & VIEW TOGGLES */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Left: Summary or Active Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600">
            <span className="font-bold text-slate-800">
              {selectedPlatform}
            </span>
            {selectedSubCategory !== 'All' && selectedSubCategory !== 'All Categories' && (
              <>
                <span className="text-slate-300">•</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  {selectedSubCategory}
                </span>
              </>
            )}
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">
              <strong className="text-slate-900 tabular-nums">{filteredServices.length}</strong> services
            </span>
          </div>

          {/* Right: Price Sort Dropdown, Filters & View Mode */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-between md:justify-end">
            {/* DROPDOWN FILTER FOR SORTING BY PRICE (Low to High, High to Low) */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline-flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort by:</span>
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`appearance-none pl-3 pr-8 py-2 border rounded-xl text-xs font-bold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    sortBy === 'price-asc' || sortBy === 'price-desc'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title="Sort services by price or other criteria"
                >
                  <option value="recommended">⭐ Recommended / Default</option>
                  <option value="price-asc">💰 Price: Low to High (Budget-Friendly)</option>
                  <option value="price-desc">💎 Price: High to Low (Premium / Bulk)</option>
                  <option value="min-qty">🔢 Min Quantity: Low to High</option>
                  <option value="name-asc">🔤 Service Name (A-Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Advanced Filters Drawer Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters || priceFilter !== 'all' || refillFilter !== 'all'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(priceFilter !== 'all' || refillFilter !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dense Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-150">
            {/* Price Filter */}
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Price Range Filter (per 1,000)</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'All Rates' },
                  { id: 'under50', label: 'Under ₹50' },
                  { id: '50-200', label: '₹50 - ₹200' },
                  { id: '200-500', label: '₹200 - ₹500' },
                  { id: 'above500', label: '₹500+' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setPriceFilter(item.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                      priceFilter === item.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Refill Policy Filter */}
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Refill Guarantee</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'All Policies' },
                  { id: 'refill', label: 'Refill Guaranteed' },
                  { id: 'lifetime', label: 'Lifetime Refill' },
                  { id: 'no-refill', label: 'No Refill (Cheap)' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setRefillFilter(item.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                      refillFilter === item.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Summary & Reset */}
            <div className="flex flex-col justify-end items-start sm:items-end">
              <button
                onClick={resetAllFilters}
                className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. SERVICES DISPLAY (GRID OR TABLE) */}
      {viewMode === 'grid' ? (
        /* GRID VIEW WITH DEDICATED QUICK VIEW BUTTONS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getPlatformBadge(service.platform)}`}>
                    {service.platform} Service
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{service.startTime}</span>
                  </span>
                </div>

                {/* Service Title & ID */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-mono font-bold">
                      ID: {service.id}
                    </span>
                    {service.providerServiceId && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 font-mono font-bold px-1.5 py-0.2 rounded border border-slate-200">
                        Provider #{service.providerServiceId}
                      </span>
                    )}
                    {service.badgeTag && (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        {service.badgeTag}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Specs badges */}
                <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] text-slate-600 font-medium">
                  <span className="px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-amber-500" />
                    <span>{service.speed}</span>
                  </span>
                  <span className="px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                    <span>{service.refillPolicy}</span>
                  </span>
                  <span className="px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                    📉 {service.averageDropRate}
                  </span>
                </div>
              </div>

              {/* Card Footer with Price in INR, Limits & QUICK VIEW + Order Now Buttons */}
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate per 1,000</span>
                    <span className="text-base font-black text-slate-900 tabular-nums">
                      {formatCurrency(service.ratePer1000)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Limits</span>
                    <span className="text-xs font-semibold text-slate-600 tabular-nums">
                      Min: {service.minQuantity.toLocaleString('en-IN')} / Max: {service.maxQuantity.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Quick View + Order Now */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenQuickView(service)}
                    className="py-2.5 px-3.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                    title="Open Quick View with average completion time & service terms"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Quick View</span>
                  </button>

                  <button
                    onClick={() => handleOrderNow(service)}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* COMPACT TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4 text-right">Rate / 1k</th>
                  <th className="py-3 px-4 text-right">Min / Max</th>
                  <th className="py-3 px-4">Refill</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredServices.map(service => (
                  <tr key={service.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500 text-[11px] whitespace-nowrap">
                      {service.id}
                      {service.providerServiceId && (
                        <span className="block text-[10px] text-slate-400">#{service.providerServiceId}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-bold text-slate-900 leading-snug line-clamp-1">{service.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{service.description}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlatformBadge(service.platform)}`}>
                        {service.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 tabular-nums whitespace-nowrap">
                      {formatCurrency(service.ratePer1000)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 tabular-nums whitespace-nowrap">
                      {service.minQuantity.toLocaleString('en-IN')} - {service.maxQuantity.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                      {service.refillPolicy}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenQuickView(service)}
                          className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 border border-slate-200"
                          title="Quick View Details"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Quick View</span>
                        </button>
                        <button
                          onClick={() => handleOrderNow(service)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>Order</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No matching services found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery 
              ? `We couldn't find any services matching "${searchQuery}" under ${selectedPlatform}.` 
              : `No services found under ${selectedPlatform} with the selected subcategory filters.`}
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* 6. COMPREHENSIVE QUICK VIEW MODAL (Average Completion Time, Terms, Link Format, Live Cost Calculator) */}
      {quickViewService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${getPlatformBadge(quickViewService.platform)}`}>
                    {quickViewService.platform}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Category: {quickViewService.category}
                  </span>
                  {quickViewService.badgeTag && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      {quickViewService.badgeTag}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1.5 leading-snug">
                  {quickViewService.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                  <span>ID: <strong className="text-slate-600">{quickViewService.id}</strong></span>
                  <span>•</span>
                  <span>Provider ID: <strong className="text-slate-600">#{quickViewService.providerServiceId || 'Native'}</strong></span>
                </div>
              </div>

              <button
                onClick={() => setQuickViewService(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Close Quick View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SECTION A: AVERAGE COMPLETION TIME & PERFORMANCE METRICS */}
            <div className="bg-gradient-to-br from-emerald-50/70 to-blue-50/50 rounded-2xl p-4 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Delivery Speed & Average Completion Time</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Real-time Route
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg. Completion</span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5">
                    {getAverageCompletionTime(quickViewService)}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Start Time</span>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                    {quickViewService.startTime}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Dispatch Speed</span>
                  <span className="text-xs font-bold text-blue-700 block mt-0.5">
                    {quickViewService.speed}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Drop Rate</span>
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">
                    {quickViewService.averageDropRate}
                  </span>
                </div>
              </div>

              {/* Service Description */}
              <div className="bg-white/60 p-3 rounded-xl border border-emerald-100/60 text-xs text-slate-700 leading-relaxed">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Service Description</span>
                {quickViewService.description}
              </div>
            </div>

            {/* SECTION B: SPECIFIC SERVICE TERMS & CONDITIONS */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Specific Service Terms & Delivery Rules</span>
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">1. Public Profile & Visibility Requirement</strong>
                    <span className="text-slate-600">
                      The target account, post, video, or channel MUST remain 100% PUBLIC throughout delivery. Private profiles cause upstream errors and void refund eligibility.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">2. No Overlapping Orders on Same Link</strong>
                    <span className="text-slate-600">
                      Never submit duplicate or concurrent orders for the identical link until this order is marked Completed. Counts cannot sync if multiple servers deliver simultaneously.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">3. Refill & Guarantee Terms: {quickViewService.refillPolicy}</strong>
                    <span className="text-slate-600">
                      {quickViewService.refillPolicy.toLowerCase().includes('no refill')
                        ? 'This discounted service carries no refill guarantee. If drop occurs, refill requests cannot be processed.'
                        : 'If counts drop below the start count + delivered amount during the warranty window, click the 1-click Refill button on your Orders page for automatic replenishment.'}
                    </span>
                  </div>
                </div>

                {quickViewService.instructions && (
                  <div className="flex items-start gap-2.5 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900 block font-bold">4. Special Link Instructions</strong>
                      <span className="text-amber-800">{quickViewService.instructions}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Required Link Format */}
              <div className="pt-1 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">Required Link Format:</span>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl font-mono text-xs text-slate-800 border border-slate-200">
                  <span className="truncate pr-2">{quickViewService.linkFormat}</span>
                  <button
                    onClick={() => copyToClipboard(quickViewService.linkFormat)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors shrink-0"
                    title="Copy sample link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION C: BUDGET & LIVE COST CALCULATOR */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Wholesale Pricing & Live Cost Calculator</span>
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  Base: {formatCurrency(quickViewService.ratePer1000)} / 1,000
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Min Quantity</span>
                  <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                    {quickViewService.minQuantity.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Quantity</span>
                  <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                    {quickViewService.maxQuantity.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Quality Level</span>
                  <span className="text-xs font-extrabold text-emerald-800">
                    {quickViewService.quality}
                  </span>
                </div>
              </div>

              {/* Interactive Calculator Input */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Calculate Test Quantity:
                  </label>
                  <input
                    type="number"
                    min={quickViewService.minQuantity}
                    max={quickViewService.maxQuantity}
                    step={100}
                    value={calculatorQty}
                    onChange={(e) => setCalculatorQty(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Calculated Total:
                  </span>
                  <span className="text-lg font-black text-emerald-700 tabular-nums">
                    {formatCurrency((calculatorQty / 1000) * quickViewService.ratePer1000)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setQuickViewService(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors"
              >
                Close Quick View
              </button>

              <button
                onClick={() => {
                  handleOrderNow(quickViewService);
                  setQuickViewService(null);
                }}
                className="py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/10 transition-colors flex items-center gap-2"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
