/**
 * DKL-3:1 — Data Understanding Lifecycle.
 *
 * Ordered lifecycle states and a deeply frozen transition map. Invalid
 * transitions return structured failure results and do not throw.
 *
 * Ownership: owned exclusively by DKL-3:1.
 */

import type {
  LifecycleTransitionResult,
  UnderstandingLifecycleState,
} from "./dataUnderstandingFoundationTypes.ts";

export const UNDERSTANDING_LIFECYCLE_STATES: readonly UnderstandingLifecycleState[] =
  Object.freeze([
    "Received",
    "Validated",
    "EvidencePrepared",
    "CandidatesGenerated",
    "AmbiguitiesAssessed",
    "ClarificationRequired",
    "UnderstandingReady",
    "Completed",
    "Blocked",
    "Failed",
    "Cancelled",
  ]);

const TRANSITIONS = Object.freeze({
  Received: Object.freeze([
    "Validated",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly UnderstandingLifecycleState[],
  Validated: Object.freeze([
    "EvidencePrepared",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly UnderstandingLifecycleState[],
  EvidencePrepared: Object.freeze([
    "CandidatesGenerated",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly UnderstandingLifecycleState[],
  CandidatesGenerated: Object.freeze([
    "AmbiguitiesAssessed",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly UnderstandingLifecycleState[],
  AmbiguitiesAssessed: Object.freeze([
    "UnderstandingReady",
    "ClarificationRequired",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly UnderstandingLifecycleState[],
  ClarificationRequired: Object.freeze([
    "AmbiguitiesAssessed",
    "UnderstandingReady",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly UnderstandingLifecycleState[],
  UnderstandingReady: Object.freeze([
    "Completed",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly UnderstandingLifecycleState[],
  Completed: Object.freeze([]) as readonly UnderstandingLifecycleState[],
  Blocked: Object.freeze(["Cancelled"]) as readonly UnderstandingLifecycleState[],
  Failed: Object.freeze(["Cancelled"]) as readonly UnderstandingLifecycleState[],
  Cancelled: Object.freeze([]) as readonly UnderstandingLifecycleState[],
}) as Readonly<Record<UnderstandingLifecycleState, readonly UnderstandingLifecycleState[]>>;

/**
 * Attempt a lifecycle transition. Ordinary invalid transitions return failure
 * results and never throw.
 */
export function transitionUnderstandingLifecycle(
  from: UnderstandingLifecycleState,
  to: UnderstandingLifecycleState,
): LifecycleTransitionResult {
  const allowed = TRANSITIONS[from];
  if (!allowed) {
    return Object.freeze({
      ok: false,
      from,
      to,
      failure: Object.freeze({
        code: "UNKNOWN_SOURCE_STATE",
        message: `Unknown lifecycle source state: ${String(from)}`,
      }),
    });
  }
  if (!allowed.includes(to)) {
    return Object.freeze({
      ok: false,
      from,
      to,
      failure: Object.freeze({
        code: "INVALID_LIFECYCLE_TRANSITION",
        message: `Transition from ${from} to ${to} is not permitted.`,
      }),
    });
  }
  return Object.freeze({
    ok: true,
    from,
    to,
    failure: null,
  });
}

/** Canonical immutable lifecycle aggregate. */
export const DataUnderstandingLifecycle = Object.freeze({
  states: UNDERSTANDING_LIFECYCLE_STATES,
  stateCount: UNDERSTANDING_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  transitionUnderstandingLifecycle,
  requiredExamples: Object.freeze([
    Object.freeze({ from: "Received", to: "Validated" }),
    Object.freeze({ from: "Validated", to: "EvidencePrepared" }),
    Object.freeze({ from: "EvidencePrepared", to: "CandidatesGenerated" }),
    Object.freeze({ from: "CandidatesGenerated", to: "AmbiguitiesAssessed" }),
    Object.freeze({ from: "AmbiguitiesAssessed", to: "UnderstandingReady" }),
    Object.freeze({ from: "AmbiguitiesAssessed", to: "ClarificationRequired" }),
    Object.freeze({ from: "UnderstandingReady", to: "Completed" }),
  ]),
});
