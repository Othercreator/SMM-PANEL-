import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { 
  Menu, 
  Bell, 
  Wallet, 
  Plus, 
  User, 
  Shield, 
  LogOut, 
  ChevronDown, 
  Settings, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileSidebar }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    formatCurrency, 
    currentPage, 
    setCurrentPage, 
    setAddFundsModalOpen, 
    notifications, 
    setIsLoggedIn 
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Page titles
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview & real-time metrics' },
    services: { title: 'Services Catalog', subtitle: 'Explore high-impact growth services' },
    'new-order': { title: 'Create New Order', subtitle: 'Deploy instant social campaigns' },
    orders: { title: 'Orders Management', subtitle: 'Track and monitor active campaigns' },
    wallet: { title: 'Wallet & Billing', subtitle: 'Manage funds, invoices, and payouts' },
    tickets: { title: 'Support Desk', subtitle: 'Tickets and client assistance' },
    'api-docs': { title: 'API Documentation', subtitle: 'Integrate SocialFlow programmatically' },
    profile: { title: 'Profile & Settings', subtitle: 'Account preferences & security' },
    admin: { title: 'Admin Master Console', subtitle: 'System control & moderation' }
  };

  const pageInfo = pageTitles[currentPage] || { title: 'SocialFlow', subtitle: 'Panel' };

  const handleToggleRole = () => {
    setCurrentUser(prev => ({
      ...prev,
      role: prev.role === 'Admin' ? 'Customer' : 'Admin'
    }));
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">
            {pageInfo.title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Wallet Balance + Add Funds + Notifications + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Wallet Balance widget (from Reference 1 top right) */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 py-1.5 px-3 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">
              Available Balance
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
              {formatCurrency(currentUser.balance)}
            </span>
          </div>

          <button
            onClick={() => setAddFundsModalOpen(true)}
            className="p-1 sm:px-2.5 sm:py-1.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1"
            title="Top Up Wallet"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Funds</span>
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          <NotificationDropdown
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-100 shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <span className="text-xs font-bold text-slate-800 hidden md:inline">
              {currentUser.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700">
                  {currentUser.role} Account
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentPage('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Profile & Settings
                </button>

                <button
                  onClick={() => {
                    setCurrentPage('wallet');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  Wallet & Billing
                </button>

                <button
                  onClick={() => {
                    setCurrentPage('admin');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Admin Dashboard
                </button>

                <button
                  onClick={handleToggleRole}
                  className="w-full px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 font-medium flex items-center gap-2.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Switch Role ({currentUser.role === 'Admin' ? 'Customer' : 'Admin'})
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
