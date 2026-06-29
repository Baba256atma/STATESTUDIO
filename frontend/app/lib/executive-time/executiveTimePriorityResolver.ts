/**
 * APP-1:6 — Executive Time Priority Resolver.
 * Priority aggregation and distribution metadata — no mutation.
 */

import { EXECUTIVE_TIME_PRIORITY_LEVELS } from "./executiveTimePriorityAuthority.ts";
import type {
  ExecutiveTimePriorityLevel,
  ExecutiveTimePriorityResult,
} from "./executiveTimePriorityAuthorityTypes.ts";

export type ExecutiveTimePriorityGroup = Readonly<{
  priority: ExecutiveTimePriorityLevel;
  results: readonly ExecutiveTimePriorityResult[];
  count: number;
}>;

export type ExecutiveTimePriorityDistribution = Readonly<{
  total: number;
  counts: Readonly<Record<ExecutiveTimePriorityLevel, number>>;
  percentages: Readonly<Record<ExecutiveTimePriorityLevel, number>>;
}>;

export type ExecutiveTimePriorityStatistics = Readonly<{
  total: number;
  averageConfidence: number;
  highestPriority: ExecutiveTimePriorityLevel | null;
  lowestPriority: ExecutiveTimePriorityLevel | null;
  escalationLevels: readonly string[];
}>;

const PRIORITY_RANK: Readonly<Record<ExecutiveTimePriorityLevel, number>> = Object.freeze({
  critical: 0,
  urgent: 1,
  soon: 2,
  normal: 3,
  later: 4,
  expired: 5,
});

function comparePriority(left: ExecutiveTimePriorityLevel, right: ExecutiveTimePriorityLevel): number {
  return PRIORITY_RANK[left] - PRIORITY_RANK[right];
}

export function resolveHighestPriority(
  results: readonly ExecutiveTimePriorityResult[]
): ExecutiveTimePriorityResult | null {
  if (results.length === 0) return null;
  return [...results].sort((left, right) => comparePriority(left.priority, right.priority))[0] ?? null;
}

export function resolvePriorityGroup(
  results: readonly ExecutiveTimePriorityResult[],
  priority: ExecutiveTimePriorityLevel
): ExecutiveTimePriorityGroup {
  const grouped = Object.freeze(results.filter((result) => result.priority === priority));
  return Object.freeze({
    priority,
    results: grouped,
    count: grouped.length,
  });
}

export function resolvePriorityDistribution(
  results: readonly ExecutiveTimePriorityResult[]
): ExecutiveTimePriorityDistribution {
  const counts = Object.fromEntries(EXECUTIVE_TIME_PRIORITY_LEVELS.map((level) => [level, 0])) as Record<
    ExecutiveTimePriorityLevel,
    number
  >;
  for (const result of results) {
    counts[result.priority] += 1;
  }
  const total = results.length;
  const percentages = Object.fromEntries(
    EXECUTIVE_TIME_PRIORITY_LEVELS.map((level) => [
      level,
      total === 0 ? 0 : Math.round((counts[level] / total) * 1000) / 10,
    ])
  ) as Record<ExecutiveTimePriorityLevel, number>;

  return Object.freeze({
    total,
    counts: Object.freeze(counts),
    percentages: Object.freeze(percentages),
  });
}

export function resolvePriorityStatistics(
  results: readonly ExecutiveTimePriorityResult[]
): ExecutiveTimePriorityStatistics {
  if (results.length === 0) {
    return Object.freeze({
      total: 0,
      averageConfidence: 0,
      highestPriority: null,
      lowestPriority: null,
      escalationLevels: Object.freeze([]),
    });
  }

  const sorted = [...results].sort((left, right) => comparePriority(left.priority, right.priority));
  const averageConfidence =
    Math.round((results.reduce((sum, result) => sum + result.confidence, 0) / results.length) * 100) / 100;

  return Object.freeze({
    total: results.length,
    averageConfidence,
    highestPriority: sorted[0]?.priority ?? null,
    lowestPriority: sorted[sorted.length - 1]?.priority ?? null,
    escalationLevels: Object.freeze([...new Set(results.map((result) => result.escalationLevel))]),
  });
}

export function explainPriorityResult(result: ExecutiveTimePriorityResult): string {
  const factors = result.contributingFactors.map((factor) => factor.label).join("; ");
  return `${result.explanation} Escalation: ${result.escalationLevel}. Factors: ${factors || "none"}.`;
}
