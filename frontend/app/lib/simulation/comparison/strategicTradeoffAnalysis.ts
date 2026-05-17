/**
 * D7:1:6 — Strategic tradeoff analysis (deterministic, explainable).
 */

import type { ScenarioComparisonMetrics } from "./scenarioComparisonTypes.ts";
import type { ScenarioMetricProfile } from "./scenarioMetricsExtractor.ts";
import type { StrategicTradeoff } from "./scenarioComparisonTypes.ts";
import { logComparisonDev } from "./comparisonDevLog.ts";

function delta(left: number, right: number): number {
  return Number((right - left).toFixed(4));
}

function winner(
  baselineValue: number,
  comparisonValue: number,
  higherIsBetter: boolean
): "baseline" | "comparison" | "neutral" {
  const diff = comparisonValue - baselineValue;
  if (Math.abs(diff) < 0.03) return "neutral";
  if (higherIsBetter) return diff > 0 ? "comparison" : "baseline";
  return diff < 0 ? "comparison" : "baseline";
}

export function buildScenarioComparisonMetrics(
  baseline: ScenarioMetricProfile,
  comparison: ScenarioMetricProfile
): ScenarioComparisonMetrics {
  return {
    fragilityDelta: delta(baseline.fragility, comparison.fragility),
    operationalLoadDelta: delta(baseline.operationalLoad, comparison.operationalLoad),
    recoveryPotentialDelta: delta(baseline.recoveryPotential, comparison.recoveryPotential),
    confidenceDelta: delta(baseline.confidence, comparison.confidence),
    propagationRiskDelta: delta(baseline.propagationRisk, comparison.propagationRisk),
  };
}

export function analyzeStrategicTradeoffs(input: {
  metrics: ScenarioComparisonMetrics;
  baseline: ScenarioMetricProfile;
  comparison: ScenarioMetricProfile;
}): StrategicTradeoff[] {
  const tradeoffs: StrategicTradeoff[] = [];

  const stabilityWinner = winner(
    input.baseline.fragility + input.baseline.propagationRisk,
    input.comparison.fragility + input.comparison.propagationRisk,
    false
  );
  tradeoffs.push({
    dimension: "stability",
    improvedIn: stabilityWinner,
    worsenedIn:
      stabilityWinner === "baseline"
        ? "comparison"
        : stabilityWinner === "comparison"
          ? "baseline"
          : "neutral",
    summary:
      stabilityWinner === "comparison"
        ? "Comparison path shows lower combined fragility and propagation risk."
        : stabilityWinner === "baseline"
          ? "Baseline path remains more stable under current conditions."
          : "Stability posture is broadly equivalent between paths.",
  });

  const efficiencyWinner = winner(input.baseline.operationalLoad, input.comparison.operationalLoad, false);
  tradeoffs.push({
    dimension: "efficiency",
    improvedIn: efficiencyWinner,
    worsenedIn: efficiencyWinner === "baseline" ? "comparison" : efficiencyWinner === "comparison" ? "baseline" : "neutral",
    summary:
      efficiencyWinner === "comparison"
        ? "Comparison path carries lower operational load pressure."
        : efficiencyWinner === "baseline"
          ? "Baseline path is more operationally efficient today."
          : "Operational efficiency is similar across both futures.",
  });

  const riskWinner = winner(input.baseline.fragility, input.comparison.fragility, false);
  tradeoffs.push({
    dimension: "risk_exposure",
    improvedIn: riskWinner,
    worsenedIn: riskWinner === "baseline" ? "comparison" : riskWinner === "comparison" ? "baseline" : "neutral",
    summary:
      input.metrics.fragilityDelta > 0.1
        ? "Comparison path increases systemic fragility exposure."
        : input.metrics.fragilityDelta < -0.1
          ? "Comparison path materially reduces fragility exposure."
          : "Risk exposure remains comparable between paths.",
  });

  const recoveryWinner = winner(
    input.baseline.recoveryPotential,
    input.comparison.recoveryPotential,
    true
  );
  tradeoffs.push({
    dimension: "resilience",
    improvedIn: recoveryWinner,
    worsenedIn:
      recoveryWinner === "baseline"
        ? "comparison"
        : recoveryWinner === "comparison"
          ? "baseline"
          : "neutral",
    summary:
      recoveryWinner === "comparison"
        ? "Comparison path offers stronger recovery potential."
        : recoveryWinner === "baseline"
          ? "Baseline path preserves better recovery headroom."
          : "Recovery potential is balanced across both futures.",
  });

  const speedProxy = winner(input.baseline.operationalLoad, input.comparison.operationalLoad, true);
  tradeoffs.push({
    dimension: "speed",
    improvedIn: speedProxy === "comparison" ? "comparison" : speedProxy === "baseline" ? "baseline" : "neutral",
    worsenedIn: speedProxy === "comparison" ? "baseline" : speedProxy === "baseline" ? "comparison" : "neutral",
    summary:
      speedProxy === "comparison"
        ? "Comparison path favors faster operational velocity (higher load tolerance)."
        : speedProxy === "baseline"
          ? "Baseline path favors measured pace over acceleration."
          : "Expansion velocity is comparable.",
  });

  logComparisonDev("TradeoffAnalysis", {
    tradeoffCount: tradeoffs.length,
    fragilityDelta: input.metrics.fragilityDelta,
    recoveryDelta: input.metrics.recoveryPotentialDelta,
  });

  return tradeoffs.sort((a, b) => a.dimension.localeCompare(b.dimension));
}
