import { VisualizationSuiteFoundationPlatform } from "./visualizationSuiteFoundation.ts";
import {
  VisualizationSuitePlatformRegistry,
  VisualizationSuiteRegistryCatalog,
  VisualizationSuiteRegistryCategories,
} from "./visualizationSuiteRegistryCatalog.ts";
import { VisualizationSuiteRegistryExtensions } from "./visualizationSuiteRegistryExtensions.ts";
import { VisualizationSuiteRegistryPolicies } from "./visualizationSuiteRegistryPolicies.ts";

const foundation = VisualizationSuiteFoundationPlatform;

export const VisualizationSuiteRegistryInventory = Object.freeze({
  catalog: VisualizationSuiteRegistryCatalog,
  collections: VisualizationSuiteRegistryCatalog,
  platformRegistry: VisualizationSuitePlatformRegistry,
  publicIndexRegistry: VisualizationSuitePlatformRegistry,
  categories: VisualizationSuiteRegistryCategories,
  policies: VisualizationSuiteRegistryPolicies,
  extensions: VisualizationSuiteRegistryExtensions,
  foundationInventory: foundation.inventory,
  foundationPlatforms: foundation.composition,
  foundationContracts: foundation.contracts,
  foundationCapabilities: foundation.capabilities,
  foundationBoundaries: foundation.boundaries,
  foundationLifecycle: foundation.lifecycle,
  foundationOwnership: foundation.ownership,
  counts: Object.freeze({
    collectionCount: VisualizationSuiteRegistryCatalog.length,
    platformCount: VisualizationSuitePlatformRegistry.length,
    categoryCount: VisualizationSuiteRegistryCategories.length,
    policyCount: VisualizationSuiteRegistryPolicies.length,
    extensionCount: VisualizationSuiteRegistryExtensions.length,
  }),
  foundationCollectionsPreservedByReference: true,
  inventoriesDerivedExclusivelyFromFoundationCollections: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  duplicatesFoundationMetadata: false,
  reconstructsFoundationInventory: false,
  maintainsParallelUpstreamCollections: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
