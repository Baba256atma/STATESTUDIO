/**
 * APP-4:10 — Executive Memory Lifecycle statistics.
 */

import {
  getExecutiveMemoryVersionRecords,
  listExecutiveMemoryLifecycles,
  listExecutiveMemoryMergeOperations,
  listExecutiveMemorySplitOperations,
  listExecutiveMemorySupersedeOperations,
} from "./executiveMemoryLifecycleRegistry.ts";
import { inspectMemoryIntegrity } from "./executiveMemoryLifecycleIntegrityInspector.ts";
import type { ExecutiveMemoryLifecycleStatistics } from "./executiveMemoryLifecycleTypes.ts";

export function computeExecutiveMemoryLifecycleStatistics(timestamp: string): ExecutiveMemoryLifecycleStatistics {
  const lifecycles = listExecutiveMemoryLifecycles();
  const retentionPolicyUsage: Record<string, number> = {};
  let totalVersions = 0;
  let mergedMemories = 0;
  let splitMemories = 0;
  let supersededMemories = 0;
  let archivedMemories = 0;

  const canonicalSeen = new Set<string>();
  for (const lifecycle of lifecycles) {
    retentionPolicyUsage[lifecycle.retentionPolicyId] =
      (retentionPolicyUsage[lifecycle.retentionPolicyId] ?? 0) + 1;
    if (lifecycle.governanceState === "merged") mergedMemories += 1;
    if (lifecycle.governanceState === "split") splitMemories += 1;
    if (lifecycle.governanceState === "superseded") supersededMemories += 1;
    if (lifecycle.governanceState === "archived") archivedMemories += 1;
    if (!canonicalSeen.has(lifecycle.canonicalMemoryId)) {
      canonicalSeen.add(lifecycle.canonicalMemoryId);
      totalVersions += getExecutiveMemoryVersionRecords(lifecycle.canonicalMemoryId).length;
    }
  }

  const integrity = inspectMemoryIntegrity(timestamp);

  return Object.freeze({
    totalVersions,
    mergedMemories,
    splitMemories,
    supersededMemories,
    archivedMemories,
    integrityViolations: integrity.issues.length,
    retentionPolicyUsage: Object.freeze({ ...retentionPolicyUsage }),
    readOnly: true as const,
  });
}

export const ExecutiveMemoryLifecycleStatisticsService = Object.freeze({
  computeExecutiveMemoryLifecycleStatistics,
});
