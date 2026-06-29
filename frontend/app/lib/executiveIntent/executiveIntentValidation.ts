/**
 * APP-3:1 — Executive Intent validation helpers.
 * Shape and enum validation only — no business logic or execution.
 */

import {
  EXECUTIVE_INTENT_DEFAULT_LIMITS,
  EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS,
  EXECUTIVE_INTENT_RESERVED_IDS,
  EXECUTIVE_INTENT_RESERVED_NAMESPACES,
  INTENT_CATEGORY_KEYS,
  INTENT_LIFECYCLE_KEYS,
  INTENT_PRIORITY_KEYS,
  INTENT_RELATION_TYPE_KEYS,
  INTENT_SCOPE_KEYS,
  INTENT_SOURCE_KEYS,
  INTENT_STATUS_KEYS,
} from "./executiveIntentConstants.ts";
import type {
  ExecutiveIntent,
  ExecutiveIntentValidationIssue,
  ExecutiveIntentValidationResult,
  IntentCategory,
  IntentLifecycleStage,
  IntentMetadata,
  IntentPriority,
  IntentRelationType,
  IntentScope,
  IntentSource,
  IntentStatus,
} from "./executiveIntentTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveIntentValidationIssue {
  return Object.freeze({ code, message, field });
}

function result(issues: ExecutiveIntentValidationIssue[]): ExecutiveIntentValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function isIntentCategory(value: string): value is IntentCategory {
  return (INTENT_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isIntentPriority(value: string): value is IntentPriority {
  return (INTENT_PRIORITY_KEYS as readonly string[]).includes(value);
}

export function isIntentStatus(value: string): value is IntentStatus {
  return (INTENT_STATUS_KEYS as readonly string[]).includes(value);
}

export function isIntentScope(value: string): value is IntentScope {
  return (INTENT_SCOPE_KEYS as readonly string[]).includes(value);
}

export function isIntentLifecycleStage(value: string): value is IntentLifecycleStage {
  return (INTENT_LIFECYCLE_KEYS as readonly string[]).includes(value);
}

export function isIntentSource(value: string): value is IntentSource {
  return (INTENT_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isIntentRelationType(value: string): value is IntentRelationType {
  return (INTENT_RELATION_TYPE_KEYS as readonly string[]).includes(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isReservedIntentId(intentId: string): boolean {
  return (EXECUTIVE_INTENT_RESERVED_IDS as readonly string[]).includes(intentId);
}

export function isReservedIntentNamespace(namespace: string): boolean {
  return (EXECUTIVE_INTENT_RESERVED_NAMESPACES as readonly string[]).includes(namespace);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) return true;
    seen.add(id);
  }
  return false;
}

export function validateStringLength(
  value: string,
  maxLength: number,
  field: string
): ExecutiveIntentValidationIssue | null {
  if (value.length > maxLength) {
    return issue("length_exceeded", `${field} exceeds maximum length of ${maxLength}.`, field);
  }
  return null;
}

export function validateIntentMetadataShape(
  input: Partial<IntentMetadata>
): ExecutiveIntentValidationResult {
  const issues: ExecutiveIntentValidationIssue[] = [];

  for (const field of EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS) {
    if (!(field in input)) {
      issues.push(issue("missing_field", `Missing mandatory metadata field "${field}".`, field));
    }
  }

  if (input.intentId !== undefined) {
    if (!isNonEmptyString(input.intentId)) {
      issues.push(issue("invalid_intent_id", "intentId must be a non-empty string.", "intentId"));
    } else if (isReservedIntentId(input.intentId)) {
      issues.push(issue("reserved_intent_id", `intentId "${input.intentId}" is reserved.`, "intentId"));
    }
  }

  if (input.title !== undefined) {
    const lengthIssue = validateStringLength(
      input.title,
      EXECUTIVE_INTENT_DEFAULT_LIMITS.maxTitleLength,
      "title"
    );
    if (lengthIssue) issues.push(lengthIssue);
  }

  if (input.summary !== undefined) {
    const lengthIssue = validateStringLength(
      input.summary,
      EXECUTIVE_INTENT_DEFAULT_LIMITS.maxSummaryLength,
      "summary"
    );
    if (lengthIssue) issues.push(lengthIssue);
  }

  if (input.description !== undefined) {
    const lengthIssue = validateStringLength(
      input.description,
      EXECUTIVE_INTENT_DEFAULT_LIMITS.maxDescriptionLength,
      "description"
    );
    if (lengthIssue) issues.push(lengthIssue);
  }

  if (input.priority !== undefined && !isIntentPriority(input.priority)) {
    issues.push(issue("invalid_priority", "priority is not a recognized IntentPriority.", "priority"));
  }

  if (input.status !== undefined && !isIntentStatus(input.status)) {
    issues.push(issue("invalid_status", "status is not a recognized IntentStatus.", "status"));
  }

  if (input.category !== undefined && !isIntentCategory(input.category)) {
    issues.push(issue("invalid_category", "category is not a recognized IntentCategory.", "category"));
  }

  if (input.source !== undefined && !isIntentSource(input.source)) {
    issues.push(issue("invalid_source", "source is not a recognized IntentSource.", "source"));
  }

  if (input.lifecycle !== undefined && !isIntentLifecycleStage(input.lifecycle)) {
    issues.push(issue("invalid_lifecycle", "lifecycle is not a recognized IntentLifecycleStage.", "lifecycle"));
  }

  if (input.scope !== undefined && !isIntentScope(input.scope.scope)) {
    issues.push(issue("invalid_scope", "scope.scope is not a recognized IntentScope.", "scope"));
  }

  if (input.tags !== undefined && input.tags.length > EXECUTIVE_INTENT_DEFAULT_LIMITS.maxTags) {
    issues.push(issue("limit_exceeded", "tags exceeds maximum allowed count.", "tags"));
  }

  if (input.references !== undefined && input.references.length > EXECUTIVE_INTENT_DEFAULT_LIMITS.maxReferences) {
    issues.push(issue("limit_exceeded", "references exceeds maximum allowed count.", "references"));
  }

  if (
    input.tags !== undefined &&
    hasDuplicateIds(input.tags.map((tag) => tag.tagId))
  ) {
    issues.push(issue("duplicate_id", "Duplicate tagId detected in tags.", "tags"));
  }

  if (
    input.references !== undefined &&
    hasDuplicateIds(input.references.map((reference) => reference.referenceId))
  ) {
    issues.push(issue("duplicate_id", "Duplicate referenceId detected in references.", "references"));
  }

  if (
    input.dependencies !== undefined &&
    hasDuplicateIds(input.dependencies.map((dependency) => dependency.dependencyId))
  ) {
    issues.push(issue("duplicate_id", "Duplicate dependencyId detected in dependencies.", "dependencies"));
  }

  if (input.readOnly !== undefined && input.readOnly !== true) {
    issues.push(issue("read_only_violation", "IntentMetadata must declare readOnly: true.", "readOnly"));
  }

  return result(issues);
}

export function validateExecutiveIntentShape(
  input: Partial<ExecutiveIntent>
): ExecutiveIntentValidationResult {
  const issues: ExecutiveIntentValidationIssue[] = [];

  if (!isNonEmptyString(input.intentId)) {
    issues.push(issue("missing_field", "intentId is required.", "intentId"));
  }

  if (!isNonEmptyString(input.workspaceId)) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }

  if (input.metadata !== undefined) {
    const metadataResult = validateIntentMetadataShape(input.metadata);
    issues.push(...metadataResult.issues);
    if (input.intentId && input.metadata.intentId && input.intentId !== input.metadata.intentId) {
      issues.push(
        issue("identity_mismatch", "intentId must match metadata.intentId.", "intentId")
      );
    }
    if (
      input.workspaceId &&
      input.metadata.workspaceId &&
      input.workspaceId !== input.metadata.workspaceId
    ) {
      issues.push(
        issue("identity_mismatch", "workspaceId must match metadata.workspaceId.", "workspaceId")
      );
    }
  } else {
    issues.push(issue("missing_field", "metadata is required.", "metadata"));
  }

  if (input.relations !== undefined) {
    if (input.relations.length > EXECUTIVE_INTENT_DEFAULT_LIMITS.maxRelations) {
      issues.push(issue("limit_exceeded", "relations exceeds maximum allowed count.", "relations"));
    }
    if (hasDuplicateIds(input.relations.map((relation) => relation.relationId))) {
      issues.push(issue("duplicate_id", "Duplicate relationId detected in relations.", "relations"));
    }
    for (const relation of input.relations) {
      if (!isIntentRelationType(relation.relationType)) {
        issues.push(
          issue("invalid_relation_type", "relationType is not recognized.", "relations")
        );
      }
    }
  }

  if (input.readOnly !== undefined && input.readOnly !== true) {
    issues.push(issue("read_only_violation", "ExecutiveIntent must declare readOnly: true.", "readOnly"));
  }

  return result(issues);
}

export function validateCustomMetadataKeys(
  customMetadata: Readonly<Record<string, string>>
): ExecutiveIntentValidationResult {
  const issues: ExecutiveIntentValidationIssue[] = [];
  const keys = Object.keys(customMetadata);

  if (keys.length > EXECUTIVE_INTENT_DEFAULT_LIMITS.maxCustomMetadataKeys) {
    issues.push(issue("limit_exceeded", "customMetadata key count exceeds maximum.", "customMetadata"));
  }

  for (const key of keys) {
    if (isReservedIntentNamespace(key)) {
      issues.push(
        issue("reserved_namespace", `customMetadata key "${key}" uses a reserved namespace.`, "customMetadata")
      );
    }
    const value = customMetadata[key];
    if (value.length > EXECUTIVE_INTENT_DEFAULT_LIMITS.maxCustomMetadataValueLength) {
      issues.push(
        issue("length_exceeded", `customMetadata value for "${key}" exceeds maximum length.`, "customMetadata")
      );
    }
  }

  if (hasDuplicateIds(keys)) {
    issues.push(issue("duplicate_id", "Duplicate customMetadata keys detected.", "customMetadata"));
  }

  return result(issues);
}
