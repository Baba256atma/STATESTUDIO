/**
 * APP-5:7 — Scenario Timeline Assistant Integration constants.
 */

export const SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION = "APP-5/7" as const;
export const SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_ARCHITECTURE_VERSION = "APP-5/7-assistant-integration-arch" as const;

export const SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_TAGS = Object.freeze([
  "[APP5_7]",
  "[ASSISTANT_INTEGRATION]",
  "[API_LAYER_ONLY]",
  "[NO_LLM]",
  "[NO_RECOMMENDATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS = Object.freeze([
  "what_happened",
  "what_changed",
  "current_stage",
  "milestones",
  "events_occurred",
  "recent_activity",
  "progress",
  "completed_stages",
  "remaining_stages",
  "scenario_history",
  "timeline_summary",
  "latest_event",
  "blocking_progress",
  "history_duration",
] as const);

export const SCENARIO_TIMELINE_ASSISTANT_CONTEXT_MANDATORY_FIELDS = Object.freeze([
  "scenarioId",
  "workspaceId",
  "timelineSummary",
  "timelineHistory",
  "currentStage",
  "progress",
  "status",
  "milestones",
  "recentChanges",
  "importantEvents",
  "historyDuration",
  "completedStages",
  "remainingStages",
  "warnings",
  "diagnostics",
  "platformVersion",
  "metadata",
] as const);

export const SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_LIMITS = Object.freeze({
  maxRecentChanges: 8,
  maxImportantEvents: 16,
  maxRegisteredContexts: 1_000,
} as const);

export const SCENARIO_TIMELINE_ASSISTANT_FORBIDDEN_API_IMPORTS = Object.freeze([
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
] as const);
