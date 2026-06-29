/**
 * APP-4:12 — Executive Memory Dashboard provider (read-only data sources).
 */

import { getAssistantMemoryIntegrationStatistics } from "./executiveAssistantMemoryIntegrationStatistics.ts";
import { findExecutiveMemories } from "./executiveMemoryRetrievalEngine.ts";
import {
  getExecutiveMemoryLifecycleStatistics,
  inspectMemoryIntegrity,
} from "./executiveMemoryLifecycleEngine.ts";
import {
  listExecutiveMemoryLifecycles,
  listExecutiveMemoryMergeOperations,
  listExecutiveMemorySplitOperations,
  listExecutiveMemorySupersedeOperations,
} from "./executiveMemoryLifecycleRegistry.ts";
import { getRankingStatistics } from "./executiveMemorySearchEngine.ts";
import type { ExecutiveMemoryIntegrityReport } from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryLifecycleStatistics } from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryRankingStatistics } from "./executiveMemorySearchRankingTypes.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type { ExecutiveAssistantMemoryStatistics } from "./executiveAssistantMemoryIntegrationTypes.ts";

export type ExecutiveMemoryDashboardSourceSnapshot = Readonly<{
  records: readonly ExecutiveMemoryStoredRecord[];
  lifecycles: ReturnType<typeof listExecutiveMemoryLifecycles>;
  lifecycleStatistics: ExecutiveMemoryLifecycleStatistics;
  integrityReport: ExecutiveMemoryIntegrityReport;
  mergeOperations: ReturnType<typeof listExecutiveMemoryMergeOperations>;
  splitOperations: ReturnType<typeof listExecutiveMemorySplitOperations>;
  supersedeOperations: ReturnType<typeof listExecutiveMemorySupersedeOperations>;
  searchStatistics: ExecutiveMemoryRankingStatistics;
  assistantStatistics: ExecutiveAssistantMemoryStatistics;
  readOnly: true;
}>;

export function loadExecutiveMemoryDashboardSources(timestamp: string): ExecutiveMemoryDashboardSourceSnapshot {
  const retrieval = findExecutiveMemories({});
  return Object.freeze({
    records: Object.freeze(retrieval.success ? retrieval.records : []),
    lifecycles: listExecutiveMemoryLifecycles(),
    lifecycleStatistics: getExecutiveMemoryLifecycleStatistics(timestamp),
    integrityReport: inspectMemoryIntegrity(timestamp),
    mergeOperations: listExecutiveMemoryMergeOperations(),
    splitOperations: listExecutiveMemorySplitOperations(),
    supersedeOperations: listExecutiveMemorySupersedeOperations(),
    searchStatistics: getRankingStatistics(),
    assistantStatistics: getAssistantMemoryIntegrationStatistics(),
    readOnly: true as const,
  });
}

export const ExecutiveMemoryDashboardProvider = Object.freeze({
  loadExecutiveMemoryDashboardSources,
});
