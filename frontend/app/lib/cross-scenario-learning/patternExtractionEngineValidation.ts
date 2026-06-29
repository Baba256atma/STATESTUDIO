/**
 * APP-10:2 — Pattern Extraction Engine validation.
 */

import { CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION } from "./crossScenarioLearningConstants.ts";
import {
  PATTERN_CATEGORY_KEYS,
  PATTERN_EXTRACTION_CERTIFIED_SOURCE_APPS,
  PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
  PATTERN_EXTRACTION_ENGINE_LIMITS,
  PATTERN_EXTRACTION_MANDATORY_PATTERN_FIELDS,
  PATTERN_TYPE_KEYS,
} from "./patternExtractionEngineConstants.ts";
import type {
  CertifiedCompletedScenarioInput,
  ExecutivePattern,
  PatternEvidence,
  PatternProvenance,
  PatternValidationIssue,
  PatternValidationResult,
  PatternCategory,
  PatternType,
} from "./patternExtractionEngineTypes.ts";

function issue(code: string, message: string, field?: string): PatternValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: PatternValidationIssue[]): PatternValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isPatternCategory(value: string): value is PatternCategory {
  return (PATTERN_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isPatternType(value: string): value is PatternType {
  return (PATTERN_TYPE_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function hasDuplicateEvidence(evidence: readonly PatternEvidence[]): boolean {
  const ids = evidence.map((entry) => entry.evidenceId);
  return hasDuplicateIds(ids);
}

export function validateCertifiedSourceApps(sourceApps: readonly string[]): PatternValidationResult {
  const issues: PatternValidationIssue[] = [];
  if (sourceApps.length === 0) {
    issues.push(issue("missing_field", "sourceApps must not be empty.", "sourceApps"));
  }
  for (const app of sourceApps) {
    if (!(PATTERN_EXTRACTION_CERTIFIED_SOURCE_APPS as readonly string[]).includes(app)) {
      issues.push(issue("invalid_dependency", `Uncertified source app: ${app}.`, "sourceApps"));
    }
  }
  return result(issues);
}

export function validateCertifiedScenarioInput(input: CertifiedCompletedScenarioInput): PatternValidationResult {
  const issues: PatternValidationIssue[] = [];
  if (!input.scenarioId.trim()) {
    issues.push(issue("missing_field", "scenarioId is required.", "scenarioId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.scenarioTitle.trim()) {
    issues.push(issue("missing_field", "scenarioTitle is required.", "scenarioTitle"));
  }
  if (!isPatternCategory(input.patternCategory)) {
    issues.push(issue("invalid_category", "patternCategory is invalid.", "patternCategory"));
  }
  if (!isPatternType(input.patternType)) {
    issues.push(issue("invalid_type", "patternType is invalid.", "patternType"));
  }
  if (input.strategyChain.length === 0) {
    issues.push(issue("missing_field", "strategyChain must not be empty.", "strategyChain"));
  }
  if (input.strategyChain.length > PATTERN_EXTRACTION_ENGINE_LIMITS.maxStrategyChainSteps) {
    issues.push(issue("limit_exceeded", "strategyChain exceeds limit.", "strategyChain"));
  }
  if (!input.outcomeSummary.trim()) {
    issues.push(issue("missing_field", "outcomeSummary is required.", "outcomeSummary"));
  }
  issues.push(...validateCertifiedSourceApps(input.sourceApps).issues);
  if (hasDuplicateIds(input.decisionIds)) {
    issues.push(issue("duplicate_ids", "decisionIds contain duplicates.", "decisionIds"));
  }
  if (hasDuplicateIds(input.timelineReferences)) {
    issues.push(issue("duplicate_ids", "timelineReferences contain duplicates.", "timelineReferences"));
  }
  if (hasDuplicateIds(input.journalReferences)) {
    issues.push(issue("duplicate_ids", "journalReferences contain duplicates.", "journalReferences"));
  }
  if (hasDuplicateIds(input.confidenceReferences)) {
    issues.push(issue("duplicate_ids", "confidenceReferences contain duplicates.", "confidenceReferences"));
  }
  return result(issues);
}

export function validatePatternProvenance(provenance: PatternProvenance): PatternValidationResult {
  const issues: PatternValidationIssue[] = [];
  if (provenance.scenarioIds.length === 0) {
    issues.push(issue("missing_provenance", "scenarioIds are required in provenance.", "provenance.scenarioIds"));
  }
  if (provenance.extractionVersion !== PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "extractionVersion mismatch.", "provenance.extractionVersion"));
  }
  if (provenance.engineVersion !== PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.foundationVersion !== CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "foundationVersion mismatch.", "provenance.foundationVersion"));
  }
  if (hasDuplicateIds(provenance.scenarioIds)) {
    issues.push(issue("duplicate_provenance", "Duplicate scenarioIds in provenance.", "provenance.scenarioIds"));
  }
  if (hasDuplicateIds(provenance.decisionIds)) {
    issues.push(issue("duplicate_provenance", "Duplicate decisionIds in provenance.", "provenance.decisionIds"));
  }
  return result(issues);
}

export function validateExecutivePattern(pattern: ExecutivePattern): PatternValidationResult {
  const issues: PatternValidationIssue[] = [];
  for (const field of PATTERN_EXTRACTION_MANDATORY_PATTERN_FIELDS) {
    const value = pattern[field as keyof ExecutivePattern];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (!pattern.patternId.trim()) {
    issues.push(issue("missing_field", "patternId is required.", "patternId"));
  }
  if (pattern.patternName.length > PATTERN_EXTRACTION_ENGINE_LIMITS.maxPatternNameLength) {
    issues.push(issue("limit_exceeded", "patternName exceeds limit.", "patternName"));
  }
  if (pattern.executiveSummary.length > PATTERN_EXTRACTION_ENGINE_LIMITS.maxExecutiveSummaryLength) {
    issues.push(issue("limit_exceeded", "executiveSummary exceeds limit.", "executiveSummary"));
  }
  if (pattern.supportingEvidence.length === 0) {
    issues.push(issue("missing_field", "supportingEvidence must not be empty.", "supportingEvidence"));
  }
  if (pattern.supportingEvidence.length > PATTERN_EXTRACTION_ENGINE_LIMITS.maxEvidencePerPattern) {
    issues.push(issue("limit_exceeded", "supportingEvidence exceeds limit.", "supportingEvidence"));
  }
  if (hasDuplicateEvidence(pattern.supportingEvidence)) {
    issues.push(issue("duplicate_evidence", "Duplicate evidence entries detected.", "supportingEvidence"));
  }
  if (pattern.version !== PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (pattern.readOnly !== true) {
    issues.push(issue("invalid_contract", "ExecutivePattern must be read-only.", "readOnly"));
  }
  issues.push(...validatePatternProvenance(pattern.provenance).issues);
  return result(issues);
}

export function validationFailureResult(
  validation: PatternValidationResult,
  context: string
): import("./patternExtractionEngineTypes.ts").PatternEngineResult<never> {
  return Object.freeze({
    success: false,
    reason: `${context} failed: ${validation.issues.map((entry) => entry.message).join("; ")}`,
    data: null,
    error: Object.freeze({
      code: "validation_failure",
      message: validation.issues.map((entry) => entry.message).join("; "),
      readOnly: true as const,
    }),
    readOnly: true as const,
  });
}

export function validateFoundationCompatibilityForEngine(
  foundationInitialized: boolean
): PatternValidationResult {
  if (!foundationInitialized) {
    return result([issue("foundation_incompatible", "APP-10:1 foundation is not initialized.")]);
  }
  return result([]);
}
