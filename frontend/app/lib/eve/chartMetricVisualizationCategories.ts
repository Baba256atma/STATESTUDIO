import type { ChartMetricVisualizationRegistryCategory } from "./chartMetricVisualizationRegistryTypes.ts";
import { ChartMetricVisualizationVocabularyRegistries } from "./chartMetricVisualizationVocabulary.ts";

const categories = Object.freeze([
  ["MetricIdentities", "Metric identities"], ["MetricReferences", "Metric references"],
  ["MetricDefinitions", "Metric definitions"], ["MetricValues", "Metric values"],
  ["Targets", "Targets"], ["Baselines", "Baselines"], ["Variances", "Variances"],
  ["Trends", "Trends"], ["Thresholds", "Thresholds"], ["StatusValues", "Status values"],
  ["MetricCards", "Metric cards"], ["Comparisons", "Comparisons"],
  ["ChartIdentities", "Chart identities"], ["ChartDefinitions", "Chart definitions"],
  ["Series", "Series"], ["Axes", "Axes"], ["Legends", "Legends"],
  ["Annotations", "Annotations"], ["Outputs", "Outputs"], ["Extensions", "Extensions"],
] as const);

export const ChartMetricVisualizationRegistryCategories:
readonly ChartMetricVisualizationRegistryCategory[] = Object.freeze(categories.map(
  ([key, name], index) => Object.freeze({
    id: `EVE-5:2/Category/${key}` as const,
    key,
    name,
    vocabularyRegistryReference: ChartMetricVisualizationVocabularyRegistries[index]!,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
