import { VisualizationPlatformFoundationPlatform } from "./visualizationPlatformFoundation.ts";
import {
  VisualizationPlatformModuleRegistry,
  VisualizationPlatformRegistryCatalog,
  VisualizationPlatformRegistryCategories,
} from "./visualizationPlatformRegistryCatalog.ts";
import { VisualizationPlatformRegistryExtensions } from "./visualizationPlatformRegistryExtensions.ts";
import { VisualizationPlatformRegistryPolicies } from "./visualizationPlatformRegistryPolicies.ts";

const foundation = VisualizationPlatformFoundationPlatform;

export const VisualizationPlatformRegistryInventory = Object.freeze({
  catalog: VisualizationPlatformRegistryCatalog,
  collections: VisualizationPlatformRegistryCatalog,
  moduleRegistry: VisualizationPlatformModuleRegistry,
  categories: VisualizationPlatformRegistryCategories,
  policies: VisualizationPlatformRegistryPolicies,
  extensions: VisualizationPlatformRegistryExtensions,
  foundationInventory: foundation.inventory,
  foundationModules: foundation.composition,
  foundationContracts: foundation.contracts,
  foundationCapabilities: foundation.capabilities,
  foundationBoundaries: foundation.boundaries,
  foundationLifecycle: foundation.lifecycle,
  foundationOwnership: foundation.ownership,
  counts: Object.freeze({
    collectionCount: VisualizationPlatformRegistryCatalog.length,
    moduleCount: VisualizationPlatformModuleRegistry.length,
    categoryCount: VisualizationPlatformRegistryCategories.length,
    policyCount: VisualizationPlatformRegistryPolicies.length,
    extensionCount: VisualizationPlatformRegistryExtensions.length,
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
