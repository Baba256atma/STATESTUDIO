/**
 * RTC-2:3 — Executive Journal Runtime Model Lifecycle.
 *
 * Ordered immutable model lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by RTC-2:3.
 */

import type { ExecutiveJournalRuntimeModelLifecycleState } from "./executiveJournalRuntimeModelTypes.ts";

/** Formal model lifecycle states. */
export const EXECUTIVE_JOURNAL_MODEL_LIFECYCLE_STATES:
  readonly ExecutiveJournalRuntimeModelLifecycleState[] = Object.freeze([
    "Declared",
    "Structured",
    "Sealed",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Structured",
  ]) as readonly ExecutiveJournalRuntimeModelLifecycleState[],
  Structured: Object.freeze([
    "Sealed",
  ]) as readonly ExecutiveJournalRuntimeModelLifecycleState[],
  Sealed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveJournalRuntimeModelLifecycleState[],
} as const);

/**
 * Canonical immutable model lifecycle declaration.
 * Record reopen and supersession are new modeled transitions, not in-place edits.
 */
export const ExecutiveJournalRuntimeModelLifecycle = Object.freeze({
  lifecycleId: "RTC-2:3/ExecutiveJournalRuntimeModelLifecycle" as const,
  sourcePhase: "RTC-2:3" as const,
  states: EXECUTIVE_JOURNAL_MODEL_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_JOURNAL_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  appendOnlyAcceptedHistory: true as const,
  reopenCreatesNewTransition: true as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Closed record-state distinction vocabularies used by entity fields.
 * Security-sensitive distinctions are closed unions, not optional booleans.
 */
export const ExecutiveJournalRuntimeStateDistinctions = Object.freeze({
  acceptance: Object.freeze(["Proposed", "Accepted"] as const),
  dispute: Object.freeze(["Undisputed", "Disputed", "Resolved"] as const),
  currency: Object.freeze(["Current", "Superseded"] as const),
  closure: Object.freeze(["Open", "Closed"] as const),
  disposition: Object.freeze(["Active", "Disposed"] as const),
  authorityKind: Object.freeze(["Authoritative", "Derived"] as const),
  recordVisibility: Object.freeze([
    "SharedExecutiveRecord",
    "PrivateReflection",
  ] as const),
  confirmationSource: Object.freeze([
    "HumanConfirmed",
    "AiProposed",
  ] as const),
  informationCategory: Object.freeze([
    "PrivateReflection",
    "RestrictedWorking",
    "ExecutiveRecord",
    "RegulatedPrivileged",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
} as const);
