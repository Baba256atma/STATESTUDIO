/**
 * APP-9:2 — Confidence record filtering.
 */

import type {
  ConfidenceEvolutionEngineRecord,
  ConfidenceRecordFilter,
} from "./confidenceEvolutionEngineTypes.ts";
import { getConfidenceRecordsByWorkspace } from "./confidenceEvolutionEngineRegistry.ts";

function matchesDateRange(value: string, from: string | undefined, to: string | undefined): boolean {
  if (from && value < from) {
    return false;
  }
  if (to && value > to) {
    return false;
  }
  return true;
}

export function filterConfidenceRecords(
  filter: ConfidenceRecordFilter
): readonly ConfidenceEvolutionEngineRecord[] {
  const records = getConfidenceRecordsByWorkspace(filter.workspaceId);
  const includeArchived = filter.includeArchived ?? false;

  return Object.freeze(
    records.filter((record) => {
      if (!includeArchived && record.archived) {
        return false;
      }
      if (filter.confidenceLevel !== undefined && record.confidenceLevel !== filter.confidenceLevel) {
        return false;
      }
      if (filter.source !== undefined && record.source !== filter.source) {
        return false;
      }
      if (filter.reason !== undefined && record.reason !== filter.reason) {
        return false;
      }
      if (filter.status !== undefined && record.status !== filter.status) {
        return false;
      }
      if (filter.tag !== undefined && !record.tags.includes(filter.tag)) {
        return false;
      }
      if (!matchesDateRange(record.createdAt, filter.createdAtFrom, filter.createdAtTo)) {
        return false;
      }
      if (!matchesDateRange(record.updatedAt, filter.updatedAtFrom, filter.updatedAtTo)) {
        return false;
      }
      return true;
    })
  );
}

export const ConfidenceEvolutionFilters = Object.freeze({
  filterConfidenceRecords,
});
