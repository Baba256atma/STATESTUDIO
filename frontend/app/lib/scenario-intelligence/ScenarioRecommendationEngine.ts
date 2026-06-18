import { buildExecutiveScenarioSummary } from "./ExecutiveScenarioSummary.ts";
import { buildScenarioRegistry } from "./ScenarioGenerationRuntime.ts";
import {
  EMPTY_SCENARIO_RECOMMENDATION_REGISTRY,
  SCENARIO_RECOMMENDATION_DIAGNOSTICS,
  SCENARIO_RECOMMENDATION_ENGINE_VERSION,
  type ScenarioRecommendationBuildInput,
  type ScenarioRecommendationCandidateScore,
  type ScenarioRecommendationConfidenceLevel,
  type ScenarioRecommendationProfile,
  type ScenarioRecommendationReasonKind,
  type ScenarioRecommendationRegistry,
  type ScenarioRecommendationSupportingReason,
} from "./scenarioRecommendationContract.ts";
import type { ExecutiveScenarioSummaryProfile } from "./executiveScenarioSummaryContract.ts";
import type { ScenarioResult, ScenarioType } from "./scenarioGenerationContract.ts";

let latestScenarioRecommendationRegistry: ScenarioRecommendationRegistry =
  EMPTY_SCENARIO_RECOMMENDATION_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function collectBuildInput(input: ScenarioRecommendationBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    risks: input.risks,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    scenarioIds: input.scenarioIds,
  });
}

function typePreferenceBonus(scenarioType: ScenarioType): number {
  if (scenarioType === "opportunity") return 20;
  if (scenarioType === "alternative") return 15;
  if (scenarioType === "baseline") return 5;
  return -25;
}

function severityContribution(scenarioType: ScenarioType, severity: number): number {
  if (scenarioType === "risk") return clampScore(100 - severity);
  return clampScore(100 - severity * 0.5);
}

function confidenceLevelForScore(confidence: number): ScenarioRecommendationConfidenceLevel {
  if (confidence >= 70) return "high";
  if (confidence >= 45) return "moderate";
  return "low";
}

function executiveContribution(
  scenarioType: ScenarioType,
  executiveProfile: ExecutiveScenarioSummaryProfile | undefined
): number {
  if (!executiveProfile) return 0;
  const { impactAggregation, opportunities, threats, strengths, weaknesses } = executiveProfile;
  const swotBalance =
    opportunities.length * 6 +
    strengths.length * 4 -
    threats.length * 8 -
    weaknesses.length * 3;
  const composite =
    scenarioType === "risk"
      ? clampScore(100 - impactAggregation.compositeImpactScore)
      : impactAggregation.compositeImpactScore;
  return clampScore(composite * 0.45 + swotBalance);
}

function recommendationScoreForResult(
  result: ScenarioResult,
  executiveProfile: ExecutiveScenarioSummaryProfile | undefined
): number {
  const { impact, scenarioType } = result;
  return clampScore(
    typePreferenceBonus(scenarioType) +
      impact.confidence * 0.35 +
      severityContribution(scenarioType, impact.severity) * 0.25 +
      executiveContribution(scenarioType, executiveProfile)
  );
}

function supportingReason(
  recommendationId: string,
  kind: ScenarioRecommendationReasonKind,
  label: string,
  detail: string,
  weight: number
): ScenarioRecommendationSupportingReason {
  return Object.freeze({
    reasonId: `${recommendationId}:reason:${kind}`,
    kind,
    label,
    detail,
    weight: clampScore(weight),
  });
}

function buildSupportingReasons(
  recommendationId: string,
  result: ScenarioResult,
  executiveProfile: ExecutiveScenarioSummaryProfile | undefined,
  runnerUp: ScenarioRecommendationCandidateScore | undefined,
  margin: number
): readonly ScenarioRecommendationSupportingReason[] {
  const reasons: ScenarioRecommendationSupportingReason[] = [];

  reasons.push(
    supportingReason(
      recommendationId,
      "scenario_result",
      "Scenario evaluation ready",
      result.summary,
      20
    )
  );

  reasons.push(
    supportingReason(
      recommendationId,
      "impact_confidence",
      "Impact confidence signal",
      `${result.label} reports impact confidence ${result.impact.confidence} with severity ${result.impact.severity}.`,
      result.impact.confidence
    )
  );

  if (executiveProfile) {
    reasons.push(
      supportingReason(
        recommendationId,
        "composite_impact",
        "Composite impact posture",
        `Executive composite impact score is ${executiveProfile.impactAggregation.compositeImpactScore} across object, relationship, KPI, and risk simulations.`,
        executiveProfile.impactAggregation.compositeImpactScore
      )
    );

    if (executiveProfile.opportunities.length > 0) {
      const topOpportunity = [...executiveProfile.opportunities].sort(
        (left, right) => right.score - left.score
      )[0];
      reasons.push(
        supportingReason(
          recommendationId,
          "opportunity_signal",
          "Opportunity signal",
          topOpportunity?.detail ?? "Opportunity signals detected in executive scenario summary.",
          topOpportunity?.score ?? 40
        )
      );
    }

    if (executiveProfile.threats.length > 0 && result.scenarioType !== "opportunity") {
      const topThreat = [...executiveProfile.threats].sort(
        (left, right) => right.score - left.score
      )[0];
      reasons.push(
        supportingReason(
          recommendationId,
          "threat_posture",
          "Threat posture considered",
          topThreat?.detail ?? "Threat posture evaluated against alternative scenario paths.",
          clampScore(100 - (topThreat?.score ?? 50))
        )
      );
    }
  }

  if (runnerUp && margin > 0) {
    reasons.push(
      supportingReason(
        recommendationId,
        "comparative_advantage",
        "Comparative advantage",
        `${result.label} outranks ${runnerUp.label} by ${margin} recommendation points.`,
        clampScore(margin + 30)
      )
    );
  }

  return Object.freeze(
    [...reasons].sort((left, right) => right.weight - left.weight).slice(0, 6)
  );
}

