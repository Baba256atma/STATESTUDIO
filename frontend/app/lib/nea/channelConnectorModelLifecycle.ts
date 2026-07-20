/**
 * NEA-2:3 — Channel Connector Model Lifecycle.
 *
 * Ordered model-phase lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-2:3.
 */

import type { ChannelConnectorModelLifecycleState } from "./channelConnectorModelTypes.ts";

/** Canonical ordered model-phase lifecycle states. */
export const CHANNEL_CONNECTOR_MODEL_LIFECYCLE_STATES: readonly ChannelConnectorModelLifecycleState[] =
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
  ]) as readonly ChannelConnectorModelLifecycleState[],
  Typed: Object.freeze([
    "Composed",
  ]) as readonly ChannelConnectorModelLifecycleState[],
  Composed: Object.freeze([
    "Related",
  ]) as readonly ChannelConnectorModelLifecycleState[],
  Related: Object.freeze([
    "Boundaried",
  ]) as readonly ChannelConnectorModelLifecycleState[],
  Boundaried: Object.freeze([
    "ReadyForValidation",
  ]) as readonly ChannelConnectorModelLifecycleState[],
  ReadyForValidation: Object.freeze(
    [] as const,
  ) as readonly ChannelConnectorModelLifecycleState[],
} as const);

/** Canonical immutable Channel Connector Model lifecycle declaration. */
export const ChannelConnectorModelLifecycle = Object.freeze({
  lifecycleId: "NEA-2:3/ChannelConnectorModelLifecycle",
  sourcePhase: "NEA-2:3" as const,
  states: CHANNEL_CONNECTOR_MODEL_LIFECYCLE_STATES,
  stateCount: CHANNEL_CONNECTOR_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "ReadyForValidation" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
