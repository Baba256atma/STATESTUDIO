/**
 * APP-5:2 — Scenario Timeline Event Engine.
 * Canonical authority for immutable Scenario Timeline Events.
 */

import { scenarioTimelineEventEngineErrorFromCode } from "./scenarioTimelineEventErrors.ts";
import { buildTimelineEventFromInput, createTimelineEventInternal } from "./scenarioTimelineEventFactory.ts";
import type { CreateTimelineEventInput, ScenarioTimelineEventResult, ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import {
  getTimelineEventRegistry,
  registerTimelineEventType,
  resetScenarioTimelineEventRegistryForTests,
} from "./scenarioTimelineEventRegistry.ts";
import { validateTimelineEvent } from "./scenarioTimelineEventValidator.ts";
import {
  SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_EVENT_ENGINE_TAGS,
} from "./scenarioTimelineEventConstants.ts";
import type { ScenarioTimelineEventEngineState } from "./scenarioTimelineEventTypes.ts";
import { resetScenarioTimelineEventIdentityForTests } from "./scenarioTimelineEventIdentity.ts";
import { getTimelineEventContract } from "./scenarioTimelineEventContracts.ts";

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeScenarioTimelineEventEngine(timestamp: string = engineTimestamp): ScenarioTimelineEventEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getScenarioTimelineEventEngineState(timestamp);
}

export function isScenarioTimelineEventEngineInitialized(): boolean {
  return engineInitialized;
}

export function getScenarioTimelineEventEngineState(timestamp: string = engineTimestamp): ScenarioTimelineEventEngineState {
  const registry = getTimelineEventRegistry();
  return Object.freeze({
    engineId: "scenario-timeline-event-engine",
    contractVersion: SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    publishedEventCount: registry.publishedEventCount,
    registeredEventTypeCount: registry.registeredEventTypeCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetScenarioTimelineEventEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetScenarioTimelineEventRegistryForTests();
  resetScenarioTimelineEventIdentityForTests();
}

export function createTimelineEvent(input: CreateTimelineEventInput): ScenarioTimelineEventResult<ScenarioTimelineEvent> {
  if (!isScenarioTimelineEventEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Scenario Timeline Event Engine is not initialized.",
      data: null,
      error: scenarioTimelineEventEngineErrorFromCode("engineNotInitialized", "Engine not initialized."),
      readOnly: true as const,
    });
  }
  return createTimelineEventInternal(input);
}

export { buildTimelineEventFromInput as buildTimelineEvent };
export { validateTimelineEvent };
export { registerTimelineEventType, getTimelineEventRegistry };
export { getTimelineEventContract };
export { certifyTimelineEventEngine } from "./scenarioTimelineEventCertification.ts";

export const SCENARIO_TIMELINE_EVENT_ENGINE_VERSION = SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION;
export const SCENARIO_TIMELINE_EVENT_ENGINE_OWNER = "scenario-timeline-event-engine";
export { SCENARIO_TIMELINE_EVENT_ENGINE_TAGS };

export const ScenarioTimelineEventEngine = Object.freeze({
  initializeScenarioTimelineEventEngine,
  isScenarioTimelineEventEngineInitialized,
  getScenarioTimelineEventEngineState,
  createTimelineEvent,
  buildTimelineEvent: buildTimelineEventFromInput,
  validateTimelineEvent,
  registerTimelineEventType,
  getTimelineEventRegistry,
  getTimelineEventContract,
});
