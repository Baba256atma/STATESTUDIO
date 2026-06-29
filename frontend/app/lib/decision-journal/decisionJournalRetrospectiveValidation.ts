/**
 * APP-8:6 — Decision Journal Retrospective validation.
 */

import { validateDecisionJournal } from "./decisionJournalContracts.ts";
import { isDecisionJournalEngineInitialized } from "./decisionJournalEngine.ts";
import { isDecisionJournalQueryLayerInitialized } from "./decisionJournalQuery.ts";
import { isDecisionJournalReflectionLayerInitialized } from "./decisionJournalReflection.ts";
import { isDecisionJournalEvidenceAssumptionLayerInitialized } from "./decisionJournalEvidenceAssumption.ts";
import { DECISION_JOURNAL_OUTCOME_RULES } from "./decisionJournalOutcomeRules.ts";
import {
  DECISION_JOURNAL_OUTCOME_STATUS_VALUES,
  DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION,
  DECISION_JOURNAL_RETROSPECTIVE_FLAG_TYPES,
  type BuildDecisionJournalRetrospectiveInput,
  type DecisionJournalRetrospectiveWorkspaceModel,
  type DecisionJournalValidationIssue,
  type DecisionJournalValidationResult,
} from "./decisionJournalRetrospectiveTypes.ts";

function issue(code: string, message: string, field?: string): DecisionJournalValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionJournalValidationIssue[]): DecisionJournalValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForRetrospective(
  timestamp: string
): DecisionJournalValidationResult {
  const foundation = validateDecisionJournal(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateJournalEngineAvailabilityForRetrospective(): DecisionJournalValidationResult {
  if (!isDecisionJournalEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-8:2 Decision Journal Engine is not initialized.")]);
  }
  return result([]);
}

export function validateQueryLayerAvailabilityForRetrospective(): DecisionJournalValidationResult {
  if (!isDecisionJournalQueryLayerInitialized()) {
    return result([issue("query_not_initialized", "APP-8:3 Decision Journal Query Layer is not initialized.")]);
  }
  return result([]);
}

export function validateReflectionLayerAvailabilityForRetrospective(): DecisionJournalValidationResult {
  if (!isDecisionJournalReflectionLayerInitialized()) {
    return result([issue("reflection_not_initialized", "APP-8:4 Decision Journal Reflection Layer is not initialized.")]);
  }
  return result([]);
}

export function validateEvidenceAssumptionLayerAvailabilityForRetrospective(): DecisionJournalValidationResult {
  if (!isDecisionJournalEvidenceAssumptionLayerInitialized()) {
    return result([
      issue(
        "evidence_assumption_not_initialized",
        "APP-8:5 Decision Journal Evidence + Assumption Layer is not initialized."
      ),
    ]);
  }
  return result([]);
}

export function validateBuildDecisionJournalRetrospectiveInput(
  input: BuildDecisionJournalRetrospectiveInput
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  return result(issues);
}

export function validateDecisionJournalRetrospectiveModel(
  model: DecisionJournalRetrospectiveWorkspaceModel
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];

  if (model.contractVersion !== DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Retrospective model must be read-only.", "readOnly"));
  }
  if (model.entryCount !== model.retrospectives.length) {
    issues.push(issue("invalid_field", "Retrospective count must match entryCount.", "entryCount"));
  }

  for (const retrospective of model.retrospectives) {
    if (retrospective.workspaceId !== model.workspaceId) {
      issues.push(issue("workspace_isolation", "Retrospective workspaceId mismatch.", "retrospectives"));
      break;
    }
    if (!(DECISION_JOURNAL_OUTCOME_STATUS_VALUES as readonly string[]).includes(retrospective.outcomeStatus)) {
      issues.push(issue("invalid_enum", "Invalid outcome status.", "outcomeStatus"));
    }
    if (
      retrospective.confidence < DECISION_JOURNAL_OUTCOME_RULES.qualityConfidenceMin ||
      retrospective.confidence > DECISION_JOURNAL_OUTCOME_RULES.qualityConfidenceMax
    ) {
      issues.push(issue("invalid_field", "Retrospective confidence out of bounds.", "confidence"));
    }
    for (const metric of [
      retrospective.assumptionAccuracy,
      retrospective.riskRealization,
      retrospective.evidenceReliability,
      retrospective.reviewCompleteness,
    ]) {
      if (
        metric < DECISION_JOURNAL_OUTCOME_RULES.qualityConfidenceMin ||
        metric > DECISION_JOURNAL_OUTCOME_RULES.qualityConfidenceMax
      ) {
        issues.push(issue("invalid_field", "Retrospective metric out of bounds.", "metrics"));
        break;
      }
    }
  }

  for (const flag of model.retrospectiveFlags) {
    if (!(DECISION_JOURNAL_RETROSPECTIVE_FLAG_TYPES as readonly string[]).includes(flag.type)) {
      issues.push(issue("invalid_enum", `Invalid retrospective flag type: ${flag.type}.`, "retrospectiveFlags"));
    }
    if (
      flag.confidence < DECISION_JOURNAL_OUTCOME_RULES.qualityConfidenceMin ||
      flag.confidence > DECISION_JOURNAL_OUTCOME_RULES.qualityConfidenceMax
    ) {
      issues.push(issue("invalid_field", "Retrospective flag confidence out of bounds.", "confidence"));
    }
  }

  return result(issues);
}

export function assertNoMutationApisInRetrospectiveSource(source: string): boolean {
  return (
    !source.includes("createDecisionJournalEntry(") &&
    !source.includes("updateDecisionJournalMetadata(") &&
    !source.includes("archiveDecisionJournalEntry(") &&
    !source.includes("registerDecisionJournalEntry(")
  );
}

export function assertNoAiInRetrospectiveSource(source: string): boolean {
  return (
    !source.includes("openai") &&
    !source.includes("prompt(") &&
    !source.includes("predictOutcome(") &&
    !source.includes("deriveRecommendation(")
  );
}

export const DecisionJournalRetrospectiveValidation = Object.freeze({
  validateFoundationCompatibilityForRetrospective,
  validateJournalEngineAvailabilityForRetrospective,
  validateQueryLayerAvailabilityForRetrospective,
  validateReflectionLayerAvailabilityForRetrospective,
  validateEvidenceAssumptionLayerAvailabilityForRetrospective,
  validateBuildDecisionJournalRetrospectiveInput,
  validateDecisionJournalRetrospectiveModel,
  assertNoMutationApisInRetrospectiveSource,
  assertNoAiInRetrospectiveSource,
});
