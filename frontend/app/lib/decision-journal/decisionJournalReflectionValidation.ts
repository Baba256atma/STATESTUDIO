/**
 * APP-8:4 — Decision Journal Reflection validation.
 */

import { validateDecisionJournal } from "./decisionJournalContracts.ts";
import { isDecisionJournalEngineInitialized } from "./decisionJournalEngine.ts";
import { isDecisionJournalQueryLayerInitialized } from "./decisionJournalQuery.ts";
import {
  DECISION_JOURNAL_INSIGHT_SEVERITY_LEVELS,
  DECISION_JOURNAL_INSIGHT_TYPES,
  DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
  type BuildDecisionJournalReflectionInput,
  type DecisionJournalReflectionModel,
  type DecisionJournalValidationIssue,
  type DecisionJournalValidationResult,
} from "./decisionJournalReflectionTypes.ts";
import { DECISION_JOURNAL_REFLECTION_RULES } from "./decisionJournalReflectionRules.ts";

function issue(code: string, message: string, field?: string): DecisionJournalValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionJournalValidationIssue[]): DecisionJournalValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForReflection(timestamp: string): DecisionJournalValidationResult {
  const foundation = validateDecisionJournal(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateJournalEngineAvailabilityForReflection(): DecisionJournalValidationResult {
  if (!isDecisionJournalEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-8:2 Decision Journal Engine is not initialized.")]);
  }
  return result([]);
}

export function validateQueryLayerAvailabilityForReflection(): DecisionJournalValidationResult {
  if (!isDecisionJournalQueryLayerInitialized()) {
    return result([issue("query_not_initialized", "APP-8:3 Decision Journal Query Layer is not initialized.")]);
  }
  return result([]);
}

export function validateBuildDecisionJournalReflectionInput(
  input: BuildDecisionJournalReflectionInput
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  return result(issues);
}

export function validateDecisionJournalReflectionModel(
  model: DecisionJournalReflectionModel
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];

  if (model.contractVersion !== DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Reflection model must be read-only.", "readOnly"));
  }
  if (!model.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }

  for (const insight of model.insightItems) {
    if (insight.workspaceId !== model.workspaceId) {
      issues.push(issue("workspace_isolation", "Insight workspaceId must match model.", "insightItems"));
      break;
    }
    if (!(DECISION_JOURNAL_INSIGHT_TYPES as readonly string[]).includes(insight.type)) {
      issues.push(issue("invalid_enum", `Invalid insight type: ${insight.type}.`, "type"));
    }
    if (!(DECISION_JOURNAL_INSIGHT_SEVERITY_LEVELS as readonly string[]).includes(insight.severity)) {
      issues.push(issue("invalid_enum", `Invalid insight severity: ${insight.severity}.`, "severity"));
    }
    if (
      insight.confidence < DECISION_JOURNAL_REFLECTION_RULES.insightConfidenceMin ||
      insight.confidence > DECISION_JOURNAL_REFLECTION_RULES.insightConfidenceMax
    ) {
      issues.push(issue("invalid_field", "Insight confidence must be between 0 and 1.", "confidence"));
    }
  }

  if (
    model.confidenceSummary.averageScore < DECISION_JOURNAL_REFLECTION_RULES.insightConfidenceMin ||
    model.confidenceSummary.averageScore > DECISION_JOURNAL_REFLECTION_RULES.insightConfidenceMax
  ) {
    issues.push(issue("invalid_field", "Confidence summary averageScore must be between 0 and 1.", "averageScore"));
  }

  return result(issues);
}

export function assertNoMutationApisInReflectionSource(source: string): boolean {
  return (
    !source.includes("createDecisionJournalEntry(") &&
    !source.includes("updateDecisionJournalMetadata(") &&
    !source.includes("archiveDecisionJournalEntry(") &&
    !source.includes("registerDecisionJournalEntry(")
  );
}

export function assertNoAiInReflectionSource(source: string): boolean {
  return (
    !source.includes("openai") &&
    !source.includes("prompt(") &&
    !source.includes("generateInsight(") &&
    !source.includes("deriveRecommendation(") &&
    !source.includes("predictOutcome(")
  );
}

export const DecisionJournalReflectionValidation = Object.freeze({
  validateFoundationCompatibilityForReflection,
  validateJournalEngineAvailabilityForReflection,
  validateQueryLayerAvailabilityForReflection,
  validateBuildDecisionJournalReflectionInput,
  validateDecisionJournalReflectionModel,
  assertNoMutationApisInReflectionSource,
  assertNoAiInReflectionSource,
});
