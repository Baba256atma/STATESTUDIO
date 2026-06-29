/**
 * APP-4:9 — Executive Memory Search & Ranking statistics.
 */

import type { ExecutiveMemoryRankingStatistics } from "./executiveMemorySearchRankingTypes.ts";

let searchesExecuted = 0;
let rankingsExecuted = 0;
let totalExecutionTimeMs = 0;
let totalResults = 0;
const profileUsage: Record<string, number> = {};
const filterUsage: Record<string, number> = {};

export function resetExecutiveMemorySearchRankingStatisticsForTests(): void {
  searchesExecuted = 0;
  rankingsExecuted = 0;
  totalExecutionTimeMs = 0;
  totalResults = 0;
  for (const key of Object.keys(profileUsage)) delete profileUsage[key];
  for (const key of Object.keys(filterUsage)) delete filterUsage[key];
}

export function recordExecutiveMemorySearchExecution(input: {
  executionTimeMs: number;
  resultCount: number;
  profileId: string;
  filtersUsed: readonly string[];
}): void {
  searchesExecuted += 1;
  totalExecutionTimeMs += input.executionTimeMs;
  totalResults += input.resultCount;
  profileUsage[input.profileId] = (profileUsage[input.profileId] ?? 0) + 1;
  for (const filter of input.filtersUsed) {
    filterUsage[filter] = (filterUsage[filter] ?? 0) + 1;
  }
}

export function recordExecutiveMemoryRankingExecution(): void {
  rankingsExecuted += 1;
}

export function getRankingStatistics(): ExecutiveMemoryRankingStatistics {
  return Object.freeze({
    searchesExecuted,
    rankingsExecuted,
    totalExecutionTimeMs,
    averageExecutionTimeMs: searchesExecuted === 0 ? 0 : totalExecutionTimeMs / searchesExecuted,
    averageResults: searchesExecuted === 0 ? 0 : totalResults / searchesExecuted,
    profileUsage: Object.freeze({ ...profileUsage }),
    filterUsage: Object.freeze({ ...filterUsage }),
    readOnly: true as const,
  });
}

export const ExecutiveMemorySearchStatisticsService = Object.freeze({
  resetExecutiveMemorySearchRankingStatisticsForTests,
  recordExecutiveMemorySearchExecution,
  recordExecutiveMemoryRankingExecution,
  getRankingStatistics,
});
