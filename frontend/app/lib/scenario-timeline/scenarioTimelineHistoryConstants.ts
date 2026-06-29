/**
 * APP-5:4 — Scenario Timeline History Engine constants.
 */

export const SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION = "APP-5/4" as const;
export const SCENARIO_TIMELINE_HISTORY_ENGINE_ARCHITECTURE_VERSION = "APP-5/4-history-engine-arch" as const;

export const SCENARIO_TIMELINE_HISTORY_ENGINE_TAGS = Object.freeze([
  "[APP5_4]",
  "[HISTORY_ENGINE]",
  "[EVENT_DERIVED_HISTORY]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SCENARIO_TIMELINE_HISTORY_MANDATORY_FIELDS = Object.freeze([
  "scenarioId",
  "workspaceId",
  "historyId",
  "events",
  "orderedEvents",
  "milestones",
  "historySummary",
  "historyStart",
  "historyEnd",
  "duration",
  "eventCount",
  "stageGroups",
  "latestStage",
  "latestEventId",
  "timelineVersion",
  "metadata",
] as const);

export const SCENARIO_TIMELINE_HISTORY_MILESTONE_KEYS = Object.freeze([
  "history_started",
  "stage_reached",
  "decision_recorded",
  "execution_started",
  "execution_finished",
  "results_recorded",
  "lessons_learned",
  "history_completed",
] as const);

export const SCENARIO_TIMELINE_HISTORY_GROUPING_KEYS = Object.freeze([
  "lifecycleStage",
  "calendarDate",
  "eventType",
  "sequenceOrder",
  "workspace",
  "scenario",
] as const);

export const SCENARIO_TIMELINE_HISTORY_ENGINE_LIMITS = Object.freeze({
  maxRegisteredHistories: 1_000,
  maxMilestones: 64,
  maxSummaryLength: 2048,
} as const);

export const SCENARIO_TIMELINE_HISTORY_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  engineNotInitialized: "engine_not_initialized",
  historyNotFound: "history_not_found",
  emptyEvents: "empty_events",
  registryFull: "registry_full",
} as const);
