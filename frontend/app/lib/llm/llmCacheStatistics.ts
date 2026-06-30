/**
 * LLM-13 — Cache statistics (informational only).
 */

import type { LlmCacheStatistics } from "./llmCacheTypes.ts";

let hits = 0;
let misses = 0;
let savedTokens = 0;
let estimatedCostSaved = 0;
let totalLookupTimeMs = 0;
let totalLookups = 0;

export function resetLlmCacheStatisticsForTests(): void {
  hits = 0;
  misses = 0;
  savedTokens = 0;
  estimatedCostSaved = 0;
  totalLookupTimeMs = 0;
  totalLookups = 0;
}

export function recordCacheHit(tokenCount: number, estimatedCost: number, lookupTimeMs: number): void {
  hits += 1;
  totalLookups += 1;
  savedTokens += tokenCount;
  estimatedCostSaved += estimatedCost;
  totalLookupTimeMs += lookupTimeMs;
}

export function recordCacheMiss(lookupTimeMs: number): void {
  misses += 1;
  totalLookups += 1;
  totalLookupTimeMs += lookupTimeMs;
}

export function getLlmCacheStatistics(): LlmCacheStatistics {
  const hitRatio = totalLookups === 0 ? 0 : hits / totalLookups;
  const averageLookupTimeMs = totalLookups === 0 ? 0 : totalLookupTimeMs / totalLookups;
  return Object.freeze({
    hits,
    misses,
    hitRatio,
    savedTokens,
    estimatedCostSaved,
    averageLookupTimeMs,
    totalLookups,
    readOnly: true as const,
  });
}
