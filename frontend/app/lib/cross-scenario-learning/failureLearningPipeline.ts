/**
 * APP-10:5 — Failure Learning Engine deterministic pipeline.
 */

import { FAILURE_LEARNING_PIPELINE_STAGES } from "./failureLearningEngineConstants.ts";
import {
  buildExecutiveFailureFromGroup,
  groupFailureRecords,
} from "./failureLearningEvidenceAggregation.ts";
import { normalizeFailureRecords } from "./failureLearningNormalizer.ts";
import { registerFailure } from "./failureLearningEngineRegistry.ts";
import type {
  ExecutiveFailure,
  FailureLearningRequest,
  FailureLearningResult,
  FailureProfile,
} from "./failureLearningEngineTypes.ts";
import {
  validateExecutiveFailure,
  validateFailureLearningRequest,
  validateOutcomeReferences,
  validatePatternReferences,
  validateSimilarityReferences,
} from "./failureLearningEngineValidation.ts";

export function learnHistoricalFailures(request: FailureLearningRequest): FailureLearningResult {
  const learningTimestamp = request.learningTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateFailureLearningRequest(request);
  if (!requestValidation.valid) {
    return Object.freeze({
      success: false,
      reason: requestValidation.issues.map((issue) => issue.message).join("; "),
      workspaceId: request.workspaceId,
      learnedFailures: Object.freeze([]),
      registeredFailureIds: Object.freeze([]),
      pipelineStages: FAILURE_LEARNING_PIPELINE_STAGES,
      learningTimestamp,
      readOnly: true as const,
    });
  }

  for (const record of request.records) {
    const patternValidation = validatePatternReferences(record.relatedPatternIds);
    if (!patternValidation.valid) {
      return Object.freeze({
        success: false,
        reason: patternValidation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedFailures: Object.freeze([]),
        registeredFailureIds: Object.freeze([]),
        pipelineStages: FAILURE_LEARNING_PIPELINE_STAGES,
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
        learnedFailures: Object.freeze([]),
        registeredFailureIds: Object.freeze([]),
        pipelineStages: FAILURE_LEARNING_PIPELINE_STAGES,
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
        learnedFailures: Object.freeze([]),
        registeredFailureIds: Object.freeze([]),
        pipelineStages: FAILURE_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
  }

  const normalized = normalizeFailureRecords(request.records, learningTimestamp);
  const groups = groupFailureRecords(normalized);
  const learnedFailures: ExecutiveFailure[] = [];
  const registeredFailureIds: string[] = [];

  for (const group of groups) {
    const failure = buildExecutiveFailureFromGroup(group, learningTimestamp);
    const validation = validateExecutiveFailure(failure);
    if (!validation.valid) {
      return Object.freeze({
        success: false,
        reason: validation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedFailures: Object.freeze(learnedFailures),
        registeredFailureIds: Object.freeze(registeredFailureIds),
        pipelineStages: FAILURE_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    const registration = registerFailure(failure);
    if (!registration.success) {
      return Object.freeze({
        success: false,
        reason: registration.reason,
        workspaceId: request.workspaceId,
        learnedFailures: Object.freeze(learnedFailures),
        registeredFailureIds: Object.freeze(registeredFailureIds),
        pipelineStages: FAILURE_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    learnedFailures.push(failure);
    registeredFailureIds.push(failure.failure.failureId);
  }

  return Object.freeze({
    success: true,
    reason: `Learned ${learnedFailures.length} historical failure profile(s).`,
    workspaceId: request.workspaceId,
    learnedFailures: Object.freeze(learnedFailures),
    registeredFailureIds: Object.freeze(registeredFailureIds),
    pipelineStages: FAILURE_LEARNING_PIPELINE_STAGES,
    learningTimestamp,
    readOnly: true as const,
  });
}

export function buildFailureProfiles(request: FailureLearningRequest): readonly FailureProfile[] {
  const learningTimestamp = request.learningTimestamp ?? new Date(0).toISOString();
  const normalized = normalizeFailureRecords(request.records, learningTimestamp);
  return Object.freeze(
    groupFailureRecords(normalized).map((group) => buildExecutiveFailureFromGroup(group, learningTimestamp).failure)
  );
}

export const FailureLearningPipeline = Object.freeze({
  learnHistoricalFailures,
  buildFailureProfiles,
  stages: FAILURE_LEARNING_PIPELINE_STAGES,
});
