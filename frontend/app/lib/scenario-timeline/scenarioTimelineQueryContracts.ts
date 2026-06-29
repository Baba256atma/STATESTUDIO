/**
 * APP-5:5 — Scenario Timeline Query Engine contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_QUERY_ENGINE_TAGS,
  SCENARIO_TIMELINE_QUERY_FILTER_KEYS,
  SCENARIO_TIMELINE_QUERY_MANDATORY_RESULT_FIELDS,
  SCENARIO_TIMELINE_QUERY_TYPE_KEYS,
} from "./scenarioTimelineQueryConstants.ts";
import type { ScenarioTimelineQueryContractSurface } from "./scenarioTimelineQueryTypes.ts";
import { SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST } from "./scenarioTimelineHistoryContracts.ts";
import { SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";

export const SCENARIO_TIMELINE_QUERY_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
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
  "vectorSearch",
  "semanticSearch",
  "localStorage",
  "indexedDB",
  "fetch(",
  "axios",
] as const);

export const SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/5",
  title: "Scenario Timeline Query Engine",
  goal: "Read-only gateway for retrieving timeline information through canonical APP-5:2/3/4 APIs.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryErrors.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQuerySources.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryFilters.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQuerySelectors.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryValidator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryResolver.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryBuilder.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryRegistry.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryCompatibility.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryEngine.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineQueryEngine.test.ts",
    "docs/app-5-5-scenario-timeline-query-engine.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_QUERY_ENGINE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-5/1", "APP-5/2", "APP-5/3", "APP-5/4"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_QUERY_ENGINE_TAGS,
} satisfies StageManifest);

export const SCENARIO_TIMELINE_QUERY_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  noDirectRegistryAccess: true,
  noEventMutation: true,
  noLifecycleMutation: true,
  noHistoryMutation: true,
  noPersistence: true,
  noSearchIndex: true,
  noVisualization: true,
  noPlayback: true,
  noReact: true,
} as const);

export function getTimelineQueryContract(): ScenarioTimelineQueryContractSurface {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
    mandatoryResultFields: SCENARIO_TIMELINE_QUERY_MANDATORY_RESULT_FIELDS,
    supportedQueryTypes: SCENARIO_TIMELINE_QUERY_TYPE_KEYS,
    supportedFilters: SCENARIO_TIMELINE_QUERY_FILTER_KEYS,
    readOnly: true as const,
  });
}

export const ScenarioTimelineQueryEngineContract = Object.freeze({
  getTimelineQueryContract,
  version: SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_QUERY_ENGINE_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export { SCENARIO_TIMELINE_QUERY_MANDATORY_RESULT_FIELDS, SCENARIO_TIMELINE_QUERY_ENGINE_TAGS };
