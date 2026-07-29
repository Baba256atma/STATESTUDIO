/**
 * RTC-2:2 — Executive Journal Runtime Registry Lifecycle.
 *
 * Ordered immutable registry lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by RTC-2:2.
 */

import type { ExecutiveJournalRuntimeRegistryLifecycleState } from "./executiveJournalRuntimeRegistryTypes.ts";

/** Formal registry lifecycle states. */
export const EXECUTIVE_JOURNAL_REGISTRY_LIFECYCLE_STATES:
  readonly ExecutiveJournalRuntimeRegistryLifecycleState[] = Object.freeze([
    "Declared",
    "Populated",
    "Sealed",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Populated",
  ]) as readonly ExecutiveJournalRuntimeRegistryLifecycleState[],
  Populated: Object.freeze([
    "Sealed",
  ]) as readonly ExecutiveJournalRuntimeRegistryLifecycleState[],
  Sealed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveJournalRuntimeRegistryLifecycleState[],
} as const);

/**
 * Canonical immutable registry lifecycle declaration.
 * Sealed registries do not accept further registration.
 */
export const ExecutiveJournalRuntimeRegistryLifecycle = Object.freeze({
  lifecycleId: "RTC-2:2/ExecutiveJournalRuntimeRegistryLifecycle" as const,
  sourcePhase: "RTC-2:2" as const,
  states: EXECUTIVE_JOURNAL_REGISTRY_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_JOURNAL_REGISTRY_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  acceptsFurtherRegistration: false as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
