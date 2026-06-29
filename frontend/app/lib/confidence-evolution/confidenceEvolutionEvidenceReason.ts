/**
 * APP-9:5 — Confidence Evidence + Reason Link Layer.
 * Read-only explanation-link metadata over APP-9:3 query and APP-9:4 trend inputs.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CONFIDENCE_EVOLUTION_MUST_NOT_OWN } from "./confidenceEvolutionConstants.ts";
import { isConfidenceEvolutionPlatformInitialized } from "./confidenceEvolutionFoundation.ts";
import {
  buildConfidenceEvidenceReasonLinkModelFromRecords,
  calculateConfidenceEvidenceCoverage,
} from "./confidenceEvolutionEvidenceReasonBuilder.ts";
import { detectConfidenceExplanationFlags } from "./confidenceEvolutionExplanationFlags.ts";
import { buildConfidenceEvidenceLinks } from "./confidenceEvolutionEvidenceLinks.ts";
import {
  buildMovementExplanationLinks,
  buildSourceLinks,
  mapConfidenceMovementsToEvidence,
  mapConfidenceMovementsToReasons,
} from "./confidenceEvolutionMovementMapping.ts";
import { buildConfidenceReasonLinks } from "./confidenceEvolutionReasonLinks.ts";
import {
  CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST,
  isConfidenceEvolutionTrendLayerInitialized,
} from "./confidenceEvolutionTrend.ts";
import { calculateConfidenceDeltas } from "./confidenceEvolutionDeltas.ts";
import {
  getConfidenceRecordsOrdered,
  isConfidenceEvolutionQueryLayerInitialized,
} from "./confidenceEvolutionQuery.ts";
import {
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_FORBIDDEN_PATTERNS,
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_TAGS,
  evidenceReasonFailure,
  evidenceReasonSuccess,
  type BuildConfidenceEvidenceReasonLinkInput,
  type ConfidenceEvolutionEvidenceReasonEngineState,
  type ConfidenceEvolutionEvidenceReasonResponse,
} from "./confidenceEvolutionEvidenceReasonTypes.ts";
import {
  validateBuildConfidenceEvidenceReasonLinkInput,
  validateConfidenceEngineAvailabilityForEvidenceReason,
  validateConfidenceEvidenceReasonLinkModel as validateLinkModelShape,
  validateFoundationCompatibilityForEvidenceReason,
  validateQueryLayerAvailabilityForEvidenceReason,
  validateTrendLayerAvailabilityForEvidenceReason,
} from "./confidenceEvolutionEvidenceReasonValidation.ts";

export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...CONFIDENCE_EVOLUTION_EVIDENCE_REASON_FORBIDDEN_PATTERNS,
] as const);

export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/5",
  title: "Confidence Evidence + Reason Link Layer",
  goal: "Read-only deterministic explanation-link metadata for confidence reasons and evidence.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReasonTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReasonRules.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionReasonLinks.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceLinks.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionMovementMapping.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionExplanationFlags.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReasonBuilder.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReasonValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReason.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReasonRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReason.test.ts",
    "docs/app-9-5-confidence-evidence-reason-link.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-9/1", "APP-9/2", "APP-9/3", "APP-9/4"]),
  runtimePath: "library-only" as const,
  tags: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_TAGS,
} satisfies StageManifest);

export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  queryAndTrendDerivedOnly: true,
  noRecordCreation: true,
  noRecordMutation: true,
  noArchiveMutation: true,
  noAiGeneration: true,
  noSemanticReasoning: true,
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

let evidenceReasonLayerInitialized = false;
let evidenceReasonLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeConfidenceEvidenceReasonLayer(
  timestamp: string = evidenceReasonLayerTimestamp
): ConfidenceEvolutionEvidenceReasonEngineState {
  evidenceReasonLayerInitialized = true;
  evidenceReasonLayerTimestamp = timestamp;
  return getConfidenceEvidenceReasonEngineState(timestamp);
}

export function isConfidenceEvidenceReasonLayerInitialized(): boolean {
  return evidenceReasonLayerInitialized;
}

export function getConfidenceEvidenceReasonEngineState(
  timestamp: string = evidenceReasonLayerTimestamp
): ConfidenceEvolutionEvidenceReasonEngineState {
  return Object.freeze({
    engineId: "confidence-evolution-evidence-reason-engine",
    contractVersion: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
    initialized: evidenceReasonLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetConfidenceEvidenceReasonLayerForTests(): void {
  evidenceReasonLayerInitialized = false;
  evidenceReasonLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertEvidenceReasonLayerReady(): ConfidenceEvolutionEvidenceReasonResponse | null {
  if (!isConfidenceEvolutionPlatformInitialized()) {
    return evidenceReasonFailure("APP-9:1 Confidence Evolution Foundation is not initialized.");
  }
  const engineAvailability = validateConfidenceEngineAvailabilityForEvidenceReason();
  if (!engineAvailability.valid) {
    return evidenceReasonFailure(engineAvailability.issues[0]?.message ?? "APP-9:2 engine unavailable.");
  }
  const queryAvailability = validateQueryLayerAvailabilityForEvidenceReason();
  if (!queryAvailability.valid) {
    return evidenceReasonFailure(queryAvailability.issues[0]?.message ?? "APP-9:3 query layer unavailable.");
  }
  const trendAvailability = validateTrendLayerAvailabilityForEvidenceReason();
  if (!trendAvailability.valid) {
    return evidenceReasonFailure(trendAvailability.issues[0]?.message ?? "APP-9:4 trend layer unavailable.");
  }
  if (!isConfidenceEvidenceReasonLayerInitialized()) {
    return evidenceReasonFailure("Confidence Evidence + Reason Link Layer is not initialized.");
  }
  return null;
}

function loadOrderedRecords(input: BuildConfidenceEvidenceReasonLinkInput) {
  return getConfidenceRecordsOrdered(
    Object.freeze({
      workspaceId: input.workspaceId,
      includeArchived: input.includeArchived ?? false,
      direction: "asc",
    })
  );
}

export function buildConfidenceEvidenceReasonLinkModel(
  input: BuildConfidenceEvidenceReasonLinkInput
): ConfidenceEvolutionEvidenceReasonResponse {
  const readiness = assertEvidenceReasonLayerReady();
  if (readiness) {
    return readiness;
  }

  const validation = validateBuildConfidenceEvidenceReasonLinkInput(input);
  if (!validation.valid) {
    return evidenceReasonFailure(validation.issues[0]?.message ?? "Link model input validation failed.");
  }

  const generatedAt = input.generatedAt ?? evidenceReasonLayerTimestamp;
  const records = loadOrderedRecords(input);
  const model = buildConfidenceEvidenceReasonLinkModelFromRecords(input.workspaceId, records, generatedAt);
  const modelValidation = validateLinkModelShape(model);
  if (!modelValidation.valid) {
    return evidenceReasonFailure(modelValidation.issues[0]?.message ?? "Link model validation failed.");
  }

  return evidenceReasonSuccess("Confidence evidence + reason link model built.", model);
}

export {
  buildConfidenceReasonLinks,
  buildConfidenceEvidenceLinks,
  mapConfidenceMovementsToReasons,
  mapConfidenceMovementsToEvidence,
  calculateConfidenceEvidenceCoverage,
  detectConfidenceExplanationFlags,
};

export function validateConfidenceEvidenceReasonLinkModel(
  input: BuildConfidenceEvidenceReasonLinkInput
): ReturnType<typeof validateBuildConfidenceEvidenceReasonLinkInput> {
  const issues = [...validateBuildConfidenceEvidenceReasonLinkInput(input).issues];
  const foundation = validateFoundationCompatibilityForEvidenceReason(input.generatedAt ?? evidenceReasonLayerTimestamp);
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  const engine = validateConfidenceEngineAvailabilityForEvidenceReason();
  if (!engine.valid) {
    issues.push(...engine.issues);
  }
  const query = validateQueryLayerAvailabilityForEvidenceReason();
  if (!query.valid) {
    issues.push(...query.issues);
  }
  const trend = validateTrendLayerAvailabilityForEvidenceReason();
  if (!trend.valid) {
    issues.push(...trend.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export { runConfidenceEvidenceReasonCertification } from "./confidenceEvolutionEvidenceReasonRunner.ts";

export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_VERSION = CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION;
export const CONFIDENCE_EVOLUTION_EVIDENCE_REASON_OWNER = "confidence-evolution-evidence-reason-layer";

export const ConfidenceEvolutionEvidenceReasonLayer = Object.freeze({
  initializeConfidenceEvidenceReasonLayer,
  isConfidenceEvidenceReasonLayerInitialized,
  getConfidenceEvidenceReasonEngineState,
  buildConfidenceEvidenceReasonLinkModel,
  buildConfidenceReasonLinks,
  buildConfidenceEvidenceLinks,
  mapConfidenceMovementsToReasons,
  mapConfidenceMovementsToEvidence,
  calculateConfidenceEvidenceCoverage,
  detectConfidenceExplanationFlags,
  validateConfidenceEvidenceReasonLinkModel,
  version: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
  tags: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_TAGS,
  mustNotOwn: CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
});

export { CONFIDENCE_EVOLUTION_EVIDENCE_REASON_TAGS, calculateConfidenceDeltas, buildSourceLinks, buildMovementExplanationLinks };
