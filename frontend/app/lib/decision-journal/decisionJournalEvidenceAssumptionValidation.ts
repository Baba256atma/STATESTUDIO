/**
 * APP-8:5 — Decision Journal Evidence + Assumption validation.
 */

import { validateDecisionJournal } from "./decisionJournalContracts.ts";
import { isDecisionJournalEngineInitialized } from "./decisionJournalEngine.ts";
import { isDecisionJournalQueryLayerInitialized } from "./decisionJournalQuery.ts";
import { isDecisionJournalReflectionLayerInitialized } from "./decisionJournalReflection.ts";
import { DECISION_JOURNAL_EVIDENCE_RULES } from "./decisionJournalEvidenceRules.ts";
import {
  DECISION_JOURNAL_ASSUMPTION_COVERAGE_VALUES,
  DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
  DECISION_JOURNAL_EVIDENCE_STRENGTH_VALUES,
  DECISION_JOURNAL_QUALITY_FLAG_TYPES,
  type BuildDecisionJournalEvidenceAssumptionInput,
  type DecisionJournalEvidenceAssumptionModel,
  type DecisionJournalValidationIssue,
  type DecisionJournalValidationResult,
} from "./decisionJournalEvidenceAssumptionTypes.ts";

function issue(code: string, message: string, field?: string): DecisionJournalValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionJournalValidationIssue[]): DecisionJournalValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForEvidenceAssumption(
  timestamp: string
): DecisionJournalValidationResult {
  const foundation = validateDecisionJournal(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateJournalEngineAvailabilityForEvidenceAssumption(): DecisionJournalValidationResult {
  if (!isDecisionJournalEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-8:2 Decision Journal Engine is not initialized.")]);
  }
  return result([]);
}

export function validateQueryLayerAvailabilityForEvidenceAssumption(): DecisionJournalValidationResult {
  if (!isDecisionJournalQueryLayerInitialized()) {
    return result([issue("query_not_initialized", "APP-8:3 Decision Journal Query Layer is not initialized.")]);
  }
  return result([]);
}

export function validateReflectionLayerAvailabilityForEvidenceAssumption(): DecisionJournalValidationResult {
  if (!isDecisionJournalReflectionLayerInitialized()) {
    return result([
      issue("reflection_not_initialized", "APP-8:4 Decision Journal Reflection Layer is not initialized."),
    ]);
  }
  return result([]);
}

export function validateBuildDecisionJournalEvidenceAssumptionInput(
  input: BuildDecisionJournalEvidenceAssumptionInput
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  return result(issues);
}

export function validateDecisionJournalEvidenceAssumptionModel(
  model: DecisionJournalEvidenceAssumptionModel
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];

  if (model.contractVersion !== DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Evidence/assumption model must be read-only.", "readOnly"));
  }
  if (model.entryCount !== model.evidenceModels.length || model.entryCount !== model.assumptionModels.length) {
    issues.push(issue("invalid_field", "Per-entry model counts must match entryCount.", "entryCount"));
  }

  for (const evidenceModel of model.evidenceModels) {
    if (evidenceModel.workspaceId !== model.workspaceId) {
      issues.push(issue("workspace_isolation", "Evidence model workspaceId mismatch.", "evidenceModels"));
      break;
    }
    if (!(DECISION_JOURNAL_EVIDENCE_STRENGTH_VALUES as readonly string[]).includes(evidenceModel.evidenceStrength)) {
      issues.push(issue("invalid_enum", "Invalid evidence strength.", "evidenceStrength"));
    }
    if (
      evidenceModel.confidence < DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMin ||
      evidenceModel.confidence > DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMax
    ) {
      issues.push(issue("invalid_field", "Evidence model confidence out of bounds.", "confidence"));
    }
    if (
      evidenceModel.evidenceCoverage < DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMin ||
      evidenceModel.evidenceCoverage > DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMax
    ) {
      issues.push(issue("invalid_field", "Evidence coverage out of bounds.", "evidenceCoverage"));
    }
  }

  for (const assumptionModel of model.assumptionModels) {
    if (assumptionModel.workspaceId !== model.workspaceId) {
      issues.push(issue("workspace_isolation", "Assumption model workspaceId mismatch.", "assumptionModels"));
      break;
    }
    if (!(DECISION_JOURNAL_ASSUMPTION_COVERAGE_VALUES as readonly string[]).includes(assumptionModel.assumptionCoverage)) {
      issues.push(issue("invalid_enum", "Invalid assumption coverage.", "assumptionCoverage"));
    }
    if (
      assumptionModel.confidence < DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMin ||
      assumptionModel.confidence > DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMax
    ) {
      issues.push(issue("invalid_field", "Assumption model confidence out of bounds.", "confidence"));
    }
  }

  for (const flag of model.qualityFlags) {
    if (!(DECISION_JOURNAL_QUALITY_FLAG_TYPES as readonly string[]).includes(flag.type)) {
      issues.push(issue("invalid_enum", `Invalid quality flag type: ${flag.type}.`, "qualityFlags"));
    }
    if (
      flag.confidence < DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMin ||
      flag.confidence > DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMax
    ) {
      issues.push(issue("invalid_field", "Quality flag confidence out of bounds.", "confidence"));
    }
  }

  return result(issues);
}

export function assertNoMutationApisInEvidenceAssumptionSource(source: string): boolean {
  return (
    !source.includes("createDecisionJournalEntry(") &&
    !source.includes("updateDecisionJournalMetadata(") &&
    !source.includes("archiveDecisionJournalEntry(") &&
    !source.includes("registerDecisionJournalEntry(")
  );
}

export function assertNoAiInEvidenceAssumptionSource(source: string): boolean {
  return (
    !source.includes("openai") &&
    !source.includes("prompt(") &&
    !source.includes("generateInsight(") &&
    !source.includes("deriveRecommendation(") &&
    !source.includes("predictOutcome(")
  );
}

export const DecisionJournalEvidenceAssumptionValidation = Object.freeze({
  validateFoundationCompatibilityForEvidenceAssumption,
  validateJournalEngineAvailabilityForEvidenceAssumption,
  validateQueryLayerAvailabilityForEvidenceAssumption,
  validateReflectionLayerAvailabilityForEvidenceAssumption,
  validateBuildDecisionJournalEvidenceAssumptionInput,
  validateDecisionJournalEvidenceAssumptionModel,
  assertNoMutationApisInEvidenceAssumptionSource,
  assertNoAiInEvidenceAssumptionSource,
});
