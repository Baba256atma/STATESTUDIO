import type * as Registry from "./chartMetricVisualizationRegistry.ts";

export type ChartMetricVisualizationModelName =
  | "MetricIdentityModel" | "MetricReferenceModel" | "MetricDefinitionModel"
  | "MetricValueModel" | "MetricTargetModel" | "MetricBaselineModel"
  | "MetricVarianceModel" | "MetricTrendModel" | "MetricThresholdModel"
  | "MetricStatusModel" | "MetricCardModel" | "MetricComparisonModel"
  | "ChartIdentityModel" | "ChartDefinitionModel" | "ChartSeriesModel"
  | "ChartAxisModel" | "ChartLegendModel" | "ChartAnnotationModel"
  | "ChartOutputModel" | "ChartMetricVisualizationProfileModel";

type RegistryCategory =
  typeof Registry.ChartMetricVisualizationRegistryPlatform.categories[number];

export interface ChartMetricVisualizationModelDescriptor {
  readonly id: `EVE-5:3/Model/${ChartMetricVisualizationModelName}`;
  readonly canonicalName: ChartMetricVisualizationModelName;
  readonly registryReference: RegistryCategory;
  readonly namespace: `nexora.eve.chart-metric-visualization.model.${string}`;
  readonly version: "1.0.0";
  readonly ownershipReference: unknown;
  readonly lifecycleReference: unknown;
  readonly capabilityReferences: readonly unknown[];
  readonly structuralMetadata: readonly string[];
  readonly boundaryReferences: readonly unknown[];
  readonly compatibilityMetadata: Readonly<{ registryCompatible: true }>;
  readonly extensionMetadata: Readonly<{ classificationReference: unknown }>;
  readonly deterministicOrder: number;
  readonly stability: "Stable";
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationModelRelationship {
  readonly id: `EVE-5:3/Relationship/${string}`;
  readonly sourceModel: ChartMetricVisualizationModelName;
  readonly targetModel: ChartMetricVisualizationModelName;
  readonly referenceField: string;
  readonly registryReference: "EVE-5:2/ChartMetricVisualizationRegistry";
  readonly deterministicOrder: number;
  readonly resolutionProvided: false;
  readonly aggregationProvided: false;
  readonly executionProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
