/**
 * APP-1:5 — Executive Time Transition Resolver.
 * Read-only resolution of policies, dependencies, and transition options.
 */

import {
  isEditable,
  isKnownEntity,
  isKnownState,
  isTerminal,
} from "./executiveTimeStateResolver.ts";
import { listEntityStates } from "./executiveTimeStateRegistry.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";
import type { ExecutiveTimeTransitionApprovalResult } from "./executiveTimeTransitionApproval.ts";
import { validateTransitionApproval } from "./executiveTimeTransitionApproval.ts";
import type { ExecutiveTimeTransitionDependencyResult } from "./executiveTimeTransitionDependency.ts";
import { validateTransitionDependencies } from "./executiveTimeTransitionDependency.ts";
import type { ExecutiveTimeTransitionPolicy, ExecutiveTimeTransitionPolicyResult } from "./executiveTimeTransitionPolicy.ts";
import {
  listPolicyNextStates,
  resolveTransitionPolicy,
  validateTransitionPolicy,
} from "./executiveTimeTransitionPolicy.ts";

export const EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION = "APP-1/5" as const;

export type ExecutiveTimeTransitionEvaluationRequest = Readonly<{
  workspaceId: string;
  entityId: string;
  entityType: ExecutiveTimeEntityType;
  currentState: string;
  targetState: string;
  actor: string;
  transitionReason: string;
  approvalGranted?: boolean;
  requiredDependencies?: readonly string[];
  metadata?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeTransitionEvaluationResult = Readonly<{
  valid: boolean;
  warnings: readonly string[];
  blockingIssues: readonly string[];
  recommendations: readonly string[];
  approvalRequired: boolean;
  dependencyStatus: ExecutiveTimeTransitionDependencyResult["status"];
  explanation: string;
}>;

export type ExecutiveTimeTransitionDecision = Readonly<{
  approved: boolean;
  rejected: boolean;
  currentState: string;
  targetState: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  workspaceId: string;
  policyResult: ExecutiveTimeTransitionPolicyResult;
  dependencyResult: ExecutiveTimeTransitionDependencyResult;
  approvalResult: ExecutiveTimeTransitionApprovalResult;
  explanation: string;
  warnings: readonly string[];
  blockingIssues: readonly string[];
  recommendations: readonly string[];
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveTimeTransitionFutureIntegrations = Readonly<{
  scenarioEngine: Readonly<{ consumerId: "scenario"; validationOnly: true; integrationImplemented: false }>;
  kpiEngine: Readonly<{ consumerId: "kpi"; validationOnly: true; integrationImplemented: false }>;
  riskEngine: Readonly<{ consumerId: "risk"; validationOnly: true; integrationImplemented: false }>;
  decisionEngine: Readonly<{ consumerId: "decision"; validationOnly: true; integrationImplemented: false }>;
  timeline: Readonly<{ consumerId: "timeline"; validationOnly: true; integrationImplemented: false }>;
  dashboard: Readonly<{ consumerId: "dashboard"; validationOnly: true; integrationImplemented: false }>;
  assistant: Readonly<{ consumerId: "assistant"; validationOnly: true; integrationImplemented: false }>;
  recommendation: Readonly<{ consumerId: "recommendation"; validationOnly: true; integrationImplemented: false }>;
  executiveMemory: Readonly<{ consumerId: "executive_memory"; validationOnly: true; integrationImplemented: false }>;
}>;

export const EXECUTIVE_TIME_TRANSITION_FUTURE_INTEGRATIONS: ExecutiveTimeTransitionFutureIntegrations = Object.freeze({
  scenarioEngine: Object.freeze({ consumerId: "scenario", validationOnly: true, integrationImplemented: false }),
  kpiEngine: Object.freeze({ consumerId: "kpi", validationOnly: true, integrationImplemented: false }),
  riskEngine: Object.freeze({ consumerId: "risk", validationOnly: true, integrationImplemented: false }),
  decisionEngine: Object.freeze({ consumerId: "decision", validationOnly: true, integrationImplemented: false }),
  timeline: Object.freeze({ consumerId: "timeline", validationOnly: true, integrationImplemented: false }),
  dashboard: Object.freeze({ consumerId: "dashboard", validationOnly: true, integrationImplemented: false }),
  assistant: Object.freeze({ consumerId: "assistant", validationOnly: true, integrationImplemented: false }),
  recommendation: Object.freeze({ consumerId: "recommendation", validationOnly: true, integrationImplemented: false }),
  executiveMemory: Object.freeze({ consumerId: "executive_memory", validationOnly: true, integrationImplemented: false }),
});

export function resolveTransitionPolicyForEntity(entityType: ExecutiveTimeEntityType): ExecutiveTimeTransitionPolicy {
  return resolveTransitionPolicy(entityType);
}

export function resolveTransitionDependencies(input: {
  workspaceId: string;
  entityId: string;
  entityType: ExecutiveTimeEntityType;
  currentState: string;
  targetState: string;
  requiredDependencies?: readonly string[];
}): ExecutiveTimeTransitionDependencyResult {
  return validateTransitionDependencies(input);
}

export function resolveTransitionExplanation(decision: ExecutiveTimeTransitionDecision): string {
  if (decision.approved) {
    return `Transition approved: ${decision.entityType}:${decision.entityId} ${decision.currentState} → ${decision.targetState}. Apply via State Engine only.`;
  }
  const primary = decision.blockingIssues[0] ?? "Transition blocked.";
  return `Transition rejected: ${decision.entityType}:${decision.entityId} ${decision.currentState} → ${decision.targetState}. ${primary}`;
}

export function resolveAvailableTransitions(input: {
  entityType: ExecutiveTimeEntityType;
  currentState: string;
}): readonly string[] {
  return listPolicyNextStates(input.entityType, input.currentState);
}

export function resolveBlockedTransitions(input: {
  entityType: ExecutiveTimeEntityType;
  currentState: string;
}): readonly Readonly<{ targetState: string; reason: string }>[] {
  if (!isKnownState(input.entityType, input.currentState)) {
    return Object.freeze([Object.freeze({ targetState: "*", reason: "Current state is unknown." })]);
  }
  if (isTerminal(input.entityType, input.currentState)) {
    return Object.freeze([Object.freeze({ targetState: "*", reason: "Current state is terminal." })]);
  }

  const available = new Set(resolveAvailableTransitions(input));
  const blocked: Array<{ targetState: string; reason: string }> = [];
  for (const state of listEntityStates(input.entityType)) {
    if (state.id === input.currentState || available.has(state.id)) continue;
    const policy = validateTransitionPolicy({
      entityType: input.entityType,
      fromState: input.currentState,
      toState: state.id,
    });
    blocked.push({
      targetState: state.id,
      reason: policy.messages[0] ?? "Transition not allowed by primary-path policy.",
    });
  }
  return Object.freeze(blocked.map((entry) => Object.freeze(entry)));
}

export function resolveTransition(input: ExecutiveTimeTransitionEvaluationRequest): ExecutiveTimeTransitionDecision {
  return buildTransitionDecision(input);
}

function buildTransitionDecision(input: ExecutiveTimeTransitionEvaluationRequest): ExecutiveTimeTransitionDecision {
  const warnings: string[] = [];
  const blockingIssues: string[] = [];
  const recommendations: string[] = [];

  if (!input.workspaceId.trim()) blockingIssues.push("workspaceId is required.");
  if (!input.entityId.trim()) blockingIssues.push("entityId is required.");
  if (!isKnownEntity(input.entityType)) blockingIssues.push("entityType is unknown.");
  if (!isKnownState(input.entityType, input.currentState)) blockingIssues.push("currentState is unknown.");
  if (!isKnownState(input.entityType, input.targetState)) blockingIssues.push("targetState is unknown.");
  if (input.currentState === input.targetState) blockingIssues.push("targetState matches currentState.");

  if (blockingIssues.length === 0) {
    if (isTerminal(input.entityType, input.currentState)) blockingIssues.push("Current state is terminal.");
    if (!isEditable(input.entityType, input.currentState)) warnings.push("Current state is not editable.");
  }

  const policyResult = validateTransitionPolicy({
    entityType: input.entityType,
    fromState: input.currentState,
    toState: input.targetState,
  });
  if (!policyResult.valid) blockingIssues.push(...policyResult.messages);

  const dependencyResult = validateTransitionDependencies({
    workspaceId: input.workspaceId,
    entityId: input.entityId,
    entityType: input.entityType,
    currentState: input.currentState,
    targetState: input.targetState,
    requiredDependencies: input.requiredDependencies,
  });
  if (!dependencyResult.valid) blockingIssues.push(...dependencyResult.blockingIssues);

  const approvalResult = validateTransitionApproval({
    entityType: input.entityType,
    fromState: input.currentState,
    toState: input.targetState,
    approvalGranted: input.approvalGranted,
  });
  if (!approvalResult.valid) blockingIssues.push(...approvalResult.blockingIssues);

  if (approvalResult.approvalRequired && !input.approvalGranted) {
    recommendations.push("Obtain required approval before applying transition.");
  }
  if (policyResult.valid) {
    recommendations.push("Proceed through Transition Authority and State Engine applyApprovedTransition().");
  }

  const approved = blockingIssues.length === 0;
  const decision = Object.freeze({
    approved,
    rejected: !approved,
    currentState: input.currentState,
    targetState: input.targetState,
    entityType: input.entityType,
    entityId: input.entityId.trim(),
    workspaceId: input.workspaceId.trim(),
    policyResult,
    dependencyResult,
    approvalResult,
    explanation: "",
    warnings: Object.freeze(warnings),
    blockingIssues: Object.freeze(blockingIssues),
    recommendations: Object.freeze(recommendations),
    metadata: Object.freeze({
      engineVersion: EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION,
      actor: input.actor,
      transitionReason: input.transitionReason,
      ...(input.metadata ?? {}),
    }),
  });

  return Object.freeze({
    ...decision,
    explanation: resolveTransitionExplanation(decision),
  });
}

export function evaluateTransition(input: ExecutiveTimeTransitionEvaluationRequest): ExecutiveTimeTransitionEvaluationResult {
  const decision = buildTransitionDecision(input);
  return Object.freeze({
    valid: decision.approved,
    warnings: decision.warnings,
    blockingIssues: decision.blockingIssues,
    recommendations: decision.recommendations,
    approvalRequired: decision.approvalResult.approvalRequired,
    dependencyStatus: decision.dependencyResult.status,
    explanation: decision.explanation,
  });
}
