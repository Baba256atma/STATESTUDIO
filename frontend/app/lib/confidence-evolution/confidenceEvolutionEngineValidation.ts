/**
 * APP-9:2 — Confidence Evolution Engine validation.
 */

import { CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION } from "./confidenceEvolutionConstants.ts";
import { validateConfidenceEvolution } from "./confidenceEvolutionContracts.ts";
import type { ConfidenceRecord } from "./confidenceEvolutionTypes.ts";
import {
  isConfidenceChangeReason,
  isConfidenceLevel,
  isConfidenceSource,
  validateConfidenceRecordContractShape,
  validateConfidenceScore,
  validateWorkspaceIsolation,
} from "./confidenceEvolutionValidation.ts";
import { isDuplicateConfidenceRecordId } from "./confidenceEvolutionEngineRegistry.ts";
import {
  CONFIDENCE_EVOLUTION_ENGINE_LIMITS,
  CONFIDENCE_EVOLUTION_IMMUTABLE_FIELDS,
  CONFIDENCE_EVOLUTION_LINK_IMMUTABLE_FIELDS,
  CONFIDENCE_EVOLUTION_UPDATABLE_FIELDS,
  CONFIDENCE_RECORD_STATUS_KEYS,
  type ConfidenceEvolutionEngineRecord,
  type ConfidenceRecordResult,
  type CreateConfidenceRecordInput,
  type NormalizedConfidenceRecordInput,
  type UpdateConfidenceMetadataInput,
  confidenceEvolutionEngineErrorFromCode,
} from "./confidenceEvolutionEngineTypes.ts";
import type {
  ConfidenceEvolutionValidationIssue,
  ConfidenceEvolutionValidationResult,
} from "./confidenceEvolutionTypes.ts";

function issue(code: string, message: string, field?: string): ConfidenceEvolutionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ConfidenceEvolutionValidationIssue[]): ConfidenceEvolutionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isConfidenceRecordStatus(value: string): value is (typeof CONFIDENCE_RECORD_STATUS_KEYS)[number] {
  return (CONFIDENCE_RECORD_STATUS_KEYS as readonly string[]).includes(value);
}

