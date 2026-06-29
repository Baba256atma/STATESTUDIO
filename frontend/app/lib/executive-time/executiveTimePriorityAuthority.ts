/**
 * APP-1:5.5 — Executive Time Priority Authority Contract.
 * Policy metadata and engine interface only — no priority evaluation.
 */

import type {
  ExecutiveTimePriorityEngineContract,
  ExecutiveTimePriorityEvaluationRequest,
  ExecutiveTimePriorityExplanation,
  ExecutiveTimePriorityFutureIntegrations,
  ExecutiveTimePriorityLevel,
  ExecutiveTimePriorityOwnershipRules,
  ExecutiveTimePriorityPolicyDefinition,
  ExecutiveTimePriorityPolicyValidationResult,
  ExecutiveTimePriorityReadOnlyDependencies,
  ExecutiveTimePriorityResult,
} from "./executiveTimePriorityAuthorityTypes.ts";
import {
  EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER,
  EXECUTIVE_TIME_PRIORITY_POLICY_OWNER,
  EXECUTIVE_TIME_PRIORITY_RESULT_OWNER,
  ExecutiveTimePriorityEvaluationDeferredError,
} from "./executiveTimePriorityAuthorityTypes.ts";
import { resolveEscalationLevel } from "./executiveTimePriorityEscalation.ts";

export const EXECUTIVE_TIME_PRIORITY_LEVELS = Object.freeze([
  "critical",
  "urgent",
  "soon",
  "normal",
  "later",
  "expired",
] as const);

const POLICY_SEEDS: readonly Omit<ExecutiveTimePriorityPolicyDefinition, "metadata">[] = Object.freeze([
  Object.freeze({ id: "priority-critical", priority: "critical", description: "Immediate executive attention required.", evaluationOrder: 0, severityWeight: 100 }),
  Object.freeze({ id: "priority-urgent", priority: "urgent", description: "Time-sensitive action required soon.", evaluationOrder: 1, severityWeight: 80 }),
  Object.freeze({ id: "priority-soon", priority: "soon", description: "Approaching temporal threshold.", evaluationOrder: 2, severityWeight: 60 }),
  Object.freeze({ id: "priority-normal", priority: "normal", description: "Standard temporal priority.", evaluationOrder: 3, severityWeight: 40 }),
  Object.freeze({ id: "priority-later", priority: "later", description: "Deferred temporal attention.", evaluationOrder: 4, severityWeight: 20 }),
  Object.freeze({ id: "priority-expired", priority: "expired", description: "Temporal window has elapsed.", evaluationOrder: 5, severityWeight: 0 }),
]);

const POLICY_BY_ID = Object.freeze(
  Object.fromEntries(
    POLICY_SEEDS.map((seed) => [
      seed.id,
      Object.freeze({
        ...seed,
        metadata: Object.freeze({ contractOnly: true, owner: EXECUTIVE_TIME_PRIORITY_POLICY_OWNER }),
      }),
    ])
  ) as Record<string, ExecutiveTimePriorityPolicyDefinition>
);

const POLICY_BY_LEVEL = Object.freeze(
  Object.fromEntries(POLICY_SEEDS.map((seed) => [seed.priority, POLICY_BY_ID[seed.id]!])) as Record<
    ExecutiveTimePriorityLevel,
    ExecutiveTimePriorityPolicyDefinition
  >
);

export const EXECUTIVE_TIME_PRIORITY_POLICIES: readonly ExecutiveTimePriorityPolicyDefinition[] = Object.freeze(
  POLICY_SEEDS.map((seed) => POLICY_BY_ID[seed.id]!)
);

export const EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES: ExecutiveTimePriorityOwnershipRules = Object.freeze({
  policyOwns: Object.freeze(["priority_definitions", "evaluation_ordering", "severity_metadata"]),
  engineOwns: Object.freeze(["evaluation", "policy_matching", "explanation"]),
  resultOwns: Object.freeze(["final_immutable_assessment"]),
});

export const EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES: ExecutiveTimePriorityReadOnlyDependencies = Object.freeze({
  context: Object.freeze({
    moduleId: "executive-time-context-engine",
    operations: Object.freeze(["resolveCurrentContext"]),
    mutationPermitted: false,
  }),
  camera: Object.freeze({
    moduleId: "executive-time-camera-engine",
    operations: Object.freeze(["getExecutiveTimeCameraPosition"]),
    mutationPermitted: false,
  }),
  state: Object.freeze({
    moduleId: "executive-time-state-engine",
    operations: Object.freeze(["resolveExecutiveTimeStateTemporalSnapshot", "getExecutiveTimeEntityCurrentState"]),
    mutationPermitted: false,
  }),
  transitionEngine: Object.freeze({
    moduleId: "executive-time-transition-engine",
    operations: Object.freeze(["evaluateTransition", "resolveTransition"]),
    mutationPermitted: false,
  }),
});

