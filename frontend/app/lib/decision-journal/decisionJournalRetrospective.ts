/**
 * APP-8:6 — Decision Journal Outcome + Retrospective Layer.
 * Read-only learning metadata over APP-8:3 query and APP-8:5 quality inputs.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_JOURNAL_MUST_NOT_OWN } from "./decisionJournalConstants.ts";
import { isDecisionJournalPlatformInitialized } from "./decisionJournalFoundation.ts";
import { DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST } from "./decisionJournalEvidenceAssumption.ts";
import { getDecisionJournalEntriesOrdered } from "./decisionJournalQuery.ts";
import { calculateOutcomeStatus } from "./decisionJournalOutcomeRules.ts";
import {
  buildDecisionJournalRetrospectiveModelFromEntries,
  evaluateDecisionJournalOutcome,
  evaluateDecisionJournalRetrospective,
} from "./decisionJournalRetrospectiveBuilder.ts";
import {
  calculateAssumptionAccuracy,
  calculateEvidenceReliability,
  calculateReviewCompleteness,
  calculateRiskRealization,
} from "./decisionJournalRetrospectiveRules.ts";
import {
  DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION,
  DECISION_JOURNAL_RETROSPECTIVE_FORBIDDEN_PATTERNS,
  DECISION_JOURNAL_RETROSPECTIVE_TAGS,
  retrospectiveFailure,
  retrospectiveSuccess,
  type BuildDecisionJournalRetrospectiveInput,
  type DecisionJournalRetrospectiveEngineState,
  type DecisionJournalRetrospectiveResponse,
} from "./decisionJournalRetrospectiveTypes.ts";
import {
  validateBuildDecisionJournalRetrospectiveInput,
  validateDecisionJournalRetrospectiveModel,
  validateFoundationCompatibilityForRetrospective,
  validateJournalEngineAvailabilityForRetrospective,
  validateQueryLayerAvailabilityForRetrospective,
  validateReflectionLayerAvailabilityForRetrospective,
  validateEvidenceAssumptionLayerAvailabilityForRetrospective,
} from "./decisionJournalRetrospectiveValidation.ts";

export const DECISION_JOURNAL_RETROSPECTIVE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_JOURNAL_RETROSPECTIVE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/6",
  title: "Decision Journal Outcome + Retrospective Layer",
  goal: "Read-only outcome and retrospective learning metadata over journal entries.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-journal/decisionJournalRetrospectiveTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalOutcomeRules.ts",
    "frontend/app/lib/decision-journal/decisionJournalRetrospectiveRules.ts",
    "frontend/app/lib/decision-journal/decisionJournalRetrospectiveFlags.ts",
    "frontend/app/lib/decision-journal/decisionJournalRetrospectiveBuilder.ts",
    "frontend/app/lib/decision-journal/decisionJournalRetrospectiveValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalRetrospective.ts",
    "frontend/app/lib/decision-journal/decisionJournalRetrospectiveRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalRetrospective.test.ts",
    "docs/app-8-6-decision-journal-outcome-retrospective.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_RETROSPECTIVE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-8/1", "APP-8/2", "APP-8/3", "APP-8/4", "APP-8/5"]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_RETROSPECTIVE_TAGS,
} satisfies StageManifest);

export const DECISION_JOURNAL_RETROSPECTIVE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  queryAndQualityDerivedOnly: true,
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

let retrospectiveLayerInitialized = false;
let retrospectiveLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionJournalRetrospectiveLayer(
  timestamp: string = retrospectiveLayerTimestamp
): DecisionJournalRetrospectiveEngineState {
  retrospectiveLayerInitialized = true;
  retrospectiveLayerTimestamp = timestamp;
  return getDecisionJournalRetrospectiveEngineState(timestamp);
}

export function isDecisionJournalRetrospectiveLayerInitialized(): boolean {
  return retrospectiveLayerInitialized;
}

export function getDecisionJournalRetrospectiveEngineState(
  timestamp: string = retrospectiveLayerTimestamp
): DecisionJournalRetrospectiveEngineState {
  return Object.freeze({
    engineId: "decision-journal-retrospective-engine",
    contractVersion: DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION,
    initialized: retrospectiveLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionJournalRetrospectiveLayerForTests(): void {
  retrospectiveLayerInitialized = false;
  retrospectiveLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertRetrospectiveLayerReady(): DecisionJournalRetrospectiveResponse | null {
  if (!isDecisionJournalPlatformInitialized()) {
    return retrospectiveFailure("APP-8:1 Decision Journal Foundation is not initialized.");
  }
  const engineAvailability = validateJournalEngineAvailabilityForRetrospective();
  if (!engineAvailability.valid) {
    return retrospectiveFailure(engineAvailability.issues[0]?.message ?? "APP-8:2 engine unavailable.");
  }
  const queryAvailability = validateQueryLayerAvailabilityForRetrospective();
  if (!queryAvailability.valid) {
    return retrospectiveFailure(queryAvailability.issues[0]?.message ?? "APP-8:3 query layer unavailable.");
  }
  const reflectionAvailability = validateReflectionLayerAvailabilityForRetrospective();
  if (!reflectionAvailability.valid) {
    return retrospectiveFailure(reflectionAvailability.issues[0]?.message ?? "APP-8:4 reflection layer unavailable.");
  }
  const qualityAvailability = validateEvidenceAssumptionLayerAvailabilityForRetrospective();
  if (!qualityAvailability.valid) {
    return retrospectiveFailure(
      qualityAvailability.issues[0]?.message ?? "APP-8:5 evidence/assumption layer unavailable."
    );
  }
  if (!isDecisionJournalRetrospectiveLayerInitialized()) {
    return retrospectiveFailure("Decision Journal Retrospective Layer is not initialized.");
  }
  return null;
}

export function buildDecisionJournalRetrospectiveModel(
  input: BuildDecisionJournalRetrospectiveInput
): DecisionJournalRetrospectiveResponse {
  const readiness = assertRetrospectiveLayerReady();
  if (readiness) {
    return readiness;
  }

  const inputValidation = validateBuildDecisionJournalRetrospectiveInput(input);
  if (!inputValidation.valid) {
    return retrospectiveFailure(inputValidation.issues[0]?.message ?? "Retrospective input validation failed.");
  }

  const includeArchived = input.includeArchived ?? false;
  const entries = getDecisionJournalEntriesOrdered(
    Object.freeze({
      workspaceId: input.workspaceId,
      includeArchived,
    })
  );

  const model = buildDecisionJournalRetrospectiveModelFromEntries(entries, {
    workspaceId: input.workspaceId,
    generatedAt: input.generatedAt ?? retrospectiveLayerTimestamp,
    includeArchived,
  });

  const modelValidation = validateDecisionJournalRetrospectiveModel(model);
  if (!modelValidation.valid) {
    return retrospectiveFailure(modelValidation.issues[0]?.message ?? "Retrospective model validation failed.");
  }

  return retrospectiveSuccess("Decision journal retrospective model built.", model);
}

export {
  evaluateDecisionJournalOutcome,
  evaluateDecisionJournalRetrospective,
  calculateOutcomeStatus,
  calculateAssumptionAccuracy,
  calculateRiskRealization,
  calculateEvidenceReliability,
  calculateReviewCompleteness,
  validateDecisionJournalRetrospectiveModel,
};

export { runDecisionJournalRetrospectiveCertification } from "./decisionJournalRetrospectiveRunner.ts";

export const DECISION_JOURNAL_RETROSPECTIVE_VERSION = DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION;
export const DECISION_JOURNAL_RETROSPECTIVE_OWNER = "decision-journal-retrospective-layer";

export const DecisionJournalRetrospectiveLayer = Object.freeze({
  initializeDecisionJournalRetrospectiveLayer,
  isDecisionJournalRetrospectiveLayerInitialized,
  getDecisionJournalRetrospectiveEngineState,
  buildDecisionJournalRetrospectiveModel,
  evaluateDecisionJournalOutcome,
  evaluateDecisionJournalRetrospective,
  calculateOutcomeStatus,
  calculateAssumptionAccuracy,
  calculateRiskRealization,
  calculateEvidenceReliability,
  calculateReviewCompleteness,
  validateDecisionJournalRetrospectiveModel,
  version: DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION,
  tags: DECISION_JOURNAL_RETROSPECTIVE_TAGS,
  mustNotOwn: DECISION_JOURNAL_MUST_NOT_OWN,
});

export { DECISION_JOURNAL_RETROSPECTIVE_TAGS };
