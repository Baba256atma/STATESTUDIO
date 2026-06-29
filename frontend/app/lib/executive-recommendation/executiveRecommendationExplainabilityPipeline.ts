/**
 * APP-12:4 — Executive Recommendation Explainability Engine deterministic pipeline.
 */

import { EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES } from "./executiveRecommendationExplainabilityEngineConstants.ts";
import { buildRecommendationExplanationsFromEvaluations } from "./executiveRecommendationExplainabilityProfileBuilder.ts";
import { registerRecommendationExplanation } from "./executiveRecommendationExplainabilityEngineRegistry.ts";
import type {
  ExecutiveRecommendationExplainabilityRequest,
  ExplanationResult,
  RecommendationExplanation,
} from "./executiveRecommendationExplainabilityEngineTypes.ts";
import type { RecommendationEvaluation } from "./executiveRecommendationEvaluationEngineTypes.ts";
import {
  validateExplainabilityDependencies,
  validateExecutiveRecommendationExplainabilityRequest,
  validateRecommendationExplanationRecord,
} from "./executiveRecommendationExplainabilityEngineValidation.ts";

function emptyResult(
  request: ExecutiveRecommendationExplainabilityRequest,
  reason: string,
  explanationTimestamp: string
): ExplanationResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    explanations: Object.freeze([]),
    profiles: Object.freeze([]),
    registeredExplanationIds: Object.freeze([]),
    skippedEvaluations: 0,
    pipelineStages: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES,
    explanationTimestamp,
    readOnly: true as const,
  });
}

function sortEvaluationsDeterministically(
  request: ExecutiveRecommendationExplainabilityRequest
): readonly RecommendationEvaluation[] {
  return Object.freeze(
    [...request.evaluations].sort((left, right) =>
      left.recommendationId.localeCompare(right.recommendationId)
    )
  );
}

export function buildRecommendationExplanations(
  request: ExecutiveRecommendationExplainabilityRequest
): readonly RecommendationExplanation[] {
  const explanationTimestamp = request.explanationTimestamp ?? new Date(0).toISOString();
  const sorted = sortEvaluationsDeterministically(request);
  return buildRecommendationExplanationsFromEvaluations(sorted, explanationTimestamp);
}

export function explainExecutiveRecommendations(
  request: ExecutiveRecommendationExplainabilityRequest
): ExplanationResult {
  const explanationTimestamp = request.explanationTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateExecutiveRecommendationExplainabilityRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      explanationTimestamp
    );
  }

  const dependencyValidation = validateExplainabilityDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      explanationTimestamp
    );
  }

  const sorted = sortEvaluationsDeterministically(request);
  const explanations = buildRecommendationExplanationsFromEvaluations(sorted, explanationTimestamp);
  const registeredExplanationIds: string[] = [];
  let skippedEvaluations = 0;

  for (const explanation of explanations) {
    const explanationValidation = validateRecommendationExplanationRecord(explanation);
    if (!explanationValidation.valid) {
      return emptyResult(
        request,
        `Explanation validation failed: ${explanationValidation.issues.map((issue) => issue.message).join("; ")}`,
        explanationTimestamp
      );
    }
    const registration = registerRecommendationExplanation(explanation);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_explanation") {
        skippedEvaluations += 1;
        continue;
      }
      return emptyResult(request, registration.reason, explanationTimestamp);
    }
    registeredExplanationIds.push(explanation.explanationId);
  }

  const registeredExplanations = Object.freeze(
    registeredExplanationIds
      .map((explanationId) => explanations.find((entry) => entry.explanationId === explanationId))
      .filter((entry): entry is RecommendationExplanation => entry !== undefined)
      .sort((left, right) => left.explanationId.localeCompare(right.explanationId))
  );

  const profiles = Object.freeze(registeredExplanations.map((entry) => entry.profile));

  return Object.freeze({
    success: registeredExplanations.length > 0,
    reason:
      registeredExplanations.length > 0
        ? `Explained ${registeredExplanations.length} executive recommendation(s) with deterministic human-readable sections.`
        : "No recommendation explanations were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    explanations: registeredExplanations,
    profiles,
    registeredExplanationIds: Object.freeze(registeredExplanationIds),
    skippedEvaluations,
    pipelineStages: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES,
    explanationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationExplainabilityPipeline = Object.freeze({
  explainExecutiveRecommendations,
  buildRecommendationExplanations,
  stages: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES,
});
