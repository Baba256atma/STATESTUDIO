/**
 * APP-12:5 — Executive Recommendation Governance Engine.
 * Deterministic governance validation for explained recommendations.
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
import {
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST,
  isRecommendationExplainabilityEngineInitialized,
} from "./executiveRecommendationExplainabilityEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import { isRecommendationGenerationEngineInitialized } from "./executiveRecommendationGenerationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_TAGS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_MANDATORY_GOVERNANCE_FIELDS,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import {
  buildRecommendationGovernanceProfiles as buildRecommendationGovernanceProfilesFromPipeline,
  validateExecutiveRecommendationGovernance as validateExecutiveRecommendationGovernanceFromPipeline,
} from "./executiveRecommendationGovernancePipeline.ts";
import {
  getRecommendationGovernance,
  getRecommendationGovernances,
  getRecommendationGovernanceRegistrySnapshot,
  recommendationGovernanceExists,
  registerRecommendationGovernance,
  resetExecutiveRecommendationGovernanceEngineRegistryForTests,
  unregisterRecommendationGovernance,
} from "./executiveRecommendationGovernanceEngineRegistry.ts";
import type {
  ExecutiveRecommendationGovernanceEngineState,
  ExecutiveRecommendationGovernanceRequest,
  RecommendationGovernanceEngineResult,
  RecommendationGovernanceResult,
} from "./executiveRecommendationGovernanceEngineTypes.ts";
import {
  validateEvaluationEngineCompatibilityForGovernance,
  validateExplainabilityEngineCompatibility,
  validateFoundationCompatibilityForGovernanceEngine,
  validateGenerationEngineCompatibilityForGovernance,
  validateGovernanceDependencies,
  validateRecommendationGovernance,
  validateRecommendationGovernances,
} from "./executiveRecommendationGovernanceEngineValidation.ts";

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/5",
  title: "Executive Recommendation Constraint & Governance Engine",
  goal: "Deterministic executive recommendation governance validation, constraint and policy checks, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles,
    ...EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST.allowedFiles.filter(
      (file) => !EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles.includes(file)
    ),
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngineConstants.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngineTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngineValidation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngineRegistry.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceDimensionEvaluator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceConstraintPolicyValidator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEvidenceAggregator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceProfileBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernancePipeline.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngine.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngineRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngine.test.ts",
    "docs/app-12-5-recommendation-governance-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-12/1", "APP-12/2", "APP-12/3", "APP-12/4"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeRecommendationGovernanceEngine(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationGovernanceEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getRecommendationGovernanceEngineState(timestamp);
}

export function isRecommendationGovernanceEngineInitialized(): boolean {
  return engineInitialized;
}

export function getRecommendationGovernanceEngineState(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationGovernanceEngineState {
  const registry = getRecommendationGovernanceRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-recommendation-governance-engine",
    contractVersion: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredGovernanceCount: registry.governanceCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveRecommendationGovernanceEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveRecommendationGovernanceEngineRegistryForTests();
}

function assertEngineReady<T>(): RecommendationGovernanceEngineResult<T> | null {
  const foundationValidation = validateFoundationCompatibilityForGovernanceEngine(
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
  const generationValidation = validateGenerationEngineCompatibilityForGovernance(
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
  const evaluationValidation = validateEvaluationEngineCompatibilityForGovernance(
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
  const explainabilityValidation = validateExplainabilityEngineCompatibility(
    isRecommendationExplainabilityEngineInitialized()
  );
  if (!explainabilityValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-12:4 Recommendation Explainability Engine is not initialized.",
      data: null,
      error: Object.freeze({
        code: "explainability_incompatible",
        message: "Explainability engine not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (!isRecommendationGovernanceEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Recommendation Governance Engine is not initialized.",
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

export function validateExecutiveRecommendationGovernanceWithEngine(
  request: ExecutiveRecommendationGovernanceRequest
): RecommendationGovernanceResult {
  const blocked = assertEngineReady<RecommendationGovernanceResult>();
  if (blocked) {
    const timestamp = request.governanceTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      governanceRecords: Object.freeze([]),
      profiles: Object.freeze([]),
      registeredGovernanceIds: Object.freeze([]),
      skippedExplanations: 0,
      pipelineStages: Object.freeze([]),
      governanceTimestamp: timestamp,
      readOnly: true as const,
    });
  }
  return validateExecutiveRecommendationGovernanceFromPipeline(request);
}

export {
  validateExecutiveRecommendationGovernanceWithEngine as validateExecutiveRecommendationGovernance,
  buildRecommendationGovernanceProfilesFromPipeline as buildRecommendationGovernanceProfiles,
  validateRecommendationGovernance,
};
export {
  registerRecommendationGovernance,
  unregisterRecommendationGovernance,
  getRecommendationGovernance,
  getRecommendationGovernances,
  recommendationGovernanceExists,
  getRecommendationGovernanceRegistrySnapshot,
};
export { validateRecommendationGovernances, validateGovernanceDependencies };
export { runRecommendationGovernanceCertification } from "./executiveRecommendationGovernanceEngineRunner.ts";

export const EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_VERSION =
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION;

export const ExecutiveRecommendationGovernanceEngine = Object.freeze({
  initializeRecommendationGovernanceEngine,
  isRecommendationGovernanceEngineInitialized,
  getRecommendationGovernanceEngineState,
  validateExecutiveRecommendationGovernance: validateExecutiveRecommendationGovernanceWithEngine,
  buildRecommendationGovernanceProfiles: buildRecommendationGovernanceProfilesFromPipeline,
  validateRecommendationGovernance,
  registerRecommendationGovernance,
  getRecommendationGovernances,
  getRecommendationGovernance,
  recommendationGovernanceExists,
  resetExecutiveRecommendationGovernanceEngineForTests,
  version: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  generationVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  evaluationVersion: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  explainabilityVersion: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_RECOMMENDATION_GOVERNANCE_MANDATORY_GOVERNANCE_FIELDS,
  tags: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
});
