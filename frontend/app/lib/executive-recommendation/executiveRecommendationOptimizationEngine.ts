/**
 * APP-12:6 — Executive Recommendation Optimization Engine.
 * Deterministic optimization variants from governance-compliant recommendations.
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
import { isRecommendationEvaluationEngineInitialized } from "./executiveRecommendationEvaluationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
} from "./executiveRecommendationExplainabilityEngineConstants.ts";
import { isRecommendationExplainabilityEngineInitialized } from "./executiveRecommendationExplainabilityEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import { isRecommendationGenerationEngineInitialized } from "./executiveRecommendationGenerationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST,
  isRecommendationGovernanceEngineInitialized,
} from "./executiveRecommendationGovernanceEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_TAGS,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_MANDATORY_OPTIMIZATION_FIELDS,
} from "./executiveRecommendationOptimizationEngineConstants.ts";
import {
  buildRecommendationOptimizations as buildRecommendationOptimizationsFromPipeline,
  optimizeExecutiveRecommendations as optimizeExecutiveRecommendationsFromPipeline,
} from "./executiveRecommendationOptimizationPipeline.ts";
import {
  getRecommendationOptimization,
  getRecommendationOptimizations,
  getRecommendationOptimizationRegistrySnapshot,
  recommendationOptimizationExists,
  registerRecommendationOptimization,
  resetExecutiveRecommendationOptimizationEngineRegistryForTests,
  unregisterRecommendationOptimization,
} from "./executiveRecommendationOptimizationEngineRegistry.ts";
import type {
  ExecutiveRecommendationOptimizationEngineState,
  ExecutiveRecommendationOptimizationRequest,
  RecommendationOptimizationEngineResult,
  RecommendationOptimizationResult,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import {
  validateEvaluationEngineCompatibilityForOptimization,
  validateExplainabilityEngineCompatibilityForOptimization,
  validateFoundationCompatibilityForOptimizationEngine,
  validateGenerationEngineCompatibilityForOptimization,
  validateGovernanceEngineCompatibility,
  validateOptimizationDependencies,
  validateRecommendationOptimization,
  validateRecommendationOptimizations,
} from "./executiveRecommendationOptimizationEngineValidation.ts";

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/6",
  title: "Executive Recommendation Optimization Engine",
  goal: "Deterministic executive recommendation optimization variants, governance preservation, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles,
    ...EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST.allowedFiles.filter(
      (file) => !EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles.includes(file)
    ),
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngineConstants.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngineTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngineValidation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngineRegistry.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationDimensionEvaluator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationVariantBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEvidenceAggregator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationProfileBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationPipeline.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngine.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngineRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngine.test.ts",
    "docs/app-12-6-recommendation-optimization-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-12/1", "APP-12/2", "APP-12/3", "APP-12/4", "APP-12/5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeRecommendationOptimizationEngine(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationOptimizationEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getRecommendationOptimizationEngineState(timestamp);
}

export function isRecommendationOptimizationEngineInitialized(): boolean {
  return engineInitialized;
}

export function getRecommendationOptimizationEngineState(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationOptimizationEngineState {
  const registry = getRecommendationOptimizationRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-recommendation-optimization-engine",
    contractVersion: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredOptimizationCount: registry.optimizationCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveRecommendationOptimizationEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveRecommendationOptimizationEngineRegistryForTests();
}

function assertEngineReady<T>(): RecommendationOptimizationEngineResult<T> | null {
  const foundationValidation = validateFoundationCompatibilityForOptimizationEngine(
    isExecutiveRecommendationPlatformInitialized()
  );
  if (!foundationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:1 Executive Recommendation Foundation is not initialized.",
      data: null,
      error: Object.freeze({ code: "foundation_incompatible", message: "Foundation not initialized.", readOnly: true as const }),
      readOnly: true as const,
    });
  }
  const generationValidation = validateGenerationEngineCompatibilityForOptimization(
    isRecommendationGenerationEngineInitialized()
  );
  if (!generationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:2 Recommendation Generation Engine is not initialized.",
      data: null,
      error: Object.freeze({ code: "generation_incompatible", message: "Generation engine not initialized.", readOnly: true as const }),
      readOnly: true as const,
    });
  }
  const evaluationValidation = validateEvaluationEngineCompatibilityForOptimization(
    isRecommendationEvaluationEngineInitialized()
  );
  if (!evaluationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:3 Recommendation Evaluation Engine is not initialized.",
      data: null,
      error: Object.freeze({ code: "evaluation_incompatible", message: "Evaluation engine not initialized.", readOnly: true as const }),
      readOnly: true as const,
    });
  }
  const explainabilityValidation = validateExplainabilityEngineCompatibilityForOptimization(
    isRecommendationExplainabilityEngineInitialized()
  );
  if (!explainabilityValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:4 Recommendation Explainability Engine is not initialized.",
      data: null,
      error: Object.freeze({ code: "explainability_incompatible", message: "Explainability engine not initialized.", readOnly: true as const }),
      readOnly: true as const,
    });
  }
  const governanceValidation = validateGovernanceEngineCompatibility(
    isRecommendationGovernanceEngineInitialized()
  );
  if (!governanceValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:5 Recommendation Governance Engine is not initialized.",
      data: null,
      error: Object.freeze({ code: "governance_incompatible", message: "Governance engine not initialized.", readOnly: true as const }),
      readOnly: true as const,
    });
  }
  if (!isRecommendationOptimizationEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Recommendation Optimization Engine is not initialized.",
      data: null,
      error: Object.freeze({ code: "engine_not_initialized", message: "Engine not initialized.", readOnly: true as const }),
      readOnly: true as const,
    });
  }
  return null;
}

export function optimizeExecutiveRecommendationsWithEngine(
  request: ExecutiveRecommendationOptimizationRequest
): RecommendationOptimizationResult {
  const blocked = assertEngineReady<RecommendationOptimizationResult>();
  if (blocked) {
    const timestamp = request.optimizationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      optimizations: Object.freeze([]),
      profiles: Object.freeze([]),
      registeredOptimizationIds: Object.freeze([]),
      skippedGovernanceRecords: 0,
      pipelineStages: Object.freeze([]),
      optimizationTimestamp: timestamp,
      readOnly: true as const,
    });
  }
  return optimizeExecutiveRecommendationsFromPipeline(request);
}

export {
  optimizeExecutiveRecommendationsWithEngine as optimizeExecutiveRecommendations,
  buildRecommendationOptimizationsFromPipeline as buildRecommendationOptimizations,
  validateRecommendationOptimization,
};
export {
  registerRecommendationOptimization,
  unregisterRecommendationOptimization,
  getRecommendationOptimization,
  getRecommendationOptimizations,
  recommendationOptimizationExists,
  getRecommendationOptimizationRegistrySnapshot,
};
export { validateRecommendationOptimizations, validateOptimizationDependencies };
export { runRecommendationOptimizationCertification } from "./executiveRecommendationOptimizationEngineRunner.ts";

export const EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_VERSION =
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION;

export const ExecutiveRecommendationOptimizationEngine = Object.freeze({
  initializeRecommendationOptimizationEngine,
  isRecommendationOptimizationEngineInitialized,
  getRecommendationOptimizationEngineState,
  optimizeExecutiveRecommendations: optimizeExecutiveRecommendationsWithEngine,
  buildRecommendationOptimizations: buildRecommendationOptimizationsFromPipeline,
  validateRecommendationOptimization,
  registerRecommendationOptimization,
  getRecommendationOptimizations,
  getRecommendationOptimization,
  recommendationOptimizationExists,
  resetExecutiveRecommendationOptimizationEngineForTests,
  version: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  generationVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  evaluationVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  explainabilityVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  governanceVersion: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_MANDATORY_OPTIMIZATION_FIELDS,
  tags: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
});
