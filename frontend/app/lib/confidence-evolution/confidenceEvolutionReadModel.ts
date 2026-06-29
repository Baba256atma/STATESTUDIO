/**
 * APP-9:3 — Confidence Evolution read model builder.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import { orderConfidenceRecords } from "./confidenceEvolutionOrdering.ts";
import { applyConfidenceEvolutionQueryFilters } from "./confidenceEvolutionQueryFilters.ts";
import {
  CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION,
  DEFAULT_CONFIDENCE_EVOLUTION_INCLUDE_ARCHIVED,
  type ConfidenceEvolutionQueryFilters,
  type ConfidenceEvolutionQueryOrdering,
  type ConfidenceEvolutionQueryResult,
  type ConfidenceEvolutionQuerySummary,
} from "./confidenceEvolutionQueryTypes.ts";
import { resolveQueryDirection } from "./confidenceEvolutionQueryValidation.ts";

function incrementCount(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

export function buildConfidenceEvolutionSummary(
  records: readonly ConfidenceEvolutionEngineRecord[]
): ConfidenceEvolutionQuerySummary {
  const confidenceLevelDistribution: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  const reasonCounts: Record<string, number> = {};
  let archivedCount = 0;
  let draftCount = 0;
  let reviewedCount = 0;
  let activeCount = 0;
  let scoreSum = 0;

  for (const record of records) {
    incrementCount(confidenceLevelDistribution, record.confidenceLevel);
    incrementCount(sourceCounts, record.source);
    incrementCount(reasonCounts, record.reason);
    scoreSum += record.confidenceScore;

    if (record.archived || record.status === "archived") {
      archivedCount += 1;
    }
    if (record.status === "draft") {
      draftCount += 1;
    }
    if (record.status === "reviewed") {
      reviewedCount += 1;
    }
    if (record.status === "active") {
      activeCount += 1;
    }
  }

  const updatedAtValues = records.map((record) => record.updatedAt).sort((left, right) => left.localeCompare(right));
  const scores = records.map((record) => record.confidenceScore).sort((left, right) => left - right);

  return Object.freeze({
    firstRecordAt: updatedAtValues[0] ?? null,
    lastRecordAt: updatedAtValues[updatedAtValues.length - 1] ?? null,
    archivedCount,
    activeCount,
    draftCount,
    reviewedCount,
    confidenceLevelDistribution: Object.freeze({ ...confidenceLevelDistribution }),
    sourceCounts: Object.freeze({ ...sourceCounts }),
    reasonCounts: Object.freeze({ ...reasonCounts }),
    averageConfidenceScore: records.length > 0 ? scoreSum / records.length : null,
    minConfidenceScore: scores[0] ?? null,
    maxConfidenceScore: scores[scores.length - 1] ?? null,
    readOnly: true as const,
  });
}

function buildQueryOrdering(direction: ConfidenceEvolutionQueryOrdering["direction"]): ConfidenceEvolutionQueryOrdering {
  return Object.freeze({
    primary: "updatedAt",
    secondary: "createdAt",
    fallback: "id",
    direction,
    readOnly: true as const,
  });
}

export function buildConfidenceEvolutionReadModel(
  filters: ConfidenceEvolutionQueryFilters,
  generatedAt: string
): ConfidenceEvolutionQueryResult {
  const direction = resolveQueryDirection(filters);
  const includedArchived = filters.includeArchived ?? DEFAULT_CONFIDENCE_EVOLUTION_INCLUDE_ARCHIVED;
  const filtered = applyConfidenceEvolutionQueryFilters(filters);
  const records = orderConfidenceRecords(filtered, direction);
  const summary = buildConfidenceEvolutionSummary(records);

  return Object.freeze({
    workspaceId: filters.workspaceId,
    records,
    totalRecords: records.length,
    includedArchived,
    filters: Object.freeze({ ...filters }),
    ordering: buildQueryOrdering(direction),
    generatedAt,
    summary,
    contractVersion: CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionReadModel = Object.freeze({
  buildConfidenceEvolutionSummary,
  buildConfidenceEvolutionReadModel,
});
