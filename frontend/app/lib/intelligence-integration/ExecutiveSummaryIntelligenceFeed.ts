import { buildDashboardIntelligenceAdapterRegistry } from "./DashboardIntelligenceAdapter.ts";
import {
  EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_VIEW,
  EXEC_SUMMARY_FEED_DIAGNOSTICS,
  EXEC_SUMMARY_INTELLIGENCE_FEED_VERSION,
  type ExecutiveSummaryIntelligenceFeedBuildInput,
  type ExecutiveSummaryIntelligenceFeedSection,
  type ExecutiveSummaryIntelligenceFeedView,
} from "./executiveSummaryIntelligenceFeedContract.ts";
import type { ExecutiveIntelligenceSnapshot } from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import type { ExecutiveKpiSummary } from "../kpi-intelligence/executiveKpiSummaryContract.ts";
import type { ExecutiveObjectIntelligenceSummary } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";
import type { ExecutiveRiskSummary } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";

let latestExecutiveSummaryIntelligenceFeed: ExecutiveSummaryIntelligenceFeedView =
  EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_VIEW;

function collectAdapterInput(input: ExecutiveSummaryIntelligenceFeedBuildInput) {
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
    snapshot: input.snapshot,
  });
}

function joinSignals(items: readonly string[], limit = 3, fallback = "No additional signals."): string {
  const trimmed = items.map((item) => item.trim()).filter(Boolean);
  if (trimmed.length === 0) return fallback;
  return trimmed.slice(0, limit).join(" · ");
}

function snapshotHasIntelligence(snapshot: ExecutiveIntelligenceSnapshot): boolean {
  return (
    snapshot.objectIntelligence.objectCount > 0 ||
    snapshot.relationshipIntelligence.relationshipCount > 0 ||
    snapshot.kpiIntelligence.kpiCount > 0 ||
    snapshot.riskIntelligence.profiles.length > 0 ||
    snapshot.scenarioIntelligence.scenarioCount > 0
  );
}

function buildHealthSection(
  objectIntelligence: ExecutiveObjectIntelligenceSummary
): ExecutiveSummaryIntelligenceFeedSection {
  const attention = objectIntelligence.recommendedAttention[0];
  const primaryValue =
    attention?.reason ??
    objectIntelligence.topWeaknesses[0] ??
    (objectIntelligence.objectCount > 0
      ? `Average health ${Math.round(objectIntelligence.averageHealthScore)} across ${objectIntelligence.objectCount} object(s).`
      : "No health signals available.");

  const secondaryParts = [
    ...objectIntelligence.topWeaknesses.slice(0, 2),
    ...objectIntelligence.topStrengths.slice(0, 1),
  ];

  return Object.freeze({
    id: "top_health_signals",
    title: "Top Health Signals",
    primaryValue,
    secondaryValue: joinSignals(secondaryParts, 3, objectIntelligence.executiveSummary),
    signalCount:
      objectIntelligence.recommendedAttention.length +
      objectIntelligence.topWeaknesses.length +
      objectIntelligence.topStrengths.length,
  });
}

function buildRiskSection(riskIntelligence: ExecutiveRiskSummary): ExecutiveSummaryIntelligenceFeedSection {
  const sortedProfiles = [...riskIntelligence.profiles].sort((left, right) => right.riskScore - left.riskScore);
  const primaryValue =
    riskIntelligence.topRisks[0] ??
    sortedProfiles[0]?.label ??
    (riskIntelligence.profiles.length > 0
      ? `Propagation score ${Math.round(riskIntelligence.propagationScore)}.`
      : "No risk signals available.");

  const secondaryParts = [
    ...riskIntelligence.topRisks.slice(1, 3),
    ...riskIntelligence.topVulnerabilities.slice(0, 2),
    ...sortedProfiles.slice(0, 2).map((profile) => profile.label),
  ];

  return Object.freeze({
    id: "top_risks",
    title: "Top Risks",
    primaryValue,
    secondaryValue: joinSignals(secondaryParts, 3, riskIntelligence.executiveSummary),
    signalCount:
      riskIntelligence.topRisks.length +
      riskIntelligence.topVulnerabilities.length +
      riskIntelligence.profiles.length,
  });
}

