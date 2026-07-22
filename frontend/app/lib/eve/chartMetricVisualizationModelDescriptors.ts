import type {
  ChartMetricVisualizationModelDescriptor,
  ChartMetricVisualizationModelName,
} from "./chartMetricVisualizationModelTypes.ts";
import { ChartMetricVisualizationRegistryPlatform } from "./chartMetricVisualizationRegistry.ts";

const descriptorSeeds = Object.freeze([
  ["MetricIdentityModel", ["stableId", "canonicalName", "ownerReference"]],
  ["MetricReferenceModel", ["metricIdentityReference", "sourceReference", "compatibility"]],
  ["MetricDefinitionModel", ["metricReference", "labelIntent", "formatIntent"]],
  ["MetricValueModel", ["definitionReference", "valueReference", "observationContext"]],
  ["MetricTargetModel", ["valueReference", "targetReference", "targetHierarchy"]],
  ["MetricBaselineModel", ["valueReference", "baselineReference", "baselineHierarchy"]],
  ["MetricVarianceModel", ["valueReference", "varianceReference", "varianceHierarchy"]],
  ["MetricTrendModel", ["valueReference", "trendReference", "trendHierarchy"]],
  ["MetricThresholdModel", ["valueReference", "thresholdReferences", "thresholdHierarchy"]],
  ["MetricStatusModel", ["valueReference", "statusReference", "statusHierarchy"]],
  ["MetricCardModel", ["metricIdentityReference", "valueReference", "supportingReferences"]],
  ["MetricComparisonModel", ["leftReference", "rightReference", "comparisonType"]],
  ["ChartIdentityModel", ["stableId", "canonicalName", "ownerReference"]],
  ["ChartDefinitionModel", ["chartIdentityReference", "seriesReferences", "outputReference"]],
  ["ChartSeriesModel", ["chartReference", "metricReference", "orderingIntent"]],
  ["ChartAxisModel", ["chartReference", "axisRole", "scaleIntent"]],
  ["ChartLegendModel", ["chartReference", "entryReferences", "orderingIntent"]],
  ["ChartAnnotationModel", ["chartReference", "annotationType", "targetReference"]],
  ["ChartOutputModel", ["chartReference", "outputProfile", "targetReference"]],
  ["ChartMetricVisualizationProfileModel", ["chartReference", "profileReference", "compatibility"]],
] as const satisfies readonly [ChartMetricVisualizationModelName, readonly string[]][]);

const registry = ChartMetricVisualizationRegistryPlatform;

export const ChartMetricVisualizationModelDescriptors:
readonly ChartMetricVisualizationModelDescriptor[] = Object.freeze(descriptorSeeds.map(
  ([canonicalName, structuralMetadata], index) => {
    const category = registry.categories[index]!;
    return Object.freeze({
      id: `EVE-5:3/Model/${canonicalName}` as const,
      canonicalName,
      registryReference: category,
      namespace: `nexora.eve.chart-metric-visualization.model.${canonicalName.toLowerCase()}` as const,
      version: "1.0.0" as const,
      ownershipReference: registry.foundation.ownership,
      lifecycleReference: registry.foundation.lifecycle,
      capabilityReferences: registry.foundation.capabilities,
      structuralMetadata: Object.freeze([...structuralMetadata]),
      boundaryReferences: registry.foundation.boundaries,
      compatibilityMetadata: Object.freeze({ registryCompatible: true as const }),
      extensionMetadata: Object.freeze({
        classificationReference: registry.extensions[index % registry.extensions.length],
      }),
      deterministicOrder: index + 1,
      stability: "Stable" as const,
      executableBehavior: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    });
  }),
);

const compositionNames = Object.freeze([
  "Metric identity", "Metric references", "Value hierarchy", "Target hierarchy",
  "Baseline hierarchy", "Variance hierarchy", "Trend hierarchy", "Threshold hierarchy",
  "Status hierarchy", "Metric-card composition", "Comparison composition", "Chart root",
  "Series collection", "Axis collection", "Legend collection", "Annotation collection",
  "Output references", "Visualization profile",
] as const);

const compositionModelIndexes = Object.freeze([
  0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19,
] as const);

export const ChartMetricVisualizationStructuralComposition = Object.freeze(
  compositionNames.map((name, index) => Object.freeze({
    id: `EVE-5:3/Composition/${name.replaceAll(" ", "").replace("-", "")}` as const,
    name,
    modelReference: ChartMetricVisualizationModelDescriptors[compositionModelIndexes[index]!]!,
    deterministicOrder: index + 1,
    executionProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
