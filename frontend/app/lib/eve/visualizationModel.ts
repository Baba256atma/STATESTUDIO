import { VisualizationRegistry } from "./visualizationRegistry.ts";
import { VisualizationModelDescriptors } from "./visualizationModelDescriptors.ts";
import { VisualizationModelInventory } from "./visualizationModelInventory.ts";
import { VisualizationModelMetadata } from "./visualizationModelMetadata.ts";
import { VisualizationModelPolicies } from "./visualizationModelPolicies.ts";
import { VisualizationModelRelationships } from "./visualizationModelRelationships.ts";

export const VisualizationModelId = VisualizationModelMetadata.id;
export const VisualizationModelVersion = VisualizationModelMetadata.version;
export const VisualizationModelName = VisualizationModelMetadata.name;
export const VisualizationModelNamespace = VisualizationModelMetadata.namespace;
export const VisualizationModelStatus = VisualizationModelMetadata.status;
export const VisualizationModelReadiness = VisualizationModelMetadata.readiness;

export { VisualizationModelMetadata };

export const VisualizationModel = Object.freeze({
  metadata: VisualizationModelMetadata,
  registry: VisualizationRegistry,
  descriptors: VisualizationModelDescriptors,
  relationships: VisualizationModelRelationships,
  policies: VisualizationModelPolicies,
  inventory: VisualizationModelInventory,
  services: false,
  factories: false,
  execution: false,
  rendering: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

