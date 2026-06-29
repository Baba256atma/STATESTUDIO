/**
 * APP-6:1 — Decision Timeline Platform validation.
 */

import {
  DECISION_TIMELINE_CATEGORY_KEYS,
  DECISION_TIMELINE_DEFAULT_LIMITS,
  DECISION_TIMELINE_EVENT_TYPE_KEYS,
  DECISION_TIMELINE_MANDATORY_DECISION_FIELDS,
  DECISION_TIMELINE_MANDATORY_EVENT_FIELDS,
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_ID,
  DECISION_TIMELINE_RESERVED_METADATA_KEYS,
  DECISION_TIMELINE_RESERVED_TYPE_IDS,
  DECISION_TIMELINE_SOURCE_KEYS,
  DECISION_TIMELINE_STATUS_KEYS,
} from "./decisionTimelineConstants.ts";
import type {
  Decision,
  DecisionCategory,
  DecisionEvent,
  DecisionEventType,
  DecisionMetadataExtensionRegistration,
  DecisionPlatformIdentity,
  DecisionSource,
  DecisionStatus,
  DecisionTimelineEntry,
  DecisionTypeId,
  DecisionTypeRegistration,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isDecisionStatus(value: string): value is DecisionStatus {
  return (DECISION_TIMELINE_STATUS_KEYS as readonly string[]).includes(value);
}

export function isDecisionSource(value: string): value is DecisionSource {
  return (DECISION_TIMELINE_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isDecisionCategory(value: string): value is DecisionCategory {
  return (DECISION_TIMELINE_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isDecisionEventType(value: string): value is DecisionEventType {
  return (DECISION_TIMELINE_EVENT_TYPE_KEYS as readonly string[]).includes(value);
}

export function isReservedDecisionTypeId(typeId: DecisionTypeId): boolean {
  return (DECISION_TIMELINE_RESERVED_TYPE_IDS as readonly string[]).includes(typeId);
}

export function isReservedMetadataKey(key: string): boolean {
  return (DECISION_TIMELINE_RESERVED_METADATA_KEYS as readonly string[]).includes(key);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validatePlatformIdentity(identity: DecisionPlatformIdentity): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (identity.appId !== "APP-6") {
    issues.push(issue("invalid_identity", "appId must be APP-6.", "appId"));
  }
  if (identity.platformId !== DECISION_TIMELINE_PLATFORM_ID) {
    issues.push(issue("invalid_identity", "platformId mismatch.", "platformId"));
  }
  if (identity.version !== DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_identity", "version mismatch.", "version"));
  }
  if (!identity.title.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }

  return result(issues);
}

export function validateVersionCompatibility(version: string): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (version !== DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(
      issue(
        "version_incompatible",
        `Version ${version} is not compatible with ${DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION}.`,
        "version"
      )
    );
  }
  return result(issues);
}

export function validateWorkspaceIsolation(
  workspaceId: DecisionWorkspaceId,
  entryWorkspaceId: DecisionWorkspaceId
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (!workspaceId.trim() || !entryWorkspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required for isolation validation.", "workspaceId"));
  } else if (workspaceId !== entryWorkspaceId) {
    issues.push(
      issue(
        "workspace_isolation_violation",
        "Decision entry workspaceId must match decision workspaceId.",
        "workspaceId"
      )
    );
  }
  return result(issues);
}

export function validateTimelineIdentity(timelineId: string): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (!timelineId.trim()) {
    issues.push(issue("missing_field", "timelineId is required.", "timelineId"));
  } else if (!timelineId.startsWith("decision-timeline-")) {
    issues.push(
      issue("invalid_timeline_identity", "timelineId must use decision-timeline- prefix.", "timelineId")
    );
  }
  return result(issues);
}

export function validateDecisionTypeRegistration(input: DecisionTypeRegistration): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!input.typeId || input.typeId.trim().length === 0) {
    issues.push(issue("missing_field", "typeId is required.", "typeId"));
  } else if (isReservedDecisionTypeId(input.typeId)) {
    issues.push(issue("reserved_type_id", `typeId is reserved: ${input.typeId}.`, "typeId"));
  }

  if (!input.label || input.label.trim().length === 0) {
    issues.push(issue("missing_field", "label is required.", "label"));
  } else if (input.label.length > DECISION_TIMELINE_DEFAULT_LIMITS.maxDecisionTypeLabelLength) {
    issues.push(issue("invalid_field", "label exceeds maximum length.", "label"));
  }

  if (input.description.length > DECISION_TIMELINE_DEFAULT_LIMITS.maxDecisionTypeDescriptionLength) {
    issues.push(issue("invalid_field", "description exceeds maximum length.", "description"));
  }

  if (input.supportedStatuses.length === 0) {
    issues.push(issue("missing_field", "At least one status is required.", "supportedStatuses"));
  }
  for (const status of input.supportedStatuses) {
    if (!isDecisionStatus(status)) {
      issues.push(issue("invalid_enum", `Invalid status: ${status}.`, "supportedStatuses"));
    }
  }

  for (const category of input.supportedCategories) {
    if (!isDecisionCategory(category)) {
      issues.push(issue("invalid_enum", `Invalid category: ${category}.`, "supportedCategories"));
    }
  }

  for (const eventType of input.supportedEventTypes) {
    if (!isDecisionEventType(eventType)) {
      issues.push(issue("invalid_enum", `Invalid event type: ${eventType}.`, "supportedEventTypes"));
    }
  }

  return result(issues);
}

export function validateMetadataExtensionRegistration(
  input: DecisionMetadataExtensionRegistration
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!input.extensionId.trim()) {
    issues.push(issue("missing_field", "extensionId is required.", "extensionId"));
  } else if (isReservedMetadataKey(input.extensionId)) {
    issues.push(issue("reserved_name", `extensionId is reserved: ${input.extensionId}.`, "extensionId"));
  }

  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }

  return result(issues);
}

