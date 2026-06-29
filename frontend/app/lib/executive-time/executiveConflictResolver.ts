/**
 * APP-1:8 — Executive Conflict Resolver.
 * Read-only conflict aggregation — no resolution execution.
 */

import type { ExecutiveConflictResult, ExecutiveConflictSeverity, ExecutiveConflictType } from "./executivePredictionEngineTypes.ts";

export function resolveConflictsByType(
  conflicts: readonly ExecutiveConflictResult[],
  conflictType: ExecutiveConflictType
): readonly ExecutiveConflictResult[] {
  return Object.freeze(conflicts.filter((conflict) => conflict.conflictType === conflictType));
}

export function resolveHighestSeverityConflict(
  conflicts: readonly ExecutiveConflictResult[]
): ExecutiveConflictResult | null {
  const rank: Record<ExecutiveConflictSeverity, number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  };
  if (conflicts.length === 0) return null;
  return [...conflicts].sort((left, right) => rank[right.severity] - rank[left.severity])[0] ?? null;
}

export function resolveConflictCountBySeverity(
  conflicts: readonly ExecutiveConflictResult[]
): Readonly<Record<ExecutiveConflictSeverity, number>> {
  const counts: Record<ExecutiveConflictSeverity, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };
  for (const conflict of conflicts) {
    counts[conflict.severity] += 1;
  }
  return Object.freeze(counts);
}

export const ExecutiveConflictResolver = Object.freeze({
  resolveConflictsByType,
  resolveHighestSeverityConflict,
  resolveConflictCountBySeverity,
});
