/**
 * D7:3:2 — Executive coordination bottleneck analysis.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { CoordinationBottleneck } from "./coordinationDynamicsTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import { logCoordinationDev } from "./coordinationDevLog.ts";

export function detectCoordinationBottlenecks(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
  communicationDelayFactor?: number;
}): readonly CoordinationBottleneck[] {
  const bottlenecks: CoordinationBottleneck[] = [];
  const delay = Math.min(1, Math.max(0, input.communicationDelayFactor ?? 0));

  for (const region of input.topology.operationalRegions) {
    const actorsInRegion = input.actorState.activeActors.filter((a) =>
      a.assignedRegionIds.includes(region.regionId)
    );
    const executives = actorsInRegion.filter((a) => a.role === "executive");
    const managers = actorsInRegion.filter((a) => a.role === "manager");
    const participatingActorIds = actorsInRegion.map((a) => a.actorId).sort();

    let severity: CoordinationBottleneck["severity"] | null = null;
    let reason = "";

    const avgCoordination =
      actorsInRegion.length === 0
        ? 0.5
        : actorsInRegion.reduce((s, a) => s + a.coordinationContribution, 0) / actorsInRegion.length;

    if (
      input.actorState.coordinationPressure > 0.7 &&
      region.regionId === "logistics" &&
      avgCoordination < 0.45
    ) {
      severity = "critical";
      reason = "Executive coordination overload is constraining logistics recovery alignment.";
    } else if (executives.length > 0 && managers.length > 0 && avgCoordination < 0.4 && delay > 0.35) {
      severity = "high";
      reason = "Delayed executive synchronization is slowing operational communication in this region.";
    } else if (input.equilibriumState?.imbalanceZones.includes(region.regionId) && avgCoordination < 0.5) {
      severity = "high";
      reason = `${region.label} shows strategic misalignment under operational imbalance.`;
    } else if (
      input.momentumState?.momentumTrendLabel === "accelerating_failure" &&
      actorsInRegion.some((a) => a.role === "manager")
    ) {
      severity = "moderate";
      reason = "Recovery coordination bottlenecks are emerging under degrading operational momentum.";
    } else if (actorsInRegion.filter((a) => a.role === "coordinator").length === 0 && avgCoordination < 0.45) {
      severity = "moderate";
      reason = "Fragmented operational communication without active coordination leadership.";
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `coordination-bottleneck::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          participatingActorIds: Object.freeze(participatingActorIds),
        })
      );
    }
  }

  logCoordinationDev("Coordination", {
    bottleneckCount: bottlenecks.length,
    regions: bottlenecks.map((b) => b.regionId),
  });

  return Object.freeze(bottlenecks.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
