/**
 * EIL-2:1 — Integration Connector Foundation Lifecycle.
 *
 * Ordered immutable lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-2:1.
 */

import type {
  IntegrationConnectorLifecycle,
  IntegrationConnectorLifecycleState,
} from "./integrationConnectorFoundationTypes.ts";

export const INTEGRATION_CONNECTOR_FOUNDATION_LIFECYCLE_STATES: readonly IntegrationConnectorLifecycleState[] =
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
  ]) as readonly IntegrationConnectorLifecycleState[],
  Designed: Object.freeze([
    "Verified",
  ]) as readonly IntegrationConnectorLifecycleState[],
  Verified: Object.freeze([
    "Certified",
  ]) as readonly IntegrationConnectorLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly IntegrationConnectorLifecycleState[],
  Frozen: Object.freeze([
    "Released",
  ]) as readonly IntegrationConnectorLifecycleState[],
  Released: Object.freeze([
    "Deprecated",
  ]) as readonly IntegrationConnectorLifecycleState[],
  Deprecated: Object.freeze([
    "Retired",
  ]) as readonly IntegrationConnectorLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly IntegrationConnectorLifecycleState[],
} as const);

/**
 * Canonical immutable Integration Connector Foundation lifecycle declaration.
 * Current state is Verified; foundation readiness is ReadyForRegistry.
 */
export const IntegrationConnectorFoundationLifecycle: IntegrationConnectorLifecycle =
  Object.freeze({
    lifecycleId: "EIL-2:1/IntegrationConnectorLifecycle",
    sourcePhase: "EIL-2:1" as const,
    states: INTEGRATION_CONNECTOR_FOUNDATION_LIFECYCLE_STATES,
    stateCount: INTEGRATION_CONNECTOR_FOUNDATION_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    currentState: "Verified" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
