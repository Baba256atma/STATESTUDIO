/**
 * NEA-5:1 — Gateway Routing Lifecycle.
 *
 * Ordered routing lifecycle states and transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-5:1.
 */

import type { GatewayRoutingLifecycleState } from "./gatewayRoutingFoundationTypes.ts";

/** Canonical ordered routing lifecycle states. */
export const GATEWAY_ROUTING_LIFECYCLE_STATES: readonly GatewayRoutingLifecycleState[] =
  Object.freeze([
    "Received",
    "Evaluated",
    "DestinationResolved",
    "RoutingPrepared",
    "Routed",
    "Completed",
  ]);

const GATEWAY_ROUTING_TRANSITIONS = Object.freeze({
  Received: Object.freeze([
    "Evaluated",
  ]) as readonly GatewayRoutingLifecycleState[],
  Evaluated: Object.freeze([
    "DestinationResolved",
  ]) as readonly GatewayRoutingLifecycleState[],
  DestinationResolved: Object.freeze([
    "RoutingPrepared",
  ]) as readonly GatewayRoutingLifecycleState[],
  RoutingPrepared: Object.freeze([
    "Routed",
  ]) as readonly GatewayRoutingLifecycleState[],
  Routed: Object.freeze([
    "Completed",
  ]) as readonly GatewayRoutingLifecycleState[],
  Completed: Object.freeze(
    [] as const,
  ) as readonly GatewayRoutingLifecycleState[],
} as const);

/** Canonical immutable routing lifecycle declaration. */
export const GatewayRoutingLifecycle = Object.freeze({
  lifecycleId: "NEA-5:1/GatewayRoutingLifecycle",
  sourcePhase: "NEA-5:1" as const,
  states: GATEWAY_ROUTING_LIFECYCLE_STATES,
  stateCount: GATEWAY_ROUTING_LIFECYCLE_STATES.length,
  transitions: GATEWAY_ROUTING_TRANSITIONS,
  initialState: "Received" as const,
  terminalState: "Completed" as const,
  executesRuntime: false as const,
  stateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
