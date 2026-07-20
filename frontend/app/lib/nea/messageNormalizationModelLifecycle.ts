/**
 * NEA-6:3 — Message Normalization Model Lifecycle.
 *
 * Ordered model-phase lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-6:3.
 */

import type { MessageNormalizationModelLifecycleState } from "./messageNormalizationModelTypes.ts";

/** Canonical ordered model-phase lifecycle states. */
export const MESSAGE_NORMALIZATION_MODEL_LIFECYCLE_STATES: readonly MessageNormalizationModelLifecycleState[] =
  Object.freeze([
    "Declared",
    "Composed",
    "Verified",
    "Published",
    "Referenced",
    "Retired",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Composed",
  ]) as readonly MessageNormalizationModelLifecycleState[],
  Composed: Object.freeze([
    "Verified",
  ]) as readonly MessageNormalizationModelLifecycleState[],
  Verified: Object.freeze([
    "Published",
  ]) as readonly MessageNormalizationModelLifecycleState[],
  Published: Object.freeze([
    "Referenced",
  ]) as readonly MessageNormalizationModelLifecycleState[],
  Referenced: Object.freeze([
    "Retired",
  ]) as readonly MessageNormalizationModelLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly MessageNormalizationModelLifecycleState[],
} as const);

/** Canonical immutable Message Normalization Model lifecycle declaration. */
export const MessageNormalizationModelLifecycle = Object.freeze({
  lifecycleId: "NEA-6:3/MessageNormalizationModelLifecycle",
  sourcePhase: "NEA-6:3" as const,
  states: MESSAGE_NORMALIZATION_MODEL_LIFECYCLE_STATES,
  stateCount: MESSAGE_NORMALIZATION_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Published" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
