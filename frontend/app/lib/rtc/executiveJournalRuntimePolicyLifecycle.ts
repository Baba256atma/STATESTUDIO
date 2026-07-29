/**
 * RTC-2:5 — Executive Journal Runtime Policy Lifecycle.
 *
 * Policy lifecycle and readiness metadata.
 *
 * Ownership: owned exclusively by RTC-2:5.
 */

export type ExecutiveJournalRuntimePolicyLifecycleState =
  | "Declared"
  | "RulesBound"
  | "Sealed";

export const EXECUTIVE_JOURNAL_POLICY_LIFECYCLE_STATES = Object.freeze([
  "Declared",
  "RulesBound",
  "Sealed",
] as const satisfies readonly ExecutiveJournalRuntimePolicyLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["RulesBound"] as const),
  RulesBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveJournalRuntimePolicyLifecycle = Object.freeze({
  lifecycleId: "RTC-2:5/ExecutiveJournalRuntimePolicyLifecycle" as const,
  sourcePhase: "RTC-2:5" as const,
  states: EXECUTIVE_JOURNAL_POLICY_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_JOURNAL_POLICY_LIFECYCLE_STATES.length,
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
export const ExecutiveJournalRuntimePolicyOperations = Object.freeze([
  "Propose",
  "Confirm",
  "Accept",
  "Correct",
  "Dispute",
  "ResolveDispute",
  "Supersede",
  "CreateCommitment",
  "CloseCommitment",
  "Read",
  "Search",
  "Project",
  "Disclose",
  "Export",
  "PromotePrivateReflection",
  "ApplyRetention",
  "Dispose",
  "BreakGlassAccess",
] as const);

/** Closed obligation kinds. */
export const ExecutiveJournalRuntimePolicyObligationKinds = Object.freeze([
  "RequireHumanConfirmation",
  "RequireAuthorityEvidence",
  "RequireEvidenceReference",
  "RequirePurposeBinding",
  "RequireFieldFiltering",
  "RequireRedaction",
  "RequireDisclosureEvidence",
  "RequireExportEvidence",
  "RequireReview",
  "RequireExpiry",
  "RequireBreakGlassReview",
  "RequireDispositionEvidence",
] as const);
