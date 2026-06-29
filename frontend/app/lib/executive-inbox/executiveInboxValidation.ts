/**
 * APP-11:1 — Executive Inbox Platform validation.
 */

import {
  EXECUTIVE_INBOX_DEFAULT_LIMITS,
  EXECUTIVE_INBOX_ITEM_STATUS_KEYS,
  EXECUTIVE_INBOX_MANDATORY_INBOX_CONTEXT_FIELDS,
  EXECUTIVE_INBOX_MANDATORY_INBOX_ITEM_FIELDS,
  EXECUTIVE_INBOX_MANDATORY_INBOX_SESSION_FIELDS,
  EXECUTIVE_INBOX_MANDATORY_INBOX_SOURCE_FIELDS,
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_ID,
  EXECUTIVE_INBOX_RESERVED_SESSION_IDS,
  EXECUTIVE_INBOX_SESSION_STATUS_KEYS,
  EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
} from "./executiveInboxConstants.ts";
import type {
  ExecutiveInboxContext,
  ExecutiveInboxItem,
  ExecutiveInboxItemRegistrationInput,
  ExecutiveInboxItemStatus,
  ExecutiveInboxMetadataExtensionRegistration,
  ExecutiveInboxPlatformIdentity,
  ExecutiveInboxSession,
  ExecutiveInboxSessionRegistrationInput,
  ExecutiveInboxSessionStatus,
  ExecutiveInboxSource,
  ExecutiveInboxSourceType,
  ExecutiveInboxValidationIssue,
  ExecutiveInboxValidationResult,
  ExecutiveInboxWorkspaceId,
} from "./executiveInboxTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveInboxValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveInboxValidationIssue[]): ExecutiveInboxValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isExecutiveInboxSourceType(value: string): value is ExecutiveInboxSourceType {
  return (EXECUTIVE_INBOX_SOURCE_TYPE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveInboxSessionStatus(value: string): value is ExecutiveInboxSessionStatus {
  return (EXECUTIVE_INBOX_SESSION_STATUS_KEYS as readonly string[]).includes(value);
}

export function isExecutiveInboxItemStatus(value: string): value is ExecutiveInboxItemStatus {
  return (EXECUTIVE_INBOX_ITEM_STATUS_KEYS as readonly string[]).includes(value);
}

export function isReservedExecutiveInboxSessionId(sessionId: string): boolean {
  return (EXECUTIVE_INBOX_RESERVED_SESSION_IDS as readonly string[]).includes(sessionId);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validatePlatformIdentity(
  identity: ExecutiveInboxPlatformIdentity
): ExecutiveInboxValidationResult {
  const issues: ExecutiveInboxValidationIssue[] = [];
  if (identity.appId !== "APP-11") {
    issues.push(issue("invalid_identity", "appId must be APP-11.", "appId"));
  }
  if (identity.platformId !== EXECUTIVE_INBOX_PLATFORM_ID) {
    issues.push(issue("invalid_identity", "platformId mismatch.", "platformId"));
  }
  if (identity.version !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_identity", "version mismatch.", "version"));
  }
  if (!identity.title.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  return result(issues);
}

export function validateVersionCompatibility(version: string): ExecutiveInboxValidationResult {
  if (version !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    return result([issue("invalid_version", "Unsupported contract version.", "version")]);
  }
  return result([]);
}

export function validateSessionIdentity(sessionId: string): ExecutiveInboxValidationResult {
  const issues: ExecutiveInboxValidationIssue[] = [];
  if (!sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (isReservedExecutiveInboxSessionId(sessionId)) {
    issues.push(issue("reserved_session", "sessionId is reserved.", "sessionId"));
  }
  return result(issues);
}

export function validateWorkspaceIsolation(
  leftWorkspaceId: ExecutiveInboxWorkspaceId,
  rightWorkspaceId: ExecutiveInboxWorkspaceId
): ExecutiveInboxValidationResult {
  if (leftWorkspaceId !== rightWorkspaceId) {
    return result([issue("workspace_isolation", "Workspace isolation violation.", "workspaceId")]);
  }
  return result([]);
}

function validateMandatoryFields(
  record: Record<string, unknown>,
  fields: readonly string[],
  prefix: string
): ExecutiveInboxValidationIssue[] {
  const issues: ExecutiveInboxValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

export function validateExecutiveInboxSourceContractShape(source: ExecutiveInboxSource): ExecutiveInboxValidationResult {
  const issues = validateMandatoryFields(source as unknown as Record<string, unknown>, EXECUTIVE_INBOX_MANDATORY_INBOX_SOURCE_FIELDS, "ExecutiveInboxSource");
  if (!isExecutiveInboxSourceType(source.sourceType)) {
    issues.push(issue("invalid_source_type", "Invalid sourceType.", "sourceType"));
  }
  if (source.consumerOnly !== true) {
    issues.push(issue("invalid_source", "ExecutiveInboxSource must be consumer-only.", "consumerOnly"));
  }
  return result(issues);
}

export function validateExecutiveInboxItemContractShape(item: ExecutiveInboxItem): ExecutiveInboxValidationResult {
  const issues = validateMandatoryFields(item as unknown as Record<string, unknown>, EXECUTIVE_INBOX_MANDATORY_INBOX_ITEM_FIELDS, "ExecutiveInboxItem");
  if (!isExecutiveInboxSourceType(item.sourceType)) {
    issues.push(issue("invalid_source_type", "Invalid sourceType.", "sourceType"));
  }
  if (!isExecutiveInboxItemStatus(item.status)) {
    issues.push(issue("invalid_status", "Invalid item status.", "status"));
  }
  if (item.version !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Item version mismatch.", "version"));
  }
  return result(issues);
}

export function validateExecutiveInboxContextContractShape(context: ExecutiveInboxContext): ExecutiveInboxValidationResult {
  const issues = validateMandatoryFields(context as unknown as Record<string, unknown>, EXECUTIVE_INBOX_MANDATORY_INBOX_CONTEXT_FIELDS, "ExecutiveInboxContext");
  if (context.sourceTypes.some((entry) => !isExecutiveInboxSourceType(entry))) {
    issues.push(issue("invalid_source_type", "Invalid sourceTypes entry.", "sourceTypes"));
  }
  if (context.version !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Context version mismatch.", "version"));
  }
  return result(issues);
}

export function validateExecutiveInboxSessionContractShape(session: ExecutiveInboxSession): ExecutiveInboxValidationResult {
  const issues = validateMandatoryFields(session as unknown as Record<string, unknown>, EXECUTIVE_INBOX_MANDATORY_INBOX_SESSION_FIELDS, "ExecutiveInboxSession");
  if (!isExecutiveInboxSessionStatus(session.status)) {
    issues.push(issue("invalid_status", "Invalid session status.", "status"));
  }
  if (session.sourceTypes.some((entry) => !isExecutiveInboxSourceType(entry))) {
    issues.push(issue("invalid_source_type", "Invalid sourceTypes entry.", "sourceTypes"));
  }
  if (session.version !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Session version mismatch.", "version"));
  }
  return result(issues);
}

export function validateExecutiveInboxSessionRegistration(
  input: ExecutiveInboxSessionRegistrationInput
): ExecutiveInboxValidationResult {
  const issues: ExecutiveInboxValidationIssue[] = [];
  if (!input.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.label.trim() || input.label.length > EXECUTIVE_INBOX_DEFAULT_LIMITS.maxSessionLabelLength) {
    issues.push(issue("invalid_label", "Invalid session label.", "label"));
  }
  if (input.description.length > EXECUTIVE_INBOX_DEFAULT_LIMITS.maxSessionDescriptionLength) {
    issues.push(issue("invalid_description", "Session description too long.", "description"));
  }
  if (input.sourceTypes.length === 0 || input.sourceTypes.length > EXECUTIVE_INBOX_DEFAULT_LIMITS.maxSourceTypesPerSession) {
    issues.push(issue("invalid_source_types", "Invalid sourceTypes count.", "sourceTypes"));
  }
  if (input.sourceTypes.some((entry) => !isExecutiveInboxSourceType(entry))) {
    issues.push(issue("invalid_source_type", "Invalid sourceTypes entry.", "sourceTypes"));
  }
  if (hasDuplicateIds(input.sourceTypes)) {
    issues.push(issue("duplicate_source_types", "Duplicate sourceTypes are forbidden.", "sourceTypes"));
  }
  return result(issues);
}

export function validateExecutiveInboxItemRegistration(
  input: ExecutiveInboxItemRegistrationInput
): ExecutiveInboxValidationResult {
  const issues: ExecutiveInboxValidationIssue[] = [];
  if (!input.itemId.trim()) {
    issues.push(issue("missing_field", "itemId is required.", "itemId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!input.sourceReferenceId.trim()) {
    issues.push(issue("missing_field", "sourceReferenceId is required.", "sourceReferenceId"));
  }
  if (!isExecutiveInboxSourceType(input.sourceType)) {
    issues.push(issue("invalid_source_type", "Invalid sourceType.", "sourceType"));
  }
  if (!input.label.trim() || input.label.length > EXECUTIVE_INBOX_DEFAULT_LIMITS.maxItemLabelLength) {
    issues.push(issue("invalid_label", "Invalid item label.", "label"));
  }
  if (input.description.length > EXECUTIVE_INBOX_DEFAULT_LIMITS.maxItemDescriptionLength) {
    issues.push(issue("invalid_description", "Item description too long.", "description"));
  }
  return result(issues);
}

export function validateMetadataExtensionRegistration(
  input: ExecutiveInboxMetadataExtensionRegistration
): ExecutiveInboxValidationResult {
  const issues: ExecutiveInboxValidationIssue[] = [];
  if (!input.extensionId.trim()) {
    issues.push(issue("missing_field", "extensionId is required.", "extensionId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}
