/**
 * APP-1:4.5 — Executive Time Transition Authority.
 * Validation and authorization only — never mutates entity state.
 */

import {
  canTransition,
  isEditable,
  isKnownEntity,
  isKnownState,
  isTerminal,
  validateExecutiveTimeStateTransition,
} from "./executiveTimeStateResolver.ts";
import type {
  ExecutiveTimeTransitionAuthorityResult,
  ExecutiveTimeTransitionDecisionExplanation,
  ExecutiveTimeTransitionFutureIntegrations,
  ExecutiveTimeTransitionOwnershipRules,
  ExecutiveTimeTransitionRequest,
} from "./executiveTimeTransitionAuthorityTypes.ts";
import { EXECUTIVE_TIME_TRANSITION_AUTHORITY_VERSION } from "./executiveTimeTransitionAuthorityTypes.ts";

export const EXECUTIVE_TIME_TRANSITION_OWNERSHIP_RULES: ExecutiveTimeTransitionOwnershipRules = Object.freeze({
  stateEngineOwns: Object.freeze([
    "current_state",
    "state_storage",
    "state_mutation",
    "lifecycle_order",
  ]),
  transitionEngineOwns: Object.freeze([
    "transition_validation",
    "transition_authorization",
    "dependency_validation",
    "approval_validation",
    "explanation",
  ]),
});

export const EXECUTIVE_TIME_TRANSITION_FUTURE_INTEGRATIONS: ExecutiveTimeTransitionFutureIntegrations = Object.freeze({
  scenario: Object.freeze({ consumerId: "scenario", validationOnly: true, integrationImplemented: false }),
  kpi: Object.freeze({ consumerId: "kpi", validationOnly: true, integrationImplemented: false }),
  risk: Object.freeze({ consumerId: "risk", validationOnly: true, integrationImplemented: false }),
  decision: Object.freeze({ consumerId: "decision", validationOnly: true, integrationImplemented: false }),
  timeline: Object.freeze({ consumerId: "timeline", validationOnly: true, integrationImplemented: false }),
  dashboard: Object.freeze({ consumerId: "dashboard", validationOnly: true, integrationImplemented: false }),
  assistant: Object.freeze({ consumerId: "assistant", validationOnly: true, integrationImplemented: false }),
});

function buildResult(input: {
  request: ExecutiveTimeTransitionRequest;
  approved: boolean;
  rejected: boolean;
  reason: string;
  validationMessages: readonly string[];
  requiredApprovals: readonly string[];
  requiredDependencies: readonly string[];
}): ExecutiveTimeTransitionAuthorityResult {
  return Object.freeze({
    approved: input.approved,
    rejected: input.rejected,
    reason: input.reason,
    currentState: input.request.currentState,
    requestedState: input.request.requestedState,
    entityType: input.request.entityType,
    entityId: input.request.entityId,
    workspaceId: input.request.workspaceId.trim(),
    validationMessages: Object.freeze([...input.validationMessages]),
    requiredApprovals: Object.freeze([...input.requiredApprovals]),
    requiredDependencies: Object.freeze([...input.requiredDependencies]),
    metadata: Object.freeze({
      authorityVersion: EXECUTIVE_TIME_TRANSITION_AUTHORITY_VERSION,
      mutationPermitted: false,
      ...(input.request.metadata ?? {}),
    }),
  });
}

