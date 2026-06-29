/**
 * APP-9:6 — Confidence calibration scoring rules and thresholds.
 */

import type { ConfidenceChangeReason, ConfidenceSource } from "./confidenceEvolutionTypes.ts";
import { isSourceReasonAligned } from "./confidenceEvolutionEvidenceReasonRules.ts";

export const CONFIDENCE_CALIBRATION_RULES = Object.freeze({
  minScore: 0,
  maxScore: 1,
  calibratedGapThreshold: 0.2,
  overconfidentGapThreshold: 0.35,
  underconfidentGapThreshold: -0.35,
  unsupportedConfidenceThreshold: 0.6,
  highConfidenceThreshold: 0.7,
  lowConfidenceThreshold: 0.4,
  highEvidenceSupportThreshold: 0.7,
  lowEvidenceSupportThreshold: 0.5,
  reasonOnlySupportScore: 0.35,
  evidenceBaseSupportScore: 0.5,
  evidenceIncrementPerRef: 0.25,
  maxEvidenceRefsForScore: 2,
  stableVolatilityThreshold: 0.15,
  volatileVolatilityThreshold: 0.4,
  modelConfidenceRecordDivisor: 5,
  accuracyLevelLow: 0.2,
  accuracyLevelMedium: 0.4,
  accuracyLevelHigh: 0.6,
  accuracyLevelVeryHigh: 0.8,
  unknownReason: "unknown" as const,
} as const);

export function clampCalibrationScore(value: number): number {
  if (Number.isNaN(value)) {
    return CONFIDENCE_CALIBRATION_RULES.minScore;
  }
  return Math.min(
    CONFIDENCE_CALIBRATION_RULES.maxScore,
    Math.max(CONFIDENCE_CALIBRATION_RULES.minScore, value)
  );
}

export function calculateModelCalibrationConfidence(recordCount: number): number {
  if (recordCount <= 0) {
    return CONFIDENCE_CALIBRATION_RULES.minScore;
  }
  return clampCalibrationScore(recordCount / CONFIDENCE_CALIBRATION_RULES.modelConfidenceRecordDivisor);
}

export function hasCalibrationReasonValue(reason: ConfidenceChangeReason): boolean {
  return reason !== CONFIDENCE_CALIBRATION_RULES.unknownReason;
}

export function hasCalibrationEvidenceValue(evidenceReferences: readonly string[]): boolean {
  return evidenceReferences.length > 0;
}

export function calculateRecordEvidenceSupportScore(
  reason: ConfidenceChangeReason,
  evidenceReferences: readonly string[]
): number {
  if (hasCalibrationEvidenceValue(evidenceReferences)) {
    const increment =
      CONFIDENCE_CALIBRATION_RULES.evidenceIncrementPerRef *
      Math.min(evidenceReferences.length, CONFIDENCE_CALIBRATION_RULES.maxEvidenceRefsForScore);
    return clampCalibrationScore(CONFIDENCE_CALIBRATION_RULES.evidenceBaseSupportScore + increment);
  }
  if (hasCalibrationReasonValue(reason)) {
    return CONFIDENCE_CALIBRATION_RULES.reasonOnlySupportScore;
  }
  return CONFIDENCE_CALIBRATION_RULES.minScore;
}

export function calculateCalibrationGap(confidenceScore: number, evidenceSupportScore: number): number {
  return confidenceScore - evidenceSupportScore;
}

export function isSourceReasonCalibrationAligned(
  source: ConfidenceSource,
  reason: ConfidenceChangeReason
): boolean {
  return isSourceReasonAligned(source, reason);
}

export const ConfidenceEvolutionCalibrationRules = Object.freeze({
  rules: CONFIDENCE_CALIBRATION_RULES,
  clampCalibrationScore,
  calculateModelCalibrationConfidence,
  hasCalibrationReasonValue,
  hasCalibrationEvidenceValue,
  calculateRecordEvidenceSupportScore,
  calculateCalibrationGap,
  isSourceReasonCalibrationAligned,
});
