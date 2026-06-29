/**
 * APP-12:3 — Executive Recommendation Evaluation Engine.
 * Deterministic executive recommendation evaluation from APP-12:2 candidates.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
} from "./executiveRecommendationConstants.ts";
import { EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST } from "./executiveRecommendationContracts.ts";
import { isExecutiveRecommendationPlatformInitialized } from "./executiveRecommendationFoundation.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST,
  isRecommendationGenerationEngineInitialized,
} from "./executiveRecommendationGenerationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_TAGS,
  EXECUTIVE_RECOMMENDATION_EVALUATION_MANDATORY_EVALUATION_FIELDS,
} from "./executiveRecommendationEvaluationEngineConstants.ts";
import {
  buildRecommendationEvaluations as buildRecommendationEvaluationsFromPipeline,
  evaluateExecutiveRecommendations as evaluateExecutiveRecommendationsFromPipeline,
} from "./executiveRecommendationEvaluationPipeline.ts";
import {
  getRecommendationEvaluation,
  getRecommendationEvaluations,
  getRecommendationEvaluationRegistrySnapshot,
  recommendationEvaluationExists,
  registerRecommendationEvaluation,
  resetExecutiveRecommendationEvaluationEngineRegistryForTests,
  unregisterRecommendationEvaluation,
} from "./executiveRecommendationEvaluationEngineRegistry.ts";
import type {
  ExecutiveRecommendationEvaluationEngineState,
  ExecutiveRecommendationEvaluationRequest,
  RecommendationEvaluationEngineResult,
  RecommendationEvaluationResult,
} from "./executiveRecommendationEvaluationEngineTypes.ts";
import {
  validateEvaluationDependencies,
  validateFoundationCompatibilityForEvaluationEngine,
  validateGenerationEngineCompatibility,
  validateRecommendationEvaluation,
  validateRecommendationEvaluations,
} from "./executiveRecommendationEvaluationEngineValidation.ts";

export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/3",
  title: "Executive Recommendation Evaluation Engine",
  goal: "Deterministic executive recommendation evaluation, dimension analysis, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles,
    ...EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST.allowedFiles.filter(
      (file) => !EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles.includes(file)
    ),
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngineConstants.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngineTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngineValidation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngineRegistry.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationDimensionEvaluator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEvidenceAggregator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationProfileBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationPipeline.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngine.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngineRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngine.test.ts",
    "docs/app-12-3-recommendation-evaluation-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-12/1", "APP-12/2"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeRecommendationEvaluationEngine(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationEvaluationEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getRecommendationEvaluationEngineState(timestamp);
}

export function isRecommendationEvaluationEngineInitialized(): boolean {
  return engineInitialized;
}

export function getRecommendationEvaluationEngineState(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationEvaluationEngineState {
  const registry = getRecommendationEvaluationRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-recommendation-evaluation-engine",
    contractVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredEvaluationCount: registry.evaluationCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveRecommendationEvaluationEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveRecommendationEvaluationEngineRegistryForTests();
}

function assertEngineReady<T>(): RecommendationEvaluationEngineResult<T> | null {
  const foundationValidation = validateFoundationCompatibilityForEvaluationEngine(
    isExecutiveRecommendationPlatformInitialized()
  );
  if (!foundationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:1 Executive Recommendation Foundation is not initialized.",
      data: null,
      error: Object.freeze({
        code: "foundation_incompatible",
        message: "Foundation not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  const generationValidation = validateGenerationEngineCompatibility(
    isRecommendationGenerationEngineInitialized()
  );
  if (!generationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:2 Recommendation Generation Engine is not initialized.",
      data: null,
      error: Object.freeze({
        code: "generation_incompatible",
        message: "Generation engine not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (!isRecommendationEvaluationEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Recommendation Evaluation Engine is not initialized.",
      data: null,
      error: Object.freeze({
        code: "engine_not_initialized",
        message: "Engine not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  return null;
}

export function evaluateExecutiveRecommendationsWithEngine(
  request: ExecutiveRecommendationEvaluationRequest
): RecommendationEvaluationResult {
  const blocked = assertEngineReady<RecommendationEvaluationResult>();
  if (blocked) {
    const timestamp = request.evaluationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      evaluations: Object.freeze([]),
      profiles: Object.freeze([]),
      registeredEvaluationIds: Object.freeze([]),
      skippedCandidates: 0,
      pipelineStages: Object.freeze([]),
      evaluationTimestamp: timestamp,
      readOnly: true as const,
    });
  }
  return evaluateExecutiveRecommendationsFromPipeline(request);
}

export {
  evaluateExecutiveRecommendationsWithEngine as evaluateExecutiveRecommendations,
  buildRecommendationEvaluationsFromPipeline as buildRecommendationEvaluations,
  validateRecommendationEvaluation,
};
export {
  registerRecommendationEvaluation,
  unregisterRecommendationEvaluation,
  getRecommendationEvaluation,
  getRecommendationEvaluations,
  recommendationEvaluationExists,
  getRecommendationEvaluationRegistrySnapshot,
};
export { validateRecommendationEvaluations, validateEvaluationDependencies };
export { runRecommendationEvaluationCertification } from "./executiveRecommendationEvaluationEngineRunner.ts";

export const EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_VERSION =
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION;

export const ExecutiveRecommendationEvaluationEngine = Object.freeze({
  initializeRecommendationEvaluationEngine,
  isRecommendationEvaluationEngineInitialized,
  getRecommendationEvaluationEngineState,
  evaluateExecutiveRecommendations: evaluateExecutiveRecommendationsWithEngine,
  buildRecommendationEvaluations: buildRecommendationEvaluationsFromPipeline,
  validateRecommendationEvaluation,
  registerRecommendationEvaluation,
  getRecommendationEvaluations,
  getRecommendationEvaluation,
  recommendationEvaluationExists,
  resetExecutiveRecommendationEvaluationEngineForTests,
  version: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  generationVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_RECOMMENDATION_EVALUATION_MANDATORY_EVALUATION_FIELDS,
  tags: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
});
