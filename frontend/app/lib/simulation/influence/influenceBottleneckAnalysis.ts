/**
 * D7:3:4 — Stakeholder influence bottleneck analysis.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { InfluenceBottleneck, StakeholderInfluenceSignal } from "./stakeholderInfluenceTypes.ts";
import { logInfluenceDev } from "./influenceDevLog.ts";

export function detectInfluenceBottlenecks(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  signals: readonly StakeholderInfluenceSignal[];
  momentumState?: EnterpriseMomentumState;
  propagationDelayFactor?: number;
}): readonly InfluenceBottleneck[] {
  const bottlenecks: InfluenceBottleneck[] = [];
  const delay = Math.min(1, Math.max(0, input.propagationDelayFactor ?? 0));

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const regionActors = input.actorState.activeActors.filter((a) =>
      a.assignedRegionIds.includes(region.regionId)
    );
    const executives = regionActors.filter((a) => a.role === "executive");
    const stakeholders = regionActors.filter((a) => a.role === "stakeholder");
    const sourceActorIds = regionActors.map((a) => a.actorId).sort();

    const avgInfluence =
      regionActors.length === 0
        ? 0.5
        : regionActors.reduce((s, a) => s + a.influenceLevel, 0) / regionActors.length;

    const resistant = regionSignals.some((s) => s.influenceState === "resistant");
    const strained = regionSignals.some((s) => s.influenceState === "strained");

    let severity: InfluenceBottleneck["severity"] | null = null;
    let reason = "";

    if (
      executives.length === 0 &&
      stakeholders.length === 0 &&
      input.coordinationState.coordinationDynamicsLabel !== "synchronized"
    ) {
      severity = "high";
      reason = `Isolated leadership in ${region.label} is fragmenting influence propagation.`;
    } else if (
      region.regionId === "manufacturing" &&
      resistant &&
      input.decisionFrictionState.frictionHotspots.includes("manufacturing")
    ) {
      severity = "critical";
      reason =
        "Operational resistance is increasing within manufacturing recovery coordination.";
    } else if (
      executives.length > 0 &&
      avgInfluence < 0.4 &&
      input.coordinationState.coordinationBottlenecks.some((b) => b.regionId === region.regionId)
    ) {
      severity = "high";
      reason = "Weak executive influence propagation is elevating operational fragmentation.";
    } else if (delay > 0.4 && strained) {
      severity = "moderate";
      reason = "Fragmented influence chains are delaying strategic endorsement spread in this region.";
    } else if (
      input.momentumState?.momentumTrendLabel === "accelerating_failure" &&
      resistant
    ) {
      severity = "high";
      reason = `Stakeholder resistance in ${region.label} is coupling to momentum degradation.`;
    } else if (
      input.coordinationState.coordinationDynamicsLabel === "fragmented" &&
      strained
    ) {
      severity = "moderate";
      reason = "Coordination trust breakdown is constraining cross-domain influence propagation.";
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `influence-bottleneck::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          sourceActorIds: Object.freeze(sourceActorIds),
        })
      );
    }
  }

  if (
    input.coordinationState.executiveAlignmentScore > 0.55 &&
    input.decisionFrictionState.organizationalDragLevel > 0.55
  ) {
    bottlenecks.push(
      Object.freeze({
        bottleneckId: "influence-bottleneck::strategic-endorsement",
        regionId: "finance",
        severity: "moderate",
        reason:
          "Strategic endorsement bottlenecks are emerging where executive alignment meets execution drag.",
        sourceActorIds: Object.freeze(
          input.actorState.activeActors.filter((a) => a.role === "executive").map((a) => a.actorId)
        ),
      })
    );
  }

  logInfluenceDev("StakeholderInfluence", {
    bottleneckCount: bottlenecks.length,
    regions: bottlenecks.map((b) => b.regionId),
  });

  return Object.freeze(bottlenecks.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
