/**
 * APP-5:3 — Scenario Timeline Lifecycle Engine.
 * Canonical authority for event-derived scenario lifecycle state.
 */

import {
  buildScenarioLifecycle,
  validateScenarioLifecycle,
} from "./scenarioTimelineLifecycleBuilder.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_TAGS,
} from "./scenarioTimelineLifecycleConstants.ts";
import { getScenarioLifecycleContract } from "./scenarioTimelineLifecycleContracts.ts";
import {
  getLifecycleRegistry,
  getScenarioCurrentStage,
  getScenarioProgress,
  getScenarioStatus,
  registerScenarioLifecycle,
  resetScenarioTimelineLifecycleRegistryForTests,
} from "./scenarioTimelineLifecycleRegistry.ts";
import { validateScenarioTransition } from "./scenarioTimelineLifecycleTransitions.ts";
import type {
  BuildScenarioLifecycleInput,
  ScenarioTimelineLifecycle,
  ScenarioTimelineLifecycleEngineState,
  ScenarioTimelineLifecycleResult,
} from "./scenarioTimelineLifecycleTypes.ts";

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeScenarioTimelineLifecycleEngine(
  timestamp: string = engineTimestamp
): ScenarioTimelineLifecycleEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getScenarioTimelineLifecycleEngineState(timestamp);
}

export function isScenarioTimelineLifecycleEngineInitialized(): boolean {
  return engineInitialized;
}

export function getScenarioTimelineLifecycleEngineState(
  timestamp: string = engineTimestamp
): ScenarioTimelineLifecycleEngineState {
  const registry = getLifecycleRegistry();
  return Object.freeze({
    engineId: "scenario-timeline-lifecycle-engine",
    contractVersion: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredLifecycleCount: registry.registeredLifecycleCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetScenarioTimelineLifecycleEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetScenarioTimelineLifecycleRegistryForTests();
}

export function calculateScenarioLifecycle(
  input: BuildScenarioLifecycleInput
): ScenarioTimelineLifecycleResult<ScenarioTimelineLifecycle> {
  if (!isScenarioTimelineLifecycleEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Scenario Timeline Lifecycle Engine is not initialized.",
      data: null,
      readOnly: true as const,
    });
  }

  const lifecycle = buildScenarioLifecycle(input);
  const registration = registerScenarioLifecycle(lifecycle, input.events.length);
  if (!registration.success || !registration.data) {
    return Object.freeze({
      success: false,
      reason: registration.reason,
      data: null,
      readOnly: true as const,
    });
  }

  return Object.freeze({
    success: true,
    reason: "Scenario lifecycle calculated and registered.",
    data: registration.data,
    readOnly: true as const,
  });
}

export { buildScenarioLifecycle, validateScenarioLifecycle };
export { getScenarioCurrentStage, getScenarioProgress, getScenarioStatus, getLifecycleRegistry };
export { validateScenarioTransition };
export { getScenarioLifecycleContract };
export { certifyScenarioLifecycleEngine } from "./scenarioTimelineLifecycleCertification.ts";

export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_VERSION = SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION;
export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_OWNER = "scenario-timeline-lifecycle-engine";
export { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_TAGS };

export const ScenarioTimelineLifecycleEngine = Object.freeze({
  initializeScenarioTimelineLifecycleEngine,
  isScenarioTimelineLifecycleEngineInitialized,
  getScenarioTimelineLifecycleEngineState,
  buildScenarioLifecycle,
  calculateScenarioLifecycle,
  validateScenarioLifecycle,
  getScenarioCurrentStage,
  getScenarioProgress,
  getScenarioStatus,
  validateScenarioTransition,
  getLifecycleRegistry,
  getScenarioLifecycleContract,
});
