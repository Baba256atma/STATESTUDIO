/**
 * NEA-3:3 — Session & Conversation Model Lifecycle.
 *
 * Ordered model-phase lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-3:3.
 */

import type { SessionConversationModelLifecycleState } from "./sessionConversationModelTypes.ts";

/** Canonical ordered model-phase lifecycle states. */
export const SESSION_CONVERSATION_MODEL_LIFECYCLE_STATES: readonly SessionConversationModelLifecycleState[] =
  Object.freeze([
    "Declared",
    "Typed",
    "Composed",
    "Related",
    "Boundaried",
    "ReadyForValidation",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Typed",
  ]) as readonly SessionConversationModelLifecycleState[],
  Typed: Object.freeze([
    "Composed",
  ]) as readonly SessionConversationModelLifecycleState[],
  Composed: Object.freeze([
    "Related",
  ]) as readonly SessionConversationModelLifecycleState[],
  Related: Object.freeze([
    "Boundaried",
  ]) as readonly SessionConversationModelLifecycleState[],
  Boundaried: Object.freeze([
    "ReadyForValidation",
  ]) as readonly SessionConversationModelLifecycleState[],
  ReadyForValidation: Object.freeze(
    [] as const,
  ) as readonly SessionConversationModelLifecycleState[],
} as const);

/** Canonical immutable Session & Conversation Model lifecycle declaration. */
export const SessionConversationModelLifecycle = Object.freeze({
  lifecycleId: "NEA-3:3/SessionConversationModelLifecycle",
  sourcePhase: "NEA-3:3" as const,
  states: SESSION_CONVERSATION_MODEL_LIFECYCLE_STATES,
  stateCount: SESSION_CONVERSATION_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "ReadyForValidation" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
