/**
 * APP-7:3 — Business Timeline query filters.
 * Maps query filters to APP-7:2 read-only event filtering.
 */

import { filterBusinessEvents } from "./businessEventEngine.ts";
import type { BusinessEventFilter } from "./businessEventEngineTypes.ts";
import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import {
  DEFAULT_BUSINESS_TIMELINE_INCLUDE_ARCHIVED,
  type BusinessTimelineQueryFilters,
} from "./businessTimelineQueryTypes.ts";

export function toBusinessEventFilter(filters: BusinessTimelineQueryFilters): BusinessEventFilter {
  return Object.freeze({
    workspaceId: filters.workspaceId,
    category: filters.category,
    type: filters.type,
    importance: filters.importance,
    status: filters.status,
    source: filters.source,
    tags: filters.tags,
    occurredAtFrom: filters.occurredFrom,
    occurredAtTo: filters.occurredTo,
    includeArchived: filters.includeArchived ?? DEFAULT_BUSINESS_TIMELINE_INCLUDE_ARCHIVED,
  });
}

export function applyBusinessTimelineQueryFilters(
  filters: BusinessTimelineQueryFilters
): readonly BusinessEngineEvent[] {
  return filterBusinessEvents(toBusinessEventFilter(filters));
}

export const BusinessTimelineQueryFiltersEngine = Object.freeze({
  toBusinessEventFilter,
  applyBusinessTimelineQueryFilters,
});
