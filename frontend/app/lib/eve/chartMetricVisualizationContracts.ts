import type {
  ChartIntentFamily,
  ChartMetricVisualizationContractDeclaration,
  ChartMetricVisualizationContractName,
  MetricDirectionIntent,
  MetricFormatIntent,
  MetricStatusIntent,
} from "./chartMetricVisualizationFoundationTypes.ts";

const contractSeeds = Object.freeze([
  ["MetricIdentityContract", "Metric Identity Contract", ["stableId", "canonicalName", "version", "namespace", "ownership", "lifecycleState", "stabilityState", "sourceReference"]],
  ["MetricReferenceContract", "Metric Reference Contract", ["referenceId", "sourcePlatformReference", "sourceMetricIdentity", "sourceFieldReference", "unitReference", "temporalReference", "scenarioReference", "compatibilityMetadata"]],
  ["MetricDefinitionContract", "Metric Definition Contract", ["metricLabel", "metricDescription", "unitIntent", "formatIntent", "directionIntent", "precisionIntent", "aggregationLabelIntent", "presentationIntent"]],
  ["MetricValueContract", "Metric Value Contract", ["valueReference", "displayValueIntent", "unitReference", "precisionReference", "dataQualityReference", "observationState", "temporalContext", "scenarioContext"]],
  ["MetricTargetContract", "Metric Target Contract", ["targetValueReference", "targetType", "targetPeriod", "targetState", "targetLabel", "targetPresentationIntent"]],
  ["MetricBaselineContract", "Metric Baseline Contract", ["baselineValueReference", "baselinePeriod", "baselineType", "comparisonApplicability", "baselinePresentationIntent"]],
  ["MetricVarianceContract", "Metric Variance Contract", ["absoluteVarianceReference", "percentageVarianceReference", "direction", "favorabilityIntent", "comparisonBasis", "varianceStatus", "presentationIntent"]],
  ["MetricTrendContract", "Metric Trend Contract", ["trendDirection", "trendPeriod", "trendMagnitudeReference", "trendState", "trendComparisonReference", "temporalCompatibility", "presentationIntent"]],
  ["MetricThresholdContract", "Metric Threshold Contract", ["thresholdIdentity", "thresholdLevel", "lowerBoundReference", "upperBoundReference", "inclusivityIntent", "statusMapping", "presentationIntent"]],
  ["MetricStatusContract", "Metric Status Contract", ["status", "statusLabel", "sourceReference", "presentationIntent"]],
  ["MetricCardContract", "Metric Card Contract", ["metricIdentityReference", "primaryValueReference", "targetReference", "varianceReference", "trendReference", "statusReference", "supportingLabelReferences", "presentationHierarchy", "outputReference"]],
  ["MetricComparisonContract", "Metric Comparison Contract", ["comparisonIdentity", "comparisonType", "leftValueReference", "rightValueReference", "comparisonBasis", "presentationIntent"]],
  ["ChartIdentityContract", "Chart Identity Contract", ["chartId", "canonicalName", "version", "namespace", "ownership", "lifecycle", "stability", "extensionMetadata"]],
  ["ChartDefinitionContract", "Chart Definition Contract", ["chartTypeIntent", "titleReference", "subtitleReference", "seriesReferences", "axisReferences", "legendReference", "annotationReferences", "metricReferences", "temporalContext", "outputIntent"]],
  ["ChartSeriesContract", "Chart Series Contract", ["seriesIdentity", "seriesLabel", "metricReference", "dimensionReference", "categoryReference", "valueReference", "temporalReference", "orderingIntent", "presentationIntent", "compatibilityMetadata"]],
  ["ChartAxisContract", "Chart Axis Contract", ["axisIdentity", "axisRole", "scaleIntent", "unitIntent", "rangeReference", "labelReference", "tickFormatIntent", "orderingIntent", "temporalAxisCompatibility"]],
  ["ChartLegendContract", "Chart Legend Contract", ["legendIdentity", "entryReferences", "orderingIntent", "positionIntent", "visibilityIntent", "labelIntent", "presentationIntent"]],
  ["ChartAnnotationContract", "Chart Annotation Contract", ["annotationIdentity", "annotationType", "metricReference", "dataPointReference", "thresholdReference", "eventReference", "labelReference", "emphasisIntent"]],
  ["ChartOutputContract", "Chart Output Contract", ["outputIdentity", "chartReference", "metricCardReferences", "sceneRenderingTargetReference", "temporalVisualizationReference", "outputProfile", "compatibilityMetadata", "extensionMetadata"]],
  ["ChartMetricVisualizationExtensionContract", "Chart & Metric Visualization Extension Contract", ["metricTypes", "chartTypes", "formatTypes", "thresholdTypes", "statusTypes", "annotationTypes", "outputProfiles", "presentationIntents"]],
] as const satisfies readonly [ChartMetricVisualizationContractName, string, readonly string[]][]);

export const ChartMetricVisualizationContracts:
readonly ChartMetricVisualizationContractDeclaration[] = Object.freeze(
  contractSeeds.map(([name, canonicalName, fields], index) => Object.freeze({
    id: `EVE-5:1/Contract/${name}` as const,
    name,
    canonicalName,
    description: `Immutable declarative metadata for the ${canonicalName}.`,
    fields: Object.freeze([...fields]),
    deterministicOrder: index + 1,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

export const ChartMetricVisualizationIntents = Object.freeze({
  chartFamilies: Object.freeze(["Bar", "Column", "Line", "Area", "Pie", "Donut", "Scatter", "Bubble", "Gauge", "Progress", "Bullet", "Waterfall", "Funnel", "Heatmap", "Radar", "ComboChart", "Scorecard", "MetricCard"] as const satisfies readonly ChartIntentFamily[]),
  metricDirections: Object.freeze(["HigherIsBetter", "LowerIsBetter", "TargetRangeIsBetter", "Neutral", "ContextDependent", "Unknown"] as const satisfies readonly MetricDirectionIntent[]),
  metricFormats: Object.freeze(["Integer", "Decimal", "Percentage", "Currency", "Duration", "Ratio", "Rate", "Count", "Score", "Index", "CompactNumber", "CustomReference"] as const satisfies readonly MetricFormatIntent[]),
  metricStatuses: Object.freeze(["OnTrack", "AtRisk", "OffTrack", "AboveTarget", "BelowTarget", "Stable", "Improving", "Declining", "Unknown", "NotApplicable"] as const satisfies readonly MetricStatusIntent[]),
  comparisonTypes: Object.freeze(["ActualVersusTarget", "CurrentVersusPrevious", "ActualVersusBaseline", "TeamVersusTeam", "UnitVersusUnit", "ScenarioVersusScenario", "ForecastVersusActual", "BenchmarkVersusObserved"] as const),
  metadataOnly: true,
  immutable: true,
} as const);

const policyNames = Object.freeze([
  "Stable identity policy", "Immutable visualization metadata policy",
  "Upstream reference preservation policy", "Metric-versus-calculation separation policy",
  "Chart-versus-rendering separation policy", "Target ownership separation policy",
  "Threshold evaluation separation policy", "Trend analysis separation policy",
  "Deterministic ordering policy", "Unit-reference preservation policy",
  "Temporal-reference preservation policy", "Scenario-reference preservation policy",
  "Extension compatibility policy", "Canonical Inventory Rule policy",
] as const);

export const ChartMetricVisualizationPolicies = Object.freeze(policyNames.map((name, index) =>
  Object.freeze({
    id: `EVE-5:1/Policy/${index + 1}` as const,
    name,
    description: `${name} is declarative and performs no runtime checks.`,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
