/**
 * NEA-6:1 — Message Normalization Lifecycle.
 *
 * Ordered normalization lifecycle states and transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-6:1.
 */

import type { MessageNormalizationLifecycleState } from "./messageNormalizationFoundationTypes.ts";

/** Canonical ordered normalization lifecycle states. */
export const MESSAGE_NORMALIZATION_LIFECYCLE_STATES: readonly MessageNormalizationLifecycleState[] =
  Object.freeze([
    "Received",
    "Identified",
    "Mapped",
    "Normalized",
    "Verified",
    "Published",
  ]);

const MESSAGE_NORMALIZATION_TRANSITIONS = Object.freeze({
  Received: Object.freeze([
    "Identified",
  ]) as readonly MessageNormalizationLifecycleState[],
  Identified: Object.freeze([
    "Mapped",
  ]) as readonly MessageNormalizationLifecycleState[],
  Mapped: Object.freeze([
    "Normalized",
  ]) as readonly MessageNormalizationLifecycleState[],
  Normalized: Object.freeze([
    "Verified",
  ]) as readonly MessageNormalizationLifecycleState[],
  Verified: Object.freeze([
    "Published",
  ]) as readonly MessageNormalizationLifecycleState[],
  Published: Object.freeze(
    [] as const,
  ) as readonly MessageNormalizationLifecycleState[],
} as const);

/** Canonical immutable normalization lifecycle declaration. */
export const MessageNormalizationLifecycle = Object.freeze({
  lifecycleId: "NEA-6:1/MessageNormalizationLifecycle",
  sourcePhase: "NEA-6:1" as const,
  states: MESSAGE_NORMALIZATION_LIFECYCLE_STATES,
  stateCount: MESSAGE_NORMALIZATION_LIFECYCLE_STATES.length,
  transitions: MESSAGE_NORMALIZATION_TRANSITIONS,
  initialState: "Received" as const,
  terminalState: "Published" as const,
  executesRuntime: false as const,
  stateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
