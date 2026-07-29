/**
 * RTC-3:8 — Executive Decision Register Reconciliation & Assurance Lifecycle.
 *
 * Ownership: owned exclusively by RTC-3:8.
 */

import type {
  ExecutiveDecisionRegisterAssuranceEvidenceKind,
  ExecutiveDecisionRegisterAssuranceResultKind,
  ExecutiveDecisionRegisterAssuranceSeverity,
  ExecutiveDecisionRegisterAssuranceSubjectKind,
} from "./executiveDecisionRegisterAssuranceTypes.ts";

export type ExecutiveDecisionRegisterAssuranceLifecycleState =
  | "Declared"
  | "RulesBound"
  | "Sealed";

export const EXECUTIVE_DECISION_REGISTER_ASSURANCE_LIFECYCLE_STATES =
  Object.freeze([
    "Declared",
    "RulesBound",
    "Sealed",
  ] as const satisfies readonly ExecutiveDecisionRegisterAssuranceLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["RulesBound"] as const),
  RulesBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

/** Closed assurance result precedence: NotAssured > Indeterminate > Assured. */
export const ExecutiveDecisionRegisterAssuranceResultPrecedence =
  Object.freeze([
    "NotAssured",
    "Indeterminate",
    "Assured",
  ] as const satisfies readonly ExecutiveDecisionRegisterAssuranceResultKind[]);

export const ExecutiveDecisionRegisterAssuranceSeverities = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
] as const satisfies readonly ExecutiveDecisionRegisterAssuranceSeverity[]);

export const ExecutiveDecisionRegisterAssuranceSubjectKinds = Object.freeze([
  "ExecutionAggregate",
  "ExecutionRequest",
  "EnforcementPlan",
  "ExecutionIntent",
  "AtomicBatch",
  "ExecutionStep",
  "IdempotencyBinding",
  "ConcurrencyBinding",
  "ExecutionReceipt",
  "OutcomeEvidence",
  "AuthorityBinding",
  "ConfirmationBinding",
  "ObligationBinding",
  "DecisionRegister",
  "AppendOnlyClaim",
  "ProjectionClaim",
  "TelemetryClaim",
  "AiBoundary",
  "PrivacyBoundary",
  "RetentionClaim",
] as const satisfies readonly ExecutiveDecisionRegisterAssuranceSubjectKind[]);

export const ExecutiveDecisionRegisterAssuranceEvidenceKinds = Object.freeze([
  "CommitEvidence",
  "ConcurrencyConflictEvidence",
  "IdempotencyConflictEvidence",
  "DefinitiveRejectionEvidence",
  "RollbackEvidence",
  "TimeoutEvidence",
  "AcknowledgementEvidence",
  "SequenceEvidence",
  "AtomicityEvidence",
  "AppendOnlyEventEvidence",
  "ProjectionEvidence",
  "OutcomeReferenceEvidence",
  "TelemetryEvidence",
  "EvidenceUnavailable",
] as const satisfies readonly ExecutiveDecisionRegisterAssuranceEvidenceKind[]);

export const ExecutiveDecisionRegisterAssuranceLifecycle = Object.freeze({
  lifecycleId:
    "RTC-3:8/ExecutiveDecisionRegisterAssuranceLifecycle" as const,
  sourcePhase: "RTC-3:8" as const,
  states: EXECUTIVE_DECISION_REGISTER_ASSURANCE_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_DECISION_REGISTER_ASSURANCE_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  resultKinds: ExecutiveDecisionRegisterAssuranceResultPrecedence,
  resultPrecedence: ExecutiveDecisionRegisterAssuranceResultPrecedence,
  severities: ExecutiveDecisionRegisterAssuranceSeverities,
  subjectKinds: ExecutiveDecisionRegisterAssuranceSubjectKinds,
  evidenceKinds: ExecutiveDecisionRegisterAssuranceEvidenceKinds,
  evaluatesOnly: true as const,
  repairsEvidence: false as const,
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