export function validateTransition(request: ExecutiveTimeTransitionRequest): ExecutiveTimeTransitionAuthorityResult {
  const messages: string[] = [];
  const requiredApprovals: string[] = [];
  const requiredDependencies: string[] = [];

  if (!request.workspaceId.trim()) messages.push("workspaceId is required.");
  if (!request.entityId.trim()) messages.push("entityId is required.");
  if (!isKnownEntity(request.entityType)) messages.push("entityType is unknown.");
  if (!isKnownState(request.entityType, request.currentState)) messages.push("currentState is unknown.");
  if (!isKnownState(request.entityType, request.requestedState)) messages.push("requestedState is unknown.");
  if (request.currentState === request.requestedState) messages.push("requestedState matches currentState.");

  if (messages.length === 0) {
    const contractValidation = validateExecutiveTimeStateTransition({
      entityType: request.entityType,
      fromState: request.currentState,
      toState: request.requestedState,
      transitionReason: request.transitionReason,
      actor: request.actor,
      timestamp: new Date().toISOString(),
      requiresApproval: request.requiresApproval ?? false,
      metadata: request.metadata ?? Object.freeze({}),
    });
    if (!contractValidation.valid) {
      messages.push(...contractValidation.issues.map((issue) => issue.message));
    }
    if (isTerminal(request.entityType, request.currentState)) {
      messages.push("Current state is terminal.");
    }
    if (!isEditable(request.entityType, request.currentState)) {
      messages.push("Current state is not editable.");
    }
    if (!canTransition({
      entityType: request.entityType,
      fromState: request.currentState,
      toState: request.requestedState,
    })) {
      messages.push("Transition metadata does not allow this move.");
    }
  }

  const dependencyHints = request.metadata?.requiredDependencies;
  if (Array.isArray(dependencyHints)) {
    for (const entry of dependencyHints) {
      if (typeof entry === "string" && entry.trim()) requiredDependencies.push(entry.trim());
    }
  }

  if (request.requiresApproval) {
    requiredApprovals.push("executive_approval");
    if (!request.approvalGranted) {
      messages.push("Executive approval is required before state mutation.");
    }
  }

  const valid = messages.length === 0;
  return buildResult({
    request,
    approved: valid,
    rejected: !valid,
    reason: valid ? "Transition validated." : messages[0] ?? "Transition rejected.",
    validationMessages: messages,
    requiredApprovals,
    requiredDependencies,
  });
}

export function authorizeTransition(request: ExecutiveTimeTransitionRequest): ExecutiveTimeTransitionAuthorityResult {
  const validated = validateTransition(request);
  if (validated.rejected) return validated;
  return buildResult({
    request,
    approved: true,
    rejected: false,
    reason: "Transition authorized. Apply via State Engine only.",
    validationMessages: validated.validationMessages,
    requiredApprovals: validated.requiredApprovals,
    requiredDependencies: validated.requiredDependencies,
  });
}

export function rejectTransition(
  request: ExecutiveTimeTransitionRequest,
  reason: string
): ExecutiveTimeTransitionAuthorityResult {
  const validated = validateTransition(request);
  const messages = validated.rejected ? [...validated.validationMessages] : [reason];
  return buildResult({
    request,
    approved: false,
    rejected: true,
    reason,
    validationMessages: messages,
    requiredApprovals: validated.requiredApprovals,
    requiredDependencies: validated.requiredDependencies,
  });
}

export function requestTransition(request: ExecutiveTimeTransitionRequest): ExecutiveTimeTransitionAuthorityResult {
  return authorizeTransition(request);
}

export function explainDecision(result: ExecutiveTimeTransitionAuthorityResult): ExecutiveTimeTransitionDecisionExplanation {
  return Object.freeze({
    summary: result.approved
      ? `Transition from ${result.currentState} to ${result.requestedState} is authorized for ${result.entityType}:${result.entityId}. State mutation must be executed by the State Engine.`
      : `Transition from ${result.currentState} to ${result.requestedState} was rejected for ${result.entityType}:${result.entityId}.`,
    validationMessages: result.validationMessages,
    requiredApprovals: result.requiredApprovals,
    requiredDependencies: result.requiredDependencies,
    ownership: Object.freeze({
      transitionEngine: "validation-and-authorization-only",
      stateEngine: "executive-time-state-engine",
    }),
  });
}

export const ExecutiveTimeTransitionAuthority = Object.freeze({
  requestTransition,
  validateTransition,
  authorizeTransition,
  rejectTransition,
  explainDecision,
});
