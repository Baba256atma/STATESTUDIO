/**
 * APP-6:3 — Decision History aggregator.
 * Groups and orders immutable decision events deterministically.
 */

import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import type { DecisionId, DecisionReference } from "./decisionTimelineTypes.ts";

function compareDecisionEvents(left: DecisionEngineEvent, right: DecisionEngineEvent): number {
  if (left.sequenceNumber !== right.sequenceNumber) {
    return left.sequenceNumber - right.sequenceNumber;
  }

  const leftTime = Date.parse(left.timestamp);
  const rightTime = Date.parse(right.timestamp);
  if (leftTime !== rightTime) {
    return leftTime - rightTime;
  }

  const leftVersion = left.version.semanticVersion.localeCompare(right.version.semanticVersion);
  if (leftVersion !== 0) {
    return leftVersion;
  }

  return left.eventId.localeCompare(right.eventId);
}

export function orderDecisionEventsForHistory(
  events: readonly DecisionEngineEvent[]
): readonly DecisionEngineEvent[] {
  return Object.freeze([...events].sort(compareDecisionEvents));
}

export function aggregateEventsByDecisionId(
  events: readonly DecisionEngineEvent[]
): Readonly<Record<DecisionId, readonly DecisionEngineEvent[]>> {
  const groups: Record<DecisionId, DecisionEngineEvent[]> = {};

  for (const event of events) {
    if (!groups[event.decisionId]) {
      groups[event.decisionId] = [];
    }
    groups[event.decisionId]!.push(event);
  }

  return Object.freeze(
    Object.fromEntries(
      Object.entries(groups).map(([decisionId, groupedEvents]) => [
        decisionId,
        orderDecisionEventsForHistory(groupedEvents),
      ])
    )
  );
}

export function extractDecisionReferences(
  orderedEvents: readonly DecisionEngineEvent[]
): readonly DecisionReference[] {
  const references = new Map<string, DecisionReference>();

  for (const event of orderedEvents) {
    for (const reference of event.references ?? []) {
      references.set(reference.referenceId, reference);
    }
  }

  return Object.freeze([...references.values()]);
}

export function calculateHistoryBounds(orderedEvents: readonly DecisionEngineEvent[]): Readonly<{
  createdAt: string | null;
  updatedAt: string | null;
  currentLifecycle: DecisionEngineEvent["lifecycle"] | null;
  currentVersion: DecisionEngineEvent["version"] | null;
  firstEvent: DecisionEngineEvent | null;
  latestEvent: DecisionEngineEvent | null;
  readOnly: true;
}> {
  const firstEvent = orderedEvents[0] ?? null;
  const latestEvent = orderedEvents.at(-1) ?? null;

  return Object.freeze({
    createdAt: firstEvent?.timestamp ?? null,
    updatedAt: latestEvent?.timestamp ?? null,
    currentLifecycle: latestEvent?.lifecycle ?? null,
    currentVersion: latestEvent?.version ?? null,
    firstEvent,
    latestEvent,
    readOnly: true as const,
  });
}

export const DecisionHistoryAggregator = Object.freeze({
  orderDecisionEventsForHistory,
  aggregateEventsByDecisionId,
  extractDecisionReferences,
  calculateHistoryBounds,
});
