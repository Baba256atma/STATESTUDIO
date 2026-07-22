import type { GraphVisualizationLifecycleState } from "./graphVisualizationFoundationTypes.ts";

export const GraphVisualizationLifecycleStates: readonly GraphVisualizationLifecycleState[] =
  Object.freeze(["Declared", "Structured", "Prepared", "Published", "Retired"]);

export const GraphVisualizationLifecycle = Object.freeze({
  id: "EVE-3:1/GraphVisualizationLifecycle",
  states: GraphVisualizationLifecycleStates,
  currentState: "Declared",
  stateCount: GraphVisualizationLifecycleStates.length,
  executesTransitions: false,
  runtimeStateMachine: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
