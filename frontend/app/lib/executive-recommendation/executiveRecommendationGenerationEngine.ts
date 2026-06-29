/**
 * APP-12:2 — Executive Recommendation Generation Engine.
 * Deterministic executive recommendation candidate generation from certified platform sources.
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
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_TAGS,
  EXECUTIVE_RECOMMENDATION_GENERATION_MANDATORY_CANDIDATE_FIELDS,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import {
  buildRecommendationCandidates as buildRecommendationCandidatesFromPipeline,
  generateExecutiveRecommendations as generateExecutiveRecommendationsFromPipeline,
} from "./executiveRecommendationGenerationPipeline.ts";
import {
  getRecommendationCandidate,
  getRecommendationCandidates,
  getRecommendationRegistrySnapshot,
  recommendationCandidateExists,
  registerRecommendationCandidate,
  resetExecutiveRecommendationGenerationEngineRegistryForTests,
  unregisterRecommendationCandidate,
} from "./executiveRecommendationGenerationEngineRegistry.ts";
import type {
  ExecutiveRecommendationGenerationEngineState,
  ExecutiveRecommendationGenerationRequest,
  RecommendationGenerationEngineResult,
  RecommendationGenerationResult,
} from "./executiveRecommendationGenerationEngineTypes.ts";
import {
  validateExecutiveRecommendation,
  validateExecutiveRecommendations,
  validateFoundationCompatibilityForEngine,
  validateRecommendationGeneration,
} from "./executiveRecommendationGenerationEngineValidation.ts";

export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/2",
  title: "Executive Recommendation Generation Engine",
  goal: "Deterministic executive recommendation candidate generation, evidence aggregation, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngineConstants.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngineTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngineValidation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngineRegistry.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationNormalizer.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEvidenceAggregator.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationCandidateBuilder.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationPipeline.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngine.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngineRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngine.test.ts",
    "docs/app-12-2-recommendation-generation-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-12/1"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeRecommendationGenerationEngine(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationGenerationEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getRecommendationGenerationEngineState(timestamp);
}

export function isRecommendationGenerationEngineInitialized(): boolean {
  return engineInitialized;
}

export function getRecommendationGenerationEngineState(
  timestamp: string = engineTimestamp
): ExecutiveRecommendationGenerationEngineState {
  const registry = getRecommendationRegistrySnapshot();
  return Object.freeze({
    engineId: "executive-recommendation-generation-engine",
    contractVersion: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredCandidateCount: registry.candidateCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveRecommendationGenerationEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveRecommendationGenerationEngineRegistryForTests();
}

function assertEngineReady<T>(): RecommendationGenerationEngineResult<T> | null {
  const foundationValidation = validateFoundationCompatibilityForEngine(
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
  if (!isRecommendationGenerationEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Recommendation Generation Engine is not initialized.",
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

export function generateExecutiveRecommendationsWithEngine(
  request: ExecutiveRecommendationGenerationRequest
): RecommendationGenerationResult {
  const blocked = assertEngineReady<RecommendationGenerationResult>();
  if (blocked) {
    const timestamp = request.generationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      recommendations: Object.freeze([]),
      candidates: Object.freeze([]),
      registeredRecommendationIds: Object.freeze([]),
      skippedRecords: 0,
      pipelineStages: Object.freeze([]),
      generationTimestamp: timestamp,
      readOnly: true as const,
    });
  }
  return generateExecutiveRecommendationsFromPipeline(request);
}

export {
  generateExecutiveRecommendationsWithEngine as generateExecutiveRecommendations,
  buildRecommendationCandidatesFromPipeline as buildRecommendationCandidates,
  validateRecommendationGeneration,
};
export {
  registerRecommendationCandidate,
  unregisterRecommendationCandidate,
  getRecommendationCandidate,
  getRecommendationCandidates,
  recommendationCandidateExists,
  getRecommendationRegistrySnapshot,
};
export { validateExecutiveRecommendation, validateExecutiveRecommendations };
export { runRecommendationGenerationCertification } from "./executiveRecommendationGenerationEngineRunner.ts";

export const EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_VERSION =
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION;

export const ExecutiveRecommendationGenerationEngine = Object.freeze({
  initializeRecommendationGenerationEngine,
  isRecommendationGenerationEngineInitialized,
  getRecommendationGenerationEngineState,
  generateExecutiveRecommendations: generateExecutiveRecommendationsWithEngine,
  buildRecommendationCandidates: buildRecommendationCandidatesFromPipeline,
  validateRecommendationGeneration,
  registerRecommendationCandidate,
  getRecommendationCandidates,
  getRecommendationCandidate,
  recommendationCandidateExists,
  resetExecutiveRecommendationGenerationEngineForTests,
  version: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_RECOMMENDATION_GENERATION_MANDATORY_CANDIDATE_FIELDS,
  tags: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
});
