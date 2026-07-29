/**
 * RTC-3:2 — Executive Decision Register Registry Lifecycle.
 *
 * Ordered immutable registry lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by RTC-3:2.
 */

import type { ExecutiveDecisionRegisterRegistryLifecycleState } from "./executiveDecisionRegisterRegistryTypes.ts";

/** Formal registry lifecycle states. */
export const EXECUTIVE_DECISION_REGISTER_REGISTRY_LIFECYCLE_STATES:
  readonly ExecutiveDecisionRegisterRegistryLifecycleState[] = Object.freeze([
    "Declared",
    "Populated",
    "Sealed",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Populated",
  ]) as readonly ExecutiveDecisionRegisterRegistryLifecycleState[],
  Populated: Object.freeze([
    "Sealed",
  ]) as readonly ExecutiveDecisionRegisterRegistryLifecycleState[],
  Sealed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveDecisionRegisterRegistryLifecycleState[],
} as const);

/**
 * Canonical immutable registry lifecycle declaration.
 * Sealed registries do not accept further registration.
 */
export const ExecutiveDecisionRegisterRegistryLifecycle = Object.freeze({
  lifecycleId: "RTC-3:2/ExecutiveDecisionRegisterRegistryLifecycle" as const,
  sourcePhase: "RTC-3:2" as const,
  states: EXECUTIVE_DECISION_REGISTER_REGISTRY_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_DECISION_REGISTER_REGISTRY_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  acceptsFurtherRegistration: false as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Fail-closed canonical lifecycle-state guard. */
export function isCanonicalDecisionRegisterRegistryLifecycleState(
  value: unknown,
): value is ExecutiveDecisionRegisterRegistryLifecycleState {
  return typeof value === "string"
    && (EXECUTIVE_DECISION_REGISTER_REGISTRY_LIFECYCLE_STATES as readonly string[])
      .includes(value);
}
