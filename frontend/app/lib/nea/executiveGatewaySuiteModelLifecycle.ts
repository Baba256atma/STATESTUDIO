/**
 * NEA-8:3 — Executive Gateway Suite Model Lifecycle.
 *
 * Ordered model-phase lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-8:3.
 */

import type { ExecutiveGatewaySuiteModelLifecycleState } from "./executiveGatewaySuiteModelTypes.ts";

/** Canonical ordered model-phase lifecycle states. */
export const EXECUTIVE_GATEWAY_SUITE_MODEL_LIFECYCLE_STATES: readonly ExecutiveGatewaySuiteModelLifecycleState[] =
  Object.freeze([
    "Declared",
    "Composed",
    "Verified",
    "Published",
    "Referenced",
    "Retired",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Composed",
  ]) as readonly ExecutiveGatewaySuiteModelLifecycleState[],
  Composed: Object.freeze([
    "Verified",
  ]) as readonly ExecutiveGatewaySuiteModelLifecycleState[],
  Verified: Object.freeze([
    "Published",
  ]) as readonly ExecutiveGatewaySuiteModelLifecycleState[],
  Published: Object.freeze([
    "Referenced",
  ]) as readonly ExecutiveGatewaySuiteModelLifecycleState[],
  Referenced: Object.freeze([
    "Retired",
  ]) as readonly ExecutiveGatewaySuiteModelLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly ExecutiveGatewaySuiteModelLifecycleState[],
} as const);

/** Canonical immutable Executive Gateway Suite Model lifecycle declaration. */
export const ExecutiveGatewaySuiteModelLifecycle = Object.freeze({
  lifecycleId: "NEA-8:3/ExecutiveGatewaySuiteModelLifecycle",
  sourcePhase: "NEA-8:3" as const,
  states: EXECUTIVE_GATEWAY_SUITE_MODEL_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_GATEWAY_SUITE_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Published" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
