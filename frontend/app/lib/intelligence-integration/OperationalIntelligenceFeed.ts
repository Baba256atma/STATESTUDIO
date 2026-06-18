import { buildDashboardIntelligenceAdapterRegistry } from "./DashboardIntelligenceAdapter.ts";
import {
  EMPTY_OPERATIONAL_INTELLIGENCE_FEED_VIEW,
  OPERATIONAL_FEED_DIAGNOSTICS,
  OPERATIONAL_INTELLIGENCE_FEED_VERSION,
  type OperationalIntelligenceFeedBuildInput,
  type OperationalIntelligenceFeedSection,
  type OperationalIntelligenceFeedView,
} from "./operationalIntelligenceFeedContract.ts";
import type { ExecutiveIntelligenceSnapshot } from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import type { ExecutiveKpiSummary } from "../kpi-intelligence/executiveKpiSummaryContract.ts";
import type { ExecutiveObjectIntelligenceSummary } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";
import type { ExecutiveRelationshipSummary } from "../relationship-intelligence/executiveRelationshipSummaryContract.ts";

let latestOperationalIntelligenceFeed: OperationalIntelligenceFeedView =
  EMPTY_OPERATIONAL_INTELLIGENCE_FEED_VIEW;

function collectAdapterInput(input: OperationalIntelligenceFeedBuildInput) {
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

function buildObjectHealthSection(
  objectIntelligence: ExecutiveObjectIntelligenceSummary
): OperationalIntelligenceFeedSection {
  const attention = objectIntelligence.recommendedAttention[0];
  const primaryValue =
    attention?.reason ??
    objectIntelligence.topWeaknesses[0] ??
    (objectIntelligence.objectCount > 0
      ? `Average health ${Math.round(objectIntelligence.averageHealthScore)} across ${objectIntelligence.objectCount} object(s).`
      : "No object health signals available.");

  return Object.freeze({
    id: "object_health",
    title: "Object Health",
    primaryValue,
    secondaryValue: joinSignals(
      [...objectIntelligence.topWeaknesses.slice(0, 2), ...objectIntelligence.topStrengths.slice(0, 1)],
      3,
      objectIntelligence.executiveSummary
    ),
    signalCount:
      objectIntelligence.recommendedAttention.length +
      objectIntelligence.topWeaknesses.length +
      objectIntelligence.topStrengths.length,
  });
}

function buildObjectTrendSection(
  objectIntelligence: ExecutiveObjectIntelligenceSummary
): OperationalIntelligenceFeedSection {
  const trendSummary = [
    objectIntelligence.improvingCount > 0 ? `${objectIntelligence.improvingCount} improving` : null,
    objectIntelligence.stableCount > 0 ? `${objectIntelligence.stableCount} stable` : null,
    objectIntelligence.decliningCount > 0 ? `${objectIntelligence.decliningCount} declining` : null,
    objectIntelligence.volatileCount > 0 ? `${objectIntelligence.volatileCount} volatile` : null,
  ].filter(Boolean) as string[];

  const dominantTrend =
    objectIntelligence.decliningCount >= objectIntelligence.improvingCount
      ? objectIntelligence.decliningCount > 0
        ? "Declining trend pressure"
        : "Stable object trend"
      : "Improving object trend";

  const profileTrends = objectIntelligence.profiles
    .map((profile) => profile.trend?.trendDirection)
    .filter(Boolean)
    .slice(0, 3) as string[];

  return Object.freeze({
    id: "object_trend",
    title: "Object Trend",
    primaryValue: dominantTrend,
    secondaryValue: joinSignals(
      [...trendSummary, ...profileTrends],
      4,
      objectIntelligence.executiveSummary
    ),
    signalCount: trendSummary.length + profileTrends.length,
  });
}

function buildRelationshipHealthSection(
  relationshipIntelligence: ExecutiveRelationshipSummary
): OperationalIntelligenceFeedSection {
  const primaryValue =
    relationshipIntelligence.recommendedAttention[0]?.reason ??
    relationshipIntelligence.topRisks[0] ??
    (relationshipIntelligence.relationshipCount > 0
      ? `Average strength ${Math.round(relationshipIntelligence.averageStrengthScore)} across ${relationshipIntelligence.relationshipCount} relationship(s).`
      : "No relationship health signals available.");

  return Object.freeze({
    id: "relationship_health",
    title: "Relationship Health",
    primaryValue,
    secondaryValue: joinSignals(
      [
        ...relationshipIntelligence.topRisks.slice(0, 2),
        ...relationshipIntelligence.topInfluencers.slice(0, 1),
      ],
      3,
      relationshipIntelligence.executiveSummary
    ),
    signalCount:
      relationshipIntelligence.topRisks.length +
      relationshipIntelligence.recommendedAttention.length,
  });
}

function buildRelationshipDependencySection(
  relationshipIntelligence: ExecutiveRelationshipSummary
): OperationalIntelligenceFeedSection {
  const primaryValue =
    relationshipIntelligence.topDependencies[0] ??
    (relationshipIntelligence.relationshipCount > 0
      ? `Average dependency ${Math.round(relationshipIntelligence.averageDependencyScore)}.`
      : "No relationship dependency signals available.");

  return Object.freeze({
    id: "relationship_dependency",
    title: "Relationship Dependency",
    primaryValue,
    secondaryValue: joinSignals(
      relationshipIntelligence.topDependencies.slice(1, 4),
      3,
      relationshipIntelligence.executiveSummary
    ),
    signalCount: relationshipIntelligence.topDependencies.length,
  });
}

function buildOperationalKpiSection(kpiIntelligence: ExecutiveKpiSummary): OperationalIntelligenceFeedSection {
  const primaryValue =
    kpiIntelligence.topCriticalKpis[0] ??
    kpiIntelligence.topDecliningKpis[0] ??
    kpiIntelligence.topPerformingKpis[0] ??
    (kpiIntelligence.kpiCount > 0
      ? `Average KPI health ${Math.round(kpiIntelligence.averageHealthScore)} across ${kpiIntelligence.kpiCount} KPI(s).`
      : "No operational KPI signals available.");

  return Object.freeze({
    id: "operational_kpi_signals",
    title: "Operational KPI Signals",
    primaryValue,
    secondaryValue: joinSignals(
      [
        ...kpiIntelligence.topCriticalKpis.slice(0, 2),
        ...kpiIntelligence.topDecliningKpis.slice(0, 1),
        ...kpiIntelligence.topPerformingKpis.slice(0, 1),
      ],
      4,
      kpiIntelligence.executiveSummary
    ),
    signalCount:
      kpiIntelligence.topCriticalKpis.length +
      kpiIntelligence.topDecliningKpis.length +
      kpiIntelligence.topPerformingKpis.length,
  });
}

export function buildOperationalIntelligenceFeed(
  input: OperationalIntelligenceFeedBuildInput = {}
): OperationalIntelligenceFeedView {
  const adapterInput = collectAdapterInput(input);
  const adapterRegistry =
    input.adapterRegistry ?? buildDashboardIntelligenceAdapterRegistry(adapterInput);
  const snapshot = adapterRegistry.snapshot;

  if (!snapshotHasIntelligence(snapshot)) {
    latestOperationalIntelligenceFeed = EMPTY_OPERATIONAL_INTELLIGENCE_FEED_VIEW;
    return latestOperationalIntelligenceFeed;
  }

  const feed = Object.freeze({
    version: OPERATIONAL_INTELLIGENCE_FEED_VERSION,
    feedStatus: "bound" as const,
    objectHealth: buildObjectHealthSection(snapshot.objectIntelligence),
    objectTrend: buildObjectTrendSection(snapshot.objectIntelligence),
    relationshipHealth: buildRelationshipHealthSection(snapshot.relationshipIntelligence),
    relationshipDependency: buildRelationshipDependencySection(snapshot.relationshipIntelligence),
    operationalKpiSignals: buildOperationalKpiSection(snapshot.kpiIntelligence),
    snapshot,
    feedReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: OPERATIONAL_FEED_DIAGNOSTICS,
  });

  latestOperationalIntelligenceFeed = feed;
  return feed;
}

export function getOperationalIntelligenceFeed(): OperationalIntelligenceFeedView {
  return latestOperationalIntelligenceFeed;
}

export function resetOperationalIntelligenceFeedForTests(): void {
  latestOperationalIntelligenceFeed = EMPTY_OPERATIONAL_INTELLIGENCE_FEED_VIEW;
}

export const OperationalIntelligenceFeed = Object.freeze({
  buildOperationalIntelligenceFeed,
  getOperationalIntelligenceFeed,
  resetOperationalIntelligenceFeedForTests,
});
