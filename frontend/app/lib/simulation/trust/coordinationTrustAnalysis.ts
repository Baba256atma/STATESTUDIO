/**
 * D7:3:5 — Coordination trust analysis.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { StakeholderInfluenceState } from "../influence/stakeholderInfluenceTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  CoordinationTrustRecord,
  OrganizationalTrustSignal,
  TrustStabilityBottleneck,
} from "./trustStabilityTypes.ts";
import { logTrustDev } from "./trustDevLog.ts";

export function analyzeCoordinationTrust(input: {
  topology: OperationalUniverseTopology;
  coordinationState: ExecutiveCoordinationState;
  influenceState: StakeholderInfluenceState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  signals: readonly OrganizationalTrustSignal[];
}): readonly CoordinationTrustRecord[] {
  const records: CoordinationTrustRecord[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    if (regionSignals.length === 0) continue;

    const avgIntensity =
      regionSignals.reduce((s, sig) => s + sig.intensity, 0) / regionSignals.length;
    const degrading = regionSignals.some(
      (s) => s.trustState === "degrading" || s.trustState === "critical"
    );

    const coordinationTrustScore = Math.min(
      1,
      Number(
        (
          input.coordinationState.organizationalSynchronizationScore * 0.4 +
          (1 - input.coordinationState.coordinationFrictionScore) * 0.35 +
          (degrading ? -0.15 : 0.1)
        ).toFixed(4)
      )
    );
    const confidenceStability = Math.min(
      1,
      Number(
        (
          input.influenceState.influencePropagationScore * 0.4 +
          (1 - input.decisionFrictionState.organizationalDragLevel) * 0.35 -
          (degrading ? avgIntensity * 0.2 : 0)
        ).toFixed(4)
      )
    );

    let explanation = "";
    if (coordinationTrustScore >= 0.55 && confidenceStability >= 0.5) {
      explanation = `Coordination trust remains operationally stable in ${region.label}.`;
    } else if (degrading) {
      explanation = `Unstable coordination trust is elevating operational confidence risk in ${region.label}.`;
    } else {
      explanation = `Coordination confidence in ${region.label} is uneven under current load.`;
    }

    records.push(
      Object.freeze({
        recordId: `coordination-trust::${region.regionId}`,
        regionId: region.regionId,
        coordinationTrustScore: Math.max(0, coordinationTrustScore),
        confidenceStability: Math.max(0, confidenceStability),
        explanation,
        contributingSignalIds: Object.freeze(regionSignals.map((s) => s.signalId).sort()),
      })
    );
  }

  logTrustDev("Trust", { coordinationTrustRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function detectTrustStabilityBottlenecks(input: {
  topology: OperationalUniverseTopology;
  coordinationState: ExecutiveCoordinationState;
  influenceState: StakeholderInfluenceState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  signals: readonly OrganizationalTrustSignal[];
  organizationalTrustScore: number;
  momentumState?: EnterpriseMomentumState;
}): readonly TrustStabilityBottleneck[] {
  const bottlenecks: TrustStabilityBottleneck[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const critical = regionSignals.some((s) => s.trustState === "critical");
    const degrading = regionSignals.some((s) => s.trustState === "degrading");

    let severity: TrustStabilityBottleneck["severity"] | null = null;
    let reason = "";
    const drivers = new Set<string>();
    for (const s of regionSignals) {
      for (const d of s.dominantTrustDrivers ?? []) drivers.add(d);
    }

    if (
      input.organizationalTrustScore < 0.4 &&
      input.coordinationState.coordinationDynamicsLabel === "fragmented" &&
      region.regionId === "logistics"
    ) {
      severity = "critical";
      reason =
        "Weak executive trust stability is driving coordination degradation across logistics dependency systems.";
    } else if (critical) {
      severity = "critical";
      reason = `Critical trust fragility threatens coordination recovery in ${region.label}.`;
    } else if (
      degrading &&
      input.decisionFrictionState.executionResistanceBottlenecks.some(
        (b) => b.regionId === region.regionId
      )
    ) {
      severity = "high";
      reason = `Operational trust degradation is amplifying decision friction in ${region.label}.`;
    } else if (
      input.influenceState.influenceStabilityLabel === "fragmented" &&
      input.coordinationState.coordinationBottlenecks.some((b) => b.regionId === region.regionId)
    ) {
      severity = "high";
      reason = "Fragmented operational confidence is weakening cross-domain stakeholder stability.";
    } else if (
      input.momentumState?.momentumTrendLabel === "accelerating_failure" &&
      degrading
    ) {
      severity = "moderate";
      reason = `Recovery trust bottlenecks are emerging under momentum instability in ${region.label}.`;
    } else if (
      input.coordinationState.executiveAlignmentScore > 0.5 &&
      degrading
    ) {
      severity = "moderate";
      reason = "Fragile executive alignment is constraining coordination trust stability.";
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `trust-bottleneck::${region.regionId}`,
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
