/**
 * APP-4:1 — Executive Memory validation helpers.
 * Shape and registry validation only — no storage or retrieval.
 */

import {
  EXECUTIVE_MEMORY_CATEGORY_KEYS,
  EXECUTIVE_MEMORY_DEFAULT_LIMITS,
  EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS,
  EXECUTIVE_MEMORY_RESERVED_MEMORY_IDS,
  EXECUTIVE_MEMORY_RESERVED_PROVIDER_IDS,
} from "./executiveMemoryConstants.ts";
import type {
  ExecutiveMemory,
  ExecutiveMemoryCategory,
  ExecutiveMemoryMetadata,
  ExecutiveMemoryProvider,
  ExecutiveMemoryProviderRegistration,
  ExecutiveMemoryValidationIssue,
  ExecutiveMemoryValidationResult,
} from "./executiveMemoryTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveMemoryValidationIssue {
  return Object.freeze({ code, message, field });
}

function result(issues: ExecutiveMemoryValidationIssue[]): ExecutiveMemoryValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function isExecutiveMemoryCategory(value: string): value is ExecutiveMemoryCategory {
  return (EXECUTIVE_MEMORY_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isReservedExecutiveMemoryProviderId(providerId: string): boolean {
  return (EXECUTIVE_MEMORY_RESERVED_PROVIDER_IDS as readonly string[]).includes(providerId);
}

export function isReservedExecutiveMemoryId(memoryId: string): boolean {
  return (EXECUTIVE_MEMORY_RESERVED_MEMORY_IDS as readonly string[]).includes(memoryId);
}

export function validateExecutiveMemoryCategories(
  categories: readonly string[]
): ExecutiveMemoryValidationResult {
  const issues: ExecutiveMemoryValidationIssue[] = [];
  if (categories.length === 0) {
    issues.push(issue("categories_empty", "At least one supported category is required.", "supportedCategories"));
  }
  for (const category of categories) {
    if (!isExecutiveMemoryCategory(category)) {
      issues.push(issue("invalid_category", `Invalid memory category: ${category}.`, "supportedCategories"));
    }
  }
  return result(issues);
}

export function validateExecutiveMemoryProviderRegistration(
  input: ExecutiveMemoryProviderRegistration
): ExecutiveMemoryValidationResult {
  const issues: ExecutiveMemoryValidationIssue[] = [];
  if (!isNonEmptyString(input.providerId)) {
    issues.push(issue("provider_id_missing", "Provider id is required.", "providerId"));
  } else if (isReservedExecutiveMemoryProviderId(input.providerId)) {
    issues.push(issue("provider_id_reserved", `Provider id is reserved: ${input.providerId}.`, "providerId"));
  }
  if (!isNonEmptyString(input.label)) {
    issues.push(issue("provider_label_missing", "Provider label is required.", "label"));
  } else if (input.label.length > EXECUTIVE_MEMORY_DEFAULT_LIMITS.maxProviderLabelLength) {
    issues.push(issue("provider_label_too_long", "Provider label exceeds maximum length.", "label"));
  }
  if (!isNonEmptyString(input.version)) {
    issues.push(issue("provider_version_missing", "Provider version is required.", "version"));
  }
  const categoryValidation = validateExecutiveMemoryCategories(input.supportedCategories);
  issues.push(...categoryValidation.issues);
  return result(issues);
}

export function validateExecutiveMemoryMetadataShape(
  metadata: ExecutiveMemoryMetadata
): ExecutiveMemoryValidationResult {
  const issues: ExecutiveMemoryValidationIssue[] = [];
  for (const field of EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS) {
    if (!(field in metadata)) {
      issues.push(issue("metadata_field_missing", `Missing metadata field: ${field}.`, field));
    }
  }
  if (!isExecutiveMemoryCategory(metadata.category)) {
    issues.push(issue("invalid_category", "Metadata category is invalid.", "category"));
  }
  if (isReservedExecutiveMemoryId(metadata.memoryId)) {
    issues.push(issue("memory_id_reserved", "Memory id is reserved.", "memoryId"));
  }
  if (metadata.title.length > EXECUTIVE_MEMORY_DEFAULT_LIMITS.maxTitleLength) {
    issues.push(issue("title_too_long", "Title exceeds maximum length.", "title"));
  }
  if (metadata.summary.length > EXECUTIVE_MEMORY_DEFAULT_LIMITS.maxSummaryLength) {
    issues.push(issue("summary_too_long", "Summary exceeds maximum length.", "summary"));
  }
  if (metadata.tags.length > EXECUTIVE_MEMORY_DEFAULT_LIMITS.maxTags) {
    issues.push(issue("too_many_tags", "Tag count exceeds maximum.", "tags"));
  }
  if (metadata.references.length > EXECUTIVE_MEMORY_DEFAULT_LIMITS.maxReferences) {
    issues.push(issue("too_many_references", "Reference count exceeds maximum.", "references"));
  }
  const customKeys = Object.keys(metadata.customMetadata);
  if (customKeys.length > EXECUTIVE_MEMORY_DEFAULT_LIMITS.maxCustomMetadataKeys) {
    issues.push(issue("too_many_custom_metadata_keys", "Custom metadata key count exceeds maximum.", "customMetadata"));
  }
  return result(issues);
}

export function validateExecutiveMemoryShape(memory: ExecutiveMemory): ExecutiveMemoryValidationResult {
  const issues: ExecutiveMemoryValidationIssue[] = [];
  if (memory.memoryId !== memory.metadata.memoryId) {
    issues.push(issue("memory_id_mismatch", "Memory id must match metadata memory id.", "memoryId"));
  }
  if (memory.workspaceId !== memory.metadata.workspaceId) {
    issues.push(issue("workspace_id_mismatch", "Workspace id must match metadata workspace id.", "workspaceId"));
  }
  if (memory.category !== memory.metadata.category) {
    issues.push(issue("category_mismatch", "Memory category must match metadata category.", "category"));
  }
  issues.push(...validateExecutiveMemoryMetadataShape(memory.metadata).issues);
  return result(issues);
}

export function validateExecutiveMemoryProviderShape(
  provider: ExecutiveMemoryProvider
): ExecutiveMemoryValidationResult {
  const issues: ExecutiveMemoryValidationIssue[] = [];
  if (!isNonEmptyString(provider.providerId)) {
    issues.push(issue("provider_id_missing", "Provider id is required.", "providerId"));
  }
  if (isReservedExecutiveMemoryProviderId(provider.providerId)) {
    issues.push(issue("provider_id_reserved", "Provider id is reserved.", "providerId"));
  }
  issues.push(...validateExecutiveMemoryCategories(provider.supportedCategories).issues);
  return result(issues);
}

export function hasDuplicateProviderIds(providerIds: readonly string[]): boolean {
  return new Set(providerIds).size !== providerIds.length;
}
