import { SceneRenderingFoundation } from "./sceneRenderingFoundation.ts";
import { SceneRenderingRegistryInventory } from "./sceneRenderingRegistryInventory.ts";

export const SceneRenderingRegistryMetadata = Object.freeze({
  id: "EVE-2:2/SceneRenderingRegistry",
  name: "Scene Rendering Registry",
  version: "1.0.0",
  namespace: "nexora.eve.scene-rendering.registry",
  layer: "EVE",
  phase: "EVE-2:2",
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  foundationReference: SceneRenderingFoundation.identity.id,
  inventory: SceneRenderingRegistryInventory,
  ownership: Object.freeze({
    owns: Object.freeze([
      "Scene Rendering vocabularies", "Registry identities", "Registry categories",
      "Registry classifications", "Registry policies", "Registry inventories",
      "Extension classifications", "Registry metadata",
    ] as const),
    runtimeOwnership: false,
  }),
  dependency: Object.freeze({
    sceneRenderingFoundationOnly: true,
    directPreviousPhaseModule: "sceneRenderingFoundation.ts",
    directEveOneImport: false,
    otherPhaseDependencies: false,
  }),
  rendering: false,
  frameGeneration: false,
  pipelineExecution: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

