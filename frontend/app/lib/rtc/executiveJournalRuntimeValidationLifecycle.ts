/**
 * RTC-2:4 — Executive Journal Runtime Validation Lifecycle.
 *
 * Validation lifecycle and readiness metadata.
 * Metadata only — evaluation is pure and does not advance runtime state.
 *
 * Ownership: owned exclusively by RTC-2:4.
 */

export type ExecutiveJournalRuntimeValidationLifecycleState =
  | "Declared"
  | "RulesBound"
  | "Sealed";

export const EXECUTIVE_JOURNAL_VALIDATION_LIFECYCLE_STATES = Object.freeze([
  "Declared",
  "RulesBound",
  "Sealed",
] as const satisfies readonly ExecutiveJournalRuntimeValidationLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["RulesBound"] as const),
  RulesBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveJournalRuntimeValidationLifecycle = Object.freeze({
  lifecycleId: "RTC-2:4/ExecutiveJournalRuntimeValidationLifecycle" as const,
  sourcePhase: "RTC-2:4" as const,
  states: EXECUTIVE_JOURNAL_VALIDATION_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_JOURNAL_VALIDATION_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  evaluatesOnly: true as const,
  mutatesInputs: false as const,
  repairsInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** RTC-1:4 severity catalogue with blocking semantics. */
export const ExecutiveJournalRuntimeValidationSeverities = Object.freeze([
  Object.freeze({
    level: "Info" as const,
    preventsValidity: false,
    order: 1,
  }),
  Object.freeze({
    level: "Warning" as const,
    preventsValidity: false,
    order: 2,
  }),
  Object.freeze({
    level: "Error" as const,
    preventsValidity: true,
    order: 3,
  }),
  Object.freeze({
    level: "Critical" as const,
    preventsValidity: true,
    order: 4,
  }),
] as const);

export const ExecutiveJournalRuntimeValidationSeverityNames = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
] as const);

export const ExecutiveJournalRuntimeBlockingSeverities = Object.freeze([
  "Error",
  "Critical",
] as const);
