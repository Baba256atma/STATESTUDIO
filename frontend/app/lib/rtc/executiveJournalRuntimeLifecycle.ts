/**
 * RTC-2:1 — Executive Journal Runtime Lifecycle.
 *
 * Ordered immutable journal record states and declarative transition map (§2.3).
 * Metadata only — no runtime state machine.
 * Corrections supersede prior events; they do not erase them.
 *
 * Ownership: owned exclusively by RTC-2:1.
 */

import type {
  ExecutiveJournalLifecycleDeclaration,
  ExecutiveJournalLifecycleState,
} from "./executiveJournalRuntimeTypes.ts";

/** Canonical Executive Journal record states. */
export const EXECUTIVE_JOURNAL_LIFECYCLE_STATES:
  readonly ExecutiveJournalLifecycleState[] = Object.freeze([
    "Proposed",
    "Accepted",
    "Disputed",
    "Superseded",
    "Closed",
    "Disposed",
  ]);

/**
 * Permitted transitions per §2.3.
 * Closed reopen and dispute resolution are expressed as new accepted events
 * in the append-only stream; the original record is not rewritten in place.
 */
const TRANSITIONS = Object.freeze({
  Proposed: Object.freeze([
    "Accepted",
    "Disposed",
  ]) as readonly ExecutiveJournalLifecycleState[],
  Accepted: Object.freeze([
    "Disputed",
    "Superseded",
    "Closed",
    "Disposed",
  ]) as readonly ExecutiveJournalLifecycleState[],
  Disputed: Object.freeze([
    "Accepted",
    "Superseded",
    "Closed",
    "Disposed",
  ]) as readonly ExecutiveJournalLifecycleState[],
  Superseded: Object.freeze([
    "Disposed",
  ]) as readonly ExecutiveJournalLifecycleState[],
  Closed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveJournalLifecycleState[],
  Disposed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveJournalLifecycleState[],
} as const);

/**
 * Canonical immutable Executive Journal lifecycle declaration.
 * Transitions are not executed here.
 */
export const ExecutiveJournalRuntimeLifecycle:
  ExecutiveJournalLifecycleDeclaration = Object.freeze({
    lifecycleId: "RTC-2:1/ExecutiveJournalLifecycle" as const,
    sourcePhase: "RTC-2:1" as const,
    states: EXECUTIVE_JOURNAL_LIFECYCLE_STATES,
    stateCount: EXECUTIVE_JOURNAL_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    appendOnly: true as const,
    correctionsDoNotErase: true as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
