/**
 * APP-5:6 — Scenario Timeline API Layer contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_API_CATEGORY_KEYS,
  SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
  SCENARIO_TIMELINE_API_LAYER_TAGS,
} from "./scenarioTimelineApiConstants.ts";
import type { ScenarioTimelineApiContractSurface } from "./scenarioTimelineApiTypes.ts";
import { SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST } from "./scenarioTimelineQueryContracts.ts";
import { SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";

export const SCENARIO_TIMELINE_API_LAYER_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "TimelineChart",
  "TimelineViewer",
  "PlaybackEngine",
  "PlaybackEngine",
  "vectorSearch",
  "semanticSearch",
  "localStorage",
  "indexedDB",
  "fetch(",
  "axios",
  "express",
  "graphql",
  "websocket",
] as const);

export const SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/6",
  title: "Scenario Timeline API Layer",
  goal: "Official public API gateway orchestrating certified APP-5:1 through APP-5:5 engines.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiErrors.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiSources.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiVersion.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiCompatibility.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiValidator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiRouter.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiRegistry.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiFacade.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiLayer.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineApiLayer.test.ts",
    "docs/app-5-6-scenario-timeline-api-layer.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_API_LAYER_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-5/1", "APP-5/2", "APP-5/3", "APP-5/4", "APP-5/5"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_API_LAYER_TAGS,
} satisfies StageManifest);

export const SCENARIO_TIMELINE_API_LAYER_PUBLIC_API_RULES = Object.freeze({
  consumerMustUseApiLayer: true,
  directEngineAccessForbidden: true,
  immutableResponses: true,
  noPersistence: true,
  noRestEndpoints: true,
  noGraphql: true,
  noWebsockets: true,
  noAuth: true,
} as const);

export function getScenarioTimelineApiContract(): ScenarioTimelineApiContractSurface {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
    categories: SCENARIO_TIMELINE_API_CATEGORY_KEYS,
    consumerMustUseApiLayer: true as const,
    readOnly: true as const,
  });
}

export const ScenarioTimelineApiLayerContract = Object.freeze({
  getScenarioTimelineApiContract,
  version: SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_API_LAYER_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export { SCENARIO_TIMELINE_API_LAYER_TAGS };
