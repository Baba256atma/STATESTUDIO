/**
 * NEA-4:3 — Security Gateway Model Lifecycle.
 *
 * Ordered model-phase lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-4:3.
 */

import type { SecurityGatewayModelLifecycleState } from "./securityGatewayModelTypes.ts";

/** Canonical ordered model-phase lifecycle states. */
export const SECURITY_GATEWAY_MODEL_LIFECYCLE_STATES: readonly SecurityGatewayModelLifecycleState[] =
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
  ]) as readonly SecurityGatewayModelLifecycleState[],
  Typed: Object.freeze([
    "Composed",
  ]) as readonly SecurityGatewayModelLifecycleState[],
  Composed: Object.freeze([
    "Related",
  ]) as readonly SecurityGatewayModelLifecycleState[],
  Related: Object.freeze([
    "Boundaried",
  ]) as readonly SecurityGatewayModelLifecycleState[],
  Boundaried: Object.freeze([
    "ReadyForValidation",
  ]) as readonly SecurityGatewayModelLifecycleState[],
  ReadyForValidation: Object.freeze(
    [] as const,
  ) as readonly SecurityGatewayModelLifecycleState[],
} as const);

/** Canonical immutable Security Gateway Model lifecycle declaration. */
export const SecurityGatewayModelLifecycle = Object.freeze({
  lifecycleId: "NEA-4:3/SecurityGatewayModelLifecycle",
  sourcePhase: "NEA-4:3" as const,
  states: SECURITY_GATEWAY_MODEL_LIFECYCLE_STATES,
  stateCount: SECURITY_GATEWAY_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "ReadyForValidation" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