function buildConfidence(
  winner: ScenarioResult,
  margin: number,
  reasonCount: number
): number {
  return clampScore(
    winner.impact.confidence * 0.5 + margin * 0.35 + reasonCount * 4 + 10
  );
}

function buildRecommendationProfile(
  results: readonly ScenarioResult[],
  executiveSummary: ReturnType<typeof buildExecutiveScenarioSummary>
): ScenarioRecommendationProfile {
  if (results.length === 0) {
    return EMPTY_SCENARIO_RECOMMENDATION_REGISTRY.profile;
  }

  const scored = results
    .map((result) => {
      const executiveProfile = executiveSummary.summaryByScenarioId[result.scenarioId];
      return Object.freeze({
        result,
        score: recommendationScoreForResult(result, executiveProfile),
      });
    })
    .sort((left, right) => right.score - left.score);

  const winner = scored[0];
  const runnerUp = scored[1];
  const margin = runnerUp ? winner.score - runnerUp.score : winner.score;

  const candidateScores = Object.freeze(
    scored.map((entry, index) =>
      Object.freeze({
        scenarioId: entry.result.scenarioId,
        scenarioType: entry.result.scenarioType,
        label: entry.result.label,
        recommendationScore: entry.score,
        rank: index + 1,
      })
    )
  );

  const recommendationId = `scenario-recommendation:${winner.result.scenarioId}`;
  const executiveProfile = executiveSummary.summaryByScenarioId[winner.result.scenarioId];
  const supportingReasons = buildSupportingReasons(
    recommendationId,
    winner.result,
    executiveProfile,
    candidateScores[1],
    margin
  );
  const confidence = buildConfidence(winner.result, margin, supportingReasons.length);

  return Object.freeze({
    recommendationId,
    recommendedScenarioId: winner.result.scenarioId,
    recommendedScenarioType: winner.result.scenarioType,
    recommendedScenarioLabel: winner.result.label,
    recommendedScenarioResult: winner.result,
    supportingReasons,
    confidence,
    confidenceLevel: confidenceLevelForScore(confidence),
    candidateScores,
    scenarioResultCount: results.length,
    recommendationReady: true,
    readOnly: true,
  });
}

export function buildScenarioRecommendationRegistry(
  input: ScenarioRecommendationBuildInput = {}
): ScenarioRecommendationRegistry {
  const buildInput = collectBuildInput(input);
  const scenarioRegistry = input.scenarioRegistry ?? buildScenarioRegistry(buildInput);
  const executiveScenarioSummary =
    input.executiveScenarioSummary ??
    buildExecutiveScenarioSummary(
      Object.freeze({
        ...buildInput,
        historicalSnapshots: input.historicalSnapshots,
      })
    );

  const scenarioResults =
    input.scenarioResults ??
    (input.scenarioIds
      ? scenarioRegistry.results.filter((result) =>
          input.scenarioIds?.includes(result.scenarioId)
        )
      : scenarioRegistry.results);

  if (scenarioResults.length === 0) {
    latestScenarioRecommendationRegistry = EMPTY_SCENARIO_RECOMMENDATION_REGISTRY;
    return latestScenarioRecommendationRegistry;
  }

  const profile = buildRecommendationProfile(scenarioResults, executiveScenarioSummary);

  const registry = Object.freeze({
    version: SCENARIO_RECOMMENDATION_ENGINE_VERSION,
    profile,
    scenarioResults: Object.freeze([...scenarioResults]),
    scenarioRegistry,
    executiveScenarioSummary,
    recommendationReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    simulationActive: false as const,
    diagnostics: SCENARIO_RECOMMENDATION_DIAGNOSTICS,
  });

  latestScenarioRecommendationRegistry = registry;
  return registry;
}

export function getScenarioRecommendationRegistry(): ScenarioRecommendationRegistry {
  return latestScenarioRecommendationRegistry;
}

export function resetScenarioRecommendationEngineForTests(): void {
  latestScenarioRecommendationRegistry = EMPTY_SCENARIO_RECOMMENDATION_REGISTRY;
}

export const ScenarioRecommendationEngine = Object.freeze({
  buildScenarioRecommendationRegistry,
  getScenarioRecommendationRegistry,
  resetScenarioRecommendationEngineForTests,
});
