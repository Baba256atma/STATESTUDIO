/**
 * APP-9:4 — Confidence Trend + Volatility Layer.
 * Read-only historical movement metadata over APP-9:3 query results.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CONFIDENCE_EVOLUTION_MUST_NOT_OWN } from "./confidenceEvolutionConstants.ts";
import { isConfidenceEvolutionPlatformInitialized } from "./confidenceEvolutionFoundation.ts";
import {
  calculateAverageAbsoluteDelta,
  calculateConfidenceDeltas,
  calculateTotalDelta,
} from "./confidenceEvolutionDeltas.ts";
import {
  detectConfidenceDrops,
  detectConfidencePeaks,
  detectConfidenceRecoveries,
} from "./confidenceEvolutionMovementDetection.ts";
import {
  CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST,
  getConfidenceRecordsOrdered,
  isConfidenceEvolutionQueryLayerInitialized,
} from "./confidenceEvolutionQuery.ts";
import {
  classifyConfidenceStability,
  classifyConfidenceTrendDirection,
} from "./confidenceEvolutionTrendClassification.ts";
import { buildConfidenceTrendModelFromRecords } from "./confidenceEvolutionTrendBuilder.ts";
import {
  calculateConfidenceVolatility,
  classifyConfidenceVolatilityLevel,
} from "./confidenceEvolutionVolatility.ts";
import {
  CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_TREND_FORBIDDEN_PATTERNS,
  CONFIDENCE_EVOLUTION_TREND_TAGS,
  trendFailure,
  trendSuccess,
  type BuildConfidenceTrendModelInput,
  type ConfidenceEvolutionEngineRecord,
  type ConfidenceEvolutionTrendEngineState,
  type ConfidenceEvolutionTrendModel,
  type ConfidenceEvolutionTrendResponse,
} from "./confidenceEvolutionTrendTypes.ts";
import {
  validateBuildConfidenceTrendModelInput,
  validateConfidenceEngineAvailabilityForTrend,
  validateConfidenceTrendModel as validateTrendModelShape,
  validateFoundationCompatibilityForTrend,
  validateQueryLayerAvailabilityForTrend,
} from "./confidenceEvolutionTrendValidation.ts";

export const CONFIDENCE_EVOLUTION_TREND_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...CONFIDENCE_EVOLUTION_TREND_FORBIDDEN_PATTERNS,
] as const);

export const CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/4",
  title: "Confidence Trend + Volatility Layer",
  goal: "Read-only deterministic confidence movement metadata over ordered query results.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTrendTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTrendRules.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionDeltas.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionVolatility.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTrendClassification.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionMovementDetection.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTrendBuilder.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTrendValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTrend.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTrendRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionTrend.test.ts",
    "docs/app-9-4-confidence-trend-volatility.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_TREND_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-9/1", "APP-9/2", "APP-9/3"]),
  runtimePath: "library-only" as const,
  tags: CONFIDENCE_EVOLUTION_TREND_TAGS,
} satisfies StageManifest);

export const CONFIDENCE_EVOLUTION_TREND_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  queryDerivedOnly: true,
  noRecordCreation: true,
  noRecordMutation: true,
  noArchiveMutation: true,
  noAiGeneration: true,
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

let trendLayerInitialized = false;
let trendLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeConfidenceEvolutionTrendLayer(
  timestamp: string = trendLayerTimestamp
): ConfidenceEvolutionTrendEngineState {
  trendLayerInitialized = true;
  trendLayerTimestamp = timestamp;
  return getConfidenceEvolutionTrendEngineState(timestamp);
}

export function isConfidenceEvolutionTrendLayerInitialized(): boolean {
  return trendLayerInitialized;
}

export function getConfidenceEvolutionTrendEngineState(
  timestamp: string = trendLayerTimestamp
): ConfidenceEvolutionTrendEngineState {
  return Object.freeze({
    engineId: "confidence-evolution-trend-engine",
    contractVersion: CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION,
    initialized: trendLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetConfidenceEvolutionTrendLayerForTests(): void {
  trendLayerInitialized = false;
  trendLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertTrendLayerReady(): ConfidenceEvolutionTrendResponse | null {
  if (!isConfidenceEvolutionPlatformInitialized()) {
    return trendFailure("APP-9:1 Confidence Evolution Foundation is not initialized.");
  }
  const engineAvailability = validateConfidenceEngineAvailabilityForTrend();
  if (!engineAvailability.valid) {
    return trendFailure(engineAvailability.issues[0]?.message ?? "APP-9:2 engine unavailable.");
  }
  const queryAvailability = validateQueryLayerAvailabilityForTrend();
  if (!queryAvailability.valid) {
    return trendFailure(queryAvailability.issues[0]?.message ?? "APP-9:3 query layer unavailable.");
  }
  if (!isConfidenceEvolutionTrendLayerInitialized()) {
    return trendFailure("Confidence Evolution Trend Layer is not initialized.");
  }
  return null;
}

function loadOrderedRecords(input: BuildConfidenceTrendModelInput): readonly ConfidenceEvolutionEngineRecord[] {
  return getConfidenceRecordsOrdered(
    Object.freeze({
      workspaceId: input.workspaceId,
      includeArchived: input.includeArchived ?? false,
      direction: "asc",
    })
  );
}

export function buildConfidenceTrendModel(
  input: BuildConfidenceTrendModelInput
): ConfidenceEvolutionTrendResponse {
  const readiness = assertTrendLayerReady();
  if (readiness) {
    return readiness;
  }

  const validation = validateBuildConfidenceTrendModelInput(input);
  if (!validation.valid) {
    return trendFailure(validation.issues[0]?.message ?? "Trend model input validation failed.");
  }

  const generatedAt = input.generatedAt ?? trendLayerTimestamp;
  const records = loadOrderedRecords(input);
  const model = buildConfidenceTrendModelFromRecords(input.workspaceId, records, generatedAt);
  const modelValidation = validateTrendModelShape(model);
  if (!modelValidation.valid) {
    return trendFailure(modelValidation.issues[0]?.message ?? "Trend model validation failed.");
  }

  return trendSuccess("Confidence trend model built.", model);
}

export { calculateConfidenceDeltas, calculateTotalDelta, calculateAverageAbsoluteDelta };
export { classifyConfidenceTrendDirection, classifyConfidenceStability };
export { calculateConfidenceVolatility, classifyConfidenceVolatilityLevel };
export { detectConfidencePeaks, detectConfidenceDrops, detectConfidenceRecoveries };

export function validateConfidenceTrendModel(
  input: BuildConfidenceTrendModelInput
): ReturnType<typeof validateBuildConfidenceTrendModelInput> {
  const issues = [...validateBuildConfidenceTrendModelInput(input).issues];
  const foundation = validateFoundationCompatibilityForTrend(input.generatedAt ?? trendLayerTimestamp);
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  const engine = validateConfidenceEngineAvailabilityForTrend();
  if (!engine.valid) {
    issues.push(...engine.issues);
  }
  const query = validateQueryLayerAvailabilityForTrend();
  if (!query.valid) {
    issues.push(...query.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export { runConfidenceTrendCertification } from "./confidenceEvolutionTrendRunner.ts";

export const CONFIDENCE_EVOLUTION_TREND_VERSION = CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION;
export const CONFIDENCE_EVOLUTION_TREND_OWNER = "confidence-evolution-trend-layer";

export const ConfidenceEvolutionTrendLayer = Object.freeze({
  initializeConfidenceEvolutionTrendLayer,
  isConfidenceEvolutionTrendLayerInitialized,
  getConfidenceEvolutionTrendEngineState,
  buildConfidenceTrendModel,
  calculateConfidenceDeltas,
  classifyConfidenceTrendDirection,
  calculateConfidenceVolatility,
  classifyConfidenceStability,
  detectConfidencePeaks,
  detectConfidenceDrops,
  detectConfidenceRecoveries,
  validateConfidenceTrendModel,
  version: CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION,
  tags: CONFIDENCE_EVOLUTION_TREND_TAGS,
  mustNotOwn: CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
});

export { CONFIDENCE_EVOLUTION_TREND_TAGS };
