/**
 * NEA-1:1 — Executive Gateway Lifecycle.
 *
 * Ordered gateway lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-1:1.
 */

import type { ExecutiveGatewayLifecycleState } from "./executiveGatewayFoundationTypes.ts";

/** Canonical ordered lifecycle states. */
export const EXECUTIVE_GATEWAY_LIFECYCLE_STATES: readonly ExecutiveGatewayLifecycleState[] =
  Object.freeze([
    "Received",
    "Identified",
    "ContextResolved",
    "Authenticated",
    "Authorized",
    "Normalized",
    "Validated",
    "RoutingPrepared",
    "Accepted",
    "Rejected",
    "Failed",
    "Completed",
  ]);

const TRANSITIONS = Object.freeze({
  Received: Object.freeze([
    "Identified",
    "Failed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Identified: Object.freeze([
    "ContextResolved",
    "Failed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  ContextResolved: Object.freeze([
    "Authenticated",
    "Failed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Authenticated: Object.freeze([
    "Authorized",
    "Rejected",
    "Failed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Authorized: Object.freeze([
    "Normalized",
    "Rejected",
    "Failed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Normalized: Object.freeze([
    "Validated",
    "Failed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Validated: Object.freeze([
    "RoutingPrepared",
    "Rejected",
    "Failed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  RoutingPrepared: Object.freeze([
    "Accepted",
    "Rejected",
    "Failed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Accepted: Object.freeze([
    "Completed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Rejected: Object.freeze([
    "Completed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Failed: Object.freeze([
    "Completed",
  ]) as readonly ExecutiveGatewayLifecycleState[],
  Completed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveGatewayLifecycleState[],
} as const);

/** Canonical immutable Executive Gateway lifecycle declaration. */
export const ExecutiveGatewayLifecycle = Object.freeze({
  lifecycleId: "NEA-1:1/ExecutiveGatewayLifecycle",
  sourcePhase: "NEA-1:1" as const,
  states: EXECUTIVE_GATEWAY_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_GATEWAY_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Received" as const,
  foundationDeclaredState: "Foundation" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
