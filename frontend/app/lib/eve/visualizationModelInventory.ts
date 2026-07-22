import { VisualizationRegistry } from "./visualizationRegistry.ts";
import { VisualizationModelDescriptors } from "./visualizationModelDescriptors.ts";
import { VisualizationModelPolicies } from "./visualizationModelPolicies.ts";
import { VisualizationModelRelationships } from "./visualizationModelRelationships.ts";

export const VisualizationModelInventory = Object.freeze({
  modelCount: VisualizationModelDescriptors.length,
  modelDescriptorCount: VisualizationModelDescriptors.length,
  relationshipCount: VisualizationModelRelationships.length,
  policyCount: VisualizationModelPolicies.length,
  registryEntryCount: VisualizationRegistry.inventory.registryEntryCount,
  registryInventoryReference: VisualizationRegistry.inventory,
  countsDerivedFromCanonicalCollections: true,
  reconstructsRegistryInventory: false,
  duplicatesRegistryMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

