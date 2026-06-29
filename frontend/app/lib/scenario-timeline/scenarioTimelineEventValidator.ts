/**
 * APP-5:2 — Scenario Timeline Event validator.
 */

import {
  SCENARIO_TIMELINE_ALLOWED_EXTENSION_KEYS,
  SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS,
  SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP,
} from "./scenarioTimelineEventConstants.ts";
import type {
  ScenarioTimelineEvent,
  ScenarioTimelineValidationIssue,
  ScenarioTimelineValidationResult,
} from "./scenarioTimelineEventTypes.ts";
import type { NormalizedTimelineEventInput } from "./scenarioTimelineEventNormalizer.ts";
import { SCENARIO_TIMELINE_DEFAULT_LIMITS, SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineEventContract } from "./scenarioTimelinePlatformTypes.ts";
import {
  isScenarioTimelineEventType,
  isScenarioTimelineLifecycleStage,
  validateTimelineEventContractShape,
} from "./scenarioTimelinePlatformValidation.ts";
import { isDuplicateTimelineEventId } from "./scenarioTimelineEventRegistry.ts";

function issue(code: string, message: string, field?: string): ScenarioTimelineValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScenarioTimelineValidationIssue[]): ScenarioTimelineValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function isValidIsoTimestamp(value: string): boolean {
  if (value.length === 0) {
    return false;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

function validateExtensionKeys(extensions: Readonly<Record<string, string>>): ScenarioTimelineValidationIssue[] {
  const issues: ScenarioTimelineValidationIssue[] = [];
  const allowed = new Set(SCENARIO_TIMELINE_ALLOWED_EXTENSION_KEYS as readonly string[]);
  for (const key of Object.keys(extensions)) {
    if (!allowed.has(key)) {
      issues.push(issue("invalid_extension", `Extension key not registered: ${key}.`, "extensions"));
    }
  }
  return issues;
}

export function mapTimelineEventToFoundationContract(event: ScenarioTimelineEvent): ScenarioTimelineEventContract {
  return Object.freeze({
    eventId: event.eventId,
    scenarioId: event.scenarioId,
    workspaceId: event.workspaceId,
    eventType: event.eventType,
    lifecycleStage: event.stage,
    title: event.title,
    summary: event.summary,
    occurredAt: event.timestamp,
    sourceModule: event.sourceModule,
    contractVersion: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function validateNormalizedTimelineEventInput(
  input: NormalizedTimelineEventInput,
  options?: Readonly<{ checkDuplicate?: boolean }>
): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  for (const field of SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS) {
    if (field === "metadata" || field === "extensions" || field === "platformVersion" || field === "eventId") {
      continue;
    }
    const value = input[field as keyof NormalizedTimelineEventInput];
    if (value === undefined || value === null || (typeof value === "string" && value.trim().length === 0)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    }
  }

  if (!isScenarioTimelineLifecycleStage(input.stage)) {
    issues.push(issue("invalid_enum", "Invalid lifecycle stage.", "stage"));
  }
  if (!isScenarioTimelineEventType(input.eventType)) {
    issues.push(issue("invalid_enum", "Invalid event type.", "eventType"));
  }
  if (isScenarioTimelineLifecycleStage(input.stage) && isScenarioTimelineEventType(input.eventType)) {
    const expected = SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP[input.stage as keyof typeof SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP];
    if (input.eventType !== expected && input.eventType !== "metadata_annotation" && input.eventType !== "custom") {
      issues.push(
        issue(
          "stage_event_type_mismatch",
          `Event type ${input.eventType} is incompatible with stage ${input.stage}. Expected ${expected}.`,
          "eventType"
        )
      );
    }
  }

  if (!isValidIsoTimestamp(input.timestamp)) {
    issues.push(issue("invalid_timestamp", "timestamp must be a valid ISO-8601 value.", "timestamp"));
  }

  if (input.createdBy.length > SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxCreatedByLength) {
    issues.push(issue("invalid_field", "createdBy exceeds maximum length.", "createdBy"));
  }
  if (input.title.length > SCENARIO_TIMELINE_DEFAULT_LIMITS.maxEventTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  if (input.summary.length > SCENARIO_TIMELINE_DEFAULT_LIMITS.maxEventSummaryLength) {
    issues.push(issue("invalid_field", "summary exceeds maximum length.", "summary"));
  }

  if (Object.keys(input.metadata).length > SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxMetadataKeys) {
    issues.push(issue("invalid_metadata", "metadata exceeds maximum key count.", "metadata"));
  }
  if (Object.keys(input.extensions).length > SCENARIO_TIMELINE_EVENT_ENGINE_LIMITS.maxExtensionKeys) {
    issues.push(issue("invalid_extensions", "extensions exceed maximum key count.", "extensions"));
  }
  issues.push(...validateExtensionKeys(input.extensions));

  if (options?.checkDuplicate && input.eventId && isDuplicateTimelineEventId(input.eventId)) {
    issues.push(issue("duplicate_event", `Duplicate eventId: ${input.eventId}.`, "eventId"));
  }

  return result(issues);
}

export function validateTimelineEvent(event: ScenarioTimelineEvent): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  if (event.platformVersion !== SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_platform_version", "Invalid platformVersion.", "platformVersion"));
  }
  if (event.readOnly !== true) {
    issues.push(issue("contract_violation", "Timeline events must be read-only.", "readOnly"));
  }

  const normalizedValidation = validateNormalizedTimelineEventInput(
    Object.freeze({
      eventId: event.eventId,
      scenarioId: event.scenarioId,
      workspaceId: event.workspaceId,
      stage: event.stage,
      eventType: event.eventType,
      timestamp: event.timestamp,
      createdBy: event.createdBy,
      title: event.title,
      summary: event.summary,
      sourceModule: event.sourceModule,
      metadata: event.metadata,
      extensions: event.extensions,
    }),
    { checkDuplicate: false }
  );
  issues.push(...normalizedValidation.issues);

  const foundationValidation = validateTimelineEventContractShape(mapTimelineEventToFoundationContract(event));
  issues.push(...foundationValidation.issues);

  if (event.sequenceOrder < 1) {
    issues.push(issue("invalid_order", "sequenceOrder must be positive.", "sequenceOrder"));
  }

  return result(issues);
}

export const ScenarioTimelineEventValidator = Object.freeze({
  validateTimelineEvent,
  validateNormalizedTimelineEventInput,
  mapTimelineEventToFoundationContract,
});
