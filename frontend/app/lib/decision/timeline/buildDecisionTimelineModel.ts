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
  responseData?: Record<string, unknown> | null;
  strategicAdvice?: Record<string, unknown> | null;
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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readCanonicalRecommendation(value: unknown): CanonicalRecommendation | null {
  return value && typeof value === "object" ? (value as CanonicalRecommendation) : null;
}

export function buildDecisionTimelineModel(input: BuildDecisionTimelineModelInput): DecisionTimelineModel {
  const responseData = input.responseData ?? null;
  const strategicAdvice = asRecord(input.strategicAdvice) ?? asRecord(responseData?.strategic_advice);
  const canonicalRecommendation =
    input.canonicalRecommendation ?? readCanonicalRecommendation(responseData?.canonical_recommendation);
  const decisionSimulation = asRecord(responseData?.decision_simulation);
  const executiveSummary = asRecord(responseData?.executive_summary_surface);
  const riskPropagation = asRecord(responseData?.risk_propagation);
  const strategyKpi = asRecord(responseData?.strategy_kpi);
  const decisionComparison = asRecord(responseData?.decision_comparison);
  const decisionReplay = asRecord(responseData?.decision_replay);
  const simulationResult = asRecord(input.decisionResult?.simulation_result);
  const simulationImpact = asRecord(decisionSimulation?.impact);
  const compareModel = buildComparePanelModel({
    canonicalRecommendation,
    decisionResult: input.decisionResult ?? null,
    strategicAdvice,
    responseData,
  });

  const beforeSummary = firstText(
    text(executiveSummary?.happened),
    text(responseData?.analysis_summary),
    text(riskPropagation?.summary),
    text(executiveSummary?.summary),
    text(responseData?.reply),
    "No current-state summary available yet."
  );
  const beforeDetails = uniqueItems([
    text(executiveSummary?.why_it_matters),
    text(riskPropagation?.summary),
    text(strategyKpi?.summary),
    compareModel.riskSummary,
  ]);

  const beforeImpactItems: DecisionTimelineImpactItem[] = uniqueItems([
    text(executiveSummary?.what_matters_most),
    text(strategyKpi?.headline),
    text(strategyKpi?.summary),
  ], 2).map((item) => ({
    label: "Current signal",
    direction: "neutral",
    value: item,
  }));

  const afterKpis = Array.isArray(simulationResult?.kpi_effects)
    ? (simulationResult.kpi_effects as Array<{ kpi: string; change: number }>)
    : [];
  const afterSummary = firstText(
    text(simulationImpact?.summary),
    canonicalRecommendation?.primary.impact_summary,
    compareModel.recommendedOption?.impact_summary,
    "No projected outcome yet. Run a simulation to see the expected change."
  );
  const afterDetails = uniqueItems([
    canonicalRecommendation?.reasoning.why,
    text(executiveSummary?.what_to_do),
    compareModel.compareSummary,
    Array.isArray(decisionSimulation?.timeline)
      ? text(asRecord((decisionSimulation.timeline as unknown[])[0])?.summary)
      : null,
  ]);

  const afterImpactItems: DecisionTimelineImpactItem[] = [];
  if (Number.isFinite(simulationResult?.impact_score as number)) {
    afterImpactItems.push({
      label: "Impact score",
      direction: "up",
      value: Number(simulationResult?.impact_score ?? 0).toFixed(2),
    });
  }
  if (Number.isFinite(simulationResult?.risk_change as number)) {
    const riskChange = Number(simulationResult?.risk_change ?? 0);
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
    (Array.isArray(simulationResult?.affected_objects)
      ? (simulationResult.affected_objects as string[])
      : []);

  const alternative = compareModel.alternatives[0] ?? null;
  const comparison = Array.isArray(input.decisionResult?.comparison)
    ? (input.decisionResult.comparison as Array<{ option?: string; score?: number }>)
    : [];
  const alternativeScore = comparison.find((item) => text(item.option) === alternative?.title) ?? comparison[1] ?? null;
  const whatIfSummary = firstText(
    alternative?.impact_summary,
    alternative?.summary,
    text(decisionComparison?.summary),
    text(decisionReplay?.alternative_summary),
    "No alternative path available yet. Use Compare Options to evaluate another move."
  );
  const whatIfDetails = uniqueItems([
    alternative?.tradeoff,
    compareModel.whyNotOthers[0],
    text(decisionComparison?.tradeoff_summary),
    text(decisionReplay?.summary),
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
