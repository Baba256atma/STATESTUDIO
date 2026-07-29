/**
 * RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance Lifecycle.
 *
 * Ownership: owned exclusively by RTC-2:8.
 */

export type ExecutiveJournalRuntimeAssuranceLifecycleState =
  | "Declared"
  | "RulesBound"
  | "Sealed";

export const EXECUTIVE_JOURNAL_ASSURANCE_LIFECYCLE_STATES = Object.freeze([
  "Declared",
  "RulesBound",
  "Sealed",
] as const satisfies readonly ExecutiveJournalRuntimeAssuranceLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["RulesBound"] as const),
  RulesBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveJournalRuntimeAssuranceLifecycle = Object.freeze({
  lifecycleId: "RTC-2:8/ExecutiveJournalRuntimeAssuranceLifecycle" as const,
  sourcePhase: "RTC-2:8" as const,
  states: EXECUTIVE_JOURNAL_ASSURANCE_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_JOURNAL_ASSURANCE_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  evaluatesOnly: true as const,
  repairsEvidence: false as const,
  precedence: Object.freeze([
    "Invalid",
    "Divergent",
    "Indeterminate",
    "Reconciled",
  ] as const),
  severities: Object.freeze(["Critical", "Error", "Warning"] as const),
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Closed assurance subject catalogue. */
export const ExecutiveJournalRuntimeAssuranceSubjectKinds = Object.freeze([
  "ExecutionIntent",
  "ExecutionReceipt",
  "EventBatch",
  "AcceptedEvent",
  "JournalSequence",
  "IdempotencyRecord",
  "IntegrityEvidence",
  "PolicyEvidence",
  "EnforcementEvidence",
  "AuthorityEvidence",
  "ConfirmationEvidence",
  "DisclosureEvidence",
  "ExportEvidence",
  "RetentionEvidence",
  "DispositionEvidence",
  "ProjectionCheckpoint",
  "ReplayEvidence",
  "RecoveryEvidence",
  "TelemetryEvidence",
] as const);
