/**
 * APP-4:12 — Executive Memory Dashboard statistics service.
 */

import type { ExecutiveMemoryDashboardStatistics } from "./executiveMemoryDashboardTypes.ts";

let dashboardRefreshes = 0;
let lastAggregationDurationMs = 0;
let totalAggregationDurationMs = 0;
let validationFailures = 0;
const sectionGenerationTimesMs: Record<string, number> = {};

export function resetExecutiveMemoryDashboardStatisticsForTests(): void {
  dashboardRefreshes = 0;
  lastAggregationDurationMs = 0;
  totalAggregationDurationMs = 0;
  validationFailures = 0;
  for (const key of Object.keys(sectionGenerationTimesMs)) delete sectionGenerationTimesMs[key];
}

export function recordExecutiveMemoryDashboardRefresh(input: {
  aggregationDurationMs: number;
  sectionTimesMs: Readonly<Record<string, number>>;
  validationFailed: boolean;
}): void {
  dashboardRefreshes += 1;
  lastAggregationDurationMs = input.aggregationDurationMs;
  totalAggregationDurationMs += input.aggregationDurationMs;
  if (input.validationFailed) validationFailures += 1;
  for (const [section, durationMs] of Object.entries(input.sectionTimesMs)) {
    sectionGenerationTimesMs[section] = durationMs;
  }
}

export function getExecutiveMemoryDashboardStatistics(): ExecutiveMemoryDashboardStatistics {
  return Object.freeze({
    dashboardRefreshes,
    lastAggregationDurationMs,
    totalAggregationDurationMs,
    averageAggregationDurationMs:
      dashboardRefreshes === 0 ? 0 : totalAggregationDurationMs / dashboardRefreshes,
    validationFailures,
    sectionGenerationTimesMs: Object.freeze({ ...sectionGenerationTimesMs }),
    readOnly: true as const,
  });
}

export const ExecutiveMemoryDashboardStatisticsService = Object.freeze({
  resetExecutiveMemoryDashboardStatisticsForTests,
  recordExecutiveMemoryDashboardRefresh,
  getExecutiveMemoryDashboardStatistics,
});
