/**
 * EIL-1:1 — Integration Foundation Lifecycle.
 *
 * Ordered immutable lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

import type {
  IntegrationLifecycleDeclaration,
  IntegrationLifecycleState,
} from "./integrationFoundationTypes.ts";

export const INTEGRATION_FOUNDATION_LIFECYCLE_STATES: readonly IntegrationLifecycleState[] =
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
  ]) as readonly IntegrationLifecycleState[],
  Designed: Object.freeze([
    "Verified",
  ]) as readonly IntegrationLifecycleState[],
  Verified: Object.freeze([
    "Certified",
  ]) as readonly IntegrationLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly IntegrationLifecycleState[],
  Frozen: Object.freeze([
    "Released",
  ]) as readonly IntegrationLifecycleState[],
  Released: Object.freeze([
    "Deprecated",
  ]) as readonly IntegrationLifecycleState[],
  Deprecated: Object.freeze([
    "Retired",
  ]) as readonly IntegrationLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly IntegrationLifecycleState[],
} as const);

/**
 * Canonical immutable Integration Foundation lifecycle declaration.
 * Current state is Verified; foundation readiness is ReadyForRegistry.
 */
export const IntegrationFoundationLifecycle: IntegrationLifecycleDeclaration =
  Object.freeze({
    lifecycleId: "EIL-1:1/IntegrationLifecycle",
    sourcePhase: "EIL-1:1" as const,
    states: INTEGRATION_FOUNDATION_LIFECYCLE_STATES,
    stateCount: INTEGRATION_FOUNDATION_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    currentState: "Verified" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