function buildKpiSection(kpiIntelligence: ExecutiveKpiSummary): ExecutiveSummaryIntelligenceFeedSection {
  const primaryValue =
    kpiIntelligence.topCriticalKpis[0] ??
    kpiIntelligence.topDecliningKpis[0] ??
    kpiIntelligence.topPerformingKpis[0] ??
    (kpiIntelligence.kpiCount > 0
      ? `Average KPI health ${Math.round(kpiIntelligence.averageHealthScore)} across ${kpiIntelligence.kpiCount} KPI(s).`
      : "No KPI signals available.");

  const secondaryParts = [
    ...kpiIntelligence.topCriticalKpis.slice(0, 2),
    ...kpiIntelligence.topDecliningKpis.slice(0, 2),
    ...kpiIntelligence.topPerformingKpis.slice(0, 1),
  ];

  return Object.freeze({
    id: "top_kpi_signals",
    title: "Top KPI Signals",
    primaryValue,
    secondaryValue: joinSignals(secondaryParts, 3, kpiIntelligence.executiveSummary),
    signalCount:
      kpiIntelligence.topCriticalKpis.length +
      kpiIntelligence.topDecliningKpis.length +
      kpiIntelligence.topPerformingKpis.length,
  });
}

function buildScenarioSection(
  scenarioIntelligence: ExecutiveScenarioSummary
): ExecutiveSummaryIntelligenceFeedSection {
  const topScenario = scenarioIntelligence.summaries[0];
  const topAction = topScenario?.recommendedActions[0];
  const primaryValue =
    topAction?.label ??
    topScenario?.label ??
    (scenarioIntelligence.scenarioCount > 0
      ? `${scenarioIntelligence.scenarioCount} scenario(s) evaluated.`
      : "No scenario signals available.");

  const secondaryParts = [
    ...scenarioIntelligence.summaries.slice(0, 2).map((summary) => summary.label),
    ...(topScenario?.threats.slice(0, 1).map((threat) => threat.label) ?? []),
    ...(topScenario?.opportunities.slice(0, 1).map((opportunity) => opportunity.label) ?? []),
  ];

  return Object.freeze({
    id: "top_scenario_signals",
    title: "Top Scenario Signals",
    primaryValue,
    secondaryValue: joinSignals(secondaryParts, 3, scenarioIntelligence.executiveSummary),
    signalCount: scenarioIntelligence.scenarioCount,
  });
}

export function buildExecutiveSummaryIntelligenceFeed(
  input: ExecutiveSummaryIntelligenceFeedBuildInput = {}
): ExecutiveSummaryIntelligenceFeedView {
  const adapterInput = collectAdapterInput(input);
  const adapterRegistry =
    input.adapterRegistry ?? buildDashboardIntelligenceAdapterRegistry(adapterInput);
  const snapshot = adapterRegistry.snapshot;

  if (!snapshotHasIntelligence(snapshot)) {
    latestExecutiveSummaryIntelligenceFeed = EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_VIEW;
    return latestExecutiveSummaryIntelligenceFeed;
  }

  const feed = Object.freeze({
    version: EXEC_SUMMARY_INTELLIGENCE_FEED_VERSION,
    feedStatus: "bound" as const,
    topHealthSignals: buildHealthSection(snapshot.objectIntelligence),
    topRisks: buildRiskSection(snapshot.riskIntelligence),
    topKpiSignals: buildKpiSection(snapshot.kpiIntelligence),
    topScenarioSignals: buildScenarioSection(snapshot.scenarioIntelligence),
    snapshot,
    feedReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: EXEC_SUMMARY_FEED_DIAGNOSTICS,
  });

  latestExecutiveSummaryIntelligenceFeed = feed;
  return feed;
}

export function getExecutiveSummaryIntelligenceFeed(): ExecutiveSummaryIntelligenceFeedView {
  return latestExecutiveSummaryIntelligenceFeed;
}

export function resetExecutiveSummaryIntelligenceFeedForTests(): void {
  latestExecutiveSummaryIntelligenceFeed = EMPTY_EXEC_SUMMARY_INTELLIGENCE_FEED_VIEW;
}

export const ExecutiveSummaryIntelligenceFeed = Object.freeze({
  buildExecutiveSummaryIntelligenceFeed,
  getExecutiveSummaryIntelligenceFeed,
  resetExecutiveSummaryIntelligenceFeedForTests,
});
