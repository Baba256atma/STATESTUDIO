/**
 * APP-7:1 — Business Timeline Platform validation.
 */

import {
  BUSINESS_TIMELINE_CATEGORY_KEYS,
  BUSINESS_TIMELINE_DEFAULT_LIMITS,
  BUSINESS_TIMELINE_EVENT_TYPE_KEYS,
  BUSINESS_TIMELINE_IMPORTANCE_KEYS,
  BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS,
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_ID,
  BUSINESS_TIMELINE_RESERVED_METADATA_KEYS,
  BUSINESS_TIMELINE_RESERVED_TYPE_IDS,
  BUSINESS_TIMELINE_SOURCE_KEYS,
  BUSINESS_TIMELINE_STATUS_KEYS,
} from "./businessTimelineConstants.ts";
import type {
  BusinessEvent,
  BusinessEventCategory,
  BusinessEventImportance,
  BusinessEventSource,
  BusinessEventStatus,
  BusinessEventType,
  BusinessEventTypeId,
  BusinessEventTypeRegistration,
  BusinessMetadataExtensionRegistration,
  BusinessPlatformIdentity,
  BusinessTimelineRegistrationInput,
  BusinessValidationIssue,
  BusinessValidationResult,
  BusinessWorkspaceId,
} from "./businessTimelineTypes.ts";

function issue(code: string, message: string, field?: string): BusinessValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: BusinessValidationIssue[]): BusinessValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isBusinessEventCategory(value: string): value is BusinessEventCategory {
  return (BUSINESS_TIMELINE_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isBusinessEventType(value: string): value is BusinessEventType {
  return (BUSINESS_TIMELINE_EVENT_TYPE_KEYS as readonly string[]).includes(value);
}

export function isBusinessEventImportance(value: string): value is BusinessEventImportance {
  return (BUSINESS_TIMELINE_IMPORTANCE_KEYS as readonly string[]).includes(value);
}

export function isBusinessEventStatus(value: string): value is BusinessEventStatus {
  return (BUSINESS_TIMELINE_STATUS_KEYS as readonly string[]).includes(value);
}

export function isBusinessEventSource(value: string): value is BusinessEventSource {
  return (BUSINESS_TIMELINE_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isReservedBusinessEventTypeId(typeId: BusinessEventTypeId): boolean {
  return (BUSINESS_TIMELINE_RESERVED_TYPE_IDS as readonly string[]).includes(typeId);
}

export function isReservedBusinessMetadataKey(key: string): boolean {
  return (BUSINESS_TIMELINE_RESERVED_METADATA_KEYS as readonly string[]).includes(key);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validatePlatformIdentity(identity: BusinessPlatformIdentity): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (identity.appId !== "APP-7") {
    issues.push(issue("invalid_identity", "appId must be APP-7.", "appId"));
  }
  if (identity.platformId !== BUSINESS_TIMELINE_PLATFORM_ID) {
    issues.push(issue("invalid_identity", "platformId mismatch.", "platformId"));
  }
  if (identity.version !== BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_identity", "version mismatch.", "version"));
  }
  if (!identity.title.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  return result(issues);
}

export function validateVersionCompatibility(version: string): BusinessValidationResult {
  if (version !== BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    return result([
      issue(
        "version_incompatible",
        `Version ${version} is not compatible with ${BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION}.`,
        "version"
      ),
    ]);
  }
  return result([]);
}

export function validateWorkspaceIsolation(
  workspaceId: BusinessWorkspaceId,
  entryWorkspaceId: BusinessWorkspaceId
): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!workspaceId.trim() || !entryWorkspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required for isolation validation.", "workspaceId"));
  } else if (workspaceId !== entryWorkspaceId) {
    issues.push(
      issue(
        "workspace_isolation_violation",
        "Business event workspaceId must match timeline workspaceId.",
        "workspaceId"
      )
    );
  }
  return result(issues);
}

export function validateTimelineIdentity(timelineId: string): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!timelineId.trim()) {
    issues.push(issue("missing_field", "timelineId is required.", "timelineId"));
  } else if (!timelineId.startsWith("business-timeline-")) {
    issues.push(
      issue("invalid_timeline_identity", "timelineId must use business-timeline- prefix.", "timelineId")
    );
  }
  return result(issues);
}

export function validateBusinessTimelineRegistration(
  input: BusinessTimelineRegistrationInput
): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  issues.push(...validateTimelineIdentity(input.timelineId).issues);
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateBusinessEventTypeRegistration(
  input: BusinessEventTypeRegistration
): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!input.typeId?.trim()) {
    issues.push(issue("missing_field", "typeId is required.", "typeId"));
  } else if (isReservedBusinessEventTypeId(input.typeId)) {
    issues.push(issue("reserved_type_id", `typeId is reserved: ${input.typeId}.`, "typeId"));
  }
  if (!input.label?.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  } else if (input.label.length > BUSINESS_TIMELINE_DEFAULT_LIMITS.maxEventTypeLabelLength) {
    issues.push(issue("invalid_field", "label exceeds maximum length.", "label"));
  }
  if (input.description.length > BUSINESS_TIMELINE_DEFAULT_LIMITS.maxEventTypeDescriptionLength) {
    issues.push(issue("invalid_field", "description exceeds maximum length.", "description"));
  }
  for (const category of input.supportedCategories) {
    if (!isBusinessEventCategory(category)) {
      issues.push(issue("invalid_enum", `Invalid category: ${category}.`, "supportedCategories"));
    }
  }
  for (const status of input.supportedStatuses) {
    if (!isBusinessEventStatus(status)) {
      issues.push(issue("invalid_enum", `Invalid status: ${status}.`, "supportedStatuses"));
    }
  }
  for (const importance of input.supportedImportanceLevels) {
    if (!isBusinessEventImportance(importance)) {
      issues.push(issue("invalid_enum", `Invalid importance: ${importance}.`, "supportedImportanceLevels"));
    }
  }
  return result(issues);
}

