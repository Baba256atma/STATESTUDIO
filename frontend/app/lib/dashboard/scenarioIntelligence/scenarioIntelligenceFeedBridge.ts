import { buildScenarioIntelligenceFeed } from "../../intelligence-integration/ScenarioIntelligenceFeed.ts";
import type { ScenarioIntelligenceFeedBuildInput } from "../../intelligence-integration/scenarioIntelligenceFeedContract.ts";
import type { ScenarioIntelligenceFeedView } from "../../intelligence-integration/scenarioIntelligenceFeedContract.ts";
import type {
  ExpectedImpactLevel,
  ScenarioConfidenceLevel,
  ScenarioId,
  ScenarioIntelligenceSurfaceModel,
} from "./scenarioIntelligenceContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type ScenarioIntelligenceFeedAttachInput = ScenarioIntelligenceFeedBuildInput;

export type ScenarioIntelligenceSurfaceModelWithFeed = ScenarioIntelligenceSurfaceModel &
  Readonly<{
    intelligenceFeed: ScenarioIntelligenceFeedView | null;
  }>;

const SCENARIO_IDS: readonly ScenarioId[] = Object.freeze([
  "scenario_a",
  "scenario_b",
  "scenario_c",
  "additional",
]);

function confidenceLevelFromScore(score: number): ScenarioConfidenceLevel {
  if (score >= 70) return "high";
  if (score >= 45) return "moderate";
  return "low";
}

function confidenceLabel(level: ScenarioConfidenceLevel): string {
  if (level === "high") return "High Confidence";
  if (level === "moderate") return "Moderate Confidence";
  return "Low Confidence";
}

function impactLevelFromScore(score: number): ExpectedImpactLevel {
  if (score >= 80) return "transformational";
  if (score >= 60) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

function impactLabel(level: ExpectedImpactLevel): string {
  if (level === "transformational") return "Transformational Impact";
  if (level === "high") return "High Impact";
  if (level === "moderate") return "Moderate Impact";
  return "Low Impact";
}

function trendFromScores(scores: readonly number[]): ImpactDirection {
  if (scores.length < 2) return "stable";
  const delta = scores[0]! - scores[scores.length - 1]!;
  if (delta > 8) return "improving";
  if (delta < -8) return "deteriorating";
  return "stable";
}

function enrichSnapshot(
  model: ScenarioIntelligenceSurfaceModel,
  feed: ScenarioIntelligenceFeedView
): ScenarioIntelligenceSurfaceModel["snapshot"] {
  const { scenarioIntelligence } = feed;
  const summaries = [...scenarioIntelligence.summaries].sort(
    (left, right) =>
      right.impactAggregation.compositeImpactScore - left.impactAggregation.compositeImpactScore
  );
  const scores = summaries.map((summary) => summary.impactAggregation.compositeImpactScore);
  const averageComposite =
    scores.length > 0 ? scores.reduce((total, score) => total + score, 0) / scores.length : 0;
  const confidenceLevel = confidenceLevelFromScore(averageComposite);
  const impactLevel = impactLevelFromScore(averageComposite);
  const topSummary = summaries[0];
  const secondSummary = summaries[1];

  const portfolioScenarios = summaries.slice(0, 4).map((summary, index) =>
    Object.freeze({
      id: SCENARIO_IDS[index] ?? "additional",
      label: summary.label,
      summary: feed.scenarioSummaries.secondaryValue,
      score: Math.round(summary.impactAggregation.compositeImpactScore),
      active: index === 0,
    })
  );

  return Object.freeze({
    portfolio: Object.freeze({
      activeCount: portfolioScenarios.filter((entry) => entry.active).length,
      totalCount: summaries.length,
      scenarios: Object.freeze(portfolioScenarios),
      comparisonEntryPoint: feed.scenarioComparisonSummaries.primaryValue,
    }),
    confidence: Object.freeze({
      level: confidenceLevel,
      label: confidenceLabel(confidenceLevel),
      trend: trendFromScores(scores),
      summary: feed.scenarioConfidence.primaryValue,
    }),
    expectedImpact: Object.freeze({
      level: impactLevel,
      label: impactLabel(impactLevel),
      trend: trendFromScores(scores),
      summary: feed.scenarioRecommendations.primaryValue,
    }),
    tradeoffs: Object.freeze({
      tradeoffs: Object.freeze([
        Object.freeze({
          axis: "risk_vs_reward" as const,
          label: "Scenario Comparison",
          indicator: feed.scenarioComparisonSummaries.primaryValue,
          summary: feed.scenarioComparisonSummaries.secondaryValue,
        }),
      ]),
      summary: feed.scenarioComparisonSummaries.secondaryValue,
    }),
    investigationPaths: Object.freeze({
      paths: Object.freeze(
        summaries.slice(0, 2).map((summary, index) =>
          Object.freeze({
            kind: "review_assumptions" as const,
            label: summary.label,
            priority: index === 0 ? ("high" as const) : ("moderate" as const),
          })
        )
      ),
      summary: feed.scenarioSummaries.secondaryValue,
    }),
    comparisonContract: Object.freeze({
      comparisonId: "ds7-scenario-comparison",
      mode: summaries.length >= 3 ? "triple" : "pair",
      scenarioIds: Object.freeze(
        portfolioScenarios.map((entry) => entry.id).slice(0, summaries.length >= 3 ? 3 : 2)
      ),
      summary: feed.scenarioComparisonSummaries.primaryValue,
      preferredScenarioId: topSummary ? portfolioScenarios[0]?.id ?? null : null,
    }),
    warRoomEscalation: Object.freeze({
      ...model.snapshot.warRoomEscalation,
      summary: secondSummary
        ? `Preferred ${topSummary?.label ?? "scenario"} over ${secondSummary.label}`
        : model.snapshot.warRoomEscalation.summary,
    }),
  });
}

export function attachScenarioIntelligenceFeed(
  model: ScenarioIntelligenceSurfaceModel,
  input: ScenarioIntelligenceFeedAttachInput = {}
): ScenarioIntelligenceSurfaceModelWithFeed {
  const feed = buildScenarioIntelligenceFeed(input);

  if (feed.feedStatus !== "bound") {
    return Object.freeze({
      ...model,
      intelligenceFeed: null,
    });
  }

  return Object.freeze({
    ...model,
    snapshot: enrichSnapshot(model, feed),
    intelligenceFeed: feed,
  });
}
