/**
 * APP-6:2 — Decision Event builder.
 * Produces immutable, deterministic decision events and timeline entries.
 */

import {
  DECISION_ENGINE_TO_FOUNDATION_EVENT_TYPE_MAP,
  DECISION_EVENT_ENGINE_CONTRACT_VERSION,
  buildDecisionEngineEventVersion,
  type DecisionEngineEvent,
  type DecisionEngineEventIdentity,
  type NormalizedDecisionEventInput,
} from "./decisionEventTypes.ts";
import {
  allocateDecisionSequenceNumber,
  peekDecisionSequenceNumber,
} from "./decisionEventRegistry.ts";
import type { DecisionEventId, DecisionTimelineEntry } from "./decisionTimelineTypes.ts";

let eventSequence = 0;

export function resetDecisionEventIdentityForTests(): void {
  eventSequence = 0;
}

export function createDecisionEventId(
  decisionId: string,
  eventType: string,
  timestamp: string
): DecisionEventId {
  eventSequence += 1;
  const normalizedTime = timestamp.replace(/[:.]/g, "-");
  return `decision-event-${decisionId}-${eventType.toLowerCase()}-${normalizedTime}-${eventSequence}`;
}

export function createTimelineEntryId(
  decisionId: string,
  sequenceNumber: number
): string {
  return `decision-timeline-entry-${decisionId}-${sequenceNumber}`;
}

export function buildDecisionEventIdentity(input: {
  eventId: DecisionEventId;
  decisionId: string;
  timelineEntryId: string;
  workspaceId: string;
  scenarioId?: string;
  intentId?: string;
  timestamp: string;
  createdBy: string;
}): DecisionEngineEventIdentity {
  return Object.freeze({
    eventId: input.eventId,
    decisionId: input.decisionId,
    timelineEntryId: input.timelineEntryId,
    workspaceId: input.workspaceId,
    scenarioId: input.scenarioId,
    intentId: input.intentId,
    timestamp: input.timestamp,
    version: buildDecisionEngineEventVersion(),
    createdBy: input.createdBy,
    readOnly: true as const,
  });
}

export function buildDecisionEvent(
  input: NormalizedDecisionEventInput,
  sequenceNumber: number = peekDecisionSequenceNumber(input.decisionId)
): DecisionEngineEvent {
  const eventId = input.eventId ?? createDecisionEventId(input.decisionId, input.eventType, input.timestamp);
  const timelineEntryId = input.timelineEntryId ?? createTimelineEntryId(input.decisionId, sequenceNumber);

  const identity = buildDecisionEventIdentity({
    eventId,
    decisionId: input.decisionId,
    timelineEntryId,
    workspaceId: input.workspaceId,
    scenarioId: input.scenarioId,
    intentId: input.intentId,
    timestamp: input.timestamp,
    createdBy: input.createdBy,
  });

  return Object.freeze({
    eventId,
    decisionId: input.decisionId,
    timelineEntryId,
    workspaceId: input.workspaceId,
    scenarioId: input.scenarioId,
    intentId: input.intentId,
    eventType: input.eventType,
    lifecycle: input.lifecycle,
    timestamp: input.timestamp,
    createdBy: input.createdBy,
    platformVersion: DECISION_EVENT_ENGINE_CONTRACT_VERSION,
    title: input.title,
    summary: input.summary,
    sourceModule: input.sourceModule,
    sequenceNumber,
    identity,
    version: buildDecisionEngineEventVersion(),
    metadata: input.metadata,
    context: input.context ? Object.freeze({ ...input.context, readOnly: true as const }) : undefined,
    references: input.references ? Object.freeze([...input.references]) : undefined,
    tags: input.tags ? Object.freeze([...input.tags]) : undefined,
    extensions: input.extensions,
    readOnly: true as const,
  });
}

export function buildDecisionTimelineEntry(
  event: DecisionEngineEvent,
  recordedAt: string = event.timestamp
): DecisionTimelineEntry {
  const foundationEventType =
    DECISION_ENGINE_TO_FOUNDATION_EVENT_TYPE_MAP[
      event.eventType as keyof typeof DECISION_ENGINE_TO_FOUNDATION_EVENT_TYPE_MAP
    ];

  const foundationEvent = Object.freeze({
    eventId: event.eventId,
    decisionId: event.decisionId,
    workspaceId: event.workspaceId,
    eventType: foundationEventType,
    title: event.title,
    summary: event.summary,
    occurredAt: event.timestamp,
    sourceModule: event.sourceModule,
    contractVersion: event.version.foundationContractVersion,
    readOnly: true as const,
  });

  return Object.freeze({
    entryId: event.timelineEntryId,
    decisionId: event.decisionId,
    workspaceId: event.workspaceId,
    event: foundationEvent,
    sequenceNumber: event.sequenceNumber,
    recordedAt,
    readOnly: true as const,
  });
}

export const DecisionEventBuilder = Object.freeze({
  buildDecisionEvent,
  buildDecisionTimelineEntry,
  buildDecisionEventIdentity,
  createDecisionEventId,
  createTimelineEntryId,
  resetDecisionEventIdentityForTests,
});
