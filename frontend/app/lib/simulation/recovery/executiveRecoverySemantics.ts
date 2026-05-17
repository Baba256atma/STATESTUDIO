/**
 * D7:2:5 — Executive-readable recovery capacity semantics.
 */

import type {
  ExecutiveRecoverySemantics,
  OrganizationalRecoveryState,
} from "./recoveryCapacityTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveRecoverySemantics(input: {
  state: OrganizationalRecoveryState;
}): ExecutiveRecoverySemantics {
  const topBottleneck = input.state.recoveryBottlenecks[0];
  const topZone = input.state.recoveryZones[0];
  const stabilizationRecords = input.state.propagationRecords.filter(
    (r) => r.propagationOutcome === "stabilization"
  );
  const strainRecords = input.state.propagationRecords.filter(
    (r) => r.propagationOutcome === "strain"
  );

  const headline = topBottleneck
    ? topBottleneck.reason
    : topZone && topZone.recoveryCapacity === "strong"
      ? `Operational recovery capacity remains ${topZone.recoveryCapacity} across ${topZone.affectedRegionIds.map(regionLabel).join(" and ")}.`
      : input.state.resilienceLabel === "robust"
        ? "Enterprise recovery capacity supports controlled stabilization across the operational universe."
        : `Recovery capacity is ${input.state.resilienceLabel} with stabilization potential at ${(input.state.stabilizationPotential * 100).toFixed(0)}%.`;

  const summaryParts: string[] = [];
  if (input.state.resilienceLabel === "robust") {
    summaryParts.push("Recovery coordination and throughput remain adequate relative to current fragility.");
  } else if (input.state.resilienceLabel === "strained") {
    summaryParts.push("Recovery systems are absorbing stress but stabilization is uneven across regions.");
  } else {
    summaryParts.push("Weak recovery coordination elevates collapse risk despite moderate operational pressure.");
  }
  summaryParts.push(
    `Resilience score is ${(input.state.resilienceScore * 100).toFixed(0)}% with recovery throughput at ${(input.state.recoveryThroughputScore * 100).toFixed(0)}%.`
  );

  const zoneSummaries = input.state.recoveryZones.slice(0, 5).map((zone) => {
    const regions = zone.affectedRegionIds.map(regionLabel).join(" and ");
    const drivers = zone.stabilizationDrivers.slice(0, 2).join(", ") || "operational coordination";
    return `${regions} maintains ${zone.recoveryCapacity} recovery capacity supported by ${drivers}.`;
  });

  const bottleneckSummaries = input.state.recoveryBottlenecks.map((b) => b.reason);

  const propagationSummaries = [
    ...stabilizationRecords.slice(0, 3).map(
      (r) =>
        `Successful stabilization may propagate from ${regionLabel(r.originRegionId)} toward ${regionLabel(r.affectedRegionId)}.`
    ),
    ...strainRecords.slice(0, 2).map(
      (r) =>
        `Recovery strain from ${regionLabel(r.originRegionId)} may amplify instability toward ${regionLabel(r.affectedRegionId)}.`
    ),
  ];

  const bullets: string[] = [];
  if (topBottleneck) bullets.push(topBottleneck.reason);
  for (const profile of [...input.state.regionProfiles]
    .sort((a, b) => a.recoveryCapacityScore - b.recoveryCapacityScore)
    .slice(0, 2)) {
    if (profile.recoveryCapacityScore < 0.45) {
      bullets.push(
        `${regionLabel(profile.regionId)} shows constrained recovery capacity requiring executive attention.`
      );
    }
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    zoneSummaries,
    bottleneckSummaries,
    propagationSummaries,
    bullets,
  };
}
