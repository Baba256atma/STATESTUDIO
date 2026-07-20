/**
 * NEA-1:3 — Executive Gateway Model Lifecycle.
 *
 * Ordered model-phase lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-1:3.
 */

import type { ExecutiveGatewayModelLifecycleState } from "./executiveGatewayModelTypes.ts";

/** Canonical ordered model-phase lifecycle states. */
export const EXECUTIVE_GATEWAY_MODEL_LIFECYCLE_STATES: readonly ExecutiveGatewayModelLifecycleState[] =
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
  ]) as readonly ExecutiveGatewayModelLifecycleState[],
  Typed: Object.freeze([
    "Composed",
  ]) as readonly ExecutiveGatewayModelLifecycleState[],
  Composed: Object.freeze([
    "Related",
  ]) as readonly ExecutiveGatewayModelLifecycleState[],
  Related: Object.freeze([
    "Boundaried",
  ]) as readonly ExecutiveGatewayModelLifecycleState[],
  Boundaried: Object.freeze([
    "ReadyForValidation",
  ]) as readonly ExecutiveGatewayModelLifecycleState[],
  ReadyForValidation: Object.freeze(
    [] as const,
  ) as readonly ExecutiveGatewayModelLifecycleState[],
} as const);

/** Canonical immutable Executive Gateway Model lifecycle declaration. */
export const ExecutiveGatewayModelLifecycle = Object.freeze({
  lifecycleId: "NEA-1:3/ExecutiveGatewayModelLifecycle",
  sourcePhase: "NEA-1:3" as const,
  states: EXECUTIVE_GATEWAY_MODEL_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_GATEWAY_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "ReadyForValidation" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