export function validateMetadataExtensionRegistration(
  input: BusinessMetadataExtensionRegistration
): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!input.extensionId.trim()) {
    issues.push(issue("missing_field", "extensionId is required.", "extensionId"));
  } else if (isReservedBusinessMetadataKey(input.extensionId)) {
    issues.push(issue("reserved_name", `extensionId is reserved: ${input.extensionId}.`, "extensionId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

export function validateBusinessEventContractShape(event: BusinessEvent): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  for (const field of BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS) {
    const value = event[field as keyof BusinessEvent];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    } else if (typeof value === "string" && value.trim().length === 0) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    }
  }
  if (!isBusinessEventCategory(event.category)) {
    issues.push(issue("invalid_enum", "Invalid category.", "category"));
  }
  if (!isBusinessEventType(event.type)) {
    issues.push(issue("invalid_enum", "Invalid type.", "type"));
  }
  if (!isBusinessEventImportance(event.importance)) {
    issues.push(issue("invalid_enum", "Invalid importance.", "importance"));
  }
  if (!isBusinessEventStatus(event.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }
  if (!isBusinessEventSource(event.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }
  if (event.title.length > BUSINESS_TIMELINE_DEFAULT_LIMITS.maxEventTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  if (event.description.length > BUSINESS_TIMELINE_DEFAULT_LIMITS.maxEventDescriptionLength) {
    issues.push(issue("invalid_field", "description exceeds maximum length.", "description"));
  }
  if (event.tags.length > BUSINESS_TIMELINE_DEFAULT_LIMITS.maxTagsPerEvent) {
    issues.push(issue("invalid_field", "tags exceed maximum count.", "tags"));
  }
  return result(issues);
}

export const BusinessTimelineValidation = Object.freeze({
  isBusinessEventCategory,
  isBusinessEventType,
  isBusinessEventImportance,
  isBusinessEventStatus,
  isBusinessEventSource,
  isReservedBusinessEventTypeId,
  isReservedBusinessMetadataKey,
  hasDuplicateIds,
  validatePlatformIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
  validateTimelineIdentity,
  validateBusinessTimelineRegistration,
  validateBusinessEventTypeRegistration,
  validateMetadataExtensionRegistration,
  validateBusinessEventContractShape,
});
