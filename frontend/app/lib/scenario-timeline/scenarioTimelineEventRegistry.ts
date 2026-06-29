/**
 * APP-5:2 — Scenario Timeline Event registry.
 * In-memory only — no persistence.
 */

import {
  SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS,
  SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP,
} from "./scenarioTimelineEventConstants.ts";
import { scenarioTimelineEventEngineErrorFromCode } from "./scenarioTimelineEventErrors.ts";
import type {
  ScenarioTimelineEvent,
  ScenarioTimelineEventRegistrySnapshot,
  ScenarioTimelineEventResult,
  ScenarioTimelineEventTypeRegistration,
} from "./scenarioTimelineEventTypes.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineEventId, ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";
import { isScenarioTimelineEventType, isScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformValidation.ts";

const publishedEvents = new Map<ScenarioTimelineEventId, ScenarioTimelineEvent>();
const scenarioSequenceCounters = new Map<string, number>();
const eventTypeRegistrations = new Map<ScenarioTimelineLifecycleStage, ScenarioTimelineEventTypeRegistration>();

function seedDefaultEventTypeRegistrations(): void {
  for (const stage of SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]) {
    const eventType = SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP[stage as keyof typeof SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP];
    eventTypeRegistrations.set(
      stage,
      Object.freeze({
        stage,
        eventType,
        label: stage.replace(/_/g, " "),
        description: `Canonical ${stage} timeline event binding.`,
        readOnly: true as const,
      })
    );
  }
}

seedDefaultEventTypeRegistrations();

export function resetScenarioTimelineEventRegistryForTests(): void {
  publishedEvents.clear();
  scenarioSequenceCounters.clear();
  eventTypeRegistrations.clear();
  seedDefaultEventTypeRegistrations();
}

export function isDuplicateTimelineEventId(eventId: ScenarioTimelineEventId): boolean {
  return publishedEvents.has(eventId);
}

export function allocateScenarioTimelineSequenceOrder(scenarioId: string): number {
  const current = scenarioSequenceCounters.get(scenarioId) ?? 0;
  const next = current + 1;
  scenarioSequenceCounters.set(scenarioId, next);
  return next;
}

export function peekScenarioTimelineSequenceOrder(scenarioId: string): number {
  return (scenarioSequenceCounters.get(scenarioId) ?? 0) + 1;
}

export function registerTimelineEventType(
  registration: ScenarioTimelineEventTypeRegistration
): ScenarioTimelineEventResult<ScenarioTimelineEventTypeRegistration> {
  if (!isScenarioTimelineLifecycleStage(registration.stage)) {
    return Object.freeze({
      success: false,
      reason: "Invalid lifecycle stage for event type registration.",
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("invalidStage", "Invalid lifecycle stage.", "stage"),
      readOnly: true as const,
    });
  }
  if (!isScenarioTimelineEventType(registration.eventType)) {
    return Object.freeze({
      success: false,
      reason: "Invalid event type for event type registration.",
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("invalidEventType", "Invalid event type.", "eventType"),
      readOnly: true as const,
    });
  }

  const frozen = Object.freeze({
    stage: registration.stage,
    eventType: registration.eventType,
    label: registration.label.trim(),
    description: registration.description.trim(),
    readOnly: true as const,
  });
  eventTypeRegistrations.set(registration.stage, frozen);

  return Object.freeze({
    success: true,
    reason: "Timeline event type registered.",
    data: frozen,
    error: null,
    readOnly: true as const,
  });
}

export function getTimelineEventTypeRegistration(
  stage: ScenarioTimelineLifecycleStage
): ScenarioTimelineEventTypeRegistration | null {
  return eventTypeRegistrations.get(stage) ?? null;
}

export function publishTimelineEvent(event: ScenarioTimelineEvent): ScenarioTimelineEventResult<ScenarioTimelineEvent> {
  if (publishedEvents.has(event.eventId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate eventId: ${event.eventId}.`,
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("duplicateEvent", "Duplicate eventId.", "eventId"),
      readOnly: true as const,
    });
  }
  if (publishedEvents.size >= SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxPublishedEvents) {
    return Object.freeze({
      success: false,
      reason: "Timeline event registry is full.",
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("registryFull", "Registry full."),
      readOnly: true as const,
    });
  }

  publishedEvents.set(event.eventId, event);
  return Object.freeze({
    success: true,
    reason: "Timeline event published.",
    data: event,
    error: null,
    readOnly: true as const,
  });
}

export function getPublishedTimelineEvent(eventId: ScenarioTimelineEventId): ScenarioTimelineEvent | null {
  return publishedEvents.get(eventId) ?? null;
}

export function getTimelineEventRegistry(): ScenarioTimelineEventRegistrySnapshot {
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
    publishedEventCount: publishedEvents.size,
    registeredEventTypeCount: eventTypeRegistrations.size,
    eventIds: Object.freeze([...publishedEvents.keys()]),
    readOnly: true as const,
  });
}
