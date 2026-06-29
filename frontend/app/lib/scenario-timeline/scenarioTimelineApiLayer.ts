/**
 * APP-5:6 — Scenario Timeline API Layer.
 * Official public gateway for the Scenario Timeline Platform.
 */

import { buildScenarioTimelineApiResponse, resetScenarioTimelineApiRequestSequenceForTests } from "./scenarioTimelineApiErrors.ts";
import { getTimelineApiRegistry, resetScenarioTimelineApiRegistryForTests } from "./scenarioTimelineApiRegistry.ts";
import { ScenarioTimelineApiSources } from "./scenarioTimelineApiSources.ts";
import { getScenarioTimelineApiContract } from "./scenarioTimelineApiContracts.ts";
import { certifyScenarioTimelineApiLayer } from "./scenarioTimelineApiCertification.ts";
import {
  SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
  SCENARIO_TIMELINE_API_LAYER_TAGS,
} from "./scenarioTimelineApiConstants.ts";
import type { ScenarioTimelineApiLayerState, ScenarioTimelineApiResponse } from "./scenarioTimelineApiTypes.ts";
import {
  initializeScenarioTimelineApiLayer,
  initializeScenarioTimeline,
  isScenarioTimelineApiLayerInitialized,
  resetScenarioTimelineApiLayerForTests,
  createScenarioTimelineEvent,
  buildScenarioTimelineLifecycle,
  getScenarioTimeline,
  queryScenarioTimeline,
  getScenarioTimelineHistory,
  getScenarioTimelineStatus,
  getScenarioTimelineProgress,
  getScenarioTimelineSummary,
  getScenarioTimelineMilestones,
  validateScenarioTimeline,
  getScenarioTimelineHealth,
  getScenarioTimelineVersion,
} from "./scenarioTimelineApiFacade.ts";

let platformOnlyInitialized = false;

export function initializeScenarioTimelinePlatform(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ScenarioTimelineApiResponse<ReturnType<typeof ScenarioTimelineApiSources.readScenarioTimelineApiDiagnostics>> {
  ScenarioTimelineApiSources.initializeScenarioTimelinePlatform(timestamp);
  platformOnlyInitialized = true;
  const diagnostics = ScenarioTimelineApiSources.readScenarioTimelineApiDiagnostics();
  return buildScenarioTimelineApiResponse({
    success: diagnostics.foundationReady,
    status: diagnostics.foundationReady ? "ok" : "error",
    data: diagnostics,
    category: "platform",
    diagnostics,
    timestamp,
  });
}

export function certifyScenarioTimelinePlatform(): ReturnType<typeof certifyScenarioTimelineApiLayer> {
  return certifyScenarioTimelineApiLayer();
}

export function getScenarioTimelineApiLayerState(timestamp: string = "2026-01-01T00:00:00.000Z"): ScenarioTimelineApiLayerState {
  const registry = getTimelineApiRegistry();
  return Object.freeze({
    layerId: "scenario-timeline-api-layer",
    contractVersion: SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
    initialized: platformOnlyInitialized || isScenarioTimelineApiLayerInitialized(),
    registeredRequestCount: registry.registeredRequestCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetScenarioTimelinePlatformApiForTests(): void {
  platformOnlyInitialized = false;
  resetScenarioTimelineApiLayerForTests();
  resetScenarioTimelineApiRegistryForTests();
  resetScenarioTimelineApiRequestSequenceForTests();
}

export {
  initializeScenarioTimelineApiLayer,
  initializeScenarioTimeline,
  isScenarioTimelineApiLayerInitialized,
  resetScenarioTimelineApiLayerForTests,
  createScenarioTimelineEvent,
  buildScenarioTimelineLifecycle,
  getScenarioTimeline,
  queryScenarioTimeline,
  getScenarioTimelineHistory,
  getScenarioTimelineStatus,
  getScenarioTimelineProgress,
  getScenarioTimelineSummary,
  getScenarioTimelineMilestones,
  validateScenarioTimeline,
  getScenarioTimelineHealth,
  getScenarioTimelineVersion,
  getScenarioTimelineApiContract,
  certifyScenarioTimelineApiLayer,
  getTimelineApiRegistry,
};

export const SCENARIO_TIMELINE_API_LAYER_VERSION = SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION;
export { SCENARIO_TIMELINE_API_LAYER_TAGS };

export const ScenarioTimelineApiLayer = Object.freeze({
  initializeScenarioTimelinePlatform,
  initializeScenarioTimeline,
  getScenarioTimeline,
  createScenarioTimelineEvent,
  queryScenarioTimeline,
  getScenarioTimelineHealth,
  getScenarioTimelineVersion,
  certifyScenarioTimelinePlatform,
  getScenarioTimelineApiContract,
});
