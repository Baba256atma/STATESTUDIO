/**
 * D7:5:4 — Executive-readable multi-strategy comparison semantics.
 */

import type {
  ExecutiveMultiStrategyComparisonSemantics,
  ExecutiveMultiStrategyState,
} from "./multiStrategyComparisonTypes.ts";
import {
  COMPARISON_UNCERTAINTY_DISCLAIMER,
  NON_RANKING_DISCLAIMER,
} from "./comparisonGuards.ts";

export function buildExecutiveMultiStrategyComparisonSemantics(input: {
  state: ExecutiveMultiStrategyState;
}): ExecutiveMultiStrategyComparisonSemantics {
  const strategyA = input.state.activeStrategyComparisons.find((s) => s.strategyId === "strategy-a");
  const strategyB = input.state.activeStrategyComparisons.find((s) => s.strategyId === "strategy-b");
  const strategyC = input.state.activeStrategyComparisons.find((s) => s.strategyId === "strategy-c");
  const stabilizationVsAdaptive = input.state.strategyDivergenceComparisonRecords.find((r) =>
    r.recordId.includes("stabilization-vs-adaptive")
  );
  const topPathway = input.state.strategyPathwayRecords[0];

  const headline =
    strategyA && strategyB
      ? "Strategy A provides stronger short-term stabilization across logistics recovery systems, while Strategy B increases long-term adaptive resilience but introduces higher near-term coordination volatility."
      : stabilizationVsAdaptive
        ? stabilizationVsAdaptive.explanation
        : strategyC
          ? "Strategy C offers balanced coordination optimization with moderate resilience and flexibility relative to more specialized pathways."
          : topPathway
            ? topPathway.explanation
            : input.state.executiveComparisonLabel === "fragmented"
              ? "Competing strategic pathways may diverge substantially across operational futures under fragmented conditions."
              : input.state.executiveComparisonLabel === "convergent"
                ? "Multiple strategic pathways may converge toward similar stabilization outcomes under current evidence."
                : "Multi-strategy comparison remains under active assessment across competing executive pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveComparisonLabel === "fragmented") {
    summaryParts.push(
      "Fragmented pathway comparison suggests strategies may lead to materially different operational futures."
    );
  } else if (input.state.executiveComparisonLabel === "volatile") {
    summaryParts.push(
      "Volatile pathway differences may widen as predictive and operational conditions shift."
    );
  } else if (input.state.executiveComparisonLabel === "convergent") {
    summaryParts.push(
      "Convergent pathways may exhibit similar high-level outcomes although local tradeoffs still differ."
    );
  } else if (input.state.executiveComparisonLabel === "balanced") {
    summaryParts.push(
      "Balanced pathway comparison suggests no single strategy dominates all dimensions without tradeoffs."
    );
  } else {
    summaryParts.push(
      "Divergent pathways highlight meaningful differences in resilience, risk, and recovery balance."
    );
  }
  summaryParts.push(
    `Indicative comparison stability is ${(input.state.comparisonStabilityScore * 100).toFixed(0)}% with pathway divergence at ${(input.state.pathwayDivergenceScore * 100).toFixed(0)}% and resilience-risk asymmetry at ${(input.state.resilienceRiskAsymmetryScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || COMPARISON_UNCERTAINTY_DISCLAIMER);
  summaryParts.push(input.state.nonRankingDisclaimer || NON_RANKING_DISCLAIMER);

  const strategySummaries = input.state.activeStrategyComparisons.map((s) => {
    const drivers = (s.dominantComparisonDrivers ?? []).join(", ") || "pathway_drivers";
    return `${s.strategyLabel}: ${s.comparisonState} profile (${drivers}, strength ${(s.comparisonStrength * 100).toFixed(0)}%).`;
  });

  const pathwaySummaries = input.state.strategyPathwayRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const divergenceSummaries = input.state.strategyDivergenceComparisonRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.balancedStrategyZones.length > 0) {
    bullets.push(`Balanced strategy zones: ${input.state.balancedStrategyZones.join(", ")}.`);
  }
  if (input.state.divergenceStrategyZones.length > 0) {
    bullets.push(`Divergence strategy zones: ${input.state.divergenceStrategyZones.join(", ")}.`);
  }
  bullets.push("Nexora compares pathways side by side without ranking or mandating a final strategy.");

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    strategySummaries: Object.freeze(strategySummaries),
    pathwaySummaries: Object.freeze(pathwaySummaries),
    divergenceSummaries: Object.freeze(divergenceSummaries),
    bullets: Object.freeze(bullets),
  });
}
