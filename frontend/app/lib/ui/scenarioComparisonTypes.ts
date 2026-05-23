/** E2:14 — Executive scenario comparison contracts. */
// D4 Decision recommendation engine
// D6 Simulation execution
// D7 Advisory reasoning
// D8 Strategic memory
// D9 Executive governance review

import type { ScenarioSuggestion } from "./scenarioSuggestionTypes";

export type ScenarioRiskChange = "lower" | "same" | "higher";
export type ScenarioCostLevel = "low" | "medium" | "high";
export type ScenarioSpeedLevel = "slow" | "medium" | "fast";
export type ScenarioRecommendationLevel = "recommended" | "acceptable" | "risky";

export type ScenarioComparisonOption = {
  id: string;
  title: string;
  confidence?: number;
  expectedFrsiImpact?: number;
  riskChange?: ScenarioRiskChange;
  costLevel?: ScenarioCostLevel;
  speed?: ScenarioSpeedLevel;
  recommendationLevel?: ScenarioRecommendationLevel;
};

export type ExecutiveDecisionEvaluationSummary = {
  bestOptionId: string;
  bestOptionTitle: string;
  whyItMatters: string;
  tradeoff: string;
  nextSuggestedAction: string;
};

export type ExecutiveScenarioComparisonModel = {
  options: ScenarioComparisonOption[];
  focusScenarioIds: string[];
  summary: ExecutiveDecisionEvaluationSummary;
};

export function formatScenarioRiskChange(value: ScenarioRiskChange | undefined): string {
  if (value === "lower") return "Lower";
  if (value === "higher") return "Higher";
  return "Same";
}

export function formatScenarioCostLevel(value: ScenarioCostLevel | undefined): string {
  if (value === "low") return "Low";
  if (value === "high") return "High";
  return "Medium";
}

export function formatScenarioSpeedLevel(value: ScenarioSpeedLevel | undefined): string {
  if (value === "slow") return "Slow";
  if (value === "fast") return "Fast";
  return "Medium";
}

export function formatScenarioRecommendationLevel(value: ScenarioRecommendationLevel | undefined): string {
  if (value === "recommended") return "Recommended";
  if (value === "risky") return "Risky";
  return "Acceptable";
}

export type { ScenarioSuggestion };
