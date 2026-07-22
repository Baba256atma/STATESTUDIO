import { SceneRenderingRegistry } from "./sceneRenderingRegistry.ts";
import { SceneRenderingModelInventory } from "./sceneRenderingModelInventory.ts";

export const SceneRenderingModelMetadata = Object.freeze({
  id: "EVE-2:3/SceneRenderingModel",
  name: "Scene Rendering Model",
  version: "1.0.0",
  namespace: "nexora.eve.scene-rendering.model",
  layer: "EVE",
  phase: "EVE-2:3",
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  registryReference: SceneRenderingRegistry.metadata.id,
  inventory: SceneRenderingModelInventory,
  ownership: Object.freeze({
    owns: Object.freeze([
      "Typed rendering models", "Relationship descriptors", "Model metadata",
      "Model inventories", "Model identities",
    ] as const),
    runtimeOwnership: false,
  }),
  dependency: Object.freeze({
    sceneRenderingRegistryOnly: true,
    directPreviousPhaseModule: "sceneRenderingRegistry.ts",
    directFoundationImport: false,
    directEveOneImport: false,
    otherPhaseDependencies: false,
  }),
  rendering: false,
  frameGeneration: false,
  pipelineExecution: false,
  graphExecution: false,
  runtimeExecution: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

