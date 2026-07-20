/**
 * EIL-1:1 — Executive Integration Lifecycle.
 *
 * Ordered foundation lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

import type { ExecutiveIntegrationLifecycleState } from "./executiveIntegrationFoundationTypes.ts";

export const EXECUTIVE_INTEGRATION_LIFECYCLE_STATES: readonly ExecutiveIntegrationLifecycleState[] =
  Object.freeze([
    "Declared",
    "Identified",
    "Contracted",
    "Owned",
    "Boundaried",
    "Responsibilized",
    "ReadyForRegistry",
    "Registered",
    "Modeled",
    "Validated",
    "Manifested",
    "Platformed",
    "Certified",
    "Frozen",
    "Released",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Identified",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Identified: Object.freeze([
    "Contracted",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Contracted: Object.freeze([
    "Owned",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Owned: Object.freeze([
    "Boundaried",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Boundaried: Object.freeze([
    "Responsibilized",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Responsibilized: Object.freeze([
    "ReadyForRegistry",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  ReadyForRegistry: Object.freeze([
    "Registered",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Registered: Object.freeze([
    "Modeled",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Modeled: Object.freeze([
    "Validated",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Validated: Object.freeze([
    "Manifested",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Manifested: Object.freeze([
    "Platformed",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Platformed: Object.freeze([
    "Certified",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Frozen: Object.freeze([
    "Released",
  ]) as readonly ExecutiveIntegrationLifecycleState[],
  Released: Object.freeze(
    [] as const,
  ) as readonly ExecutiveIntegrationLifecycleState[],
} as const);

/** Canonical immutable Executive Integration lifecycle declaration. */
export const ExecutiveIntegrationLifecycle = Object.freeze({
  lifecycleId: "EIL-1:1/ExecutiveIntegrationLifecycle",
  sourcePhase: "EIL-1:1" as const,
  states: EXECUTIVE_INTEGRATION_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_INTEGRATION_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "ReadyForRegistry" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
