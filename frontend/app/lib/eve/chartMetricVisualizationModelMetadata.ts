import { ChartMetricVisualizationModelInventory } from "./chartMetricVisualizationModelInventory.ts";
import { ChartMetricVisualizationRegistryPlatform } from "./chartMetricVisualizationRegistry.ts";

export const ChartMetricVisualizationModelIdentity = Object.freeze({
  id: "EVE-5:3/ChartMetricVisualizationModel",
  name: "Chart & Metric Visualization Model",
  version: "1.0.0",
  namespace: "nexora.eve.chart-metric-visualization.model",
  layer: "EVE",
  phase: "EVE-5:3",
  status: "ReadyForValidation",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const ChartMetricVisualizationModelReadiness = Object.freeze({
  status: "ReadyForValidation",
  registryStatus: ChartMetricVisualizationRegistryPlatform.metadata.status,
  registryReference: ChartMetricVisualizationRegistryPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const ChartMetricVisualizationModelMetadataRecord = Object.freeze({
  ...ChartMetricVisualizationModelIdentity,
  registryReference: ChartMetricVisualizationRegistryPlatform.metadata.id,
  registry: ChartMetricVisualizationRegistryPlatform,
  inventory: ChartMetricVisualizationModelInventory,
  readiness: ChartMetricVisualizationModelReadiness,
  ownership: Object.freeze({
    owns: Object.freeze([
      "Typed visualization models", "Model descriptors", "Relationship descriptors",
      "Structural composition metadata", "Model inventories", "Model metadata",
    ]),
    doesNotOwn: Object.freeze([
      "KPI calculation", "OKR calculation", "Metric formulas", "Aggregation",
      "Forecasting", "Statistical analysis", "Chart rendering", "Dashboard execution",
      "Runtime interaction", "Director orchestration", "Networking", "Persistence",
    ]),
  }),
  dependency: Object.freeze({
    chartMetricVisualizationRegistryOnly: true,
    directModule: "chartMetricVisualizationRegistry.ts",
    directFoundationImports: false,
    directEveFourImports: false,
    directEarlierEveImports: false,
    directorImports: false,
  }),
  calculation: false,
  aggregation: false,
  forecasting: false,
  statisticalAnalysis: false,
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
