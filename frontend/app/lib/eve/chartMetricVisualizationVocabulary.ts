import { ChartMetricVisualizationFoundationPlatform } from "./chartMetricVisualizationFoundation.ts";
import type {
  ChartMetricVisualizationRegistryKey,
  ChartMetricVisualizationVocabularyEntry,
  ChartMetricVisualizationVocabularyRegistry,
} from "./chartMetricVisualizationRegistryTypes.ts";

const registrySeeds = Object.freeze([
  ["MetricIdentityRegistry", "Metric Identity Registry", ["StableIdentity", "CanonicalName", "VersionedIdentity", "NamespacedIdentity"]],
  ["MetricReferenceRegistry", "Metric Reference Registry", ["SourceMetric", "SourceField", "UnitReference", "TemporalReference", "ScenarioReference"]],
  ["MetricDefinitionRegistry", "Metric Definition Registry", ["Label", "Description", "UnitIntent", "PrecisionIntent", "PresentationIntent"]],
  ["MetricValueRegistry", "Metric Value Registry", ["PreparedValue", "DisplayValue", "ObservationState", "DataQualityReference"]],
  ["MetricTargetRegistry", "Metric Target Registry", ["PointTarget", "RangeTarget", "MinimumTarget", "MaximumTarget"]],
  ["MetricBaselineRegistry", "Metric Baseline Registry", ["HistoricalBaseline", "PlanBaseline", "ScenarioBaseline", "BenchmarkBaseline"]],
  ["MetricVarianceRegistry", "Metric Variance Registry", ["AbsoluteVariance", "PercentageVariance", "FavorableVariance", "UnfavorableVariance"]],
  ["MetricTrendRegistry", "Metric Trend Registry", ["Upward", "Downward", "Flat", "Mixed", "Indeterminate"]],
  ["MetricThresholdRegistry", "Metric Threshold Registry", ["LowerBound", "UpperBound", "Range", "OpenEnded"]],
  ["MetricStatusRegistry", "Metric Status Registry", ["OnTrack", "AtRisk", "OffTrack", "AboveTarget", "BelowTarget", "Stable", "Improving", "Declining", "Unknown", "NotApplicable"]],
  ["MetricCardRegistry", "Metric Card Registry", ["PrimaryMetric", "SupportingMetric", "ExecutiveSummary", "ScorecardEntry"]],
  ["MetricComparisonRegistry", "Metric Comparison Registry", ["ActualVsTarget", "ActualVsBaseline", "CurrentVsPrevious", "TeamVsTeam", "UnitVsUnit", "ScenarioVsScenario", "ForecastReferenceVsActual", "BenchmarkReferenceVsActual"]],
  ["ChartIdentityRegistry", "Chart Identity Registry", ["StableChartIdentity", "VersionedChartIdentity", "NamespacedChartIdentity"]],
  ["ChartTypeRegistry", "Chart Type Registry", ["Bar", "Column", "Line", "Area", "Pie", "Donut", "Scatter", "Bubble", "Gauge", "Progress", "Bullet", "Waterfall", "Funnel", "Heatmap", "Radar", "Combo", "Scorecard", "MetricCard"]],
  ["ChartSeriesRegistry", "Chart Series Registry", ["MetricSeries", "DimensionSeries", "CategorySeries", "TemporalSeries", "ComparisonSeries"]],
  ["ChartAxisRegistry", "Chart Axis Registry", ["CategoryAxis", "ValueAxis", "TemporalAxis", "PrimaryAxis", "SecondaryAxis"]],
  ["ChartLegendRegistry", "Chart Legend Registry", ["VisibleLegend", "HiddenLegend", "OrderedLegend", "GroupedLegend"]],
  ["ChartAnnotationRegistry", "Chart Annotation Registry", ["LabelAnnotation", "ThresholdAnnotation", "EventAnnotation", "DataPointAnnotation"]],
  ["ChartOutputRegistry", "Chart Output Registry", ["SceneTarget", "TemporalTarget", "MetricCardTarget", "PublicationTarget"]],
  ["VisualizationExtensionRegistry", "Visualization Extension Registry", ["MetricType", "ChartType", "FormatType", "ThresholdType", "StatusType", "AnnotationType", "OutputProfile", "PresentationIntent"]],
] as const satisfies readonly [ChartMetricVisualizationRegistryKey, string, readonly string[]][]);

const foundation = ChartMetricVisualizationFoundationPlatform;

export const ChartMetricVisualizationVocabularyRegistries:
readonly ChartMetricVisualizationVocabularyRegistry[] = Object.freeze(registrySeeds.map(
  ([key, name, vocabulary], registryIndex) => {
    const entries: readonly ChartMetricVisualizationVocabularyEntry[] = Object.freeze(
      vocabulary.map((entryName, entryIndex) => Object.freeze({
        id: `EVE-5:2/Vocabulary/${key}/${entryName}` as const,
        key: entryName,
        name: entryName === "MetricCard" ? "Metric Card" : entryName,
        description: `Descriptive ${name} vocabulary for ${entryName}.`,
        deterministicOrder: entryIndex + 1,
        executable: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      })),
    );
    return Object.freeze({
      id: `EVE-5:2/Registry/${key}` as const,
      key,
      name,
      description: `Canonical immutable vocabulary for ${name}.`,
      foundationContractReference: foundation.contracts[registryIndex]!,
      entries,
      deterministicOrder: registryIndex + 1,
      metadataOnly: true as const,
      immutable: true as const,
    });
  }),
);

export const ChartMetricVisualizationStandardVocabulary = Object.freeze({
  chartTypes: ChartMetricVisualizationVocabularyRegistries[13]!.entries,
  metricStatuses: ChartMetricVisualizationVocabularyRegistries[9]!.entries,
  metricDirections: Object.freeze(["HigherIsBetter", "LowerIsBetter", "TargetRangeIsBetter", "Neutral", "ContextDependent", "Unknown"] as const),
  metricFormats: Object.freeze(["Integer", "Decimal", "Percentage", "Currency", "Duration", "Ratio", "Rate", "Count", "Score", "Index", "CompactNumber", "CustomReference"] as const),
  comparisonTypes: ChartMetricVisualizationVocabularyRegistries[11]!.entries,
  metadataOnly: true,
  immutable: true,
} as const);
