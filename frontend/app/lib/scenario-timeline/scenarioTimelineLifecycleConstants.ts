/**
 * APP-5:3 — Scenario Timeline Lifecycle Engine constants.
 */

import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION = "APP-5/3" as const;
export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_ARCHITECTURE_VERSION = "APP-5/3-lifecycle-engine-arch" as const;

export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_TAGS = Object.freeze([
  "[APP5_3]",
  "[LIFECYCLE_ENGINE]",
  "[EVENT_DERIVED_STATE]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SCENARIO_TIMELINE_LIFECYCLE_MANDATORY_FIELDS = Object.freeze([
  "scenarioId",
  "workspaceId",
  "currentStage",
  "completedStages",
  "remainingStages",
  "progressPercentage",
  "status",
  "lastEventId",
  "lastTimestamp",
  "transitionHistory",
  "isCompleted",
  "isBlocked",
  "validationResult",
  "platformVersion",
  "metadata",
] as const);

export const SCENARIO_TIMELINE_LIFECYCLE_STATUS_KEYS = Object.freeze([
  "not_started",
  "in_progress",
  "completed",
  "blocked",
] as const);

export const SCENARIO_TIMELINE_LIFECYCLE_TERMINAL_STAGE = "lessons_learned" as const satisfies ScenarioTimelineLifecycleStage;

export const SCENARIO_TIMELINE_LIFECYCLE_INITIAL_STAGE = "scenario_created" as const satisfies ScenarioTimelineLifecycleStage;

export const SCENARIO_TIMELINE_LIFECYCLE_REPEATABLE_STAGES = Object.freeze([
  "scenario_updated",
] as const satisfies readonly ScenarioTimelineLifecycleStage[]);

export const SCENARIO_TIMELINE_LIFECYCLE_SINGLE_OCCURRENCE_STAGES = Object.freeze([
  "scenario_created",
  "scenario_simulated",
  "decision_made",
  "execution_started",
  "execution_finished",
  "actual_results_recorded",
  "lessons_learned",
] as const satisfies readonly ScenarioTimelineLifecycleStage[]);

export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_LIMITS = Object.freeze({
  maxRegisteredLifecycles: 1_000,
  maxTransitionHistoryEntries: 256,
} as const);

export const SCENARIO_TIMELINE_LIFECYCLE_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  engineNotInitialized: "engine_not_initialized",
  lifecycleNotFound: "lifecycle_not_found",
  invalidTransition: "invalid_transition",
  emptyEvents: "empty_events",
  registryFull: "registry_full",
} as const);
