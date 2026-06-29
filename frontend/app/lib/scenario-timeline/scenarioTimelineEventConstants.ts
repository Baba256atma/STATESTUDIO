/**
 * APP-5:2 — Scenario Timeline Event Engine constants.
 */

import type { ScenarioTimelineEventType, ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

export const SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION = "APP-5/2" as const;
export const SCENARIO_TIMELINE_EVENT_ENGINE_ARCHITECTURE_VERSION = "APP-5/2-event-engine-arch" as const;
export const SCENARIO_TIMELINE_EVENT_SCHEMA_VERSION = "1.0.0" as const;
export const SCENARIO_TIMELINE_EVENT_SEMANTIC_VERSION = "1.0.0" as const;

export const SCENARIO_TIMELINE_EVENT_ENGINE_TAGS = Object.freeze([
  "[APP5_2]",
  "[TIMELINE_EVENT_ENGINE]",
  "[IMMUTABLE_EVENTS]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS = Object.freeze([
  "eventId",
  "scenarioId",
  "workspaceId",
  "eventType",
  "stage",
  "timestamp",
  "createdBy",
  "platformVersion",
  "metadata",
  "extensions",
] as const);

export const SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP = Object.freeze({
  scenario_created: "lifecycle_transition",
  scenario_updated: "lifecycle_transition",
  scenario_simulated: "scenario_milestone",
  decision_made: "decision_record",
  execution_started: "execution_milestone",
  execution_finished: "execution_milestone",
  actual_results_recorded: "results_recorded",
  lessons_learned: "lesson_learned",
} as const satisfies Readonly<Record<ScenarioTimelineLifecycleStage, ScenarioTimelineEventType>>);

export const SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS = Object.freeze({
  maxMetadataKeys: 32,
  maxExtensionKeys: 16,
  maxMetadataValueLength: 512,
  maxExtensionValueLength: 512,
  maxCreatedByLength: 128,
  maxPublishedEvents: 10_000,
} as const);

export const SCENARIO_TIMELINE_EVENT_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  duplicateEvent: "duplicate_event",
  invalidStage: "invalid_stage",
  invalidEventType: "invalid_event_type",
  registryFull: "registry_full",
  engineNotInitialized: "engine_not_initialized",
} as const);

export const SCENARIO_TIMELINE_ALLOWED_EXTENSION_KEYS = Object.freeze([
  "correlationId",
  "sourceReferenceId",
  "intentReferenceId",
  "decisionReferenceId",
  "memoryReferenceId",
] as const);
