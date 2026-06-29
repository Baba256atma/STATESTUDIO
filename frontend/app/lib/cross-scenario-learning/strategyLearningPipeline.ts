/**
 * APP-10:6 — Strategy Learning Engine deterministic pipeline.
 */

import { STRATEGY_LEARNING_PIPELINE_STAGES } from "./strategyLearningEngineConstants.ts";
import {
  buildExecutiveStrategyFromGroup,
  groupStrategyRecords,
} from "./strategyLearningEvidenceAggregation.ts";
import { normalizeStrategyRecords } from "./strategyLearningNormalizer.ts";
import { registerStrategy } from "./strategyLearningEngineRegistry.ts";
import type {
  ExecutiveStrategy,
  StrategyLearningRequest,
  StrategyLearningResult,
  StrategyProfile,
} from "./strategyLearningEngineTypes.ts";
import {
  validateExecutiveStrategy,
  validateFailureReferences,
  validateOutcomeReferences,
  validatePatternReferences,
  validateSimilarityReferences,
  validateStrategyLearningRequest,
} from "./strategyLearningEngineValidation.ts";

export function learnHistoricalStrategies(request: StrategyLearningRequest): StrategyLearningResult {
  const learningTimestamp = request.learningTimestamp ?? new Date(0).toISOString();

  const requestValidation = validateStrategyLearningRequest(request);
  if (!requestValidation.valid) {
    return Object.freeze({
      success: false,
      reason: requestValidation.issues.map((issue) => issue.message).join("; "),
      workspaceId: request.workspaceId,
      learnedStrategies: Object.freeze([]),
      registeredStrategyIds: Object.freeze([]),
      pipelineStages: STRATEGY_LEARNING_PIPELINE_STAGES,
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
        learnedStrategies: Object.freeze([]),
        registeredStrategyIds: Object.freeze([]),
        pipelineStages: STRATEGY_LEARNING_PIPELINE_STAGES,
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
        learnedStrategies: Object.freeze([]),
        registeredStrategyIds: Object.freeze([]),
        pipelineStages: STRATEGY_LEARNING_PIPELINE_STAGES,
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
        learnedStrategies: Object.freeze([]),
        registeredStrategyIds: Object.freeze([]),
        pipelineStages: STRATEGY_LEARNING_PIPELINE_STAGES,
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
        learnedStrategies: Object.freeze([]),
        registeredStrategyIds: Object.freeze([]),
        pipelineStages: STRATEGY_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
  }

  const normalized = normalizeStrategyRecords(request.records, learningTimestamp);
  const groups = groupStrategyRecords(normalized);
  const learnedStrategies: ExecutiveStrategy[] = [];
  const registeredStrategyIds: string[] = [];

  for (const group of groups) {
    const strategy = buildExecutiveStrategyFromGroup(group, learningTimestamp);
    const validation = validateExecutiveStrategy(strategy);
    if (!validation.valid) {
      return Object.freeze({
        success: false,
        reason: validation.issues.map((issue) => issue.message).join("; "),
        workspaceId: request.workspaceId,
        learnedStrategies: Object.freeze(learnedStrategies),
        registeredStrategyIds: Object.freeze(registeredStrategyIds),
        pipelineStages: STRATEGY_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    const registration = registerStrategy(strategy);
    if (!registration.success) {
      return Object.freeze({
        success: false,
        reason: registration.reason,
        workspaceId: request.workspaceId,
        learnedStrategies: Object.freeze(learnedStrategies),
        registeredStrategyIds: Object.freeze(registeredStrategyIds),
        pipelineStages: STRATEGY_LEARNING_PIPELINE_STAGES,
        learningTimestamp,
        readOnly: true as const,
      });
    }
    learnedStrategies.push(strategy);
    registeredStrategyIds.push(strategy.strategy.strategyId);
  }

  return Object.freeze({
    success: true,
    reason: `Learned ${learnedStrategies.length} historical strategy profile(s).`,
    workspaceId: request.workspaceId,
    learnedStrategies: Object.freeze(learnedStrategies),
    registeredStrategyIds: Object.freeze(registeredStrategyIds),
    pipelineStages: STRATEGY_LEARNING_PIPELINE_STAGES,
    learningTimestamp,
    readOnly: true as const,
  });
}

export function buildStrategyProfiles(request: StrategyLearningRequest): readonly StrategyProfile[] {
  const learningTimestamp = request.learningTimestamp ?? new Date(0).toISOString();
  const normalized = normalizeStrategyRecords(request.records, learningTimestamp);
  return Object.freeze(
    groupStrategyRecords(normalized).map((group) => buildExecutiveStrategyFromGroup(group, learningTimestamp).strategy)
  );
}

export const StrategyLearningPipeline = Object.freeze({
  learnHistoricalStrategies,
  buildStrategyProfiles,
  stages: STRATEGY_LEARNING_PIPELINE_STAGES,
});
