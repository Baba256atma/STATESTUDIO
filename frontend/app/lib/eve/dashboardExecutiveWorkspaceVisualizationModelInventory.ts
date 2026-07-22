import {
  DashboardExecutiveWorkspaceVisualizationModelDescriptors,
  DashboardExecutiveWorkspaceVisualizationStructuralComposition,
} from "./dashboardExecutiveWorkspaceVisualizationModelDescriptors.ts";
import { DashboardExecutiveWorkspaceVisualizationModelPolicies } from "./dashboardExecutiveWorkspaceVisualizationModelPolicies.ts";
import { DashboardExecutiveWorkspaceVisualizationModelRelationships } from "./dashboardExecutiveWorkspaceVisualizationModelRelationships.ts";
import { DashboardExecutiveWorkspaceVisualizationRegistryPlatform } from "./dashboardExecutiveWorkspaceVisualizationRegistry.ts";

export const DashboardExecutiveWorkspaceVisualizationModelInventory = Object.freeze({
  models: DashboardExecutiveWorkspaceVisualizationModelDescriptors,
  relationships: DashboardExecutiveWorkspaceVisualizationModelRelationships,
  policies: DashboardExecutiveWorkspaceVisualizationModelPolicies,
  structuralComposition: DashboardExecutiveWorkspaceVisualizationStructuralComposition,
  registryVocabularyRegistries:
    DashboardExecutiveWorkspaceVisualizationRegistryPlatform.vocabularyRegistries,
  registryCategories:
    DashboardExecutiveWorkspaceVisualizationRegistryPlatform.categories,
  registryInventory:
    DashboardExecutiveWorkspaceVisualizationRegistryPlatform.inventory,
  registryPolicies:
    DashboardExecutiveWorkspaceVisualizationRegistryPlatform.policies,
  registryExtensions:
    DashboardExecutiveWorkspaceVisualizationRegistryPlatform.extensions,
  registryFoundationReference:
    DashboardExecutiveWorkspaceVisualizationRegistryPlatform.foundation,
  counts: Object.freeze({
    modelCount: DashboardExecutiveWorkspaceVisualizationModelDescriptors.length,
    relationshipCount:
      DashboardExecutiveWorkspaceVisualizationModelRelationships.length,
    policyCount: DashboardExecutiveWorkspaceVisualizationModelPolicies.length,
    compositionEntryCount:
      DashboardExecutiveWorkspaceVisualizationStructuralComposition.length,
  }),
  registryCollectionsPreservedByReference: true,
  foundationAndEveFivePreservedThroughRegistry: true,
  countsDerivedFromCanonicalCollections: true,
  hardcodedAggregateTotals: false,
  reconstructsRegistryCollections: false,
  duplicatesRegistryMetadata: false,
  recountsUpstreamInventories: false,
  maintainsParallelUpstreamInventory: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
