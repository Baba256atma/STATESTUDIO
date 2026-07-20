/**
 * NEA-4:1 — Security Gateway Lifecycle.
 *
 * Ordered security lifecycle states and transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-4:1.
 */

import type { SecurityLifecycleState } from "./securityGatewayFoundationTypes.ts";

/** Canonical ordered security lifecycle states. */
export const SECURITY_LIFECYCLE_STATES: readonly SecurityLifecycleState[] =
  Object.freeze([
    "Declared",
    "Classified",
    "Reviewed",
    "Approved",
    "Deprecated",
  ]);

const SECURITY_TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Classified",
    "Deprecated",
  ]) as readonly SecurityLifecycleState[],
  Classified: Object.freeze([
    "Reviewed",
    "Deprecated",
  ]) as readonly SecurityLifecycleState[],
  Reviewed: Object.freeze([
    "Approved",
    "Deprecated",
  ]) as readonly SecurityLifecycleState[],
  Approved: Object.freeze([
    "Deprecated",
  ]) as readonly SecurityLifecycleState[],
  Deprecated: Object.freeze([] as const) as readonly SecurityLifecycleState[],
} as const);

/** Canonical immutable security lifecycle declaration. */
export const SecurityGatewayLifecycle = Object.freeze({
  lifecycleId: "NEA-4:1/SecurityGatewayLifecycle",
  sourcePhase: "NEA-4:1" as const,
  states: SECURITY_LIFECYCLE_STATES,
  stateCount: SECURITY_LIFECYCLE_STATES.length,
  transitions: SECURITY_TRANSITIONS,
  initialState: "Declared" as const,
  terminalState: "Deprecated" as const,
  executesRuntime: false as const,
  stateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
