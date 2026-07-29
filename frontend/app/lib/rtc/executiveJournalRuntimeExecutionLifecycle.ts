/**
 * RTC-2:7 — Executive Journal Runtime Execution Contract Lifecycle.
 *
 * Ownership: owned exclusively by RTC-2:7.
 */

export type ExecutiveJournalRuntimeExecutionLifecycleState =
  | "Declared"
  | "ContractsBound"
  | "Sealed";

export const EXECUTIVE_JOURNAL_EXECUTION_LIFECYCLE_STATES = Object.freeze([
  "Declared",
  "ContractsBound",
  "Sealed",
] as const satisfies readonly ExecutiveJournalRuntimeExecutionLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["ContractsBound"] as const),
  ContractsBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveJournalRuntimeExecutionLifecycle = Object.freeze({
  lifecycleId: "RTC-2:7/ExecutiveJournalRuntimeExecutionLifecycle" as const,
  sourcePhase: "RTC-2:7" as const,
  states: EXECUTIVE_JOURNAL_EXECUTION_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_JOURNAL_EXECUTION_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  contractsOnly: true as const,
  executesIntents: false as const,
  intentKinds: Object.freeze(["Rejected", "Executable"] as const),
  receiptKinds: Object.freeze([
    "Committed",
    "Conflict",
    "Failed",
    "Indeterminate",
  ] as const),
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Closed execution-step catalogue. */
export const ExecutiveJournalRuntimeExecutionStepKinds = Object.freeze([
  "VerifyEnforcementPlan",
  "VerifyIdempotency",
  "VerifyExpectedSequence",
  "VerifyLifecyclePrecondition",
  "VerifyAuthorityBinding",
  "VerifyEvidenceBinding",
  "BeginAtomicBoundary",
  "AllocateJournalSequence",
  "PrepareEventEnvelope",
  "PrepareIntegritySeal",
  "PrepareEventAppend",
  "PrepareIdempotencyRecord",
  "PreparePolicyEvidenceReference",
  "PrepareTransactionalOutbox",
  "CommitAtomicBoundary",
  "ProduceExecutionReceipt",
] as const);
