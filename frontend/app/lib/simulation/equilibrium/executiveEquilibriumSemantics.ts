/**
 * D7:2:7 — Executive-readable equilibrium semantics.
 */

import type {
  EnterpriseEquilibriumState,
  ExecutiveEquilibriumSemantics,
} from "./equilibriumTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveEquilibriumSemantics(input: {
  state: EnterpriseEquilibriumState;
}): ExecutiveEquilibriumSemantics {
  const stabilizing = input.state.driftRecords.filter((d) => d.driftDirection === "stabilization");
  const eroding = input.state.driftRecords.filter((d) => d.driftDirection === "erosion");
  const topErosion = eroding.sort((a, b) => b.driftMagnitude - a.driftMagnitude)[0];
  const topStability = stabilizing[0];
  const topImbalance = input.state.imbalanceZones[0];
  const topCross = input.state.crossDomainRecords[0];

  const headline =
    topStability && topErosion
      ? `Operational equilibrium is stabilizing in ${regionLabel(topStability.regionId)}, but ${regionLabel(topErosion.regionId)} imbalance continues to increase under recovery pressure.`
      : input.state.equilibriumLabel === "balanced"
        ? "Enterprise operational equilibrium remains within sustainable balance across the operational universe."
        : input.state.equilibriumLabel === "critical_imbalance"
          ? "Critical operational imbalance threatens systemic balance across interconnected regions."
          : input.state.equilibriumLabel === "recovering"
            ? "Operational equilibrium is recovering as pressure, recovery, and momentum realign."
            : topImbalance
              ? `${regionLabel(topImbalance)} shows strained operational balance requiring executive attention.`
              : "Operational equilibrium remains under strain across parts of the enterprise.";

  const summaryParts: string[] = [];
  if (input.state.equilibriumLabel === "balanced") {
    summaryParts.push("Recovery offsets fragility with manageable pressure and sustainable momentum.");
  } else if (input.state.equilibriumLabel === "recovering") {
    summaryParts.push("Balance is improving as stabilization gains velocity relative to degradation.");
  } else if (input.state.equilibriumLabel === "critical_imbalance") {
    summaryParts.push("Pressure, fragility, and momentum are misaligned, threatening systemic balance.");
  } else {
    summaryParts.push("Operational regions show uneven balance between recovery capacity and dependency pressure.");
  }
  summaryParts.push(
    `Equilibrium score is ${(input.state.equilibriumScore * 100).toFixed(0)}% with sustainability at ${(input.state.balanceSustainabilityScore * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeEquilibriumSignals.slice(0, 6).map((signal) => {
    const regions = signal.affectedRegionIds.map(regionLabel).join(" and ");
    return `${regions} operational balance is ${signal.equilibriumState}.`;
  });

  const driftSummaries = input.state.driftRecords.slice(0, 4).map((d) => d.explanation);

  const crossDomainSummaries = input.state.crossDomainRecords.slice(0, 4).map((r) => r.explanation);

  const bullets: string[] = [];
  if (topErosion) bullets.push(topErosion.explanation);
  if (input.state.overextendedRegions.length > 0) {
    bullets.push(
      `Overextended regions: ${input.state.overextendedRegions.map(regionLabel).join(", ")}.`
    );
  }
  if (topCross) bullets.push(topCross.explanation);

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    driftSummaries,
    crossDomainSummaries,
    bullets,
  };
}
