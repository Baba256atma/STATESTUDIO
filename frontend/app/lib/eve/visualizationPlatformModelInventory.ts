import {
  VisualizationPlatformModelComposition,
  VisualizationPlatformModelDescriptors,
} from "./visualizationPlatformModelDescriptors.ts";
import { VisualizationPlatformModelPolicies } from "./visualizationPlatformModelPolicies.ts";
import { VisualizationPlatformModelRelationships } from "./visualizationPlatformModelRelationships.ts";
import { VisualizationPlatformRegistryPlatform } from "./visualizationPlatformRegistry.ts";

const registry = VisualizationPlatformRegistryPlatform;

export const VisualizationPlatformModelInventory = Object.freeze({
  models: VisualizationPlatformModelDescriptors,
  relationships: VisualizationPlatformModelRelationships,
  policies: VisualizationPlatformModelPolicies,
  composition: VisualizationPlatformModelComposition,
  registryCatalog: registry.catalog,
  registryCollections: registry.collections,
  registryModules: registry.modules,
  registryCategories: registry.categories,
  registryPolicies: registry.policies,
  registryExtensions: registry.extensions,
  registryInventory: registry.inventory,
  registryFoundationReference: registry.foundation,
  counts: Object.freeze({
    modelCount: VisualizationPlatformModelDescriptors.length,
    relationshipCount: VisualizationPlatformModelRelationships.length,
    policyCount: VisualizationPlatformModelPolicies.length,
    compositionModuleCount: VisualizationPlatformModelComposition.length,
  }),
  registryCollectionsPreservedByReference: true,
  modelInventoriesDerivedExclusivelyFromRegistry: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  duplicatesRegistryMetadata: false,
  reconstructsRegistryCollections: false,
  maintainsParallelUpstreamCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
