/**
 * RTC-2:6 — Executive Journal Runtime Policy Enforcement Lifecycle.
 *
 * Ownership: owned exclusively by RTC-2:6.
 */

export type ExecutiveJournalRuntimeEnforcementLifecycleState =
  | "Declared"
  | "MappingsBound"
  | "Sealed";

export const EXECUTIVE_JOURNAL_ENFORCEMENT_LIFECYCLE_STATES = Object.freeze([
  "Declared",
  "MappingsBound",
  "Sealed",
] as const satisfies readonly ExecutiveJournalRuntimeEnforcementLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["MappingsBound"] as const),
  MappingsBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveJournalRuntimeEnforcementLifecycle = Object.freeze({
  lifecycleId: "RTC-2:6/ExecutiveJournalRuntimeEnforcementLifecycle" as const,
  sourcePhase: "RTC-2:6" as const,
  states: EXECUTIVE_JOURNAL_ENFORCEMENT_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_JOURNAL_ENFORCEMENT_LIFECYCLE_STATES.length,
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
export const ExecutiveJournalRuntimeEnforcementStepKinds = Object.freeze([
  "VerifyValidation",
  "VerifyPolicyDecision",
  "VerifyActor",
  "VerifyAuthority",
  "VerifyDelegation",
  "VerifyPurpose",
  "VerifyLifecyclePrecondition",
  "VerifyEvidence",
  "VerifyConfirmation",
  "ApplyFieldFilter",
  "ApplyRedaction",
  "BindProjectionScope",
  "PrepareEventAppend",
  "PrepareCorrectionAppend",
  "PrepareDisputeAppend",
  "PrepareSupersessionAppend",
  "PrepareDisclosureEvidence",
  "PrepareExportEvidence",
  "PrepareRetentionEvidence",
  "PrepareDispositionEvidence",
  "PrepareBreakGlassReview",
  "SealEnforcementPlan",
] as const);
