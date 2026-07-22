import { GraphVisualizationFoundation } from "./graphVisualizationFoundation.ts";
import { GraphVisualizationRegistryCatalog } from "./graphVisualizationRegistryCatalog.ts";
import { GraphVisualizationRegistryExtensions } from "./graphVisualizationRegistryExtensions.ts";
import { GraphVisualizationRegistryPolicies } from "./graphVisualizationRegistryPolicies.ts";

export const GraphVisualizationRegistryInventory = Object.freeze({
  vocabularyRegistryCount: GraphVisualizationRegistryCatalog.registries.length,
  registryEntryCount: GraphVisualizationRegistryCatalog.registries.reduce(
    (total, collection) => total + collection.length, 0,
  ),
  categoryCount: GraphVisualizationRegistryCatalog.categories.length,
  policyCount: GraphVisualizationRegistryPolicies.length,
  extensionClassificationCount: GraphVisualizationRegistryExtensions.classifications.length,
  foundationContracts: GraphVisualizationFoundation.contracts,
  foundationOwnership: GraphVisualizationFoundation.ownership,
  foundationBoundaries: GraphVisualizationFoundation.boundaries,
  foundationLifecycle: GraphVisualizationFoundation.lifecycle,
  foundationCapabilities: GraphVisualizationFoundation.capabilities,
  foundationPolicies: GraphVisualizationFoundation.boundaries.policies,
  foundationInventory: GraphVisualizationFoundation.inventory,
  countsDerivedFromImmutableCollections: true,
  preservesFoundationByReference: true,
  hardcodesAggregateTotals: false,
  duplicatesFoundationMetadata: false,
  reconstructsFoundationInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
