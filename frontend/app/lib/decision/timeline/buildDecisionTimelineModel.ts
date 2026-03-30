import type { DecisionExecutionResult } from "../../executive/decisionExecutionTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import { buildComparePanelModel } from "../recommendation/buildComparePanelModel";

export type DecisionTimelineImpactItem = {
  label: string;
  direction?: "up" | "down" | "neutral";
  value?: string;
};

export type DecisionTimelineStage = {
  id: "before" | "after" | "what_if";
  title: string;
  summary: string;
  details?: string[];
  impactItems?: DecisionTimelineImpactItem[];
  target_ids?: string[];
  recommendationLabel?: string | null;
  confidenceLevel?: "low" | "medium" | "high";
  isRecommendedPath?: boolean;
};

export type DecisionTimelineModel = {
  stages: DecisionTimelineStage[];
  hasPlayback: boolean;
  compareAvailable: boolean;
  playbackLabel?: string | null;
};

type BuildDecisionTimelineModelInput = {
  responseData?: any | null;
  strategicAdvice?: any | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const next = text(value);
    if (next) return next;
  }
  return "";
}

function formatSignedPercent(value: number) {
  if (!Number.isFinite(value)) return "";
  const scaled = Math.round(value * 100);
  return `${scaled > 0 ? "+" : ""}${scaled}%`;
}

function formatSignedValue(value: number) {
  if (!Number.isFinite(value)) return "";
  return `${value > 0 ? "+" : ""}${value}`;
}

function metricToneFromChange(value: number): "up" | "down" | "neutral" {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
}

function uniqueItems(values: Array<string | null | undefined>, limit = 4) {
  const seen = new Set<string>();
  const results: string[] = [];
  for (const value of values) {
    const next = text(value);
    if (!next || seen.has(next)) continue;
    seen.add(next);
    results.push(next);
    if (results.length >= limit) break;
  }
  return results;
}

