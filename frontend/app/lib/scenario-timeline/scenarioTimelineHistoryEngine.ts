/**
 * APP-5:4 — Scenario Timeline History Engine.
 * Canonical authority for event-derived scenario history.
 */

import {
  buildScenarioHistory,
  validateScenarioHistory,
} from "./scenarioTimelineHistoryBuilder.ts";
import {
  SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_HISTORY_ENGINE_TAGS,
} from "./scenarioTimelineHistoryConstants.ts";
import { historyFailure, historySuccess } from "./scenarioTimelineHistoryErrors.ts";
import { getScenarioHistoryContract } from "./scenarioTimelineHistoryContracts.ts";
import {
  getScenarioHistory,
  getScenarioHistoryDuration,
  getScenarioHistoryMilestones,
  getScenarioHistoryRegistry,
  getScenarioHistorySummary,
  registerScenarioHistory,
  resetScenarioTimelineHistoryRegistryForTests,
} from "./scenarioTimelineHistoryRegistry.ts";
import type {
  BuildScenarioHistoryInput,
  ScenarioTimelineHistory,
  ScenarioTimelineHistoryEngineState,
  ScenarioTimelineHistoryResult,
} from "./scenarioTimelineHistoryTypes.ts";

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeScenarioTimelineHistoryEngine(
  timestamp: string = engineTimestamp
): ScenarioTimelineHistoryEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getScenarioTimelineHistoryEngineState(timestamp);
}

export function isScenarioTimelineHistoryEngineInitialized(): boolean {
  return engineInitialized;
}

export function getScenarioTimelineHistoryEngineState(
  timestamp: string = engineTimestamp
): ScenarioTimelineHistoryEngineState {
  const registry = getScenarioHistoryRegistry();
  return Object.freeze({
    engineId: "scenario-timeline-history-engine",
    contractVersion: SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredHistoryCount: registry.registeredHistoryCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetScenarioTimelineHistoryEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetScenarioTimelineHistoryRegistryForTests();
}

export function calculateScenarioHistory(
  input: BuildScenarioHistoryInput
): ScenarioTimelineHistoryResult<ScenarioTimelineHistory> {
  if (!isScenarioTimelineHistoryEngineInitialized()) {
    return historyFailure("Scenario Timeline History Engine is not initialized.");
  }

  const history = buildScenarioHistory(input);
  const registration = registerScenarioHistory(history);
  if (!registration.success || !registration.data) {
    return historyFailure(registration.reason);
  }

  return historySuccess("Scenario history calculated and registered.", registration.data);
}

export { buildScenarioHistory, validateScenarioHistory };
export {
  getScenarioHistory,
  getScenarioHistorySummary,
  getScenarioHistoryMilestones,
  getScenarioHistoryDuration,
  getScenarioHistoryRegistry,
};
export { getScenarioHistoryContract };
export { certifyScenarioHistoryEngine } from "./scenarioTimelineHistoryCertification.ts";

export const SCENARIO_TIMELINE_HISTORY_ENGINE_VERSION = SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION;
export const SCENARIO_TIMELINE_HISTORY_ENGINE_OWNER = "scenario-timeline-history-engine";
export { SCENARIO_TIMELINE_HISTORY_ENGINE_TAGS };

export const ScenarioTimelineHistoryEngine = Object.freeze({
  initializeScenarioTimelineHistoryEngine,
  isScenarioTimelineHistoryEngineInitialized,
  getScenarioTimelineHistoryEngineState,
  buildScenarioHistory,
  calculateScenarioHistory,
  validateScenarioHistory,
  getScenarioHistory,
  getScenarioHistorySummary,
  getScenarioHistoryMilestones,
  getScenarioHistoryDuration,
  getScenarioHistoryRegistry,
  getScenarioHistoryContract,
});
