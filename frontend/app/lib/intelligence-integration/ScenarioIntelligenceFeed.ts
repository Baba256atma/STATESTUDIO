import { buildDashboardIntelligenceAdapterRegistry } from "./DashboardIntelligenceAdapter.ts";
import {
  EMPTY_SCENARIO_INTELLIGENCE_FEED_VIEW,
  SCENARIO_FEED_DIAGNOSTICS,
  SCENARIO_INTELLIGENCE_FEED_VERSION,
  type ScenarioIntelligenceFeedBuildInput,
  type ScenarioIntelligenceFeedSection,
  type ScenarioIntelligenceFeedView,
} from "./scenarioIntelligenceFeedContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import type { ExecutiveScenarioSummaryProfile } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";

let latestScenarioIntelligenceFeed: ScenarioIntelligenceFeedView =
  EMPTY_SCENARIO_INTELLIGENCE_FEED_VIEW;

function collectAdapterInput(input: ScenarioIntelligenceFeedBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    risks: input.risks,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
    selectedObjectId: input.selectedObjectId,
  });
}

function joinSignals(items: readonly string[], limit = 3, fallback = "No additional signals."): string {
  const trimmed = items.map((item) => item.trim()).filter(Boolean);
  if (trimmed.length === 0) return fallback;
  return trimmed.slice(0, limit).join(" · ");
}

function scenarioIntelligenceHasData(scenarioIntelligence: ExecutiveScenarioSummary): boolean {
  return scenarioIntelligence.scenarioCount > 0 || scenarioIntelligence.summaries.length > 0;
}

function sortedSummaries(
  scenarioIntelligence: ExecutiveScenarioSummary
): readonly ExecutiveScenarioSummaryProfile[] {
  return Object.freeze(
    [...scenarioIntelligence.summaries].sort(
      (left, right) =>
        right.impactAggregation.compositeImpactScore - left.impactAggregation.compositeImpactScore
    )
  );
}

function buildScenarioSummariesSection(
  scenarioIntelligence: ExecutiveScenarioSummary
): ScenarioIntelligenceFeedSection {
  const summaries = sortedSummaries(scenarioIntelligence);
  const primaryValue =
    summaries[0]?.label ??
    (scenarioIntelligence.scenarioCount > 0
      ? `${scenarioIntelligence.scenarioCount} scenario(s) summarized.`
      : "No scenario summaries available.");

  const summaryLabels = summaries.map((summary) => summary.label);
  const swotHighlights = summaries
    .flatMap((summary) => [
      summary.strengths[0]?.label,
      summary.opportunities[0]?.label,
      summary.threats[0]?.label,
    ])
    .filter(Boolean) as string[];

  return Object.freeze({
    id: "scenario_summaries",
    title: "Scenario Summaries",
    primaryValue,
    secondaryValue: joinSignals([...summaryLabels.slice(1, 4), ...swotHighlights.slice(0, 2)], 4, scenarioIntelligence.executiveSummary),
    signalCount: summaries.length,
  });
}

function buildScenarioRecommendationsSection(
  scenarioIntelligence: ExecutiveScenarioSummary
): ScenarioIntelligenceFeedSection {
  const recommendations = sortedSummaries(scenarioIntelligence).flatMap((summary) =>
    summary.recommendedActions.map((action) => `${summary.label}: ${action.label}`)
  );

  const topAction = sortedSummaries(scenarioIntelligence)
    .flatMap((summary) => summary.recommendedActions)
    .sort((left, right) => {
      const priorityRank = { immediate: 4, prioritize: 3, review: 2, monitor: 1 };
      return priorityRank[right.priority] - priorityRank[left.priority];
    })[0];

  const primaryValue =
    topAction?.label ??
    recommendations[0] ??
    "No scenario recommendations available.";

  return Object.freeze({
    id: "scenario_recommendations",
    title: "Scenario Recommendations",
    primaryValue,
    secondaryValue: joinSignals(recommendations.slice(0, 4), 4, scenarioIntelligence.executiveSummary),
    meta: topAction?.reason,
    signalCount: recommendations.length,
  });
}

