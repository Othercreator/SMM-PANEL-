import React from 'react';
import { OrderStatus, TransactionType, TransactionStatus } from '../../types';
import { CheckCircle2, Clock, AlertCircle, RefreshCw, XCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus | TransactionStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'Completed':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-2xs ${className}`}
          title="Status: Completed - Successfully fulfilled"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Completed</span>
        </span>
      );
    case 'Processing':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-300/80 shadow-2xs ${className}`}
          title="Status: Processing - Being delivered by provider cluster"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-600 shrink-0 animate-spin" />
          <span>Processing</span>
        </span>
      );
    case 'In Progress':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300/80 shadow-2xs ${className}`}
          title="Status: In Progress - Active delivery"
        >
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>In Progress</span>
        </span>
      );
    case 'Pending':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300/90 shadow-2xs ${className}`}
          title="Status: Pending - Awaiting provider queue"
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Pending</span>
        </span>
      );
    case 'Cancelled':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300/80 shadow-2xs ${className}`}
          title="Status: Cancelled - Order terminated"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Cancelled</span>
        </span>
      );
    case 'Failed':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300/80 shadow-2xs ${className}`}
          title="Status: Failed - Provider rejected request"
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Failed</span>
        </span>
      );
    case 'Refunded':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300/80 shadow-2xs ${className}`}
          title="Status: Refunded - Credits returned to wallet"
        >
          <AlertCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Refunded</span>
        </span>
      );
    case 'Active':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-2xs ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Active</span>
        </span>
      );
    case 'Suspended':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300/80 shadow-2xs ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Suspended</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
          {status}
        </span>
      );
  }
};

export const TransactionTypeBadge: React.FC<{ type: TransactionType }> = ({ type }) => {
  if (type === 'Credit') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
        + Credit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
      ↑ Debit
    </span>
  );
};
