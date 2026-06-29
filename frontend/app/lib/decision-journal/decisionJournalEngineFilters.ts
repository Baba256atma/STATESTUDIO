/**
 * APP-8:2 — Decision Journal entry filtering.
 */

import type {
  DecisionJournalEngineEntry,
  DecisionJournalEntryFilter,
} from "./decisionJournalEngineTypes.ts";
import { getDecisionJournalEntriesByWorkspace } from "./decisionJournalEngineRegistry.ts";

function matchesDateRange(value: string, from: string | undefined, to: string | undefined): boolean {
  if (from && value < from) {
    return false;
  }
  if (to && value > to) {
    return false;
  }
  return true;
}

export function filterDecisionJournalEntries(
  filter: DecisionJournalEntryFilter
): readonly DecisionJournalEngineEntry[] {
  const entries = getDecisionJournalEntriesByWorkspace(filter.workspaceId);
  const includeArchived = filter.includeArchived ?? false;

  return Object.freeze(
    entries.filter((entry) => {
      if (!includeArchived && entry.archived) {
        return false;
      }
      if (filter.status !== undefined && entry.status !== filter.status) {
        return false;
      }
      if (filter.source !== undefined && entry.source !== filter.source) {
        return false;
      }
      if (filter.confidence !== undefined && entry.confidence !== filter.confidence) {
        return false;
      }
      if (filter.author !== undefined && entry.author !== filter.author) {
        return false;
      }
      if (filter.reviewer !== undefined && !entry.reviewers.includes(filter.reviewer)) {
        return false;
      }
      if (filter.tag !== undefined && !entry.tags.includes(filter.tag)) {
        return false;
      }
      if (!matchesDateRange(entry.createdAt, filter.createdAtFrom, filter.createdAtTo)) {
        return false;
      }
      if (!matchesDateRange(entry.updatedAt, filter.updatedAtFrom, filter.updatedAtTo)) {
        return false;
      }
      return true;
    })
  );
}

export const DecisionJournalEngineFilters = Object.freeze({
  filterDecisionJournalEntries,
});
