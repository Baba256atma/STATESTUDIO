import { buildExecutiveScenarioSummary } from "../scenario-intelligence/ExecutiveScenarioSummary.ts";
import { buildScenarioComparisonFoundationRegistry } from "../scenario-intelligence/ScenarioComparisonFoundation.ts";
import { buildScenarioRecommendationRegistry } from "../scenario-intelligence/ScenarioRecommendationEngine.ts";
import { buildScenarioRegistry } from "../scenario-intelligence/ScenarioGenerationRuntime.ts";
import {
  EMPTY_SCENARIO_EXPLANATION_REGISTRY,
  SCENARIO_EXPLANATION_ENGINE_DIAGNOSTICS,
  SCENARIO_EXPLANATION_ENGINE_VERSION,
  type ExecutiveScenarioExplanation,
  type ScenarioExplanationEngineBuildInput,
  type ScenarioExplanationRegistry,
} from "./scenarioExplanationEngineContract.ts";
import type { ExecutiveScenarioSummaryProfile } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import type { ScenarioComparisonFoundationRegistry } from "../scenario-intelligence/scenarioComparisonFoundationContract.ts";
import type { ScenarioRecommendationRegistry } from "../scenario-intelligence/scenarioRecommendationContract.ts";

let latestScenarioExplanationRegistry: ScenarioExplanationRegistry =
  EMPTY_SCENARIO_EXPLANATION_REGISTRY;

function collectBuildInput(input: ScenarioExplanationEngineBuildInput) {
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
    scenarioIds: input.scenarioIds,
  });
}

function summaryExplanation(profile: ExecutiveScenarioSummaryProfile): string {
  const { impactAggregation } = profile;
  return `${profile.label} (${profile.scenarioType}) summary: composite impact score ${impactAggregation.compositeImpactScore} across ${impactAggregation.objectImpactCount} object(s), ${impactAggregation.relationshipImpactCount} relationship(s), ${impactAggregation.kpiImpactCount} KPI(s), and ${impactAggregation.riskImpactCount} risk node(s).`;
}

function comparisonExplanation(
  scenarioId: string,
  comparisonFoundation: ScenarioComparisonFoundationRegistry
): string | null {
  const relatedPairs = comparisonFoundation.pairs.filter(
    (pair) => pair.leftScenarioId === scenarioId || pair.rightScenarioId === scenarioId
  );
  if (relatedPairs.length === 0) return null;

  return relatedPairs
    .slice(0, 2)
    .map((pair) => {
      const role =
        pair.leftScenarioId === scenarioId
          ? `${pair.leftLabel} vs ${pair.rightLabel}`
          : `${pair.rightLabel} vs ${pair.leftLabel}`;
      return `Comparison ${role}: net delta ${pair.netDelta} across ${pair.differenceCount} difference profile(s).`;
    })
    .join(" ");
}

function recommendationExplanation(
  scenarioId: string,
  recommendationRegistry: ScenarioRecommendationRegistry
): string | null {
  const { profile } = recommendationRegistry;
  if (profile.scenarioResultCount === 0) return null;

  if (profile.recommendedScenarioId === scenarioId) {
    const reasons = profile.supportingReasons
      .slice(0, 2)
      .map((reason) => reason.detail)
      .join(" ");
    return `${profile.recommendedScenarioLabel} is the recommended scenario with confidence ${profile.confidence} (${profile.confidenceLevel}). ${reasons}`.trim();
  }

  const candidate = profile.candidateScores.find((entry) => entry.scenarioId === scenarioId);
  if (!candidate) return null;
  return `${candidate.label} ranks #${candidate.rank} with recommendation score ${candidate.recommendationScore}.`;
}

function confidenceExplanation(
  scenarioId: string,
  recommendationRegistry: ScenarioRecommendationRegistry,
  scenarioConfidence: number | null
): string {
  if (recommendationRegistry.profile.recommendedScenarioId === scenarioId) {
    return `Scenario confidence is ${recommendationRegistry.profile.confidence} (${recommendationRegistry.profile.confidenceLevel}) from recommendation intelligence.`;
  }
  if (scenarioConfidence != null) {
    const level =
      scenarioConfidence >= 70 ? "high" : scenarioConfidence >= 45 ? "moderate" : "low";
    return `Scenario confidence is ${scenarioConfidence} (${level}) from scenario impact evaluation.`;
  }
  return "Scenario confidence intelligence is not available.";
}

function scenarioStrengths(profile: ExecutiveScenarioSummaryProfile): string {
  if (profile.strengths.length === 0) {
    return `${profile.label}: no dominant scenario strengths detected.`;
  }
  return profile.strengths
    .slice(0, 3)
    .map((item) => `Strength: ${item.label} — ${item.detail}`)
    .join(" ");
}

function scenarioWeaknesses(profile: ExecutiveScenarioSummaryProfile): string {
  if (profile.weaknesses.length === 0) {
    return `${profile.label}: no dominant scenario weaknesses detected.`;
  }
  return profile.weaknesses
    .slice(0, 3)
    .map((item) => `Weakness: ${item.label} — ${item.detail}`)
    .join(" ");
}

