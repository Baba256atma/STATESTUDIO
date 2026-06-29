/**
 * APP-7:3 — Business Timeline event ordering.
 * Primary: occurredAt · Secondary: createdAt · Stable fallback: id
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import type { BusinessTimelineQueryDirection } from "./businessTimelineQueryTypes.ts";

function compareAscending(left: string, right: string): number {
  return left.localeCompare(right);
}

export function orderBusinessTimelineEvents(
  events: readonly BusinessEngineEvent[],
  direction: BusinessTimelineQueryDirection = "desc"
): readonly BusinessEngineEvent[] {
  const sorted = [...events].sort((left, right) => {
    const occurredCompare = compareAscending(left.occurredAt, right.occurredAt);
    if (occurredCompare !== 0) {
      return direction === "asc" ? occurredCompare : -occurredCompare;
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

export const BusinessTimelineOrdering = Object.freeze({
  orderBusinessTimelineEvents,
});
