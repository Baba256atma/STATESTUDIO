/**
 * D7:3:6 — Leadership saturation and overload analysis.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  LeadershipLoadSignal,
  LeadershipSaturationBottleneck,
} from "./leadershipLoadTypes.ts";
import { logLeadershipDev } from "./leadershipDevLog.ts";

export function detectLeadershipSaturationBottlenecks(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  trustState: OrganizationalTrustState;
  signals: readonly LeadershipLoadSignal[];
  leadershipBurdenScore: number;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
}): readonly LeadershipSaturationBottleneck[] {
  const bottlenecks: LeadershipSaturationBottleneck[] = [];
  const executives = input.actorState.activeActors.filter((a) => a.role === "executive");

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const saturated = regionSignals.some((s) => s.leadershipLoadState === "saturated");
    const strained = regionSignals.some((s) => s.leadershipLoadState === "strained");
    const regionExecs = executives.filter((e) => e.assignedRegionIds.includes(region.regionId));
    const affectedActorIds = regionExecs.map((e) => e.actorId).sort();
    const drivers = new Set<string>();
    for (const s of regionSignals) {
      for (const d of s.dominantLoadDrivers ?? []) drivers.add(d);
    }

    let severity: LeadershipSaturationBottleneck["severity"] | null = null;
    let reason = "";

    if (
      region.regionId === "logistics" &&
      saturated &&
      input.decisionFrictionState.frictionHotspots.includes("logistics")
    ) {
      severity = "critical";
      reason =
        "Leadership coordination load is critical across logistics recovery due to concentrated executive dependency.";
    } else if (
      executives.length === 1 &&
      regionExecs.length > 0 &&
      input.leadershipBurdenScore > 0.65
    ) {
      severity = "high";
      reason = "Unstable decision concentration on a single executive is amplifying coordination overload.";
    } else if (
      input.recoveryState &&
      (input.recoveryState.stabilizationPotential ?? 1) < 0.45 &&
      strained &&
      region.regionId === "manufacturing"
    ) {
      severity = "high";
      reason = "Recovery leadership overload is emerging under high recovery pressure in manufacturing.";
    } else if (
      input.coordinationState.coordinationBottlenecks.some((b) => b.regionId === region.regionId) &&
      saturated
    ) {
      severity = "high";
      reason = `Executive coordination bottlenecks are elevating leadership saturation in ${region.label}.`;
    } else if (
      input.trustState.trustStabilityLabel === "degrading" &&
      strained
    ) {
      severity = "moderate";
      reason = "Trust degradation is coupling to leadership burden and coordination capacity reduction.";
    } else if (
      input.momentumState?.momentumTrendLabel === "accelerating_failure" &&
      strained
    ) {
      severity = "moderate";
      reason = `Leadership saturation in ${region.label} is influencing momentum instability.`;
    } else if (saturated) {
      severity = "moderate";
      reason = `Overloaded leadership regions are constraining decision capacity in ${region.label}.`;
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `leadership-saturation::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          affectedActorIds: Object.freeze(affectedActorIds),
          dominantDrivers: Object.freeze([...drivers].sort()),
        })
      );
    }
  }

  if (
    input.decisionFrictionState.organizationalDragLevel > 0.55 &&
    input.coordinationState.coordinationDynamicsLabel !== "synchronized"
  ) {
    bottlenecks.push(
      Object.freeze({
        bottleneckId: "leadership-saturation::recovery-coordination",
        regionId: "logistics",
        severity: "high",
        reason:
          "Leadership coordination load is increasing across operational recovery systems due to concentrated executive dependency and rising decision friction.",
        affectedActorIds: Object.freeze(executives.map((e) => e.actorId)),
        dominantDrivers: Object.freeze([
          "decision_friction_burden",
          "single_executive_dependency",
          "coordination_saturation",
        ]),
      })
    );
  }

  logLeadershipDev("LeadershipSaturation", { bottleneckCount: bottlenecks.length });
  return Object.freeze(bottlenecks.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
