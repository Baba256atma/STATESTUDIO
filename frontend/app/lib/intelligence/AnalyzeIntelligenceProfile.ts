import { buildExecutiveIntelligenceSnapshot } from "./ExecutiveIntelligenceAdapter.ts";
import {
  ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTICS,
  ANALYZE_INTELLIGENCE_PROFILE_VERSION,
  EMPTY_ANALYZE_INTELLIGENCE_PROFILE,
  type AnalyzeConfidenceExposure,
  type AnalyzeHealthExposure,
  type AnalyzeImpactExposure,
  type AnalyzeImportanceExposure,
  type AnalyzeIntelligenceProfile,
  type AnalyzeIntelligenceProfileBuildInput,
  type AnalyzeRiskExposure,
  type AnalyzeScenarioSummaryExposure,
  type AnalyzeTrendExposure,
} from "./analyzeIntelligenceProfileContract.ts";
import type { ExecutiveIntelligenceSnapshot } from "./executiveIntelligenceSnapshotContract.ts";

let latestAnalyzeIntelligenceProfile: AnalyzeIntelligenceProfile = EMPTY_ANALYZE_INTELLIGENCE_PROFILE;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
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

function buildHealthExposure(snapshot: ExecutiveIntelligenceSnapshot): AnalyzeHealthExposure {
  const objectAverageScore = snapshot.objectIntelligence.averageHealthScore;
  const kpiAverageScore = snapshot.kpiIntelligence.averageHealthScore;
  const score = average([objectAverageScore, kpiAverageScore]);
  return Object.freeze({
    score,
    summary: `Analyze health composite ${score} from object average ${objectAverageScore} and KPI average ${kpiAverageScore}.`,
    objectAverageScore,
    kpiAverageScore,
    contractReady: true,
  });
}

function buildImpactExposure(snapshot: ExecutiveIntelligenceSnapshot): AnalyzeImpactExposure {
  const objectAverageScore = snapshot.objectIntelligence.averageImpactScore;
  const kpiAverageScore = snapshot.kpiIntelligence.averageImpactScore;
  const score = average([objectAverageScore, kpiAverageScore]);
  return Object.freeze({
    score,
    summary: `Analyze impact composite ${score} from object average ${objectAverageScore} and KPI average ${kpiAverageScore}.`,
    objectAverageScore,
    kpiAverageScore,
    contractReady: true,
  });
}

function buildTrendExposure(snapshot: ExecutiveIntelligenceSnapshot): AnalyzeTrendExposure {
  const { improvingCount, stableCount, decliningCount, volatileCount } = snapshot.objectIntelligence;
  return Object.freeze({
    summary: `Object trend posture: ${improvingCount} improving, ${stableCount} stable, ${decliningCount} declining, ${volatileCount} volatile; KPI declining signals ${snapshot.kpiIntelligence.topDecliningKpis.length}.`,
    improvingCount,
    stableCount,
    decliningCount,
    volatileCount,
    topDecliningKpis: Object.freeze([...snapshot.kpiIntelligence.topDecliningKpis]),
    contractReady: true,
  });
}

function buildImportanceExposure(snapshot: ExecutiveIntelligenceSnapshot): AnalyzeImportanceExposure {
  const score = snapshot.objectIntelligence.averageImportanceScore;
  const recommendedAttentionCount = snapshot.objectIntelligence.recommendedAttention.length;
  return Object.freeze({
    score,
    summary: `Analyze importance score ${score} with ${recommendedAttentionCount} object attention recommendation(s).`,
    recommendedAttentionCount,
    contractReady: true,
  });
}

function buildRiskExposure(snapshot: ExecutiveIntelligenceSnapshot): AnalyzeRiskExposure {
  const score = clampScore(snapshot.riskIntelligence.propagationScore);
  return Object.freeze({
    score,
    summary: snapshot.riskIntelligence.executiveSummary,
    topRisks: Object.freeze([...snapshot.riskIntelligence.topRisks]),
    recommendedAttentionCount: snapshot.riskIntelligence.recommendedAttention.length,
    contractReady: true,
  });
}

