/**
 * APP-10:4 — Outcome Learning Engine.
 * Deterministic historical outcome learning from completed scenarios.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CROSS_SCENARIO_LEARNING_MUST_NOT_OWN, CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION } from "./crossScenarioLearningConstants.ts";
import { isCrossScenarioLearningPlatformInitialized } from "./crossScenarioLearningFoundation.ts";
import { isPatternExtractionEngineInitialized } from "./patternExtractionEngine.ts";
import { isSimilarityEngineInitialized, SIMILARITY_ENGINE_SELF_MANIFEST } from "./similarityEngine.ts";
import {
  OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
  OUTCOME_LEARNING_ENGINE_FORBIDDEN_PATTERNS,
  OUTCOME_LEARNING_ENGINE_PUBLIC_API_RULES,
  OUTCOME_LEARNING_ENGINE_TAGS,
  OUTCOME_LEARNING_MANDATORY_PROFILE_FIELDS,
} from "./outcomeLearningEngineConstants.ts";
import {
  buildOutcomeProfiles,
  learnHistoricalOutcomes,
} from "./outcomeLearningPipeline.ts";
import {
  clearOutcomeLearningRegistryForTests,
  getOutcome,
  getOutcomeRegistrySnapshot,
  getOutcomes,
  outcomeExists,
  registerOutcome,
  unregisterOutcome,
} from "./outcomeLearningEngineRegistry.ts";
import type {
  ExecutiveOutcome,
  OutcomeLearningEngineState,
  OutcomeLearningRequest,
  OutcomeLearningResult,
} from "./outcomeLearningEngineTypes.ts";
import {
  validateEngineDependencies,
  validateExecutiveOutcome,
  validateOutcomeLearning,
} from "./outcomeLearningEngineValidation.ts";

export const OUTCOME_LEARNING_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...OUTCOME_LEARNING_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const OUTCOME_LEARNING_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/4",
  title: "Outcome Learning Engine",
  goal: "Deterministic historical outcome aggregation, evidence collection, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SIMILARITY_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/cross-scenario-learning/outcomeLearningEngineConstants.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningEngineTypes.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningEngineValidation.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningNormalizer.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningEvidenceAggregation.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningEngineRegistry.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningPipeline.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningEngine.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningEngineRunner.ts",
    "frontend/app/lib/cross-scenario-learning/outcomeLearningEngine.test.ts",
    "docs/app-10-4-outcome-learning-engine.md",
  ]),
  forbiddenPatterns: OUTCOME_LEARNING_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-10/1", "APP-10/2", "APP-10/3"]),
  runtimePath: "library-only" as const,
  tags: OUTCOME_LEARNING_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeOutcomeLearningEngine(
  timestamp: string = engineTimestamp
): OutcomeLearningEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getOutcomeLearningEngineState(timestamp);
}

export function isOutcomeLearningEngineInitialized(): boolean {
  return engineInitialized;
}

export function getOutcomeLearningEngineState(
  timestamp: string = engineTimestamp
): OutcomeLearningEngineState {
  return Object.freeze({
    engineId: "outcome-learning-engine",
    contractVersion: OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredOutcomeCount: getOutcomeRegistrySnapshot().outcomeCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetOutcomeLearningEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  clearOutcomeLearningRegistryForTests();
}

function assertEngineReady(): OutcomeLearningResult | null {
  const dependencyValidation = validateEngineDependencies(
    isCrossScenarioLearningPlatformInitialized(),
    isPatternExtractionEngineInitialized(),
    isSimilarityEngineInitialized()
  );
  if (!dependencyValidation.valid) {
    return Object.freeze({
      success: false,
      reason: dependencyValidation.issues.map((entry) => entry.message).join("; "),
      workspaceId: "",
      learnedOutcomes: Object.freeze([]),
      registeredOutcomeIds: Object.freeze([]),
      pipelineStages: Object.freeze([]),
      learningTimestamp: engineTimestamp,
      readOnly: true as const,
    });
  }
  if (!isOutcomeLearningEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Outcome Learning Engine is not initialized.",
      workspaceId: "",
      learnedOutcomes: Object.freeze([]),
      registeredOutcomeIds: Object.freeze([]),
      pipelineStages: Object.freeze([]),
      learningTimestamp: engineTimestamp,
      readOnly: true as const,
    });
  }
  return null;
}

export function learnHistoricalOutcomesFromRecords(
  request: OutcomeLearningRequest
): OutcomeLearningResult {
  const readiness = assertEngineReady();
  if (readiness) {
    return Object.freeze({
      ...readiness,
      workspaceId: request.workspaceId,
      learningTimestamp: request.learningTimestamp ?? engineTimestamp,
    });
  }
  return learnHistoricalOutcomes(request);
}

export function validateOutcomeLearningResult(outcomes: readonly ExecutiveOutcome[]) {
  return validateOutcomeLearning(outcomes);
}

export { learnHistoricalOutcomesFromRecords as learnHistoricalOutcomes };
export { buildOutcomeProfiles, validateOutcomeLearning as validateOutcomeLearningProfiles };
export { registerOutcome, unregisterOutcome, getOutcome, getOutcomes, outcomeExists };
export { validateExecutiveOutcome };
export { runOutcomeLearningCertification } from "./outcomeLearningEngineRunner.ts";

export const OUTCOME_LEARNING_ENGINE_VERSION = OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION;

export const OutcomeLearningEngine = Object.freeze({
  initializeOutcomeLearningEngine,
  isOutcomeLearningEngineInitialized,
  getOutcomeLearningEngineState,
  learnHistoricalOutcomes: learnHistoricalOutcomesFromRecords,
  buildOutcomeProfiles,
  validateOutcomeLearning: validateOutcomeLearningResult,
  registerOutcome,
  getOutcomes,
  getOutcome,
  outcomeExists,
  version: OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
  foundationVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  mandatoryFields: OUTCOME_LEARNING_MANDATORY_PROFILE_FIELDS,
  tags: OUTCOME_LEARNING_ENGINE_TAGS,
  publicApiRules: OUTCOME_LEARNING_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
});

export {
  OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
  OUTCOME_LEARNING_ENGINE_TAGS,
  OUTCOME_LEARNING_MANDATORY_PROFILE_FIELDS,
  OUTCOME_LEARNING_ENGINE_PUBLIC_API_RULES,
};
