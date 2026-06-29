/**
 * APP-5:5 — Scenario Timeline Query Engine constants.
 */

export const SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION = "APP-5/5" as const;
export const SCENARIO_TIMELINE_QUERY_ENGINE_ARCHITECTURE_VERSION = "APP-5/5-query-engine-arch" as const;

export const SCENARIO_TIMELINE_QUERY_ENGINE_TAGS = Object.freeze([
  "[APP5_5]",
  "[QUERY_ENGINE]",
  "[READ_ONLY_GATEWAY]",
  "[NO_PERSISTENCE]",
  "[NO_SEARCH_INDEX]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SCENARIO_TIMELINE_QUERY_TYPE_KEYS = Object.freeze([
  "scenario_timeline",
  "timeline_events",
  "timeline_history",
  "timeline_lifecycle",
  "timeline_milestones",
  "timeline_summary",
  "timeline_progress",
  "timeline_status",
  "latest_event",
  "first_event",
  "by_stage",
  "by_date",
  "by_event_id",
  "by_history_id",
] as const);

export const SCENARIO_TIMELINE_QUERY_FILTER_KEYS = Object.freeze([
  "scenarioId",
  "workspaceId",
  "eventId",
  "historyId",
  "stage",
  "eventType",
  "dateFrom",
  "dateTo",
  "sequenceFrom",
  "sequenceTo",
] as const);

export const SCENARIO_TIMELINE_QUERY_MANDATORY_RESULT_FIELDS = Object.freeze([
  "scenarioId",
  "workspaceId",
  "queryId",
  "queryType",
  "filters",
  "events",
  "history",
  "lifecycle",
  "summary",
  "milestones",
  "progress",
  "status",
  "metadata",
  "queryTimestamp",
  "platformVersion",
] as const);

export const SCENARIO_TIMELINE_QUERY_ENGINE_LIMITS = Object.freeze({
  maxRegisteredQueries: 2_000,
  maxResultEvents: 512,
} as const);

export const SCENARIO_TIMELINE_QUERY_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  engineNotInitialized: "engine_not_initialized",
  scenarioNotFound: "scenario_not_found",
  eventNotFound: "event_not_found",
  historyNotFound: "history_not_found",
  registryFull: "registry_full",
} as const);
