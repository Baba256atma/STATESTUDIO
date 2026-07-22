import { VisualizationFoundation } from "./visualizationFoundation.ts";
import { VisualizationRegistryCatalog } from "./visualizationRegistryCatalog.ts";
import { VisualizationRegistryExtensions } from "./visualizationRegistryExtensions.ts";
import { VisualizationRegistryPolicies } from "./visualizationRegistryPolicies.ts";

const catalogCollections = Object.freeze(
  Object.values(VisualizationRegistryCatalog).filter(
    (value): value is Extract<typeof value, readonly unknown[]> => Array.isArray(value),
  ),
);

const registryCollections = Object.freeze([
  ...catalogCollections,
  VisualizationRegistryExtensions.extensionPointTypes,
  VisualizationRegistryPolicies,
]);

export const VisualizationRegistryInventory = Object.freeze({
  foundationContractCount: VisualizationFoundation.contracts.length,
  registryCount: registryCollections.length,
  registryEntryCount: registryCollections.reduce(
    (total, collection) => total + collection.length, 0,
  ),
  categoryCount: VisualizationRegistryCatalog.categories.length,
  policyCount: VisualizationRegistryPolicies.length,
  extensionPointTypeCount: VisualizationRegistryExtensions.extensionPointTypes.length,
  foundationInventoryReference: VisualizationFoundation.inventory,
  countsDerivedFromCanonicalCollections: true,
  reconstructsFoundationInventory: false,
  duplicatesFoundationMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

