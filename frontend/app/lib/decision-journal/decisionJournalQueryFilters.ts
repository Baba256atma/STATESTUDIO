/**
 * APP-8:3 — Decision Journal query filters.
 * Maps query filters to APP-8:2 read-only entry filtering.
 */

import { filterDecisionJournalEntries } from "./decisionJournalEngine.ts";
import type { DecisionJournalEntryFilter } from "./decisionJournalEngineTypes.ts";
import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import {
  DEFAULT_DECISION_JOURNAL_INCLUDE_ARCHIVED,
  type DecisionJournalQueryFilters,
} from "./decisionJournalQueryTypes.ts";

export function toDecisionJournalEntryFilter(filters: DecisionJournalQueryFilters): DecisionJournalEntryFilter {
  return Object.freeze({
    workspaceId: filters.workspaceId,
    status: filters.status,
    source: filters.source,
    confidence: filters.confidence,
    author: filters.author,
    reviewer: filters.reviewer,
    tag: filters.tag,
    createdAtFrom: filters.createdAtFrom,
    createdAtTo: filters.createdAtTo,
    updatedAtFrom: filters.updatedAtFrom,
    updatedAtTo: filters.updatedAtTo,
    includeArchived: filters.includeArchived ?? DEFAULT_DECISION_JOURNAL_INCLUDE_ARCHIVED,
  });
}

export function applyDecisionJournalQueryFilters(
  filters: DecisionJournalQueryFilters
): readonly DecisionJournalEngineEntry[] {
  return filterDecisionJournalEntries(toDecisionJournalEntryFilter(filters));
}

export const DecisionJournalQueryFiltersEngine = Object.freeze({
  toDecisionJournalEntryFilter,
  applyDecisionJournalQueryFilters,
});
