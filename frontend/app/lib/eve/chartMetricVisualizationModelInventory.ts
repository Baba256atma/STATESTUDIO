import {
  ChartMetricVisualizationModelDescriptors,
  ChartMetricVisualizationStructuralComposition,
} from "./chartMetricVisualizationModelDescriptors.ts";
import { ChartMetricVisualizationModelPolicies } from "./chartMetricVisualizationModelPolicies.ts";
import { ChartMetricVisualizationModelRelationships } from "./chartMetricVisualizationModelRelationships.ts";
import { ChartMetricVisualizationRegistryPlatform } from "./chartMetricVisualizationRegistry.ts";

export const ChartMetricVisualizationModelInventory = Object.freeze({
  models: ChartMetricVisualizationModelDescriptors,
  relationships: ChartMetricVisualizationModelRelationships,
  policies: ChartMetricVisualizationModelPolicies,
  structuralComposition: ChartMetricVisualizationStructuralComposition,
  registryVocabularyRegistries: ChartMetricVisualizationRegistryPlatform.vocabularyRegistries,
  registryCategories: ChartMetricVisualizationRegistryPlatform.categories,
  registryInventory: ChartMetricVisualizationRegistryPlatform.inventory,
  registryPolicies: ChartMetricVisualizationRegistryPlatform.policies,
  registryExtensions: ChartMetricVisualizationRegistryPlatform.extensions,
  registryFoundationReference: ChartMetricVisualizationRegistryPlatform.foundation,
  counts: Object.freeze({
    modelCount: ChartMetricVisualizationModelDescriptors.length,
    relationshipCount: ChartMetricVisualizationModelRelationships.length,
    policyCount: ChartMetricVisualizationModelPolicies.length,
    compositionEntryCount: ChartMetricVisualizationStructuralComposition.length,
  }),
  registryCollectionsPreservedByReference: true,
  foundationReferencesPreservedThroughRegistry: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsRegistryCollections: false,
  duplicatesRegistryMetadata: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
