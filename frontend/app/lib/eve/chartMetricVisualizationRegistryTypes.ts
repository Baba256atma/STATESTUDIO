import type * as Foundation from "./chartMetricVisualizationFoundation.ts";

type FoundationContract =
  typeof Foundation.ChartMetricVisualizationFoundationPlatform.contracts[number];

export type ChartMetricVisualizationRegistryKey =
  | "MetricIdentityRegistry" | "MetricReferenceRegistry" | "MetricDefinitionRegistry"
  | "MetricValueRegistry" | "MetricTargetRegistry" | "MetricBaselineRegistry"
  | "MetricVarianceRegistry" | "MetricTrendRegistry" | "MetricThresholdRegistry"
  | "MetricStatusRegistry" | "MetricCardRegistry" | "MetricComparisonRegistry"
  | "ChartIdentityRegistry" | "ChartTypeRegistry" | "ChartSeriesRegistry"
  | "ChartAxisRegistry" | "ChartLegendRegistry" | "ChartAnnotationRegistry"
  | "ChartOutputRegistry" | "VisualizationExtensionRegistry";

export interface ChartMetricVisualizationVocabularyEntry {
  readonly id: `EVE-5:2/Vocabulary/${string}/${string}`;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationVocabularyRegistry {
  readonly id: `EVE-5:2/Registry/${ChartMetricVisualizationRegistryKey}`;
  readonly key: ChartMetricVisualizationRegistryKey;
  readonly name: string;
  readonly description: string;
  readonly foundationContractReference: FoundationContract;
  readonly entries: readonly ChartMetricVisualizationVocabularyEntry[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationRegistryCategory {
  readonly id: `EVE-5:2/Category/${string}`;
  readonly key: string;
  readonly name: string;
  readonly vocabularyRegistryReference: ChartMetricVisualizationVocabularyRegistry;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
