/**
 * APP-8:3 — Decision Journal read model builder.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import { orderDecisionJournalEntries } from "./decisionJournalOrdering.ts";
import { applyDecisionJournalQueryFilters } from "./decisionJournalQueryFilters.ts";
import {
  DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
  DEFAULT_DECISION_JOURNAL_INCLUDE_ARCHIVED,
  type DecisionJournalQueryFilters,
  type DecisionJournalQueryOrdering,
  type DecisionJournalQueryResult,
  type DecisionJournalQuerySummary,
} from "./decisionJournalQueryTypes.ts";
import { resolveQueryDirection } from "./decisionJournalQueryValidation.ts";

function incrementCount(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

export function buildDecisionJournalSummary(
  entries: readonly DecisionJournalEngineEntry[]
): DecisionJournalQuerySummary {
  const confidenceDistribution: Record<string, number> = {};
  const authorCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  let archivedCount = 0;
  let draftCount = 0;
  let reviewedCount = 0;
  let activeCount = 0;

  for (const entry of entries) {
    incrementCount(confidenceDistribution, entry.confidence);
    incrementCount(authorCounts, entry.author);
    incrementCount(sourceCounts, entry.source);

    if (entry.archived || entry.status === "archived") {
      archivedCount += 1;
    }
    if (entry.status === "draft") {
      draftCount += 1;
    }
    if (entry.status === "reviewed") {
      reviewedCount += 1;
    }
    if (entry.status === "active") {
      activeCount += 1;
    }
  }

  const updatedAtValues = entries.map((entry) => entry.updatedAt).sort((left, right) => left.localeCompare(right));

  return Object.freeze({
    firstEntryAt: updatedAtValues[0] ?? null,
    lastEntryAt: updatedAtValues[updatedAtValues.length - 1] ?? null,
    archivedCount,
    draftCount,
    reviewedCount,
    activeCount,
    confidenceDistribution: Object.freeze({ ...confidenceDistribution }),
    authorCounts: Object.freeze({ ...authorCounts }),
    sourceCounts: Object.freeze({ ...sourceCounts }),
    readOnly: true as const,
  });
}

function buildQueryOrdering(direction: DecisionJournalQueryOrdering["direction"]): DecisionJournalQueryOrdering {
  return Object.freeze({
    primary: "updatedAt",
    secondary: "createdAt",
    fallback: "id",
    direction,
    readOnly: true as const,
  });
}

export function buildDecisionJournalReadModel(
  filters: DecisionJournalQueryFilters,
  generatedAt: string
): DecisionJournalQueryResult {
  const direction = resolveQueryDirection(filters);
  const includedArchived = filters.includeArchived ?? DEFAULT_DECISION_JOURNAL_INCLUDE_ARCHIVED;
  const filtered = applyDecisionJournalQueryFilters(filters);
  const entries = orderDecisionJournalEntries(filtered, direction);
  const summary = buildDecisionJournalSummary(entries);

  return Object.freeze({
    workspaceId: filters.workspaceId,
    entries,
    totalEntries: entries.length,
    includedArchived,
    filters: Object.freeze({ ...filters }),
    ordering: buildQueryOrdering(direction),
    generatedAt,
    summary,
    contractVersion: DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const DecisionJournalReadModel = Object.freeze({
  buildDecisionJournalSummary,
  buildDecisionJournalReadModel,
});
