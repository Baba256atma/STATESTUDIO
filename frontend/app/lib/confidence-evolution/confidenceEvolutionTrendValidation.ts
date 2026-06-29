/**
 * APP-9:4 — Confidence trend validation.
 */

import { validateConfidenceEvolution } from "./confidenceEvolutionContracts.ts";
import { isConfidenceEvolutionEngineInitialized } from "./confidenceEvolutionEngine.ts";
import { isConfidenceEvolutionQueryLayerInitialized } from "./confidenceEvolutionQuery.ts";
import { CONFIDENCE_EVOLUTION_TREND_RULES, clampConfidenceMetric } from "./confidenceEvolutionTrendRules.ts";
import {
  CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION,
  CONFIDENCE_STABILITY_LEVELS,
  CONFIDENCE_TREND_DIRECTIONS,
  CONFIDENCE_VOLATILITY_LEVELS,
  type BuildConfidenceTrendModelInput,
  type ConfidenceEvolutionTrendModel,
  type ConfidenceEvolutionValidationIssue,
  type ConfidenceEvolutionValidationResult,
} from "./confidenceEvolutionTrendTypes.ts";

function issue(code: string, message: string, field?: string): ConfidenceEvolutionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ConfidenceEvolutionValidationIssue[]): ConfidenceEvolutionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForTrend(timestamp: string): ConfidenceEvolutionValidationResult {
  const foundation = validateConfidenceEvolution(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateConfidenceEngineAvailabilityForTrend(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-9:2 Confidence Evolution Engine is not initialized.")]);
  }
  return result([]);
}

export function validateQueryLayerAvailabilityForTrend(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionQueryLayerInitialized()) {
    return result([issue("query_not_initialized", "APP-9:3 Confidence Evolution Query Layer is not initialized.")]);
  }
  return result([]);
}

export function validateBuildConfidenceTrendModelInput(
  input: BuildConfidenceTrendModelInput
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  return result(issues);
}

export function validateConfidenceTrendModel(model: ConfidenceEvolutionTrendModel): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];

  if (model.contractVersion !== CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Trend model must be read-only.", "readOnly"));
  }
  if (model.recordCount < 0) {
    issues.push(issue("invalid_field", "recordCount must be >= 0.", "recordCount"));
  }
  if (!(CONFIDENCE_TREND_DIRECTIONS as readonly string[]).includes(model.direction)) {
    issues.push(issue("invalid_enum", "Invalid direction.", "direction"));
  }
  if (!(CONFIDENCE_VOLATILITY_LEVELS as readonly string[]).includes(model.volatilityLevel)) {
    issues.push(issue("invalid_enum", "Invalid volatilityLevel.", "volatilityLevel"));
  }
  if (!(CONFIDENCE_STABILITY_LEVELS as readonly string[]).includes(model.stabilityLevel)) {
    issues.push(issue("invalid_enum", "Invalid stabilityLevel.", "stabilityLevel"));
  }
  if (
    model.volatilityScore < CONFIDENCE_EVOLUTION_TREND_RULES.minScore ||
    model.volatilityScore > CONFIDENCE_EVOLUTION_TREND_RULES.maxScore
  ) {
    issues.push(issue("invalid_field", "volatilityScore out of bounds.", "volatilityScore"));
  }
  if (
    model.confidence < CONFIDENCE_EVOLUTION_TREND_RULES.minScore ||
    model.confidence > CONFIDENCE_EVOLUTION_TREND_RULES.maxScore
  ) {
    issues.push(issue("invalid_field", "confidence out of bounds.", "confidence"));
  }
  if (model.recordCount === 0 && model.direction !== "unknown") {
    issues.push(issue("invalid_field", "Empty workspace must have unknown direction.", "direction"));
  }
  if (model.recordCount === 0 && model.stabilityLevel !== "unknown") {
    issues.push(issue("invalid_field", "Empty workspace must have unknown stability.", "stabilityLevel"));
  }

  for (const event of [...model.peaks, ...model.drops, ...model.recoveries]) {
    if (event.confidence < CONFIDENCE_EVOLUTION_TREND_RULES.minScore || event.confidence > CONFIDENCE_EVOLUTION_TREND_RULES.maxScore) {
      issues.push(issue("invalid_field", "Movement event confidence out of bounds.", "confidence"));
      break;
    }
    if (clampConfidenceMetric(event.confidence) !== event.confidence) {
      issues.push(issue("invalid_field", "Movement event confidence must be clamped.", "confidence"));
      break;
    }
  }

  return result(issues);
}

export function assertNoMutationApisInTrendSource(source: string): boolean {
  return (
    !source.includes("createConfidenceRecord(") &&
    !source.includes("updateConfidenceMetadata(") &&
    !source.includes("archiveConfidenceRecord(") &&
    !source.includes("registerConfidenceRecord(")
  );
}

export function assertReadOnlyTrendSource(source: string): boolean {
  return assertNoMutationApisInTrendSource(source);
}

export const ConfidenceEvolutionTrendValidation = Object.freeze({
  validateFoundationCompatibilityForTrend,
  validateConfidenceEngineAvailabilityForTrend,
  validateQueryLayerAvailabilityForTrend,
  validateBuildConfidenceTrendModelInput,
  validateConfidenceTrendModel,
  assertNoMutationApisInTrendSource,
  assertReadOnlyTrendSource,
});
