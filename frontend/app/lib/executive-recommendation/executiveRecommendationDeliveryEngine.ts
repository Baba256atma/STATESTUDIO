/**
 * APP-12:7 — Executive Recommendation Delivery Engine.
 * Deterministic delivery packages from optimized executive recommendations.
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
import { isRecommendationGovernanceEngineInitialized } from "./executiveRecommendationGovernanceEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
} from "./executiveRecommendationOptimizationEngineConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST,
  isRecommendationOptimizationEngineInitialized,
} from "./executiveRecommendationOptimizationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_TAGS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_MANDATORY_DELIVERY_FIELDS,
} from "./executiveRecommendationDeliveryEngineConstants.ts";
import {
  buildRecommendationDeliveryPackages as buildRecommendationDeliveryPackagesFromPipeline,
  prepareExecutiveRecommendationDelivery as prepareExecutiveRecommendationDeliveryFromPipeline,
} from "./executiveRecommendationDeliveryPipeline.ts";
import {
  getRecommendationDelivery,
  getRecommendationDeliveries,
  getRecommendationDeliveryRegistrySnapshot,
  recommendationDeliveryExists,
  registerRecommendationDelivery,
  resetExecutiveRecommendationDeliveryEngineRegistryForTests,
  unregisterRecommendationDelivery,
} from "./executiveRecommendationDeliveryEngineRegistry.ts";
import type {
  ExecutiveRecommendationDeliveryEngineState,
  ExecutiveRecommendationDeliveryRequest,
  RecommendationDeliveryEngineResult,
  RecommendationDeliveryResult,
} from "./executiveRecommendationDeliveryEngineTypes.ts";
import {
  validateDeliveryDependencies,
  validateEvaluationEngineCompatibilityForDelivery,
  validateExplainabilityEngineCompatibilityForDelivery,
  validateFoundationCompatibilityForDeliveryEngine,
  validateGenerationEngineCompatibilityForDelivery,
  validateGovernanceEngineCompatibilityForDelivery,
  validateOptimizationEngineCompatibility,
  validateRecommendationDelivery,
  validateExecutiveRecommendationDeliveries,
} from "./executiveRecommendationDeliveryEngineValidation.ts";

export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/7",
  title: "Executive Recommendation Delivery & Interaction Engine",
  goal: "Deterministic executive recommendation delivery packages, interaction metadata, consumer packaging, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles,
    ...EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST.allowedFiles.filter(
      (file) => !EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles.includes(file)
    ),
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngineConstants.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngineTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngineValidation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngineRegistry.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryPresentationBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryInteractionBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEvidenceAggregator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryPackageBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryPipeline.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngine.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngineRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngine.test.ts",
    "docs/app-12-7-recommendation-delivery-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-12/1", "APP-12/2", "APP-12/3", "APP-12/4", "APP-12/5", "APP-12/6"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeRecommendationDeliveryEngine(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationDeliveryEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getRecommendationDeliveryEngineState(timestamp);
}

export function isRecommendationDeliveryEngineInitialized(): boolean {
  return engineInitialized;
}

export function getRecommendationDeliveryEngineState(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationDeliveryEngineState {
  const registry = getRecommendationDeliveryRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-recommendation-delivery-engine",
    contractVersion: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredDeliveryCount: registry.deliveryCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveRecommendationDeliveryEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveRecommendationDeliveryEngineRegistryForTests();
}

function assertEngineReady<T>(): RecommendationDeliveryEngineResult<T> | null {
  const foundationValidation = validateFoundationCompatibilityForDeliveryEngine(
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
  const generationValidation = validateGenerationEngineCompatibilityForDelivery(
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
  const evaluationValidation = validateEvaluationEngineCompatibilityForDelivery(
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
  const explainabilityValidation = validateExplainabilityEngineCompatibilityForDelivery(
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
  const governanceValidation = validateGovernanceEngineCompatibilityForDelivery(
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
  const optimizationValidation = validateOptimizationEngineCompatibility(
    isRecommendationOptimizationEngineInitialized()
  );
  if (!optimizationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:6 Recommendation Optimization Engine is not initialized.",
      data: null,
      error: Object.freeze({ code: "optimization_incompatible", message: "Optimization engine not initialized.", readOnly: true as const }),
      readOnly: true as const,
    });
  }
  if (!isRecommendationDeliveryEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Recommendation Delivery Engine is not initialized.",
      data: null,
      error: Object.freeze({ code: "engine_not_initialized", message: "Engine not initialized.", readOnly: true as const }),
      readOnly: true as const,
    });
  }
  return null;
}

export function prepareExecutiveRecommendationDeliveryWithEngine(
  request: ExecutiveRecommendationDeliveryRequest
): RecommendationDeliveryResult {
  const blocked = assertEngineReady<RecommendationDeliveryResult>();
  if (blocked) {
    const timestamp = request.deliveryTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      deliveries: Object.freeze([]),
      packages: Object.freeze([]),
      registeredDeliveryIds: Object.freeze([]),
      skippedOptimizations: 0,
      pipelineStages: Object.freeze([]),
      deliveryTimestamp: timestamp,
      readOnly: true as const,
    });
  }
  return prepareExecutiveRecommendationDeliveryFromPipeline(request);
}

export {
  prepareExecutiveRecommendationDeliveryWithEngine as prepareExecutiveRecommendationDelivery,
  buildRecommendationDeliveryPackagesFromPipeline as buildRecommendationDeliveryPackages,
  validateRecommendationDelivery,
};
export {
  registerRecommendationDelivery,
  unregisterRecommendationDelivery,
  getRecommendationDelivery,
  getRecommendationDeliveries,
  recommendationDeliveryExists,
  getRecommendationDeliveryRegistrySnapshot,
};
export { validateExecutiveRecommendationDeliveries, validateDeliveryDependencies };
export { runRecommendationDeliveryCertification } from "./executiveRecommendationDeliveryEngineRunner.ts";

export const EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_VERSION =
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION;

export const ExecutiveRecommendationDeliveryEngine = Object.freeze({
  initializeRecommendationDeliveryEngine,
  isRecommendationDeliveryEngineInitialized,
  getRecommendationDeliveryEngineState,
  prepareExecutiveRecommendationDelivery: prepareExecutiveRecommendationDeliveryWithEngine,
  buildRecommendationDeliveryPackages: buildRecommendationDeliveryPackagesFromPipeline,
  validateRecommendationDelivery,
  registerRecommendationDelivery,
  getRecommendationDeliveries,
  getRecommendationDelivery,
  recommendationDeliveryExists,
  resetExecutiveRecommendationDeliveryEngineForTests,
  version: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  generationVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  evaluationVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  explainabilityVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  governanceVersion: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  optimizationVersion: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_RECOMMENDATION_DELIVERY_MANDATORY_DELIVERY_FIELDS,
  tags: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
});
