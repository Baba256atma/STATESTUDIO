/**
 * APP-8:1 — Decision Journal Platform validation.
 */

import {
  DECISION_JOURNAL_CONFIDENCE_KEYS,
  DECISION_JOURNAL_DEFAULT_LIMITS,
  DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS,
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_ID,
  DECISION_JOURNAL_RESERVED_JOURNAL_IDS,
  DECISION_JOURNAL_RESERVED_METADATA_KEYS,
  DECISION_JOURNAL_SOURCE_KEYS,
  DECISION_JOURNAL_STATUS_KEYS,
} from "./decisionJournalConstants.ts";
import type {
  DecisionJournalConfidence,
  DecisionJournalEntry,
  DecisionJournalMetadataExtensionRegistration,
  DecisionJournalPlatformIdentity,
  DecisionJournalRegistrationInput,
  DecisionJournalSource,
  DecisionJournalStatus,
  DecisionJournalValidationIssue,
  DecisionJournalValidationResult,
  DecisionWorkspaceId,
} from "./decisionJournalTypes.ts";

function issue(code: string, message: string, field?: string): DecisionJournalValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionJournalValidationIssue[]): DecisionJournalValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isDecisionJournalStatus(value: string): value is DecisionJournalStatus {
  return (DECISION_JOURNAL_STATUS_KEYS as readonly string[]).includes(value);
}

