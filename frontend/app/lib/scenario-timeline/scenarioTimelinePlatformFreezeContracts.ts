/**
 * APP-5:10 — Scenario Timeline Platform Freeze constants and governance metadata.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST } from "./scenarioTimelinePlatformCertificationContracts.ts";
import { SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";

export const SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION = "APP-5/10" as const;
export const SCENARIO_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION =
  "APP-5/10-platform-freeze-arch" as const;

export const SCENARIO_TIMELINE_PLATFORM_NAME = "Scenario Timeline Platform" as const;
export const SCENARIO_TIMELINE_PLATFORM_VERSION = "APP-5" as const;
export const SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG = "app-5-scenario-timeline-v1.0.0-frozen" as const;
export const SCENARIO_TIMELINE_PLATFORM_RELEASE_STAGE = "production-ready" as const;
export const SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_VERSION = "APP-5-compat-v1" as const;

export const SCENARIO_TIMELINE_PLATFORM_STATUS_CERTIFIED = "CERTIFIED" as const;
export const SCENARIO_TIMELINE_PLATFORM_STATUS_FROZEN = "FROZEN" as const;
export const SCENARIO_TIMELINE_PLATFORM_STATUS_RELEASED = "RELEASED" as const;
export const SCENARIO_TIMELINE_PLATFORM_STATUS_PRODUCTION_READY = "PRODUCTION_READY" as const;

export const SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[APP5_10]",
  "[PLATFORM_FROZEN]",
  "[SCENARIO_TIMELINE_PLATFORM_COMPLETE]",
  "[METADATA_ONLY]",
  "[NO_RUNTIME_CHANGES]",
  "[EXTEND_ONLY]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES = Object.freeze([
  "docs/app-5-1-scenario-timeline-platform-foundation.md",
  "docs/app-5-6-scenario-timeline-api-layer.md",
  "docs/app-5-7-scenario-timeline-assistant-integration.md",
  "docs/app-5-8-scenario-timeline-dashboard-integration.md",
  "docs/app-5-9-scenario-timeline-platform-certification-report.md",
  "docs/app-5-10-scenario-timeline-platform-freeze-report.md",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_SUPPORT_POLICY = Object.freeze({
  policyId: "APP-5-SUPPORT",
  contractPreservation: true,
  breakingChangesForbidden: true,
  bugFixesMustPreservePublicContracts: true,
  readOnly: true as const,
} as const);

export const SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-5-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend the platform without modifying certified APP-5 implementation.",
  permitted: Object.freeze([
    "consumer_bindings",
    "adapter_wrappers",
    "metadata_extensions",
    "future_lay_modules",
    "future_app_extensions",
  ]),
  forbidden: Object.freeze([
    "engine_rewrites",
    "public_api_breaking_changes",
    "lifecycle_vocabulary_changes",
    "event_model_changes",
    "direct_engine_consumer_access",
    "api_layer_bypass",
    "registry_bypass",
  ]),
  integrationBoundary: "APP-5:6 Public API Layer",
  readOnly: true as const,
} as const);

export const SCENARIO_TIMELINE_PLATFORM_PUBLIC_GUARANTEES = Object.freeze([
  "frozen_public_apis",
  "frozen_contracts",
  "frozen_vocabulary",
  "frozen_lifecycle",
  "frozen_event_model",
  "backward_compatibility",
  "extension_only_future_development",
  "no_breaking_changes",
  "architecture_stability",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_FROZEN_PHASES = Object.freeze([
  Object.freeze({ phaseId: "APP-5/1", title: "Platform Foundation", contractVersion: "APP-5/1" }),
  Object.freeze({ phaseId: "APP-5/2", title: "Event Engine", contractVersion: "APP-5/2" }),
  Object.freeze({ phaseId: "APP-5/3", title: "Lifecycle Engine", contractVersion: "APP-5/3" }),
  Object.freeze({ phaseId: "APP-5/4", title: "History Engine", contractVersion: "APP-5/4" }),
  Object.freeze({ phaseId: "APP-5/5", title: "Query Engine", contractVersion: "APP-5/5" }),
  Object.freeze({ phaseId: "APP-5/6", title: "Public API Layer", contractVersion: "APP-5/6" }),
  Object.freeze({ phaseId: "APP-5/7", title: "Assistant Integration", contractVersion: "APP-5/7" }),
  Object.freeze({ phaseId: "APP-5/8", title: "Dashboard Integration", contractVersion: "APP-5/8" }),
  Object.freeze({ phaseId: "APP-5/9", title: "Platform Certification", contractVersion: "APP-5/9" }),
  Object.freeze({ phaseId: "APP-5/10", title: "Platform Freeze", contractVersion: "APP-5/10" }),
] as const);

export const SCENARIO_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "initializeScenarioTimelinePlatform",
  "initializeScenarioTimeline",
  "createScenarioTimelineEvent",
  "getScenarioTimeline",
  "queryScenarioTimeline",
  "getScenarioTimelineHistory",
  "getScenarioTimelineStatus",
  "getScenarioTimelineProgress",
  "getScenarioTimelineSummary",
  "getScenarioTimelineMilestones",
  "validateScenarioTimeline",
  "getScenarioTimelineHealth",
  "getScenarioTimelineVersion",
  "buildScenarioTimelineAssistantContext",
  "answerScenarioTimelineQuestion",
  "buildScenarioTimelineDashboardContext",
  "buildScenarioTimelineDashboardViewModel",
  "runScenarioTimelinePlatformCertification",
  "runScenarioTimelinePlatformFreeze",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY = Object.freeze([
  Object.freeze({ contractId: "platform-foundation", contractVersion: "APP-5/1", frozen: true }),
  Object.freeze({ contractId: "event-engine", contractVersion: "APP-5/2", frozen: true }),
  Object.freeze({ contractId: "lifecycle-engine", contractVersion: "APP-5/3", frozen: true }),
  Object.freeze({ contractId: "history-engine", contractVersion: "APP-5/4", frozen: true }),
  Object.freeze({ contractId: "query-engine", contractVersion: "APP-5/5", frozen: true }),
  Object.freeze({ contractId: "api-layer", contractVersion: "APP-5/6", frozen: true }),
  Object.freeze({ contractId: "assistant-integration", contractVersion: "APP-5/7", frozen: true }),
  Object.freeze({ contractId: "dashboard-integration", contractVersion: "APP-5/8", frozen: true }),
  Object.freeze({ contractId: "platform-certification", contractVersion: "APP-5/9", frozen: true }),
  Object.freeze({ contractId: "platform-freeze", contractVersion: "APP-5/10", frozen: true }),
] as const);

export const SCENARIO_TIMELINE_PLATFORM_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "timeline-visualization", status: "future_lay", phaseKey: "timeline_visualization" }),
  Object.freeze({ extensionId: "timeline-playback", status: "future_lay", phaseKey: "timeline_playback" }),
  Object.freeze({ extensionId: "timeline-persistence", status: "future_app", phaseKey: "timeline_storage" }),
  Object.freeze({ extensionId: "timeline-search", status: "future_app", phaseKey: "timeline_search" }),
  Object.freeze({ extensionId: "timeline-filters-ui", status: "future_lay", phaseKey: "timeline_filters" }),
  Object.freeze({ extensionId: "simulation-integration", status: "future_app", phaseKey: "timeline_simulation_integration" }),
] as const);

export const SCENARIO_TIMELINE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "components/",
  ".tsx",
  "react",
  "React",
  "useState",
  "createTimelineEvent",
  "calculateScenarioLifecycle",
  "PlaybackEngine",
  "localStorage",
  "indexedDB",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/10",
  title: "Scenario Timeline Platform Freeze",
  goal: "Official metadata-only platform freeze for certified APP-5:1 through APP-5:9.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFreezeContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFreezeCompatibility.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFreezeManifest.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFreezeCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFreezeRunner.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFreeze.test.ts",
    "docs/app-5-10-scenario-timeline-platform-freeze-report.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-5/9"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS,
} satisfies StageManifest);

export const ScenarioTimelinePlatformFreezeContract = Object.freeze({
  version: SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});
