/**
 * APP-10:5 — Failure Learning Engine validation.
 */

import { outcomeExists } from "./outcomeLearningEngineRegistry.ts";
import { patternExists } from "./patternExtractionEngineRegistry.ts";
import { similarityResultExists } from "./similarityEngineRegistry.ts";
import {
  FAILURE_CATEGORY_KEYS,
  FAILURE_FACTOR_KEYS,
  FAILURE_LEARNING_CERTIFIED_SOURCES,
  FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
  FAILURE_LEARNING_ENGINE_LIMITS,
  FAILURE_LEARNING_MANDATORY_PROFILE_FIELDS,
} from "./failureLearningEngineConstants.ts";
import type {
  ExecutiveFailure,
  FailureCategory,
  FailureFactorKey,
  FailureLearningRequest,
  FailureProfile,
  FailureProvenance,
  FailureValidationIssue,
  FailureValidationResult,
  HistoricalFailureRecordInput,
} from "./failureLearningEngineTypes.ts";

function issue(code: string, message: string, field?: string): FailureValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: FailureValidationIssue[]): FailureValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isFailureCategory(value: string): value is FailureCategory {
  return (FAILURE_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isFailureFactorKey(value: string): value is FailureFactorKey {
  return (FAILURE_FACTOR_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateCertifiedSourceApps(sourceApps: readonly string[]): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  if (sourceApps.length === 0) {
    issues.push(issue("missing_field", "sourceApps must not be empty.", "sourceApps"));
  }
  for (const app of sourceApps) {
    if (!(FAILURE_LEARNING_CERTIFIED_SOURCES as readonly string[]).includes(app)) {
      issues.push(issue("invalid_dependency", `Uncertified source app: ${app}.`, "sourceApps"));
    }
  }
  return result(issues);
}

export function validateHistoricalFailureRecordInput(input: HistoricalFailureRecordInput): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  if (!input.scenarioId.trim()) {
    issues.push(issue("missing_field", "scenarioId is required.", "scenarioId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.businessGoal.trim()) {
    issues.push(issue("missing_field", "businessGoal is required.", "businessGoal"));
  }
  if (!isFailureCategory(input.failureCategory)) {
    issues.push(issue("invalid_category", "failureCategory is invalid.", "failureCategory"));
  }
  if (input.failureFactorKeys.length === 0) {
    issues.push(issue("missing_field", "failureFactorKeys must not be empty.", "failureFactorKeys"));
  }
  for (const factorKey of input.failureFactorKeys) {
    if (!isFailureFactorKey(factorKey)) {
      issues.push(issue("invalid_factor", `Invalid failure factor: ${factorKey}.`, "failureFactorKeys"));
    }
  }
  if (input.failureCauses.length === 0) {
    issues.push(issue("missing_field", "failureCauses must not be empty.", "failureCauses"));
  }
  if (!input.kpiImpactSummary.trim()) {
    issues.push(issue("missing_field", "kpiImpactSummary is required.", "kpiImpactSummary"));
  }
  if (!input.riskImpactSummary.trim()) {
    issues.push(issue("missing_field", "riskImpactSummary is required.", "riskImpactSummary"));
  }
  issues.push(...validateCertifiedSourceApps(input.sourceApps).issues);
  if (hasDuplicateIds(input.relatedPatternIds)) {
    issues.push(issue("duplicate_ids", "relatedPatternIds contain duplicates.", "relatedPatternIds"));
  }
  if (hasDuplicateIds(input.relatedSimilarityResultIds)) {
    issues.push(issue("duplicate_ids", "relatedSimilarityResultIds contain duplicates.", "relatedSimilarityResultIds"));
  }
  if (hasDuplicateIds(input.relatedOutcomeIds)) {
    issues.push(issue("duplicate_ids", "relatedOutcomeIds contain duplicates.", "relatedOutcomeIds"));
  }
  if (hasDuplicateIds(input.decisionIds)) {
    issues.push(issue("duplicate_ids", "decisionIds contain duplicates.", "decisionIds"));
  }
  if (input.relatedPatternIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedPatternIds must not be empty.", "relatedPatternIds"));
  }
  if (input.relatedSimilarityResultIds.length === 0) {
    issues.push(
      issue("missing_provenance", "relatedSimilarityResultIds must not be empty.", "relatedSimilarityResultIds")
    );
  }
  if (input.relatedOutcomeIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedOutcomeIds must not be empty.", "relatedOutcomeIds"));
  }
  if (input.decisionIds.length === 0) {
    issues.push(issue("missing_provenance", "decisionIds must not be empty.", "decisionIds"));
  }
  if (input.journalEntryIds.length === 0) {
    issues.push(issue("missing_provenance", "journalEntryIds must not be empty.", "journalEntryIds"));
  }
  if (input.timelineReferences.length === 0) {
    issues.push(issue("missing_provenance", "timelineReferences must not be empty.", "timelineReferences"));
  }
  return result(issues);
}

export function validateFailureProvenance(provenance: FailureProvenance): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  if (provenance.scenarioIds.length === 0) {
    issues.push(issue("missing_provenance", "scenarioIds are required.", "provenance.scenarioIds"));
  }
  if (provenance.patternIds.length === 0) {
    issues.push(issue("missing_provenance", "patternIds are required.", "provenance.patternIds"));
  }
  if (provenance.similarityResultIds.length === 0) {
    issues.push(issue("missing_provenance", "similarityResultIds are required.", "provenance.similarityResultIds"));
  }
  if (provenance.outcomeIds.length === 0) {
    issues.push(issue("missing_provenance", "outcomeIds are required.", "provenance.outcomeIds"));
  }
  if (provenance.engineVersion !== FAILURE_LEARNING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.extractionVersion !== "APP-10/2") {
    issues.push(issue("invalid_provenance", "extractionVersion mismatch.", "provenance.extractionVersion"));
  }
  if (provenance.similarityVersion !== "APP-10/3") {
    issues.push(issue("invalid_provenance", "similarityVersion mismatch.", "provenance.similarityVersion"));
  }
  if (provenance.outcomeVersion !== "APP-10/4") {
    issues.push(issue("invalid_provenance", "outcomeVersion mismatch.", "provenance.outcomeVersion"));
  }
  if (hasDuplicateIds(provenance.scenarioIds)) {
    issues.push(issue("duplicate_provenance", "Duplicate scenarioIds in provenance.", "provenance.scenarioIds"));
  }
  if (hasDuplicateIds(provenance.patternIds)) {
    issues.push(issue("duplicate_provenance", "Duplicate patternIds in provenance.", "provenance.patternIds"));
  }
  if (hasDuplicateIds(provenance.outcomeIds)) {
    issues.push(issue("duplicate_provenance", "Duplicate outcomeIds in provenance.", "provenance.outcomeIds"));
  }
  return result(issues);
}

export function validateFailureProfile(profile: FailureProfile): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  for (const field of FAILURE_LEARNING_MANDATORY_PROFILE_FIELDS) {
    const value = profile[field as keyof FailureProfile];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (!isFailureCategory(profile.failureCategory)) {
    issues.push(issue("invalid_category", "failureCategory is invalid.", "failureCategory"));
  }
  if (profile.failureFactors.length === 0) {
    issues.push(issue("missing_factors", "failureFactors must not be empty.", "failureFactors"));
  }
  if (profile.evidenceCount <= 0) {
    issues.push(issue("missing_evidence", "evidenceCount must be greater than zero.", "evidenceCount"));
  }
  if (profile.version !== FAILURE_LEARNING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (profile.readOnly !== true) {
    issues.push(issue("invalid_contract", "FailureProfile must be read-only.", "readOnly"));
  }
  issues.push(...validateFailureProvenance(profile.provenance).issues);
  return result(issues);
}

export function validateExecutiveFailure(failure: ExecutiveFailure): FailureValidationResult {
  const issues = [...validateFailureProfile(failure.failure).issues];
  if (failure.evidence.length === 0) {
    issues.push(issue("missing_evidence", "evidence must not be empty.", "evidence"));
  }
  if (failure.evidence.length !== failure.failure.evidenceCount) {
    issues.push(issue("invalid_evidence", "evidenceCount must match evidence length.", "evidenceCount"));
  }
  if (failure.readOnly !== true) {
    issues.push(issue("invalid_contract", "ExecutiveFailure must be read-only.", "readOnly"));
  }
  return result(issues);
}

export function validateFailureLearningRequest(request: FailureLearningRequest): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (request.records.length === 0) {
    issues.push(issue("missing_field", "records must not be empty.", "records"));
  }
  if (request.records.length > FAILURE_LEARNING_ENGINE_LIMITS.maxHistoricalRecords) {
    issues.push(issue("limit_exceeded", "records exceeds limit.", "records"));
  }
  for (const record of request.records) {
    issues.push(...validateHistoricalFailureRecordInput(record).issues);
    if (record.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", `Workspace mismatch for scenario ${record.scenarioId}.`, "workspaceId"));
    }
  }
  return result(issues);
}

export function validatePatternReferences(patternIds: readonly string[]): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  if (patternIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedPatternIds must not be empty.", "relatedPatternIds"));
  }
  for (const patternId of patternIds) {
    if (!patternId.trim()) {
      issues.push(issue("missing_field", "patternId must not be blank.", "relatedPatternIds"));
      continue;
    }
    if (!patternExists(patternId)) {
      issues.push(issue("broken_reference", `Pattern not found: ${patternId}.`, "relatedPatternIds"));
    }
  }
  return result(issues);
}

export function validateSimilarityReferences(similarityResultIds: readonly string[]): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  if (similarityResultIds.length === 0) {
    issues.push(
      issue("missing_provenance", "relatedSimilarityResultIds must not be empty.", "relatedSimilarityResultIds")
    );
  }
  for (const resultId of similarityResultIds) {
    if (!resultId.trim()) {
      issues.push(issue("missing_field", "similarityResultId must not be blank.", "relatedSimilarityResultIds"));
      continue;
    }
    if (!similarityResultExists(resultId)) {
      issues.push(issue("broken_reference", `Similarity result not found: ${resultId}.`, "relatedSimilarityResultIds"));
    }
  }
  return result(issues);
}

export function validateOutcomeReferences(outcomeIds: readonly string[]): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  if (outcomeIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedOutcomeIds must not be empty.", "relatedOutcomeIds"));
  }
  for (const outcomeId of outcomeIds) {
    if (!outcomeId.trim()) {
      issues.push(issue("missing_field", "outcomeId must not be blank.", "relatedOutcomeIds"));
      continue;
    }
    if (!outcomeExists(outcomeId)) {
      issues.push(issue("broken_reference", `Outcome not found: ${outcomeId}.`, "relatedOutcomeIds"));
    }
  }
  return result(issues);
}

export function validateEngineDependencies(
  foundationInitialized: boolean,
  patternEngineInitialized: boolean,
  similarityEngineInitialized: boolean,
  outcomeEngineInitialized: boolean
): FailureValidationResult {
  const issues: FailureValidationIssue[] = [];
  if (!foundationInitialized) {
    issues.push(issue("foundation_incompatible", "APP-10:1 foundation is not initialized."));
  }
  if (!patternEngineInitialized) {
    issues.push(issue("pattern_engine_incompatible", "APP-10:2 pattern extraction engine is not initialized."));
  }
  if (!similarityEngineInitialized) {
    issues.push(issue("similarity_engine_incompatible", "APP-10:3 similarity engine is not initialized."));
  }
  if (!outcomeEngineInitialized) {
    issues.push(issue("outcome_engine_incompatible", "APP-10:4 outcome learning engine is not initialized."));
  }
  return result(issues);
}

export function validateFailureLearning(failures: readonly ExecutiveFailure[]): FailureValidationResult {
  const issues = failures.flatMap((failure) => validateExecutiveFailure(failure).issues);
  return result(issues);
}
