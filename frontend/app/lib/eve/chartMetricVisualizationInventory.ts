import { ChartMetricVisualizationRegistryCategories } from "./chartMetricVisualizationCategories.ts";
import { ChartMetricVisualizationExtensionClassifications } from "./chartMetricVisualizationExtensions.ts";
import { ChartMetricVisualizationFoundationPlatform } from "./chartMetricVisualizationFoundation.ts";
import { ChartMetricVisualizationRegistryPolicies } from "./chartMetricVisualizationPolicies.ts";
import { ChartMetricVisualizationVocabularyRegistries } from "./chartMetricVisualizationVocabulary.ts";

const vocabularyEntries = Object.freeze(
  ChartMetricVisualizationVocabularyRegistries.flatMap(({ entries }) => entries),
);

export const ChartMetricVisualizationRegistryInventory = Object.freeze({
  vocabularyRegistries: ChartMetricVisualizationVocabularyRegistries,
  categories: ChartMetricVisualizationRegistryCategories,
  entries: vocabularyEntries,
  extensions: ChartMetricVisualizationExtensionClassifications,
  policies: ChartMetricVisualizationRegistryPolicies,
  foundationContracts: ChartMetricVisualizationFoundationPlatform.contracts,
  foundationOwnership: ChartMetricVisualizationFoundationPlatform.ownership,
  foundationBoundaries: ChartMetricVisualizationFoundationPlatform.boundaries,
  foundationLifecycle: ChartMetricVisualizationFoundationPlatform.lifecycle,
  foundationCapabilities: ChartMetricVisualizationFoundationPlatform.capabilities,
  foundationPolicies: ChartMetricVisualizationFoundationPlatform.policies,
  foundationIdentity: ChartMetricVisualizationFoundationPlatform.identity,
  foundationInventory: ChartMetricVisualizationFoundationPlatform.inventory,
  counts: Object.freeze({
    vocabularyRegistryCount: ChartMetricVisualizationVocabularyRegistries.length,
    categoryCount: ChartMetricVisualizationRegistryCategories.length,
    vocabularyEntryCount: vocabularyEntries.length,
    extensionClassificationCount: ChartMetricVisualizationExtensionClassifications.length,
    policyCount: ChartMetricVisualizationRegistryPolicies.length,
  }),
  foundationCollectionsPreservedByReference: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsFoundationCollections: false,
  duplicatesFoundationMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
