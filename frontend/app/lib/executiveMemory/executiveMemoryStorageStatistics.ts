/**
 * APP-4:3 — Executive Memory storage statistics.
 */

import { countByKey, countByLifecycle } from "./executiveMemoryStorageIndex.ts";
import type { ExecutiveMemoryStorageStatistics } from "./executiveMemoryStorageTypes.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";

export function computeExecutiveMemoryStorageStatistics(
  records: readonly ExecutiveMemoryStoredRecord[]
): ExecutiveMemoryStorageStatistics {
  const lifecycleCounts = countByLifecycle(records);
  return Object.freeze({
    totalRecords: records.length,
    activeRecords: lifecycleCounts.active,
    archivedRecords: lifecycleCounts.archived,
    providerCounts: countByKey(records, (entry) => entry.record.providerId),
    categoryCounts: countByKey(records, (entry) => entry.record.category),
    schemaVersions: countByKey(records, (entry) => entry.record.schemaVersion),
    workspaceCounts: countByKey(records, (entry) => entry.record.workspaceId),
    readOnly: true as const,
  });
}

export const ExecutiveMemoryStorageStatisticsService = Object.freeze({
  computeExecutiveMemoryStorageStatistics,
});
