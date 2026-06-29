/**
 * APP-10:7 — Recommendation Learning Engine.
 * Deterministic historical recommendation learning from executive recommendation performance.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CROSS_SCENARIO_LEARNING_MUST_NOT_OWN, CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION } from "./crossScenarioLearningConstants.ts";
import { isCrossScenarioLearningPlatformInitialized } from "./crossScenarioLearningFoundation.ts";
import { isPatternExtractionEngineInitialized } from "./patternExtractionEngine.ts";
import { isSimilarityEngineInitialized } from "./similarityEngine.ts";
import { isOutcomeLearningEngineInitialized } from "./outcomeLearningEngine.ts";
import { isFailureLearningEngineInitialized } from "./failureLearningEngine.ts";
import {
  isStrategyLearningEngineInitialized,
  STRATEGY_LEARNING_ENGINE_SELF_MANIFEST,
} from "./strategyLearningEngine.ts";
import {
  RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
  RECOMMENDATION_LEARNING_ENGINE_FORBIDDEN_PATTERNS,
  RECOMMENDATION_LEARNING_ENGINE_PUBLIC_API_RULES,
  RECOMMENDATION_LEARNING_ENGINE_TAGS,
  RECOMMENDATION_LEARNING_MANDATORY_PROFILE_FIELDS,
} from "./recommendationLearningEngineConstants.ts";
import {
  buildRecommendationProfiles,
  learnHistoricalRecommendations,
} from "./recommendationLearningPipeline.ts";
import {
  clearRecommendationLearningRegistryForTests,
  getRecommendationProfile,
  getRecommendationProfiles,
  getRecommendationRegistrySnapshot,
  recommendationProfileExists,
  registerRecommendationProfile,
  unregisterRecommendationProfile,
} from "./recommendationLearningEngineRegistry.ts";
import type {
  ExecutiveRecommendationHistory,
  RecommendationLearningEngineState,
  RecommendationLearningRequest,
  RecommendationLearningResult,
} from "./recommendationLearningEngineTypes.ts";
import {
  validateEngineDependencies,
  validateExecutiveRecommendationHistory,
  validateRecommendationLearning,
} from "./recommendationLearningEngineValidation.ts";

export const RECOMMENDATION_LEARNING_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...RECOMMENDATION_LEARNING_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/7",
  title: "Recommendation Learning Engine",
  goal: "Deterministic historical recommendation aggregation, lifecycle tracking, outcome/failure linkage, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...STRATEGY_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/cross-scenario-learning/recommendationLearningEngineConstants.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningEngineTypes.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningEngineValidation.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningNormalizer.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningEvidenceAggregation.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningEngineRegistry.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningPipeline.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningEngine.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningEngineRunner.ts",
    "frontend/app/lib/cross-scenario-learning/recommendationLearningEngine.test.ts",
    "docs/app-10-7-recommendation-learning-engine.md",
  ]),
  forbiddenPatterns: RECOMMENDATION_LEARNING_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-10/1", "APP-10/2", "APP-10/3", "APP-10/4", "APP-10/5", "APP-10/6"]),
  runtimePath: "library-only" as const,
  tags: RECOMMENDATION_LEARNING_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeRecommendationLearningEngine(
  timestamp: string = engineTimestamp
): RecommendationLearningEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getRecommendationLearningEngineState(timestamp);
}

export function isRecommendationLearningEngineInitialized(): boolean {
  return engineInitialized;
}

export function getRecommendationLearningEngineState(
  timestamp: string = engineTimestamp
): RecommendationLearningEngineState {
  return Object.freeze({
    engineId: "recommendation-learning-engine",
    contractVersion: RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredProfileCount: getRecommendationRegistrySnapshot().profileCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetRecommendationLearningEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  clearRecommendationLearningRegistryForTests();
}

function assertEngineReady(): RecommendationLearningResult | null {
  const dependencyValidation = validateEngineDependencies(
    isCrossScenarioLearningPlatformInitialized(),
    isPatternExtractionEngineInitialized(),
    isSimilarityEngineInitialized(),
    isOutcomeLearningEngineInitialized(),
    isFailureLearningEngineInitialized(),
    isStrategyLearningEngineInitialized()
  );
  if (!dependencyValidation.valid) {
    return Object.freeze({
      success: false,
      reason: dependencyValidation.issues.map((entry) => entry.message).join("; "),
      workspaceId: "",
      learnedRecommendations: Object.freeze([]),
      registeredRecommendationIds: Object.freeze([]),
      pipelineStages: Object.freeze([]),
      learningTimestamp: engineTimestamp,
      readOnly: true as const,
    });
  }
  if (!isRecommendationLearningEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Recommendation Learning Engine is not initialized.",
      workspaceId: "",
      learnedRecommendations: Object.freeze([]),
      registeredRecommendationIds: Object.freeze([]),
      pipelineStages: Object.freeze([]),
      learningTimestamp: engineTimestamp,
      readOnly: true as const,
    });
  }
  return null;
}

export function learnHistoricalRecommendationsFromRecords(
  request: RecommendationLearningRequest
): RecommendationLearningResult {
  const readiness = assertEngineReady();
  if (readiness) {
    return Object.freeze({
      ...readiness,
      workspaceId: request.workspaceId,
      learningTimestamp: request.learningTimestamp ?? engineTimestamp,
    });
  }
  return learnHistoricalRecommendations(request);
}

export function validateRecommendationLearningResult(histories: readonly ExecutiveRecommendationHistory[]) {
  return validateRecommendationLearning(histories);
}

export { learnHistoricalRecommendationsFromRecords as learnHistoricalRecommendations };
export {
  buildRecommendationProfiles,
  validateRecommendationLearning as validateRecommendationLearningProfiles,
};
export {
  registerRecommendationProfile,
  unregisterRecommendationProfile,
  getRecommendationProfile,
  getRecommendationProfiles,
  recommendationProfileExists,
};
export { validateExecutiveRecommendationHistory };
export { runRecommendationLearningCertification } from "./recommendationLearningEngineRunner.ts";

export const RECOMMENDATION_LEARNING_ENGINE_VERSION = RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION;

export const RecommendationLearningEngine = Object.freeze({
  initializeRecommendationLearningEngine,
  isRecommendationLearningEngineInitialized,
  getRecommendationLearningEngineState,
  learnHistoricalRecommendations: learnHistoricalRecommendationsFromRecords,
  buildRecommendationProfiles,
  validateRecommendationLearning: validateRecommendationLearningResult,
  registerRecommendationProfile,
  getRecommendationProfiles,
  getRecommendationProfile,
  recommendationProfileExists,
  version: RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
  foundationVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  mandatoryFields: RECOMMENDATION_LEARNING_MANDATORY_PROFILE_FIELDS,
  tags: RECOMMENDATION_LEARNING_ENGINE_TAGS,
  publicApiRules: RECOMMENDATION_LEARNING_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
});

export {
  RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
  RECOMMENDATION_LEARNING_ENGINE_TAGS,
  RECOMMENDATION_LEARNING_MANDATORY_PROFILE_FIELDS,
  RECOMMENDATION_LEARNING_ENGINE_PUBLIC_API_RULES,
};
