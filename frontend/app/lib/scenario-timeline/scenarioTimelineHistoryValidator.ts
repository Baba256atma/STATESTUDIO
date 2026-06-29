/**
 * APP-5:4 — Scenario Timeline History validator.
 */

import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import {
  validateHistoryEventCompatibility,
  validateHistoryLifecycleCompatibility,
} from "./scenarioTimelineHistoryCompatibility.ts";
import { orderTimelineEventsForHistory } from "./scenarioTimelineHistoryGrouping.ts";
import type { ScenarioTimelineLifecycle } from "./scenarioTimelineLifecycleTypes.ts";
import type { ScenarioTimelineValidationIssue, ScenarioTimelineValidationResult } from "./scenarioTimelineHistoryTypes.ts";

function issue(code: string, message: string, field?: string): ScenarioTimelineValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScenarioTimelineValidationIssue[]): ScenarioTimelineValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateScenarioHistoryEvents(
  events: readonly ScenarioTimelineEvent[],
  lifecycle?: ScenarioTimelineLifecycle
): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  if (events.length === 0) {
    return result([issue("empty_events", "At least one timeline event is required.", "events")]);
  }

  const scenarioId = events[0]?.scenarioId;
  const workspaceId = events[0]?.workspaceId;
  const seenEventIds = new Set<string>();
  const seenSequenceOrders = new Set<number>();

  for (const event of events) {
    if (event.scenarioId !== scenarioId) {
      issues.push(issue("identity_mismatch", "All events must share the same scenarioId.", "scenarioId"));
    }
    if (event.workspaceId !== workspaceId) {
      issues.push(issue("identity_mismatch", "All events must share the same workspaceId.", "workspaceId"));
    }
    if (seenEventIds.has(event.eventId)) {
      issues.push(issue("duplicate_event", `Duplicate eventId: ${event.eventId}.`, "eventId"));
    }
    seenEventIds.add(event.eventId);

    if (seenSequenceOrders.has(event.sequenceOrder)) {
      issues.push(
        issue(
          "sequence_inconsistency",
          `Duplicate sequenceOrder: ${event.sequenceOrder}.`,
          "sequenceOrder"
        )
      );
    }
    seenSequenceOrders.add(event.sequenceOrder);
  }

  const ordered = orderTimelineEventsForHistory(events);
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = ordered[index - 1]!;
    const current = ordered[index]!;
    if (current.sequenceOrder < previous.sequenceOrder) {
      issues.push(issue("ordering_violation", "Events are not in sequence order.", "sequenceOrder"));
    }
    if (
      current.sequenceOrder === previous.sequenceOrder &&
      Date.parse(current.timestamp) < Date.parse(previous.timestamp)
    ) {
      issues.push(issue("ordering_violation", "Equal sequence events must be timestamp ordered.", "timestamp"));
    }
  }

  const eventCompatibility = validateHistoryEventCompatibility(events);
  issues.push(...eventCompatibility.issues);

  const lifecycleCompatibility = validateHistoryLifecycleCompatibility(events, lifecycle);
  issues.push(...lifecycleCompatibility.issues);

  return result(issues);
}

export function validateScenarioHistoryShape(history: {
  readOnly: boolean;
  eventCount: number;
  events: readonly ScenarioTimelineEvent[];
  orderedEvents: readonly ScenarioTimelineEvent[];
}): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  if (history.readOnly !== true) {
    issues.push(issue("contract_violation", "History must be read-only.", "readOnly"));
  }
  if (history.eventCount !== history.events.length) {
    issues.push(issue("integrity_violation", "eventCount must match events length.", "eventCount"));
  }
  if (history.orderedEvents.length !== history.events.length) {
    issues.push(issue("integrity_violation", "orderedEvents must contain all events.", "orderedEvents"));
  }

  return result(issues);
}

export const ScenarioTimelineHistoryValidator = Object.freeze({
  validateScenarioHistoryEvents,
  validateScenarioHistoryShape,
});
