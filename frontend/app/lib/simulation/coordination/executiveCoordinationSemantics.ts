/**
 * D7:3:2 — Executive-readable coordination dynamics semantics.
 */

import type {
  ExecutiveCoordinationSemantics,
  ExecutiveCoordinationState,
} from "./coordinationDynamicsTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveCoordinationSemantics(input: {
  state: ExecutiveCoordinationState;
}): ExecutiveCoordinationSemantics {
  const stableSync = input.state.synchronizationRecords.filter((r) => r.synchronizationQuality >= 0.55);
  const strainedSync = input.state.synchronizationRecords.filter((r) => r.frictionScore >= 0.55);
  const topBottleneck = input.state.coordinationBottlenecks[0];
  const financeStable = stableSync.find(
    (r) => r.sourceRegionId === "finance" || r.targetRegionId === "finance"
  );
  const logisticsStrain = strainedSync.find(
    (r) => r.sourceRegionId === "logistics" || r.targetRegionId === "logistics"
  );

  const headline =
    financeStable && logisticsStrain
      ? `Executive coordination remains stable across finance and ${regionLabel(logisticsStrain.sourceRegionId === "logistics" ? logisticsStrain.targetRegionId : logisticsStrain.sourceRegionId)}, but operational recovery alignment is weakening under increasing dependency pressure.`
      : input.state.coordinationDynamicsLabel === "synchronized"
        ? "Executive coordination is synchronized across the operational universe."
        : topBottleneck
          ? topBottleneck.reason
          : input.state.coordinationDynamicsLabel === "fragmented"
            ? "Executive coordination is fragmented, amplifying dependency pressure across operational regions."
            : "Executive coordination dynamics remain under strain with uneven cross-domain synchronization.";

  const summaryParts: string[] = [];
  if (input.state.coordinationDynamicsLabel === "synchronized") {
    summaryParts.push("Leadership synchronization supports stabilization, recovery alignment, and sustainable momentum.");
  } else if (input.state.coordinationDynamicsLabel === "recovering") {
    summaryParts.push("Executive collaboration is improving coordination quality relative to prior operational strain.");
  } else if (input.state.coordinationDynamicsLabel === "fragmented") {
    summaryParts.push("Weak cross-domain synchronization is elevating systemic instability and recovery delays.");
  } else {
    summaryParts.push("Coordination friction is present but contained in parts of the enterprise structure.");
  }
  summaryParts.push(
    `Organizational synchronization is ${(input.state.organizationalSynchronizationScore * 100).toFixed(0)}% with executive alignment at ${(input.state.executiveAlignmentScore * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeCoordinationSignals.slice(0, 6).map((s) => {
    const actors = s.participatingActorIds.length;
    return `${actors} actor(s) show ${s.coordinationState} coordination across ${s.affectedRegionIds.map(regionLabel).join(", ")}.`;
  });

  const synchronizationSummaries = input.state.synchronizationRecords.slice(0, 4).map((r) => r.explanation);

  const bottleneckSummaries = input.state.coordinationBottlenecks.map((b) => b.reason);

  const bullets: string[] = [];
  if (topBottleneck) bullets.push(topBottleneck.reason);
  if (input.state.frictionZones.length > 0) {
    bullets.push(
      `Friction zones: ${input.state.frictionZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    synchronizationSummaries,
    bottleneckSummaries,
    bullets,
  };
}
