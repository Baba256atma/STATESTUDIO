import { buildDashboardIntelligenceAdapterRegistry } from "./DashboardIntelligenceAdapter.ts";
import {
  EMPTY_RISK_INTELLIGENCE_FEED_VIEW,
  RISK_FEED_DIAGNOSTICS,
  RISK_INTELLIGENCE_FEED_VERSION,
  type RiskIntelligenceFeedBuildInput,
  type RiskIntelligenceFeedSection,
  type RiskIntelligenceFeedView,
} from "./riskIntelligenceFeedContract.ts";
import type { ExecutiveRiskSummary } from "../risk-intelligence/executiveRiskSummaryContract.ts";

let latestRiskIntelligenceFeed: RiskIntelligenceFeedView = EMPTY_RISK_INTELLIGENCE_FEED_VIEW;

function collectAdapterInput(input: RiskIntelligenceFeedBuildInput) {
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

function riskIntelligenceHasData(riskIntelligence: ExecutiveRiskSummary): boolean {
  return (
    riskIntelligence.profiles.length > 0 ||
    riskIntelligence.topRisks.length > 0 ||
    riskIntelligence.topRiskChains.length > 0 ||
    riskIntelligence.topVulnerabilities.length > 0 ||
    riskIntelligence.propagation.chainCount > 0
  );
}

function buildTopRisksSection(riskIntelligence: ExecutiveRiskSummary): RiskIntelligenceFeedSection {
  const sortedProfiles = [...riskIntelligence.profiles].sort((left, right) => right.riskScore - left.riskScore);
  const primaryValue =
    riskIntelligence.topRisks[0] ??
    sortedProfiles[0]?.label ??
    (riskIntelligence.profiles.length > 0
      ? `${riskIntelligence.profiles.length} risk profile(s) detected.`
      : "No top risk signals available.");

  return Object.freeze({
    id: "top_risks",
    title: "Top Risks",
    primaryValue,
    secondaryValue: joinSignals(
      [
        ...riskIntelligence.topRisks.slice(1, 3),
        ...sortedProfiles.slice(0, 2).map((profile) => profile.label),
      ],
      3,
      riskIntelligence.executiveSummary
    ),
    signalCount: riskIntelligence.topRisks.length + riskIntelligence.profiles.length,
  });
}

function buildRiskChainsSection(riskIntelligence: ExecutiveRiskSummary): RiskIntelligenceFeedSection {
  const primaryValue =
    riskIntelligence.topRiskChains[0] ??
    (riskIntelligence.propagation.chainCount > 0
      ? `${riskIntelligence.propagation.chainCount} propagation chain(s) detected.`
      : "No risk chain signals available.");

  return Object.freeze({
    id: "risk_chains",
    title: "Risk Chains",
    primaryValue,
    secondaryValue: joinSignals(riskIntelligence.topRiskChains.slice(1, 4), 3, riskIntelligence.executiveSummary),
    signalCount: riskIntelligence.topRiskChains.length || riskIntelligence.propagation.chainCount,
  });
}

function buildRiskPropagationSection(riskIntelligence: ExecutiveRiskSummary): RiskIntelligenceFeedSection {
  const propagation = riskIntelligence.propagation;
  const primaryValue =
    propagation.propagationScore > 0
      ? `Propagation score ${Math.round(propagation.propagationScore)} across ${propagation.chainCount} chain(s).`
      : riskIntelligence.propagationScore > 0
        ? `Propagation score ${Math.round(riskIntelligence.propagationScore)}.`
        : "No risk propagation signals available.";

  const reasoning = propagation.propagationReasoning?.[0];

  return Object.freeze({
    id: "risk_propagation",
    title: "Risk Propagation",
    primaryValue,
    secondaryValue: joinSignals(
      [
        reasoning ?? "",
        `Objects: ${propagation.objectCount}`,
        `Relationships: ${propagation.relationshipCount}`,
        `KPIs: ${propagation.kpiCount}`,
      ].filter(Boolean),
      3,
      riskIntelligence.executiveSummary
    ),
    meta: `Sources ${propagation.riskSources.length} · Targets ${propagation.riskTargets.length}`,
    signalCount: propagation.chainCount,
  });
}

function buildCriticalVulnerabilitiesSection(
  riskIntelligence: ExecutiveRiskSummary
): RiskIntelligenceFeedSection {
  const attention = riskIntelligence.recommendedAttention[0];
  const primaryValue =
    riskIntelligence.topVulnerabilities[0] ??
    attention?.reason ??
    (riskIntelligence.topVulnerabilities.length > 0
      ? `${riskIntelligence.topVulnerabilities.length} vulnerability signal(s).`
      : "No critical vulnerability signals available.");

  return Object.freeze({
    id: "critical_vulnerabilities",
    title: "Critical Vulnerabilities",
    primaryValue,
    secondaryValue: joinSignals(
      [
        ...riskIntelligence.topVulnerabilities.slice(1, 3),
        ...riskIntelligence.recommendedAttention.slice(0, 1).map((item) => item.reason),
      ],
      3,
      riskIntelligence.executiveSummary
    ),
    signalCount:
      riskIntelligence.topVulnerabilities.length + riskIntelligence.recommendedAttention.length,
  });
}

export function buildRiskIntelligenceFeed(
  input: RiskIntelligenceFeedBuildInput = {}
): RiskIntelligenceFeedView {
  const adapterInput = collectAdapterInput(input);
  const adapterRegistry =
    input.adapterRegistry ?? buildDashboardIntelligenceAdapterRegistry(adapterInput);
  const riskIntelligence = input.riskIntelligence ?? adapterRegistry.snapshot.riskIntelligence;

  if (!riskIntelligenceHasData(riskIntelligence)) {
    latestRiskIntelligenceFeed = EMPTY_RISK_INTELLIGENCE_FEED_VIEW;
    return latestRiskIntelligenceFeed;
  }

  const feed = Object.freeze({
    version: RISK_INTELLIGENCE_FEED_VERSION,
    feedStatus: "bound" as const,
    topRisks: buildTopRisksSection(riskIntelligence),
    riskChains: buildRiskChainsSection(riskIntelligence),
    riskPropagation: buildRiskPropagationSection(riskIntelligence),
    criticalVulnerabilities: buildCriticalVulnerabilitiesSection(riskIntelligence),
    riskIntelligence,
    feedReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: RISK_FEED_DIAGNOSTICS,
  });

  latestRiskIntelligenceFeed = feed;
  return feed;
}

export function getRiskIntelligenceFeed(): RiskIntelligenceFeedView {
  return latestRiskIntelligenceFeed;
}

export function resetRiskIntelligenceFeedForTests(): void {
  latestRiskIntelligenceFeed = EMPTY_RISK_INTELLIGENCE_FEED_VIEW;
}

export const RiskIntelligenceFeed = Object.freeze({
  buildRiskIntelligenceFeed,
  getRiskIntelligenceFeed,
  resetRiskIntelligenceFeedForTests,
});
