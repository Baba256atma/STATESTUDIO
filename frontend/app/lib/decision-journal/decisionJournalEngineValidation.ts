/**
 * APP-8:2 — Decision Journal Engine validation.
 */

import { DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION } from "./decisionJournalConstants.ts";
import { validateDecisionJournal } from "./decisionJournalContracts.ts";
import type { DecisionJournalEntry } from "./decisionJournalTypes.ts";
import {
  isDecisionJournalConfidence,
  isDecisionJournalSource,
  isDecisionJournalStatus,
  validateDecisionJournalEntryContractShape,
  validateWorkspaceIsolation,
} from "./decisionJournalValidation.ts";
import { isDuplicateDecisionJournalEntryId } from "./decisionJournalEngineRegistry.ts";
import {
  DECISION_JOURNAL_ENGINE_LIMITS,
  DECISION_JOURNAL_IMMUTABLE_FIELDS,
  DECISION_JOURNAL_LINK_IMMUTABLE_FIELDS,
  DECISION_JOURNAL_UPDATABLE_FIELDS,
  type CreateDecisionJournalEntryInput,
  type DecisionJournalEngineEntry,
  type DecisionJournalEntryResult,
  type NormalizedDecisionJournalEntryInput,
  type UpdateDecisionJournalMetadataInput,
  decisionJournalEngineErrorFromCode,
} from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalValidationIssue,
  DecisionJournalValidationResult,
} from "./decisionJournalTypes.ts";

