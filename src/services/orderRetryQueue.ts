/**
 * SocialFlow Panel - Server-Side Background Retry Job & Queue Engine
 * 
 * Automatically retries failed API order submissions with Exponential Backoff + Jitter
 * for transient connectivity issues (timeouts, 5xx gateway drops, 429 rate limit exceeded).
 */

import { FailedOrderRetryItem } from '../types';
import { rateLimiter } from './indianSmmRateLimiter';

export const INITIAL_RETRY_QUEUE: FailedOrderRetryItem[] = [
  {
    id: 'RETRY-10842',
    orderId: '#SF-98430',
    userId: 'usr_alex_vance',
    serviceId: '#YT-14',
    serviceName: 'YouTube Views | Non-Drop Safe Monetization',
    platform: 'YouTube',
    link: 'https://youtube.com/watch?v=tech_review_2026',
    quantity: 2500,
    charge: 287.50,
    attempts: 2,
    maxAttempts: 5,
    createdAt: new Date(Date.now() - 45000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    lastAttemptAt: new Date(Date.now() - 15000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    nextRetryAt: new Date(Date.now() + 22000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    nextRetryTimestamp: Date.now() + 22000,
    lastError: 'HTTP 504 Gateway Timeout from upstream indiansmm.xyz server cluster',
    status: 'pending',
    backoffDelaySeconds: 31
  },
  {
    id: 'RETRY-10841',
    orderId: '#SF-98428',
    userId: 'usr_alex_vance',
    serviceId: '#IG-01',
    serviceName: 'Instagram Followers [Premium Non-Drop 30D Refill]',
    platform: 'Instagram',
    link: 'https://instagram.com/creator_studio_in',
    quantity: 1000,
    charge: 115.00,
    attempts: 3,
    maxAttempts: 5,
    createdAt: new Date(Date.now() - 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    lastAttemptAt: new Date(Date.now() - 50000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    nextRetryAt: new Date(Date.now() + 35000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    nextRetryTimestamp: Date.now() + 35000,
    lastError: 'TLS Handshake Timeout (cURL Error 28) during high upstream congestion',
    status: 'pending',
    backoffDelaySeconds: 78
  },
  {
    id: 'RETRY-10839',
    orderId: '#SF-98425',
    userId: 'usr_alex_vance',
    serviceId: '#YT-01',
    serviceName: 'YouTube Subscribers | Real Quality',
    platform: 'YouTube',
    link: 'https://youtube.com/@techvibe_india',
    quantity: 500,
    charge: 290.00,
    attempts: 2,
    maxAttempts: 5,
    createdAt: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    lastAttemptAt: new Date(Date.now() - 250000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    nextRetryAt: new Date(Date.now() - 220000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    nextRetryTimestamp: Date.now() - 220000,
    lastError: 'Temporarily unavailable (HTTP 502 Bad Gateway)',
    status: 'succeeded',
    providerOrderId: '581904',
    backoffDelaySeconds: 15
  }
];

export class OrderRetryQueueEngine {
  private static instance: OrderRetryQueueEngine;
  private queue: FailedOrderRetryItem[] = [...INITIAL_RETRY_QUEUE];

  public static getInstance(): OrderRetryQueueEngine {
    if (!OrderRetryQueueEngine.instance) {
      OrderRetryQueueEngine.instance = new OrderRetryQueueEngine();
    }
    return OrderRetryQueueEngine.instance;
  }

  public getQueue(): FailedOrderRetryItem[] {
    return [...this.queue];
  }

  /**
   * Calculate exponential backoff delay with random jitter.
   * Formula: delay = min(600, 5 * (2.5 ^ attempts)) + jitter
   */
  public calculateBackoffDelay(attempts: number): number {
    const base = 5;
    const multiplier = 2.5;
    const calc = Math.min(600, Math.round(base * Math.pow(multiplier, attempts)));
    // ±15% jitter to prevent thundering herd
    const jitter = Math.floor(calc * 0.15 * (Math.random() * 2 - 1));
    return Math.max(5, calc + jitter);
  }

  /**
   * Enqueue a new failed order into the retry queue.
   */
  public enqueue(item: Omit<FailedOrderRetryItem, 'id' | 'attempts' | 'maxAttempts' | 'createdAt' | 'lastAttemptAt' | 'nextRetryAt' | 'nextRetryTimestamp' | 'status' | 'backoffDelaySeconds'>): FailedOrderRetryItem {
    const now = Date.now();
    const delay = this.calculateBackoffDelay(1);
    const nextRetryTimestamp = now + delay * 1000;

    const newItem: FailedOrderRetryItem = {
      ...item,
      id: `RETRY-${Math.floor(10000 + Math.random() * 90000)}`,
      attempts: 1,
      maxAttempts: 5,
      createdAt: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      lastAttemptAt: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      nextRetryAt: new Date(nextRetryTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      nextRetryTimestamp,
      status: 'pending',
      backoffDelaySeconds: delay,
    };

    this.queue = [newItem, ...this.queue];
    return newItem;
  }

  /**
   * Process all pending retries due for execution.
   */
  public processDueRetries(
    onSuccess?: (item: FailedOrderRetryItem, providerOrderId: string) => void,
    onPermanentFail?: (item: FailedOrderRetryItem) => void
  ): { processed: number; succeeded: number; rescheduled: number; permanentlyFailed: number } {
    const now = Date.now();
    let processed = 0;
    let succeeded = 0;
    let rescheduled = 0;
    let permanentlyFailed = 0;

    this.queue = this.queue.map(item => {
      if (item.status !== 'pending' || now < item.nextRetryTimestamp) {
        return item;
      }

      processed++;

      // Check rate limiter before executing outgoing provider request
      const rateCheck = rateLimiter.checkRateLimit('add');
      if (!rateCheck.allowed) {
        // Postpone retry by rate limiter reset time
        const delaySec = rateCheck.retryAfterSeconds || 10;
        return {
          ...item,
          nextRetryTimestamp: now + delaySec * 1000,
          nextRetryAt: new Date(now + delaySec * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          lastError: `Rate limit throttling active (waiting ${delaySec}s for window reset)`
        };
      }

      // Consume rate limit token
      rateLimiter.consumeToken('add');

      // Simulate provider response: 70% chance of transient resolution, 30% still busy
      const isResolved = Math.random() > 0.35 || item.attempts >= 3;

      if (isResolved) {
        succeeded++;
        const providerOrderId = `${Math.floor(600000 + Math.random() * 300000)}`;
        const updated: FailedOrderRetryItem = {
          ...item,
          status: 'succeeded',
          providerOrderId,
          lastAttemptAt: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        if (onSuccess) onSuccess(updated, providerOrderId);
        return updated;
      } else {
        const nextAttempts = item.attempts + 1;
        if (nextAttempts > item.maxAttempts) {
          permanentlyFailed++;
          const failed: FailedOrderRetryItem = {
            ...item,
            attempts: nextAttempts,
            status: 'permanently_failed',
            lastAttemptAt: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            lastError: 'Exceeded maximum exponential backoff attempts (5/5). Marked permanently failed.',
          };
          if (onPermanentFail) onPermanentFail(failed);
          return failed;
        } else {
          rescheduled++;
          const delaySec = this.calculateBackoffDelay(nextAttempts);
          const nextTs = now + delaySec * 1000;
          return {
            ...item,
            attempts: nextAttempts,
            status: 'pending',
            backoffDelaySeconds: delaySec,
            lastAttemptAt: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            nextRetryTimestamp: nextTs,
            nextRetryAt: new Date(nextTs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            lastError: `Transient upstream connectivity error (Attempt ${nextAttempts} scheduled in ${delaySec}s)`
          };
        }
      }
    });

    return { processed, succeeded, rescheduled, permanentlyFailed };
  }

  /**
   * Manually trigger immediate retry for an item.
   */
  public retryNow(
    id: string,
    onSuccess?: (item: FailedOrderRetryItem, providerOrderId: string) => void
  ): boolean {
    const item = this.queue.find(q => q.id === id);
    if (!item) return false;

    rateLimiter.consumeToken('add');
    const now = Date.now();
    const providerOrderId = `${Math.floor(600000 + Math.random() * 300000)}`;

    this.queue = this.queue.map(q => {
      if (q.id === id) {
        const updated: FailedOrderRetryItem = {
          ...q,
          status: 'succeeded',
          providerOrderId,
          lastAttemptAt: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        if (onSuccess) onSuccess(updated, providerOrderId);
        return updated;
      }
      return q;
    });

    return true;
  }

  /**
   * Generate a simulated transient failure to demonstrate live exponential backoff in UI.
   */
  public simulateFailure(
    serviceName: string = 'YouTube Video Views [Non-Drop Safe Monetization]',
    platform: string = 'YouTube',
    charge: number = 195.00
  ): FailedOrderRetryItem {
    return this.enqueue({
      orderId: `#SF-${Math.floor(98000 + Math.random() * 1000)}`,
      userId: 'usr_alex_vance',
      serviceId: '#YT-14',
      serviceName,
      platform,
      link: 'https://youtube.com/watch?v=live_broadcast_' + Math.floor(Math.random() * 1000),
      quantity: 1500,
      charge,
      lastError: 'HTTP 504 Gateway Timeout: IndianSMM upstream cluster socket timed out',
    });
  }

  /**
   * Remove succeeded or permanently failed items.
   */
  public clearCompleted(): void {
    this.queue = this.queue.filter(q => q.status === 'pending');
  }
}

export const retryQueueEngine = OrderRetryQueueEngine.getInstance();
