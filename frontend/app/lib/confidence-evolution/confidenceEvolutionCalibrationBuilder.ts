/**
 * APP-9:6 — Confidence calibration model builder.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import { calculateConfidenceVolatility } from "./confidenceEvolutionVolatility.ts";
import { calculateConfidenceDeltas } from "./confidenceEvolutionDeltas.ts";
import { calculateConfidenceEvidenceCoverage } from "./confidenceEvolutionEvidenceReasonBuilder.ts";
import {
  aggregateCalibrationFlags,
  buildRecordCalibrationFlags,
} from "./confidenceEvolutionCalibrationFlags.ts";
import {
  calculateModelCalibrationConfidence,
  calculateRecordEvidenceSupportScore,
} from "./confidenceEvolutionCalibrationRules.ts";
import {
  calculateAverageScore,
  calculateConfidenceAccuracyScore,
  calculateConfidenceCalibrationScore,
  classifyConfidenceAccuracyLevel,
  classifyConfidenceCalibrationStatus,
} from "./confidenceEvolutionCalibrationScoring.ts";
import {
  CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
  type ConfidenceCalibrationModel,
  type ConfidenceRecordCalibration,
} from "./confidenceEvolutionCalibrationTypes.ts";

function incrementCount(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

function buildDistribution<T extends string>(
  entries: readonly { readonly [K in string]: T | string }[],
  field: keyof ConfidenceRecordCalibration
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    const value = String(entry[field as keyof typeof entry]);
    incrementCount(counts, value);
  }
  return Object.freeze({ ...counts });
}

function buildRecordCalibration(
  workspaceId: string,
  record: ConfidenceEvolutionEngineRecord,
  workspaceEvidenceCoverage: number,
  volatilityScore: number
): ConfidenceRecordCalibration {
  const evidenceSupportScore = calculateRecordEvidenceSupportScore(record.reason, record.evidenceReferences);
  const calibrationScore = calculateConfidenceCalibrationScore(record.confidenceScore, evidenceSupportScore);
  const accuracyScore = calculateConfidenceAccuracyScore(record.confidenceScore, evidenceSupportScore);
  const calibrationStatus = classifyConfidenceCalibrationStatus(
    record.confidenceScore,
    record.reason,
    record.evidenceReferences
  );
  const accuracyLevel = classifyConfidenceAccuracyLevel(accuracyScore);
  const flags = buildRecordCalibrationFlags(record, volatilityScore);

  return Object.freeze({
    id: `confidence-calibration-${workspaceId}-${record.id}`,
    workspaceId,
    recordId: record.id,
    confidenceScore: record.confidenceScore,
    evidenceCoverage: workspaceEvidenceCoverage,
    reason: record.reason,
    source: record.source,
    calibrationStatus,
    accuracyLevel,
    calibrationScore,
    accuracyScore,
    flags,
    confidence: calibrationScore,
    metadata: Object.freeze({
      evidenceSupportScore: String(evidenceSupportScore),
      calibrationGap: String(record.confidenceScore - evidenceSupportScore),
    }),
    readOnly: true as const,
  });
}

export function buildConfidenceCalibrationModelFromRecords(
  workspaceId: string,
  records: readonly ConfidenceEvolutionEngineRecord[],
  generatedAt: string
): ConfidenceCalibrationModel {
  const workspaceEvidenceCoverage = calculateConfidenceEvidenceCoverage(records);
  const deltas = calculateConfidenceDeltas(records);
  const volatilityScore = calculateConfidenceVolatility(deltas, records.length);

  const recordCalibrations = Object.freeze(
    records.map((record) =>
      buildRecordCalibration(workspaceId, record, workspaceEvidenceCoverage, volatilityScore)
    )
  );

  const calibrationScores = recordCalibrations.map((entry) => entry.calibrationScore);
  const accuracyScores = recordCalibrations.map((entry) => entry.accuracyScore);

  let calibratedCount = 0;
  let overconfidentCount = 0;
  let underconfidentCount = 0;
  let unsupportedCount = 0;

  for (const entry of recordCalibrations) {
    if (entry.calibrationStatus === "calibrated") {
      calibratedCount += 1;
    }
    if (entry.calibrationStatus === "overconfident") {
      overconfidentCount += 1;
    }
    if (entry.calibrationStatus === "underconfident") {
      underconfidentCount += 1;
    }
    if (entry.calibrationStatus === "unsupported") {
      unsupportedCount += 1;
    }
  }

  const flags = aggregateCalibrationFlags(recordCalibrations);

  return Object.freeze({
    workspaceId,
    generatedAt,
    recordCount: records.length,
    calibratedCount,
    overconfidentCount,
    underconfidentCount,
    unsupportedCount,
    averageCalibrationScore: calculateAverageScore(calibrationScores),
    averageAccuracyScore: calculateAverageScore(accuracyScores),
    calibrationStatusDistribution: buildDistribution(recordCalibrations, "calibrationStatus"),
    accuracyLevelDistribution: buildDistribution(recordCalibrations, "accuracyLevel"),
    recordCalibrations,
    flags,
    confidence: calculateModelCalibrationConfidence(records.length),
    metadata: Object.freeze({
      calibrationVersion: CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
      analysis: "reliability_metadata_only",
      volatilityScore: String(volatilityScore),
    }),
    contractVersion: CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionCalibrationBuilder = Object.freeze({
  buildConfidenceCalibrationModelFromRecords,
});
