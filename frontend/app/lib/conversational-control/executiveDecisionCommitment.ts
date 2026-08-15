/**
 * CC:10 — Decision Commitment identity and boundary.
 *
 * Distinguishes preference from explicit manager commitment, validates
 * candidates, confirms when required, and applies Decision transitions
 * through the EXS1-compatible canonical Decision authority — then STOP
 * before execution (CC:11).
 */

export const executiveDecisionCommitmentIdentity =
  "CC:10/DecisionCommitment" as const;

export const executiveDecisionCommitmentVersion = "1.0.0" as const;

export const executiveDecisionCommitmentNamespace =
  "nexora.conversational-control.decision-commitment" as const;

export const executiveDecisionCommitmentPhase =
  "DecisionCommitment" as const;

export const executiveDecisionCommitmentArchitecturalRole =
  "ExecutiveDecisionCommitmentAuthority" as const;

export type ExecutiveDecisionCommitmentIdentity = {
  readonly id: typeof executiveDecisionCommitmentIdentity;
  readonly version: typeof executiveDecisionCommitmentVersion;
  readonly namespace: typeof executiveDecisionCommitmentNamespace;
  readonly phase: typeof executiveDecisionCommitmentPhase;
  readonly architecturalRole: typeof executiveDecisionCommitmentArchitecturalRole;
};

const IDENTITY: ExecutiveDecisionCommitmentIdentity = Object.freeze({
  id: executiveDecisionCommitmentIdentity,
  version: executiveDecisionCommitmentVersion,
  namespace: executiveDecisionCommitmentNamespace,
  phase: executiveDecisionCommitmentPhase,
  architecturalRole: executiveDecisionCommitmentArchitecturalRole,
});

export function getExecutiveDecisionCommitmentIdentity(): ExecutiveDecisionCommitmentIdentity {
  return IDENTITY;
}

export const EXECUTIVE_DECISION_COMMITMENT_BOUNDARY = Object.freeze({
  architecturalRole: executiveDecisionCommitmentArchitecturalRole,
  mutatesRuntime: false as const,
  mutatesStage: false as const,
  movesCamera: false as const,
  mutatesTopology: false as const,
  mutatesExecutionState: false as const,
  createsExecutionTasks: false as const,
  externalSideEffects: false as const,
  usesLlmOrExternalProvider: false as const,
  recommendationNeverAutoCommits: true as const,
  preferenceNeverEqualsCommitment: true as const,
  scenarioPreferenceNeverAutoCommits: true as const,
  requiresExplicitManagerAuthority: true as const,
  stopsBeforeExecution: true as const,
  reusesCanonicalDecisionAuthority: true as const,
  noParallelConversationalDecisionStore: true as const,
});

export const EXECUTIVE_DECISION_REASON = Object.freeze({
  CANDIDATE_RESOLVED: "decision-candidate-resolved",
  CANDIDATE_AMBIGUOUS: "decision-candidate-ambiguous",
  CANDIDATE_INVALID: "decision-candidate-invalid",
  PREFERENCE_ONLY: "decision-preference-only",
  EXPLICIT_COMMITMENT: "decision-explicit-commitment",
  CONFIRMATION_REQUIRED: "decision-confirmation-required",
  CONFIRMATION_CONFIRMED: "decision-confirmation-confirmed",
  CONFIRMATION_CANCELLED: "decision-confirmation-cancelled",
  CONFIRMATION_STALE: "decision-confirmation-stale",
  TRANSITION_VALID: "decision-transition-valid",
  TRANSITION_NOT_ALLOWED: "decision-transition-not-allowed",
  CREATED: "decision-created",
  APPROVED: "decision-approved",
  REJECTED: "decision-rejected",
  DEFERRED: "decision-deferred",
  RECONSIDERED: "decision-reconsidered",
  ALREADY_COMMITTED: "decision-already-committed",
  RUNTIME_APPLIED: "decision-runtime-applied",
  RUNTIME_FAILED: "decision-runtime-failed",
  EXECUTION_DEFERRED: "decision-execution-deferred",
  UNSUPPORTED_SCENARIO: "decision-unsupported-scenario",
  PARTIAL_UNCERTAINTY_PRESERVED: "decision-partial-uncertainty-preserved",
  MANAGER_AUTHORITY: "decision-manager-authority",
  DETERMINISTIC: "deterministic-decision-commitment",
} as const);

export type ExecutiveDecisionReasonCode =
  (typeof EXECUTIVE_DECISION_REASON)[keyof typeof EXECUTIVE_DECISION_REASON];

export const NEXORA_DECISION_COMMITMENT_STATUSES = Object.freeze([
  "ready",
  "preference-only",
  "clarification-required",
  "confirmation-required",
  "invalid-candidate",
  "unsupported",
  "already-committed",
  "transition-not-allowed",
  "applied",
  "failed",
] as const);

export type NexoraDecisionCommitmentStatus =
  (typeof NEXORA_DECISION_COMMITMENT_STATUSES)[number];
