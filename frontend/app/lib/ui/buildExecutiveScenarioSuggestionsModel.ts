import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import {
  buildDefaultExecutiveScenarioSuggestionsModel,
  type ExecutiveScenarioSuggestionsModel,
  type ScenarioImpactIndicators,
  type ScenarioSuggestion,
  type ScenarioSuggestionStatus,
} from "./scenarioSuggestionTypes";

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "scenario";
}

function toPercentScore(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  if (value <= 1) return Math.round(Math.max(0, Math.min(100, value * 100)));
  return Math.round(Math.max(0, Math.min(100, value)));
}

function estimateImpactFromText(text: string | undefined, index: number): number {
  const normalized = String(text ?? "").toLowerCase();
  if (normalized.includes("high") || normalized.includes("critical")) return -22 - index * 2;
  if (normalized.includes("moderate") || normalized.includes("medium")) return -14 - index * 2;
  if (normalized.includes("low") || normalized.includes("minor")) return -8 - index;
  return -16 - index * 3;
}

function buildIndicators(confidence: number, impact: number, riskReduction: number): ScenarioImpactIndicators {
  return {
    risk: Math.max(0, Math.min(100, 100 - riskReduction)),
    cost: Math.max(0, Math.min(100, 48 + Math.round(Math.abs(impact) * 0.6))),
    stability: Math.max(0, Math.min(100, 52 + riskReduction)),
    flow: Math.max(0, Math.min(100, confidence - 8)),
    confidence,
  };
}

function mapRecommendationEntry(
  action: string,
  status: ScenarioSuggestionStatus,
  confidenceScore: number,
  description: string | undefined,
  index: number
): ScenarioSuggestion {
  const confidence = toPercentScore(confidenceScore, 64 - index * 3);
  const impact = estimateImpactFromText(description, index);
  const riskReduction = Math.max(6, Math.min(30, Math.round(Math.abs(impact) * 0.85)));
  return {
    id: `scenario:${slugify(action)}`,
    title: action,
    confidence,
    impact,
    riskReduction,
    status,
    description:
      description?.trim() ||
      "Executive alternative derived from current recommendation intelligence.",
    indicators: buildIndicators(confidence, impact, riskReduction),
  };
}

/** Maps canonical recommendation alternatives into executive scenario cards, with demo fallback. */
export function buildExecutiveScenarioSuggestionsModel(
  recommendation: CanonicalRecommendation | null | undefined
): ExecutiveScenarioSuggestionsModel {
  if (!recommendation?.primary?.action) {
    return buildDefaultExecutiveScenarioSuggestionsModel();
  }

  const confidenceScore = recommendation.confidence?.score ?? 0.64;
  const scenarios: ScenarioSuggestion[] = [
    mapRecommendationEntry(
      recommendation.primary.action,
      "recommended",
      confidenceScore + 0.06,
      recommendation.primary.impact_summary ?? recommendation.reasoning?.why,
      0
    ),
    ...recommendation.alternatives.slice(0, 5).map((alt, index) =>
      mapRecommendationEntry(
        alt.action,
        "candidate",
        confidenceScore - 0.04 * (index + 1),
        alt.impact_summary ?? alt.tradeoff ?? recommendation.reasoning?.why,
        index + 1
      )
    ),
  ];

  const unique = new Map<string, ScenarioSuggestion>();
  for (const scenario of scenarios) {
    if (!unique.has(scenario.id)) unique.set(scenario.id, scenario);
  }

  const merged = [...unique.values()];
  if (merged.length < 3) {
    for (const fallback of buildDefaultExecutiveScenarioSuggestionsModel().scenarios) {
      if (merged.length >= 6) break;
      if (!merged.some((entry) => entry.title === fallback.title)) {
        merged.push(fallback);
      }
    }
  }

  return {
    scenarios: merged.slice(0, 6),
    compareReady: merged.length >= 2,
  };
}
