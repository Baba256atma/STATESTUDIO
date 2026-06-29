/**
 * APP-10:4 — Outcome Learning Engine validation.
 */

import { patternExists } from "./patternExtractionEngineRegistry.ts";
import { similarityResultExists } from "./similarityEngineRegistry.ts";
import {
  OUTCOME_CATEGORY_KEYS,
  OUTCOME_LEARNING_CERTIFIED_SOURCES,
  OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
  OUTCOME_LEARNING_ENGINE_LIMITS,
  OUTCOME_LEARNING_MANDATORY_PROFILE_FIELDS,
} from "./outcomeLearningEngineConstants.ts";
import type {
  ExecutiveOutcome,
  HistoricalOutcomeRecordInput,
  OutcomeCategory,
  OutcomeLearningRequest,
  OutcomeProfile,
  OutcomeProvenance,
  OutcomeValidationIssue,
  OutcomeValidationResult,
} from "./outcomeLearningEngineTypes.ts";

function issue(code: string, message: string, field?: string): OutcomeValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: OutcomeValidationIssue[]): OutcomeValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isOutcomeCategory(value: string): value is OutcomeCategory {
  return (OUTCOME_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateCertifiedSourceApps(sourceApps: readonly string[]): OutcomeValidationResult {
  const issues: OutcomeValidationIssue[] = [];
  if (sourceApps.length === 0) {
    issues.push(issue("missing_field", "sourceApps must not be empty.", "sourceApps"));
  }
  for (const app of sourceApps) {
    if (!(OUTCOME_LEARNING_CERTIFIED_SOURCES as readonly string[]).includes(app)) {
      issues.push(issue("invalid_dependency", `Uncertified source app: ${app}.`, "sourceApps"));
    }
  }
  return result(issues);
}

export function validateHistoricalOutcomeRecordInput(input: HistoricalOutcomeRecordInput): OutcomeValidationResult {
  const issues: OutcomeValidationIssue[] = [];
  if (!input.scenarioId.trim()) {
    issues.push(issue("missing_field", "scenarioId is required.", "scenarioId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.businessGoal.trim()) {
    issues.push(issue("missing_field", "businessGoal is required.", "businessGoal"));
  }
  if (!isOutcomeCategory(input.finalOutcomeCategory)) {
    issues.push(issue("invalid_category", "finalOutcomeCategory is invalid.", "finalOutcomeCategory"));
  }
  if (!input.kpiChangeSummary.trim()) {
    issues.push(issue("missing_field", "kpiChangeSummary is required.", "kpiChangeSummary"));
  }
  if (!input.riskChangeSummary.trim()) {
    issues.push(issue("missing_field", "riskChangeSummary is required.", "riskChangeSummary"));
  }
  if (!input.decisionSummary.trim()) {
    issues.push(issue("missing_field", "decisionSummary is required.", "decisionSummary"));
  }
  issues.push(...validateCertifiedSourceApps(input.sourceApps).issues);
  if (hasDuplicateIds(input.relatedPatternIds)) {
    issues.push(issue("duplicate_ids", "relatedPatternIds contain duplicates.", "relatedPatternIds"));
  }
  if (hasDuplicateIds(input.relatedSimilarityResultIds)) {
    issues.push(issue("duplicate_ids", "relatedSimilarityResultIds contain duplicates.", "relatedSimilarityResultIds"));
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

export function validateOutcomeProvenance(provenance: OutcomeProvenance): OutcomeValidationResult {
  const issues: OutcomeValidationIssue[] = [];
  if (provenance.scenarioIds.length === 0) {
    issues.push(issue("missing_provenance", "scenarioIds are required.", "provenance.scenarioIds"));
  }
  if (provenance.patternIds.length === 0) {
    issues.push(issue("missing_provenance", "patternIds are required.", "provenance.patternIds"));
  }
  if (provenance.similarityResultIds.length === 0) {
    issues.push(issue("missing_provenance", "similarityResultIds are required.", "provenance.similarityResultIds"));
  }
  if (provenance.engineVersion !== OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.extractionVersion !== "APP-10/2") {
    issues.push(issue("invalid_provenance", "extractionVersion mismatch.", "provenance.extractionVersion"));
  }
  if (provenance.similarityVersion !== "APP-10/3") {
    issues.push(issue("invalid_provenance", "similarityVersion mismatch.", "provenance.similarityVersion"));
  }
  if (hasDuplicateIds(provenance.scenarioIds)) {
    issues.push(issue("duplicate_provenance", "Duplicate scenarioIds in provenance.", "provenance.scenarioIds"));
  }
  if (hasDuplicateIds(provenance.patternIds)) {
    issues.push(issue("duplicate_provenance", "Duplicate patternIds in provenance.", "provenance.patternIds"));
  }
  return result(issues);
}

export function validateOutcomeProfile(profile: OutcomeProfile): OutcomeValidationResult {
  const issues: OutcomeValidationIssue[] = [];
  for (const field of OUTCOME_LEARNING_MANDATORY_PROFILE_FIELDS) {
    const value = profile[field as keyof OutcomeProfile];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (!isOutcomeCategory(profile.finalOutcomeCategory)) {
    issues.push(issue("invalid_category", "finalOutcomeCategory is invalid.", "finalOutcomeCategory"));
  }
  if (profile.evidenceCount <= 0) {
    issues.push(issue("missing_evidence", "evidenceCount must be greater than zero.", "evidenceCount"));
  }
  if (profile.version !== OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (profile.readOnly !== true) {
    issues.push(issue("invalid_contract", "OutcomeProfile must be read-only.", "readOnly"));
  }
  issues.push(...validateOutcomeProvenance(profile.provenance).issues);
  return result(issues);
}

export function validateExecutiveOutcome(outcome: ExecutiveOutcome): OutcomeValidationResult {
  const issues = [...validateOutcomeProfile(outcome.outcome).issues];
  if (outcome.evidence.length === 0) {
    issues.push(issue("missing_evidence", "evidence must not be empty.", "evidence"));
  }
  if (outcome.evidence.length !== outcome.outcome.evidenceCount) {
    issues.push(issue("invalid_evidence", "evidenceCount must match evidence length.", "evidenceCount"));
  }
  if (outcome.readOnly !== true) {
    issues.push(issue("invalid_contract", "ExecutiveOutcome must be read-only.", "readOnly"));
  }
  return result(issues);
}

export function validateOutcomeLearningRequest(request: OutcomeLearningRequest): OutcomeValidationResult {
  const issues: OutcomeValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (request.records.length === 0) {
    issues.push(issue("missing_field", "records must not be empty.", "records"));
  }
  if (request.records.length > OUTCOME_LEARNING_ENGINE_LIMITS.maxHistoricalRecords) {
    issues.push(issue("limit_exceeded", "records exceeds limit.", "records"));
  }
  for (const record of request.records) {
    issues.push(...validateHistoricalOutcomeRecordInput(record).issues);
    if (record.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", `Workspace mismatch for scenario ${record.scenarioId}.`, "workspaceId"));
    }
  }
  return result(issues);
}

export function validatePatternReferences(patternIds: readonly string[]): OutcomeValidationResult {
  const issues: OutcomeValidationIssue[] = [];
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

export function validateSimilarityReferences(similarityResultIds: readonly string[]): OutcomeValidationResult {
  const issues: OutcomeValidationIssue[] = [];
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

export function validateEngineDependencies(
  foundationInitialized: boolean,
  patternEngineInitialized: boolean,
  similarityEngineInitialized: boolean
): OutcomeValidationResult {
  const issues: OutcomeValidationIssue[] = [];
  if (!foundationInitialized) {
    issues.push(issue("foundation_incompatible", "APP-10:1 foundation is not initialized."));
  }
  if (!patternEngineInitialized) {
    issues.push(issue("pattern_engine_incompatible", "APP-10:2 pattern extraction engine is not initialized."));
  }
  if (!similarityEngineInitialized) {
    issues.push(issue("similarity_engine_incompatible", "APP-10:3 similarity engine is not initialized."));
  }
  return result(issues);
}

export function validateOutcomeLearning(outcomes: readonly ExecutiveOutcome[]): OutcomeValidationResult {
  const issues = outcomes.flatMap((outcome) => validateExecutiveOutcome(outcome).issues);
  return result(issues);
}
