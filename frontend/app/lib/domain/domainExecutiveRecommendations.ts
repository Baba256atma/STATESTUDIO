import type { DomainScenario } from "./domainScenarioTypes.ts";
import type { DomainScenarioScore } from "./domainScenarioScoring.ts";
import type { DomainExecutiveInsight, ExecutiveDecisionPosture } from "./domainExecutiveIntelligence.ts";

function scoreFor(scores: DomainScenarioScore[] | undefined, scenario: DomainScenario): number {
  return scores?.find((score) => score.scenarioId === scenario.id)?.overallScore ?? Math.round(scenario.confidence * 100);
}

export function buildExecutiveScenarioRecommendation(params: {
  scenarios: DomainScenario[];
  scores?: DomainScenarioScore[];
}): {
  recommendedScenarioId?: string;
  explanation: string;
} {
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios : [];
  if (scenarios.length === 0) {
    return {
      explanation: "No domain scenarios are available yet; add more structure or risk signals before choosing a path.",
    };
  }

  const ranked = [...scenarios].sort((left, right) => {
    const scoreDelta = scoreFor(params.scores, right) - scoreFor(params.scores, left);
    if (scoreDelta !== 0) return scoreDelta;
    return left.id.localeCompare(right.id);
  });
  const top = ranked[0];
  const topScore = scoreFor(params.scores, top);
  const confidenceLine =
    top.confidence >= 0.72 ? "Confidence is strong enough for executive review." :
      top.confidence >= 0.5 ? "Confidence is moderate; validate assumptions before committing." :
        "Confidence is limited; use this as a monitoring path, not a commitment.";

  return {
    recommendedScenarioId: top.id,
    explanation: `${top.title} is the leading scenario with score ${topScore}/100. ${confidenceLine}`,
  };
}

function postureWeight(posture: ExecutiveDecisionPosture): number {
  if (posture === "critical") return 5;
  if (posture === "fragile") return 4;
  if (posture === "cautious") return 3;
  if (posture === "watch") return 2;
  return 1;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function buildExecutiveRecommendations(params: {
  insights: DomainExecutiveInsight[];
}): {
  headline: string;
  topRecommendations: string[];
  posture: ExecutiveDecisionPosture;
  confidence: number;
  explanation: string;
} {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  if (!insights.length) {
    return {
      headline: "No executive recommendation available yet",
      topRecommendations: ["Add domain structure or risk signals before choosing a strategic move"],
      posture: "watch",
      confidence: 0.35,
      explanation: "There are no synthesized executive insights to prioritize.",
    };
  }

  const ranked = [...insights].sort((left, right) => {
    const postureDelta = postureWeight(right.posture) - postureWeight(left.posture);
    if (postureDelta !== 0) return postureDelta;
    const confidenceDelta = right.confidence - left.confidence;
    if (confidenceDelta !== 0) return confidenceDelta;
    return left.id.localeCompare(right.id);
  });
  const top = ranked[0];
  const topRecommendations = Array.from(new Set(ranked.flatMap((insight) => insight.recommendedActions))).slice(0, 3);
  const confidence = clamp01(
    ranked.reduce((sum, insight) => sum + insight.confidence, 0) / Math.max(1, ranked.length)
  );

  return {
    headline: top.title,
    topRecommendations: topRecommendations.length ? topRecommendations : ["Continue monitoring until stronger signals appear"],
    posture: top.posture,
    confidence: Number(confidence.toFixed(2)),
    explanation: `${top.summary} ${top.explanation}`,
  };
}
