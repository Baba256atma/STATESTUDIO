/**
 * APP-5:3 — Scenario Timeline Lifecycle Engine contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_TAGS,
  SCENARIO_TIMELINE_LIFECYCLE_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_LIFECYCLE_STATUS_KEYS,
} from "./scenarioTimelineLifecycleConstants.ts";
import type { ScenarioTimelineLifecycleContractSurface } from "./scenarioTimelineLifecycleTypes.ts";
import { SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST } from "./scenarioTimelineEventContracts.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS, SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";

export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
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

export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/3",
  title: "Scenario Timeline Lifecycle Engine",
  goal: "Derive immutable scenario lifecycle state from APP-5:2 timeline events only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleErrors.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleTransitions.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleValidator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleCalculator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleBuilder.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleRegistry.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleCompatibility.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleEngine.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleEngine.test.ts",
    "docs/app-5-3-scenario-timeline-lifecycle-engine.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-5/1", "APP-5/2"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_TAGS,
} satisfies StageManifest);

export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  eventDerivedOnly: true,
  noEventMutation: true,
  noPersistence: true,
  noVisualization: true,
  noPlayback: true,
  noSearch: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
} as const);

export function getScenarioLifecycleContract(): ScenarioTimelineLifecycleContractSurface {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    mandatoryFields: SCENARIO_TIMELINE_LIFECYCLE_MANDATORY_FIELDS,
    supportedStages: SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
    supportedStatuses: SCENARIO_TIMELINE_LIFECYCLE_STATUS_KEYS,
    readOnly: true as const,
  });
}

export const ScenarioTimelineLifecycleEngineContract = Object.freeze({
  getScenarioLifecycleContract,
  version: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export { SCENARIO_TIMELINE_LIFECYCLE_MANDATORY_FIELDS, SCENARIO_TIMELINE_LIFECYCLE_ENGINE_TAGS };
