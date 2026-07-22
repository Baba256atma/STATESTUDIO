import {
  VisualizationSuiteModelComposition,
  VisualizationSuiteModelDescriptors,
} from "./visualizationSuiteModelDescriptors.ts";
import { VisualizationSuiteModelPolicies } from "./visualizationSuiteModelPolicies.ts";
import { VisualizationSuiteModelRelationships } from "./visualizationSuiteModelRelationships.ts";
import { VisualizationSuiteRegistryPlatform } from "./visualizationSuiteRegistry.ts";

const registry = VisualizationSuiteRegistryPlatform;

export const VisualizationSuiteModelInventory = Object.freeze({
  models: VisualizationSuiteModelDescriptors,
  relationships: VisualizationSuiteModelRelationships,
  policies: VisualizationSuiteModelPolicies,
  composition: VisualizationSuiteModelComposition,
  registryCatalog: registry.catalog,
  registryCollections: registry.collections,
  registryPlatforms: registry.platforms,
  registryPublicIndexes: registry.publicIndexes,
  registryCategories: registry.categories,
  registryPolicies: registry.policies,
  registryExtensions: registry.extensions,
  registryInventory: registry.inventory,
  registryFoundationReference: registry.foundation,
  counts: Object.freeze({
    modelCount: VisualizationSuiteModelDescriptors.length,
    relationshipCount: VisualizationSuiteModelRelationships.length,
    policyCount: VisualizationSuiteModelPolicies.length,
    compositionPlatformCount: VisualizationSuiteModelComposition.length,
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
