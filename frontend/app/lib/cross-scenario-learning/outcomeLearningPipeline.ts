/**
 * APP-10:4 — Outcome Learning Engine deterministic pipeline.
 */

import { OUTCOME_LEARNING_PIPELINE_STAGES } from "./outcomeLearningEngineConstants.ts";
import {
  buildExecutiveOutcomeFromGroup,
  groupOutcomeRecords,
} from "./outcomeLearningEvidenceAggregation.ts";
import { normalizeOutcomeRecords } from "./outcomeLearningNormalizer.ts";
import { registerOutcome } from "./outcomeLearningEngineRegistry.ts";
import type {
  ExecutiveOutcome,
  OutcomeLearningRequest,
  OutcomeLearningResult,
  OutcomeProfile,
} from "./outcomeLearningEngineTypes.ts";
import {
  validateExecutiveOutcome,
  validateOutcomeLearningRequest,
  validatePatternReferences,
  validateSimilarityReferences,
} from "./outcomeLearningEngineValidation.ts";

export function learnHistoricalOutcomes(request: OutcomeLearningRequest): OutcomeLearningResult {
  const learningTimestamp = request.learningTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateOutcomeLearningRequest(request);
  if (!requestValidation.valid) {
    return Object.freeze({
      success: false,
      reason: requestValidation.issues.map((issue) => issue.message).join("; "),
      workspaceId: request.workspaceId,
      learnedOutcomes: Object.freeze([]),
      registeredOutcomeIds: Object.freeze([]),
      pipelineStages: OUTCOME_LEARNING_PIPELINE_STAGES,
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
        learnedOutcomes: Object.freeze([]),
        registeredOutcomeIds: Object.freeze([]),
        pipelineStages: OUTCOME_LEARNING_PIPELINE_STAGES,
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
        learnedOutcomes: Object.freeze([]),
        registeredOutcomeIds: Object.freeze([]),
        pipelineStages: OUTCOME_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
  }

  const normalized = normalizeOutcomeRecords(request.records, learningTimestamp);
  const groups = groupOutcomeRecords(normalized);
  const learnedOutcomes: ExecutiveOutcome[] = [];
  const registeredOutcomeIds: string[] = [];

  for (const group of groups) {
    const outcome = buildExecutiveOutcomeFromGroup(group, learningTimestamp);
    const validation = validateExecutiveOutcome(outcome);
    if (!validation.valid) {
      return Object.freeze({
        success: false,
        reason: validation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedOutcomes: Object.freeze(learnedOutcomes),
        registeredOutcomeIds: Object.freeze(registeredOutcomeIds),
        pipelineStages: OUTCOME_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    const registration = registerOutcome(outcome);
    if (!registration.success) {
      return Object.freeze({
        success: false,
        reason: registration.reason,
        workspaceId: request.workspaceId,
        learnedOutcomes: Object.freeze(learnedOutcomes),
        registeredOutcomeIds: Object.freeze(registeredOutcomeIds),
        pipelineStages: OUTCOME_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    learnedOutcomes.push(outcome);
    registeredOutcomeIds.push(outcome.outcome.outcomeId);
  }

  return Object.freeze({
    success: true,
    reason: `Learned ${learnedOutcomes.length} historical outcome profile(s).`,
    workspaceId: request.workspaceId,
    learnedOutcomes: Object.freeze(learnedOutcomes),
    registeredOutcomeIds: Object.freeze(registeredOutcomeIds),
    pipelineStages: OUTCOME_LEARNING_PIPELINE_STAGES,
    learningTimestamp,
    readOnly: true as const,
  });
}

export function buildOutcomeProfiles(request: OutcomeLearningRequest): readonly OutcomeProfile[] {
  const learningTimestamp = request.learningTimestamp ?? new Date(0).toISOString();
  const normalized = normalizeOutcomeRecords(request.records, learningTimestamp);
  return Object.freeze(
    groupOutcomeRecords(normalized).map((group) => buildExecutiveOutcomeFromGroup(group, learningTimestamp).outcome)
  );
}

export const OutcomeLearningPipeline = Object.freeze({
  learnHistoricalOutcomes,
  buildOutcomeProfiles,
  stages: OUTCOME_LEARNING_PIPELINE_STAGES,
});