export function isDecisionJournalSource(value: string): value is DecisionJournalSource {
  return (DECISION_JOURNAL_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isDecisionJournalConfidence(value: string): value is DecisionJournalConfidence {
  return (DECISION_JOURNAL_CONFIDENCE_KEYS as readonly string[]).includes(value);
}

export function isReservedDecisionJournalId(journalId: string): boolean {
  return (DECISION_JOURNAL_RESERVED_JOURNAL_IDS as readonly string[]).includes(journalId);
}

export function isReservedDecisionJournalMetadataKey(key: string): boolean {
  return (DECISION_JOURNAL_RESERVED_METADATA_KEYS as readonly string[]).includes(key);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validatePlatformIdentity(identity: DecisionJournalPlatformIdentity): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (identity.appId !== "APP-8") {
    issues.push(issue("invalid_identity", "appId must be APP-8.", "appId"));
  }
  if (identity.platformId !== DECISION_JOURNAL_PLATFORM_ID) {
    issues.push(issue("invalid_identity", "platformId mismatch.", "platformId"));
  }
  if (identity.version !== DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_identity", "version mismatch.", "version"));
  }
  if (!identity.title.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  return result(issues);
}

export function validateVersionCompatibility(version: string): DecisionJournalValidationResult {
  if (version !== DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION) {
    return result([
      issue(
        "version_incompatible",
        `Version ${version} is not compatible with ${DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION}.`,
        "version"
      ),
    ]);
  }
  return result([]);
}

export function validateWorkspaceIsolation(
  workspaceId: DecisionWorkspaceId,
  entryWorkspaceId: DecisionWorkspaceId
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (!workspaceId.trim() || !entryWorkspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required for isolation validation.", "workspaceId"));
  } else if (workspaceId !== entryWorkspaceId) {
    issues.push(
      issue(
        "workspace_isolation_violation",
        "Decision journal entry workspaceId must match journal workspaceId.",
        "workspaceId"
      )
    );
  }
  return result(issues);
}

export function validateJournalIdentity(journalId: string): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (!journalId.trim()) {
    issues.push(issue("missing_field", "journalId is required.", "journalId"));
  } else if (!journalId.startsWith("decision-journal-")) {
    issues.push(
      issue("invalid_journal_identity", "journalId must use decision-journal- prefix.", "journalId")
    );
  } else if (isReservedDecisionJournalId(journalId)) {
    issues.push(issue("reserved_journal_id", `journalId is reserved: ${journalId}.`, "journalId"));
  }
  return result(issues);
}

export function validateDecisionJournalRegistration(
  input: DecisionJournalRegistrationInput
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  issues.push(...validateJournalIdentity(input.journalId).issues);
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  } else if (input.label.length > DECISION_JOURNAL_DEFAULT_LIMITS.maxJournalLabelLength) {
    issues.push(issue("invalid_field", "label exceeds maximum length.", "label"));
  }
  if (input.description.length > DECISION_JOURNAL_DEFAULT_LIMITS.maxJournalDescriptionLength) {
    issues.push(issue("invalid_field", "description exceeds maximum length.", "description"));
  }
  return result(issues);
}

export function validateMetadataExtensionRegistration(
  input: DecisionJournalMetadataExtensionRegistration
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (!input.extensionId.trim()) {
    issues.push(issue("missing_field", "extensionId is required.", "extensionId"));
  } else if (isReservedDecisionJournalMetadataKey(input.extensionId)) {
    issues.push(issue("reserved_name", `extensionId is reserved: ${input.extensionId}.`, "extensionId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  return result(issues);
}

function validateStringList(
  values: readonly string[],
  field: string,
  maxCount: number
): DecisionJournalValidationIssue[] {
  const issues: DecisionJournalValidationIssue[] = [];
  if (values.length > maxCount) {
    issues.push(issue("invalid_field", `${field} exceeds maximum count.`, field));
  }
  if (hasDuplicateIds(values)) {
    issues.push(issue("duplicate_values", `${field} contains duplicate entries.`, field));
  }
  return issues;
}

export function validateDecisionJournalEntryContractShape(
  entry: DecisionJournalEntry
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  for (const field of DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS) {
    const value = entry[field as keyof DecisionJournalEntry];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    } else if (typeof value === "string" && value.trim().length === 0) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    }
  }
  if (!isDecisionJournalConfidence(entry.confidence)) {
    issues.push(issue("invalid_enum", "Invalid confidence.", "confidence"));
  }
  if (entry.title.length > DECISION_JOURNAL_DEFAULT_LIMITS.maxEntryTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  if (entry.summary.length > DECISION_JOURNAL_DEFAULT_LIMITS.maxEntrySummaryLength) {
    issues.push(issue("invalid_field", "summary exceeds maximum length.", "summary"));
  }
  if (entry.rationale.length > DECISION_JOURNAL_DEFAULT_LIMITS.maxEntryRationaleLength) {
    issues.push(issue("invalid_field", "rationale exceeds maximum length.", "rationale"));
  }
  issues.push(...validateStringList(entry.assumptions, "assumptions", DECISION_JOURNAL_DEFAULT_LIMITS.maxListItemsPerField));
  issues.push(...validateStringList(entry.alternatives, "alternatives", DECISION_JOURNAL_DEFAULT_LIMITS.maxListItemsPerField));
  issues.push(
    ...validateStringList(entry.evidenceReferences, "evidenceReferences", DECISION_JOURNAL_DEFAULT_LIMITS.maxListItemsPerField)
  );
  issues.push(...validateStringList(entry.acceptedRisks, "acceptedRisks", DECISION_JOURNAL_DEFAULT_LIMITS.maxListItemsPerField));
  issues.push(...validateStringList(entry.tradeoffs, "tradeoffs", DECISION_JOURNAL_DEFAULT_LIMITS.maxListItemsPerField));
  issues.push(...validateStringList(entry.constraints, "constraints", DECISION_JOURNAL_DEFAULT_LIMITS.maxListItemsPerField));
  if (entry.reviewers.length > DECISION_JOURNAL_DEFAULT_LIMITS.maxReviewersPerEntry) {
    issues.push(issue("invalid_field", "reviewers exceed maximum count.", "reviewers"));
  }
  if (entry.tags.length > DECISION_JOURNAL_DEFAULT_LIMITS.maxTagsPerEntry) {
    issues.push(issue("invalid_field", "tags exceed maximum count.", "tags"));
  }
  if (entry.version !== DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Entry version mismatch.", "version"));
  }
  return result(issues);
}

export const DecisionJournalValidation = Object.freeze({
  isDecisionJournalStatus,
  isDecisionJournalSource,
  isDecisionJournalConfidence,
  isReservedDecisionJournalId,
  isReservedDecisionJournalMetadataKey,
  hasDuplicateIds,
  validatePlatformIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
  validateJournalIdentity,
  validateDecisionJournalRegistration,
  validateMetadataExtensionRegistration,
  validateDecisionJournalEntryContractShape,
});
