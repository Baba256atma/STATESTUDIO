/**
 * RTC-3:4 — Executive Decision Register Validation Lifecycle.
 *
 * Validation lifecycle and readiness metadata.
 * Metadata only — evaluation is pure and does not advance runtime state.
 *
 * Ownership: owned exclusively by RTC-3:4.
 */

export type ExecutiveDecisionRegisterValidationLifecycleState =
  | "Declared"
  | "RulesBound"
  | "Sealed";

export const EXECUTIVE_DECISION_REGISTER_VALIDATION_LIFECYCLE_STATES =
  Object.freeze([
    "Declared",
    "RulesBound",
    "Sealed",
  ] as const satisfies readonly ExecutiveDecisionRegisterValidationLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["RulesBound"] as const),
  RulesBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveDecisionRegisterValidationLifecycle = Object.freeze({
  lifecycleId: "RTC-3:4/ExecutiveDecisionRegisterValidationLifecycle" as const,
  sourcePhase: "RTC-3:4" as const,
  states: EXECUTIVE_DECISION_REGISTER_VALIDATION_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_DECISION_REGISTER_VALIDATION_LIFECYCLE_STATES.length,
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

/** Severity catalogue with blocking semantics. */
export const ExecutiveDecisionRegisterValidationSeverities = Object.freeze([
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

export const ExecutiveDecisionRegisterValidationSeverityNames = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
] as const);

export const ExecutiveDecisionRegisterBlockingSeverities = Object.freeze([
  "Error",
  "Critical",
] as const);
