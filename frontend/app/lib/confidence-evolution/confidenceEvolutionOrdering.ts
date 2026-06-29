/**
 * APP-9:3 — Confidence record ordering.
 * Primary: updatedAt · Secondary: createdAt · Stable fallback: id
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import type { ConfidenceEvolutionQueryDirection } from "./confidenceEvolutionQueryTypes.ts";

function compareAscending(left: string, right: string): number {
  return left.localeCompare(right);
}

export function orderConfidenceRecords(
  records: readonly ConfidenceEvolutionEngineRecord[],
  direction: ConfidenceEvolutionQueryDirection = "desc"
): readonly ConfidenceEvolutionEngineRecord[] {
  const sorted = [...records].sort((left, right) => {
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

export const ConfidenceEvolutionOrdering = Object.freeze({
  orderConfidenceRecords,
});
