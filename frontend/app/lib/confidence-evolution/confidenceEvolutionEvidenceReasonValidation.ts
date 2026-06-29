/**
 * APP-9:5 — Confidence evidence + reason link validation.
 */

import { validateConfidenceEvolution } from "./confidenceEvolutionContracts.ts";
import { isConfidenceEvolutionEngineInitialized } from "./confidenceEvolutionEngine.ts";
import { isConfidenceEvolutionQueryLayerInitialized } from "./confidenceEvolutionQuery.ts";
import { isConfidenceEvolutionTrendLayerInitialized } from "./confidenceEvolutionTrend.ts";
import { CONFIDENCE_EVIDENCE_REASON_RULES, clampLinkConfidence } from "./confidenceEvolutionEvidenceReasonRules.ts";
import {
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
  CONFIDENCE_EXPLANATION_FLAG_TYPES,
  CONFIDENCE_LINK_TYPES,
  type BuildConfidenceEvidenceReasonLinkInput,
  type ConfidenceEvidenceReasonLinkModel,
  type ConfidenceEvolutionValidationIssue,
  type ConfidenceEvolutionValidationResult,
} from "./confidenceEvolutionEvidenceReasonTypes.ts";

function issue(code: string, message: string, field?: string): ConfidenceEvolutionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ConfidenceEvolutionValidationIssue[]): ConfidenceEvolutionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForEvidenceReason(
  timestamp: string
): ConfidenceEvolutionValidationResult {
  const foundation = validateConfidenceEvolution(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateConfidenceEngineAvailabilityForEvidenceReason(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-9:2 Confidence Evolution Engine is not initialized.")]);
  }
  return result([]);
}

export function validateQueryLayerAvailabilityForEvidenceReason(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionQueryLayerInitialized()) {
    return result([issue("query_not_initialized", "APP-9:3 Confidence Evolution Query Layer is not initialized.")]);
  }
  return result([]);
}

export function validateTrendLayerAvailabilityForEvidenceReason(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionTrendLayerInitialized()) {
    return result([issue("trend_not_initialized", "APP-9:4 Confidence Evolution Trend Layer is not initialized.")]);
  }
  return result([]);
}

export function validateBuildConfidenceEvidenceReasonLinkInput(
  input: BuildConfidenceEvidenceReasonLinkInput
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  return result(issues);
}

export function validateConfidenceEvidenceReasonLinkModel(
  model: ConfidenceEvidenceReasonLinkModel
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];

  if (model.contractVersion !== CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Link model must be read-only.", "readOnly"));
  }
  if (model.linkCount !== model.links.length) {
    issues.push(issue("invalid_field", "linkCount must match links length.", "linkCount"));
  }
  if (model.evidenceCoverage < CONFIDENCE_EVIDENCE_REASON_RULES.minScore || model.evidenceCoverage > CONFIDENCE_EVIDENCE_REASON_RULES.maxScore) {
    issues.push(issue("invalid_field", "evidenceCoverage out of bounds.", "evidenceCoverage"));
  }
  if (model.confidence < CONFIDENCE_EVIDENCE_REASON_RULES.minScore || model.confidence > CONFIDENCE_EVIDENCE_REASON_RULES.maxScore) {
    issues.push(issue("invalid_field", "confidence out of bounds.", "confidence"));
  }

  for (const link of model.links) {
    if (!(CONFIDENCE_LINK_TYPES as readonly string[]).includes(link.type)) {
      issues.push(issue("invalid_enum", "Invalid link type.", "type"));
      break;
    }
    if (link.confidence < CONFIDENCE_EVIDENCE_REASON_RULES.minScore || link.confidence > CONFIDENCE_EVIDENCE_REASON_RULES.maxScore) {
      issues.push(issue("invalid_field", "Link confidence out of bounds.", "confidence"));
      break;
    }
  }

  for (const entry of model.flags) {
    if (!(CONFIDENCE_EXPLANATION_FLAG_TYPES as readonly string[]).includes(entry.type)) {
      issues.push(issue("invalid_enum", "Invalid explanation flag type.", "type"));
      break;
    }
    if (clampLinkConfidence(entry.confidence) !== entry.confidence) {
      issues.push(issue("invalid_field", "Flag confidence must be clamped.", "confidence"));
      break;
    }
  }

  return result(issues);
}

export function assertNoMutationApisInEvidenceReasonSource(source: string): boolean {
  return (
    !source.includes("createConfidenceRecord(") &&
    !source.includes("updateConfidenceMetadata(") &&
    !source.includes("archiveConfidenceRecord(") &&
    !source.includes("registerConfidenceRecord(")
  );
}

export const ConfidenceEvolutionEvidenceReasonValidation = Object.freeze({
  validateFoundationCompatibilityForEvidenceReason,
  validateConfidenceEngineAvailabilityForEvidenceReason,
  validateQueryLayerAvailabilityForEvidenceReason,
  validateTrendLayerAvailabilityForEvidenceReason,
  validateBuildConfidenceEvidenceReasonLinkInput,
  validateConfidenceEvidenceReasonLinkModel,
  assertNoMutationApisInEvidenceReasonSource,
});
