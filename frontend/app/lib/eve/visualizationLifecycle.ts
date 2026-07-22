import type { VisualizationLifecycleState } from "./visualizationFoundationTypes.ts";

export const VisualizationLifecycleStates: readonly VisualizationLifecycleState[] =
  Object.freeze([
    "Declared", "Contracted", "Boundaried", "CapabilityDefined",
    "ReadyForRegistry",
  ]);

export const VisualizationLifecycle = Object.freeze({
  lifecycleId: "EVE-1:1/VisualizationLifecycle",
  states: VisualizationLifecycleStates,
  stateCount: VisualizationLifecycleStates.length,
  currentState: "ReadyForRegistry",
  executesTransitions: false,
  runtimeStateMachine: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

