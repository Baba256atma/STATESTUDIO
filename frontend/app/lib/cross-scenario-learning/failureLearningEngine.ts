/**
 * APP-10:5 — Failure Learning Engine.
 * Deterministic historical failure learning from completed scenarios.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CROSS_SCENARIO_LEARNING_MUST_NOT_OWN, CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION } from "./crossScenarioLearningConstants.ts";
import { isCrossScenarioLearningPlatformInitialized } from "./crossScenarioLearningFoundation.ts";
import { isPatternExtractionEngineInitialized } from "./patternExtractionEngine.ts";
import { isSimilarityEngineInitialized } from "./similarityEngine.ts";
import {
  isOutcomeLearningEngineInitialized,
  OUTCOME_LEARNING_ENGINE_SELF_MANIFEST,
} from "./outcomeLearningEngine.ts";
import {
  FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
  FAILURE_LEARNING_ENGINE_FORBIDDEN_PATTERNS,
  FAILURE_LEARNING_ENGINE_PUBLIC_API_RULES,
  FAILURE_LEARNING_ENGINE_TAGS,
  FAILURE_LEARNING_MANDATORY_PROFILE_FIELDS,
} from "./failureLearningEngineConstants.ts";
import {
  buildFailureProfiles,
  learnHistoricalFailures,
} from "./failureLearningPipeline.ts";
import {
  clearFailureLearningRegistryForTests,
  failureExists,
  getFailure,
  getFailureRegistrySnapshot,
  getFailures,
  registerFailure,
  unregisterFailure,
} from "./failureLearningEngineRegistry.ts";
import type {
  ExecutiveFailure,
  FailureLearningEngineState,
  FailureLearningRequest,
  FailureLearningResult,
} from "./failureLearningEngineTypes.ts";
import {
  validateEngineDependencies,
  validateExecutiveFailure,
  validateFailureLearning,
} from "./failureLearningEngineValidation.ts";

export const FAILURE_LEARNING_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...FAILURE_LEARNING_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const FAILURE_LEARNING_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/5",
  title: "Failure Learning Engine",
  goal: "Deterministic historical failure aggregation, evidence collection, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...OUTCOME_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/cross-scenario-learning/failureLearningEngineConstants.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningEngineTypes.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningEngineValidation.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningNormalizer.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningEvidenceAggregation.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningEngineRegistry.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningPipeline.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningEngine.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningEngineRunner.ts",
    "frontend/app/lib/cross-scenario-learning/failureLearningEngine.test.ts",
    "docs/app-10-5-failure-learning-engine.md",
  ]),
  forbiddenPatterns: FAILURE_LEARNING_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-10/1", "APP-10/2", "APP-10/3", "APP-10/4"]),
  runtimePath: "library-only" as const,
  tags: FAILURE_LEARNING_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeFailureLearningEngine(
  timestamp: string = engineTimestamp
): FailureLearningEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getFailureLearningEngineState(timestamp);
}

export function isFailureLearningEngineInitialized(): boolean {
  return engineInitialized;
}

export function getFailureLearningEngineState(
  timestamp: string = engineTimestamp
): FailureLearningEngineState {
  return Object.freeze({
    engineId: "failure-learning-engine",
    contractVersion: FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredFailureCount: getFailureRegistrySnapshot().failureCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetFailureLearningEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  clearFailureLearningRegistryForTests();
}

function assertEngineReady(): FailureLearningResult | null {
  const dependencyValidation = validateEngineDependencies(
    isCrossScenarioLearningPlatformInitialized(),
    isPatternExtractionEngineInitialized(),
    isSimilarityEngineInitialized(),
    isOutcomeLearningEngineInitialized()
  );
  if (!dependencyValidation.valid) {
    return Object.freeze({
      success: false,
      reason: dependencyValidation.issues.map((entry) => entry.message).join("; "),
      workspaceId: "",
      learnedFailures: Object.freeze([]),
      registeredFailureIds: Object.freeze([]),
      pipelineStages: Object.freeze([]),
      learningTimestamp: engineTimestamp,
      readOnly: true as const,
    });
  }
  if (!isFailureLearningEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Failure Learning Engine is not initialized.",
      workspaceId: "",
      learnedFailures: Object.freeze([]),
      registeredFailureIds: Object.freeze([]),
      pipelineStages: Object.freeze([]),
      learningTimestamp: engineTimestamp,
      readOnly: true as const,
    });
  }
  return null;
}

export function learnHistoricalFailuresFromRecords(
  request: FailureLearningRequest
): FailureLearningResult {
  const readiness = assertEngineReady();
  if (readiness) {
    return Object.freeze({
      ...readiness,
      workspaceId: request.workspaceId,
      learningTimestamp: request.learningTimestamp ?? engineTimestamp,
    });
  }
  return learnHistoricalFailures(request);
}

export function validateFailureLearningResult(failures: readonly ExecutiveFailure[]) {
  return validateFailureLearning(failures);
}

export { learnHistoricalFailuresFromRecords as learnHistoricalFailures };
export { buildFailureProfiles, validateFailureLearning as validateFailureLearningProfiles };
export { registerFailure, unregisterFailure, getFailure, getFailures, failureExists };
export { validateExecutiveFailure };
export { runFailureLearningCertification } from "./failureLearningEngineRunner.ts";

export const FAILURE_LEARNING_ENGINE_VERSION = FAILURE_LEARNING_ENGINE_CONTRACT_VERSION;

export const FailureLearningEngine = Object.freeze({
  initializeFailureLearningEngine,
  isFailureLearningEngineInitialized,
  getFailureLearningEngineState,
  learnHistoricalFailures: learnHistoricalFailuresFromRecords,
  buildFailureProfiles,
  validateFailureLearning: validateFailureLearningResult,
  registerFailure,
  getFailures,
  getFailure,
  failureExists,
  version: FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
  foundationVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  mandatoryFields: FAILURE_LEARNING_MANDATORY_PROFILE_FIELDS,
  tags: FAILURE_LEARNING_ENGINE_TAGS,
  publicApiRules: FAILURE_LEARNING_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
});

export {
  FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
  FAILURE_LEARNING_ENGINE_TAGS,
  FAILURE_LEARNING_MANDATORY_PROFILE_FIELDS,
  FAILURE_LEARNING_ENGINE_PUBLIC_API_RULES,
};
