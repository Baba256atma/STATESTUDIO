/**
 * RTC-3:3 — Executive Decision Register Model Lifecycle.
 *
 * Model lifecycle and closed state-distinction vocabularies.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by RTC-3:3.
 */

import type {
  ExecutiveDecisionRegisterAuthorityState,
  ExecutiveDecisionRegisterClosureState,
  ExecutiveDecisionRegisterCurrencyState,
  ExecutiveDecisionRegisterDecisionLifecycleState,
  ExecutiveDecisionRegisterDispositionState,
  ExecutiveDecisionRegisterDisputeState,
  ExecutiveDecisionRegisterEvidenceCategory,
  ExecutiveDecisionRegisterModelLifecycleState,
  ExecutiveDecisionRegisterOriginState,
  ExecutiveDecisionRegisterPrivacyCategory,
  ExecutiveDecisionRegisterRelationshipKind,
} from "./executiveDecisionRegisterModelTypes.ts";

/** Formal model lifecycle states. */
export const EXECUTIVE_DECISION_REGISTER_MODEL_LIFECYCLE_STATES:
  readonly ExecutiveDecisionRegisterModelLifecycleState[] = Object.freeze([
    "Declared",
    "Structured",
    "Sealed",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Structured",
  ]) as readonly ExecutiveDecisionRegisterModelLifecycleState[],
  Structured: Object.freeze([
    "Sealed",
  ]) as readonly ExecutiveDecisionRegisterModelLifecycleState[],
  Sealed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveDecisionRegisterModelLifecycleState[],
} as const);

/**
 * Canonical immutable model lifecycle declaration.
 * Reopening is modeled as a new event relationship, not in-place mutation.
 */
