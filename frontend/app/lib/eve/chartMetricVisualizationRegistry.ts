import { ChartMetricVisualizationRegistryCategories } from "./chartMetricVisualizationCategories.ts";
import { ChartMetricVisualizationExtensionClassifications } from "./chartMetricVisualizationExtensions.ts";
import { ChartMetricVisualizationFoundationPlatform } from "./chartMetricVisualizationFoundation.ts";
import { ChartMetricVisualizationRegistryInventory } from "./chartMetricVisualizationInventory.ts";
import { ChartMetricVisualizationRegistryPolicies } from "./chartMetricVisualizationPolicies.ts";
import {
  ChartMetricVisualizationStandardVocabulary,
  ChartMetricVisualizationVocabularyRegistries,
} from "./chartMetricVisualizationVocabulary.ts";

export const ChartMetricVisualizationRegistryIdentityMetadata = Object.freeze({
  id: "EVE-5:2/ChartMetricVisualizationRegistry",
  name: "Chart & Metric Visualization Registry",
  version: "1.0.0",
  namespace: "nexora.eve.chart-metric-visualization.registry",
  layer: "EVE",
  phase: "EVE-5:2",
  status: "ReadyForModel",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const ChartMetricVisualizationRegistryReadinessMetadata = Object.freeze({
  status: "ReadyForModel",
  foundationStatus: ChartMetricVisualizationFoundationPlatform.metadata.status,
  foundationReference: ChartMetricVisualizationFoundationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const ChartMetricVisualizationRegistryInventoryMetadata =
  ChartMetricVisualizationRegistryInventory;

export const ChartMetricVisualizationRegistryMetadata = Object.freeze({
  ...ChartMetricVisualizationRegistryIdentityMetadata,
  foundationReference: ChartMetricVisualizationFoundationPlatform.metadata.id,
  foundation: ChartMetricVisualizationFoundationPlatform,
  inventory: ChartMetricVisualizationRegistryInventoryMetadata,
  readiness: ChartMetricVisualizationRegistryReadinessMetadata,
  dependency: Object.freeze({
    chartMetricVisualizationFoundationOnly: true,
    directModule: "chartMetricVisualizationFoundation.ts",
    directEveFourImports: false,
    directEarlierEveImports: false,
    directorImports: false,
  }),
  calculation: false,
  aggregation: false,
  forecasting: false,
  trendAnalysis: false,
  thresholdEvaluation: false,
  rendering: false,
  dashboardExecution: false,
  interactionExecution: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  deterministic: true,
} as const);

export const ChartMetricVisualizationRegistryPlatform = Object.freeze({
  metadata: ChartMetricVisualizationRegistryMetadata,
  identity: ChartMetricVisualizationRegistryIdentityMetadata,
  inventory: ChartMetricVisualizationRegistryInventoryMetadata,
  readiness: ChartMetricVisualizationRegistryReadinessMetadata,
  foundation: ChartMetricVisualizationFoundationPlatform,
  vocabularyRegistries: ChartMetricVisualizationVocabularyRegistries,
  standardVocabulary: ChartMetricVisualizationStandardVocabulary,
  categories: ChartMetricVisualizationRegistryCategories,
  extensions: ChartMetricVisualizationExtensionClassifications,
  policies: ChartMetricVisualizationRegistryPolicies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const registrySummary = Object.freeze({
  identity: ChartMetricVisualizationRegistryIdentityMetadata,
  status: ChartMetricVisualizationRegistryIdentityMetadata.status,
  readiness: ChartMetricVisualizationRegistryReadinessMetadata,
  inventory: ChartMetricVisualizationRegistryInventoryMetadata,
  foundationReference: ChartMetricVisualizationFoundationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getChartMetricVisualizationRegistrySummary = () => registrySummary;

export const getChartMetricVisualizationRegistryCount = () =>
  ChartMetricVisualizationRegistryInventory.entries.length;

export const getChartMetricVisualizationRegistryReleaseMetadata = () => Object.freeze({
  ...ChartMetricVisualizationRegistryIdentityMetadata,
  readiness: ChartMetricVisualizationRegistryReadinessMetadata.status,
  foundationReference: ChartMetricVisualizationFoundationPlatform.metadata.id,
});
