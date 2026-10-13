import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { AddFundsModal } from './components/common/AddFundsModal';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ServicesCatalogPage } from './components/services/ServicesCatalogPage';
import { NewOrderPage } from './components/orders/NewOrderPage';
import { OrdersListPage } from './components/orders/OrdersListPage';
import { WalletPage } from './components/wallet/WalletPage';
import { AdminPage } from './components/admin/AdminPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SupportTicketsPage } from './components/support/SupportTicketsPage';
import { ApiDocsPage } from './components/api-docs/ApiDocsPage';
import { ApiLogsPage } from './components/api-logs/ApiLogsPage';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPage, toastMessage } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on public landing page, render landing page
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage />
        <AuthModal />
        <AddFundsModal />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // Authenticated Portal Layout (Sidebar + TopHeader + Page)
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Header */}
        <TopHeader onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'services' && <ServicesCatalogPage />}
          {currentPage === 'new-order' && <NewOrderPage />}
          {currentPage === 'orders' && <OrdersListPage />}
          {currentPage === 'wallet' && <WalletPage />}
          {currentPage === 'tickets' && <SupportTicketsPage />}
          {currentPage === 'api-docs' && <ApiDocsPage />}
          {currentPage === 'api-logs' && <ApiLogsPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'admin' && <AdminPage />}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal />
      <AddFundsModal />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
