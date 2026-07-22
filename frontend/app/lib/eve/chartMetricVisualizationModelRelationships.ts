import type {
  ChartMetricVisualizationModelName,
  ChartMetricVisualizationModelRelationship,
} from "./chartMetricVisualizationModelTypes.ts";
import { ChartMetricVisualizationRegistryPlatform } from "./chartMetricVisualizationRegistry.ts";

const relationshipSeeds = Object.freeze([
  ["MetricIdentityModel", "MetricReferenceModel", "metricIdentityReference"],
  ["MetricReferenceModel", "MetricDefinitionModel", "metricReference"],
  ["MetricDefinitionModel", "MetricValueModel", "definitionReference"],
  ["MetricValueModel", "MetricTargetModel", "targetReference"],
  ["MetricValueModel", "MetricBaselineModel", "baselineReference"],
  ["MetricValueModel", "MetricVarianceModel", "varianceReference"],
  ["MetricValueModel", "MetricTrendModel", "trendReference"],
  ["MetricValueModel", "MetricThresholdModel", "thresholdReferences"],
  ["MetricValueModel", "MetricStatusModel", "statusReference"],
  ["MetricCardModel", "MetricValueModel", "valueReference"],
  ["MetricCardModel", "MetricComparisonModel", "comparisonReference"],
  ["ChartDefinitionModel", "MetricCardModel", "metricCardReferences"],
  ["ChartDefinitionModel", "ChartSeriesModel", "seriesReferences"],
  ["ChartDefinitionModel", "ChartAxisModel", "axisReferences"],
  ["ChartDefinitionModel", "ChartLegendModel", "legendReference"],
  ["ChartDefinitionModel", "ChartAnnotationModel", "annotationReferences"],
  ["ChartDefinitionModel", "ChartOutputModel", "outputReference"],
  ["ChartDefinitionModel", "ChartMetricVisualizationProfileModel", "profileReference"],
] as const satisfies readonly [ChartMetricVisualizationModelName,
  ChartMetricVisualizationModelName, string][]);

export const ChartMetricVisualizationModelRelationships:
readonly ChartMetricVisualizationModelRelationship[] = Object.freeze(relationshipSeeds.map(
  ([sourceModel, targetModel, referenceField], index) => Object.freeze({
    id: `EVE-5:3/Relationship/${sourceModel}-${targetModel}` as const,
    sourceModel,
    targetModel,
    referenceField,
    registryReference: ChartMetricVisualizationRegistryPlatform.metadata.id,
    deterministicOrder: index + 1,
    resolutionProvided: false as const,
    aggregationProvided: false as const,
    executionProvided: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
