import type { DirectorLifecycleState } from "./directorFoundationTypes.ts";

export const DirectorLifecycleStates: readonly DirectorLifecycleState[] =
  Object.freeze([
    "Declared",
    "Validated",
    "Prepared",
    "Orchestrated",
    "Delivered",
    "Archived",
  ]);

export const DirectorLifecycle = Object.freeze({
  lifecycleId: "DIRECTOR-1:1/Lifecycle",
  states: DirectorLifecycleStates,
  stateCount: DirectorLifecycleStates.length,
  currentState: "Declared",
  executesTransitions: false,
  runtimeStateMachine: false,
  metadataOnly: true,
  immutable: true,
} as const);

