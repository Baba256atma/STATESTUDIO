/**
 * APP-9:6 — Confidence calibration validation.
 */

import { validateConfidenceEvolution } from "./confidenceEvolutionContracts.ts";
import { isConfidenceEvolutionEngineInitialized } from "./confidenceEvolutionEngine.ts";
import { isConfidenceEvolutionQueryLayerInitialized } from "./confidenceEvolutionQuery.ts";
import { isConfidenceEvolutionTrendLayerInitialized } from "./confidenceEvolutionTrend.ts";
import { isConfidenceEvidenceReasonLayerInitialized } from "./confidenceEvolutionEvidenceReason.ts";
import { CONFIDENCE_CALIBRATION_RULES, clampCalibrationScore } from "./confidenceEvolutionCalibrationRules.ts";
import {
  CONFIDENCE_ACCURACY_LEVELS,
  CONFIDENCE_CALIBRATION_FLAG_TYPES,
  CONFIDENCE_CALIBRATION_STATUSES,
  CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
  type BuildConfidenceCalibrationModelInput,
  type ConfidenceCalibrationModel,
  type ConfidenceEvolutionValidationIssue,
  type ConfidenceEvolutionValidationResult,
} from "./confidenceEvolutionCalibrationTypes.ts";

function issue(code: string, message: string, field?: string): ConfidenceEvolutionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ConfidenceEvolutionValidationIssue[]): ConfidenceEvolutionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForCalibration(
  timestamp: string
): ConfidenceEvolutionValidationResult {
  const foundation = validateConfidenceEvolution(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateConfidenceEngineAvailabilityForCalibration(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-9:2 Confidence Evolution Engine is not initialized.")]);
  }
  return result([]);
}

export function validateQueryLayerAvailabilityForCalibration(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionQueryLayerInitialized()) {
    return result([issue("query_not_initialized", "APP-9:3 Confidence Evolution Query Layer is not initialized.")]);
  }
  return result([]);
}

export function validateTrendLayerAvailabilityForCalibration(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionTrendLayerInitialized()) {
    return result([issue("trend_not_initialized", "APP-9:4 Confidence Evolution Trend Layer is not initialized.")]);
  }
  return result([]);
}

export function validateEvidenceReasonLayerAvailabilityForCalibration(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvidenceReasonLayerInitialized()) {
    return result([
      issue("evidence_reason_not_initialized", "APP-9:5 Evidence + Reason Link Layer is not initialized."),
    ]);
  }
  return result([]);
}

export function validateBuildConfidenceCalibrationModelInput(
  input: BuildConfidenceCalibrationModelInput
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  if (!input.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  return result(issues);
}

export function validateConfidenceCalibrationModel(
  model: ConfidenceCalibrationModel
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];

  if (model.contractVersion !== CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Calibration model must be read-only.", "readOnly"));
  }
  if (model.recordCount !== model.recordCalibrations.length) {
    issues.push(issue("invalid_field", "recordCount must match recordCalibrations length.", "recordCount"));
  }
  if (
    model.averageCalibrationScore < CONFIDENCE_CALIBRATION_RULES.minScore ||
    model.averageCalibrationScore > CONFIDENCE_CALIBRATION_RULES.maxScore
  ) {
    issues.push(issue("invalid_field", "averageCalibrationScore out of bounds.", "averageCalibrationScore"));
  }
  if (
    model.averageAccuracyScore < CONFIDENCE_CALIBRATION_RULES.minScore ||
    model.averageAccuracyScore > CONFIDENCE_CALIBRATION_RULES.maxScore
  ) {
    issues.push(issue("invalid_field", "averageAccuracyScore out of bounds.", "averageAccuracyScore"));
  }
  if (
    model.confidence < CONFIDENCE_CALIBRATION_RULES.minScore ||
    model.confidence > CONFIDENCE_CALIBRATION_RULES.maxScore
  ) {
    issues.push(issue("invalid_field", "confidence out of bounds.", "confidence"));
  }

  for (const entry of model.recordCalibrations) {
    if (!(CONFIDENCE_CALIBRATION_STATUSES as readonly string[]).includes(entry.calibrationStatus)) {
      issues.push(issue("invalid_enum", "Invalid calibration status.", "calibrationStatus"));
      break;
    }
    if (!(CONFIDENCE_ACCURACY_LEVELS as readonly string[]).includes(entry.accuracyLevel)) {
      issues.push(issue("invalid_enum", "Invalid accuracy level.", "accuracyLevel"));
      break;
    }
    if (
      entry.calibrationScore < CONFIDENCE_CALIBRATION_RULES.minScore ||
      entry.calibrationScore > CONFIDENCE_CALIBRATION_RULES.maxScore
    ) {
      issues.push(issue("invalid_field", "Record calibrationScore out of bounds.", "calibrationScore"));
      break;
    }
    if (
      entry.accuracyScore < CONFIDENCE_CALIBRATION_RULES.minScore ||
      entry.accuracyScore > CONFIDENCE_CALIBRATION_RULES.maxScore
    ) {
      issues.push(issue("invalid_field", "Record accuracyScore out of bounds.", "accuracyScore"));
      break;
    }
  }

  for (const entry of model.flags) {
    if (!(CONFIDENCE_CALIBRATION_FLAG_TYPES as readonly string[]).includes(entry.type)) {
      issues.push(issue("invalid_enum", "Invalid calibration flag type.", "type"));
      break;
    }
    if (clampCalibrationScore(entry.confidence) !== entry.confidence) {
      issues.push(issue("invalid_field", "Flag confidence must be clamped.", "confidence"));
      break;
    }
  }

  return result(issues);
}

export function assertNoMutationApisInCalibrationSource(source: string): boolean {
  return (
    !source.includes("createConfidenceRecord(") &&
    !source.includes("updateConfidenceMetadata(") &&
    !source.includes("archiveConfidenceRecord(") &&
    !source.includes("registerConfidenceRecord(")
  );
}

export const ConfidenceEvolutionCalibrationValidation = Object.freeze({
  validateFoundationCompatibilityForCalibration,
  validateConfidenceEngineAvailabilityForCalibration,
  validateQueryLayerAvailabilityForCalibration,
  validateTrendLayerAvailabilityForCalibration,
  validateEvidenceReasonLayerAvailabilityForCalibration,
  validateBuildConfidenceCalibrationModelInput,
  validateConfidenceCalibrationModel,
  assertNoMutationApisInCalibrationSource,
});