export const EXECUTIVE_TIME_PRIORITY_FUTURE_INTEGRATIONS: ExecutiveTimePriorityFutureIntegrations = Object.freeze({
  dashboard: Object.freeze({ consumerId: "dashboard", validationOnly: true, integrationImplemented: false }),
  assistant: Object.freeze({ consumerId: "assistant", validationOnly: true, integrationImplemented: false }),
  timeline: Object.freeze({ consumerId: "timeline", validationOnly: true, integrationImplemented: false }),
  recommendation: Object.freeze({ consumerId: "recommendation", validationOnly: true, integrationImplemented: false }),
  scenario: Object.freeze({ consumerId: "scenario", validationOnly: true, integrationImplemented: false }),
  risk: Object.freeze({ consumerId: "risk", validationOnly: true, integrationImplemented: false }),
  kpi: Object.freeze({ consumerId: "kpi", validationOnly: true, integrationImplemented: false }),
  decision: Object.freeze({ consumerId: "decision", validationOnly: true, integrationImplemented: false }),
});

export function resolvePolicy(input: {
  policyId?: string;
  priority?: ExecutiveTimePriorityLevel;
}): ExecutiveTimePriorityPolicyDefinition | null {
  if (input.policyId?.trim()) {
    return POLICY_BY_ID[input.policyId.trim()] ?? null;
  }
  if (input.priority) {
    return POLICY_BY_LEVEL[input.priority] ?? null;
  }
  return null;
}

export function validatePolicy(policyId: string): ExecutiveTimePriorityPolicyValidationResult {
  const trimmed = policyId.trim();
  const policy = POLICY_BY_ID[trimmed];
  const valid = Boolean(policy);
  return Object.freeze({
    valid,
    policyId: trimmed,
    messages: Object.freeze(valid ? [] : [`Unknown priority policy "${trimmed}".`]),
  });
}

export function evaluatePriority(_request: ExecutiveTimePriorityEvaluationRequest): ExecutiveTimePriorityResult {
  throw new ExecutiveTimePriorityEvaluationDeferredError();
}

export function evaluateMultiple(
  _requests: readonly ExecutiveTimePriorityEvaluationRequest[]
): readonly ExecutiveTimePriorityResult[] {
  throw new ExecutiveTimePriorityEvaluationDeferredError();
}

export function explainPriority(result: ExecutiveTimePriorityResult): ExecutiveTimePriorityExplanation {
  return Object.freeze({
    summary: result.explanation || `Priority assessment: ${result.priority} (confidence ${result.confidence}).`,
    priority: result.priority,
    confidence: result.confidence,
    matchedPolicyIds: Object.freeze(result.matchedPolicies.map((policy) => policy.id)),
    warnings: result.warnings,
    ownership: Object.freeze({
      policyOwner: EXECUTIVE_TIME_PRIORITY_POLICY_OWNER,
      engineOwner: EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER,
      resultOwner: EXECUTIVE_TIME_PRIORITY_RESULT_OWNER,
    }),
  });
}

/** Builds an immutable result template for contract verification — not an evaluation. */
export function buildPriorityResultContract(input: {
  priority: ExecutiveTimePriorityLevel;
  confidence?: number;
  explanation?: string;
  matchedPolicyIds?: readonly string[];
  warnings?: readonly string[];
  metadata?: Readonly<Record<string, unknown>>;
}): ExecutiveTimePriorityResult {
  const matchedPolicies = Object.freeze(
    (input.matchedPolicyIds ?? [])
      .map((policyId) => resolvePolicy({ policyId }))
      .filter((policy): policy is ExecutiveTimePriorityPolicyDefinition => policy !== null)
  );
  return Object.freeze({
    priority: input.priority,
    confidence: input.confidence ?? 0,
    explanation: input.explanation ?? "Contract-only priority result template.",
    matchedPolicies,
    contributingFactors: Object.freeze([]),
    warnings: Object.freeze(input.warnings ?? []),
    escalationLevel: resolveEscalationLevel(input.priority),
    metadata: Object.freeze({
      contractOnly: true,
      resultOwner: EXECUTIVE_TIME_PRIORITY_RESULT_OWNER,
      ...(input.metadata ?? {}),
    }),
  });
}

export const ExecutiveTimePriorityEngineContract: ExecutiveTimePriorityEngineContract = Object.freeze({
  evaluationOwner: EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER,
  evaluatePriority,
  evaluateMultiple,
  validatePolicy,
  resolvePolicy,
  explainPriority,
});

export const ExecutiveTimePriorityAuthority = Object.freeze({
  resolvePolicy,
  validatePolicy,
  evaluatePriority,
  evaluateMultiple,
  explainPriority,
  buildPriorityResultContract,
});
