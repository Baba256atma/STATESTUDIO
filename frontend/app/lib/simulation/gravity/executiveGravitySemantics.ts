/**
 * D7:2:8 — Executive-readable systemic risk gravity semantics.
 */

import type {
  EnterpriseRiskGravityState,
  ExecutiveGravitySemantics,
} from "./systemicRiskGravityTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveGravitySemantics(input: {
  state: EnterpriseRiskGravityState;
}): ExecutiveGravitySemantics {
  const topZone = input.state.gravityZones[0];
  const topAttractor = input.state.instabilityAttractors[0];
  const topConvergence = input.state.convergenceRecords[0];

  const headline = topZone && topZone.gravityLevel !== "low"
    ? topZone.gravityLevel === "critical"
      ? `Critical systemic risk gravity is intensifying around ${topZone.affectedRegionIds.map(regionLabel).join(" and ")} due to increasing operational imbalance.`
      : `Systemic risk gravity is intensifying around ${topZone.affectedRegionIds.map(regionLabel).join(" and ")} due to ${topZone.dominantGravityDrivers[0] ?? "dependency and fragility concentration"}.`
    : topAttractor
      ? topAttractor.reason
      : input.state.gravityRiskLabel === "contained"
        ? "Enterprise systemic risk gravity remains contained across the operational universe."
        : "Systemic risk gravity is elevated in parts of the enterprise operational structure.";

  const summaryParts: string[] = [];
  if (input.state.gravityRiskLabel === "contained") {
    summaryParts.push("Instability attractors remain limited with manageable collapse convergence pressure.");
  } else if (input.state.gravityRiskLabel === "elevated") {
    summaryParts.push("Gravitational pull is concentrating instability in interconnected operational regions.");
  } else {
    summaryParts.push("Multiple gravity zones are merging, escalating enterprise collapse convergence risk.");
  }
  summaryParts.push(
    `Systemic collapse pressure is ${(input.state.systemicCollapsePressure * 100).toFixed(0)}% with convergence at ${(input.state.gravityConvergenceScore * 100).toFixed(0)}%.`
  );

  const zoneSummaries = input.state.gravityZones.slice(0, 5).map((zone) => {
    const regions = zone.affectedRegionIds.map(regionLabel).join(" and ");
    const drivers = zone.dominantGravityDrivers.slice(0, 2).join(", ") || "operational stress";
    return `${regions} form a ${zone.gravityLevel} systemic risk gravity zone driven by ${drivers}.`;
  });

  const attractorSummaries = input.state.instabilityAttractors.map((a) => a.reason);

  const convergenceSummaries = input.state.convergenceRecords.slice(0, 4).map((r) => r.explanation);

  const bullets: string[] = [];
  if (topAttractor) bullets.push(topAttractor.reason);
  if (input.state.recoverySuppressionZones.length > 0) {
    bullets.push(
      `Recovery suppression zones: ${input.state.recoverySuppressionZones.map(regionLabel).join(", ")}.`
    );
  }
  if (topConvergence) bullets.push(topConvergence.explanation);

  return {
    headline,
    summary: summaryParts.join(" "),
    zoneSummaries,
    attractorSummaries,
    convergenceSummaries,
    bullets,
  };
}
