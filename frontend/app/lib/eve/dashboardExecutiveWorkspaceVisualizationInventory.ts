import { DashboardExecutiveWorkspaceVisualizationRegistryCategories } from "./dashboardExecutiveWorkspaceVisualizationCategories.ts";
import { DashboardExecutiveWorkspaceVisualizationExtensionClassifications } from "./dashboardExecutiveWorkspaceVisualizationExtensions.ts";
import { DashboardExecutiveWorkspaceVisualizationFoundationPlatform } from "./dashboardExecutiveWorkspaceVisualizationFoundation.ts";
import { DashboardExecutiveWorkspaceVisualizationRegistryPolicies } from "./dashboardExecutiveWorkspaceVisualizationPolicies.ts";
import { DashboardExecutiveWorkspaceVisualizationVocabularyRegistries } from "./dashboardExecutiveWorkspaceVisualizationVocabulary.ts";

const vocabularyEntries = Object.freeze(
  DashboardExecutiveWorkspaceVisualizationVocabularyRegistries.flatMap(
    ({ entries }) => entries),
);

export const DashboardExecutiveWorkspaceVisualizationRegistryInventory = Object.freeze({
  vocabularyRegistries: DashboardExecutiveWorkspaceVisualizationVocabularyRegistries,
  categories: DashboardExecutiveWorkspaceVisualizationRegistryCategories,
  entries: vocabularyEntries,
  extensions: DashboardExecutiveWorkspaceVisualizationExtensionClassifications,
  policies: DashboardExecutiveWorkspaceVisualizationRegistryPolicies,
  foundationContracts: DashboardExecutiveWorkspaceVisualizationFoundationPlatform.contracts,
  foundationOwnership: DashboardExecutiveWorkspaceVisualizationFoundationPlatform.ownership,
  foundationBoundaries: DashboardExecutiveWorkspaceVisualizationFoundationPlatform.boundaries,
  foundationLifecycle: DashboardExecutiveWorkspaceVisualizationFoundationPlatform.lifecycle,
  foundationCapabilities:
    DashboardExecutiveWorkspaceVisualizationFoundationPlatform.capabilities,
  foundationPolicies: DashboardExecutiveWorkspaceVisualizationFoundationPlatform.policies,
  foundationIdentity: DashboardExecutiveWorkspaceVisualizationFoundationPlatform.identity,
  foundationInventory: DashboardExecutiveWorkspaceVisualizationFoundationPlatform.inventory,
  counts: Object.freeze({
    vocabularyRegistryCount:
      DashboardExecutiveWorkspaceVisualizationVocabularyRegistries.length,
    categoryCount: DashboardExecutiveWorkspaceVisualizationRegistryCategories.length,
    vocabularyEntryCount: vocabularyEntries.length,
    extensionClassificationCount:
      DashboardExecutiveWorkspaceVisualizationExtensionClassifications.length,
    policyCount: DashboardExecutiveWorkspaceVisualizationRegistryPolicies.length,
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