export function validateDecisionContractShape(decision: Decision): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  for (const field of DECISION_TIMELINE_MANDATORY_DECISION_FIELDS) {
    const value = decision[field as keyof Decision];
    if (value === undefined || value === null || (typeof value === "string" && value.trim().length === 0)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    }
  }

  if (!isDecisionStatus(decision.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }
  if (!isDecisionSource(decision.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }
  if (!isDecisionCategory(decision.category)) {
    issues.push(issue("invalid_enum", "Invalid category.", "category"));
  }
  if (decision.title.length > DECISION_TIMELINE_DEFAULT_LIMITS.maxDecisionTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  if (decision.summary.length > DECISION_TIMELINE_DEFAULT_LIMITS.maxDecisionSummaryLength) {
    issues.push(issue("invalid_field", "summary exceeds maximum length.", "summary"));
  }

  if (decision.tags) {
    if (decision.tags.length > DECISION_TIMELINE_DEFAULT_LIMITS.maxTagsPerDecision) {
      issues.push(issue("invalid_field", "tags exceed maximum count.", "tags"));
    }
    for (const tag of decision.tags) {
      if (tag.length > DECISION_TIMELINE_DEFAULT_LIMITS.maxTagLength) {
        issues.push(issue("invalid_field", `Tag exceeds maximum length: ${tag}.`, "tags"));
      }
    }
  }

  return result(issues);
}

export function validateDecisionEventContractShape(event: DecisionEvent): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  for (const field of DECISION_TIMELINE_MANDATORY_EVENT_FIELDS) {
    const value = event[field as keyof DecisionEvent];
    if (value === undefined || value === null || (typeof value === "string" && value.trim().length === 0)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    }
  }

  if (!isDecisionEventType(event.eventType)) {
    issues.push(issue("invalid_enum", "Invalid eventType.", "eventType"));
  }

  return result(issues);
}

export function validateDecisionTimelineEntryShape(entry: DecisionTimelineEntry): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!entry.entryId.trim()) {
    issues.push(issue("missing_field", "entryId is required.", "entryId"));
  }
  if (entry.sequenceNumber < 0) {
    issues.push(issue("invalid_field", "sequenceNumber must be non-negative.", "sequenceNumber"));
  }

  const eventValidation = validateDecisionEventContractShape(entry.event);
  if (!eventValidation.valid) {
    issues.push(...eventValidation.issues);
  }

  const isolationValidation = validateWorkspaceIsolation(entry.workspaceId, entry.event.workspaceId);
  if (!isolationValidation.valid) {
    issues.push(...isolationValidation.issues);
  }

  if (entry.decisionId !== entry.event.decisionId) {
    issues.push(issue("timeline_identity_mismatch", "entry decisionId must match event decisionId.", "decisionId"));
  }

  return result(issues);
}

export const DecisionTimelineValidation = Object.freeze({
  isDecisionStatus,
  isDecisionSource,
  isDecisionCategory,
  isDecisionEventType,
  isReservedDecisionTypeId,
  isReservedMetadataKey,
  hasDuplicateIds,
  validatePlatformIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
  validateTimelineIdentity,
  validateDecisionTypeRegistration,
  validateMetadataExtensionRegistration,
  validateDecisionContractShape,
  validateDecisionEventContractShape,
  validateDecisionTimelineEntryShape,
});
