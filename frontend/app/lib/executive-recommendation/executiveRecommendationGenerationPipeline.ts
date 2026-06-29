/**
 * APP-12:2 — Executive Recommendation Generation Engine deterministic pipeline.
 */

import { EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES } from "./executiveRecommendationGenerationEngineConstants.ts";
import {
  buildExecutiveRecommendationFromCandidate,
  buildRecommendationCandidatesFromRecords,
} from "./executiveRecommendationGenerationCandidateBuilder.ts";
import {
  normalizeRecommendationSourceRecords,
  sortNormalizedRecordsDeterministically,
} from "./executiveRecommendationGenerationNormalizer.ts";
import { registerRecommendationCandidate } from "./executiveRecommendationGenerationEngineRegistry.ts";
import type {
  ExecutiveRecommendation,
  ExecutiveRecommendationGenerationRequest,
  RecommendationCandidate,
  RecommendationGenerationResult,
} from "./executiveRecommendationGenerationEngineTypes.ts";
import {
  validateExecutiveRecommendation,
  validateExecutiveRecommendationGenerationRequest,
  validateGenerationDependencies,
  validateRecommendationCandidate,
} from "./executiveRecommendationGenerationEngineValidation.ts";

function emptyResult(
  request: ExecutiveRecommendationGenerationRequest,
  reason: string,
  generationTimestamp: string
): RecommendationGenerationResult {
  return Object.freeze({
    success: false,
    reason,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    recommendations: Object.freeze([]),
    candidates: Object.freeze([]),
    registeredRecommendationIds: Object.freeze([]),
    skippedRecords: 0,
    pipelineStages: EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES,
    generationTimestamp,
    readOnly: true as const,
  });
}

export function buildRecommendationCandidates(
  request: ExecutiveRecommendationGenerationRequest
): readonly RecommendationCandidate[] {
  const generationTimestamp = request.generationTimestamp ?? new Date(0).toISOString();
  const normalized = sortNormalizedRecordsDeterministically(
    normalizeRecommendationSourceRecords(request.sourceRecords)
  );
  return buildRecommendationCandidatesFromRecords(normalized, generationTimestamp);
}

export function generateExecutiveRecommendations(
  request: ExecutiveRecommendationGenerationRequest
): RecommendationGenerationResult {
  const generationTimestamp = request.generationTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateExecutiveRecommendationGenerationRequest(request);
  if (!requestValidation.valid) {
    return emptyResult(
      request,
      requestValidation.issues.map((issue) => issue.message).join("; "),
      generationTimestamp
    );
  }

  const dependencyValidation = validateGenerationDependencies();
  if (!dependencyValidation.valid) {
    return emptyResult(
      request,
      dependencyValidation.issues.map((issue) => issue.message).join("; "),
      generationTimestamp
    );
  }

  const normalized = sortNormalizedRecordsDeterministically(
    normalizeRecommendationSourceRecords(request.sourceRecords)
  );
  const candidates = buildRecommendationCandidatesFromRecords(normalized, generationTimestamp);
  const registeredRecommendationIds: string[] = [];
  let skippedRecords = 0;

  for (const candidate of candidates) {
    const candidateValidation = validateRecommendationCandidate(candidate);
    if (!candidateValidation.valid) {
      return emptyResult(
        request,
        `Candidate validation failed: ${candidateValidation.issues.map((issue) => issue.message).join("; ")}`,
        generationTimestamp
      );
    }
    const registration = registerRecommendationCandidate(candidate);
    if (!registration.success) {
      if (registration.error?.code === "duplicate_candidate") {
        skippedRecords += 1;
        continue;
      }
      return emptyResult(request, registration.reason, generationTimestamp);
    }
    registeredRecommendationIds.push(candidate.recommendationId);
  }

  const registeredCandidates = Object.freeze(
    registeredRecommendationIds
      .map((recommendationId) => candidates.find((entry) => entry.recommendationId === recommendationId))
      .filter((entry): entry is RecommendationCandidate => entry !== undefined)
      .sort((left, right) => left.recommendationId.localeCompare(right.recommendationId))
  );

  const recommendations = Object.freeze(
    registeredCandidates.map((candidate) => buildExecutiveRecommendationFromCandidate(candidate))
  );

  for (const recommendation of recommendations) {
    const recommendationValidation = validateExecutiveRecommendation(recommendation);
    if (!recommendationValidation.valid) {
      return emptyResult(
        request,
        `Recommendation validation failed: ${recommendationValidation.issues.map((issue) => issue.message).join("; ")}`,
        generationTimestamp
      );
    }
  }

  return Object.freeze({
    success: recommendations.length > 0,
    reason:
      recommendations.length > 0
        ? `Generated ${recommendations.length} executive recommendation candidate(s) from certified sources.`
        : "No recommendation candidates were registered from certified sources.",
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    recommendations,
    candidates: registeredCandidates,
    registeredRecommendationIds: Object.freeze(registeredRecommendationIds),
    skippedRecords,
    pipelineStages: EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES,
    generationTimestamp,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationGenerationPipeline = Object.freeze({
  generateExecutiveRecommendations,
  buildRecommendationCandidates,
  stages: EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES,
});
