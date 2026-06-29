/**
 * APP-5:4 — Scenario Timeline History Engine contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_HISTORY_ENGINE_TAGS,
  SCENARIO_TIMELINE_HISTORY_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_HISTORY_MILESTONE_KEYS,
} from "./scenarioTimelineHistoryConstants.ts";
import type { ScenarioTimelineHistoryContractSurface } from "./scenarioTimelineHistoryTypes.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST } from "./scenarioTimelineLifecycleContracts.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS, SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";

export const SCENARIO_TIMELINE_HISTORY_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
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

export const SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/4",
  title: "Scenario Timeline History Engine",
  goal: "Reconstruct immutable scenario history from APP-5:2 events with read-only APP-5:3 lifecycle context.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryErrors.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryGrouping.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryMilestones.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistorySummary.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryValidator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryCalculator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryBuilder.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryRegistry.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryCompatibility.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryEngine.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryEngine.test.ts",
    "docs/app-5-4-scenario-timeline-history-engine.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_HISTORY_ENGINE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-5/1", "APP-5/2", "APP-5/3"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_HISTORY_ENGINE_TAGS,
} satisfies StageManifest);

export const SCENARIO_TIMELINE_HISTORY_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  eventDerivedOnly: true,
  noEventMutation: true,
  noLifecycleMutation: true,
  noPersistence: true,
  noVisualization: true,
  noPlayback: true,
  noSearch: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
} as const);

export function getScenarioHistoryContract(): ScenarioTimelineHistoryContractSurface {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
    mandatoryFields: SCENARIO_TIMELINE_HISTORY_MANDATORY_FIELDS,
    supportedStages: SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
    milestoneKeys: SCENARIO_TIMELINE_HISTORY_MILESTONE_KEYS,
    readOnly: true as const,
  });
}

export const ScenarioTimelineHistoryEngineContract = Object.freeze({
  getScenarioHistoryContract,
  version: SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_HISTORY_ENGINE_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export { SCENARIO_TIMELINE_HISTORY_MANDATORY_FIELDS, SCENARIO_TIMELINE_HISTORY_ENGINE_TAGS };
