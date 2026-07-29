/**
 * RTC-1:1 — Executive Context Runtime Lifecycle.
 *
 * Ordered immutable lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by RTC-1:1.
 */

import type {
  ExecutiveContextLifecycleDeclaration,
  ExecutiveContextLifecycleState,
} from "./executiveContextRuntimeTypes.ts";

/** Formal Executive Context lifecycle states. */
export const EXECUTIVE_CONTEXT_LIFECYCLE_STATES:
  readonly ExecutiveContextLifecycleState[] = Object.freeze([
    "Created",
    "Initialized",
    "Active",
    "Updated",
    "Snapshot",
    "Archived",
  ]);

const TRANSITIONS = Object.freeze({
  Created: Object.freeze([
    "Initialized",
  ]) as readonly ExecutiveContextLifecycleState[],
  Initialized: Object.freeze([
    "Active",
  ]) as readonly ExecutiveContextLifecycleState[],
  Active: Object.freeze([
    "Updated",
    "Snapshot",
    "Archived",
  ]) as readonly ExecutiveContextLifecycleState[],
  Updated: Object.freeze([
    "Active",
    "Snapshot",
    "Archived",
  ]) as readonly ExecutiveContextLifecycleState[],
  Snapshot: Object.freeze([
    "Active",
    "Archived",
  ]) as readonly ExecutiveContextLifecycleState[],
  Archived: Object.freeze(
    [] as const,
  ) as readonly ExecutiveContextLifecycleState[],
} as const);

/**
 * Canonical immutable Executive Context lifecycle declaration.
 * Only one context may remain Active. Transitions are not executed here.
 */
export const ExecutiveContextRuntimeLifecycle:
  ExecutiveContextLifecycleDeclaration = Object.freeze({
    lifecycleId: "RTC-1:1/ExecutiveContextLifecycle" as const,
    sourcePhase: "RTC-1:1" as const,
    states: EXECUTIVE_CONTEXT_LIFECYCLE_STATES,
    stateCount: EXECUTIVE_CONTEXT_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    singleActiveContext: true as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
