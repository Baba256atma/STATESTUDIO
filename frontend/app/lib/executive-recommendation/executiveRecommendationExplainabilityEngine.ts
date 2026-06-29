/**
 * APP-12:4 — Executive Recommendation Explainability Engine.
 * Deterministic human-readable explanations for evaluated recommendations.
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
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
} from "./executiveRecommendationEvaluationEngineConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST,
  isRecommendationEvaluationEngineInitialized,
} from "./executiveRecommendationEvaluationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import { isRecommendationGenerationEngineInitialized } from "./executiveRecommendationGenerationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_TAGS,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_MANDATORY_EXPLANATION_FIELDS,
} from "./executiveRecommendationExplainabilityEngineConstants.ts";
import {
  buildRecommendationExplanations as buildRecommendationExplanationsFromPipeline,
  explainExecutiveRecommendations as explainExecutiveRecommendationsFromPipeline,
} from "./executiveRecommendationExplainabilityPipeline.ts";
import {
  getRecommendationExplanation,
  getRecommendationExplanations,
  getRecommendationExplanationRegistrySnapshot,
  recommendationExplanationExists,
  registerRecommendationExplanation,
  resetExecutiveRecommendationExplainabilityEngineRegistryForTests,
  unregisterRecommendationExplanation,
} from "./executiveRecommendationExplainabilityEngineRegistry.ts";
import type {
  ExecutiveRecommendationExplainabilityEngineState,
  ExecutiveRecommendationExplainabilityRequest,
  ExplanationResult,
  RecommendationExplainabilityEngineResult,
} from "./executiveRecommendationExplainabilityEngineTypes.ts";
import {
  validateEvaluationEngineCompatibility,
  validateExplainabilityDependencies,
  validateFoundationCompatibilityForExplainabilityEngine,
  validateGenerationEngineCompatibilityForExplainability,
  validateRecommendationExplanation,
  validateRecommendationExplanations,
} from "./executiveRecommendationExplainabilityEngineValidation.ts";

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/4",
  title: "Executive Recommendation Explainability Engine",
  goal: "Deterministic human-readable executive recommendation explanations, section generation, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles,
    ...EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST.allowedFiles.filter(
      (file) => !EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles.includes(file)
    ),
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngineConstants.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngineTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngineValidation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngineRegistry.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilitySectionBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEvidenceAggregator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityProfileBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityPipeline.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngine.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngineRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngine.test.ts",
    "docs/app-12-4-recommendation-explainability-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-12/1", "APP-12/2", "APP-12/3"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeRecommendationExplainabilityEngine(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationExplainabilityEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getRecommendationExplainabilityEngineState(timestamp);
}

export function isRecommendationExplainabilityEngineInitialized(): boolean {
  return engineInitialized;
}

export function getRecommendationExplainabilityEngineState(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationExplainabilityEngineState {
  const registry = getRecommendationExplanationRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-recommendation-explainability-engine",
    contractVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredExplanationCount: registry.explanationCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveRecommendationExplainabilityEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveRecommendationExplainabilityEngineRegistryForTests();
}

function assertEngineReady<T>(): RecommendationExplainabilityEngineResult<T> | null {
  const foundationValidation = validateFoundationCompatibilityForExplainabilityEngine(
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
  const generationValidation = validateGenerationEngineCompatibilityForExplainability(
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
  const evaluationValidation = validateEvaluationEngineCompatibility(
    isRecommendationEvaluationEngineInitialized()
  );
  if (!evaluationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:3 Recommendation Evaluation Engine is not initialized.",
      data: null,
      error: Object.freeze({
        code: "evaluation_incompatible",
        message: "Evaluation engine not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (!isRecommendationExplainabilityEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Recommendation Explainability Engine is not initialized.",
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

export function explainExecutiveRecommendationsWithEngine(
  request: ExecutiveRecommendationExplainabilityRequest
): ExplanationResult {
  const blocked = assertEngineReady<ExplanationResult>();
  if (blocked) {
    const timestamp = request.explanationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      explanations: Object.freeze([]),
      profiles: Object.freeze([]),
      registeredExplanationIds: Object.freeze([]),
      skippedEvaluations: 0,
      pipelineStages: Object.freeze([]),
      explanationTimestamp: timestamp,
      readOnly: true as const,
    });
  }
  return explainExecutiveRecommendationsFromPipeline(request);
}

export {
  explainExecutiveRecommendationsWithEngine as explainExecutiveRecommendations,
  buildRecommendationExplanationsFromPipeline as buildRecommendationExplanations,
  validateRecommendationExplanation,
};
export {
  registerRecommendationExplanation,
  unregisterRecommendationExplanation,
  getRecommendationExplanation,
  getRecommendationExplanations,
  recommendationExplanationExists,
  getRecommendationExplanationRegistrySnapshot,
};
export { validateRecommendationExplanations, validateExplainabilityDependencies };
export { runRecommendationExplainabilityCertification } from "./executiveRecommendationExplainabilityEngineRunner.ts";

export const EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_VERSION =
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION;

export const ExecutiveRecommendationExplainabilityEngine = Object.freeze({
  initializeRecommendationExplainabilityEngine,
  isRecommendationExplainabilityEngineInitialized,
  getRecommendationExplainabilityEngineState,
  explainExecutiveRecommendations: explainExecutiveRecommendationsWithEngine,
  buildRecommendationExplanations: buildRecommendationExplanationsFromPipeline,
  validateRecommendationExplanation,
  registerRecommendationExplanation,
  getRecommendationExplanations,
  getRecommendationExplanation,
  recommendationExplanationExists,
  resetExecutiveRecommendationExplainabilityEngineForTests,
  version: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  generationVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  evaluationVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_MANDATORY_EXPLANATION_FIELDS,
  tags: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
});
