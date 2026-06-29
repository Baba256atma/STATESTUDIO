/**
 * APP-5:8 — Scenario Timeline Dashboard Integration contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_DASHBOARD_CONTEXT_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_TAGS,
  SCENARIO_TIMELINE_DASHBOARD_VIEW_MODEL_MANDATORY_FIELDS,
} from "./scenarioTimelineDashboardConstants.ts";
import { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST } from "./scenarioTimelineAssistantContracts.ts";
import { SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineDashboardContractSurface } from "./scenarioTimelineDashboardTypes.ts";

export const SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "components/",
  ".tsx",
  "react",
  "React",
  "useState",
  "useEffect",
  "TimelineChart",
  "TimelineWidget",
  "DashboardPage",
  "PlaybackEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
  "axios",
  "express",
  "graphql",
  "websocket",
  "openai",
  "anthropic",
  "llm",
  "recommend",
] as const);

export const SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/8",
  title: "Scenario Timeline Dashboard Integration",
  goal: "Prepare immutable dashboard-ready timeline view models via APP-5:6 and optional APP-5:7.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardAdapter.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardContext.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardViewModel.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardSummary.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardMetrics.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardValidator.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardRegistry.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardCompatibility.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardIntegration.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelineDashboardIntegration.test.ts",
    "docs/app-5-8-scenario-timeline-dashboard-integration.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-5/1",
    "APP-5/2",
    "APP-5/3",
    "APP-5/4",
    "APP-5/5",
    "APP-5/6",
    "APP-5/7",
  ]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_TAGS,
} satisfies StageManifest);

export const SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_PUBLIC_API_RULES = Object.freeze({
  consumesApiLayerOnly: true,
  optionalAssistantContext: true,
  noDirectEngineAccess: true,
  noReactComponents: true,
  noDashboardPages: true,
  immutableViewModels: true,
  noPersistence: true,
  noRestEndpoints: true,
  noGraphql: true,
  noWebsockets: true,
} as const);

export function getScenarioTimelineDashboardIntegrationContract(): ScenarioTimelineDashboardContractSurface {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
    mandatoryContextFields: SCENARIO_TIMELINE_DASHBOARD_CONTEXT_MANDATORY_FIELDS,
    mandatoryViewModelFields: SCENARIO_TIMELINE_DASHBOARD_VIEW_MODEL_MANDATORY_FIELDS,
    consumesApiLayerOnly: true as const,
    readOnly: true as const,
  });
}

export const ScenarioTimelineDashboardIntegrationContract = Object.freeze({
  getScenarioTimelineDashboardIntegrationContract,
  version: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_TAGS };
