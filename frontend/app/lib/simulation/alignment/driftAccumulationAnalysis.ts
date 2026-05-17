/**
 * D7:3:7 — Alignment drift accumulation and fragmentation analysis.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  AlignmentFragmentationBottleneck,
  DriftAccumulationRecord,
  OrganizationalAlignmentSignal,
} from "./alignmentDriftTypes.ts";
import { logAlignmentDev } from "./alignmentDevLog.ts";

export function analyzeDriftAccumulation(input: {
  topology: OperationalUniverseTopology;
  signals: readonly OrganizationalAlignmentSignal[];
  alignmentDriftScore: number;
  coordinationState: ExecutiveCoordinationState;
  coordinationDivergenceFactor?: number;
}): readonly DriftAccumulationRecord[] {
  const records: DriftAccumulationRecord[] = [];
  const divergence = Math.min(1, Math.max(0, input.coordinationDivergenceFactor ?? 0));

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    if (regionSignals.length === 0) continue;

    const drifting = regionSignals.filter(
      (s) => s.alignmentState === "drifting" || s.alignmentState === "fragmented"
    );
    const driftScore = Math.min(
      1,
      drifting.length === 0
        ? input.alignmentDriftScore * 0.3
        : drifting.reduce((s, sig) => s + sig.intensity, 0) / drifting.length
    );
    const accumulationRate = Math.min(
      1,
      Number((driftScore * 0.6 + divergence * 0.25 + input.alignmentDriftScore * 0.15).toFixed(4))
    );

    let explanation = "";
    if (accumulationRate >= 0.55) {
      explanation = `Gradual alignment erosion is accumulating in ${region.label} under coordination divergence.`;
    } else if (input.coordinationState.coordinationBottlenecks.some((b) => b.regionId === region.regionId)) {
      explanation = `Repeated coordination instability is contributing to enterprise drift in ${region.label}.`;
    } else {
      explanation = `Alignment drift in ${region.label} remains contained but measurable.`;
    }

    records.push(
      Object.freeze({
        recordId: `drift::${region.regionId}`,
        regionId: region.regionId,
        driftScore: Number(driftScore.toFixed(4)),
        accumulationRate,
        explanation,
        contributingSignalIds: Object.freeze(regionSignals.map((s) => s.signalId).sort()),
      })
    );
  }

  if (divergence > 0.4 && input.coordinationState.coordinationDynamicsLabel !== "synchronized") {
    records.push(
      Object.freeze({
        recordId: "drift::enterprise-synchronization-loss",
        regionId: "finance",
        driftScore: Number(input.alignmentDriftScore.toFixed(4)),
        accumulationRate: Number(Math.min(1, divergence + 0.2).toFixed(4)),
        explanation:
          "Strategic synchronization loss is elevating cross-domain fragmentation across the enterprise.",
        contributingSignalIds: Object.freeze(
          input.signals.map((s) => s.signalId).slice(0, 8)
        ),
      })
    );
  }

  logAlignmentDev("AlignmentDrift", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function detectAlignmentFragmentationBottlenecks(input: {
  topology: OperationalUniverseTopology;
  signals: readonly OrganizationalAlignmentSignal[];
  alignmentDriftScore: number;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  leadershipState: LeadershipDynamicsState;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
}): readonly AlignmentFragmentationBottleneck[] {
  const bottlenecks: AlignmentFragmentationBottleneck[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const fragmented = regionSignals.some((s) => s.alignmentState === "fragmented");
    const drifting = regionSignals.some((s) => s.alignmentState === "drifting");
    const drivers = new Set<string>();
    for (const s of regionSignals) {
      for (const d of s.dominantAlignmentDrivers ?? []) drivers.add(d);
    }

    let severity: AlignmentFragmentationBottleneck["severity"] | null = null;
    let reason = "";

    if (
      region.regionId === "logistics" &&
      drifting &&
      input.decisionFrictionState.frictionHotspots.includes("logistics")
    ) {
      severity = "high";
      reason =
        "Operational drift is increasing within logistics coordination priorities under fragmented strategic focus.";
    } else if (fragmented && input.alignmentDriftScore > 0.65) {
      severity = "critical";
      reason = `Cross-domain fragmentation is critical in ${region.label}, elevating equilibrium erosion risk.`;
    } else if (
      input.recoveryState &&
      (input.recoveryState.stabilizationPotential ?? 1) < 0.45 &&
      drifting
    ) {
      severity = "high";
      reason = "Recovery objective misalignment is emerging under degrading strategic coherence.";
    } else if (
      input.leadershipState.leadershipDynamicsLabel === "saturated" &&
      input.coordinationState.coordinationDynamicsLabel === "fragmented"
    ) {
      severity = "high";
      reason = "Leadership overload and coordination divergence are amplifying organizational fragmentation.";
    } else if (
      input.momentumState?.momentumTrendLabel === "accelerating_failure" &&
      drifting
    ) {
      severity = "moderate";
      reason = `Operational inconsistency buildup in ${region.label} is coupling to momentum instability.`;
    } else if (fragmented) {
      severity = "moderate";
      reason = `Strategic priorities are fragmenting across ${region.label} operational systems.`;
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `alignment-fragmentation::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          dominantDrivers: Object.freeze([...drivers].sort()),
        })
      );
    }
  }

  logAlignmentDev("Fragmentation", { bottleneckCount: bottlenecks.length });
  return Object.freeze(bottlenecks.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
