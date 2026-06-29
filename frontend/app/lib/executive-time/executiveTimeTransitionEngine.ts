/**
 * APP-1:5 — Executive Time Transition Engine.
 * Orchestration layer for temporal state transitions — never mutates entity state directly.
 */

import { applyApprovedTransition } from "./executiveTimeStateMutation.ts";
import { authorizeTransition, requestTransition, validateTransition } from "./executiveTimeTransitionAuthority.ts";
import type {
  ExecutiveTimeTransitionAuthorityResult,
  ExecutiveTimeTransitionRequest,
  ExecutiveTimeStateMutationResult,
} from "./executiveTimeTransitionAuthorityTypes.ts";
import type {
  ExecutiveTimeTransitionDecision,
  ExecutiveTimeTransitionEvaluationRequest,
  ExecutiveTimeTransitionEvaluationResult,
} from "./executiveTimeTransitionResolver.ts";
import {
  evaluateTransition,
  resolveAvailableTransitions,
  resolveBlockedTransitions,
  resolveTransition,
  resolveTransitionDependencies,
  resolveTransitionExplanation,
  resolveTransitionPolicyForEntity,
} from "./executiveTimeTransitionResolver.ts";

export type ExecutiveTimeTransitionOrchestrationResult = Readonly<{
  decision: ExecutiveTimeTransitionDecision;
  authorityResult: ExecutiveTimeTransitionAuthorityResult;
  explanation: string;
}>;

function toAuthorityRequest(
  input: ExecutiveTimeTransitionEvaluationRequest,
  approvalRequired: boolean
): ExecutiveTimeTransitionRequest {
  return Object.freeze({
    workspaceId: input.workspaceId,
    entityId: input.entityId,
    entityType: input.entityType,
    currentState: input.currentState,
    requestedState: input.targetState,
    actor: input.actor,
    transitionReason: input.transitionReason,
    requiresApproval: approvalRequired,
    approvalGranted: input.approvalGranted,
    metadata: Object.freeze({
      requiredDependencies: input.requiredDependencies,
      ...(input.metadata ?? {}),
    }),
  });
}

/**
 * Orchestrates validation in strict order:
 * entity → current state → target state → policy → dependencies → approval → decision.
 * Does not mutate state.
 */
export function orchestrateTransition(input: ExecutiveTimeTransitionEvaluationRequest): ExecutiveTimeTransitionOrchestrationResult {
  const decision = resolveTransition(input);
  const authorityRequest = toAuthorityRequest(input, decision.approvalResult.approvalRequired);
  const authorityResult = decision.approved ? authorizeTransition(authorityRequest) : validateTransition(authorityRequest);

  const combinedApproved = decision.approved && authorityResult.approved;
  const finalDecision = Object.freeze({
    ...decision,
    approved: combinedApproved,
    rejected: !combinedApproved,
    blockingIssues: Object.freeze(
      combinedApproved
        ? decision.blockingIssues
        : [...decision.blockingIssues, ...authorityResult.validationMessages]
    ),
    explanation: combinedApproved
      ? resolveTransitionExplanation({ ...decision, approved: true, rejected: false })
      : resolveTransitionExplanation({ ...decision, approved: false, rejected: true }),
  });

  return Object.freeze({
    decision: finalDecision,
    authorityResult,
    explanation: finalDecision.explanation,
  });
}

/**
 * Applies transition only when orchestration and authority both approve.
 * Mutation occurs exclusively via State Engine.applyApprovedTransition().
 */
export function applyOrchestratedTransition(input: {
  orchestration: ExecutiveTimeTransitionOrchestrationResult;
  actor: string;
  timestamp: string;
}): ExecutiveTimeStateMutationResult {
  if (!input.orchestration.decision.approved || input.orchestration.authorityResult.rejected) {
    return applyApprovedTransition({
      authorityResult: Object.freeze({
        ...input.orchestration.authorityResult,
        approved: false,
        rejected: true,
        reason: "Orchestration rejected transition.",
      }),
      actor: input.actor,
      timestamp: input.timestamp,
    });
  }
  return applyApprovedTransition({
    authorityResult: input.orchestration.authorityResult,
    actor: input.actor,
    timestamp: input.timestamp,
  });
}

export const ExecutiveTimeTransitionEngine = Object.freeze({
  evaluateTransition,
  orchestrateTransition,
  applyOrchestratedTransition,
  requestTransitionAuthority: requestTransition,
  resolveTransition,
  resolveAvailableTransitions,
  resolveBlockedTransitions,
  resolveTransitionPolicy: resolveTransitionPolicyForEntity,
  resolveTransitionDependencies,
  resolveTransitionExplanation,
});

export {
  evaluateTransition,
  resolveAvailableTransitions,
  resolveBlockedTransitions,
  resolveTransition,
  resolveTransitionDependencies,
  resolveTransitionExplanation,
  resolveTransitionPolicyForEntity as resolveTransitionPolicy,
};

export type {
  ExecutiveTimeTransitionDecision,
  ExecutiveTimeTransitionEvaluationRequest,
  ExecutiveTimeTransitionEvaluationResult,
};
