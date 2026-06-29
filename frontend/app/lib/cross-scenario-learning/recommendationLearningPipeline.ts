/**
 * APP-10:7 — Recommendation Learning Engine deterministic pipeline.
 */

import { RECOMMENDATION_LEARNING_PIPELINE_STAGES } from "./recommendationLearningEngineConstants.ts";
import {
  buildExecutiveRecommendationHistoryFromGroup,
  groupRecommendationRecords,
} from "./recommendationLearningEvidenceAggregation.ts";
import { normalizeRecommendationRecords } from "./recommendationLearningNormalizer.ts";
import { registerRecommendationProfile } from "./recommendationLearningEngineRegistry.ts";
import type {
  ExecutiveRecommendationHistory,
  RecommendationLearningRequest,
  RecommendationLearningResult,
  RecommendationProfile,
} from "./recommendationLearningEngineTypes.ts";
import {
  validateExecutiveRecommendationHistory,
  validateFailureReferences,
  validateOutcomeReferences,
  validateRecommendationLearningRequest,
  validateSimilarityReferences,
  validateStrategyReferences,
} from "./recommendationLearningEngineValidation.ts";

export function learnHistoricalRecommendations(
  request: RecommendationLearningRequest
): RecommendationLearningResult {
  const learningTimestamp = request.learningTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateRecommendationLearningRequest(request);
  if (!requestValidation.valid) {
    return Object.freeze({
      success: false,
      reason: requestValidation.issues.map((issue) => issue.message).join("; "),
      workspaceId: request.workspaceId,
      learnedRecommendations: Object.freeze([]),
      registeredRecommendationIds: Object.freeze([]),
      pipelineStages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
      learningTimestamp,
      readOnly: true as const,
    });
  }

  for (const record of request.records) {
    const strategyValidation = validateStrategyReferences(record.relatedStrategyIds);
    if (!strategyValidation.valid) {
      return Object.freeze({
        success: false,
        reason: strategyValidation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedRecommendations: Object.freeze([]),
        registeredRecommendationIds: Object.freeze([]),
        pipelineStages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    const similarityValidation = validateSimilarityReferences(record.relatedSimilarityResultIds);
    if (!similarityValidation.valid) {
      return Object.freeze({
        success: false,
        reason: similarityValidation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedRecommendations: Object.freeze([]),
        registeredRecommendationIds: Object.freeze([]),
        pipelineStages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    const outcomeValidation = validateOutcomeReferences(record.relatedOutcomeIds);
    if (!outcomeValidation.valid) {
      return Object.freeze({
        success: false,
        reason: outcomeValidation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedRecommendations: Object.freeze([]),
        registeredRecommendationIds: Object.freeze([]),
        pipelineStages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    const failureValidation = validateFailureReferences(record.relatedFailureIds);
    if (!failureValidation.valid) {
      return Object.freeze({
        success: false,
        reason: failureValidation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedRecommendations: Object.freeze([]),
        registeredRecommendationIds: Object.freeze([]),
        pipelineStages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
  }

  const normalized = normalizeRecommendationRecords(request.records, learningTimestamp);
  const groups = groupRecommendationRecords(normalized);
  const learnedRecommendations: ExecutiveRecommendationHistory[] = [];
  const registeredRecommendationIds: string[] = [];

  for (const group of groups) {
    const history = buildExecutiveRecommendationHistoryFromGroup(group, learningTimestamp);
    const validation = validateExecutiveRecommendationHistory(history);
    if (!validation.valid) {
      return Object.freeze({
        success: false,
        reason: validation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedRecommendations: Object.freeze(learnedRecommendations),
        registeredRecommendationIds: Object.freeze(registeredRecommendationIds),
        pipelineStages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    const registration = registerRecommendationProfile(history);
    if (!registration.success) {
      return Object.freeze({
        success: false,
        reason: registration.reason,
        workspaceId: request.workspaceId,
        learnedRecommendations: Object.freeze(learnedRecommendations),
        registeredRecommendationIds: Object.freeze(registeredRecommendationIds),
        pipelineStages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    learnedRecommendations.push(history);
    registeredRecommendationIds.push(history.profile.recommendationId);
  }

  return Object.freeze({
    success: true,
    reason: `Learned ${learnedRecommendations.length} historical recommendation profile(s).`,
    workspaceId: request.workspaceId,
    learnedRecommendations: Object.freeze(learnedRecommendations),
    registeredRecommendationIds: Object.freeze(registeredRecommendationIds),
    pipelineStages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
    learningTimestamp,
    readOnly: true as const,
  });
}

export function buildRecommendationProfiles(
  request: RecommendationLearningRequest
): readonly RecommendationProfile[] {
  const learningTimestamp = request.learningTimestamp ?? new Date(0).toISOString();
  const normalized = normalizeRecommendationRecords(request.records, learningTimestamp);
  return Object.freeze(
    groupRecommendationRecords(normalized).map(
      (group) => buildExecutiveRecommendationHistoryFromGroup(group, learningTimestamp).profile
    )
  );
}

export const RecommendationLearningPipeline = Object.freeze({
  learnHistoricalRecommendations,
  buildRecommendationProfiles,
  stages: RECOMMENDATION_LEARNING_PIPELINE_STAGES,
});
