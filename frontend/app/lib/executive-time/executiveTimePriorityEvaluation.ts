/**
 * APP-1:6 — Executive Time Priority Evaluation.
 * Rule-based temporal priority assessment — read-only upstream consumption.
 */

import { getExecutiveTimeCameraPosition } from "./executiveTimeCameraEngine.ts";
import { resolveCurrentContext } from "./executiveTimeContextEngine.ts";
import {
  EXECUTIVE_TIME_PRIORITY_POLICIES,
  resolvePolicy,
} from "./executiveTimePriorityAuthority.ts";
import type {
  ExecutiveTimePriorityContributingFactor,
  ExecutiveTimePriorityEvaluationRequest,
  ExecutiveTimePriorityLevel,
  ExecutiveTimePriorityPolicyDefinition,
  ExecutiveTimePriorityResult,
} from "./executiveTimePriorityAuthorityTypes.ts";
import { EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER, EXECUTIVE_TIME_PRIORITY_RESULT_OWNER } from "./executiveTimePriorityAuthorityTypes.ts";
import { resolveEscalationLevel } from "./executiveTimePriorityEscalation.ts";
import { resolveExecutiveTimeStateTemporalSnapshot } from "./executiveTimeStateEngine.ts";
import { getExecutiveTimeEntityCurrentState } from "./executiveTimeStateMutation.ts";
import { isTerminal } from "./executiveTimeStateResolver.ts";
import { evaluateTransition } from "./executiveTimeTransitionEngine.ts";

export const EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION = "APP-1/6" as const;

type EvaluationSignals = Readonly<{
  score: number;
  factors: ExecutiveTimePriorityContributingFactor[];
  warnings: string[];
}>;

const HISTORICAL_CONTEXTS = new Set(["yesterday", "last_week", "last_month", "last_quarter", "last_year", "past_review"]);
const FUTURE_CONTEXTS = new Set(["tomorrow", "next_week", "next_month", "next_quarter", "next_year", "future_projection"]);
const NEAR_TERM_CONTEXTS = new Set(["today", "this_week", "now"]);

