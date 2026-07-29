/**
 * RTC-3:5 — Executive Decision Register Policy Lifecycle.
 *
 * Policy lifecycle and readiness metadata.
 *
 * Ownership: owned exclusively by RTC-3:5.
 */

export type ExecutiveDecisionRegisterPolicyLifecycleState =
  | "Declared"
  | "RulesBound"
  | "Sealed";

export const EXECUTIVE_DECISION_REGISTER_POLICY_LIFECYCLE_STATES = Object.freeze([
  "Declared",
  "RulesBound",
  "Sealed",
] as const satisfies readonly ExecutiveDecisionRegisterPolicyLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["RulesBound"] as const),
  RulesBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveDecisionRegisterPolicyLifecycle = Object.freeze({
  lifecycleId: "RTC-3:5/ExecutiveDecisionRegisterPolicyLifecycle" as const,
  sourcePhase: "RTC-3:5" as const,
  states: EXECUTIVE_DECISION_REGISTER_POLICY_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_DECISION_REGISTER_POLICY_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  evaluatesOnly: true as const,
  failClosedDefault: "Deny" as const,
  precedence: Object.freeze(["Deny", "RequireConfirmation", "Allow"] as const),
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  executesTransitions: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Closed operation catalogue. */
export const ExecutiveDecisionRegisterPolicyOperations = Object.freeze([
  "ProposeDecision",
  "ConfirmDecision",
  "MakeDecisionEffective",
  "CorrectDecision",
  "OpenDispute",
  "ResolveDispute",
  "SupersedeDecision",
  "CloseDecision",
  "ReferenceOutcome",
  "ReadDecision",
  "SearchDecisions",
  "ProjectDecisionRegister",
  "DiscloseDecision",
  "ExportDecision",
  "ApplyRetention",
  "DisposeDecision",
  "BreakGlassAccess",
] as const);

/** Closed obligation kinds. */
export const ExecutiveDecisionRegisterPolicyObligationKinds = Object.freeze([
  "RequireHumanConfirmation",
  "RequireAuthorityEvidence",
  "RequirePurposeBinding",
  "RequireEvidenceReference",
  "RequireAppendOnlyEvent",
  "RequireProvenance",
  "RequireFieldFiltering",
  "RequireRedaction",
  "RequireDisclosureEvidence",
  "RequireExportEvidence",
  "RequireRetentionEvidence",
  "RequireDispositionEvidence",
  "RequireReview",
  "RequireExpiry",
  "RequireBreakGlassReview",
] as const);
