/**
 * CC:10R — Decision Runtime Convergence identity.
 *
 * Closes the CC:10 dual-authority debt: conversational commitment and UI
 * Decision actions share one canonical Decision Runtime port. Session state
 * retains only temporary confirmation/provenance metadata.
 */

export const executiveDecisionRuntimeConvergenceIdentity =
  "CC:10R/DecisionRuntimeConvergence" as const;

export const executiveDecisionRuntimeConvergenceVersion = "1.0.0" as const;

export const executiveDecisionRuntimeConvergenceNamespace =
  "nexora.conversational-control.decision-runtime-convergence" as const;

export const executiveDecisionRuntimeConvergencePhase =
  "DecisionRuntimeConvergence" as const;

export const executiveDecisionRuntimeConvergenceArchitecturalRole =
  "CanonicalDecisionRuntimeConvergenceAuthority" as const;

export type ExecutiveDecisionRuntimeConvergenceIdentity = {
  readonly id: typeof executiveDecisionRuntimeConvergenceIdentity;
  readonly version: typeof executiveDecisionRuntimeConvergenceVersion;
  readonly namespace: typeof executiveDecisionRuntimeConvergenceNamespace;
  readonly phase: typeof executiveDecisionRuntimeConvergencePhase;
  readonly architecturalRole: typeof executiveDecisionRuntimeConvergenceArchitecturalRole;
};

const IDENTITY: ExecutiveDecisionRuntimeConvergenceIdentity = Object.freeze({
  id: executiveDecisionRuntimeConvergenceIdentity,
  version: executiveDecisionRuntimeConvergenceVersion,
  namespace: executiveDecisionRuntimeConvergenceNamespace,
  phase: executiveDecisionRuntimeConvergencePhase,
  architecturalRole: executiveDecisionRuntimeConvergenceArchitecturalRole,
});

export function getExecutiveDecisionRuntimeConvergenceIdentity(): ExecutiveDecisionRuntimeConvergenceIdentity {
  return IDENTITY;
}

export const EXECUTIVE_DECISION_RUNTIME_CONVERGENCE_BOUNDARY = Object.freeze({
  architecturalRole: executiveDecisionRuntimeConvergenceArchitecturalRole,
  oneCanonicalDecisionTruth: true as const,
  runtimeOwnsStatusAndLock: true as const,
  sessionOwnsPendingConfirmationOnly: true as const,
  noParallelProductDecisionStore: true as const,
  noThirdStore: true as const,
  stopsBeforeExecution: true as const,
  mutatesStageDirectly: false as const,
  usesLlmOrExternalProvider: false as const,
});
