/**
 * APP-5:6 — Scenario Timeline API version manager.
 */

import { SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION } from "./scenarioTimelineApiConstants.ts";
import { ScenarioTimelineApiSources } from "./scenarioTimelineApiSources.ts";
import type { ScenarioTimelineApiVersionMetadata } from "./scenarioTimelineApiTypes.ts";

export function getScenarioTimelineVersion(): ScenarioTimelineApiVersionMetadata {
  const foundation = ScenarioTimelineApiSources.getScenarioTimelineFoundationVersionMetadata();
  return Object.freeze({
    apiLayerVersion: SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
    foundationVersion: foundation.contractVersion,
    eventEngineVersion: ScenarioTimelineApiSources.versions.eventEngine,
    lifecycleEngineVersion: ScenarioTimelineApiSources.versions.lifecycleEngine,
    historyEngineVersion: ScenarioTimelineApiSources.versions.historyEngine,
    queryEngineVersion: ScenarioTimelineApiSources.versions.queryEngine,
    readOnly: true as const,
  });
}

export const ScenarioTimelineApiVersion = Object.freeze({
  getScenarioTimelineVersion,
});
