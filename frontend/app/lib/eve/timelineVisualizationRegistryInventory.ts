import { TimelineVisualizationFoundationPlatform } from "./timelineVisualizationFoundation.ts";
import { TimelineVisualizationRegistryCatalog } from "./timelineVisualizationRegistryCatalog.ts";
import { TimelineVisualizationRegistryExtensions } from "./timelineVisualizationRegistryExtensions.ts";
import { TimelineVisualizationRegistryPolicies } from "./timelineVisualizationRegistryPolicies.ts";

const registryEntries = Object.freeze(
  TimelineVisualizationRegistryCatalog.flatMap(({ entries }) => entries),
);

export const TimelineVisualizationRegistryInventory = Object.freeze({
  categories: TimelineVisualizationRegistryCatalog,
  vocabularyRegistries: TimelineVisualizationRegistryCatalog,
  entries: registryEntries,
  policies: TimelineVisualizationRegistryPolicies,
  extensions: TimelineVisualizationRegistryExtensions,
  foundationContracts: TimelineVisualizationFoundationPlatform.contracts,
  foundationOwnership: TimelineVisualizationFoundationPlatform.ownership,
  foundationBoundaries: TimelineVisualizationFoundationPlatform.boundaries,
  foundationLifecycle: TimelineVisualizationFoundationPlatform.lifecycle,
  foundationCapabilities: TimelineVisualizationFoundationPlatform.capabilities,
  counts: Object.freeze({
    vocabularyRegistryCount: TimelineVisualizationRegistryCatalog.length,
    categoryCount: TimelineVisualizationRegistryCatalog.length,
    registryEntryCount: registryEntries.length,
    policyCount: TimelineVisualizationRegistryPolicies.length,
    extensionClassificationCount: TimelineVisualizationRegistryExtensions.length,
  }),
  foundationCollectionsPreservedByReference: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodesAggregateCounts: false,
  reconstructsFoundationCollections: false,
  duplicatesFoundationMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
