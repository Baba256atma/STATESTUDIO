import type { SceneRenderingLifecycleState } from "./sceneRenderingFoundationTypes.ts";

export const SceneRenderingLifecycleStates: readonly SceneRenderingLifecycleState[] =
  Object.freeze([
    "Declared", "Contracted", "Boundaried", "CapabilityDefined",
    "ReadyForRegistry",
  ]);

export const SceneRenderingLifecycle = Object.freeze({
  id: "EVE-2:1/SceneRenderingLifecycle",
  states: SceneRenderingLifecycleStates,
  currentState: "ReadyForRegistry",
  stateCount: SceneRenderingLifecycleStates.length,
  executesTransitions: false,
  runtimeStateMachine: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

