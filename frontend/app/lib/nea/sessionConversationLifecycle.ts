/**
 * NEA-3:1 — Session & Conversation Lifecycle.
 *
 * Ordered session and conversation lifecycle states and transition maps.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-3:1.
 */

import type {
  ConversationLifecycleState,
  SessionLifecycleState,
} from "./sessionConversationFoundationTypes.ts";

/** Canonical ordered session lifecycle states. */
export const SESSION_LIFECYCLE_STATES: readonly SessionLifecycleState[] =
  Object.freeze(["Created", "Active", "Suspended", "Closed"]);

/** Canonical ordered conversation lifecycle states. */
export const CONVERSATION_LIFECYCLE_STATES: readonly ConversationLifecycleState[] =
  Object.freeze([
    "Started",
    "Active",
    "Waiting",
    "Completed",
    "Archived",
  ]);

const SESSION_TRANSITIONS = Object.freeze({
  Created: Object.freeze([
    "Active",
    "Closed",
  ]) as readonly SessionLifecycleState[],
  Active: Object.freeze([
    "Suspended",
    "Closed",
  ]) as readonly SessionLifecycleState[],
  Suspended: Object.freeze([
    "Active",
    "Closed",
  ]) as readonly SessionLifecycleState[],
  Closed: Object.freeze([] as const) as readonly SessionLifecycleState[],
} as const);

const CONVERSATION_TRANSITIONS = Object.freeze({
  Started: Object.freeze([
    "Active",
    "Completed",
  ]) as readonly ConversationLifecycleState[],
  Active: Object.freeze([
    "Waiting",
    "Completed",
  ]) as readonly ConversationLifecycleState[],
  Waiting: Object.freeze([
    "Active",
    "Completed",
  ]) as readonly ConversationLifecycleState[],
  Completed: Object.freeze([
    "Archived",
  ]) as readonly ConversationLifecycleState[],
  Archived: Object.freeze(
    [] as const,
  ) as readonly ConversationLifecycleState[],
} as const);

/** Canonical immutable session & conversation lifecycle declaration. */
export const SessionConversationLifecycle = Object.freeze({
  lifecycleId: "NEA-3:1/SessionConversationLifecycle",
  sourcePhase: "NEA-3:1" as const,
  session: Object.freeze({
    states: SESSION_LIFECYCLE_STATES,
    stateCount: SESSION_LIFECYCLE_STATES.length,
    transitions: SESSION_TRANSITIONS,
    initialState: "Created" as const,
    terminalState: "Closed" as const,
  }),
  conversation: Object.freeze({
    states: CONVERSATION_LIFECYCLE_STATES,
    stateCount: CONVERSATION_LIFECYCLE_STATES.length,
    transitions: CONVERSATION_TRANSITIONS,
    initialState: "Started" as const,
    terminalState: "Archived" as const,
  }),
  sessionLifecycleStateCount: SESSION_LIFECYCLE_STATES.length,
  conversationLifecycleStateCount: CONVERSATION_LIFECYCLE_STATES.length,
  executesRuntime: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
