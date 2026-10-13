import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActivePage, Currency } from '../../types';
import { 
  LayoutDashboard, 
  Layers, 
  PlusCircle, 
  ShoppingBag, 
  Wallet, 
  User, 
  ShieldCheck, 
  LifeBuoy, 
  Code2, 
  LogOut, 
  ExternalLink,
  Zap,
  Globe,
  Activity
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    setIsLoggedIn, 
    currency, 
    setCurrency, 
    adminControls 
  } = useApp();

  const navItems: { id: ActivePage; label: string; icon: React.FC<{ className?: string }>; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'new-order', label: 'New Order', icon: PlusCircle },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'tickets', label: 'Support', icon: LifeBuoy },
    { id: 'api-docs', label: 'API Docs', icon: Code2 },
    { id: 'api-logs', label: 'API Logs', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, adminOnly: true }
  ];

  const handleNavClick = (id: ActivePage) => {
    setCurrentPage(id);
    onCloseMobile();
  };

  const currencies: Currency[] = ['INR'];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <button 
            onClick={() => handleNavClick('dashboard')} 
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-white shadow-xs group-hover:from-emerald-500 group-hover:to-blue-500 transition-all">
              <Zap className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1 font-sans">
                Social<span className="text-emerald-600">Flow</span>
              </span>
            </div>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Main Menu
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group text-left
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-xs font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                <span className="flex-1">{item.label}</span>
                {item.id === 'admin' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                    ROOT
                  </span>
                )}
                {item.id === 'new-order' && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}

          <div className="pt-5 mt-5 border-t border-slate-100">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
              Explore
            </div>
            <button
              onClick={() => handleNavClick('landing')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="flex-1">Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Currency & System Status Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          {/* Currency Display */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-500 font-medium">Currency:</span>
            <div className="flex items-center gap-1">
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                INR (₹)
              </span>
            </div>
          </div>

          {/* User mini card */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.role} Mode</p>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
