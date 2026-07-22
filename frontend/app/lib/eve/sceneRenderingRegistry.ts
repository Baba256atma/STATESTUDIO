import { SceneRenderingFoundation } from "./sceneRenderingFoundation.ts";
import { SceneRenderingRegistryCatalog } from "./sceneRenderingRegistryCatalog.ts";
import { SceneRenderingRegistryExtensions } from "./sceneRenderingRegistryExtensions.ts";
import { SceneRenderingRegistryInventory } from "./sceneRenderingRegistryInventory.ts";
import { SceneRenderingRegistryMetadata } from "./sceneRenderingRegistryMetadata.ts";
import { SceneRenderingRegistryPolicies } from "./sceneRenderingRegistryPolicies.ts";

export const SceneRenderingRegistryId = SceneRenderingRegistryMetadata.id;
export const SceneRenderingRegistryVersion = SceneRenderingRegistryMetadata.version;
export const SceneRenderingRegistryName = SceneRenderingRegistryMetadata.name;
export const SceneRenderingRegistryNamespace = SceneRenderingRegistryMetadata.namespace;
export const SceneRenderingRegistryReadiness = SceneRenderingRegistryMetadata.readiness;

export { SceneRenderingRegistryInventory, SceneRenderingRegistryMetadata };

export const SceneRenderingRegistry = Object.freeze({
  metadata: SceneRenderingRegistryMetadata,
  foundation: SceneRenderingFoundation,
  catalog: SceneRenderingRegistryCatalog,
  policies: SceneRenderingRegistryPolicies,
  extensions: SceneRenderingRegistryExtensions,
  inventory: SceneRenderingRegistryInventory,
  rendering: false,
  frameGeneration: false,
  pipelineExecution: false,
  runtimeExecution: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

