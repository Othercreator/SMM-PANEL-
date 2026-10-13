export type Currency = 'INR';

export interface Service {
  id: string;
  providerServiceId?: string; // Mapped IndianSMM provider service ID stored separately
  providerName?: string;      // 'IndianSMM'
  providerRate?: number;      // Original provider wholesale rate in INR
  lastSyncedAt?: string;      // Timestamp of last successful catalog synchronization
  name: string;
  category: string;
  platform: 'Instagram' | 'TikTok' | 'Twitter / X' | 'YouTube' | 'Telegram' | 'Facebook' | 'LinkedIn' | 'Spotify' | 'Discord' | 'WhatsApp' | 'Threads' | 'Music & Streaming' | 'Website Traffic' | 'Other Services' | string;
  ratePer1000: number; // in INR base (₹)
  minQuantity: number;
  maxQuantity: number;
  description: string;
  startTime: string;
  speed: string;
  quality: string;
  refillPolicy: string;
  averageDropRate: string;
  linkFormat: string;
  instructions: string;
  active: boolean;
  badgeTag?: string;
}

export interface IndianSmmSyncReport {
  timestamp: string;
  totalFetched: number;
  matchedCount: number;
  preservedCount: number;
  ratesUpdatedCount: number;
  inactiveMarkedCount: number;
  status: 'success' | 'partial' | 'failed';
  message: string;
  details?: string[];
}

export interface IndianSmmProviderStatus {
  endpoint: string;
  keyMasked: string;
  configured: boolean;
  connectionStatus: 'Connected' | 'Disconnected' | 'Degraded' | 'Checking';
  balance: number | null;
  balanceCurrency: string;
  lastChecked: string;
  latencyMs: number;
  sslVerification: 'TLS 1.3 Verified' | 'Pending' | 'Error';
  lastSyncAt: string | null;
}

export type OrderStatus = 'Completed' | 'Processing' | 'In Progress' | 'Pending' | 'Cancelled' | 'Refunded';

export interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  platform: string;
  link: string;
  quantity: number;
  charge: number; // in USD
  status: OrderStatus;
  createdAt: string;
  remains: number;
  startCount: number;
  hasRefill: boolean;
  refillUsed?: boolean;
}

export type TransactionType = 'Credit' | 'Debit';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  method: string;
  amount: number; // in USD
  status: TransactionStatus;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Customer' | 'Reseller';
  balance: number; // in USD
  spent: number; // in USD
  status: 'Active' | 'Suspended';
  avatar?: string;
  company: string;
  tagline: string;
  timezone: string;
  language: string;
  twoFactorEnabled: boolean;
  apiKey: string;
  notificationPreferences: {
    emailDigest: boolean;
    campaignAlerts: boolean;
    securityWarnings: boolean;
    marketingUpdates: boolean;
  };
}

export interface SupportTicketMessage {
  id: string;
  sender: string;
  senderRole: 'user' | 'agent';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Answered' | 'Closed';
  lastUpdated: string;
  messages: SupportTicketMessage[];
}

export interface SmmApiLog {
  id: string;
  timestamp: string;
  providerName: string;
  providerId: string;
  endpoint: string;
  action: 'add' | 'status' | 'refill' | 'balance' | 'services' | 'cancel';
  httpMethod: 'POST' | 'GET';
  httpStatus: number;
  statusText: string;
  latencyMs: number;
  timing: {
    dnsMs: number;
    tlsMs: number;
    ttfbMs: number;
    transferMs: number;
  };
  internalOrderId?: string;
  providerOrderId?: string;
  serviceId?: string;
  serviceName?: string;
  ipAddress: string;
  workerNode: string;
  requestHeaders: Record<string, string>;
  requestPayload: Record<string, any>;
  responseHeaders: Record<string, string>;
  responseBody: Record<string, any> | string;
  retryCount: number;
}

export interface AdminControls {
  maintenanceMode: boolean;
  autoRefillSystem: boolean;
  apiGateways: boolean;
}

export type ActivePage = 
  | 'landing'
  | 'dashboard'
  | 'services'
  | 'new-order'
  | 'orders'
  | 'wallet'
  | 'tickets'
  | 'profile'
  | 'admin'
  | 'api-docs'
  | 'api-logs';

export interface FailedOrderRetryItem {
  id: string;
  orderId: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  platform: string;
  link: string;
  quantity: number;
  charge: number;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  lastAttemptAt: string;
  nextRetryAt: string;
  nextRetryTimestamp: number;
  lastError: string;
  status: 'pending' | 'retrying' | 'succeeded' | 'permanently_failed';
  providerOrderId?: string;
  backoffDelaySeconds: number;
}

export interface RateLimiterStatus {
  provider: string;
  limitPerMinute: number;
  usedInWindow: number;
  remaining: number;
  windowSeconds: number;
  resetInSeconds: number;
  isThrottled: boolean;
  totalThrottledCount: number;
  actionLimits: {
    add: { limit: number; used: number; remaining: number };
    status: { limit: number; used: number; remaining: number };
    services: { limit: number; used: number; remaining: number };
    balance: { limit: number; used: number; remaining: number };
  };
}

export interface ApiActivityDayStat {
  date: string;
  fullDate: string;
  successful: number;
  failed: number;
  total: number;
  successRate: number;
  avgLatency: number;
  retriedRecovered: number;
  throttledCount: number;
  ordersCount: number;
  statusChecksCount: number;
  catalogSyncsCount: number;
  balanceChecksCount: number;
}

export interface ApiActivitySummary {
  totalRequests30D: number;
  successful30D: number;
  failed30D: number;
  overallSuccessRate: number;
  avgLatencyMs: number;
  retriesRecovered30D: number;
  throttlesPrevented30D: number;
}