function parseIso(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function addFactor(
  factors: ExecutiveTimePriorityContributingFactor[],
  factorId: string,
  label: string,
  weight: number
): void {
  factors.push(Object.freeze({ factorId, label, weight }));
}

function scoreToPriority(score: number): ExecutiveTimePriorityLevel {
  if (score >= 90) return "critical";
  if (score >= 70) return "urgent";
  if (score >= 55) return "soon";
  if (score >= 35) return "normal";
  if (score >= 15) return "later";
  return "expired";
}

function buildSignals(request: ExecutiveTimePriorityEvaluationRequest): EvaluationSignals {
  const workspaceId = request.workspaceId.trim();
  const factors: ExecutiveTimePriorityContributingFactor[] = [];
  const warnings: string[] = [];
  let score = 40;

  const context = resolveCurrentContext({ workspaceId });
  const camera = getExecutiveTimeCameraPosition(workspaceId);
  const temporal = resolveExecutiveTimeStateTemporalSnapshot({ workspaceId });
  const storedState =
    getExecutiveTimeEntityCurrentState({
      workspaceId,
      entityType: request.entityType,
      entityId: request.entityId,
      fallbackState: request.currentState,
    }) ?? request.currentState;

  if (storedState !== request.currentState) {
    warnings.push("Declared current state differs from stored state.");
    score += 10;
    addFactor(factors, "state_mismatch", "Stored state differs from declared state.", 10);
  }

  if (HISTORICAL_CONTEXTS.has(context.id)) {
    score = Math.min(score, 10);
    addFactor(factors, "historical_context", `Historical context "${context.id}" reduces active priority.`, -30);
  } else if (FUTURE_CONTEXTS.has(context.id)) {
    score = Math.min(score, 25);
    addFactor(factors, "future_context", `Future context "${context.id}" defers priority.`, -15);
  } else if (NEAR_TERM_CONTEXTS.has(context.id)) {
    score += 12;
    addFactor(factors, "near_term_context", `Near-term context "${context.id}" elevates urgency.`, 12);
  } else {
    addFactor(factors, "context_baseline", `Context "${context.id}" provides temporal baseline.`, 0);
  }

  if (camera?.currentContext && camera.currentContext !== context.id) {
    warnings.push("Camera context differs from active context.");
    addFactor(factors, "camera_context_drift", "Camera and context perspectives differ.", 5);
    score += 5;
  } else {
    addFactor(factors, "camera_alignment", `Camera aligned with context "${context.id}".`, 0);
  }

  addFactor(factors, "temporal_snapshot", `Temporal snapshot at ${temporal.currentContextId}.`, 0);

  if (isTerminal(request.entityType, request.currentState)) {
    score = Math.min(score, 20);
    addFactor(factors, "terminal_state", `Terminal state "${request.currentState}".`, -20);
  }

  const now = Date.now();
  const deadline = parseIso(request.targetDeadline);
  if (deadline !== null) {
    if (deadline < now) {
      score = 5;
      addFactor(factors, "deadline_expired", "Target deadline has elapsed.", 100);
    } else if (deadline - now <= 86_400_000) {
      score += 50;
      addFactor(factors, "deadline_imminent", "Target deadline within 24 hours.", 50);
    } else if (deadline - now <= 604_800_000) {
      score += 30;
      addFactor(factors, "deadline_soon", "Target deadline within 7 days.", 30);
    } else {
      addFactor(factors, "deadline_future", "Target deadline is in the future.", 0);
    }
  }

  const windowEnd = parseIso(request.targetWindow?.end);
  const windowStart = parseIso(request.targetWindow?.start);
  if (windowEnd !== null) {
    if (windowEnd < now) {
      score = Math.min(score, 5);
      addFactor(factors, "window_expired", "Target window has elapsed.", 100);
    } else if (windowEnd - now <= 259_200_000) {
      score += 15;
      addFactor(factors, "window_closing", "Target window closing within 3 days.", 15);
    }
  }
  if (windowStart !== null && windowStart > now) {
    score = Math.min(score, 25);
    addFactor(factors, "window_future", "Target window has not started.", -15);
  }

  if (request.targetState) {
    const transition = evaluateTransition({
      workspaceId,
      entityId: request.entityId,
      entityType: request.entityType,
      currentState: request.currentState,
      targetState: request.targetState,
      actor: request.actor,
      transitionReason: request.reason,
      approvalGranted: request.approvalGranted,
      requiredDependencies: request.requiredDependencies,
    });
    if (!transition.valid) {
      score += 35;
      addFactor(factors, "transition_blocked", "Target transition is blocked.", 35);
      warnings.push(...transition.blockingIssues);
    } else if (transition.warnings.length > 0) {
      score += 10;
      addFactor(factors, "transition_warnings", "Target transition has warnings.", 10);
      warnings.push(...transition.warnings);
    } else {
      addFactor(factors, "transition_clear", "Target transition path is clear.", 0);
    }
    if (transition.approvalRequired && !request.approvalGranted) {
      score += 25;
      addFactor(factors, "approval_pending", "Approval required for target transition.", 25);
    }
    if (transition.dependencyStatus === "blocked") {
      score += 20;
      addFactor(factors, "dependency_blocked", "Transition dependencies are blocked.", 20);
    }
  }

  return Object.freeze({
    score,
    factors: Object.freeze(factors),
    warnings: Object.freeze(warnings),
  });
}

function computeConfidence(factors: readonly ExecutiveTimePriorityContributingFactor[]): number {
  if (factors.length === 0) return 0.5;
  const weighted = factors.reduce((sum, factor) => sum + Math.abs(factor.weight), 0);
  const raw = Math.min(1, 0.5 + weighted / 200);
  return Math.round(raw * 100) / 100;
}

function buildExplanation(input: {
  priority: ExecutiveTimePriorityLevel;
  factors: readonly ExecutiveTimePriorityContributingFactor[];
  entityType: string;
  entityId: string;
}): string {
  const topFactors = [...input.factors]
    .sort((left, right) => Math.abs(right.weight) - Math.abs(left.weight))
    .slice(0, 3)
    .map((factor) => factor.label);
  const factorSummary = topFactors.length > 0 ? topFactors.join("; ") : "Standard temporal baseline.";
  return `Priority ${input.priority} for ${input.entityType}:${input.entityId}. ${factorSummary}`;
}

function resolveMatchedPolicy(priority: ExecutiveTimePriorityLevel): ExecutiveTimePriorityPolicyDefinition {
  return resolvePolicy({ priority: priority }) ?? EXECUTIVE_TIME_PRIORITY_POLICIES[3]!;
}

export function runExecutiveTimePriorityEvaluation(
  request: ExecutiveTimePriorityEvaluationRequest
): ExecutiveTimePriorityResult {
  const signals = buildSignals(request);
  const priority = scoreToPriority(signals.score);
  const matchedPolicy = resolveMatchedPolicy(priority);
  const confidence = computeConfidence(signals.factors);

  return Object.freeze({
    priority,
    confidence,
    explanation: buildExplanation({
      priority,
      factors: signals.factors,
      entityType: request.entityType,
      entityId: request.entityId,
    }),
    matchedPolicies: Object.freeze([matchedPolicy]),
    contributingFactors: signals.factors,
    warnings: signals.warnings,
    escalationLevel: resolveEscalationLevel(priority),
    metadata: Object.freeze({
      engineVersion: EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION,
      evaluationOwner: EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER,
      resultOwner: EXECUTIVE_TIME_PRIORITY_RESULT_OWNER,
      temporalScore: signals.score,
      workspaceId: request.workspaceId.trim(),
      entityId: request.entityId.trim(),
      entityType: request.entityType,
      currentState: request.currentState,
      ...(request.metadata ?? {}),
    }),
  });
}

export function runExecutiveTimePriorityEvaluationBatch(
  requests: readonly ExecutiveTimePriorityEvaluationRequest[]
): readonly ExecutiveTimePriorityResult[] {
  return Object.freeze(requests.map((request) => runExecutiveTimePriorityEvaluation(request)));
}
