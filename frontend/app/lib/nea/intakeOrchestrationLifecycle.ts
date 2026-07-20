/**
 * NEA-7:1 — Intake Orchestration Lifecycle.
 *
 * Ordered intake orchestration lifecycle states and transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-7:1.
 */

import type { IntakeOrchestrationLifecycleState } from "./intakeOrchestrationFoundationTypes.ts";

/** Canonical ordered intake orchestration lifecycle states. */
export const INTAKE_ORCHESTRATION_LIFECYCLE_STATES: readonly IntakeOrchestrationLifecycleState[] =
  Object.freeze([
    "Collected",
    "Referenced",
    "Assembled",
    "Verified",
    "ReadyForDKL",
    "Published",
  ]);

const INTAKE_ORCHESTRATION_TRANSITIONS = Object.freeze({
  Collected: Object.freeze([
    "Referenced",
  ]) as readonly IntakeOrchestrationLifecycleState[],
  Referenced: Object.freeze([
    "Assembled",
  ]) as readonly IntakeOrchestrationLifecycleState[],
  Assembled: Object.freeze([
    "Verified",
  ]) as readonly IntakeOrchestrationLifecycleState[],
  Verified: Object.freeze([
    "ReadyForDKL",
  ]) as readonly IntakeOrchestrationLifecycleState[],
  ReadyForDKL: Object.freeze([
    "Published",
  ]) as readonly IntakeOrchestrationLifecycleState[],
  Published: Object.freeze(
    [] as const,
  ) as readonly IntakeOrchestrationLifecycleState[],
} as const);

/** Canonical immutable intake orchestration lifecycle declaration. */
export const IntakeOrchestrationLifecycle = Object.freeze({
  lifecycleId: "NEA-7:1/IntakeOrchestrationLifecycle",
  sourcePhase: "NEA-7:1" as const,
  states: INTAKE_ORCHESTRATION_LIFECYCLE_STATES,
  stateCount: INTAKE_ORCHESTRATION_LIFECYCLE_STATES.length,
  transitions: INTAKE_ORCHESTRATION_TRANSITIONS,
  initialState: "Collected" as const,
  terminalState: "Published" as const,
  executesRuntime: false as const,
  stateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
