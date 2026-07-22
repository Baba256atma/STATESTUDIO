import { SceneRenderingRegistry } from "./sceneRenderingRegistry.ts";
import { SceneRenderingModelDescriptors } from "./sceneRenderingModelDescriptors.ts";
import { SceneRenderingModelInventory } from "./sceneRenderingModelInventory.ts";
import { SceneRenderingModelMetadata } from "./sceneRenderingModelMetadata.ts";
import { SceneRenderingModelPolicies } from "./sceneRenderingModelPolicies.ts";
import { SceneRenderingModelRelationships } from "./sceneRenderingModelRelationships.ts";

export const SceneRenderingModelId = SceneRenderingModelMetadata.id;
export const SceneRenderingModelVersion = SceneRenderingModelMetadata.version;
export const SceneRenderingModelName = SceneRenderingModelMetadata.name;
export const SceneRenderingModelNamespace = SceneRenderingModelMetadata.namespace;
export const SceneRenderingModelReadiness = SceneRenderingModelMetadata.readiness;

export { SceneRenderingModelInventory, SceneRenderingModelMetadata };

export const SceneRenderingModel = Object.freeze({
  metadata: SceneRenderingModelMetadata,
  registry: SceneRenderingRegistry,
  descriptors: SceneRenderingModelDescriptors,
  relationships: SceneRenderingModelRelationships,
  policies: SceneRenderingModelPolicies,
  inventory: SceneRenderingModelInventory,
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

