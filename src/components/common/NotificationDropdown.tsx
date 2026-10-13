import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-bold text-slate-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-700 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-medium px-2 py-1 rounded hover:bg-emerald-50 transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No notifications right now
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-3.5 flex items-start gap-3 transition-colors ${
                n.read ? 'bg-white hover:bg-slate-50/60' : 'bg-emerald-50/30 hover:bg-emerald-50/50'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {n.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${n.read ? 'text-slate-700 font-normal' : 'text-slate-900 font-medium'}`}>
                  {n.title}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {n.time}
                </span>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 self-center"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
