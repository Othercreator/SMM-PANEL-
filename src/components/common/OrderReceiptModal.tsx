import React from 'react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { X, ExternalLink, RefreshCw, Copy, Check, ShoppingBag } from 'lucide-react';

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ order, isOpen, onClose }) => {
  const { formatCurrency, requestRefill, setCurrentPage, setSelectedServiceForOrder, services } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !order) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(order.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReorder = () => {
    const s = services.find(srv => srv.id === order.serviceId);
    if (s) {
      setSelectedServiceForOrder(s);
    }
    onClose();
    setCurrentPage('new-order');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
              SF
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Order Details {order.id}
              </h3>
              <p className="text-xs text-slate-500">Submitted to high-speed cluster dispatch</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-500 block">Service Status</span>
              <div className="mt-1">
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Deducted</span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatCurrency(order.charge)}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold tracking-wider text-[11px]">Service</span>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{order.serviceName}</p>
              <span className="text-slate-500">Platform: {order.platform} · ID: {order.serviceId}</span>
            </div>

            <div>
              <span className="text-slate-400 uppercase font-semibold tracking-wider text-[11px]">Target Link</span>
              <div className="flex items-center gap-2 mt-1 p-2 bg-slate-50 border border-slate-200/60 rounded-lg">
                <span className="text-slate-700 truncate font-mono text-[11px] flex-1">
                  {order.link}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-white rounded transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={order.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-white rounded transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Total Qty</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {order.quantity.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Start Count</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {order.startCount.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Remains</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {order.remains.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 text-slate-500 text-[11px] flex justify-between">
              <span>Placed At: {order.createdAt}</span>
              <span>Refill Policy: {order.hasRefill ? '30 Days Refill Enabled' : 'No Refill'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            {order.hasRefill && (
              <button
                onClick={() => requestRefill(order.id)}
                disabled={order.refillUsed}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>{order.refillUsed ? 'Refill In Progress' : 'Request Refill'}</span>
              </button>
            )}

            <button
              onClick={handleReorder}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
