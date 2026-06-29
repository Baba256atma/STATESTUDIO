/**
 * APP-8:3 — Decision Journal entry ordering.
 * Primary: updatedAt · Secondary: createdAt · Stable fallback: id
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type { DecisionJournalQueryDirection } from "./decisionJournalQueryTypes.ts";

function compareAscending(left: string, right: string): number {
  return left.localeCompare(right);
}

export function orderDecisionJournalEntries(
  entries: readonly DecisionJournalEngineEntry[],
  direction: DecisionJournalQueryDirection = "desc"
): readonly DecisionJournalEngineEntry[] {
  const sorted = [...entries].sort((left, right) => {
    const updatedCompare = compareAscending(left.updatedAt, right.updatedAt);
    if (updatedCompare !== 0) {
      return direction === "asc" ? updatedCompare : -updatedCompare;
    }

    const createdCompare = compareAscending(left.createdAt, right.createdAt);
    if (createdCompare !== 0) {
      return direction === "asc" ? createdCompare : -createdCompare;
    }

    const idCompare = compareAscending(left.id, right.id);
    return direction === "asc" ? idCompare : -idCompare;
  });

  return Object.freeze(sorted);
}

export const DecisionJournalOrdering = Object.freeze({
  orderDecisionJournalEntries,
});
