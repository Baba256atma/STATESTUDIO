/**
 * APP-5:2 — Scenario Timeline Event Engine contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_EVENT_ENGINE_TAGS,
  SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS,
} from "./scenarioTimelineEventConstants.ts";
import type { ScenarioTimelineEventContractSurface } from "./scenarioTimelineEventTypes.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS, SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";
import { SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST } from "./scenarioTimelinePlatformContracts.ts";

export const SCENARIO_TIMELINE_EVENT_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
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

export const SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/2",
  title: "Scenario Timeline Event Engine",
  goal: "Canonical immutable timeline event creation, validation, normalization, and in-memory publication.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventErrors.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventIdentity.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventNormalizer.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventValidator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventBuilder.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventFactory.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventRegistry.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventEngine.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineEventEngine.test.ts",
    "docs/app-5-2-scenario-timeline-event-engine.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_EVENT_ENGINE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-5/1"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_EVENT_ENGINE_TAGS,
} satisfies StageManifest);

export const SCENARIO_TIMELINE_EVENT_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noVisualization: true,
  noPlayback: true,
  noSearch: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
  immutableEvents: true,
} as const);

export function getTimelineEventContract(): ScenarioTimelineEventContractSurface {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
    mandatoryFields: SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS,
    supportedStages: SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
    readOnly: true as const,
  });
}

export const ScenarioTimelineEventEngineContract = Object.freeze({
  getTimelineEventContract,
  version: SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_EVENT_ENGINE_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export { SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS, SCENARIO_TIMELINE_EVENT_ENGINE_TAGS };
