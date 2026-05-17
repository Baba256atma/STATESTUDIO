/**
 * D7:6:3 — Executive-readable cognitive load balancing semantics.
 */

import type {
  ExecutiveCognitiveLoadBalancingSemantics,
  ExecutiveCognitiveLoadBalancingState,
} from "./executiveCognitiveLoadTypes.ts";
import {
  LOAD_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_LOAD_DISCLAIMER,
} from "./cognitiveLoadBalancingGuards.ts";

export function buildExecutiveCognitiveLoadBalancingSemantics(input: {
  state: ExecutiveCognitiveLoadBalancingState;
}): ExecutiveCognitiveLoadBalancingSemantics {
  const fatigueRisk = input.state.overloadDistributionRecords.find((r) =>
    r.recordId.includes("cognitive-fatigue")
  );
  const urgencySaturation = input.state.signalDensityRecords.find((r) =>
    r.recordId.includes("urgency-saturation")
  );
  const topOverload = input.state.overloadDistributionRecords[0];

  const headline =
    input.state.executiveCognitiveLoadLabel === "overloaded" ||
    input.state.executiveCognitiveLoadLabel === "critical" ||
    input.state.executiveCognitiveLoadLabel === "dense"
      ? "Executive cognitive load has increased because predictive instability, governance volatility, and recovery-fragility escalation are simultaneously intensifying across logistics and manufacturing systems."
      : input.state.executiveCognitiveLoadLabel === "balanced"
        ? "Stable equilibrium recovery and reduced predictive volatility may support lower cognitive intensity across synchronized operational intelligence surfaces."
        : fatigueRisk
          ? fatigueRisk.explanation
          : urgencySaturation
            ? urgencySaturation.explanation
            : topOverload
              ? topOverload.explanation
              : "Executive cognitive load balancing remains under active assessment across strategic operational pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveCognitiveLoadLabel === "balanced") {
    summaryParts.push(
      "Balanced cognitive load may indicate manageable signal density with stable executive decision capacity."
    );
  } else if (input.state.executiveCognitiveLoadLabel === "elevated") {
    summaryParts.push(
      "Elevated cognitive load may reflect rising signal density that warrants attention sequencing without hidden steering."
    );
  } else if (input.state.executiveCognitiveLoadLabel === "dense") {
    summaryParts.push(
      "Dense cognitive load may indicate concentrated complexity across multiple intelligence layers."
    );
  } else if (input.state.executiveCognitiveLoadLabel === "overloaded") {
    summaryParts.push(
      "Overloaded cognitive load may require executive simplification when competing crises elevate simultaneously."
    );
  } else {
    summaryParts.push(
      "Critical cognitive load conditions may elevate decision degradation risk until balancing stabilizes."
    );
  }
  summaryParts.push(
    `Indicative cognitive balance is ${(input.state.cognitiveBalanceScore * 100).toFixed(0)}% with signal density at ${(input.state.signalDensityScore * 100).toFixed(0)}% and overload escalation at ${(input.state.overloadEscalationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.loadAmbiguityDisclaimer || LOAD_AMBIGUITY_DISCLAIMER);
  summaryParts.push(input.state.nonManipulationLoadDisclaimer || NON_MANIPULATION_LOAD_DISCLAIMER);

  const loadSummaries = input.state.activeLoadSignals.map((l) => {
    const drivers = (l.dominantLoadDrivers ?? []).join(", ") || "load_drivers";
    return `${l.loadId}: ${l.loadState} (${drivers}, strength ${(l.loadStrength * 100).toFixed(0)}%).`;
  });

  const densitySummaries = input.state.signalDensityRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const overloadSummaries = input.state.overloadDistributionRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.overloadZones.length > 0) {
    bullets.push(`Overload zones: ${input.state.overloadZones.join(", ")}.`);
  }
  if (input.state.stabilizedAttentionZones.length > 0) {
    bullets.push(
      `Stabilized attention zones: ${input.state.stabilizedAttentionZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora balances cognitive load for executive support; workload decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    loadSummaries: Object.freeze(loadSummaries),
    densitySummaries: Object.freeze(densitySummaries),
    overloadSummaries: Object.freeze(overloadSummaries),
    bullets: Object.freeze(bullets),
  });
}
