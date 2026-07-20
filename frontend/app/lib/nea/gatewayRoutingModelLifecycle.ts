/**
 * NEA-5:3 — Gateway Routing Model Lifecycle.
 *
 * Ordered model-phase lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-5:3.
 */

import type { GatewayRoutingModelLifecycleState } from "./gatewayRoutingModelTypes.ts";

/** Canonical ordered model-phase lifecycle states. */
export const GATEWAY_ROUTING_MODEL_LIFECYCLE_STATES: readonly GatewayRoutingModelLifecycleState[] =
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
  ]) as readonly GatewayRoutingModelLifecycleState[],
  Typed: Object.freeze([
    "Composed",
  ]) as readonly GatewayRoutingModelLifecycleState[],
  Composed: Object.freeze([
    "Related",
  ]) as readonly GatewayRoutingModelLifecycleState[],
  Related: Object.freeze([
    "Boundaried",
  ]) as readonly GatewayRoutingModelLifecycleState[],
  Boundaried: Object.freeze([
    "ReadyForValidation",
  ]) as readonly GatewayRoutingModelLifecycleState[],
  ReadyForValidation: Object.freeze(
    [] as const,
  ) as readonly GatewayRoutingModelLifecycleState[],
} as const);

/** Canonical immutable Gateway Routing Model lifecycle declaration. */
export const GatewayRoutingModelLifecycle = Object.freeze({
  lifecycleId: "NEA-5:3/GatewayRoutingModelLifecycle",
  sourcePhase: "NEA-5:3" as const,
  states: GATEWAY_ROUTING_MODEL_LIFECYCLE_STATES,
  stateCount: GATEWAY_ROUTING_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "ReadyForValidation" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
