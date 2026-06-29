/**
 * APP-5:6 — Scenario Timeline API Layer constants.
 */

export const SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION = "APP-5/6" as const;
export const SCENARIO_TIMELINE_API_LAYER_ARCHITECTURE_VERSION = "APP-5/6-api-layer-arch" as const;

export const SCENARIO_TIMELINE_API_LAYER_TAGS = Object.freeze([
  "[APP5_6]",
  "[API_LAYER]",
  "[PUBLIC_GATEWAY]",
  "[NO_PERSISTENCE]",
  "[NO_UI]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SCENARIO_TIMELINE_API_CATEGORY_KEYS = Object.freeze([
  "platform",
  "event",
  "lifecycle",
  "history",
  "query",
  "validation",
  "certification",
  "compatibility",
  "initialization",
  "health",
] as const);

export const SCENARIO_TIMELINE_API_STATUS_KEYS = Object.freeze([
  "ok",
  "error",
  "warning",
] as const);

export const SCENARIO_TIMELINE_API_LAYER_LIMITS = Object.freeze({
  maxRegisteredRequests: 5_000,
  maxErrors: 16,
  maxWarnings: 16,
} as const);

export const SCENARIO_TIMELINE_API_ERROR_CODES = Object.freeze({
  apiNotInitialized: "api_not_initialized",
  validationFailure: "validation_failure",
  engineFailure: "engine_failure",
  scenarioNotFound: "scenario_not_found",
  registryFull: "registry_full",
} as const);

export const SCENARIO_TIMELINE_API_FORBIDDEN_ENGINE_REGISTRY_IMPORTS = Object.freeze([
  "scenarioTimelineEventRegistry.ts",
  "scenarioTimelineLifecycleRegistry.ts",
  "scenarioTimelineHistoryRegistry.ts",
] as const);
