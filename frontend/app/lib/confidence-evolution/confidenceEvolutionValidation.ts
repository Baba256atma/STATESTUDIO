/**
 * APP-9:1 — Confidence Evolution Platform validation.
 */

import {
  CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
  CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
  CONFIDENCE_EVOLUTION_DEFAULT_LIMITS,
  CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS,
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_ID,
  CONFIDENCE_EVOLUTION_RESERVED_EVOLUTION_IDS,
  CONFIDENCE_EVOLUTION_RESERVED_METADATA_KEYS,
  CONFIDENCE_EVOLUTION_SOURCE_KEYS,
} from "./confidenceEvolutionConstants.ts";
import type {
  ConfidenceChangeReason,
  ConfidenceEvolutionMetadataExtensionRegistration,
  ConfidenceEvolutionPlatformIdentity,
  ConfidenceEvolutionRegistrationInput,
  ConfidenceLevel,
  ConfidenceRecord,
  ConfidenceSource,
  ConfidenceEvolutionValidationIssue,
  ConfidenceEvolutionValidationResult,
  ConfidenceWorkspaceId,
} from "./confidenceEvolutionTypes.ts";

function issue(code: string, message: string, field?: string): ConfidenceEvolutionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ConfidenceEvolutionValidationIssue[]): ConfidenceEvolutionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isConfidenceLevel(value: string): value is ConfidenceLevel {
  return (CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS as readonly string[]).includes(value);
}

