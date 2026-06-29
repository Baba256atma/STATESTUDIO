/**
 * APP-6:3 — Decision History validation.
 */

import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";
import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import { validateDecisionEvent, isDecisionEngineLifecycle } from "./decisionEventValidation.ts";
import { orderDecisionEventsForHistory } from "./decisionHistoryAggregator.ts";
import type { DecisionHistory, DecisionValidationIssue, DecisionValidationResult } from "./decisionHistoryTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./decisionTimelineConstants.ts";
import { validateDecisionTimelineFoundation } from "./decisionTimelineContracts.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateDecisionHistoryEvents(events: readonly DecisionEngineEvent[]): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (events.length === 0) {
    return result([issue("empty_events", "At least one decision event is required.", "events")]);
  }

  const decisionId = events[0]?.decisionId;
  const workspaceId = events[0]?.workspaceId;
  const seenEventIds = new Set<string>();

  for (const event of events) {
    if (!event.decisionId || event.decisionId.trim().length === 0) {
      issues.push(issue("missing_field", "decisionId is required on every event.", "decisionId"));
    }
    if (!event.eventId || event.eventId.trim().length === 0) {
      issues.push(issue("missing_field", "eventId is required on every event.", "eventId"));
    }
    if (event.decisionId !== decisionId) {
      issues.push(issue("identity_mismatch", "All events must share the same decisionId.", "decisionId"));
    }
    if (event.workspaceId !== workspaceId) {
      issues.push(issue("workspace_isolation_violation", "All events must share the same workspaceId.", "workspaceId"));
    }
    if (seenEventIds.has(event.eventId)) {
      issues.push(issue("duplicate_event", `Duplicate eventId: ${event.eventId}.`, "eventId"));
    }
    seenEventIds.add(event.eventId);

    if (!isDecisionEngineLifecycle(event.lifecycle)) {
      issues.push(issue("invalid_lifecycle", `Invalid lifecycle: ${event.lifecycle}.`, "lifecycle"));
    }

    const eventValidation = validateDecisionEvent(event);
    if (!eventValidation.valid) {
      issues.push(...eventValidation.issues);
    }
  }

  const ordered = orderDecisionEventsForHistory(events);
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = ordered[index - 1]!;
    const current = ordered[index]!;

    if (current.sequenceNumber < previous.sequenceNumber) {
      issues.push(issue("ordering_violation", "Events are not in sequence order.", "sequenceNumber"));
    }

    if (
      current.sequenceNumber === previous.sequenceNumber &&
      Date.parse(current.timestamp) < Date.parse(previous.timestamp)
    ) {
      issues.push(issue("chronology_violation", "Equal sequence events must be timestamp ordered.", "timestamp"));
    }

    if (
      current.sequenceNumber > previous.sequenceNumber &&
      Date.parse(current.timestamp) < Date.parse(previous.timestamp)
    ) {
      issues.push(
        issue(
          "chronology_violation",
          "Later sequence events must not precede earlier timestamps.",
          "timestamp"
        )
      );
    }
  }

  const foundationVersions = new Set(events.map((event) => event.version.foundationContractVersion));
  if (foundationVersions.size > 1) {
    issues.push(issue("version_discontinuity", "All events must share the same foundation contract version.", "version"));
  }
  if (foundationVersions.size === 1 && !foundationVersions.has(DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION)) {
    issues.push(issue("foundation_incompatible", "Events are incompatible with APP-6:1 foundation.", "version"));
  }

  const engineVersions = new Set(events.map((event) => event.version.engineVersion));
  if (engineVersions.size > 1) {
    issues.push(issue("version_discontinuity", "All events must share the same engine contract version.", "version"));
  }
  if (engineVersions.size === 1 && !engineVersions.has(DECISION_EVENT_ENGINE_CONTRACT_VERSION)) {
    issues.push(issue("engine_incompatible", "Events are incompatible with APP-6:2 event engine.", "version"));
  }

  return result(issues);
}

export function validateDecisionHistoryShape(history: DecisionHistory): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (history.readOnly !== true) {
    issues.push(issue("contract_violation", "History must be read-only.", "readOnly"));
  }
  if (history.historyVersion !== DECISION_HISTORY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_history_version", "Invalid historyVersion.", "historyVersion"));
  }
  if (history.eventCount !== history.events.length) {
    issues.push(issue("integrity_violation", "eventCount must match events length.", "eventCount"));
  }
  if (history.orderedEvents.length !== history.events.length) {
    issues.push(issue("integrity_violation", "orderedEvents must contain all events.", "orderedEvents"));
  }
  if (history.firstEvent?.eventId !== history.orderedEvents[0]?.eventId) {
    issues.push(issue("integrity_violation", "firstEvent must match first ordered event.", "firstEvent"));
  }
  if (history.latestEvent?.eventId !== history.orderedEvents.at(-1)?.eventId) {
    issues.push(issue("integrity_violation", "latestEvent must match last ordered event.", "latestEvent"));
  }
  if (history.currentLifecycle !== history.latestEvent?.lifecycle) {
    issues.push(issue("integrity_violation", "currentLifecycle must match latest event lifecycle.", "currentLifecycle"));
  }

  return result(issues);
}

export function validateDecisionHistory(history: DecisionHistory): DecisionValidationResult {
  const shapeValidation = validateDecisionHistoryShape(history);
  const eventValidation = validateDecisionHistoryEvents(history.events);
  const issues = [...shapeValidation.issues, ...eventValidation.issues];
  return result(issues);
}

export function validateFoundationCompatibility(timestamp: string): DecisionValidationResult {
  const report = validateDecisionTimelineFoundation(timestamp);
  if (report.valid) {
    return result([]);
  }
  return result(
    report.issues.map((entry) => issue("foundation_incompatible", entry.message, entry.field))
  );
}

export function validateEngineEventCompatibility(events: readonly DecisionEngineEvent[]): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  for (const event of events) {
    if (event.platformVersion !== DECISION_EVENT_ENGINE_CONTRACT_VERSION) {
      issues.push(issue("engine_incompatible", `Invalid platformVersion on ${event.eventId}.`, "platformVersion"));
    }
    if (event.readOnly !== true) {
      issues.push(issue("event_mutation_risk", `Event ${event.eventId} is not read-only.`, "readOnly"));
    }
  }
  return result(issues);
}

export const DecisionHistoryValidation = Object.freeze({
  validateDecisionHistoryEvents,
  validateDecisionHistoryShape,
  validateDecisionHistory,
  validateFoundationCompatibility,
  validateEngineEventCompatibility,
});
