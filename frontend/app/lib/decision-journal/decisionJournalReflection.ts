/**
 * APP-8:4 — Decision Journal Insight + Reflection Layer.
 * Read-only structural reflection over APP-8:3 query results.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_JOURNAL_MUST_NOT_OWN } from "./decisionJournalConstants.ts";
import { isDecisionJournalPlatformInitialized } from "./decisionJournalFoundation.ts";
import { DECISION_JOURNAL_QUERY_SELF_MANIFEST } from "./decisionJournalQuery.ts";
import { getDecisionJournalEntriesOrdered } from "./decisionJournalQuery.ts";
import { buildDecisionJournalReflectionModelFromEntries } from "./decisionJournalReflectionBuilder.ts";
import {
  extractAssumptionPatterns,
  extractDecisionJournalInsights,
  extractRiskPatterns,
  summarizeDecisionJournalConfidence,
  summarizeDecisionJournalEvidence,
  summarizeDecisionJournalReviews,
} from "./decisionJournalInsightExtraction.ts";
import {
  DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
  DECISION_JOURNAL_REFLECTION_FORBIDDEN_PATTERNS,
  DECISION_JOURNAL_REFLECTION_TAGS,
  reflectionFailure,
  reflectionSuccess,
  type BuildDecisionJournalReflectionInput,
  type DecisionJournalReflectionEngineState,
  type DecisionJournalReflectionResponse,
} from "./decisionJournalReflectionTypes.ts";
import {
  validateBuildDecisionJournalReflectionInput,
  validateDecisionJournalReflectionModel,
  validateFoundationCompatibilityForReflection,
  validateJournalEngineAvailabilityForReflection,
  validateQueryLayerAvailabilityForReflection,
} from "./decisionJournalReflectionValidation.ts";

export const DECISION_JOURNAL_REFLECTION_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_JOURNAL_REFLECTION_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_JOURNAL_REFLECTION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/4",
  title: "Decision Journal Insight + Reflection Layer",
  goal: "Read-only structural reflection metadata over APP-8:3 journal query results.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_JOURNAL_QUERY_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-journal/decisionJournalReflectionTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalReflectionRules.ts",
    "frontend/app/lib/decision-journal/decisionJournalInsightExtraction.ts",
    "frontend/app/lib/decision-journal/decisionJournalReflectionBuilder.ts",
    "frontend/app/lib/decision-journal/decisionJournalReflectionValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalReflection.ts",
    "frontend/app/lib/decision-journal/decisionJournalReflectionRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalReflection.test.ts",
    "docs/app-8-4-decision-journal-insight-reflection.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_REFLECTION_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-8/1", "APP-8/2", "APP-8/3"]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_REFLECTION_TAGS,
} satisfies StageManifest);

export const DECISION_JOURNAL_REFLECTION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  queryDerivedOnly: true,
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

let reflectionLayerInitialized = false;
let reflectionLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionJournalReflectionLayer(
  timestamp: string = reflectionLayerTimestamp
): DecisionJournalReflectionEngineState {
  reflectionLayerInitialized = true;
  reflectionLayerTimestamp = timestamp;
  return getDecisionJournalReflectionEngineState(timestamp);
}

export function isDecisionJournalReflectionLayerInitialized(): boolean {
  return reflectionLayerInitialized;
}

export function getDecisionJournalReflectionEngineState(
  timestamp: string = reflectionLayerTimestamp
): DecisionJournalReflectionEngineState {
  return Object.freeze({
    engineId: "decision-journal-reflection-engine",
    contractVersion: DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
    initialized: reflectionLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionJournalReflectionLayerForTests(): void {
  reflectionLayerInitialized = false;
  reflectionLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertReflectionLayerReady(): DecisionJournalReflectionResponse | null {
  if (!isDecisionJournalPlatformInitialized()) {
    return reflectionFailure("APP-8:1 Decision Journal Foundation is not initialized.");
  }
  const engineAvailability = validateJournalEngineAvailabilityForReflection();
  if (!engineAvailability.valid) {
    return reflectionFailure(engineAvailability.issues[0]?.message ?? "APP-8:2 engine unavailable.");
  }
  const queryAvailability = validateQueryLayerAvailabilityForReflection();
  if (!queryAvailability.valid) {
    return reflectionFailure(queryAvailability.issues[0]?.message ?? "APP-8:3 query layer unavailable.");
  }
  if (!isDecisionJournalReflectionLayerInitialized()) {
    return reflectionFailure("Decision Journal Reflection Layer is not initialized.");
  }
  return null;
}

export function buildDecisionJournalReflectionModel(
  input: BuildDecisionJournalReflectionInput
): DecisionJournalReflectionResponse {
  const readiness = assertReflectionLayerReady();
  if (readiness) {
    return readiness;
  }

  const inputValidation = validateBuildDecisionJournalReflectionInput(input);
  if (!inputValidation.valid) {
    return reflectionFailure(inputValidation.issues[0]?.message ?? "Reflection input validation failed.");
  }

  const includeArchived = input.includeArchived ?? false;
  const entries = getDecisionJournalEntriesOrdered(
    Object.freeze({
      workspaceId: input.workspaceId,
      includeArchived,
    })
  );

  const model = buildDecisionJournalReflectionModelFromEntries(entries, {
    workspaceId: input.workspaceId,
    generatedAt: input.generatedAt ?? reflectionLayerTimestamp,
    includeArchived,
  });

  const modelValidation = validateDecisionJournalReflectionModel(model);
  if (!modelValidation.valid) {
    return reflectionFailure(modelValidation.issues[0]?.message ?? "Reflection model validation failed.");
  }

  return reflectionSuccess("Decision journal reflection model built.", model);
}

export {
  extractDecisionJournalInsights,
  extractAssumptionPatterns,
  extractRiskPatterns,
  summarizeDecisionJournalEvidence,
  summarizeDecisionJournalConfidence,
  summarizeDecisionJournalReviews,
  validateDecisionJournalReflectionModel,
};

export { runDecisionJournalReflectionCertification } from "./decisionJournalReflectionRunner.ts";

export const DECISION_JOURNAL_REFLECTION_VERSION = DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION;
export const DECISION_JOURNAL_REFLECTION_OWNER = "decision-journal-reflection-layer";

export const DecisionJournalReflectionLayer = Object.freeze({
  initializeDecisionJournalReflectionLayer,
  isDecisionJournalReflectionLayerInitialized,
  getDecisionJournalReflectionEngineState,
  buildDecisionJournalReflectionModel,
  extractDecisionJournalInsights,
  extractAssumptionPatterns,
  extractRiskPatterns,
  summarizeDecisionJournalEvidence,
  summarizeDecisionJournalConfidence,
  summarizeDecisionJournalReviews,
  validateDecisionJournalReflectionModel,
  version: DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
  tags: DECISION_JOURNAL_REFLECTION_TAGS,
  mustNotOwn: DECISION_JOURNAL_MUST_NOT_OWN,
});

export { DECISION_JOURNAL_REFLECTION_TAGS };