export function buildDecisionTimelineModel(input: BuildDecisionTimelineModelInput): DecisionTimelineModel {
  const responseData = input.responseData ?? null;
  const strategicAdvice = input.strategicAdvice ?? responseData?.strategic_advice ?? null;
  const canonicalRecommendation = input.canonicalRecommendation ?? responseData?.canonical_recommendation ?? null;
  const decisionSimulation = responseData?.decision_simulation ?? null;
  const compareModel = buildComparePanelModel({
    canonicalRecommendation,
    decisionResult: input.decisionResult ?? null,
    strategicAdvice,
    responseData,
  });

  const beforeSummary = firstText(
    responseData?.executive_summary_surface?.happened,
    responseData?.analysis_summary,
    responseData?.risk_propagation?.summary,
    responseData?.executive_summary_surface?.summary,
    responseData?.reply,
    "No current-state summary available yet."
  );
  const beforeDetails = uniqueItems([
    responseData?.executive_summary_surface?.why_it_matters,
    responseData?.risk_propagation?.summary,
    responseData?.strategy_kpi?.summary,
    compareModel.riskSummary,
  ]);

  const beforeImpactItems: DecisionTimelineImpactItem[] = uniqueItems([
    text(responseData?.executive_summary_surface?.what_matters_most),
    text(responseData?.strategy_kpi?.headline),
    text(responseData?.strategy_kpi?.summary),
  ], 2).map((item) => ({
    label: "Current signal",
    direction: "neutral",
    value: item,
  }));

  const afterKpis = Array.isArray(input.decisionResult?.simulation_result?.kpi_effects)
    ? input.decisionResult?.simulation_result?.kpi_effects ?? []
    : [];
  const afterSummary = firstText(
    decisionSimulation?.impact?.summary,
    canonicalRecommendation?.primary.impact_summary,
    compareModel.recommendedOption?.impact_summary,
    "No projected outcome yet. Run a simulation to see the expected change."
  );
  const afterDetails = uniqueItems([
    canonicalRecommendation?.reasoning.why,
    responseData?.executive_summary_surface?.what_to_do,
    compareModel.compareSummary,
    decisionSimulation?.timeline?.[0]?.summary,
  ]);

  const afterImpactItems: DecisionTimelineImpactItem[] = [];
  if (Number.isFinite(input.decisionResult?.simulation_result?.impact_score)) {
    afterImpactItems.push({
      label: "Impact score",
      direction: "up",
      value: (input.decisionResult?.simulation_result?.impact_score ?? 0).toFixed(2),
    });
  }
  if (Number.isFinite(input.decisionResult?.simulation_result?.risk_change)) {
    const riskChange = input.decisionResult?.simulation_result?.risk_change ?? 0;
    afterImpactItems.push({
      label: "Risk change",
      direction: riskChange < 0 ? "down" : riskChange > 0 ? "up" : "neutral",
      value: formatSignedPercent(riskChange),
    });
  }
  for (const item of afterKpis.slice(0, 2)) {
    afterImpactItems.push({
      label: item.kpi,
      direction: metricToneFromChange(item.change),
      value: formatSignedValue(item.change),
    });
  }
  if (!afterImpactItems.length && canonicalRecommendation?.primary.impact_summary) {
    afterImpactItems.push({
      label: "Projected effect",
      direction: "up",
      value: canonicalRecommendation.primary.impact_summary,
    });
  }

  const recommendedTargets =
    canonicalRecommendation?.primary.target_ids ??
    input.decisionResult?.simulation_result?.affected_objects ??
    [];

  const alternative = compareModel.alternatives[0] ?? null;
  const comparison = Array.isArray(input.decisionResult?.comparison) ? input.decisionResult?.comparison : [];
  const alternativeScore = comparison.find((item) => text(item.option) === alternative?.title) ?? comparison[1] ?? null;
  const whatIfSummary = firstText(
    alternative?.impact_summary,
    alternative?.summary,
    responseData?.decision_comparison?.summary,
    responseData?.decision_replay?.alternative_summary,
    "No alternative path available yet. Use Compare Options to evaluate another move."
  );
  const whatIfDetails = uniqueItems([
    alternative?.tradeoff,
    compareModel.whyNotOthers[0],
    responseData?.decision_comparison?.tradeoff_summary,
    responseData?.decision_replay?.summary,
  ]);

  const whatIfImpactItems: DecisionTimelineImpactItem[] = [];
  if (alternativeScore) {
    whatIfImpactItems.push({
      label: "Option score",
      direction: Number(alternativeScore.score) >= 0.5 ? "neutral" : "down",
      value: Number(alternativeScore.score).toFixed(2),
    });
  }
  if (alternative?.tradeoff) {
    whatIfImpactItems.push({
      label: "Trade-off",
      direction: "neutral",
      value: alternative.tradeoff,
    });
  }
  if (alternative?.impact_summary && !whatIfImpactItems.length) {
    whatIfImpactItems.push({
      label: "Alternative effect",
      direction: "neutral",
      value: alternative.impact_summary,
    });
  }

  const stages: DecisionTimelineStage[] = [
    {
      id: "before",
      title: "Before",
      summary: beforeSummary,
      details: beforeDetails,
      impactItems: beforeImpactItems,
      recommendationLabel: "Current state",
      confidenceLevel: canonicalRecommendation?.confidence.level ?? "medium",
      isRecommendedPath: false,
    },
    {
      id: "after",
      title: "After",
      summary: afterSummary,
      details: afterDetails,
      impactItems: afterImpactItems,
      target_ids: recommendedTargets,
      recommendationLabel: canonicalRecommendation?.primary.action ?? compareModel.recommendedOption?.title ?? "Recommended move",
      confidenceLevel: canonicalRecommendation?.confidence.level ?? compareModel.recommendedOption?.confidence_level ?? "medium",
      isRecommendedPath: true,
    },
    {
      id: "what_if",
      title: "What-if",
      summary: whatIfSummary,
      details: whatIfDetails,
      impactItems: whatIfImpactItems,
      target_ids: alternative?.target_ids ?? [],
      recommendationLabel: alternative?.title ?? "Alternative path",
      confidenceLevel: alternative?.confidence_level ?? "medium",
      isRecommendedPath: false,
    },
  ];

  return {
    stages,
    hasPlayback: stages.length > 1,
    compareAvailable: Boolean(alternative || comparison.length > 1),
    playbackLabel: "Play story",
  };
}
