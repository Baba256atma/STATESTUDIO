/**
 * D7:4:2 — Executive-readable multi-future divergence semantics.
 */

import type {
  ExecutiveDivergenceSemantics,
  MultiFutureDivergenceState,
} from "./multiFutureDivergenceTypes.ts";
import { DIVERGENCE_UNCERTAINTY_DISCLAIMER } from "./divergenceGuards.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveDivergenceSemantics(input: {
  state: MultiFutureDivergenceState;
}): ExecutiveDivergenceSemantics {
  const pressureSeparation = input.state.strategicFutureSeparationRecords.find((r) =>
    r.recordId.includes("enterprise-pressure")
  );
  const topConvergence = input.state.divergenceConvergenceRecords[0];
  const logisticsConverging = input.state.convergingFutureZones.includes("logistics");
  const manufacturingFragmented = input.state.fragmentedFutureZones.includes("manufacturing");

  const headline =
    pressureSeparation
      ? "Operational futures are beginning to diverge between logistics stabilization and manufacturing degradation due to increasing dependency pressure and uneven recovery coordination."
      : logisticsConverging && manufacturingFragmented
        ? "Operational futures may diverge between logistics stabilization paths and manufacturing degradation futures under uneven recovery coordination."
        : topConvergence
          ? topConvergence.explanation
          : input.state.multiFutureDivergenceLabel === "fragmenting"
            ? "Multiple operational futures may fragment as instability separates recovery and degradation branches."
            : input.state.multiFutureDivergenceLabel === "converging"
              ? "Operational futures may converge toward shared stabilization paths where coordination and momentum align."
              : "Multi-future divergence patterns remain mixed across operational and human-system conditions.";

  const summaryParts: string[] = [];
  if (input.state.multiFutureDivergenceLabel === "converging") {
    summaryParts.push(
      "Future branches may converge where recovery coordination and stabilization momentum align."
    );
  } else if (input.state.multiFutureDivergenceLabel === "fragmenting") {
    summaryParts.push(
      "Future fragmentation may expand as degradation and volatile hybrid branches separate from recovery paths."
    );
  } else if (input.state.multiFutureDivergenceLabel === "volatile_split") {
    summaryParts.push(
      "Volatile future branching may increase where trust strain and partial stabilization interact."
    );
  } else {
    summaryParts.push(
      "Operational futures may remain in a stable split between stabilization and degradation branches."
    );
  }
  summaryParts.push(
    `Indicative future volatility is ${(input.state.futureVolatilityScore * 100).toFixed(0)}% with fragmentation at ${(input.state.futureFragmentationScore * 100).toFixed(0)}% and convergence at ${(input.state.futureConvergenceScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || DIVERGENCE_UNCERTAINTY_DISCLAIMER);

  const signalSummaries = input.state.activeDivergenceSignals.slice(0, 6).map((s) => {
    const drivers = (s.dominantDivergenceDrivers ?? []).join(", ") || "branch_separation";
    return `Branches ${s.futureBranchIds.join(" vs ")}: may show ${s.divergenceState} divergence (${drivers}, intensity ${(s.divergenceIntensity * 100).toFixed(0)}%).`;
  });

  const branchSummaries = input.state.futureBranches.slice(0, 5).map(
    (b) =>
      `${b.branchLabel} future (${b.branchId}): strength ${(b.branchStrength * 100).toFixed(0)}% — ${b.explanation}`
  );

  const convergenceSummaries = input.state.divergenceConvergenceRecords.map((r) => r.explanation);
  const separationSummaries = input.state.strategicFutureSeparationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.fragmentedFutureZones.length > 0) {
    bullets.push(
      `Fragmented future zones: ${input.state.fragmentedFutureZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.convergingFutureZones.length > 0) {
    bullets.push(
      `Converging future zones: ${input.state.convergingFutureZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    branchSummaries,
    convergenceSummaries,
    separationSummaries,
    bullets,
  };
}
