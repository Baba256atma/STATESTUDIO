/**
 * APP-5:8 — Scenario Timeline Dashboard Integration constants.
 */

export const SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION = "APP-5/8" as const;
export const SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_ARCHITECTURE_VERSION =
  "APP-5/8-dashboard-integration-arch" as const;

export const SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_TAGS = Object.freeze([
  "[APP5_8]",
  "[DASHBOARD_INTEGRATION]",
  "[API_LAYER_ONLY]",
  "[NO_UI]",
  "[NO_REACT]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SCENARIO_TIMELINE_DASHBOARD_CONTEXT_MANDATORY_FIELDS = Object.freeze([
  "scenarioId",
  "workspaceId",
  "summary",
  "status",
  "progress",
  "currentStage",
  "milestones",
  "recentChanges",
  "recentEvents",
  "historySummary",
  "historyDuration",
  "completedStages",
  "remainingStages",
  "eventCount",
  "timelineHealth",
  "diagnostics",
  "platformVersion",
  "metadata",
] as const);

export const SCENARIO_TIMELINE_DASHBOARD_VIEW_MODEL_MANDATORY_FIELDS = Object.freeze([
  ...SCENARIO_TIMELINE_DASHBOARD_CONTEXT_MANDATORY_FIELDS,
  "executiveSummary",
  "metrics",
] as const);

export const SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_LIMITS = Object.freeze({
  maxRecentEvents: 8,
  maxRecentChanges: 8,
  maxRegisteredViewModels: 1_000,
} as const);

export const SCENARIO_TIMELINE_DASHBOARD_FORBIDDEN_API_IMPORTS = Object.freeze([
  "scenarioTimelineEventEngine.ts",
  "scenarioTimelineLifecycleEngine.ts",
  "scenarioTimelineHistoryEngine.ts",
  "scenarioTimelineQueryEngine.ts",
  "scenarioTimelineEventRegistry.ts",
  "scenarioTimelineLifecycleRegistry.ts",
  "scenarioTimelineHistoryRegistry.ts",
  "scenarioTimelineApiSources.ts",
  "scenarioTimelineApiRouter.ts",
  "scenarioTimelineApiFacade.ts",
  "scenarioTimelineAssistantAdapter.ts",
  "scenarioTimelineAssistantContext.ts",
  "scenarioTimelineAssistantRouter.ts",
] as const);
