import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, Order } from '../../types';
import { 
  Zap, 
  Wallet, 
  Plus, 
  Search, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileText,
  ChevronDown,
  Info,
  Check
} from 'lucide-react';
import { OrderReceiptModal } from '../common/OrderReceiptModal';

export const NewOrderPage: React.FC = () => {
  const { 
    services, 
    currentUser, 
    formatCurrency, 
    placeOrder, 
    selectedServiceForOrder, 
    setSelectedServiceForOrder, 
    setAddFundsModalOpen,
    setCurrentPage 
  } = useApp();

  // Find or default service
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    return selectedServiceForOrder ? selectedServiceForOrder.id : (services[0]?.id || '#YT-1');
  });

  const activeService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId) || services[0];
  }, [services, selectedServiceId]);

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return activeService ? activeService.category : 'YouTube Service';
  });

  const [targetLink, setTargetLink] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [receiptOpen, setReceiptOpen] = useState<boolean>(false);

  // Sync when selectedServiceForOrder changes from Catalog
  useEffect(() => {
    if (selectedServiceForOrder) {
      setSelectedServiceId(selectedServiceForOrder.id);
      setSelectedCategory(selectedServiceForOrder.category);
    }
  }, [selectedServiceForOrder]);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set(services.map(s => s.category));
    return Array.from(set);
  }, [services]);

  // Services matching active category
  const categoryServices = useMemo(() => {
    return services.filter(s => s.category === selectedCategory);
  }, [services, selectedCategory]);

  // Automatic calculated charge: (quantity / 1000) * ratePer1000
  const calculatedCharge = useMemo(() => {
    if (!activeService || !quantity) return 0;
    const raw = (quantity / 1000) * activeService.ratePer1000;
    return Math.round(raw * 100) / 100;
  }, [activeService, quantity]);

  const quantityPresets = [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    const firstInCat = services.find(s => s.category === cat);
    if (firstInCat) {
      setSelectedServiceId(firstInCat.id);
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServiceId(e.target.value);
  };

  const handlePasteLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setTargetLink(text);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!termsAgreed) {
      setFormError('Please accept the Terms of Service and Refill Policies to place an order.');
      return;
    }

    if (!targetLink || !targetLink.startsWith('http')) {
      setFormError('Please enter a valid target URL starting with http:// or https://');
      return;
    }

    if (quantity < activeService.minQuantity || quantity > activeService.maxQuantity) {
      setFormError(`Quantity must be between ${activeService.minQuantity.toLocaleString()} and ${activeService.maxQuantity.toLocaleString()}.`);
      return;
    }

    if (currentUser.balance < calculatedCharge) {
      setFormError(`Insufficient funds. You need ${formatCurrency(calculatedCharge)}, but your available balance is ${formatCurrency(currentUser.balance)}.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = placeOrder({
        serviceId: activeService.id,
        link: targetLink,
        quantity: quantity
      });

      setIsSubmitting(false);

      if (result.success && result.order) {
        setLastPlacedOrder(result.order);
        setReceiptOpen(true);
        setTargetLink('');
      } else {
        setFormError(result.error || 'Failed to place order.');
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading (Reference 1 style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 block mb-1">
            New Campaign & Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create New Order
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1 leading-relaxed">
            Deploy lightning-fast social engagement campaigns across multiple channels instantly, with automated tracking and guaranteed delivery metrics.
          </p>
        </div>

        {/* Available Balance Box (from Reference 1 top right) */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Balance</span>
            <span className="text-base font-black text-slate-900 tabular-nums">
              {formatCurrency(currentUser.balance)}
            </span>
          </div>
          <button
            onClick={() => setAddFundsModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Funds</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid (Reference 1 layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Select Platform & Category */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  1. Select Platform & Category
                </label>
                <span className="text-[11px] text-emerald-600 font-semibold">{activeService.platform} Growth</span>
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Step 2: Choose Specific Service */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  2. Choose Specific Service
                </label>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  ID: {activeService.id}
                </span>
              </div>
              <div className="relative">
                <select
                  value={selectedServiceId}
                  onChange={handleServiceChange}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer truncate pr-10"
                >
                  {categoryServices.map(srv => (
                    <option key={srv.id} value={srv.id}>
                      ⚡ {srv.name} — {formatCurrency(srv.ratePer1000)}/1k
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Step 3: Target Profile / Post Link */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  3. Target Profile / Post Link
                </label>
                <button
                  type="button"
                  onClick={handlePasteLink}
                  className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold"
                >
                  Paste from clipboard
                </button>
              </div>
              <div className="relative">
                <input
                  type="url"
                  required
                  placeholder={activeService.linkFormat}
                  value={targetLink}
                  onChange={e => setTargetLink(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Format required: <span className="font-mono text-emerald-600">{activeService.linkFormat}</span>
              </p>
            </div>

            {/* Step 4: Order Quantity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  4. Order Quantity
                </label>
                <span className="text-[11px] text-slate-500 font-medium tabular-nums">
                  Min: {activeService.minQuantity.toLocaleString('en-IN')} — Max: {activeService.maxQuantity.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={activeService.minQuantity}
                  max={activeService.maxQuantity}
                  step="1"
                  required
                  value={quantity || ''}
                  onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full pl-3.5 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all tabular-nums"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  QTY
                </span>
              </div>

              {/* Quantity Preset Buttons (Min 10 to Max 10,00,000) */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 mt-2">
                {quantityPresets.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all tabular-nums ${
                      quantity === preset
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-extrabold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms and Confirmation Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={e => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>
                  I confirm that I have read and agree to SocialFlow's Terms of Service, Refill Policies, and understand that orders cannot be cancelled once dispatched.
                </span>
              </label>
            </div>

            {/* Error banner if any */}
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Place Order Now Button */}
            <button
              type="submit"
              disabled={isSubmitting || !termsAgreed}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Validating & Dispatching Order...
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Place Order Now ({formatCurrency(calculatedCharge)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Service Specifications + Sticky Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Service Specifications Card (Reference 1 right top) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Service Specifications</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Active Service
              </span>
            </div>

            {/* 2-column Spec Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Start Time</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{activeService.startTime}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Speed / Day</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{activeService.speed}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Quality</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{activeService.quality}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Refill Policy</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{activeService.refillPolicy}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Average Drop Rate</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{activeService.averageDropRate}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Price Per 1000</span>
                <span className="text-xs font-bold text-emerald-600 mt-0.5 block tabular-nums">
                  {formatCurrency(activeService.ratePer1000)}
                </span>
              </div>
            </div>

            {/* Important Instructions Box */}
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Important Instructions</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {activeService.instructions}
              </p>
            </div>
          </div>

          {/* ORDER SUMMARY (Reference 1 right bottom dark card) */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                ORDER SUMMARY
              </span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-teal-200 block">Total Charge</span>
                <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                  {formatCurrency(calculatedCharge)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-teal-200 pt-2 border-t border-white/10">
                <span>Calculated Qty:</span>
                <span className="font-bold text-white tabular-nums">{quantity.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-teal-200">
                <span>Estimated Delivery Start:</span>
                <span className="font-bold text-white">{activeService.startTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Receipt Modal */}
      <OrderReceiptModal
        order={lastPlacedOrder}
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
      />
    </div>
  );
};
