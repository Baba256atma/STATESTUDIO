/**
 * APP-1:6 — Executive Time Priority Engine.
 * Sole authority for Executive Time Priority evaluation — never mutates entities.
 */

import {
  EXECUTIVE_TIME_PRIORITY_FUTURE_INTEGRATIONS,
  EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES,
  explainPriority,
  resolvePolicy,
  validatePolicy,
} from "./executiveTimePriorityAuthority.ts";
import type {
  ExecutiveTimePriorityEngineContract,
  ExecutiveTimePriorityEvaluationRequest,
  ExecutiveTimePriorityExplanation,
  ExecutiveTimePriorityPolicyDefinition,
  ExecutiveTimePriorityPolicyValidationResult,
  ExecutiveTimePriorityResult,
} from "./executiveTimePriorityAuthorityTypes.ts";
import { EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER } from "./executiveTimePriorityAuthorityTypes.ts";
import {
  EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION,
  runExecutiveTimePriorityEvaluation,
  runExecutiveTimePriorityEvaluationBatch,
} from "./executiveTimePriorityEvaluation.ts";
import {
  EXECUTIVE_TIME_PRIORITY_ESCALATION_DEFINITIONS,
  resolveEscalationDefinition,
  resolveEscalationLevel,
} from "./executiveTimePriorityEscalation.ts";
import {
  explainPriorityResult,
  resolveHighestPriority,
  resolvePriorityDistribution,
  resolvePriorityGroup,
  resolvePriorityStatistics,
} from "./executiveTimePriorityResolver.ts";

export type ExecutiveTimePriorityEngineFutureIntegrations = typeof EXECUTIVE_TIME_PRIORITY_FUTURE_INTEGRATIONS;

export function evaluatePriority(request: ExecutiveTimePriorityEvaluationRequest): ExecutiveTimePriorityResult {
  return runExecutiveTimePriorityEvaluation(request);
}

export function evaluateMultiple(
  requests: readonly ExecutiveTimePriorityEvaluationRequest[]
): readonly ExecutiveTimePriorityResult[] {
  return runExecutiveTimePriorityEvaluationBatch(requests);
}

export const ExecutiveTimePriorityEngine = Object.freeze({
  evaluatePriority,
  evaluateMultiple,
  validatePolicy,
  resolvePolicy,
  explainPriority,
  explainPriorityResult,
  resolveHighestPriority,
  resolvePriorityGroup,
  resolvePriorityDistribution,
  resolvePriorityStatistics,
  resolveEscalationLevel,
  resolveEscalationDefinition,
});

export const ExecutiveTimePriorityEngineContractImpl: ExecutiveTimePriorityEngineContract = Object.freeze({
  evaluationOwner: EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER,
  evaluatePriority,
  evaluateMultiple,
  validatePolicy,
  resolvePolicy,
  explainPriority,
});

export {
  EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION,
  EXECUTIVE_TIME_PRIORITY_ESCALATION_DEFINITIONS,
  EXECUTIVE_TIME_PRIORITY_FUTURE_INTEGRATIONS,
  EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES,
  explainPriorityResult,
  resolveEscalationDefinition,
  resolveEscalationLevel,
  resolveHighestPriority,
  resolvePriorityDistribution,
  resolvePriorityGroup,
  resolvePriorityStatistics,
};

export type {
  ExecutiveTimePriorityEvaluationRequest,
  ExecutiveTimePriorityExplanation,
  ExecutiveTimePriorityPolicyDefinition,
  ExecutiveTimePriorityPolicyValidationResult,
  ExecutiveTimePriorityResult,
};
