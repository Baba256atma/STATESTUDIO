/**
 * EIL-4:1 — Integration Orchestration Foundation Lifecycle.
 *
 * Ordered immutable lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-4:1.
 */

import type {
  OrchestrationLifecycle,
  OrchestrationLifecycleState,
} from "./integrationOrchestrationFoundationTypes.ts";

export const INTEGRATION_ORCHESTRATION_FOUNDATION_LIFECYCLE_STATES: readonly OrchestrationLifecycleState[] =
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
  ]) as readonly OrchestrationLifecycleState[],
  Designed: Object.freeze([
    "Verified",
  ]) as readonly OrchestrationLifecycleState[],
  Verified: Object.freeze([
    "Certified",
  ]) as readonly OrchestrationLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly OrchestrationLifecycleState[],
  Frozen: Object.freeze([
    "Released",
  ]) as readonly OrchestrationLifecycleState[],
  Released: Object.freeze([
    "Deprecated",
  ]) as readonly OrchestrationLifecycleState[],
  Deprecated: Object.freeze([
    "Retired",
  ]) as readonly OrchestrationLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly OrchestrationLifecycleState[],
} as const);

/**
 * Canonical immutable Integration Orchestration Foundation lifecycle declaration.
 * Current state is Verified; foundation readiness is ReadyForRegistry.
 */
export const IntegrationOrchestrationFoundationLifecycle: OrchestrationLifecycle =
  Object.freeze({
    lifecycleId: "EIL-4:1/IntegrationOrchestrationLifecycle",
    sourcePhase: "EIL-4:1" as const,
    states: INTEGRATION_ORCHESTRATION_FOUNDATION_LIFECYCLE_STATES,
    stateCount: INTEGRATION_ORCHESTRATION_FOUNDATION_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    currentState: "Verified" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
