/**
 * APP-9:6 — Confidence Calibration + Accuracy domain types.
 * Read-only reliability metadata over APP-9:3, APP-9:4, and APP-9:5 inputs.
 */

import type { ConfidenceChangeReason, ConfidenceSource } from "./confidenceEvolutionTypes.ts";
import type {
  ConfidenceEvolutionValidationIssue,
  ConfidenceEvolutionValidationResult,
  ConfidenceWorkspaceId,
} from "./confidenceEvolutionTypes.ts";

export const CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION = "APP-9/6" as const;
export const CONFIDENCE_EVOLUTION_CALIBRATION_ARCHITECTURE_VERSION =
  "APP-9/6-confidence-calibration-arch" as const;

export const CONFIDENCE_EVOLUTION_CALIBRATION_TAGS = Object.freeze([
  "[APP9_6]",
  "[CONFIDENCE_CALIBRATION]",
  "[READ_ONLY]",
  "[RELIABILITY_METADATA]",
  "[NO_AI]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const CONFIDENCE_CALIBRATION_STATUSES = Object.freeze([
  "calibrated",
  "overconfident",
  "underconfident",
  "weakly_supported",
  "unsupported",
  "unknown",
] as const);

export const CONFIDENCE_ACCURACY_LEVELS = Object.freeze([
  "unknown",
  "low",
  "medium",
  "high",
  "very_high",
] as const);

export const CONFIDENCE_CALIBRATION_FLAG_TYPES = Object.freeze([
  "high-confidence-low-evidence",
  "low-confidence-high-evidence",
  "confidence-reason-misaligned",
  "confidence-source-misaligned",
  "stable-calibrated",
  "volatile-uncalibrated",
  "unsupported-confidence",
  "evidence-supported-confidence",
  "calibration-unknown",
] as const);

export const CONFIDENCE_EVOLUTION_CALIBRATION_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "decision-journal/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "ConfidenceChart",
  "ConfidenceEditor",
  "localStorage",
  "indexedDB",
  "fetch(",
  "openai",
  "prompt(",
] as const);

export type ConfidenceCalibrationStatus = (typeof CONFIDENCE_CALIBRATION_STATUSES)[number];
export type ConfidenceAccuracyLevel = (typeof CONFIDENCE_ACCURACY_LEVELS)[number];
export type ConfidenceCalibrationFlagType = (typeof CONFIDENCE_CALIBRATION_FLAG_TYPES)[number];

export type ConfidenceRecordCalibration = Readonly<{
  id: string;
  workspaceId: ConfidenceWorkspaceId;
  recordId: string;
  confidenceScore: number;
  evidenceCoverage: number;
  reason: ConfidenceChangeReason | "unknown";
  source: ConfidenceSource | "unknown";
  calibrationStatus: ConfidenceCalibrationStatus;
  accuracyLevel: ConfidenceAccuracyLevel;
  calibrationScore: number;
  accuracyScore: number;
  flags: readonly ConfidenceCalibrationFlagType[];
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ConfidenceCalibrationModelFlag = Readonly<{
  type: ConfidenceCalibrationFlagType;
  recordId?: string;
  description: string;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ConfidenceCalibrationModel = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  generatedAt: string;
  recordCount: number;
  calibratedCount: number;
  overconfidentCount: number;
  underconfidentCount: number;
  unsupportedCount: number;
  averageCalibrationScore: number;
  averageAccuracyScore: number;
  calibrationStatusDistribution: Readonly<Record<string, number>>;
  accuracyLevelDistribution: Readonly<Record<string, number>>;
  recordCalibrations: readonly ConfidenceRecordCalibration[];
  flags: readonly ConfidenceCalibrationModelFlag[];
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  contractVersion: typeof CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BuildConfidenceCalibrationModelInput = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  generatedAt?: string;
  includeArchived?: boolean;
}>;

export type ConfidenceEvolutionCalibrationEngineState = Readonly<{
  engineId: "confidence-evolution-calibration-engine";
  contractVersion: typeof CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionCalibrationResponse = Readonly<{
  success: boolean;
  reason: string;
  data: ConfidenceCalibrationModel | null;
  readOnly: true;
}>;

export type ConfidenceEvolutionCalibrationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionCalibrationCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ConfidenceEvolutionCalibrationCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { ConfidenceEvolutionValidationIssue, ConfidenceEvolutionValidationResult };

export function calibrationSuccess(
  reason: string,
  data: ConfidenceCalibrationModel
): ConfidenceEvolutionCalibrationResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function calibrationFailure(reason: string): ConfidenceEvolutionCalibrationResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
