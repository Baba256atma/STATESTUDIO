/**
 * APP-12:6 — Executive Recommendation Optimization Engine deterministic pipeline.
 */

import { EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES } from "./executiveRecommendationOptimizationEngineConstants.ts";
import { buildRecommendationOptimizationsFromGovernanceRecords } from "./executiveRecommendationOptimizationProfileBuilder.ts";
import { registerRecommendationOptimization } from "./executiveRecommendationOptimizationEngineRegistry.ts";
import type {
  ExecutiveRecommendationOptimizationRequest,
  RecommendationOptimization,
  RecommendationOptimizationResult,
} from "./executiveRecommendationOptimizationEngineTypes.ts";
import type { RecommendationGovernance } from "./executiveRecommendationGovernanceEngineTypes.ts";
import {
  isGovernanceEligibleForOptimization,
  validateExecutiveRecommendationOptimizationRequest,
  validateOptimizationDependencies,
  validateRecommendationOptimizationRecord,
} from "./executiveRecommendationOptimizationEngineValidation.ts";

function emptyResult(
  request: ExecutiveRecommendationOptimizationRequest,
  reason: string,
  optimizationTimestamp: string
): RecommendationOptimizationResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    optimizations: Object.freeze([]),
    profiles: Object.freeze([]),
    registeredOptimizationIds: Object.freeze([]),
    skippedGovernanceRecords: 0,
    pipelineStages: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES,
    optimizationTimestamp,
    readOnly: true as const,
  });
}

function sortGovernanceDeterministically(
  request: ExecutiveRecommendationOptimizationRequest
): readonly RecommendationGovernance[] {
  return Object.freeze(
    [...request.governanceRecords].sort((left, right) =>
      left.recommendationId.localeCompare(right.recommendationId)
    )
  );
}

export function buildRecommendationOptimizations(
  request: ExecutiveRecommendationOptimizationRequest
): readonly RecommendationOptimization[] {
  const optimizationTimestamp = request.optimizationTimestamp ?? new Date(0).toISOString();
  const sorted = sortGovernanceDeterministically(request);
  return buildRecommendationOptimizationsFromGovernanceRecords(sorted, optimizationTimestamp);
}

export function optimizeExecutiveRecommendations(
  request: ExecutiveRecommendationOptimizationRequest
): RecommendationOptimizationResult {
  const optimizationTimestamp = request.optimizationTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateExecutiveRecommendationOptimizationRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      optimizationTimestamp
    );
  }

  const dependencyValidation = validateOptimizationDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      optimizationTimestamp
    );
  }

  const sorted = sortGovernanceDeterministically(request);
  const eligible = sorted.filter((entry) => isGovernanceEligibleForOptimization(entry));
  let skippedGovernanceRecords = sorted.length - eligible.length;
  const optimizations = buildRecommendationOptimizationsFromGovernanceRecords(eligible, optimizationTimestamp);
  const registeredOptimizationIds: string[] = [];

  for (const optimization of optimizations) {
    const optimizationValidation = validateRecommendationOptimizationRecord(optimization);
    if (!optimizationValidation.valid) {
      return emptyResult(
        request,
        `Optimization validation failed: ${optimizationValidation.issues.map((issue) => issue.message).join("; ")}`,
        optimizationTimestamp
      );
    }
    const registration = registerRecommendationOptimization(optimization);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_optimization") {
        skippedGovernanceRecords += 1;
        continue;
      }
      return emptyResult(request, registration.reason, optimizationTimestamp);
    }
    registeredOptimizationIds.push(optimization.optimizationId);
  }

  const registeredOptimizations = Object.freeze(
    registeredOptimizationIds
      .map((optimizationId) => optimizations.find((entry) => entry.optimizationId === optimizationId))
      .filter((entry): entry is RecommendationOptimization => entry !== undefined)
      .sort((left, right) => left.optimizationId.localeCompare(right.optimizationId))
  );

  const profiles = Object.freeze(registeredOptimizations.map((entry) => entry.profile));

  return Object.freeze({
    success: registeredOptimizations.length > 0,
    reason:
      registeredOptimizations.length > 0
        ? `Optimized ${registeredOptimizations.length} executive recommendation(s) without modifying originals.`
        : "No recommendation optimizations were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    optimizations: registeredOptimizations,
    profiles,
    registeredOptimizationIds: Object.freeze(registeredOptimizationIds),
    skippedGovernanceRecords,
    pipelineStages: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES,
    optimizationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationOptimizationPipeline = Object.freeze({
  optimizeExecutiveRecommendations,
  buildRecommendationOptimizations,
  stages: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES,
});
