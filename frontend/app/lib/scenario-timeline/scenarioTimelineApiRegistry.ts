/**
 * APP-5:6 — Scenario Timeline API registry.
 */

import { SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION, SCENARIO_TIMELINE_API_LAYER_LIMITS } from "./scenarioTimelineApiConstants.ts";
import type { ScenarioTimelineApiRegistrySnapshot, ScenarioTimelineApiResponseMetadata } from "./scenarioTimelineApiTypes.ts";

const apiRequestRegistry = new Map<string, ScenarioTimelineApiResponseMetadata>();

export function resetScenarioTimelineApiRegistryForTests(): void {
  apiRequestRegistry.clear();
}

export function registerScenarioTimelineApiRequest(metadata: ScenarioTimelineApiResponseMetadata): boolean {
  if (apiRequestRegistry.size >= SCENARIO_TIMELINE_API_LAYER_LIMITS.maxRegisteredRequests) {
    return false;
  }
  apiRequestRegistry.set(metadata.requestId, metadata);
  return true;
}

export function getTimelineApiRegistry(): ScenarioTimelineApiRegistrySnapshot {
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
    registeredRequestCount: apiRequestRegistry.size,
    requestIds: Object.freeze([...apiRequestRegistry.keys()]),
    readOnly: true as const,
  });
}

export const ScenarioTimelineApiRegistry = Object.freeze({
  registerScenarioTimelineApiRequest,
  getTimelineApiRegistry,
});
