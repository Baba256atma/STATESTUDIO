import { buildExecutiveIntelligenceSnapshot } from "../intelligence/ExecutiveIntelligenceAdapter.ts";
import {
  buildAnalyzeIntelligenceProfile as buildCanonicalAnalyzeIntelligenceProfile,
  resetAnalyzeIntelligenceProfileForTests as resetCanonicalAnalyzeIntelligenceProfileForTests,
} from "../intelligence/AnalyzeIntelligenceProfile.ts";
import { buildExecutiveIntelligenceAdapterRegistry } from "./ExecutiveIntelligenceAdapter.ts";
import {
  EMPTY_ANALYZE_INTELLIGENCE_PROFILE,
  type AnalyzeIntelligenceProfile,
  type AnalyzeIntelligenceProfileBuildInput,
} from "./analyzeIntelligenceProfileContract.ts";

let latestAnalyzeIntelligenceProfile: AnalyzeIntelligenceProfile = EMPTY_ANALYZE_INTELLIGENCE_PROFILE;

function snapshotFromAdapter(
  input: AnalyzeIntelligenceProfileBuildInput,
  adapter: NonNullable<AnalyzeIntelligenceProfileBuildInput["adapterRegistry"]>
) {
  return buildExecutiveIntelligenceSnapshot({
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
    objectIntelligence: adapter.objectIntelligence,
    relationshipIntelligence: adapter.relationshipIntelligence,
    kpiIntelligence: adapter.kpiIntelligence,
    riskIntelligence: adapter.riskIntelligence,
    scenarioIntelligence: adapter.scenarioIntelligence,
  });
}

export function buildAnalyzeIntelligenceProfile(
  input: AnalyzeIntelligenceProfileBuildInput = {}
): AnalyzeIntelligenceProfile {
  const adapter =
    input.adapterRegistry ??
    buildExecutiveIntelligenceAdapterRegistry({
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

  if (adapter.layerCount === 0) {
    latestAnalyzeIntelligenceProfile = EMPTY_ANALYZE_INTELLIGENCE_PROFILE;
    return latestAnalyzeIntelligenceProfile;
  }

  const snapshot = input.snapshot ?? snapshotFromAdapter(input, adapter);
  const profile = buildCanonicalAnalyzeIntelligenceProfile({ snapshot });
  const recommendation = adapter.scenarioRecommendation.profile;

  const enrichedProfile = Object.freeze({
    ...profile,
    scenarioSummary: Object.freeze({
      ...profile.scenarioSummary,
      recommendedScenarioId:
        recommendation.recommendedScenarioId || profile.scenarioSummary.recommendedScenarioId,
      recommendedScenarioLabel:
        recommendation.recommendedScenarioLabel || profile.scenarioSummary.recommendedScenarioLabel,
      comparisonPairCount: adapter.scenarioComparison.pairCount,
      confidence: recommendation.confidence,
    }),
    adapterVersion: adapter.version,
  });

  latestAnalyzeIntelligenceProfile = enrichedProfile;
  return enrichedProfile;
}

export function getAnalyzeIntelligenceProfile(): AnalyzeIntelligenceProfile {
  return latestAnalyzeIntelligenceProfile;
}

export function resetAnalyzeIntelligenceProfileForTests(): void {
  resetCanonicalAnalyzeIntelligenceProfileForTests();
  latestAnalyzeIntelligenceProfile = EMPTY_ANALYZE_INTELLIGENCE_PROFILE;
}

export const AnalyzeIntelligenceProfileRuntime = Object.freeze({
  buildAnalyzeIntelligenceProfile,
  getAnalyzeIntelligenceProfile,
  resetAnalyzeIntelligenceProfileForTests,
});
