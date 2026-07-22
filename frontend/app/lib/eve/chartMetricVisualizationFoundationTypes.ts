export type ChartMetricVisualizationContractName =
  | "MetricIdentityContract" | "MetricReferenceContract"
  | "MetricDefinitionContract" | "MetricValueContract"
  | "MetricTargetContract" | "MetricBaselineContract"
  | "MetricVarianceContract" | "MetricTrendContract"
  | "MetricThresholdContract" | "MetricStatusContract"
  | "MetricCardContract" | "MetricComparisonContract"
  | "ChartIdentityContract" | "ChartDefinitionContract"
  | "ChartSeriesContract" | "ChartAxisContract"
  | "ChartLegendContract" | "ChartAnnotationContract"
  | "ChartOutputContract" | "ChartMetricVisualizationExtensionContract";

export type ChartMetricVisualizationLifecycleState =
  | "Declared" | "Structured" | "Prepared" | "Published" | "Retired";

export type MetricStatusIntent =
  | "OnTrack" | "AtRisk" | "OffTrack" | "AboveTarget" | "BelowTarget"
  | "Stable" | "Improving" | "Declining" | "Unknown" | "NotApplicable";

export type MetricDirectionIntent =
  | "HigherIsBetter" | "LowerIsBetter" | "TargetRangeIsBetter"
  | "Neutral" | "ContextDependent" | "Unknown";

export type MetricFormatIntent =
  | "Integer" | "Decimal" | "Percentage" | "Currency" | "Duration"
  | "Ratio" | "Rate" | "Count" | "Score" | "Index" | "CompactNumber"
  | "CustomReference";

export type ChartIntentFamily =
  | "Bar" | "Column" | "Line" | "Area" | "Pie" | "Donut" | "Scatter"
  | "Bubble" | "Gauge" | "Progress" | "Bullet" | "Waterfall" | "Funnel"
  | "Heatmap" | "Radar" | "ComboChart" | "Scorecard" | "MetricCard";

export interface ChartMetricVisualizationContractDeclaration {
  readonly id: `EVE-5:1/Contract/${ChartMetricVisualizationContractName}`;
  readonly name: ChartMetricVisualizationContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationDeclaration {
  readonly id: `EVE-5:1/${"Boundary" | "Capability" | "Policy" | "Lifecycle"}/${string}`;
  readonly name: string;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
