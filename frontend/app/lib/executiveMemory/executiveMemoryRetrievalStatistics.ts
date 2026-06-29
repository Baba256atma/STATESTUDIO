/**
 * APP-4:4 — Executive Memory retrieval statistics helpers.
 */

import type {
  ExecutiveMemoryRetrievalQueryType,
  ExecutiveMemoryRetrievalStatistics,
} from "./executiveMemoryRetrievalTypes.ts";

export function createExecutiveMemoryRetrievalStatistics(input: {
  recordsScanned: number;
  recordsReturned: number;
  executionTimeMs: number;
  queryType: ExecutiveMemoryRetrievalQueryType;
}): ExecutiveMemoryRetrievalStatistics {
  return Object.freeze({
    recordsScanned: input.recordsScanned,
    recordsReturned: input.recordsReturned,
    executionTimeMs: input.executionTimeMs,
    queryType: input.queryType,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryRetrievalStatisticsService = Object.freeze({
  createExecutiveMemoryRetrievalStatistics,
});
