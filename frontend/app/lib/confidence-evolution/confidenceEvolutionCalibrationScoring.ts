/**
 * APP-9:6 — Confidence calibration and accuracy scoring.
 */

import type { ConfidenceChangeReason, ConfidenceSource } from "./confidenceEvolutionTypes.ts";
import {
  CONFIDENCE_CALIBRATION_RULES,
  calculateCalibrationGap,
  calculateRecordEvidenceSupportScore,
  clampCalibrationScore,
  hasCalibrationEvidenceValue,
  hasCalibrationReasonValue,
} from "./confidenceEvolutionCalibrationRules.ts";
import type {
  ConfidenceAccuracyLevel,
  ConfidenceCalibrationStatus,
} from "./confidenceEvolutionCalibrationTypes.ts";

export function calculateConfidenceCalibrationScore(
  confidenceScore: number,
  evidenceSupportScore: number
): number {
  const gap = calculateCalibrationGap(confidenceScore, evidenceSupportScore);
  return clampCalibrationScore(1 - Math.abs(gap));
}

export function calculateConfidenceAccuracyScore(
  confidenceScore: number,
  evidenceSupportScore: number
): number {
  const gap = calculateCalibrationGap(confidenceScore, evidenceSupportScore);
  return clampCalibrationScore(1 - Math.abs(gap));
}

export function classifyConfidenceCalibrationStatus(
  confidenceScore: number,
  reason: ConfidenceChangeReason,
  evidenceReferences: readonly string[]
): ConfidenceCalibrationStatus {
  const evidenceSupportScore = calculateRecordEvidenceSupportScore(reason, evidenceReferences);
  const hasReason = hasCalibrationReasonValue(reason);
  const hasEvidence = hasCalibrationEvidenceValue(evidenceReferences);
  const gap = calculateCalibrationGap(confidenceScore, evidenceSupportScore);

  if (!hasReason && !hasEvidence && confidenceScore <= CONFIDENCE_CALIBRATION_RULES.minScore) {
    return "unknown";
  }

  if (evidenceSupportScore === CONFIDENCE_CALIBRATION_RULES.minScore && !hasReason) {
    if (confidenceScore >= CONFIDENCE_CALIBRATION_RULES.unsupportedConfidenceThreshold) {
      return "unsupported";
    }
    return "unknown";
  }

  if (
    evidenceSupportScore === CONFIDENCE_CALIBRATION_RULES.minScore &&
    hasReason &&
    confidenceScore >= CONFIDENCE_CALIBRATION_RULES.unsupportedConfidenceThreshold
  ) {
    return "weakly_supported";
  }

  if (gap >= CONFIDENCE_CALIBRATION_RULES.overconfidentGapThreshold) {
    return "overconfident";
  }

  if (gap <= CONFIDENCE_CALIBRATION_RULES.underconfidentGapThreshold) {
    return "underconfident";
  }

  if (Math.abs(gap) <= CONFIDENCE_CALIBRATION_RULES.calibratedGapThreshold) {
    return "calibrated";
  }

  if (evidenceSupportScore > CONFIDENCE_CALIBRATION_RULES.minScore && gap > CONFIDENCE_CALIBRATION_RULES.calibratedGapThreshold) {
    return "weakly_supported";
  }

  if (hasReason && !hasEvidence) {
    return "weakly_supported";
  }

  return "unknown";
}

export function classifyConfidenceAccuracyLevel(accuracyScore: number): ConfidenceAccuracyLevel {
  if (accuracyScore < CONFIDENCE_CALIBRATION_RULES.accuracyLevelLow) {
    return "unknown";
  }
  if (accuracyScore < CONFIDENCE_CALIBRATION_RULES.accuracyLevelMedium) {
    return "low";
  }
  if (accuracyScore < CONFIDENCE_CALIBRATION_RULES.accuracyLevelHigh) {
    return "medium";
  }
  if (accuracyScore < CONFIDENCE_CALIBRATION_RULES.accuracyLevelVeryHigh) {
    return "high";
  }
  return "very_high";
}

export function evaluateConfidenceCalibration(
  confidenceScore: number,
  reason: ConfidenceChangeReason,
  source: ConfidenceSource,
  evidenceReferences: readonly string[]
): Readonly<{
  evidenceSupportScore: number;
  calibrationGap: number;
  calibrationScore: number;
  accuracyScore: number;
  calibrationStatus: ConfidenceCalibrationStatus;
  accuracyLevel: ConfidenceAccuracyLevel;
}> {
  const evidenceSupportScore = calculateRecordEvidenceSupportScore(reason, evidenceReferences);
  const calibrationGap = calculateCalibrationGap(confidenceScore, evidenceSupportScore);
  const calibrationScore = calculateConfidenceCalibrationScore(confidenceScore, evidenceSupportScore);
  const accuracyScore = calculateConfidenceAccuracyScore(confidenceScore, evidenceSupportScore);
  const calibrationStatus = classifyConfidenceCalibrationStatus(confidenceScore, reason, evidenceReferences);
  const accuracyLevel = classifyConfidenceAccuracyLevel(accuracyScore);

  void source;

  return Object.freeze({
    evidenceSupportScore,
    calibrationGap,
    calibrationScore,
    accuracyScore,
    calibrationStatus,
    accuracyLevel,
  });
}

export function calculateAverageScore(scores: readonly number[]): number {
  if (scores.length === 0) {
    return CONFIDENCE_CALIBRATION_RULES.minScore;
  }
  const total = scores.reduce((sum, score) => sum + score, 0);
  return clampCalibrationScore(total / scores.length);
}

export const ConfidenceEvolutionCalibrationScoring = Object.freeze({
  calculateConfidenceCalibrationScore,
  calculateConfidenceAccuracyScore,
  classifyConfidenceCalibrationStatus,
  classifyConfidenceAccuracyLevel,
  evaluateConfidenceCalibration,
  calculateAverageScore,
});
