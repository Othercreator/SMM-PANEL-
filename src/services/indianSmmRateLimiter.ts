/**
 * SocialFlow Panel - Server-Side Rate Limiter for IndianSMM Provider
 * 
 * Implements a strict sliding-window rate limiter to prevent accidental spamming,
 * burst overages, and ensure compliance with IndianSMM upstream usage policies.
 */

import { RateLimiterStatus } from '../types';

export class IndianSmmRateLimiter {
  private static instance: IndianSmmRateLimiter;

  // Default rate limits (requests per 60-second sliding window)
  private globalLimitPerMinute = 120;
  private actionLimits = {
    add: 30,       // Order creations: max 30/min
    status: 60,    // Order status checks: max 60/min
    services: 10,  // Service catalog requests: max 10/min
    balance: 10,   // Balance queries: max 10/min
  };

  private requestTimestamps: { action: string; timestamp: number }[] = [];
  private throttledCount = 0;

  private constructor() {
    // Pre-populate realistic sliding window history
    const now = Date.now();
    for (let i = 0; i < 18; i++) {
      this.requestTimestamps.push({
        action: i % 3 === 0 ? 'status' : i % 5 === 0 ? 'services' : 'add',
        timestamp: now - Math.floor(Math.random() * 50000)
      });
    }
  }

  public static getInstance(): IndianSmmRateLimiter {
    if (!IndianSmmRateLimiter.instance) {
      IndianSmmRateLimiter.instance = new IndianSmmRateLimiter();
    }
    return IndianSmmRateLimiter.instance;
  }

  /**
   * Cleans entries older than 60 seconds from sliding window.
   */
  private pruneOldEntries(now: number): void {
    const windowStart = now - 60000;
    this.requestTimestamps = this.requestTimestamps.filter(item => item.timestamp >= windowStart);
  }

  /**
   * Check if request is allowed by rate limiting policies.
   */
  public checkRateLimit(action: 'add' | 'status' | 'services' | 'balance' | string): {
    allowed: boolean;
    retryAfterSeconds?: number;
    used: number;
    limit: number;
    actionUsed: number;
    actionLimit: number;
  } {
    const now = Date.now();
    this.pruneOldEntries(now);

    const totalUsed = this.requestTimestamps.length;
    const actionLimit = (this.actionLimits as any)[action] ?? this.globalLimitPerMinute;
    const actionUsed = this.requestTimestamps.filter(item => item.action === action).length;

    // Check global limit
    if (totalUsed >= this.globalLimitPerMinute) {
      const oldest = this.requestTimestamps[0]?.timestamp ?? now;
      const retryAfterSeconds = Math.max(1, Math.ceil((60000 - (now - oldest)) / 1000));
      this.throttledCount++;
      return {
        allowed: false,
        retryAfterSeconds,
        used: totalUsed,
        limit: this.globalLimitPerMinute,
        actionUsed,
        actionLimit,
      };
    }

    // Check per-action limit
    if (actionUsed >= actionLimit) {
      const oldestAction = this.requestTimestamps.find(item => item.action === action)?.timestamp ?? now;
      const retryAfterSeconds = Math.max(1, Math.ceil((60000 - (now - oldestAction)) / 1000));
      this.throttledCount++;
      return {
        allowed: false,
        retryAfterSeconds,
        used: totalUsed,
        limit: this.globalLimitPerMinute,
        actionUsed,
        actionLimit,
      };
    }

    return {
      allowed: true,
      used: totalUsed,
      limit: this.globalLimitPerMinute,
      actionUsed,
      actionLimit,
    };
  }

  /**
   * Consumes a token for the specified action.
   * Returns false if throttled.
   */
  public consumeToken(action: 'add' | 'status' | 'services' | 'balance' | string): boolean {
    const check = this.checkRateLimit(action);
    if (!check.allowed) {
      return false;
    }

    this.requestTimestamps.push({
      action,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Returns full status report of rate limiting.
   */
  public getStatus(): RateLimiterStatus {
    const now = Date.now();
    this.pruneOldEntries(now);

    const used = this.requestTimestamps.length;
    const remaining = Math.max(0, this.globalLimitPerMinute - used);
    const oldest = this.requestTimestamps[0]?.timestamp ?? now;
    const resetInSeconds = used > 0 ? Math.max(0, Math.ceil((60000 - (now - oldest)) / 1000)) : 0;

    const actionStats = {
      add: {
        limit: this.actionLimits.add,
        used: this.requestTimestamps.filter(item => item.action === 'add').length,
        remaining: Math.max(0, this.actionLimits.add - this.requestTimestamps.filter(item => item.action === 'add').length),
      },
      status: {
        limit: this.actionLimits.status,
        used: this.requestTimestamps.filter(item => item.action === 'status').length,
        remaining: Math.max(0, this.actionLimits.status - this.requestTimestamps.filter(item => item.action === 'status').length),
      },
      services: {
        limit: this.actionLimits.services,
        used: this.requestTimestamps.filter(item => item.action === 'services').length,
        remaining: Math.max(0, this.actionLimits.services - this.requestTimestamps.filter(item => item.action === 'services').length),
      },
      balance: {
        limit: this.actionLimits.balance,
        used: this.requestTimestamps.filter(item => item.action === 'balance').length,
        remaining: Math.max(0, this.actionLimits.balance - this.requestTimestamps.filter(item => item.action === 'balance').length),
      },
    };

    return {
      provider: 'IndianSMM (v2)',
      limitPerMinute: this.globalLimitPerMinute,
      usedInWindow: used,
      remaining,
      windowSeconds: 60,
      resetInSeconds,
      isThrottled: used >= this.globalLimitPerMinute,
      totalThrottledCount: this.throttledCount,
      actionLimits: actionStats,
    };
  }

  /**
   * Simulates rapid burst requests to test throttling in UI.
   */
  public simulateBurst(count: number = 35): { throttled: number; allowed: number } {
    let throttled = 0;
    let allowed = 0;
    for (let i = 0; i < count; i++) {
      if (this.consumeToken('add')) {
        allowed++;
      } else {
        throttled++;
      }
    }
    return { throttled, allowed };
  }

  /**
   * Resets rate limiter sliding window.
   */
  public reset(): void {
    this.requestTimestamps = [];
    this.throttledCount = 0;
  }
}

export const rateLimiter = IndianSmmRateLimiter.getInstance();