export const ExecutiveDecisionRegisterModelLifecycle = Object.freeze({
  lifecycleId: "RTC-3:3/ExecutiveDecisionRegisterModelLifecycle" as const,
  sourcePhase: "RTC-3:3" as const,
  states: EXECUTIVE_DECISION_REGISTER_MODEL_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_DECISION_REGISTER_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  appendOnlyHistory: true as const,
  reopenRequiresNewEventRelationship: true as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Closed authority states. */
export const ExecutiveDecisionRegisterAuthorityStates:
  readonly ExecutiveDecisionRegisterAuthorityState[] = Object.freeze([
    "NonAuthoritative",
    "Authoritative",
  ]);

/** Closed origin states. */
export const ExecutiveDecisionRegisterOriginStates:
  readonly ExecutiveDecisionRegisterOriginState[] = Object.freeze([
    "HumanAuthored",
    "AiProposed",
    "SystemDerived",
  ]);

/** Closed decision lifecycle states. */
export const ExecutiveDecisionRegisterDecisionLifecycleStates:
  readonly ExecutiveDecisionRegisterDecisionLifecycleState[] = Object.freeze([
    "Proposed",
    "Confirmed",
    "Effective",
    "Disputed",
    "Superseded",
    "Closed",
    "Disposed",
  ]);

/** Closed currency states. */
export const ExecutiveDecisionRegisterCurrencyStates:
  readonly ExecutiveDecisionRegisterCurrencyState[] = Object.freeze([
    "Current",
    "Superseded",
  ]);

/** Closed dispute states. */
export const ExecutiveDecisionRegisterDisputeStates:
  readonly ExecutiveDecisionRegisterDisputeState[] = Object.freeze([
    "Undisputed",
    "Disputed",
    "Resolved",
  ]);

/** Closed closure states. */
export const ExecutiveDecisionRegisterClosureStates:
  readonly ExecutiveDecisionRegisterClosureState[] = Object.freeze([
    "Open",
    "Closed",
  ]);

/** Closed disposition states. */
export const ExecutiveDecisionRegisterDispositionStates:
  readonly ExecutiveDecisionRegisterDispositionState[] = Object.freeze([
    "Active",
    "Disposed",
  ]);

/** Closed evidence categories. */
export const ExecutiveDecisionRegisterEvidenceCategories:
  readonly ExecutiveDecisionRegisterEvidenceCategory[] = Object.freeze([
    "Referenced",
    "VersionPinned",
    "ContentAddressed",
    "Unavailable",
    "Disputed",
  ]);

/** Closed privacy categories (private reflection excluded). */
export const ExecutiveDecisionRegisterPrivacyCategories:
  readonly ExecutiveDecisionRegisterPrivacyCategory[] = Object.freeze([
    "SharedExecutiveRecord",
    "RestrictedExecutiveRecord",
    "RegulatedOrPrivilegedRecord",
  ]);

/** Closed append-only relationship kinds. */
export const ExecutiveDecisionRegisterRelationshipKinds:
  readonly ExecutiveDecisionRegisterRelationshipKind[] = Object.freeze([
    "ProposedFrom",
    "ConfirmedBy",
    "Corrects",
    "Disputes",
    "ResolvesDispute",
    "Supersedes",
    "ReferencesOutcome",
    "DerivedFrom",
    "DisposedBy",
  ]);

/**
 * Closed record-state distinction vocabularies used by entity fields.
 * Security-sensitive distinctions are closed unions, not optional booleans.
 */
export const ExecutiveDecisionRegisterStateDistinctions = Object.freeze({
  authority: ExecutiveDecisionRegisterAuthorityStates,
  origin: ExecutiveDecisionRegisterOriginStates,
  decisionLifecycle: ExecutiveDecisionRegisterDecisionLifecycleStates,
  currency: ExecutiveDecisionRegisterCurrencyStates,
  dispute: ExecutiveDecisionRegisterDisputeStates,
  closure: ExecutiveDecisionRegisterClosureStates,
  disposition: ExecutiveDecisionRegisterDispositionStates,
  evidence: ExecutiveDecisionRegisterEvidenceCategories,
  privacy: ExecutiveDecisionRegisterPrivacyCategories,
  relationships: ExecutiveDecisionRegisterRelationshipKinds,
  privateReflectionOutsideModel: true as const,
  authoritativeRequiresAuthorityAndHumanConfirmation: true as const,
  aiProposedRemainsNonAuthoritative: true as const,
  reopenRequiresNewEventRelationship: true as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

const includesClosed = (
  values: readonly string[],
  value: unknown,
): boolean => typeof value === "string" && values.includes(value);

export function isCanonicalDecisionRegisterModelLifecycleState(
  value: unknown,
): value is ExecutiveDecisionRegisterModelLifecycleState {
  return includesClosed(
    EXECUTIVE_DECISION_REGISTER_MODEL_LIFECYCLE_STATES,
    value,
  );
}

export function isCanonicalDecisionRegisterAuthorityState(
  value: unknown,
): value is ExecutiveDecisionRegisterAuthorityState {
  return includesClosed(ExecutiveDecisionRegisterAuthorityStates, value);
}

export function isCanonicalDecisionRegisterOriginState(
  value: unknown,
): value is ExecutiveDecisionRegisterOriginState {
  return includesClosed(ExecutiveDecisionRegisterOriginStates, value);
}

export function isCanonicalDecisionRegisterDecisionLifecycleState(
  value: unknown,
): value is ExecutiveDecisionRegisterDecisionLifecycleState {
  return includesClosed(ExecutiveDecisionRegisterDecisionLifecycleStates, value);
}

export function isCanonicalDecisionRegisterCurrencyState(
  value: unknown,
): value is ExecutiveDecisionRegisterCurrencyState {
  return includesClosed(ExecutiveDecisionRegisterCurrencyStates, value);
}

export function isCanonicalDecisionRegisterDisputeState(
  value: unknown,
): value is ExecutiveDecisionRegisterDisputeState {
  return includesClosed(ExecutiveDecisionRegisterDisputeStates, value);
}

export function isCanonicalDecisionRegisterClosureState(
  value: unknown,
): value is ExecutiveDecisionRegisterClosureState {
  return includesClosed(ExecutiveDecisionRegisterClosureStates, value);
}

export function isCanonicalDecisionRegisterDispositionState(
  value: unknown,
): value is ExecutiveDecisionRegisterDispositionState {
  return includesClosed(ExecutiveDecisionRegisterDispositionStates, value);
}

export function isCanonicalDecisionRegisterEvidenceCategory(
  value: unknown,
): value is ExecutiveDecisionRegisterEvidenceCategory {
  return includesClosed(ExecutiveDecisionRegisterEvidenceCategories, value);
}

export function isCanonicalDecisionRegisterPrivacyCategory(
  value: unknown,
): value is ExecutiveDecisionRegisterPrivacyCategory {
  return includesClosed(ExecutiveDecisionRegisterPrivacyCategories, value);
}

export function isCanonicalDecisionRegisterRelationshipKind(
  value: unknown,
): value is ExecutiveDecisionRegisterRelationshipKind {
  return includesClosed(ExecutiveDecisionRegisterRelationshipKinds, value);
}
