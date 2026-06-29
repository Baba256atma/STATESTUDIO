/**
 * APP-12:3 — Executive Recommendation Evaluation Engine deterministic pipeline.
 */

import { EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES } from "./executiveRecommendationEvaluationEngineConstants.ts";
import { buildRecommendationEvaluationsFromCandidates } from "./executiveRecommendationEvaluationProfileBuilder.ts";
import { registerRecommendationEvaluation } from "./executiveRecommendationEvaluationEngineRegistry.ts";
import type {
  ExecutiveRecommendationEvaluationRequest,
  RecommendationEvaluation,
  RecommendationEvaluationResult,
} from "./executiveRecommendationEvaluationEngineTypes.ts";
import type { RecommendationCandidate } from "./executiveRecommendationGenerationEngineTypes.ts";
import {
  validateEvaluationDependencies,
  validateExecutiveRecommendationEvaluationRequest,
  validateRecommendationEvaluationRecord,
} from "./executiveRecommendationEvaluationEngineValidation.ts";

function emptyResult(
  request: ExecutiveRecommendationEvaluationRequest,
  reason: string,
  evaluationTimestamp: string
): RecommendationEvaluationResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    evaluations: Object.freeze([]),
    profiles: Object.freeze([]),
    registeredEvaluationIds: Object.freeze([]),
    skippedCandidates: 0,
    pipelineStages: EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES,
    evaluationTimestamp,
    readOnly: true as const,
  });
}

function sortCandidatesDeterministically(
  request: ExecutiveRecommendationEvaluationRequest
): readonly RecommendationCandidate[] {
  return Object.freeze(
    [...request.candidates].sort((left, right) =>
      left.recommendationId.localeCompare(right.recommendationId)
    )
  );
}

export function buildRecommendationEvaluations(
  request: ExecutiveRecommendationEvaluationRequest
): readonly RecommendationEvaluation[] {
  const evaluationTimestamp = request.evaluationTimestamp ?? new Date(0).toISOString();
  const sorted = sortCandidatesDeterministically(request);
  return buildRecommendationEvaluationsFromCandidates(sorted, evaluationTimestamp);
}

export function evaluateExecutiveRecommendations(
  request: ExecutiveRecommendationEvaluationRequest
): RecommendationEvaluationResult {
  const evaluationTimestamp = request.evaluationTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateExecutiveRecommendationEvaluationRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      evaluationTimestamp
    );
  }

  const dependencyValidation = validateEvaluationDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      evaluationTimestamp
    );
  }

  const sorted = sortCandidatesDeterministically(request);
  const evaluations = buildRecommendationEvaluationsFromCandidates(sorted, evaluationTimestamp);
  const registeredEvaluationIds: string[] = [];
  let skippedCandidates = 0;

  for (const evaluation of evaluations) {
    const evaluationValidation = validateRecommendationEvaluationRecord(evaluation);
    if (!evaluationValidation.valid) {
      return emptyResult(
        request,
        `Evaluation validation failed: ${evaluationValidation.issues.map((issue) => issue.message).join("; ")}`,
        evaluationTimestamp
      );
    }
    const registration = registerRecommendationEvaluation(evaluation);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_evaluation") {
        skippedCandidates += 1;
        continue;
      }
      return emptyResult(request, registration.reason, evaluationTimestamp);
    }
    registeredEvaluationIds.push(evaluation.evaluationId);
  }

  const registeredEvaluations = Object.freeze(
    registeredEvaluationIds
      .map((evaluationId) => evaluations.find((entry) => entry.evaluationId === evaluationId))
      .filter((entry): entry is RecommendationEvaluation => entry !== undefined)
      .sort((left, right) => left.evaluationId.localeCompare(right.evaluationId))
  );

  const profiles = Object.freeze(registeredEvaluations.map((entry) => entry.profile));

  return Object.freeze({
    success: registeredEvaluations.length > 0,
    reason:
      registeredEvaluations.length > 0
        ? `Evaluated ${registeredEvaluations.length} executive recommendation candidate(s) without ranking.`
        : "No recommendation evaluations were registered.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    evaluations: registeredEvaluations,
    profiles,
    registeredEvaluationIds: Object.freeze(registeredEvaluationIds),
    skippedCandidates,
    pipelineStages: EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES,
    evaluationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationEvaluationPipeline = Object.freeze({
  evaluateExecutiveRecommendations,
  buildRecommendationEvaluations,
  stages: EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES,
});
