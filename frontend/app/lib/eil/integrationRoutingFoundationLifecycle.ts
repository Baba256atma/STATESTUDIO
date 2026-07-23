/**
 * EIL-3:1 — Integration Routing Foundation Lifecycle.
 *
 * Ordered immutable lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-3:1.
 */

import type {
  RoutingLifecycle,
  RoutingLifecycleState,
} from "./integrationRoutingFoundationTypes.ts";

export const INTEGRATION_ROUTING_FOUNDATION_LIFECYCLE_STATES: readonly RoutingLifecycleState[] =
  Object.freeze([
    "Declared",
    "Designed",
    "Verified",
    "Certified",
    "Frozen",
    "Released",
    "Deprecated",
    "Retired",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Designed",
  ]) as readonly RoutingLifecycleState[],
  Designed: Object.freeze([
    "Verified",
  ]) as readonly RoutingLifecycleState[],
  Verified: Object.freeze([
    "Certified",
  ]) as readonly RoutingLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly RoutingLifecycleState[],
  Frozen: Object.freeze([
    "Released",
  ]) as readonly RoutingLifecycleState[],
  Released: Object.freeze([
    "Deprecated",
  ]) as readonly RoutingLifecycleState[],
  Deprecated: Object.freeze([
    "Retired",
  ]) as readonly RoutingLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly RoutingLifecycleState[],
} as const);

/**
 * Canonical immutable Integration Routing Foundation lifecycle declaration.
 * Current state is Verified; foundation readiness is ReadyForRegistry.
 */
export const IntegrationRoutingFoundationLifecycle: RoutingLifecycle =
  Object.freeze({
    lifecycleId: "EIL-3:1/IntegrationRoutingLifecycle",
    sourcePhase: "EIL-3:1" as const,
    states: INTEGRATION_ROUTING_FOUNDATION_LIFECYCLE_STATES,
    stateCount: INTEGRATION_ROUTING_FOUNDATION_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    currentState: "Verified" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