function scenarioRecommendations(profile: ExecutiveScenarioSummaryProfile): string {
  if (profile.recommendedActions.length === 0) {
    return `${profile.label}: monitor scenario posture.`;
  }
  return profile.recommendedActions
    .slice(0, 3)
    .map((action) => `Recommendation (${action.priority}): ${action.label} — ${action.reason}`)
    .join(" ");
}

function buildExecutiveSummary(
  explanation: Omit<ExecutiveScenarioExplanation, "executiveSummary">
): string {
  return [
    explanation.summaryExplanation,
    explanation.comparisonExplanation,
    explanation.recommendationExplanation,
    explanation.confidenceExplanation,
    explanation.scenarioStrengths,
    explanation.scenarioWeaknesses,
    explanation.scenarioRecommendations,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildExplanation(
  profile: ExecutiveScenarioSummaryProfile,
  comparisonFoundation: ScenarioComparisonFoundationRegistry,
  recommendationRegistry: ScenarioRecommendationRegistry,
  scenarioConfidence: number | null
): ExecutiveScenarioExplanation {
  const partial = Object.freeze({
    scenarioId: profile.scenarioId,
    label: profile.label,
    scenarioType: profile.scenarioType,
    summaryExplanation: summaryExplanation(profile),
    comparisonExplanation: comparisonExplanation(profile.scenarioId, comparisonFoundation),
    recommendationExplanation: recommendationExplanation(profile.scenarioId, recommendationRegistry),
    confidenceExplanation: confidenceExplanation(
      profile.scenarioId,
      recommendationRegistry,
      scenarioConfidence
    ),
    scenarioStrengths: scenarioStrengths(profile),
    scenarioWeaknesses: scenarioWeaknesses(profile),
    scenarioRecommendations: scenarioRecommendations(profile),
    executiveSummary: "",
  });

  return Object.freeze({
    ...partial,
    executiveSummary: buildExecutiveSummary(partial),
  });
}

function buildRegistrySummary(
  explanations: readonly ExecutiveScenarioExplanation[],
  scenarioIntelligence: ReturnType<typeof buildExecutiveScenarioSummary>
): string {
  return [
    "Executive scenario explanations ready for Assistant surfaces.",
    `${explanations.length} scenario explanation(s) generated from template-driven DS-7 intelligence.`,
    scenarioIntelligence.executiveSummary,
  ].join(" ");
}

export function buildScenarioExplanationRegistry(
  input: ScenarioExplanationEngineBuildInput = {}
): ScenarioExplanationRegistry {
  const buildInput = collectBuildInput(input);
  const scenarioIntelligence =
    input.scenarioIntelligence ?? buildExecutiveScenarioSummary(buildInput);
  const comparisonFoundation =
    input.comparisonFoundation ??
    buildScenarioComparisonFoundationRegistry(
      Object.freeze({
        ...buildInput,
        executiveScenarioSummary: scenarioIntelligence,
      })
    );
  const recommendationRegistry =
    input.recommendationRegistry ??
    buildScenarioRecommendationRegistry(
      Object.freeze({
        ...buildInput,
        executiveScenarioSummary: scenarioIntelligence,
      })
    );
  const scenarioRegistry = buildScenarioRegistry(buildInput);

  if (scenarioIntelligence.scenarioCount === 0 || scenarioIntelligence.summaries.length === 0) {
    latestScenarioExplanationRegistry = EMPTY_SCENARIO_EXPLANATION_REGISTRY;
    return latestScenarioExplanationRegistry;
  }

  const explanations = Object.freeze(
    scenarioIntelligence.summaries.map((profile) => {
      const result = scenarioRegistry.resultById[profile.scenarioId];
      const scenarioConfidence = result?.impact.confidence ?? null;
      return buildExplanation(
        profile,
        comparisonFoundation,
        recommendationRegistry,
        scenarioConfidence
      );
    })
  );

  const registry = Object.freeze({
    version: SCENARIO_EXPLANATION_ENGINE_VERSION,
    explanationCount: explanations.length,
    explanations,
    executiveSummary: buildRegistrySummary(explanations, scenarioIntelligence),
    scenarioIntelligence,
    comparisonFoundation,
    recommendationRegistry,
    explanationReady: true as const,
    readOnly: true as const,
    simulationActive: false as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: SCENARIO_EXPLANATION_ENGINE_DIAGNOSTICS,
  });

  latestScenarioExplanationRegistry = registry;
  return registry;
}

export function getScenarioExplanationRegistry(): ScenarioExplanationRegistry {
  return latestScenarioExplanationRegistry;
}

export function resetScenarioExplanationEngineForTests(): void {
  latestScenarioExplanationRegistry = EMPTY_SCENARIO_EXPLANATION_REGISTRY;
}

export const ScenarioExplanationEngine = Object.freeze({
  buildScenarioExplanationRegistry,
  getScenarioExplanationRegistry,
  resetScenarioExplanationEngineForTests,
});
