/**
 * APP-5:7 — Scenario Timeline Assistant Integration contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_ASSISTANT_CONTEXT_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_TAGS,
  SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS,
} from "./scenarioTimelineAssistantConstants.ts";
import { SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST } from "./scenarioTimelineApiContracts.ts";
import { SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineAssistantContractSurface } from "./scenarioTimelineAssistantTypes.ts";

export const SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "dashboard/",
  "components/",
  ".tsx",
  "openai",
  "anthropic",
  "llm",
  "chatCompletion",
  "promptTemplate",
  "localStorage",
  "indexedDB",
  "fetch(",
  "axios",
  "express",
  "graphql",
  "websocket",
  "recommend",
  "decisionEngine",
] as const);

export const SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/7",
  title: "Scenario Timeline Assistant Integration",
  goal: "Prepare canonical timeline context and structured answers for the Executive Assistant via APP-5:6 only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantAdapter.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantContext.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantSummary.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantExplanation.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantHistory.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantRouter.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantValidator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantRegistry.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantCompatibility.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantIntegration.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantIntegration.test.ts",
    "docs/app-5-7-scenario-timeline-assistant-integration.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-5/1", "APP-5/2", "APP-5/3", "APP-5/4", "APP-5/5", "APP-5/6"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_TAGS,
} satisfies StageManifest);

export const SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_PUBLIC_API_RULES = Object.freeze({
  consumesApiLayerOnly: true,
  noDirectEngineAccess: true,
  noLlmReasoning: true,
  noRecommendations: true,
  immutableAssistantContext: true,
  noPersistence: true,
  noRestEndpoints: true,
  noGraphql: true,
  noWebsockets: true,
  noUi: true,
} as const);

export function getScenarioTimelineAssistantIntegrationContract(): ScenarioTimelineAssistantContractSurface {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
    mandatoryContextFields: SCENARIO_TIMELINE_ASSISTANT_CONTEXT_MANDATORY_FIELDS,
    supportedQuestions: SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS,
    consumesApiLayerOnly: true as const,
    readOnly: true as const,
  });
}

export const ScenarioTimelineAssistantIntegrationContract = Object.freeze({
  getScenarioTimelineAssistantIntegrationContract,
  version: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_TAGS };
