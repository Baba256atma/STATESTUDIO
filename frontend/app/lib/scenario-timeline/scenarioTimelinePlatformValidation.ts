/**
 * APP-5:1 — Scenario Timeline Platform validation.
 */

import {
  SCENARIO_TIMELINE_DEFAULT_LIMITS,
  SCENARIO_TIMELINE_EVENT_TYPE_KEYS,
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_MANDATORY_EVENT_FIELDS,
  SCENARIO_TIMELINE_RESERVED_TYPE_IDS,
} from "./scenarioTimelinePlatformConstants.ts";
import type {
  ScenarioTimelineEventContract,
  ScenarioTimelineEventType,
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineTypeId,
  ScenarioTimelineTypeRegistration,
  ScenarioTimelineValidationIssue,
  ScenarioTimelineValidationResult,
} from "./scenarioTimelinePlatformTypes.ts";

function issue(code: string, message: string, field?: string): ScenarioTimelineValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ScenarioTimelineValidationIssue[]): ScenarioTimelineValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isScenarioTimelineLifecycleStage(value: string): value is ScenarioTimelineLifecycleStage {
  return (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly string[]).includes(value);
}

export function isScenarioTimelineEventType(value: string): value is ScenarioTimelineEventType {
  return (SCENARIO_TIMELINE_EVENT_TYPE_KEYS as readonly string[]).includes(value);
}

export function isReservedScenarioTimelineTypeId(typeId: ScenarioTimelineTypeId): boolean {
  return (SCENARIO_TIMELINE_RESERVED_TYPE_IDS as readonly string[]).includes(typeId);
}

export function hasDuplicateTimelineTypeIds(typeIds: readonly string[]): boolean {
  return new Set(typeIds).size !== typeIds.length;
}

export function validateTimelineTypeRegistration(
  input: ScenarioTimelineTypeRegistration
): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  if (!input.typeId || input.typeId.trim().length === 0) {
    issues.push(issue("missing_field", "typeId is required.", "typeId"));
  } else if (isReservedScenarioTimelineTypeId(input.typeId)) {
    issues.push(issue("reserved_type_id", `typeId is reserved: ${input.typeId}.`, "typeId"));
  }

  if (!input.label || input.label.trim().length === 0) {
    issues.push(issue("missing_field", "label is required.", "label"));
  } else if (input.label.length > SCENARIO_TIMELINE_DEFAULT_LIMITS.maxTimelineTypeLabelLength) {
    issues.push(issue("invalid_field", "label exceeds maximum length.", "label"));
  }

  if (input.description.length > SCENARIO_TIMELINE_DEFAULT_LIMITS.maxTimelineTypeDescriptionLength) {
    issues.push(issue("invalid_field", "description exceeds maximum length.", "description"));
  }

  if (input.supportedLifecycleStages.length === 0) {
    issues.push(issue("missing_field", "At least one lifecycle stage is required.", "supportedLifecycleStages"));
  }
  for (const stage of input.supportedLifecycleStages) {
    if (!isScenarioTimelineLifecycleStage(stage)) {
      issues.push(issue("invalid_enum", `Invalid lifecycle stage: ${stage}.`, "supportedLifecycleStages"));
    }
  }

  for (const eventType of input.supportedEventTypes) {
    if (!isScenarioTimelineEventType(eventType)) {
      issues.push(issue("invalid_enum", `Invalid event type: ${eventType}.`, "supportedEventTypes"));
    }
  }

  return result(issues);
}

export function validateTimelineEventContractShape(
  event: ScenarioTimelineEventContract
): ScenarioTimelineValidationResult {
  const issues: ScenarioTimelineValidationIssue[] = [];

  for (const field of SCENARIO_TIMELINE_MANDATORY_EVENT_FIELDS) {
    const value = event[field as keyof ScenarioTimelineEventContract];
    if (value === undefined || value === null || (typeof value === "string" && value.trim().length === 0)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    }
  }

  if (!isScenarioTimelineLifecycleStage(event.lifecycleStage)) {
    issues.push(issue("invalid_enum", "Invalid lifecycleStage.", "lifecycleStage"));
  }
  if (!isScenarioTimelineEventType(event.eventType)) {
    issues.push(issue("invalid_enum", "Invalid eventType.", "eventType"));
  }
  if (event.title.length > SCENARIO_TIMELINE_DEFAULT_LIMITS.maxEventTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  if (event.summary.length > SCENARIO_TIMELINE_DEFAULT_LIMITS.maxEventSummaryLength) {
    issues.push(issue("invalid_field", "summary exceeds maximum length.", "summary"));
  }

  return result(issues);
}

export const ScenarioTimelinePlatformValidation = Object.freeze({
  isScenarioTimelineLifecycleStage,
  isScenarioTimelineEventType,
  isReservedScenarioTimelineTypeId,
  hasDuplicateTimelineTypeIds,
  validateTimelineTypeRegistration,
  validateTimelineEventContractShape,
});
