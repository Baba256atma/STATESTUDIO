import { VisualizationFoundation } from "./visualizationFoundation.ts";
import { VisualizationRegistryCatalog } from "./visualizationRegistryCatalog.ts";
import { VisualizationRegistryExtensions } from "./visualizationRegistryExtensions.ts";
import { VisualizationRegistryInventory } from "./visualizationRegistryInventory.ts";
import { VisualizationRegistryMetadata } from "./visualizationRegistryMetadata.ts";
import { VisualizationRegistryPolicies } from "./visualizationRegistryPolicies.ts";

export const VisualizationRegistryId = VisualizationRegistryMetadata.id;
export const VisualizationRegistryVersion = VisualizationRegistryMetadata.version;
export const VisualizationRegistryName = VisualizationRegistryMetadata.name;
export const VisualizationRegistryNamespace = VisualizationRegistryMetadata.namespace;
export const VisualizationRegistryStatus = VisualizationRegistryMetadata.status;
export const VisualizationRegistryReadiness = VisualizationRegistryMetadata.readiness;

export { VisualizationRegistryMetadata };

export const VisualizationRegistry = Object.freeze({
  metadata: VisualizationRegistryMetadata,
  foundation: VisualizationFoundation,
  catalog: VisualizationRegistryCatalog,
  extensions: VisualizationRegistryExtensions,
  policies: VisualizationRegistryPolicies,
  inventory: VisualizationRegistryInventory,
  services: false,
  factories: false,
  execution: false,
  rendering: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

