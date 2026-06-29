/**
 * APP-6:2 — Decision Event registry.
 * In-memory publication only — no persistence.
 */

import {
  DECISION_ENGINE_EVENT_TYPE_KEYS,
  DECISION_ENGINE_LIFECYCLE_KEYS,
  DECISION_EVENT_ENGINE_CONTRACT_VERSION,
  DECISION_EVENT_ENGINE_LIMITS,
  DECISION_EVENT_TYPE_LIFECYCLE_MAP,
  type DecisionEngineEventType,
  type DecisionEngineLifecycle,
  type DecisionEventRegistrySnapshot,
  type DecisionEventResult,
  type DecisionEventTypeRegistration,
  decisionEventEngineErrorFromCode,
} from "./decisionEventTypes.ts";
import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import type { DecisionEventId } from "./decisionTimelineTypes.ts";
import {
  registerFutureExtension,
  registerMetadataExtension,
} from "./decisionTimelineRegistry.ts";

const publishedEvents = new Map<DecisionEventId, DecisionEngineEvent>();
const decisionSequenceCounters = new Map<string, number>();
const eventTypeRegistrations = new Map<DecisionEngineEventType, DecisionEventTypeRegistration>();
const futureExtensionSeeded = { value: false };

function seedDefaultEventTypeRegistrations(): void {
  for (const eventType of DECISION_ENGINE_EVENT_TYPE_KEYS) {
    const lifecycle = DECISION_EVENT_TYPE_LIFECYCLE_MAP[eventType];
    eventTypeRegistrations.set(
      eventType,
      Object.freeze({
        eventType,
        lifecycle,
        label: eventType.replace(/_/g, " ").toLowerCase(),
        description: `Canonical ${eventType} decision event binding.`,
        readOnly: true as const,
      })
    );
  }
}

function seedFutureExtensionRegistrations(): void {
  if (futureExtensionSeeded.value) {
    return;
  }
  registerMetadataExtension(
    Object.freeze({
      extensionId: "decision-event-context-v1",
      label: "Decision Event Context v1",
      description: "Engine-level context metadata extension.",
    })
  );
  for (const entry of [
    Object.freeze({ extensionId: "decision-replay-v1", label: "Replay v1", phaseKey: "decision_replay" }),
    Object.freeze({ extensionId: "decision-analytics-v1", label: "Analytics v1", phaseKey: "decision_analytics" }),
    Object.freeze({ extensionId: "decision-outcomes-v1", label: "Outcomes v1", phaseKey: "decision_outcomes" }),
    Object.freeze({ extensionId: "decision-ml-v1", label: "ML v1", phaseKey: "decision_ml" }),
  ]) {
    registerFutureExtension(entry);
  }
  futureExtensionSeeded.value = true;
}

seedDefaultEventTypeRegistrations();

export function resetDecisionEventRegistryForTests(): void {
  publishedEvents.clear();
  decisionSequenceCounters.clear();
  eventTypeRegistrations.clear();
  futureExtensionSeeded.value = false;
  seedDefaultEventTypeRegistrations();
}

export function isDuplicateDecisionEventId(eventId: DecisionEventId): boolean {
  return publishedEvents.has(eventId);
}

export function allocateDecisionSequenceNumber(decisionId: string): number {
  const current = decisionSequenceCounters.get(decisionId) ?? 0;
  const next = current + 1;
  decisionSequenceCounters.set(decisionId, next);
  return next;
}

export function peekDecisionSequenceNumber(decisionId: string): number {
  return (decisionSequenceCounters.get(decisionId) ?? 0) + 1;
}

export function registerDecisionEventType(
  registration: DecisionEventTypeRegistration
): DecisionEventResult<DecisionEventTypeRegistration> {
  if (!(DECISION_ENGINE_EVENT_TYPE_KEYS as readonly string[]).includes(registration.eventType)) {
    return Object.freeze({
      success: false,
      reason: "Invalid event type for registration.",
      data: null,
      error: decisionEventEngineErrorFromCode("invalidEventType", "Invalid event type.", "eventType"),
      readOnly: true as const,
    });
  }
  if (!(DECISION_ENGINE_LIFECYCLE_KEYS as readonly string[]).includes(registration.lifecycle)) {
    return Object.freeze({
      success: false,
      reason: "Invalid lifecycle for event type registration.",
      data: null,
      error: decisionEventEngineErrorFromCode("invalidLifecycle", "Invalid lifecycle.", "lifecycle"),
      readOnly: true as const,
    });
  }

  const frozen = Object.freeze({
    eventType: registration.eventType,
    lifecycle: registration.lifecycle,
    label: registration.label.trim(),
    description: registration.description.trim(),
    readOnly: true as const,
  });
  eventTypeRegistrations.set(registration.eventType, frozen);

  return Object.freeze({
    success: true,
    reason: "Decision event type registered.",
    data: frozen,
    error: null,
    readOnly: true as const,
  });
}

export function getDecisionEventTypeRegistration(
  eventType: DecisionEngineEventType
): DecisionEventTypeRegistration | null {
  return eventTypeRegistrations.get(eventType) ?? null;
}

export function publishDecisionEvent(event: DecisionEngineEvent): DecisionEventResult<DecisionEngineEvent> {
  if (publishedEvents.has(event.eventId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate eventId: ${event.eventId}.`,
      data: null,
      error: decisionEventEngineErrorFromCode("duplicateEvent", "Duplicate eventId.", "eventId"),
      readOnly: true as const,
    });
  }
  if (publishedEvents.size >= DECISION_EVENT_ENGINE_LIMITS.maxPublishedEvents) {
    return Object.freeze({
      success: false,
      reason: "Decision event registry is full.",
      data: null,
      error: decisionEventEngineErrorFromCode("registryFull", "Registry full."),
      readOnly: true as const,
    });
  }

  publishedEvents.set(event.eventId, event);
  return Object.freeze({
    success: true,
    reason: "Decision event published.",
    data: event,
    error: null,
    readOnly: true as const,
  });
}

export function getPublishedDecisionEvent(eventId: DecisionEventId): DecisionEngineEvent | null {
  return publishedEvents.get(eventId) ?? null;
}

export function getDecisionEventRegistry(): DecisionEventRegistrySnapshot {
  seedFutureExtensionRegistrations();
  return Object.freeze({
    registryVersion: DECISION_EVENT_ENGINE_CONTRACT_VERSION,
    publishedEventCount: publishedEvents.size,
    registeredEventTypeCount: eventTypeRegistrations.size,
    eventIds: Object.freeze([...publishedEvents.keys()]),
    readOnly: true as const,
  });
}

export function getRegisteredDecisionEventTypes(): readonly DecisionEventTypeRegistration[] {
  return Object.freeze(
    [...eventTypeRegistrations.values()].sort((left, right) => left.eventType.localeCompare(right.eventType))
  );
}

export const DecisionEventRegistry = Object.freeze({
  registerDecisionEventType,
  getDecisionEventTypeRegistration,
  publishDecisionEvent,
  getPublishedDecisionEvent,
  getDecisionEventRegistry,
  getRegisteredDecisionEventTypes,
  resetDecisionEventRegistryForTests,
  isDuplicateDecisionEventId,
  allocateDecisionSequenceNumber,
  peekDecisionSequenceNumber,
});
