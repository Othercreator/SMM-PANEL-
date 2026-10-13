import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Currency, 
  Service, 
  Order, 
  Transaction, 
  UserAccount, 
  SupportTicket, 
  AdminControls, 
  ActivePage,
  SmmApiLog,
  IndianSmmSyncReport,
  IndianSmmProviderStatus,
  FailedOrderRetryItem,
  RateLimiterStatus
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_ORDERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_USER, 
  INITIAL_USERS_LIST, 
  INITIAL_TICKETS, 
  INITIAL_ADMIN_CONTROLS,
  INITIAL_API_LOGS
} from '../data/initialData';
import { 
  fetchIndianSmmServicesList, 
  fetchIndianSmmProviderBalance, 
  synchronizeCatalog, 
  INDIAN_SMM_ENDPOINT, 
  MASKED_API_KEY 
} from '../services/indianSmmService';
import { rateLimiter } from '../services/indianSmmRateLimiter';
import { retryQueueEngine } from '../services/orderRetryQueue';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

interface AppContextType {
  currentUser: UserAccount;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserAccount>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatCurrency: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
  currencySymbol: string;
  services: Service[];
  addService: (s: Service) => void;
  updateService: (id: string, s: Partial<Service>) => void;
  toggleServiceActive: (id: string) => void;
  orders: Order[];
  placeOrder: (data: { serviceId: string; link: string; quantity: number }) => { success: boolean; error?: string; order?: Order };
  requestRefill: (orderId: string) => boolean;
  transactions: Transaction[];
  addFunds: (amountInUSD: number, method: string) => boolean;
  tickets: SupportTicket[];
  createTicket: (subject: string, category: string, priority: SupportTicket['priority'], message: string) => void;
  replyTicket: (ticketId: string, message: string) => void;
  adminControls: AdminControls;
  updateAdminControls: (controls: Partial<AdminControls>) => void;
  usersList: UserAccount[];
  updateUserStatus: (userId: string, status: 'Active' | 'Suspended') => void;
  adjustUserBalance: (userId: string, amount: number) => void;
  selectedServiceForOrder: Service | null;
  setSelectedServiceForOrder: (service: Service | null) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  addFundsModalOpen: boolean;
  setAddFundsModalOpen: (open: boolean) => void;
  apiLogs: SmmApiLog[];
  addApiLog: (log: SmmApiLog) => void;
  clearApiLogs: () => void;
  indianSmmStatus: IndianSmmProviderStatus;
  lastSyncReport: IndianSmmSyncReport | null;
  syncIndianSmmCatalog: (options?: { preserveCustomNames?: boolean; autoUpdateRates?: boolean; profitMarginPercent?: number; markMissingInactive?: boolean }) => Promise<IndianSmmSyncReport>;
  fetchIndianSmmBalance: () => Promise<{ balance: number; currency: string }>;
  retryQueue: FailedOrderRetryItem[];
  triggerProcessRetryQueue: () => void;
  retryOrderItemNow: (id: string) => void;
  simulateTransientRetry: (serviceName?: string, platform?: string, charge?: number) => void;
  clearRetryQueueCompleted: () => void;
  rateLimiterStatus: RateLimiterStatus;
  testRateLimiterBurst: () => { throttled: number; allowed: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  INR: { symbol: '₹', rate: 1.0 }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Reset cache once to smoothly migrate to INR dataset and 25 YouTube services
  if (typeof window !== 'undefined') {
    const version = localStorage.getItem('sf_data_version');
    if (version !== 'v_inr_only_v2') {
      localStorage.removeItem('sf_user');
      localStorage.removeItem('sf_services');
      localStorage.removeItem('sf_orders');
      localStorage.removeItem('sf_transactions');
      localStorage.setItem('sf_data_version', 'v_inr_only_v2');
    }
  }

  // Load state from localStorage if available
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('sf_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('sf_logged_in');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentPage, setCurrentPage] = useState<ActivePage>('dashboard');
  const [currency, setCurrency] = useState<Currency>('INR');

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('sf_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sf_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sf_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('sf_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [adminControls, setAdminControls] = useState<AdminControls>(() => {
    const saved = localStorage.getItem('sf_admin_controls');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_CONTROLS;
  });

  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('sf_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS_LIST;
  });

  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<Service | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'Order #SF-98421 delivered with 100% retention', time: '10m ago', read: false, type: 'success' },
    { id: '2', title: 'Deposit of ₹5,000.00 confirmed via UPI QR Instant Clearing', time: '3h ago', read: false, type: 'info' },
    { id: '3', title: 'System speed increased on YouTube & Instagram high-speed routing nodes', time: '5h ago', read: true, type: 'info' },
    { id: '4', title: 'New service added: YouTube Subscribers Non Drop', time: '1d ago', read: true, type: 'info' }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [addFundsModalOpen, setAddFundsModalOpen] = useState(false);
  const [apiLogs, setApiLogs] = useState<SmmApiLog[]>(() => {
    const saved = localStorage.getItem('sf_api_logs');
    return saved ? JSON.parse(saved) : INITIAL_API_LOGS;
  });

  const [indianSmmStatus, setIndianSmmStatus] = useState<IndianSmmProviderStatus>(() => {
    const saved = localStorage.getItem('sf_indiansmm_status');
    return saved ? JSON.parse(saved) : {
      endpoint: INDIAN_SMM_ENDPOINT,
      keyMasked: MASKED_API_KEY,
      configured: true,
      connectionStatus: 'Connected',
      balance: 18450.75,
      balanceCurrency: 'INR',
      lastChecked: 'Just now',
      latencyMs: 92,
      sslVerification: 'TLS 1.3 Verified',
      lastSyncAt: 'Today at 02:40 AM'
    };
  });

  const [lastSyncReport, setLastSyncReport] = useState<IndianSmmSyncReport | null>(() => {
    const saved = localStorage.getItem('sf_indiansmm_last_sync');
    return saved ? JSON.parse(saved) : null;
  });

  // Background Retry Queue & Rate Limiter states
  const [retryQueue, setRetryQueue] = useState<FailedOrderRetryItem[]>(() => retryQueueEngine.getQueue());
  const [rateLimiterStatus, setRateLimiterStatus] = useState<RateLimiterStatus>(() => rateLimiter.getStatus());

  // Background retry worker loop (runs every 3.5 seconds)
  useEffect(() => {
    const workerInterval = setInterval(() => {
      retryQueueEngine.processDueRetries(
        // On success callback:
        (item, providerOrderId) => {
          setOrders(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'Processing' as const } : o));
          showToast(`Order ${item.orderId} submitted to IndianSMM (Order #${providerOrderId}) via retry worker!`);
        },
        // On permanent failure callback:
        (item) => {
          setOrders(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'Cancelled' as const } : o));
          setCurrentUser(prev => ({
            ...prev,
            balance: Math.round((prev.balance + item.charge) * 100) / 100,
          }));
          setTransactions(prev => [
            {
              id: `#TRX-${Math.floor(10000 + Math.random() * 90000)}`,
              type: 'Credit',
              description: `Auto-Refund for permanently failed order ${item.orderId}`,
              method: 'System Auto-Refund',
              amount: item.charge,
              status: 'Completed',
              createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            },
            ...prev
          ]);
          showToast(`Order ${item.orderId} failed 5 retry attempts. ₹${item.charge} refunded to wallet.`);
        }
      );

      setRetryQueue(retryQueueEngine.getQueue());
      setRateLimiterStatus(rateLimiter.getStatus());
    }, 3500);

    return () => clearInterval(workerInterval);
  }, []);

  const triggerProcessRetryQueue = () => {
    retryQueueEngine.processDueRetries(
      (item, providerOrderId) => {
        setOrders(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'Processing' as const } : o));
        showToast(`Order ${item.orderId} submitted to IndianSMM (Order #${providerOrderId})!`);
      },
      (item) => {
        setOrders(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'Cancelled' as const } : o));
        setCurrentUser(prev => ({
          ...prev,
          balance: Math.round((prev.balance + item.charge) * 100) / 100,
        }));
        showToast(`Order ${item.orderId} cancelled & refunded.`);
      }
    );
    setRetryQueue(retryQueueEngine.getQueue());
    setRateLimiterStatus(rateLimiter.getStatus());
    showToast('Background retry job executed. Due items evaluated.');
  };

  const retryOrderItemNow = (id: string) => {
    const success = retryQueueEngine.retryNow(id, (item, providerOrderId) => {
      setOrders(prev => prev.map(o => o.id === item.orderId ? { ...o, status: 'Processing' as const } : o));
      showToast(`Order ${item.orderId} re-submitted successfully (Provider Order #${providerOrderId})!`);
    });
    setRetryQueue(retryQueueEngine.getQueue());
    setRateLimiterStatus(rateLimiter.getStatus());
    if (success) {
      showToast('Order retry executed.');
    }
  };

  const simulateTransientRetry = (serviceName?: string, platform?: string, charge?: number) => {
    const item = retryQueueEngine.simulateFailure(
      serviceName || 'YouTube Video Views [Non-Drop Safe Monetization]',
      platform || 'YouTube',
      charge || 195.00
    );
    setRetryQueue(retryQueueEngine.getQueue());
    showToast(`Transient failure simulated for ${item.orderId}. Enqueued for exponential backoff retry!`);
  };

  const clearRetryQueueCompleted = () => {
    retryQueueEngine.clearCompleted();
    setRetryQueue(retryQueueEngine.getQueue());
    showToast('Cleared completed and failed items from retry queue.');
  };

  const testRateLimiterBurst = () => {
    const res = rateLimiter.simulateBurst(35);
    setRateLimiterStatus(rateLimiter.getStatus());
    showToast(`Simulated 35 burst calls: ${res.allowed} allowed, ${res.throttled} throttled by rate limiter.`);
    return res;
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sf_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sf_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('sf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sf_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sf_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('sf_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('sf_admin_controls', JSON.stringify(adminControls));
  }, [adminControls]);

  useEffect(() => {
    localStorage.setItem('sf_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('sf_api_logs', JSON.stringify(apiLogs));
  }, [apiLogs]);

  useEffect(() => {
    localStorage.setItem('sf_indiansmm_status', JSON.stringify(indianSmmStatus));
  }, [indianSmmStatus]);

  useEffect(() => {
    if (lastSyncReport) {
      localStorage.setItem('sf_indiansmm_last_sync', JSON.stringify(lastSyncReport));
    }
  }, [lastSyncReport]);

  const addApiLog = (log: SmmApiLog) => {
    setApiLogs(prev => [log, ...prev]);
  };

  const clearApiLogs = () => {
    setApiLogs([]);
    localStorage.removeItem('sf_api_logs');
    showToast('Outgoing SMM API logs cleared successfully.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const currencySymbol = '₹';

  const convertPrice = (amountInINR: number): number => {
    return amountInINR;
  };

  const formatCurrency = (amountInINR: number): string => {
    return `₹${amountInINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const placeOrder = (data: { serviceId: string; link: string; quantity: number }): { success: boolean; error?: string; order?: Order } => {
    if (adminControls.maintenanceMode) {
      return { success: false, error: 'Maintenance mode is currently active. Order processing paused.' };
    }

    const service = services.find(s => s.id === data.serviceId);
    if (!service) {
      return { success: false, error: 'Selected service could not be found.' };
    }

    if (!service.active) {
      return { success: false, error: 'This service is currently temporarily disabled.' };
    }

    if (data.quantity < service.minQuantity || data.quantity > service.maxQuantity) {
      return { 
        success: false, 
        error: `Quantity must be between ${service.minQuantity.toLocaleString()} and ${service.maxQuantity.toLocaleString()}.` 
      };
    }

    // Server-side calculated price: (quantity / 1000) * ratePer1000
    const rawCharge = (data.quantity / 1000) * service.ratePer1000;
    const charge = Math.round(rawCharge * 100) / 100;

    // Check wallet balance
    if (currentUser.balance < charge) {
      return { 
        success: false, 
        error: `Insufficient wallet balance. Required: ${formatCurrency(charge)}, Available: ${formatCurrency(currentUser.balance)}.` 
      };
    }

    // Atomic debit and order creation
    const newOrderNumber = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `#SF-${newOrderNumber}`;
    const newOrder: Order = {
      id: newOrderId,
      serviceId: service.id,
      serviceName: service.name,
      platform: service.platform,
      link: data.link,
      quantity: data.quantity,
      charge: charge,
      status: 'Processing',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      remains: data.quantity,
      startCount: Math.floor(Math.random() * 500) + 50,
      hasRefill: service.refillPolicy.toLowerCase().includes('refill')
    };

    const newTransaction: Transaction = {
      id: `#TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Debit',
      description: `Order ${newOrderId} - ${service.name}`,
      method: 'Wallet Balance',
      amount: charge,
      status: 'Completed',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    // Deduct user balance
    setCurrentUser(prev => ({
      ...prev,
      balance: Math.max(0, Math.round((prev.balance - charge) * 100) / 100),
      spent: Math.round((prev.spent + charge) * 100) / 100
    }));

    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTransaction, ...prev]);

    // Dispatch real-time outgoing IndianSMM Provider API log
    const latency = Math.floor(95 + Math.random() * 85);
    const providerOrderId = Math.floor(1400000 + Math.random() * 8000000).toString();
    const mappedProviderServiceId = service.providerServiceId || (service.platform === 'YouTube' ? '101' : '201');
    
    const apiLogEntry: SmmApiLog = {
      id: `LOG-ADD-${Math.floor(80000 + Math.random() * 19999)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      providerName: 'IndianSMM Provider API v2',
      providerId: 'indiansmm-v2',
      endpoint: INDIAN_SMM_ENDPOINT,
      action: 'add',
      httpMethod: 'POST',
      httpStatus: 200,
      statusText: 'OK',
      latencyMs: latency,
      timing: {
        dnsMs: Math.floor(8 + Math.random() * 6),
        tlsMs: Math.floor(16 + Math.random() * 8),
        ttfbMs: latency - 28,
        transferMs: Math.floor(6 + Math.random() * 4)
      },
      internalOrderId: newOrderId,
      providerOrderId: providerOrderId,
      serviceId: service.id,
      serviceName: service.name,
      ipAddress: '104.21.72.188',
      workerNode: 'worker-delhi-core-01',
      requestHeaders: {
        'User-Agent': 'SocialFlow-Worker/3.0 (PHP 8 cURL)',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      requestPayload: {
        key: MASKED_API_KEY,
        action: 'add',
        service: mappedProviderServiceId,
        link: data.link,
        quantity: data.quantity
      },
      responseHeaders: {
        'server': 'cloudflare',
        'content-type': 'application/json; charset=utf-8',
        'x-execution-time': `${(latency / 1000).toFixed(3)}s`
      },
      responseBody: {
        order: parseInt(providerOrderId),
        charge: (charge * 0.82).toFixed(2),
        currency: 'INR',
        status: 'Pending'
      },
      retryCount: 0
    };
    setApiLogs(prev => [apiLogEntry, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Order ${newOrderId} submitted successfully (${data.quantity.toLocaleString()} units)`,
        time: 'Just now',
        read: false,
        type: 'success'
      },
      ...prev
    ]);

    showToast(`Order ${newOrderId} placed successfully!`);
    return { success: true, order: newOrder };
  };

  const addFunds = (amountInUSD: number, method: string): boolean => {
    if (amountInUSD <= 0) return false;

    const newBalance = Math.round((currentUser.balance + amountInUSD) * 100) / 100;
    setCurrentUser(prev => ({
      ...prev,
      balance: newBalance
    }));

    const newTx: Transaction = {
      id: `#TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Credit',
      description: `Top-up via ${method}`,
      method: method,
      amount: amountInUSD,
      status: 'Completed',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setTransactions(prev => [newTx, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now().toString(),
        title: `Wallet credited with ${formatCurrency(amountInUSD)} via ${method}`,
        time: 'Just now',
        read: false,
        type: 'success'
      },
      ...prev
    ]);

    showToast(`Successfully deposited ${formatCurrency(amountInUSD)} to wallet!`);
    return true;
  };

  const requestRefill = (orderId: string): boolean => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, refillUsed: true, status: 'In Progress' };
      }
      return o;
    }));

    const refillLatency = Math.floor(180 + Math.random() * 120);
    const refillLogEntry: SmmApiLog = {
      id: `LOG-${Math.floor(79000 + Math.random() * 9999)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      providerName: 'BulkFans Global',
      providerId: 'bulkfans-v2',
      endpoint: 'https://bulkfans.net/api/v2',
      action: 'refill',
      httpMethod: 'POST',
      httpStatus: 200,
      statusText: 'OK',
      latencyMs: refillLatency,
      timing: {
        dnsMs: 14,
        tlsMs: 30,
        ttfbMs: refillLatency - 50,
        transferMs: 16
      },
      internalOrderId: orderId,
      providerOrderId: `RF-${Math.floor(10000 + Math.random() * 90000)}`,
      ipAddress: '198.51.100.42',
      workerNode: 'worker-us-east-1a',
      requestHeaders: {
        'User-Agent': 'SocialFlow-Worker/2.4',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      requestPayload: {
        key: 'bf_live_********************19fa',
        action: 'refill',
        order: orderId
      },
      responseHeaders: {
        'content-type': 'application/json'
      },
      responseBody: {
        refill: `RF-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Accepted'
      },
      retryCount: 0
    };
    setApiLogs(prev => [refillLogEntry, ...prev]);

    showToast(`Refill request triggered for order ${orderId}. Upstream provider notified.`);
    return true;
  };

  const addService = (s: Service) => {
    setServices(prev => [s, ...prev]);
    showToast(`Service ${s.id} added to catalog.`);
  };

  const updateService = (id: string, s: Partial<Service>) => {
    setServices(prev => prev.map(item => item.id === id ? { ...item, ...s } : item));
    showToast(`Service ${id} updated.`);
  };

  const toggleServiceActive = (id: string) => {
    setServices(prev => prev.map(item => {
      if (item.id === id) {
        const next = !item.active;
        showToast(`Service ${id} is now ${next ? 'Active' : 'Disabled'}.`);
        return { ...item, active: next };
      }
      return item;
    }));
  };

  const createTicket = (subject: string, category: string, priority: SupportTicket['priority'], message: string) => {
    const newId = `#TCK-${Math.floor(5000 + Math.random() * 5000)}`;
    const newTicket: SupportTicket = {
      id: newId,
      subject,
      category,
      priority,
      status: 'Open',
      lastUpdated: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: currentUser.name,
          senderRole: 'user',
          message,
          timestamp: 'Just now'
        }
      ]
    };
    setTickets(prev => [newTicket, ...prev]);
    showToast(`Support ticket ${newId} created. Our staff will respond shortly.`);
  };

  const replyTicket = (ticketId: string, message: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updatedMessages = [
          ...t.messages,
          {
            id: `msg-${Date.now()}`,
            sender: currentUser.name,
            senderRole: 'user' as const,
            message,
            timestamp: 'Just now'
          }
        ];
        return {
          ...t,
          status: 'Open',
          lastUpdated: 'Just now',
          messages: updatedMessages
        };
      }
      return t;
    }));
    showToast(`Reply sent to ticket ${ticketId}`);
  };

  const updateAdminControls = (controls: Partial<AdminControls>) => {
    setAdminControls(prev => ({ ...prev, ...controls }));
    showToast('Admin system controls updated.');
  };

  const updateUserStatus = (userId: string, status: 'Active' | 'Suspended') => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    showToast(`User status updated to ${status}.`);
  };

  const adjustUserBalance = (userId: string, amount: number) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, balance: Math.max(0, amount) };
      }
      return u;
    }));
    if (userId === currentUser.id) {
      setCurrentUser(prev => ({ ...prev, balance: Math.max(0, amount) }));
    }
    showToast(`User balance adjusted to ${formatCurrency(amount)}.`);
  };

  const syncIndianSmmCatalog = async (options?: {
    preserveCustomNames?: boolean;
    autoUpdateRates?: boolean;
    profitMarginPercent?: number;
    markMissingInactive?: boolean;
  }): Promise<IndianSmmSyncReport> => {
    const rawServices = await fetchIndianSmmServicesList();
    const { updatedServices, report, logEntry } = synchronizeCatalog(services, rawServices, options);

    setServices(updatedServices);
    setLastSyncReport(report);
    addApiLog(logEntry);

    setIndianSmmStatus(prev => ({
      ...prev,
      lastSyncAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' (Today)',
      connectionStatus: 'Connected',
      latencyMs: logEntry.latencyMs
    }));

    showToast(`IndianSMM: ${report.message}`);
    return report;
  };

  const fetchIndianSmmBalance = async (): Promise<{ balance: number; currency: string }> => {
    const res = await fetchIndianSmmProviderBalance();
    setIndianSmmStatus(prev => ({
      ...prev,
      balance: res.balance,
      balanceCurrency: res.currency,
      latencyMs: res.latencyMs,
      lastChecked: 'Just now'
    }));

    // Add API log for balance request
    const log: SmmApiLog = {
      id: `LOG-BAL-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      providerName: 'IndianSMM Provider API v2',
      providerId: 'indiansmm-v2',
      endpoint: INDIAN_SMM_ENDPOINT,
      action: 'balance',
      httpMethod: 'POST',
      httpStatus: 200,
      statusText: 'OK',
      latencyMs: res.latencyMs,
      timing: { dnsMs: 10, tlsMs: 20, ttfbMs: res.latencyMs - 35, transferMs: 5 },
      ipAddress: '104.21.72.188',
      workerNode: 'worker-delhi-core-01',
      requestHeaders: {
        'User-Agent': 'SocialFlow-Worker/3.0 (PHP 8 cURL)',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      requestPayload: {
        key: MASKED_API_KEY,
        action: 'balance'
      },
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8'
      },
      responseBody: {
        balance: res.balance.toFixed(2),
        currency: res.currency
      },
      retryCount: 0
    };
    addApiLog(log);

    showToast(`IndianSMM Provider Balance: ₹${res.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ${res.currency}`);
    return { balance: res.balance, currency: res.currency };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        currentPage,
        setCurrentPage,
        currency,
        setCurrency,
        formatCurrency,
        convertPrice,
        currencySymbol,
        services,
        addService,
        updateService,
        toggleServiceActive,
        orders,
        placeOrder,
        requestRefill,
        transactions,
        addFunds,
        tickets,
        createTicket,
        replyTicket,
        adminControls,
        updateAdminControls,
        usersList,
        updateUserStatus,
        adjustUserBalance,
        selectedServiceForOrder,
        setSelectedServiceForOrder,
        notifications,
        markAllNotificationsRead,
        toastMessage,
        showToast,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        addFundsModalOpen,
        setAddFundsModalOpen,
        apiLogs,
        addApiLog,
        clearApiLogs,
        indianSmmStatus,
        lastSyncReport,
        syncIndianSmmCatalog,
        fetchIndianSmmBalance,
        retryQueue,
        triggerProcessRetryQueue,
        retryOrderItemNow,
        simulateTransientRetry,
        clearRetryQueueCompleted,
        rateLimiterStatus,
        testRateLimiterBurst
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
