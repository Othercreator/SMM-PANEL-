/**
 * SocialFlow Panel - 30-Day API Activity Analytics Engine
 * 
 * Aggregates and simulates daily metrics for IndianSMM provider API requests,
 * tracking successful vs. failed requests, latency trends, and recovery rates.
 */

import { ApiActivityDayStat, ApiActivitySummary } from '../types';

export function generateLast30DaysApiActivity(): ApiActivityDayStat[] {
  const days: ApiActivityDayStat[] = [];
  const now = new Date();

  // Generate 30 days from 29 days ago to today (day 0)
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    const dateLabel = `${monthName} ${dayNum}`;
    const fullDate = d.toISOString().split('T')[0];

    // Weekly traffic cycle: weekends slightly higher or distinct
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseVolume = isWeekend ? 340 : 280;
    
    // Variance factor with slight growth trend over the 30 days
    const trendGrowth = Math.floor((30 - i) * 3.5);
    const randomVariation = Math.floor(Math.sin(i * 0.7) * 40 + Math.random() * 30);
    const totalRequests = Math.max(120, baseVolume + trendGrowth + randomVariation);

    // Realistic failure rate between 1.2% and 3.8%
    const failurePercent = i === 4 ? 0.052 : (0.015 + Math.random() * 0.02);
    const failedRequests = Math.max(1, Math.round(totalRequests * failurePercent));
    const successfulRequests = totalRequests - failedRequests;
    const successRate = parseFloat(((successfulRequests / totalRequests) * 100).toFixed(1));

    // Response latency (120ms to 240ms with periodic spike)
    const baseLatency = 145 + Math.floor(Math.random() * 50);
    const latencySpike = i === 4 ? 85 : (i % 7 === 0 ? 35 : 0);
    const avgLatency = baseLatency + latencySpike;

    // Retries auto-recovered via exponential backoff (typically 70-90% of transient failures)
    const retriedRecovered = Math.max(0, Math.floor(failedRequests * 0.75));
    // Rate limit throttles prevented
    const throttledCount = Math.floor(Math.random() * 4);

    // Distribution across API actions
    const ordersCount = Math.round(totalRequests * 0.45);
    const statusChecksCount = Math.round(totalRequests * 0.40);
    const catalogSyncsCount = Math.round(totalRequests * 0.08);
    const balanceChecksCount = totalRequests - ordersCount - statusChecksCount - catalogSyncsCount;

    days.push({
      date: dateLabel,
      fullDate,
      successful: successfulRequests,
      failed: failedRequests,
      total: totalRequests,
      successRate,
      avgLatency,
      retriedRecovered,
      throttledCount,
      ordersCount,
      statusChecksCount,
      catalogSyncsCount,
      balanceChecksCount,
    });
  }

  return days;
}

export function calculate30DaySummary(days: ApiActivityDayStat[]): ApiActivitySummary {
  const totalRequests30D = days.reduce((acc, d) => acc + d.total, 0);
  const successful30D = days.reduce((acc, d) => acc + d.successful, 0);
  const failed30D = days.reduce((acc, d) => acc + d.failed, 0);
  const overallSuccessRate = totalRequests30D > 0 
    ? parseFloat(((successful30D / totalRequests30D) * 100).toFixed(2)) 
    : 100;
  const avgLatencyMs = days.length > 0 
    ? Math.round(days.reduce((acc, d) => acc + d.avgLatency, 0) / days.length) 
    : 160;
  const retriesRecovered30D = days.reduce((acc, d) => acc + d.retriedRecovered, 0);
  const throttlesPrevented30D = days.reduce((acc, d) => acc + d.throttledCount, 0);

  return {
    totalRequests30D,
    successful30D,
    failed30D,
    overallSuccessRate,
    avgLatencyMs,
    retriesRecovered30D,
    throttlesPrevented30D,
  };
}
