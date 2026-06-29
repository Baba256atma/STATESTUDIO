/**
 * APP-8:5 — Decision Journal Evidence + Assumption Layer.
 * Read-only reasoning-quality metadata over APP-8:3 query and APP-8:4 reflection inputs.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_JOURNAL_MUST_NOT_OWN } from "./decisionJournalConstants.ts";
import { isDecisionJournalPlatformInitialized } from "./decisionJournalFoundation.ts";
import { DECISION_JOURNAL_REFLECTION_SELF_MANIFEST } from "./decisionJournalReflection.ts";
import { getDecisionJournalEntriesOrdered } from "./decisionJournalQuery.ts";
import {
  buildDecisionJournalEvidenceAssumptionModelFromEntries,
  evaluateDecisionJournalAssumptions,
  evaluateDecisionJournalEvidence,
} from "./decisionJournalEvidenceAssumptionBuilder.ts";
import { calculateAssumptionCoverage } from "./decisionJournalAssumptionRules.ts";
import { calculateEvidenceStrength } from "./decisionJournalEvidenceRules.ts";
import { detectReasoningQualityFlags } from "./decisionJournalQualityFlags.ts";
import {
  DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
  DECISION_JOURNAL_EVIDENCE_ASSUMPTION_FORBIDDEN_PATTERNS,
  DECISION_JOURNAL_EVIDENCE_ASSUMPTION_TAGS,
  evidenceAssumptionFailure,
  evidenceAssumptionSuccess,
  type BuildDecisionJournalEvidenceAssumptionInput,
  type DecisionJournalEvidenceAssumptionEngineState,
  type DecisionJournalEvidenceAssumptionResponse,
} from "./decisionJournalEvidenceAssumptionTypes.ts";
import {
  validateBuildDecisionJournalEvidenceAssumptionInput,
  validateDecisionJournalEvidenceAssumptionModel,
  validateFoundationCompatibilityForEvidenceAssumption,
  validateJournalEngineAvailabilityForEvidenceAssumption,
  validateQueryLayerAvailabilityForEvidenceAssumption,
  validateReflectionLayerAvailabilityForEvidenceAssumption,
} from "./decisionJournalEvidenceAssumptionValidation.ts";

export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_JOURNAL_EVIDENCE_ASSUMPTION_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/5",
  title: "Decision Journal Evidence + Assumption Layer",
  goal: "Read-only reasoning-quality metadata for evidence strength and assumption coverage.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_JOURNAL_REFLECTION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumptionTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalEvidenceRules.ts",
    "frontend/app/lib/decision-journal/decisionJournalAssumptionRules.ts",
    "frontend/app/lib/decision-journal/decisionJournalQualityFlags.ts",
    "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumptionBuilder.ts",
    "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumptionValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumption.ts",
    "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumptionRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumption.test.ts",
    "docs/app-8-5-decision-journal-evidence-assumption.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-8/1", "APP-8/2", "APP-8/3", "APP-8/4"]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_TAGS,
} satisfies StageManifest);

export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  queryAndReflectionDerivedOnly: true,
  noEntryCreation: true,
  noEntryMutation: true,
  noArchiveMutation: true,
  noAiGeneration: true,
  noRecommendations: true,
  noPredictions: true,
  noPersistence: true,
  noVisualization: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  noDecisionTimelineIntegration: true,
} as const);

let evidenceAssumptionLayerInitialized = false;
let evidenceAssumptionLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionJournalEvidenceAssumptionLayer(
  timestamp: string = evidenceAssumptionLayerTimestamp
): DecisionJournalEvidenceAssumptionEngineState {
  evidenceAssumptionLayerInitialized = true;
  evidenceAssumptionLayerTimestamp = timestamp;
  return getDecisionJournalEvidenceAssumptionEngineState(timestamp);
}

export function isDecisionJournalEvidenceAssumptionLayerInitialized(): boolean {
  return evidenceAssumptionLayerInitialized;
}

export function getDecisionJournalEvidenceAssumptionEngineState(
  timestamp: string = evidenceAssumptionLayerTimestamp
): DecisionJournalEvidenceAssumptionEngineState {
  return Object.freeze({
    engineId: "decision-journal-evidence-assumption-engine",
    contractVersion: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
    initialized: evidenceAssumptionLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionJournalEvidenceAssumptionLayerForTests(): void {
  evidenceAssumptionLayerInitialized = false;
  evidenceAssumptionLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertEvidenceAssumptionLayerReady(): DecisionJournalEvidenceAssumptionResponse | null {
  if (!isDecisionJournalPlatformInitialized()) {
    return evidenceAssumptionFailure("APP-8:1 Decision Journal Foundation is not initialized.");
  }
  const engineAvailability = validateJournalEngineAvailabilityForEvidenceAssumption();
  if (!engineAvailability.valid) {
    return evidenceAssumptionFailure(engineAvailability.issues[0]?.message ?? "APP-8:2 engine unavailable.");
  }
  const queryAvailability = validateQueryLayerAvailabilityForEvidenceAssumption();
  if (!queryAvailability.valid) {
    return evidenceAssumptionFailure(queryAvailability.issues[0]?.message ?? "APP-8:3 query layer unavailable.");
  }
  const reflectionAvailability = validateReflectionLayerAvailabilityForEvidenceAssumption();
  if (!reflectionAvailability.valid) {
    return evidenceAssumptionFailure(
      reflectionAvailability.issues[0]?.message ?? "APP-8:4 reflection layer unavailable."
    );
  }
  if (!isDecisionJournalEvidenceAssumptionLayerInitialized()) {
    return evidenceAssumptionFailure("Decision Journal Evidence + Assumption Layer is not initialized.");
  }
  return null;
}

export function buildDecisionJournalEvidenceAssumptionModel(
  input: BuildDecisionJournalEvidenceAssumptionInput
): DecisionJournalEvidenceAssumptionResponse {
  const readiness = assertEvidenceAssumptionLayerReady();
  if (readiness) {
    return readiness;
  }

  const inputValidation = validateBuildDecisionJournalEvidenceAssumptionInput(input);
  if (!inputValidation.valid) {
    return evidenceAssumptionFailure(inputValidation.issues[0]?.message ?? "Evidence/assumption input validation failed.");
  }

  const includeArchived = input.includeArchived ?? false;
  const entries = getDecisionJournalEntriesOrdered(
    Object.freeze({
      workspaceId: input.workspaceId,
      includeArchived,
    })
  );

  const model = buildDecisionJournalEvidenceAssumptionModelFromEntries(entries, {
    workspaceId: input.workspaceId,
    generatedAt: input.generatedAt ?? evidenceAssumptionLayerTimestamp,
    includeArchived,
  });

  const modelValidation = validateDecisionJournalEvidenceAssumptionModel(model);
  if (!modelValidation.valid) {
    return evidenceAssumptionFailure(modelValidation.issues[0]?.message ?? "Evidence/assumption model validation failed.");
  }

  return evidenceAssumptionSuccess("Decision journal evidence + assumption model built.", model);
}

export {
  evaluateDecisionJournalEvidence,
  evaluateDecisionJournalAssumptions,
  calculateEvidenceStrength,
  calculateAssumptionCoverage,
  detectReasoningQualityFlags,
  validateDecisionJournalEvidenceAssumptionModel,
};

export { runDecisionJournalEvidenceAssumptionCertification } from "./decisionJournalEvidenceAssumptionRunner.ts";

export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_VERSION = DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION;
export const DECISION_JOURNAL_EVIDENCE_ASSUMPTION_OWNER = "decision-journal-evidence-assumption-layer";

export const DecisionJournalEvidenceAssumptionLayer = Object.freeze({
  initializeDecisionJournalEvidenceAssumptionLayer,
  isDecisionJournalEvidenceAssumptionLayerInitialized,
  getDecisionJournalEvidenceAssumptionEngineState,
  buildDecisionJournalEvidenceAssumptionModel,
  evaluateDecisionJournalEvidence,
  evaluateDecisionJournalAssumptions,
  calculateEvidenceStrength,
  calculateAssumptionCoverage,
  detectReasoningQualityFlags,
  validateDecisionJournalEvidenceAssumptionModel,
  version: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
  tags: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_TAGS,
  mustNotOwn: DECISION_JOURNAL_MUST_NOT_OWN,
});

export { DECISION_JOURNAL_EVIDENCE_ASSUMPTION_TAGS };
