/**
 * APP-7:3 — Business Timeline read model builder.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import {
  BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION,
  DEFAULT_BUSINESS_TIMELINE_INCLUDE_ARCHIVED,
  type BusinessTimelineQueryFilters,
  type BusinessTimelineQueryResult,
  type BusinessTimelineQuerySummary,
} from "./businessTimelineQueryTypes.ts";
import { orderBusinessTimelineEvents } from "./businessTimelineOrdering.ts";
import { applyBusinessTimelineQueryFilters } from "./businessTimelineQueryFilters.ts";
import { resolveQueryDirection } from "./businessTimelineQueryValidation.ts";

function incrementCount(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

export function buildBusinessTimelineSummary(
  events: readonly BusinessEngineEvent[]
): BusinessTimelineQuerySummary {
  const categoryCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  let criticalCount = 0;
  let highCount = 0;
  let archivedCount = 0;

  for (const event of events) {
    incrementCount(categoryCounts, event.category);
    incrementCount(typeCounts, event.type);
    if (event.importance === "critical") {
      criticalCount += 1;
    }
    if (event.importance === "high") {
      highCount += 1;
    }
    if (event.archived || event.status === "archived") {
      archivedCount += 1;
    }
  }

  const occurredAtValues = events.map((event) => event.occurredAt).sort((left, right) => left.localeCompare(right));

  return Object.freeze({
    firstEventAt: occurredAtValues[0] ?? null,
    lastEventAt: occurredAtValues[occurredAtValues.length - 1] ?? null,
    criticalCount,
    highCount,
    archivedCount,
    categoryCounts: Object.freeze({ ...categoryCounts }),
    typeCounts: Object.freeze({ ...typeCounts }),
    readOnly: true as const,
  });
}

export function buildBusinessTimelineReadModel(
  filters: BusinessTimelineQueryFilters,
  generatedAt: string
): BusinessTimelineQueryResult {
  const direction = resolveQueryDirection(filters);
  const includedArchived = filters.includeArchived ?? DEFAULT_BUSINESS_TIMELINE_INCLUDE_ARCHIVED;
  const filtered = applyBusinessTimelineQueryFilters(filters);
  const events = orderBusinessTimelineEvents(filtered, direction);
  const summary = buildBusinessTimelineSummary(events);

  return Object.freeze({
    workspaceId: filters.workspaceId,
    events,
    totalEvents: events.length,
    includedArchived,
    orderedBy: "occurredAt",
    direction,
    range: Object.freeze({
      occurredFrom: filters.occurredFrom,
      occurredTo: filters.occurredTo,
      readOnly: true as const,
    }),
    filters: Object.freeze({ ...filters }),
    generatedAt,
    summary,
    contractVersion: BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const BusinessTimelineReadModel = Object.freeze({
  buildBusinessTimelineSummary,
  buildBusinessTimelineReadModel,
});
