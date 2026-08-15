/**
 * CC:8 — Reasoning & Recommendation identity and boundary.
 *
 * Reasons from trusted structured evidence only.
 * Does not execute scenarios, commit decisions, or mutate Runtime/Stage.
 */

export const executiveReasoningIdentity =
  "CC:8/ReasoningAndRecommendation" as const;

export const executiveReasoningVersion = "1.0.0" as const;

export const executiveReasoningNamespace =
  "nexora.conversational-control.reasoning-and-recommendation" as const;

export const executiveReasoningPhase = "ReasoningAndRecommendation" as const;

export const executiveReasoningArchitecturalRole =
  "ExecutiveReasoningAndRecommendationAuthority" as const;

export type ExecutiveReasoningIdentity = {
  readonly id: typeof executiveReasoningIdentity;
  readonly version: typeof executiveReasoningVersion;
  readonly namespace: typeof executiveReasoningNamespace;
  readonly phase: typeof executiveReasoningPhase;
  readonly architecturalRole: typeof executiveReasoningArchitecturalRole;
};

const IDENTITY: ExecutiveReasoningIdentity = Object.freeze({
  id: executiveReasoningIdentity,
  version: executiveReasoningVersion,
  namespace: executiveReasoningNamespace,
  phase: executiveReasoningPhase,
  architecturalRole: executiveReasoningArchitecturalRole,
});

export function getExecutiveReasoningIdentity(): ExecutiveReasoningIdentity {
  return IDENTITY;
}

export const EXECUTIVE_REASONING_BOUNDARY = Object.freeze({
  architecturalRole: executiveReasoningArchitecturalRole,
  mutatesRuntime: false as const,
  mutatesStage: false as const,
  movesCamera: false as const,
  executesScenarios: false as const,
  commitsDecisions: false as const,
  altersExecution: false as const,
  inventsFacts: false as const,
  inventsRelationships: false as const,
  claimsCausalityWithoutEvidence: false as const,
  usesLlmOrExternalProvider: false as const,
  usesStageGeometryAsEvidence: false as const,
  /** Confidence = deterministic evidence support under policy, not model probability. */
  confidenceIsDeterministicEvidenceSupport: true as const,
  stopsBeforeCommitment: true as const,
});

export const EXECUTIVE_REASONING_REASON = Object.freeze({
  CRITICAL_GOAL_LINKED_CONSTRAINT: "critical-goal-linked-constraint",
  ATTENTION_GOAL_LINKED_SIGNAL: "attention-goal-linked-signal",
  INSUFFICIENT_EVIDENCE: "insufficient-evidence",
  CONFLICTING_EVIDENCE: "conflicting-evidence",
  CANONICAL_RELATIONSHIP_SUPPORTED: "canonical-relationship-supported",
  CAUSALITY_NOT_PROVEN: "causality-not-proven",
  SCENARIO_ANALYSIS_REQUIRED: "scenario-analysis-required",
  NO_MATERIAL_ACTION_REQUIRED: "no-material-action-required",
  EXPLICIT_SUBJECT_SCOPE: "explicit-subject-scope",
  CONTEXT_SUBJECT_SCOPE: "context-subject-scope",
  PROBLEM_ALIGNMENT: "problem-alignment",
  GOAL_ALIGNMENT: "goal-alignment",
  WEAK_EVIDENCE_INVESTIGATE: "weak-evidence-investigate",
  MONITOR_ATTENTION_SIGNAL: "monitor-attention-signal",
  MITIGATE_CRITICAL_RISK: "mitigate-critical-risk",
  DEFER_UNDER_CONFLICT: "defer-under-conflict",
  COMPARE_OPTIONS_HANDOFF: "compare-options-handoff",
  REFERENCE_ONLY_SCENARIO: "scenario-reference-only",
  REFERENCE_ONLY_DECISION: "decision-reference-only",
  REFERENCE_ONLY_EXECUTION: "execution-reference-only",
  DETERMINISTIC: "deterministic-executive-reasoning",
} as const);

export type ExecutiveReasoningReasonCode =
  (typeof EXECUTIVE_REASONING_REASON)[keyof typeof EXECUTIVE_REASONING_REASON];
