/**
 * APP-7:2 — Business Event Engine validation.
 */

import { BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./businessTimelineConstants.ts";
import {
  isBusinessEventCategory,
  isBusinessEventImportance,
  isBusinessEventSource,
  isBusinessEventStatus,
  isBusinessEventType,
  validateWorkspaceIsolation,
} from "./businessTimelineValidation.ts";
import { isDuplicateBusinessEventId } from "./businessEventEngineRegistry.ts";
import {
  BUSINESS_EVENT_ENGINE_LIMITS,
  BUSINESS_EVENT_IMMUTABLE_FIELDS,
  BUSINESS_EVENT_UPDATABLE_FIELDS,
  type BusinessEngineEvent,
  type BusinessEventResult,
  type CreateBusinessEventInput,
  type NormalizedBusinessEventInput,
  type UpdateBusinessEventMetadataInput,
  businessEventEngineErrorFromCode,
} from "./businessEventEngineTypes.ts";
import type { BusinessValidationIssue, BusinessValidationResult } from "./businessTimelineTypes.ts";
import { validateBusinessTimeline } from "./businessTimelineContracts.ts";
import type { BusinessEvent } from "./businessTimelineTypes.ts";
import { validateBusinessEventContractShape } from "./businessTimelineValidation.ts";

function issue(code: string, message: string, field?: string): BusinessValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: BusinessValidationIssue[]): BusinessValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForEngine(timestamp: string): BusinessValidationResult {
  const foundation = validateBusinessTimeline(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function mapBusinessEngineEventToFoundationContract(event: BusinessEngineEvent): BusinessEvent {
  return Object.freeze({
    id: event.id,
    workspaceId: event.workspaceId,
    title: event.title,
    description: event.description,
    category: event.category,
    type: event.type,
    importance: event.importance,
    status: event.status,
    source: event.source,
    createdAt: event.createdAt,
    occurredAt: event.occurredAt,
    createdBy: event.createdBy,
    tags: event.tags,
    metadata: event.metadata,
    version: event.contractVersion,
    readOnly: true as const,
  });
}

export function validateEngineEventFoundationMapping(event: BusinessEngineEvent): BusinessValidationResult {
  return validateBusinessEventContractShape(mapBusinessEngineEventToFoundationContract(event));
}

export function validateBusinessEventInput(
  input: CreateBusinessEventInput | NormalizedBusinessEventInput,
  options: Readonly<{ checkDuplicate?: boolean }> = {}
): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];

  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.title?.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  if (!input.description?.trim()) {
    issues.push(issue("missing_field", "description is required.", "description"));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_field", "createdAt is required.", "createdAt"));
  }
  if (!input.occurredAt?.trim()) {
    issues.push(issue("missing_field", "occurredAt is required.", "occurredAt"));
  }
  if (!input.createdBy?.trim()) {
    issues.push(issue("missing_field", "createdBy is required.", "createdBy"));
  }

  if (!isBusinessEventCategory(input.category)) {
    issues.push(issue("invalid_enum", "Invalid category.", "category"));
  }
  if (!isBusinessEventType(input.type)) {
    issues.push(issue("invalid_enum", "Invalid type.", "type"));
  }
  if (!isBusinessEventImportance(input.importance)) {
    issues.push(issue("invalid_enum", "Invalid importance.", "importance"));
  }
  if (!isBusinessEventStatus(input.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }
  if (!isBusinessEventSource(input.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }

  if (input.title.length > BUSINESS_EVENT_ENGINE_LIMITS.maxTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  if (input.description.length > BUSINESS_EVENT_ENGINE_LIMITS.maxDescriptionLength) {
    issues.push(issue("invalid_field", "description exceeds maximum length.", "description"));
  }

  const tags = "tags" in input && Array.isArray(input.tags) ? input.tags : [];
  if (tags.length > BUSINESS_EVENT_ENGINE_LIMITS.maxTagsPerEvent) {
    issues.push(issue("invalid_field", "tags exceed maximum count.", "tags"));
  }

  if (input.id && options.checkDuplicate && isDuplicateBusinessEventId(input.id)) {
    issues.push(issue("duplicate_event", `Duplicate event id: ${input.id}.`, "id"));
  }

  return result(issues);
}

export function validateBusinessEngineEvent(event: BusinessEngineEvent): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  const inputValidation = validateBusinessEventInput(event, { checkDuplicate: false });
  issues.push(...inputValidation.issues);

  if (event.contractVersion !== BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (event.revisionVersion < 1) {
    issues.push(issue("invalid_field", "revisionVersion must be >= 1.", "revisionVersion"));
  }
  if (event.readOnly !== true) {
    issues.push(issue("contract_violation", "Event must be read-only.", "readOnly"));
  }
  if (event.archived !== (event.status === "archived")) {
    issues.push(issue("archive_mismatch", "archived flag must match archived status.", "archived"));
  }

  return result(issues);
}

export function validateUpdateBusinessEventMetadataInput(
  existing: BusinessEngineEvent,
  input: UpdateBusinessEventMetadataInput
): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];

  if (input.id !== existing.id) {
    issues.push(issue("forbidden_mutation", "Event id cannot be changed.", "id"));
  }
  const isolation = validateWorkspaceIsolation(input.workspaceId, existing.workspaceId);
  if (!isolation.valid) {
    issues.push(...isolation.issues);
  }

  if (input.importance !== undefined && !isBusinessEventImportance(input.importance)) {
    issues.push(issue("invalid_enum", "Invalid importance.", "importance"));
  }
  if (input.status !== undefined && !isBusinessEventStatus(input.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }

  const forbiddenKeys = Object.keys(input).filter(
    (key) =>
      !["id", "workspaceId", ...BUSINESS_EVENT_UPDATABLE_FIELDS].includes(key) &&
      (input as Record<string, unknown>)[key] !== undefined
  );
  for (const key of forbiddenKeys) {
    if ((BUSINESS_EVENT_IMMUTABLE_FIELDS as readonly string[]).includes(key)) {
      issues.push(issue("forbidden_mutation", `Field cannot be updated: ${key}.`, key));
    }
  }

  return result(issues);
}

export function assertNoHardDeleteInEngineSource(source: string): boolean {
  return !source.includes("deleteBusinessEvent(") && !source.includes("removeBusinessEvent(");
}

export function validationFailureResult<T>(validation: BusinessValidationResult, prefix: string): BusinessEventResult<T> {
  return Object.freeze({
    success: false,
    reason: validation.issues[0]?.message ?? `${prefix} rejected.`,
    data: null,
    error: businessEventEngineErrorFromCode(
      "validationFailure",
      validation.issues[0]?.message ?? "Validation failed.",
      validation.issues[0]?.field
    ),
    readOnly: true as const,
  });
}

export const BusinessEventEngineValidation = Object.freeze({
  validateFoundationCompatibilityForEngine,
  validateBusinessEventInput,
  validateBusinessEngineEvent,
  validateUpdateBusinessEventMetadataInput,
  assertNoHardDeleteInEngineSource,
});
