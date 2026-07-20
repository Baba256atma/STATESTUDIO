/**
 * NEA-7:3 — Intake Orchestration Model Lifecycle.
 *
 * Ordered model-phase lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-7:3.
 */

import type { IntakeOrchestrationModelLifecycleState } from "./intakeOrchestrationModelTypes.ts";

/** Canonical ordered model-phase lifecycle states. */
export const INTAKE_ORCHESTRATION_MODEL_LIFECYCLE_STATES: readonly IntakeOrchestrationModelLifecycleState[] =
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
  ]) as readonly IntakeOrchestrationModelLifecycleState[],
  Composed: Object.freeze([
    "Verified",
  ]) as readonly IntakeOrchestrationModelLifecycleState[],
  Verified: Object.freeze([
    "Published",
  ]) as readonly IntakeOrchestrationModelLifecycleState[],
  Published: Object.freeze([
    "Referenced",
  ]) as readonly IntakeOrchestrationModelLifecycleState[],
  Referenced: Object.freeze([
    "Retired",
  ]) as readonly IntakeOrchestrationModelLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly IntakeOrchestrationModelLifecycleState[],
} as const);

/** Canonical immutable Intake Orchestration Model lifecycle declaration. */
export const IntakeOrchestrationModelLifecycle = Object.freeze({
  lifecycleId: "NEA-7:3/IntakeOrchestrationModelLifecycle",
  sourcePhase: "NEA-7:3" as const,
  states: INTAKE_ORCHESTRATION_MODEL_LIFECYCLE_STATES,
  stateCount: INTAKE_ORCHESTRATION_MODEL_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Published" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
