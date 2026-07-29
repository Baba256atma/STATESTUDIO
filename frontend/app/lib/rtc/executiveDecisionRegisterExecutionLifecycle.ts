/**
 * RTC-3:7 — Executive Decision Register Execution Contract Lifecycle.
 *
 * Ownership: owned exclusively by RTC-3:7.
 */

import type { ExecutiveDecisionRegisterExecutionStepRole } from "./executiveDecisionRegisterExecutionTypes.ts";

export type ExecutiveDecisionRegisterExecutionLifecycleState =
  | "Declared"
  | "ContractsBound"
  | "Sealed";

export const EXECUTIVE_DECISION_REGISTER_EXECUTION_LIFECYCLE_STATES =
  Object.freeze([
    "Declared",
    "ContractsBound",
    "Sealed",
  ] as const satisfies readonly ExecutiveDecisionRegisterExecutionLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["ContractsBound"] as const),
  ContractsBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveDecisionRegisterExecutionLifecycle = Object.freeze({
  lifecycleId:
    "RTC-3:7/ExecutiveDecisionRegisterExecutionLifecycle" as const,
  sourcePhase: "RTC-3:7" as const,
  states: EXECUTIVE_DECISION_REGISTER_EXECUTION_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_DECISION_REGISTER_EXECUTION_LIFECYCLE_STATES.length,
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
  terminalReceiptStates: Object.freeze([
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

/** Closed execution-step catalogue with role descriptors. */
export const ExecutiveDecisionRegisterExecutionStepKinds = Object.freeze([
  "VerifyIntentBinding",
  "VerifyIdempotencyBinding",
  "VerifyExpectedSequence",
  "VerifyAuthorityAndConfirmationBinding",
  "VerifyObligationCompletion",
  "VerifyAppendOnlyBoundary",
  "BeginAtomicBoundary",
  "AllocateRegisterSequence",
  "PrepareEventEnvelope",
  "PrepareIntegritySeal",
  "RequestAppendOnlyEventCommit",
  "PrepareIdempotencyRecord",
  "RequestProjectionUpdate",
  "RequestOutcomeCapture",
  "CommitAtomicBoundary",
  "ProduceExecutionReceipt",
] as const);

export const ExecutiveDecisionRegisterExecutionStepRoles = Object.freeze({
  VerifyIntentBinding: "verification-only",
  VerifyIdempotencyBinding: "verification-only",
  VerifyExpectedSequence: "verification-only",
  VerifyAuthorityAndConfirmationBinding: "verification-only",
  VerifyObligationCompletion: "verification-only",
  VerifyAppendOnlyBoundary: "verification-only",
  BeginAtomicBoundary: "executor-facing",
  AllocateRegisterSequence: "executor-facing",
  PrepareEventEnvelope: "executor-facing",
  PrepareIntegritySeal: "executor-facing",
  RequestAppendOnlyEventCommit: "effect-requesting",
  PrepareIdempotencyRecord: "executor-facing",
  RequestProjectionUpdate: "effect-requesting",
  RequestOutcomeCapture: "effect-requesting",
  CommitAtomicBoundary: "executor-facing",
  ProduceExecutionReceipt: "receipt-producing",
} as const satisfies Readonly<
  Record<
    (typeof ExecutiveDecisionRegisterExecutionStepKinds)[number],
    ExecutiveDecisionRegisterExecutionStepRole
  >
>);
