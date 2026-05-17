/**
 * D7:3:3 — Organizational drag and systemic effect intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  DecisionFrictionSignal,
  ExecutionResistanceBottleneck,
  OrganizationalDragRecord,
} from "./decisionFrictionTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logDecisionFrictionDev } from "./decisionFrictionDevLog.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function detectExecutionResistanceBottlenecks(input: {
  topology: OperationalUniverseTopology;
  signals: readonly DecisionFrictionSignal[];
  organizationalDragLevel: number;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
}): readonly ExecutionResistanceBottleneck[] {
  const bottlenecks: ExecutionResistanceBottleneck[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const critical = regionSignals.some((s) => s.frictionState === "critical");
    const high = regionSignals.some((s) => s.frictionState === "high");

    let severity: ExecutionResistanceBottleneck["severity"] | null = null;
    let reason = "";
    const drivers = new Set<string>();

    for (const s of regionSignals) {
      for (const d of s.dominantFrictionDrivers ?? []) drivers.add(d);
    }

    if (critical && input.organizationalDragLevel > 0.65) {
      severity = "critical";
      reason = `Decision execution is critically constrained in ${region.label} under accumulated organizational drag.`;
    } else if (
      region.regionId === "logistics" &&
      high &&
      (input.recoveryState?.stabilizationPotential ?? 1) < 0.5
    ) {
      severity = "high";
      reason =
        "Recovery strategy approval exists but cross-domain coordination delays implementation in logistics.";
    } else if (
      input.momentumState?.momentumTrendLabel === "accelerating_failure" &&
      high
    ) {
      severity = "high";
      reason = `Operational overload in ${region.label} is delaying decision execution and elevating fragility risk.`;
    } else if (regionSignals.some((s) => s.dominantFrictionDrivers?.includes("approval_chain_delay"))) {
      severity = "moderate";
      reason = `Approval-chain overload is creating execution resistance in ${region.label}.`;
    } else if (high) {
      severity = "moderate";
      reason = `${region.label} shows strategic resistance to operational change under current load.`;
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `execution-resistance::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          dominantDrivers: Object.freeze([...drivers].sort()),
        })
      );
    }
  }

  return Object.freeze(bottlenecks.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}

export function analyzeOrganizationalDrag(input: {
  topology: OperationalUniverseTopology;
  signals: readonly DecisionFrictionSignal[];
  organizationalDragLevel: number;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
}): readonly OrganizationalDragRecord[] {
  const records: OrganizationalDragRecord[] = [];
  const edges = input.topology.crossDomainRelationships;

  for (const edge of edges.slice(0, 12)) {
    const sourceSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(edge.sourceRegionId)
    );
    const targetSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(edge.targetRegionId)
    );
    if (sourceSignals.length === 0 && targetSignals.length === 0) continue;

    const avgIntensity =
      [...sourceSignals, ...targetSignals].reduce((s, sig) => s + sig.intensity, 0) /
      Math.max(1, sourceSignals.length + targetSignals.length);

    const dragLevel = Math.min(
      1,
      avgIntensity * 0.6 + input.organizationalDragLevel * 0.4
    );

    let systemicEffect = "moderate_execution_slowdown";
    if (dragLevel >= 0.7) systemicEffect = "momentum_degradation";
    else if (dragLevel >= 0.55) systemicEffect = "recovery_velocity_reduction";
    else if (dragLevel < 0.35) systemicEffect = "minimal_systemic_drag";

    const explanation =
      dragLevel >= 0.55
        ? `Organizational drag between ${regionLabel(edge.sourceRegionId)} and ${regionLabel(edge.targetRegionId)} is slowing enterprise evolution.`
        : `Decision friction across ${regionLabel(edge.sourceRegionId)} → ${regionLabel(edge.targetRegionId)} remains contained.`;

    records.push(
      Object.freeze({
        recordId: `drag::${edge.sourceRegionId}::${edge.targetRegionId}`,
        sourceDomain: edge.sourceRegionId,
        targetDomain: edge.targetRegionId,
        dragLevel: Number(dragLevel.toFixed(4)),
        systemicEffect,
        explanation,
      })
    );
  }

  if (input.momentumState && input.organizationalDragLevel > 0.5) {
    records.push(
      Object.freeze({
        recordId: "drag::momentum-coupling",
        sourceDomain: "operations",
        targetDomain: "strategic_momentum",
        dragLevel: Number(input.organizationalDragLevel.toFixed(4)),
        systemicEffect: "momentum_degradation",
        explanation:
          "Organizational drag is coupling decision latency to operational momentum degradation.",
      })
    );
  }

  logDecisionFrictionDev("OrganizationalDrag", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
