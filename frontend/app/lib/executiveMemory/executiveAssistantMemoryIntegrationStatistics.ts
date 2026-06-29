/**
 * APP-4:11 — Executive Assistant Memory integration statistics.
 */

import type { ExecutiveAssistantMemoryStatistics } from "./executiveAssistantMemoryIntegrationTypes.ts";

let assistantRetrievalCount = 0;
let citationCount = 0;
let accessDenialCount = 0;
let totalExecutionTimeMs = 0;
const profileUsage: Record<string, number> = {};

export function resetExecutiveAssistantMemoryIntegrationStatisticsForTests(): void {
  assistantRetrievalCount = 0;
  citationCount = 0;
  accessDenialCount = 0;
  totalExecutionTimeMs = 0;
  for (const key of Object.keys(profileUsage)) delete profileUsage[key];
}

export function recordExecutiveAssistantMemoryRetrieval(input: {
  executionTimeMs: number;
  retrievalProfileId: string;
  selectionCount: number;
  denied: boolean;
}): void {
  assistantRetrievalCount += 1;
  citationCount += input.selectionCount;
  totalExecutionTimeMs += input.executionTimeMs;
  profileUsage[input.retrievalProfileId] = (profileUsage[input.retrievalProfileId] ?? 0) + 1;
  if (input.denied) accessDenialCount += 1;
}

export function getAssistantMemoryIntegrationStatistics(): ExecutiveAssistantMemoryStatistics {
  return Object.freeze({
    assistantRetrievalCount,
    citationCount,
    accessDenialCount,
    totalExecutionTimeMs,
    averageRetrievalTimeMs:
      assistantRetrievalCount === 0 ? 0 : totalExecutionTimeMs / assistantRetrievalCount,
    profileUsage: Object.freeze({ ...profileUsage }),
    readOnly: true as const,
  });
}

export const ExecutiveAssistantMemoryStatisticsService = Object.freeze({
  resetExecutiveAssistantMemoryIntegrationStatisticsForTests,
  recordExecutiveAssistantMemoryRetrieval,
  getAssistantMemoryIntegrationStatistics,
});
