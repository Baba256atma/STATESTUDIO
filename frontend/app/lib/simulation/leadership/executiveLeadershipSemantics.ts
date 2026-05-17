/**
 * D7:3:6 — Executive-readable leadership load semantics.
 */

import type {
  ExecutiveLeadershipSemantics,
  LeadershipDynamicsState,
} from "./leadershipLoadTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveLeadershipSemantics(input: {
  state: LeadershipDynamicsState;
}): ExecutiveLeadershipSemantics {
  const recoveryBottleneck = input.state.leadershipSaturationBottlenecks.find(
    (b) => b.bottleneckId === "leadership-saturation::recovery-coordination"
  );
  const topBottleneck = input.state.leadershipSaturationBottlenecks[0];
  const logisticsZone = input.state.leadershipSaturationZones.includes("logistics");

  const headline =
    recoveryBottleneck
      ? recoveryBottleneck.reason
      : input.state.leadershipDynamicsLabel === "balanced"
        ? "Leadership load remains balanced with adequate coordination capacity across operational regions."
        : topBottleneck
          ? topBottleneck.reason
          : logisticsZone
            ? `Leadership coordination load is elevated across ${regionLabel("logistics")} due to operational recovery pressure and decision friction.`
            : input.state.leadershipDynamicsLabel === "saturated"
              ? "Leadership saturation is constraining decision capacity and elevating coordination friction enterprise-wide."
              : "Strategic leadership load dynamics remain elevated under current operational and coordination pressure.";

  const summaryParts: string[] = [];
  if (input.state.leadershipDynamicsLabel === "balanced") {
    summaryParts.push(
      "Executive burden is distributed with sufficient coordination capacity for stabilization and recovery."
    );
  } else if (input.state.leadershipDynamicsLabel === "elevated") {
    summaryParts.push(
      "Leadership pressure is rising but remains within manageable operational oversight limits."
    );
  } else if (input.state.leadershipDynamicsLabel === "strained") {
    summaryParts.push(
      "Decision responsibility overload and coordination saturation are degrading leadership effectiveness."
    );
  } else {
    summaryParts.push(
      "Leadership saturation is amplifying friction, trust strain, and recovery delays across the enterprise."
    );
  }
  summaryParts.push(
    `Executive load balance is ${(input.state.executiveLoadBalanceScore * 100).toFixed(0)}% with coordination capacity at ${(input.state.coordinationCapacityLevel * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeLeadershipSignals.slice(0, 6).map((s) => {
    const actors = s.affectedActorIds.length;
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantLoadDrivers ?? []).join(", ") || "operational_oversight";
    return `${actors} executive(s): ${s.leadershipLoadState} load across ${regions} (${drivers}).`;
  });

  const burdenSummaries = input.state.burdenRecords.slice(0, 4).map((r) => r.explanation);
  const bottleneckSummaries = input.state.leadershipSaturationBottlenecks.map((b) => b.reason);
  const capacitySummaries = input.state.coordinationCapacityRecords.slice(0, 4).map((r) => r.explanation);

  const bullets: string[] = [];
  if (topBottleneck) bullets.push(topBottleneck.reason);
  if (input.state.leadershipSaturationZones.length > 0) {
    bullets.push(
      `Leadership saturation zones: ${input.state.leadershipSaturationZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    burdenSummaries,
    bottleneckSummaries,
    capacitySummaries,
    bullets,
  };
}