function buildScenarioConfidenceSection(
  scenarioIntelligence: ExecutiveScenarioSummary
): ScenarioIntelligenceFeedSection {
  const summaries = sortedSummaries(scenarioIntelligence);
  const averageComposite =
    summaries.length > 0
      ? summaries.reduce((total, summary) => total + summary.impactAggregation.compositeImpactScore, 0) /
        summaries.length
      : 0;

  const strengthCount = summaries.reduce((total, summary) => total + summary.strengths.length, 0);
  const threatCount = summaries.reduce((total, summary) => total + summary.threats.length, 0);

  const primaryValue =
    summaries.length > 0
      ? `Composite confidence ${Math.round(averageComposite)} across ${summaries.length} scenario(s).`
      : "No scenario confidence signals available.";

  return Object.freeze({
    id: "scenario_confidence",
    title: "Scenario Confidence",
    primaryValue,
    secondaryValue: joinSignals(
      [
        strengthCount > 0 ? `${strengthCount} strength signal(s)` : "",
        threatCount > 0 ? `${threatCount} threat signal(s)` : "",
        ...summaries.slice(0, 2).map(
          (summary) => `${summary.label} impact ${Math.round(summary.impactAggregation.compositeImpactScore)}`
        ),
      ].filter(Boolean),
      4,
      scenarioIntelligence.executiveSummary
    ),
    signalCount: strengthCount + threatCount,
  });
}

function buildScenarioComparisonSummariesSection(
  scenarioIntelligence: ExecutiveScenarioSummary
): ScenarioIntelligenceFeedSection {
  const summaries = sortedSummaries(scenarioIntelligence);
  const left = summaries[0];
  const right = summaries[1];

  const comparisonLines =
    left && right
      ? [
          `${left.label} (${Math.round(left.impactAggregation.compositeImpactScore)}) vs ${right.label} (${Math.round(right.impactAggregation.compositeImpactScore)})`,
          `Impact delta ${Math.round(Math.abs(left.impactAggregation.compositeImpactScore - right.impactAggregation.compositeImpactScore))}`,
        ]
      : summaries.slice(0, 3).map(
          (summary) =>
            `${summary.label}: composite ${Math.round(summary.impactAggregation.compositeImpactScore)}`
        );

  const primaryValue =
    comparisonLines[0] ??
    (summaries.length > 0
      ? `${summaries.length} scenario comparison signal(s) available.`
      : "No scenario comparison summaries available.");

  return Object.freeze({
    id: "scenario_comparison_summaries",
    title: "Scenario Comparison Summaries",
    primaryValue,
    secondaryValue: joinSignals(comparisonLines.slice(1, 4), 3, scenarioIntelligence.executiveSummary),
    signalCount: Math.max(0, summaries.length - 1),
  });
}

export function buildScenarioIntelligenceFeed(
  input: ScenarioIntelligenceFeedBuildInput = {}
): ScenarioIntelligenceFeedView {
  const adapterInput = collectAdapterInput(input);
  const adapterRegistry =
    input.adapterRegistry ?? buildDashboardIntelligenceAdapterRegistry(adapterInput);
  const scenarioIntelligence =
    input.scenarioIntelligence ?? adapterRegistry.snapshot.scenarioIntelligence;

  if (!scenarioIntelligenceHasData(scenarioIntelligence)) {
    latestScenarioIntelligenceFeed = EMPTY_SCENARIO_INTELLIGENCE_FEED_VIEW;
    return latestScenarioIntelligenceFeed;
  }

  const feed = Object.freeze({
    version: SCENARIO_INTELLIGENCE_FEED_VERSION,
    feedStatus: "bound" as const,
    scenarioSummaries: buildScenarioSummariesSection(scenarioIntelligence),
    scenarioRecommendations: buildScenarioRecommendationsSection(scenarioIntelligence),
    scenarioConfidence: buildScenarioConfidenceSection(scenarioIntelligence),
    scenarioComparisonSummaries: buildScenarioComparisonSummariesSection(scenarioIntelligence),
    scenarioIntelligence,
    feedReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    simulationActive: false as const,
    diagnostics: SCENARIO_FEED_DIAGNOSTICS,
  });

  latestScenarioIntelligenceFeed = feed;
  return feed;
}

export function getScenarioIntelligenceFeed(): ScenarioIntelligenceFeedView {
  return latestScenarioIntelligenceFeed;
}

export function resetScenarioIntelligenceFeedForTests(): void {
  latestScenarioIntelligenceFeed = EMPTY_SCENARIO_INTELLIGENCE_FEED_VIEW;
}

export const ScenarioIntelligenceFeed = Object.freeze({
  buildScenarioIntelligenceFeed,
  getScenarioIntelligenceFeed,
  resetScenarioIntelligenceFeedForTests,
});
