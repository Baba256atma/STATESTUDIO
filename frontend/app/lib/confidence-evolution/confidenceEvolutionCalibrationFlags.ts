/**
 * APP-9:6 — Confidence calibration flag detection.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import {
  CONFIDENCE_CALIBRATION_RULES,
  calculateRecordEvidenceSupportScore,
  clampCalibrationScore,
  isSourceReasonCalibrationAligned,
} from "./confidenceEvolutionCalibrationRules.ts";
import {
  classifyConfidenceCalibrationStatus,
  evaluateConfidenceCalibration,
} from "./confidenceEvolutionCalibrationScoring.ts";
import type {
  ConfidenceCalibrationFlagType,
  ConfidenceCalibrationModelFlag,
  ConfidenceRecordCalibration,
} from "./confidenceEvolutionCalibrationTypes.ts";

function modelFlag(
  type: ConfidenceCalibrationFlagType,
  description: string,
  recordId?: string
): ConfidenceCalibrationModelFlag {
  return Object.freeze({
    type,
    recordId,
    description,
    confidence: clampCalibrationScore(1),
    metadata: Object.freeze({ deterministic: "true" }),
    readOnly: true as const,
  });
}

export function detectRecordCalibrationFlags(
  record: ConfidenceEvolutionEngineRecord,
  volatilityScore: number
): readonly ConfidenceCalibrationFlagType[] {
  const flags: ConfidenceCalibrationFlagType[] = [];
  const evaluation = evaluateConfidenceCalibration(
    record.confidenceScore,
    record.reason,
    record.source,
    record.evidenceReferences
  );
  const evidenceSupportScore = evaluation.evidenceSupportScore;
  const status = evaluation.calibrationStatus;

  if (
    record.confidenceScore >= CONFIDENCE_CALIBRATION_RULES.highConfidenceThreshold &&
    evidenceSupportScore < CONFIDENCE_CALIBRATION_RULES.lowEvidenceSupportThreshold
  ) {
    flags.push("high-confidence-low-evidence");
  }

  if (
    record.confidenceScore < CONFIDENCE_CALIBRATION_RULES.lowConfidenceThreshold &&
    evidenceSupportScore >= CONFIDENCE_CALIBRATION_RULES.highEvidenceSupportThreshold
  ) {
    flags.push("low-confidence-high-evidence");
  }

  if (!isSourceReasonCalibrationAligned(record.source, record.reason)) {
    flags.push("confidence-reason-misaligned");
    flags.push("confidence-source-misaligned");
  }

  if (status === "calibrated" && volatilityScore <= CONFIDENCE_CALIBRATION_RULES.stableVolatilityThreshold) {
    flags.push("stable-calibrated");
  }

  if (status !== "calibrated" && volatilityScore >= CONFIDENCE_CALIBRATION_RULES.volatileVolatilityThreshold) {
    flags.push("volatile-uncalibrated");
  }

  if (status === "unsupported") {
    flags.push("unsupported-confidence");
  }

  if (
    evidenceSupportScore >= CONFIDENCE_CALIBRATION_RULES.highEvidenceSupportThreshold &&
    (status === "calibrated" || status === "underconfident")
  ) {
    flags.push("evidence-supported-confidence");
  }

  if (status === "unknown") {
    flags.push("calibration-unknown");
  }

  return Object.freeze(flags);
}

export function detectConfidenceCalibrationFlags(
  records: readonly ConfidenceEvolutionEngineRecord[],
  volatilityScore: number
): readonly ConfidenceCalibrationModelFlag[] {
  const flags: ConfidenceCalibrationModelFlag[] = [];

  for (const record of records) {
    const recordFlags = detectRecordCalibrationFlags(record, volatilityScore);
    for (const type of recordFlags) {
      flags.push(modelFlag(type, `Record ${record.id} flagged as ${type}.`, record.id));
    }
  }

  return Object.freeze(flags);
}

export function buildRecordCalibrationFlags(
  record: ConfidenceEvolutionEngineRecord,
  volatilityScore: number
): readonly ConfidenceCalibrationFlagType[] {
  return detectRecordCalibrationFlags(record, volatilityScore);
}

export function aggregateCalibrationFlags(
  recordCalibrations: readonly ConfidenceRecordCalibration[]
): readonly ConfidenceCalibrationModelFlag[] {
  const flags: ConfidenceCalibrationModelFlag[] = [];
  for (const entry of recordCalibrations) {
    for (const type of entry.flags) {
      flags.push(modelFlag(type, `Record ${entry.recordId} flagged as ${type}.`, entry.recordId));
    }
  }
  return Object.freeze(flags);
}

export const ConfidenceEvolutionCalibrationFlags = Object.freeze({
  detectRecordCalibrationFlags,
  detectConfidenceCalibrationFlags,
  buildRecordCalibrationFlags,
  aggregateCalibrationFlags,
});