export function isConfidenceSource(value: string): value is ConfidenceSource {
  return (CONFIDENCE_EVOLUTION_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isConfidenceChangeReason(value: string): value is ConfidenceChangeReason {
  return (CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS as readonly string[]).includes(value);
}

export function isReservedConfidenceEvolutionId(evolutionId: string): boolean {
  return (CONFIDENCE_EVOLUTION_RESERVED_EVOLUTION_IDS as readonly string[]).includes(evolutionId);
}

export function isReservedConfidenceEvolutionMetadataKey(key: string): boolean {
  return (CONFIDENCE_EVOLUTION_RESERVED_METADATA_KEYS as readonly string[]).includes(key);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validatePlatformIdentity(
  identity: ConfidenceEvolutionPlatformIdentity
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (identity.appId !== "APP-9") {
    issues.push(issue("invalid_identity", "appId must be APP-9.", "appId"));
  }
  if (identity.platformId !== CONFIDENCE_EVOLUTION_PLATFORM_ID) {
    issues.push(issue("invalid_identity", "platformId mismatch.", "platformId"));
  }
  if (identity.version !== CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_identity", "version mismatch.", "version"));
  }
  if (!identity.title.trim()) {
    issues.push(issue("missing_field", "title is required.", "title"));
  }
  return result(issues);
}

export function validateVersionCompatibility(version: string): ConfidenceEvolutionValidationResult {
  if (version !== CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION) {
    return result([
      issue(
        "version_incompatible",
        `Version ${version} is not compatible with ${CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION}.`,
        "version"
      ),
    ]);
  }
  return result([]);
}

export function validateWorkspaceIsolation(
  workspaceId: ConfidenceWorkspaceId,
  recordWorkspaceId: ConfidenceWorkspaceId
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (!workspaceId.trim() || !recordWorkspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required for isolation validation.", "workspaceId"));
  } else if (workspaceId !== recordWorkspaceId) {
    issues.push(
      issue(
        "workspace_isolation_violation",
        "Confidence record workspaceId must match evolution workspaceId.",
        "workspaceId"
      )
    );
  }
  return result(issues);
}

export function validateEvolutionIdentity(evolutionId: string): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (!evolutionId.trim()) {
    issues.push(issue("missing_field", "evolutionId is required.", "evolutionId"));
  } else if (!evolutionId.startsWith("confidence-evolution-")) {
    issues.push(
      issue("invalid_evolution_identity", "evolutionId must use confidence-evolution- prefix.", "evolutionId")
    );
  } else if (isReservedConfidenceEvolutionId(evolutionId)) {
    issues.push(issue("reserved_evolution_id", `evolutionId is reserved: ${evolutionId}.`, "evolutionId"));
  }
  return result(issues);
}

export function validateConfidenceEvolutionRegistration(
  input: ConfidenceEvolutionRegistrationInput
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  issues.push(...validateEvolutionIdentity(input.evolutionId).issues);
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  } else if (input.label.length > CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.maxEvolutionLabelLength) {
    issues.push(issue("invalid_field", "label exceeds maximum length.", "label"));
  }
  if (input.description.length > CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.maxEvolutionDescriptionLength) {
    issues.push(issue("invalid_field", "description exceeds maximum length.", "description"));
  }
  return result(issues);
}

export function validateMetadataExtensionRegistration(
  input: ConfidenceEvolutionMetadataExtensionRegistration
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (!input.extensionId.trim()) {
    issues.push(issue("missing_field", "extensionId is required.", "extensionId"));
  } else if (isReservedConfidenceEvolutionMetadataKey(input.extensionId)) {
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
): ConfidenceEvolutionValidationIssue[] {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (values.length > maxCount) {
    issues.push(issue("invalid_field", `${field} exceeds maximum count.`, field));
  }
  if (hasDuplicateIds(values)) {
    issues.push(issue("duplicate_values", `${field} contains duplicate entries.`, field));
  }
  return issues;
}

export function validateConfidenceScore(score: number): ConfidenceEvolutionValidationResult {
  if (
    typeof score !== "number" ||
    Number.isNaN(score) ||
    score < CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.minConfidenceScore ||
    score > CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.maxConfidenceScore
  ) {
    return result([
      issue(
        "invalid_score",
        `confidenceScore must be between ${CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.minConfidenceScore} and ${CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.maxConfidenceScore}.`,
        "confidenceScore"
      ),
    ]);
  }
  return result([]);
}

export function validateConfidenceRecordContractShape(
  record: ConfidenceRecord
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  for (const field of CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS) {
    const value = record[field as keyof ConfidenceRecord];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    } else if (typeof value === "string" && field !== "notes" && value.trim().length === 0) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}.`, field));
    }
  }
  if (!isConfidenceLevel(record.confidenceLevel)) {
    issues.push(issue("invalid_enum", "Invalid confidenceLevel.", "confidenceLevel"));
  }
  if (!isConfidenceSource(record.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }
  if (!isConfidenceChangeReason(record.reason)) {
    issues.push(issue("invalid_enum", "Invalid reason.", "reason"));
  }
  if (record.previousConfidence !== undefined && !isConfidenceLevel(record.previousConfidence)) {
    issues.push(issue("invalid_enum", "Invalid previousConfidence.", "previousConfidence"));
  }
  issues.push(...validateConfidenceScore(record.confidenceScore).issues);
  if (record.title.length > CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.maxRecordTitleLength) {
    issues.push(issue("invalid_field", "title exceeds maximum length.", "title"));
  }
  if (record.notes.length > CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.maxRecordNotesLength) {
    issues.push(issue("invalid_field", "notes exceeds maximum length.", "notes"));
  }
  issues.push(
    ...validateStringList(
      record.evidenceReferences,
      "evidenceReferences",
      CONFIDENCE_EVOLUTION_DEFAULT_LIMITS.maxEvidenceReferences
    )
  );
  if (record.version !== CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Record version mismatch.", "version"));
  }
  return result(issues);
}

export const ConfidenceEvolutionValidation = Object.freeze({
  isConfidenceLevel,
  isConfidenceSource,
  isConfidenceChangeReason,
  isReservedConfidenceEvolutionId,
  isReservedConfidenceEvolutionMetadataKey,
  hasDuplicateIds,
  validatePlatformIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
  validateEvolutionIdentity,
  validateConfidenceEvolutionRegistration,
  validateMetadataExtensionRegistration,
  validateConfidenceScore,
  validateConfidenceRecordContractShape,
});