export function validateFoundationCompatibilityForEngine(timestamp: string): ConfidenceEvolutionValidationResult {
  const foundation = validateConfidenceEvolution(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function mapConfidenceEngineRecordToFoundationContract(
  record: ConfidenceEvolutionEngineRecord
): ConfidenceRecord {
  return Object.freeze({
    id: record.id,
    workspaceId: record.workspaceId,
    decisionId: record.decisionId,
    scenarioId: record.scenarioId,
    journalEntryId: record.journalEntryId,
    title: record.title,
    confidenceLevel: record.confidenceLevel,
    confidenceScore: record.confidenceScore,
    source: record.source,
    reason: record.reason,
    notes: record.notes,
    evidenceReferences: record.evidenceReferences,
    previousConfidence: record.previousConfidence,
    metadata: record.metadata,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    version: record.contractVersion,
    readOnly: true as const,
  });
}

export function validateEngineRecordFoundationMapping(
  record: ConfidenceEvolutionEngineRecord
): ConfidenceEvolutionValidationResult {
  return validateConfidenceRecordContractShape(mapConfidenceEngineRecordToFoundationContract(record));
}

export function validateConfidenceRecordInput(
  input: CreateConfidenceRecordInput | NormalizedConfidenceRecordInput,
  options: Readonly<{ checkDuplicate?: boolean }> = {}
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];

  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.title?.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  if (!input.createdAt?.trim()) {
    issues.push(issue("missing_field", "createdAt is required.", "createdAt"));
  }
  if ("updatedAt" in input && !input.updatedAt?.trim()) {
    issues.push(issue("missing_field", "updatedAt is required.", "updatedAt"));
  }

  if (!isConfidenceLevel(input.confidenceLevel)) {
    issues.push(issue("invalid_enum", "Invalid confidenceLevel.", "confidenceLevel"));
  }
  if (!isConfidenceSource(input.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }
  if (!isConfidenceChangeReason(input.reason)) {
    issues.push(issue("invalid_enum", "Invalid reason.", "reason"));
  }
  const status = "status" in input ? input.status : "draft";
  if (!isConfidenceRecordStatus(status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }
  if (input.previousConfidence !== undefined && !isConfidenceLevel(input.previousConfidence)) {
    issues.push(issue("invalid_enum", "Invalid previousConfidence.", "previousConfidence"));
  }

  issues.push(...validateConfidenceScore(input.confidenceScore).issues);

  if (input.title.length > CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  const notes = "notes" in input ? input.notes : "";
  if (notes.length > CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxNotesLength) {
    issues.push(issue("invalid_field", "notes exceeds maximum length.", "notes"));
  }

  const tags = "tags" in input && Array.isArray(input.tags) ? input.tags : [];
  if (tags.length > CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxTagsPerRecord) {
    issues.push(issue("invalid_field", "tags exceed maximum count.", "tags"));
  }

  if (input.id && options.checkDuplicate && isDuplicateConfidenceRecordId(input.id)) {
    issues.push(issue("duplicate_record", `Duplicate confidence record id: ${input.id}.`, "id"));
  }

  return result(issues);
}

export function validateConfidenceEvolutionEngineRecord(
  record: ConfidenceEvolutionEngineRecord
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  const inputValidation = validateConfidenceRecordInput(record, { checkDuplicate: false });
  issues.push(...inputValidation.issues);

  if (record.contractVersion !== CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (record.revisionVersion < 1) {
    issues.push(issue("invalid_field", "revisionVersion must be >= 1.", "revisionVersion"));
  }
  if (record.readOnly !== true) {
    issues.push(issue("contract_violation", "Record must be read-only.", "readOnly"));
  }
  if (record.archived !== (record.status === "archived")) {
    issues.push(issue("archive_mismatch", "archived flag must match archived status.", "archived"));
  }
  if (!record.updatedAt?.trim()) {
    issues.push(issue("missing_field", "updatedAt is required.", "updatedAt"));
  }

  return result(issues);
}

export function validateUpdateConfidenceMetadataInput(
  existing: ConfidenceEvolutionEngineRecord,
  input: UpdateConfidenceMetadataInput
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];

  if (input.id !== existing.id) {
    issues.push(issue("forbidden_mutation", "Record id cannot be changed.", "id"));
  }
  const isolation = validateWorkspaceIsolation(input.workspaceId, existing.workspaceId);
  if (!isolation.valid) {
    issues.push(...isolation.issues);
  }

  if (input.confidenceLevel !== undefined && !isConfidenceLevel(input.confidenceLevel)) {
    issues.push(issue("invalid_enum", "Invalid confidenceLevel.", "confidenceLevel"));
  }
  if (input.reason !== undefined && !isConfidenceChangeReason(input.reason)) {
    issues.push(issue("invalid_enum", "Invalid reason.", "reason"));
  }
  if (input.status !== undefined && !isConfidenceRecordStatus(input.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }
  if (input.previousConfidence !== undefined && !isConfidenceLevel(input.previousConfidence)) {
    issues.push(issue("invalid_enum", "Invalid previousConfidence.", "previousConfidence"));
  }
  if (input.confidenceScore !== undefined) {
    issues.push(...validateConfidenceScore(input.confidenceScore).issues);
  }

  const linkFieldKeys = new Set<string>(CONFIDENCE_EVOLUTION_LINK_IMMUTABLE_FIELDS);
  const forbiddenKeys = Object.keys(input).filter(
    (key) =>
      !["id", "workspaceId", "updatedAt", ...CONFIDENCE_EVOLUTION_UPDATABLE_FIELDS].includes(key) &&
      !linkFieldKeys.has(key) &&
      (input as Record<string, unknown>)[key] !== undefined
  );
  for (const key of forbiddenKeys) {
    if ((CONFIDENCE_EVOLUTION_IMMUTABLE_FIELDS as readonly string[]).includes(key)) {
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
  if (
    "journalEntryId" in input &&
    input.journalEntryId !== undefined &&
    existing.journalEntryId !== undefined &&
    input.journalEntryId !== existing.journalEntryId
  ) {
    issues.push(issue("forbidden_mutation", "journalEntryId cannot change once assigned.", "journalEntryId"));
  }

  return result(issues);
}

export function assertNoHardDeleteInEngineSource(source: string): boolean {
  return (
    !source.includes("deleteConfidenceRecord(") &&
    !source.includes("removeConfidenceRecord(")
  );
}

export function validationFailureResult<T>(
  validation: ConfidenceEvolutionValidationResult,
  prefix: string
): ConfidenceRecordResult<T> {
  return Object.freeze({
    success: false,
    reason: validation.issues[0]?.message ?? `${prefix} rejected.`,
    data: null,
    error: confidenceEvolutionEngineErrorFromCode(
      "validationFailure",
      validation.issues[0]?.message ?? "Validation failed.",
      validation.issues[0]?.field
    ),
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionEngineValidation = Object.freeze({
  isConfidenceRecordStatus,
  validateFoundationCompatibilityForEngine,
  mapConfidenceEngineRecordToFoundationContract,
  validateEngineRecordFoundationMapping,
  validateConfidenceRecordInput,
  validateConfidenceEvolutionEngineRecord,
  validateUpdateConfidenceMetadataInput,
  assertNoHardDeleteInEngineSource,
  validationFailureResult,
});
