/**
 * APP-9:3 — Confidence Evolution query filters.
 * Maps query filters to APP-9:2 read-only record filtering with score range support.
 */

import { filterConfidenceRecords } from "./confidenceEvolutionEngine.ts";
import type { ConfidenceRecordFilter } from "./confidenceEvolutionEngineTypes.ts";
import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import {
  DEFAULT_CONFIDENCE_EVOLUTION_INCLUDE_ARCHIVED,
  type ConfidenceEvolutionQueryFilters,
} from "./confidenceEvolutionQueryTypes.ts";

export function toConfidenceRecordFilter(filters: ConfidenceEvolutionQueryFilters): ConfidenceRecordFilter {
  return Object.freeze({
    workspaceId: filters.workspaceId,
    confidenceLevel: filters.confidenceLevel,
    source: filters.source,
    reason: filters.reason,
    status: filters.status,
    tag: filters.tag,
    createdAtFrom: filters.createdAtFrom,
    createdAtTo: filters.createdAtTo,
    updatedAtFrom: filters.updatedAtFrom,
    updatedAtTo: filters.updatedAtTo,
    includeArchived: filters.includeArchived ?? DEFAULT_CONFIDENCE_EVOLUTION_INCLUDE_ARCHIVED,
  });
}

function matchesScoreRange(
  score: number,
  min: number | undefined,
  max: number | undefined
): boolean {
  if (min !== undefined && score < min) {
    return false;
  }
  if (max !== undefined && score > max) {
    return false;
  }
  return true;
}

export function applyConfidenceEvolutionQueryFilters(
  filters: ConfidenceEvolutionQueryFilters
): readonly ConfidenceEvolutionEngineRecord[] {
  const engineFiltered = filterConfidenceRecords(toConfidenceRecordFilter(filters));
  if (filters.confidenceScoreMin === undefined && filters.confidenceScoreMax === undefined) {
    return engineFiltered;
  }
  return Object.freeze(
    engineFiltered.filter((record) =>
      matchesScoreRange(record.confidenceScore, filters.confidenceScoreMin, filters.confidenceScoreMax)
    )
  );
}

export const ConfidenceEvolutionQueryFiltersEngine = Object.freeze({
  toConfidenceRecordFilter,
  applyConfidenceEvolutionQueryFilters,
});
