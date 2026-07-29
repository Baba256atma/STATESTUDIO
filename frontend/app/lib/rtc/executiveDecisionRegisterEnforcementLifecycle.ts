/**
 * RTC-3:6 — Executive Decision Register Enforcement Lifecycle.
 *
 * Ownership: owned exclusively by RTC-3:6.
 */

export type ExecutiveDecisionRegisterEnforcementLifecycleState =
  | "Declared"
  | "MappingsBound"
  | "Sealed";

export const EXECUTIVE_DECISION_REGISTER_ENFORCEMENT_LIFECYCLE_STATES =
  Object.freeze([
    "Declared",
    "MappingsBound",
    "Sealed",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["MappingsBound"] as const),
  MappingsBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveDecisionRegisterEnforcementLifecycle = Object.freeze({
  lifecycleId:
    "RTC-3:6/ExecutiveDecisionRegisterEnforcementLifecycle" as const,
  sourcePhase: "RTC-3:6" as const,
  states: EXECUTIVE_DECISION_REGISTER_ENFORCEMENT_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_DECISION_REGISTER_ENFORCEMENT_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  plansOnly: true as const,
  executesPlans: false as const,
  precedence: Object.freeze([
    "Blocked",
    "AwaitingConfirmation",
    "Enforceable",
  ] as const),
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Closed enforcement-step catalogue. */
export const ExecutiveDecisionRegisterEnforcementStepKinds = Object.freeze([
  "VerifyValidation",
  "VerifyPolicyDecision",
  "VerifyActor",
  "VerifyAuthority",
  "VerifyDelegation",
  "VerifyPurpose",
  "VerifyLifecyclePrecondition",
  "VerifyEvidence",
  "VerifyConfirmation",
  "VerifyPrivacyBoundary",
  "ApplyFieldFilter",
  "ApplyRedaction",
  "BindProjectionScope",
  "PrepareProposalEvent",
  "PrepareConfirmationEvent",
  "PrepareEffectiveDecisionEvent",
  "PrepareCorrectionEvent",
  "PrepareDisputeEvent",
  "PrepareDisputeResolutionEvent",
  "PrepareSupersessionEvent",
  "PrepareOutcomeReferenceEvent",
  "PrepareClosureEvent",
  "PrepareDisclosureEvidence",
  "PrepareExportEvidence",
  "PrepareRetentionEvidence",
  "PrepareDispositionEvent",
  "PrepareBreakGlassReview",
  "SealEnforcementPlan",
] as const);