function buildScenarioSummaryExposure(
  snapshot: ExecutiveIntelligenceSnapshot
): AnalyzeScenarioSummaryExposure {
  const recommendedSummary =
    snapshot.scenarioIntelligence.summaries.find(
      (entry) => entry.recommendedActions.length > 0
    ) ?? snapshot.scenarioIntelligence.summaries[0];

  return Object.freeze({
    summary: snapshot.scenarioIntelligence.executiveSummary,
    scenarioCount: snapshot.scenarioIntelligence.scenarioCount,
    recommendedScenarioId: recommendedSummary?.scenarioId ?? "",
    recommendedScenarioLabel: recommendedSummary?.label ?? "",
    contractReady: true,
  });
}

function buildConfidenceExposure(snapshot: ExecutiveIntelligenceSnapshot): AnalyzeConfidenceExposure {
  const objectAverageScore = snapshot.objectIntelligence.averageConfidenceScore;
  const kpiAverageScore = snapshot.kpiIntelligence.averageConfidenceScore;
  const score = average([objectAverageScore, kpiAverageScore]);
  return Object.freeze({
    score,
    summary: `Analyze confidence composite ${score} from object average ${objectAverageScore} and KPI average ${kpiAverageScore}.`,
    objectAverageScore,
    kpiAverageScore,
    contractReady: true,
  });
}

function buildAnalyzeSummary(
  health: AnalyzeHealthExposure,
  impact: AnalyzeImpactExposure,
  trend: AnalyzeTrendExposure,
  importance: AnalyzeImportanceExposure,
  risk: AnalyzeRiskExposure,
  scenarioSummary: AnalyzeScenarioSummaryExposure,
  confidence: AnalyzeConfidenceExposure
): string {
  return [
    "Analyze intelligence profile ready.",
    `Health ${health.score}, impact ${impact.score}, importance ${importance.score}, risk ${risk.score}, confidence ${confidence.score}.`,
    trend.summary,
    `Scenario summary covers ${scenarioSummary.scenarioCount} scenario(s); recommended ${scenarioSummary.recommendedScenarioLabel || "none"}.`,
  ].join(" ");
}

export function buildAnalyzeIntelligenceProfile(
  input: AnalyzeIntelligenceProfileBuildInput = {}
): AnalyzeIntelligenceProfile {
  const snapshot =
    input.snapshot ??
    buildExecutiveIntelligenceSnapshot({
      sceneJson: input.sceneJson,
      objects: input.objects,
      relationships: input.relationships,
      kpis: input.kpis,
      risks: input.risks,
      sceneObjects: input.sceneObjects,
      dataSourceObjects: input.dataSourceObjects,
      dataSourceKpis: input.dataSourceKpis,
      historicalSnapshots: input.historicalSnapshots,
      selectedObjectId: input.selectedObjectId,
    });

  if (!snapshotHasIntelligence(snapshot)) {
    latestAnalyzeIntelligenceProfile = EMPTY_ANALYZE_INTELLIGENCE_PROFILE;
    return latestAnalyzeIntelligenceProfile;
  }

  const health = buildHealthExposure(snapshot);
  const impact = buildImpactExposure(snapshot);
  const trend = buildTrendExposure(snapshot);
  const importance = buildImportanceExposure(snapshot);
  const risk = buildRiskExposure(snapshot);
  const scenarioSummary = buildScenarioSummaryExposure(snapshot);
  const confidence = buildConfidenceExposure(snapshot);

  const profile = Object.freeze({
    profileId: `analyze-intelligence:${snapshot.version}`,
    version: ANALYZE_INTELLIGENCE_PROFILE_VERSION,
    analyzeSummary: buildAnalyzeSummary(
      health,
      impact,
      trend,
      importance,
      risk,
      scenarioSummary,
      confidence
    ),
    health,
    impact,
    trend,
    importance,
    risk,
    scenarioSummary,
    confidence,
    snapshotVersion: snapshot.version,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    routingMutation: false as const,
    mrpMutation: false as const,
    simulationActive: false as const,
    uiRendering: false as const,
    diagnostics: ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTICS,
  });

  latestAnalyzeIntelligenceProfile = profile;
  return profile;
}

export function getAnalyzeIntelligenceProfile(): AnalyzeIntelligenceProfile {
  return latestAnalyzeIntelligenceProfile;
}

export function resetAnalyzeIntelligenceProfileForTests(): void {
  latestAnalyzeIntelligenceProfile = EMPTY_ANALYZE_INTELLIGENCE_PROFILE;
}

export const AnalyzeIntelligenceProfileRuntime = Object.freeze({
  buildAnalyzeIntelligenceProfile,
  getAnalyzeIntelligenceProfile,
  resetAnalyzeIntelligenceProfileForTests,
});
