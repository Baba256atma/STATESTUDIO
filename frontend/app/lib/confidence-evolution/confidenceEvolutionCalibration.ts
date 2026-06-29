/**
 * APP-9:6 — Confidence Calibration + Accuracy Layer.
 * Read-only reliability metadata over APP-9:3, APP-9:4, and APP-9:5 inputs.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CONFIDENCE_EVOLUTION_MUST_NOT_OWN } from "./confidenceEvolutionConstants.ts";
import { isConfidenceEvolutionPlatformInitialized } from "./confidenceEvolutionFoundation.ts";
import { buildConfidenceCalibrationModelFromRecords } from "./confidenceEvolutionCalibrationBuilder.ts";
import {
  calculateConfidenceAccuracyScore,
  calculateConfidenceCalibrationScore,
  classifyConfidenceAccuracyLevel,
  classifyConfidenceCalibrationStatus,
  evaluateConfidenceCalibration,
} from "./confidenceEvolutionCalibrationScoring.ts";
import { detectConfidenceCalibrationFlags } from "./confidenceEvolutionCalibrationFlags.ts";
import {
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST,
  isConfidenceEvidenceReasonLayerInitialized,
} from "./confidenceEvolutionEvidenceReason.ts";
import { getConfidenceRecordsOrdered } from "./confidenceEvolutionQuery.ts";
import { calculateConfidenceDeltas } from "./confidenceEvolutionDeltas.ts";
import { calculateConfidenceVolatility } from "./confidenceEvolutionVolatility.ts";
import {
  CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_CALIBRATION_FORBIDDEN_PATTERNS,
  CONFIDENCE_EVOLUTION_CALIBRATION_TAGS,
  calibrationFailure,
  calibrationSuccess,
  type BuildConfidenceCalibrationModelInput,
  type ConfidenceEvolutionCalibrationEngineState,
  type ConfidenceEvolutionCalibrationResponse,
} from "./confidenceEvolutionCalibrationTypes.ts";
import {
  validateBuildConfidenceCalibrationModelInput,
  validateConfidenceCalibrationModel as validateCalibrationModelShape,
  validateConfidenceEngineAvailabilityForCalibration,
  validateEvidenceReasonLayerAvailabilityForCalibration,
  validateFoundationCompatibilityForCalibration,
  validateQueryLayerAvailabilityForCalibration,
  validateTrendLayerAvailabilityForCalibration,
} from "./confidenceEvolutionCalibrationValidation.ts";

export const CONFIDENCE_EVOLUTION_CALIBRATION_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...CONFIDENCE_EVOLUTION_CALIBRATION_FORBIDDEN_PATTERNS,
] as const);

export const CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/6",
  title: "Confidence Calibration + Accuracy Layer",
  goal: "Read-only deterministic confidence reliability metadata.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibrationTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibrationRules.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibrationScoring.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibrationFlags.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibrationBuilder.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibrationValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibration.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibrationRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibration.test.ts",
    "docs/app-9-6-confidence-calibration-accuracy.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_CALIBRATION_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-9/1", "APP-9/2", "APP-9/3", "APP-9/4", "APP-9/5"]),
  runtimePath: "library-only" as const,
  tags: CONFIDENCE_EVOLUTION_CALIBRATION_TAGS,
} satisfies StageManifest);

export const CONFIDENCE_EVOLUTION_CALIBRATION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  queryTrendEvidenceDerivedOnly: true,
  noRecordCreation: true,
  noRecordMutation: true,
  noArchiveMutation: true,
  noAiGeneration: true,
  noSemanticReasoning: true,
  noTruthJudgment: true,
  noRecommendations: true,
  noPredictions: true,
  noPersistence: true,
  noVisualization: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  noDecisionJournalIntegration: true,
  noDecisionTimelineIntegration: true,
} as const);

let calibrationLayerInitialized = false;
let calibrationLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeConfidenceCalibrationLayer(
  timestamp: string = calibrationLayerTimestamp
): ConfidenceEvolutionCalibrationEngineState {
  calibrationLayerInitialized = true;
  calibrationLayerTimestamp = timestamp;
  return getConfidenceCalibrationEngineState(timestamp);
}

export function isConfidenceCalibrationLayerInitialized(): boolean {
  return calibrationLayerInitialized;
}

export function getConfidenceCalibrationEngineState(
  timestamp: string = calibrationLayerTimestamp
): ConfidenceEvolutionCalibrationEngineState {
  return Object.freeze({
    engineId: "confidence-evolution-calibration-engine",
    contractVersion: CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
    initialized: calibrationLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetConfidenceCalibrationLayerForTests(): void {
  calibrationLayerInitialized = false;
  calibrationLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertCalibrationLayerReady(): ConfidenceEvolutionCalibrationResponse | null {
  if (!isConfidenceEvolutionPlatformInitialized()) {
    return calibrationFailure("APP-9:1 Confidence Evolution Foundation is not initialized.");
  }
  const engineAvailability = validateConfidenceEngineAvailabilityForCalibration();
  if (!engineAvailability.valid) {
    return calibrationFailure(engineAvailability.issues[0]?.message ?? "APP-9:2 engine unavailable.");
  }
  const queryAvailability = validateQueryLayerAvailabilityForCalibration();
  if (!queryAvailability.valid) {
    return calibrationFailure(queryAvailability.issues[0]?.message ?? "APP-9:3 query layer unavailable.");
  }
  const trendAvailability = validateTrendLayerAvailabilityForCalibration();
  if (!trendAvailability.valid) {
    return calibrationFailure(trendAvailability.issues[0]?.message ?? "APP-9:4 trend layer unavailable.");
  }
  const evidenceReasonAvailability = validateEvidenceReasonLayerAvailabilityForCalibration();
  if (!evidenceReasonAvailability.valid) {
    return calibrationFailure(
      evidenceReasonAvailability.issues[0]?.message ?? "APP-9:5 evidence/reason layer unavailable."
    );
  }
  if (!isConfidenceCalibrationLayerInitialized()) {
    return calibrationFailure("Confidence Calibration + Accuracy Layer is not initialized.");
  }
  return null;
}

function loadOrderedRecords(input: BuildConfidenceCalibrationModelInput) {
  return getConfidenceRecordsOrdered(
    Object.freeze({
      workspaceId: input.workspaceId,
      includeArchived: input.includeArchived ?? false,
      direction: "asc",
    })
  );
}

export function buildConfidenceCalibrationModel(
  input: BuildConfidenceCalibrationModelInput
): ConfidenceEvolutionCalibrationResponse {
  const readiness = assertCalibrationLayerReady();
  if (readiness) {
    return readiness;
  }

  const validation = validateBuildConfidenceCalibrationModelInput(input);
  if (!validation.valid) {
    return calibrationFailure(validation.issues[0]?.message ?? "Calibration model input validation failed.");
  }

  const generatedAt = input.generatedAt ?? calibrationLayerTimestamp;
  const records = loadOrderedRecords(input);
  const model = buildConfidenceCalibrationModelFromRecords(input.workspaceId, records, generatedAt);
  const modelValidation = validateCalibrationModelShape(model);
  if (!modelValidation.valid) {
    return calibrationFailure(modelValidation.issues[0]?.message ?? "Calibration model validation failed.");
  }

  return calibrationSuccess("Confidence calibration model built.", model);
}

export {
  evaluateConfidenceCalibration,
  calculateConfidenceCalibrationScore,
  calculateConfidenceAccuracyScore,
  classifyConfidenceCalibrationStatus,
  classifyConfidenceAccuracyLevel,
  detectConfidenceCalibrationFlags,
};

export function validateConfidenceCalibrationModel(
  input: BuildConfidenceCalibrationModelInput
): ReturnType<typeof validateBuildConfidenceCalibrationModelInput> {
  const issues = [...validateBuildConfidenceCalibrationModelInput(input).issues];
  const foundation = validateFoundationCompatibilityForCalibration(input.generatedAt ?? calibrationLayerTimestamp);
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  const engine = validateConfidenceEngineAvailabilityForCalibration();
  if (!engine.valid) {
    issues.push(...engine.issues);
  }
  const query = validateQueryLayerAvailabilityForCalibration();
  if (!query.valid) {
    issues.push(...query.issues);
  }
  const trend = validateTrendLayerAvailabilityForCalibration();
  if (!trend.valid) {
    issues.push(...trend.issues);
  }
  const evidenceReason = validateEvidenceReasonLayerAvailabilityForCalibration();
  if (!evidenceReason.valid) {
    issues.push(...evidenceReason.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export { runConfidenceCalibrationCertification } from "./confidenceEvolutionCalibrationRunner.ts";

export const CONFIDENCE_EVOLUTION_CALIBRATION_VERSION = CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION;
export const CONFIDENCE_EVOLUTION_CALIBRATION_OWNER = "confidence-evolution-calibration-layer";

export const ConfidenceEvolutionCalibrationLayer = Object.freeze({
  initializeConfidenceCalibrationLayer,
  isConfidenceCalibrationLayerInitialized,
  getConfidenceCalibrationEngineState,
  buildConfidenceCalibrationModel,
  evaluateConfidenceCalibration,
  calculateConfidenceCalibrationScore,
  calculateConfidenceAccuracyScore,
  classifyConfidenceCalibrationStatus,
  classifyConfidenceAccuracyLevel,
  detectConfidenceCalibrationFlags,
  validateConfidenceCalibrationModel,
  version: CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
  tags: CONFIDENCE_EVOLUTION_CALIBRATION_TAGS,
  mustNotOwn: CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
});

export { CONFIDENCE_EVOLUTION_CALIBRATION_TAGS, calculateConfidenceDeltas, calculateConfidenceVolatility };
