/**
 * APP-5:5 — Scenario Timeline Query filter engine.
 */

import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineQueryFilters } from "./scenarioTimelineQueryTypes.ts";

function withinDateRange(timestamp: string, dateFrom?: string, dateTo?: string): boolean {
  const value = Date.parse(timestamp);
  if (!Number.isFinite(value)) {
    return false;
  }
  if (dateFrom && value < Date.parse(dateFrom)) {
    return false;
  }
  if (dateTo && value > Date.parse(dateTo)) {
    return false;
  }
  return true;
}

function withinSequenceRange(sequenceOrder: number, sequenceFrom?: number, sequenceTo?: number): boolean {
  if (sequenceFrom !== undefined && sequenceOrder < sequenceFrom) {
    return false;
  }
  if (sequenceTo !== undefined && sequenceOrder > sequenceTo) {
    return false;
  }
  return true;
}

export function applyTimelineQueryFilters(
  events: readonly ScenarioTimelineEvent[],
  filters: ScenarioTimelineQueryFilters
): readonly ScenarioTimelineEvent[] {
  return Object.freeze(
    events.filter((event) => {
      if (filters.scenarioId && event.scenarioId !== filters.scenarioId) {
        return false;
      }
      if (filters.workspaceId && event.workspaceId !== filters.workspaceId) {
        return false;
      }
      if (filters.eventId && event.eventId !== filters.eventId) {
        return false;
      }
      if (filters.stage && event.stage !== filters.stage) {
        return false;
      }
      if (filters.eventType && event.eventType !== filters.eventType) {
        return false;
      }
      if (!withinDateRange(event.timestamp, filters.dateFrom, filters.dateTo)) {
        return false;
      }
      if (!withinSequenceRange(event.sequenceOrder, filters.sequenceFrom, filters.sequenceTo)) {
        return false;
      }
      return true;
    })
  );
}

export const ScenarioTimelineQueryFiltersEngine = Object.freeze({
  applyTimelineQueryFilters,
});
