/**
 * APP-7:2 — Business Event filtering.
 */

import type { BusinessEngineEvent, BusinessEventFilter } from "./businessEventEngineTypes.ts";
import { getBusinessEventsByWorkspace } from "./businessEventEngineRegistry.ts";

function matchesTags(event: BusinessEngineEvent, tags: readonly string[] | undefined): boolean {
  if (!tags?.length) {
    return true;
  }
  return tags.some((tag) => event.tags.includes(tag));
}

function matchesDateRange(
  event: BusinessEngineEvent,
  from: string | undefined,
  to: string | undefined
): boolean {
  if (from && event.occurredAt < from) {
    return false;
  }
  if (to && event.occurredAt > to) {
    return false;
  }
  return true;
}

export function filterBusinessEvents(filter: BusinessEventFilter): readonly BusinessEngineEvent[] {
  const events = getBusinessEventsByWorkspace(filter.workspaceId);
  const includeArchived = filter.includeArchived ?? false;

  return Object.freeze(
    events.filter((event) => {
      if (!includeArchived && event.archived) {
        return false;
      }
      if (filter.category !== undefined && event.category !== filter.category) {
        return false;
      }
      if (filter.type !== undefined && event.type !== filter.type) {
        return false;
      }
      if (filter.importance !== undefined && event.importance !== filter.importance) {
        return false;
      }
      if (filter.status !== undefined && event.status !== filter.status) {
        return false;
      }
      if (filter.source !== undefined && event.source !== filter.source) {
        return false;
      }
      if (!matchesTags(event, filter.tags)) {
        return false;
      }
      if (!matchesDateRange(event, filter.occurredAtFrom, filter.occurredAtTo)) {
        return false;
      }
      return true;
    })
  );
}

export const BusinessEventEngineFilters = Object.freeze({
  filterBusinessEvents,
});
