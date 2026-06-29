/**
 * APP-10:6 — Strategy Learning Engine.
 * Deterministic historical strategy learning from completed scenarios.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CROSS_SCENARIO_LEARNING_MUST_NOT_OWN, CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION } from "./crossScenarioLearningConstants.ts";
import { isCrossScenarioLearningPlatformInitialized } from "./crossScenarioLearningFoundation.ts";
import { isPatternExtractionEngineInitialized } from "./patternExtractionEngine.ts";
import { isSimilarityEngineInitialized } from "./similarityEngine.ts";
import {
  isOutcomeLearningEngineInitialized,
} from "./outcomeLearningEngine.ts";
import {
  isFailureLearningEngineInitialized,
  FAILURE_LEARNING_ENGINE_SELF_MANIFEST,
} from "./failureLearningEngine.ts";
import {
  STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
  STRATEGY_LEARNING_ENGINE_FORBIDDEN_PATTERNS,
  STRATEGY_LEARNING_ENGINE_PUBLIC_API_RULES,
  STRATEGY_LEARNING_ENGINE_TAGS,
  STRATEGY_LEARNING_MANDATORY_PROFILE_FIELDS,
} from "./strategyLearningEngineConstants.ts";
import {
  buildStrategyProfiles,
  learnHistoricalStrategies,
} from "./strategyLearningPipeline.ts";
import {
  clearStrategyLearningRegistryForTests,
  getStrategy,
  getStrategyRegistrySnapshot,
  getStrategies,
  registerStrategy,
  strategyExists,
  unregisterStrategy,
} from "./strategyLearningEngineRegistry.ts";
import type {
  ExecutiveStrategy,
  StrategyLearningEngineState,
  StrategyLearningRequest,
  StrategyLearningResult,
} from "./strategyLearningEngineTypes.ts";
import {
  validateEngineDependencies,
  validateExecutiveStrategy,
  validateStrategyLearning,
} from "./strategyLearningEngineValidation.ts";

export const STRATEGY_LEARNING_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...STRATEGY_LEARNING_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const STRATEGY_LEARNING_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/6",
  title: "Strategy Learning Engine",
  goal: "Deterministic historical strategy aggregation, condition tracking, outcome/failure linkage, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...FAILURE_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/cross-scenario-learning/strategyLearningEngineConstants.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningEngineTypes.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningEngineValidation.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningNormalizer.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningEvidenceAggregation.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningEngineRegistry.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningPipeline.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningEngine.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningEngineRunner.ts",
    "frontend/app/lib/cross-scenario-learning/strategyLearningEngine.test.ts",
    "docs/app-10-6-strategy-learning-engine.md",
  ]),
  forbiddenPatterns: STRATEGY_LEARNING_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-10/1", "APP-10/2", "APP-10/3", "APP-10/4", "APP-10/5"]),
  runtimePath: "library-only" as const,
  tags: STRATEGY_LEARNING_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeStrategyLearningEngine(
  timestamp: string = engineTimestamp
): StrategyLearningEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getStrategyLearningEngineState(timestamp);
}

export function isStrategyLearningEngineInitialized(): boolean {
  return engineInitialized;
}

export function getStrategyLearningEngineState(
  timestamp: string = engineTimestamp
): StrategyLearningEngineState {
  return Object.freeze({
    engineId: "strategy-learning-engine",
    contractVersion: STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredStrategyCount: getStrategyRegistrySnapshot().strategyCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetStrategyLearningEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  clearStrategyLearningRegistryForTests();
}

function assertEngineReady(): StrategyLearningResult | null {
  const dependencyValidation = validateEngineDependencies(
    isCrossScenarioLearningPlatformInitialized(),
    isPatternExtractionEngineInitialized(),
    isSimilarityEngineInitialized(),
    isOutcomeLearningEngineInitialized(),
    isFailureLearningEngineInitialized()
  );
  if (!dependencyValidation.valid) {
    return Object.freeze({
      success: false,
      reason: dependencyValidation.issues.map((entry) => entry.message).join("; "),
      workspaceId: "",
      learnedStrategies: Object.freeze([]),
      registeredStrategyIds: Object.freeze([]),
      pipelineStages: Object.freeze([]),
      learningTimestamp: engineTimestamp,
      readOnly: true as const,
    });
  }
  if (!isStrategyLearningEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Strategy Learning Engine is not initialized.",
      workspaceId: "",
      learnedStrategies: Object.freeze([]),
      registeredStrategyIds: Object.freeze([]),
      pipelineStages: Object.freeze([]),
      learningTimestamp: engineTimestamp,
      readOnly: true as const,
    });
  }
  return null;
}

export function learnHistoricalStrategiesFromRecords(
  request: StrategyLearningRequest
): StrategyLearningResult {
  const readiness = assertEngineReady();
  if (readiness) {
    return Object.freeze({
      ...readiness,
      workspaceId: request.workspaceId,
      learningTimestamp: request.learningTimestamp ?? engineTimestamp,
    });
  }
  return learnHistoricalStrategies(request);
}

export function validateStrategyLearningResult(strategies: readonly ExecutiveStrategy[]) {
  return validateStrategyLearning(strategies);
}

export { learnHistoricalStrategiesFromRecords as learnHistoricalStrategies };
export { buildStrategyProfiles, validateStrategyLearning as validateStrategyLearningProfiles };
export { registerStrategy, unregisterStrategy, getStrategy, getStrategies, strategyExists };
export { validateExecutiveStrategy };
export { runStrategyLearningCertification } from "./strategyLearningEngineRunner.ts";

export const STRATEGY_LEARNING_ENGINE_VERSION = STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION;

export const StrategyLearningEngine = Object.freeze({
  initializeStrategyLearningEngine,
  isStrategyLearningEngineInitialized,
  getStrategyLearningEngineState,
  learnHistoricalStrategies: learnHistoricalStrategiesFromRecords,
  buildStrategyProfiles,
  validateStrategyLearning: validateStrategyLearningResult,
  registerStrategy,
  getStrategies,
  getStrategy,
  strategyExists,
  version: STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
  foundationVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  mandatoryFields: STRATEGY_LEARNING_MANDATORY_PROFILE_FIELDS,
  tags: STRATEGY_LEARNING_ENGINE_TAGS,
  publicApiRules: STRATEGY_LEARNING_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
});

export {
  STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
  STRATEGY_LEARNING_ENGINE_TAGS,
  STRATEGY_LEARNING_MANDATORY_PROFILE_FIELDS,
  STRATEGY_LEARNING_ENGINE_PUBLIC_API_RULES,
};
