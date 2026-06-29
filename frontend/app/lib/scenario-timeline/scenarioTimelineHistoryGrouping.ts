/**
 * APP-5:4 — Scenario Timeline History grouping engine.
 */

import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineHistoryGroups, ScenarioTimelineHistoryStageGroup } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

function calendarDateFromTimestamp(timestamp: string): string {
  const parsed = Date.parse(timestamp);
  if (!Number.isFinite(parsed)) {
    return "invalid-date";
  }
  return new Date(parsed).toISOString().slice(0, 10);
}

function appendToGroup(
  target: Record<string, ScenarioTimelineEvent["eventId"][]>,
  key: string,
  eventId: ScenarioTimelineEvent["eventId"]
): void {
  if (!target[key]) {
    target[key] = [];
  }
  target[key].push(eventId);
}

export function orderTimelineEventsForHistory(events: readonly ScenarioTimelineEvent[]): readonly ScenarioTimelineEvent[] {
  return Object.freeze(
    [...events].sort((left, right) => {
      if (left.sequenceOrder !== right.sequenceOrder) {
        return left.sequenceOrder - right.sequenceOrder;
      }
      return Date.parse(left.timestamp) - Date.parse(right.timestamp);
    })
  );
}

export function groupHistoryEvents(orderedEvents: readonly ScenarioTimelineEvent[]): ScenarioTimelineHistoryGroups {
  const byLifecycleStage: Record<string, ScenarioTimelineEvent["eventId"][]> = {};
  const byCalendarDate: Record<string, ScenarioTimelineEvent["eventId"][]> = {};
  const byEventType: Record<string, ScenarioTimelineEvent["eventId"][]> = {};
  const bySequenceOrder: Record<string, ScenarioTimelineEvent["eventId"][]> = {};
  const byWorkspace: Record<string, ScenarioTimelineEvent["eventId"][]> = {};
  const byScenario: Record<string, ScenarioTimelineEvent["eventId"][]> = {};

  for (const event of orderedEvents) {
    appendToGroup(byLifecycleStage, event.stage, event.eventId);
    appendToGroup(byCalendarDate, calendarDateFromTimestamp(event.timestamp), event.eventId);
    appendToGroup(byEventType, event.eventType, event.eventId);
    appendToGroup(bySequenceOrder, String(event.sequenceOrder), event.eventId);
    appendToGroup(byWorkspace, event.workspaceId, event.eventId);
    appendToGroup(byScenario, event.scenarioId, event.eventId);
  }

  const freezeGroup = (input: Record<string, ScenarioTimelineEvent["eventId"][]>) =>
    Object.freeze(
      Object.fromEntries(Object.entries(input).map(([key, value]) => [key, Object.freeze([...value])]))
    );

  return Object.freeze({
    byLifecycleStage: freezeGroup(byLifecycleStage),
    byCalendarDate: freezeGroup(byCalendarDate),
    byEventType: freezeGroup(byEventType),
    bySequenceOrder: freezeGroup(bySequenceOrder),
    byWorkspace: freezeGroup(byWorkspace),
    byScenario: freezeGroup(byScenario),
    readOnly: true as const,
  });
}

export function buildHistoryStageGroups(orderedEvents: readonly ScenarioTimelineEvent[]): readonly ScenarioTimelineHistoryStageGroup[] {
  const groups = new Map<ScenarioTimelineLifecycleStage, ScenarioTimelineHistoryStageGroup>();

  for (const event of orderedEvents) {
    const existing = groups.get(event.stage);
    if (!existing) {
      groups.set(
        event.stage,
        Object.freeze({
          stage: event.stage,
          eventIds: Object.freeze([event.eventId]),
          eventCount: 1,
          firstTimestamp: event.timestamp,
          lastTimestamp: event.timestamp,
          readOnly: true as const,
        })
      );
      continue;
    }

    groups.set(
      event.stage,
      Object.freeze({
        stage: event.stage,
        eventIds: Object.freeze([...existing.eventIds, event.eventId]),
        eventCount: existing.eventCount + 1,
        firstTimestamp: existing.firstTimestamp,
        lastTimestamp: event.timestamp,
        readOnly: true as const,
      })
    );
  }

  return Object.freeze([...groups.values()]);
}

export const ScenarioTimelineHistoryGrouping = Object.freeze({
  orderTimelineEventsForHistory,
  groupHistoryEvents,
  buildHistoryStageGroups,
});
