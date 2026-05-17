/**
 * D7:1:6 — Executive-readable comparison narratives.
 */

import type {
  ExecutiveComparisonNarrative,
  ScenarioComparisonMetrics,
  ScenarioDeltaAnalysis,
  StrategicTradeoff,
} from "./scenarioComparisonTypes.ts";
import type { ScenarioMetricProfile } from "./scenarioMetricsExtractor.ts";

function pickWinner(
  baselineScore: number,
  comparisonScore: number,
  higherIsBetter: boolean
): "baseline" | "comparison" | "equivalent" {
  const diff = comparisonScore - baselineScore;
  if (Math.abs(diff) < 0.03) return "equivalent";
  if (higherIsBetter) return diff > 0 ? "comparison" : "baseline";
  return diff < 0 ? "comparison" : "baseline";
}

export function buildExecutiveComparisonNarrative(input: {
  baselineScenarioId: string;
  comparisonScenarioId: string;
  baselineLabel?: string;
  comparisonLabel?: string;
  metrics: ScenarioComparisonMetrics;
  delta: ScenarioDeltaAnalysis;
  tradeoffs: readonly StrategicTradeoff[];
  baselineProfile: ScenarioMetricProfile;
  comparisonProfile: ScenarioMetricProfile;
}): ExecutiveComparisonNarrative {
  const baseLabel = input.baselineLabel ?? input.baselineScenarioId;
  const cmpLabel = input.comparisonLabel ?? input.comparisonScenarioId;

  const saferPath = pickWinner(
    input.baselineProfile.fragility + input.baselineProfile.propagationRisk,
    input.comparisonProfile.fragility + input.comparisonProfile.propagationRisk,
    false
  );
  const riskierPath = pickWinner(
    input.baselineProfile.fragility,
    input.comparisonProfile.fragility,
    true
  );
  const stabilityWinner = pickWinner(
    input.baselineProfile.fragility + input.baselineProfile.operationalLoad,
    input.comparisonProfile.fragility + input.comparisonProfile.operationalLoad,
    false
  );
  const recoveryWinner = pickWinner(
    input.baselineProfile.recoveryPotential,
    input.comparisonProfile.recoveryPotential,
    true
  );

  const stabilityTradeoff = input.tradeoffs.find((t) => t.dimension === "stability");
  const recoveryTradeoff = input.tradeoffs.find((t) => t.dimension === "resilience");

  const headline =
    saferPath === "comparison"
      ? `${cmpLabel} presents a safer operational posture than ${baseLabel}.`
      : saferPath === "baseline"
        ? `${baseLabel} remains the safer operational path versus ${cmpLabel}.`
        : `${baseLabel} and ${cmpLabel} carry similar operational risk posture.`;

  const summaryParts: string[] = [];
  if (input.metrics.fragilityDelta > 0.08) {
    summaryParts.push(`${cmpLabel} increases operational fragility versus ${baseLabel}.`);
  } else if (input.metrics.fragilityDelta < -0.08) {
    summaryParts.push(`${cmpLabel} reduces operational fragility versus ${baseLabel}.`);
  }
  if (recoveryTradeoff?.improvedIn === "comparison") {
    summaryParts.push(`${cmpLabel} improves recovery potential but may trade off near-term velocity.`);
  } else if (recoveryTradeoff?.improvedIn === "baseline") {
    summaryParts.push(`${baseLabel} preserves stronger recovery headroom.`);
  }
  if (stabilityTradeoff?.summary) summaryParts.push(stabilityTradeoff.summary);

  const bullets: string[] = [];
  if (input.delta.riskEscalations.length > 0) {
    bullets.push(
      `Risk escalations concentrate on: ${input.delta.riskEscalations.slice(0, 4).join(", ")}.`
    );
  }
  if (input.delta.recoveryDifferences.length > 0) {
    bullets.push(
      `Recovery signals improve for: ${input.delta.recoveryDifferences.slice(0, 4).join(", ")}.`
    );
  }
  if (input.delta.propagationPathChanges.length > 0) {
    bullets.push("Downstream propagation paths diverge materially between scenarios.");
  }
  if (input.metrics.confidenceDelta < -0.05) {
    bullets.push(`${cmpLabel} erodes decision confidence under stress.`);
  } else if (input.metrics.confidenceDelta > 0.05) {
    bullets.push(`${cmpLabel} strengthens decision confidence.`);
  }

  return {
    headline,
    summary: summaryParts.join(" ") || "Operational futures diverge modestly at the comparison tick.",
    saferPath,
    riskierPath,
    stabilityWinner,
    recoveryWinner,
    bullets,
  };
}