function issue(code: string, message: string, field?: string): DecisionJournalValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionJournalValidationIssue[]): DecisionJournalValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForEngine(timestamp: string): DecisionJournalValidationResult {
  const foundation = validateDecisionJournal(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function mapDecisionJournalEngineEntryToFoundationContract(
  entry: DecisionJournalEngineEntry
): DecisionJournalEntry {
  return Object.freeze({
    id: entry.id,
    workspaceId: entry.workspaceId,
    decisionId: entry.decisionId,
    scenarioId: entry.scenarioId,
    title: entry.title,
    summary: entry.summary,
    rationale: entry.rationale,
    assumptions: entry.assumptions,
    alternatives: entry.alternatives,
    evidenceReferences: entry.evidenceReferences,
    acceptedRisks: entry.acceptedRisks,
    expectedOutcome: entry.expectedOutcome,
    confidence: entry.confidence,
    tradeoffs: entry.tradeoffs,
    constraints: entry.constraints,
    author: entry.author,
    reviewers: entry.reviewers,
    tags: entry.tags,
    metadata: entry.metadata,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    version: entry.contractVersion,
    readOnly: true as const,
  });
}

export function validateEngineEntryFoundationMapping(
  entry: DecisionJournalEngineEntry
): DecisionJournalValidationResult {
  return validateDecisionJournalEntryContractShape(mapDecisionJournalEngineEntryToFoundationContract(entry));
}

export function validateDecisionJournalEntryInput(
  input: CreateDecisionJournalEntryInput | NormalizedDecisionJournalEntryInput,
  options: Readonly<{ checkDuplicate?: boolean }> = {}
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];

  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.title?.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  if (!input.summary?.trim()) {
    issues.push(issue("missing_field", "summary is required.", "summary"));
  }
  if (!input.rationale?.trim()) {
    issues.push(issue("missing_field", "rationale is required.", "rationale"));
  }
  if (!input.expectedOutcome?.trim()) {
    issues.push(issue("missing_field", "expectedOutcome is required.", "expectedOutcome"));
  }
  if (!input.author?.trim()) {
    issues.push(issue("missing_field", "author is required.", "author"));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_field", "createdAt is required.", "createdAt"));
  }
  if ("updatedAt" in input && !input.updatedAt?.trim()) {
    issues.push(issue("missing_field", "updatedAt is required.", "updatedAt"));
  }

  if (!isDecisionJournalConfidence(input.confidence)) {
    issues.push(issue("invalid_enum", "Invalid confidence.", "confidence"));
  }
  const status = "status" in input ? input.status : "draft";
  if (!isDecisionJournalStatus(status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }
  if (!isDecisionJournalSource(input.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }

  if (input.title.length > DECISION_JOURNAL_ENGINE_LIMITS.maxTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  if (input.summary.length > DECISION_JOURNAL_ENGINE_LIMITS.maxSummaryLength) {
    issues.push(issue("invalid_field", "summary exceeds maximum length.", "summary"));
  }
  if (input.rationale.length > DECISION_JOURNAL_ENGINE_LIMITS.maxRationaleLength) {
    issues.push(issue("invalid_field", "rationale exceeds maximum length.", "rationale"));
  }

  const tags = "tags" in input && Array.isArray(input.tags) ? input.tags : [];
  if (tags.length > DECISION_JOURNAL_ENGINE_LIMITS.maxTagsPerEntry) {
    issues.push(issue("invalid_field", "tags exceed maximum count.", "tags"));
  }

  if (input.id && options.checkDuplicate && isDuplicateDecisionJournalEntryId(input.id)) {
    issues.push(issue("duplicate_entry", `Duplicate journal entry id: ${input.id}.`, "id"));
  }

  return result(issues);
}

export function validateDecisionJournalEngineEntry(
  entry: DecisionJournalEngineEntry
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  const inputValidation = validateDecisionJournalEntryInput(entry, { checkDuplicate: false });
  issues.push(...inputValidation.issues);

  if (entry.contractVersion !== DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (entry.revisionVersion < 1) {
    issues.push(issue("invalid_field", "revisionVersion must be >= 1.", "revisionVersion"));
  }
  if (entry.readOnly !== true) {
    issues.push(issue("contract_violation", "Entry must be read-only.", "readOnly"));
  }
  if (entry.archived !== (entry.status === "archived")) {
    issues.push(issue("archive_mismatch", "archived flag must match archived status.", "archived"));
  }
  if (!entry.updatedAt?.trim()) {
    issues.push(issue("missing_field", "updatedAt is required.", "updatedAt"));
  }

  return result(issues);
}

export function validateUpdateDecisionJournalMetadataInput(
  existing: DecisionJournalEngineEntry,
  input: UpdateDecisionJournalMetadataInput
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];

  if (input.id !== existing.id) {
    issues.push(issue("forbidden_mutation", "Entry id cannot be changed.", "id"));
  }
  const isolation = validateWorkspaceIsolation(input.workspaceId, existing.workspaceId);
  if (!isolation.valid) {
    issues.push(...isolation.issues);
  }

  if (input.confidence !== undefined && !isDecisionJournalConfidence(input.confidence)) {
    issues.push(issue("invalid_enum", "Invalid confidence.", "confidence"));
  }
  if (input.status !== undefined && !isDecisionJournalStatus(input.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }

  const linkFieldKeys = new Set<string>(DECISION_JOURNAL_LINK_IMMUTABLE_FIELDS);
  const forbiddenKeys = Object.keys(input).filter(
    (key) =>
      !["id", "workspaceId", "updatedAt", ...DECISION_JOURNAL_UPDATABLE_FIELDS].includes(key) &&
      !linkFieldKeys.has(key) &&
      (input as Record<string, unknown>)[key] !== undefined
  );
  for (const key of forbiddenKeys) {
    if ((DECISION_JOURNAL_IMMUTABLE_FIELDS as readonly string[]).includes(key)) {
      issues.push(issue("forbidden_mutation", `Field cannot be updated: ${key}.`, key));
    }
  }

  if (
    "decisionId" in input &&
    input.decisionId !== undefined &&
    existing.decisionId !== undefined &&
    input.decisionId !== existing.decisionId
  ) {
    issues.push(issue("forbidden_mutation", "decisionId cannot change once assigned.", "decisionId"));
  }
  if (
    "scenarioId" in input &&
    input.scenarioId !== undefined &&
    existing.scenarioId !== undefined &&
    input.scenarioId !== existing.scenarioId
  ) {
    issues.push(issue("forbidden_mutation", "scenarioId cannot change once assigned.", "scenarioId"));
  }

  return result(issues);
}

export function assertNoHardDeleteInEngineSource(source: string): boolean {
  return (
    !source.includes("deleteDecisionJournalEntry(") &&
    !source.includes("removeDecisionJournalEntry(")
  );
}

export function validationFailureResult<T>(
  validation: DecisionJournalValidationResult,
  prefix: string
): DecisionJournalEntryResult<T> {
  return Object.freeze({
    success: false,
    reason: validation.issues[0]?.message ?? `${prefix} rejected.`,
    data: null,
    error: decisionJournalEngineErrorFromCode(
      "validationFailure",
      validation.issues[0]?.message ?? "Validation failed.",
      validation.issues[0]?.field
    ),
    readOnly: true as const,
  });
}

export const DecisionJournalEngineValidation = Object.freeze({
  validateFoundationCompatibilityForEngine,
  mapDecisionJournalEngineEntryToFoundationContract,
  validateEngineEntryFoundationMapping,
  validateDecisionJournalEntryInput,
  validateDecisionJournalEngineEntry,
  validateUpdateDecisionJournalMetadataInput,
  assertNoHardDeleteInEngineSource,
  validationFailureResult,
});
