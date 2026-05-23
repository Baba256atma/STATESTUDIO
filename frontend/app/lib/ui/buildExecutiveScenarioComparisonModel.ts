import type {
  ExecutiveDecisionEvaluationSummary,
  ExecutiveScenarioComparisonModel,
  ScenarioComparisonOption,
  ScenarioCostLevel,
  ScenarioRecommendationLevel,
  ScenarioRiskChange,
  ScenarioSpeedLevel,
} from "./scenarioComparisonTypes";
import type { ScenarioSuggestion } from "./scenarioSuggestionTypes";

function toCostLevel(value: number | undefined): ScenarioCostLevel {
  if (typeof value !== "number" || !Number.isFinite(value)) return "medium";
  if (value < 42) return "low";
  if (value > 55) return "high";
  return "medium";
}

function toSpeedLevel(flow: number | undefined, stability: number | undefined): ScenarioSpeedLevel {
  const score = typeof flow === "number" ? flow : typeof stability === "number" ? stability : 50;
  if (score >= 62) return "fast";
  if (score <= 48) return "slow";
  return "medium";
}

function toRiskChange(riskReduction: number | undefined, impact: number | undefined): ScenarioRiskChange {
  if (typeof riskReduction === "number") {
    if (riskReduction >= 18) return "lower";
    if (riskReduction <= 8) return "higher";
    return "same";
  }
  if (typeof impact === "number" && impact <= -18) return "lower";
  if (typeof impact === "number" && impact >= -8) return "higher";
  return "same";
}

function toRecommendationLevel(scenario: ScenarioSuggestion): ScenarioRecommendationLevel {
  if (scenario.status === "recommended") return "recommended";
  const confidence = scenario.confidence ?? 0;
  if (confidence >= 68) return "acceptable";
  if (confidence < 58) return "risky";
  return "acceptable";
}

export function mapScenarioSuggestionToComparisonOption(
  scenario: ScenarioSuggestion
): ScenarioComparisonOption {
  return {
    id: scenario.id,
    title: scenario.title,
    confidence: scenario.confidence,
    expectedFrsiImpact: scenario.impact,
    riskChange: toRiskChange(scenario.riskReduction, scenario.impact),
    costLevel: toCostLevel(scenario.indicators?.cost),
    speed: toSpeedLevel(scenario.indicators?.flow, scenario.indicators?.stability),
    recommendationLevel: toRecommendationLevel(scenario),
  };
}

function rankScenario(scenario: ScenarioSuggestion): number {
  const confidence = scenario.confidence ?? 0;
  const impact = Math.abs(scenario.impact ?? 0);
  const recommendedBoost = scenario.status === "recommended" ? 12 : 0;
  const riskBoost = scenario.riskReduction ?? 0;
  return confidence * 0.55 + impact * 1.4 + recommendedBoost + riskBoost * 0.35;
}

function buildTradeoff(option: ScenarioComparisonOption, scenario: ScenarioSuggestion | undefined): string {
  const cost = option.costLevel ?? "medium";
  const speed = option.speed ?? "medium";
  const costLabel = cost === "low" ? "Lower cost" : cost === "high" ? "Higher cost" : "Medium cost";
  const speedLabel = speed === "fast" ? "faster execution" : speed === "slow" ? "slower execution" : "moderate execution pace";
  if (scenario?.description?.includes("tradeoff") || scenario?.description?.includes("cost")) {
    return `${costLabel} with ${speedLabel}.`;
  }
  return `${costLabel} and ${speedLabel}.`;
}

function buildSummary(
  options: ScenarioComparisonOption[],
  scenarios: ScenarioSuggestion[]
): ExecutiveDecisionEvaluationSummary {
  const ranked = [...scenarios].sort((a, b) => rankScenario(b) - rankScenario(a));
  const bestScenario = ranked[0] ?? scenarios[0];
  const bestOption =
    options.find((entry) => entry.id === bestScenario?.id) ??
    options[0] ?? {
      id: "unknown",
      title: "No scenario available",
    };

  const whyItMatters =
    bestScenario?.description?.trim() ||
    "It offers the strongest balance of confidence, fragility reduction, and operational stability.";

  return {
    bestOptionId: bestOption.id,
    bestOptionTitle: bestOption.title,
    whyItMatters,
    tradeoff: buildTradeoff(bestOption, bestScenario),
    nextSuggestedAction: `Simulate ${bestOption.title} before accepting.`,
  };
}

/** Maps scenario suggestions into a compact executive comparison workspace model. */
export function buildExecutiveScenarioComparisonModel(input: {
  scenarios: ScenarioSuggestion[];
  selectedScenarioId?: string | null;
  focusScenarioIds?: string[];
  maxOptions?: number;
}): ExecutiveScenarioComparisonModel {
  const maxOptions = input.maxOptions ?? 4;
  const ranked = [...input.scenarios].sort((a, b) => rankScenario(b) - rankScenario(a));
  const focusSet = new Set(
    (input.focusScenarioIds ?? [])
      .concat(input.selectedScenarioId ? [input.selectedScenarioId] : [])
      .filter(Boolean)
  );

  let compared = ranked;
  if (focusSet.size >= 2) {
    compared = ranked.filter((scenario) => focusSet.has(scenario.id));
    if (compared.length < 2) {
      compared = ranked.slice(0, maxOptions);
    }
  } else {
    compared = ranked.slice(0, maxOptions);
  }

  const options = compared.map(mapScenarioSuggestionToComparisonOption);
  const focusScenarioIds =
    focusSet.size >= 2 ? [...focusSet].filter((id) => options.some((option) => option.id === id)) : options.map((o) => o.id);

  return {
    options,
    focusScenarioIds,
    summary: buildSummary(options, compared),
  };
}
