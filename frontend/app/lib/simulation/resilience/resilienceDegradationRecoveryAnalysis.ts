/**
 * D7:3:8 — Resilience degradation, recovery, and bottleneck analysis.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  AdaptiveCoordinationRecord,
  HumanSystemResilienceSignal,
  ResilienceBottleneck,
} from "./humanSystemResilienceTypes.ts";
import { logHumanSystemResilienceDev } from "./humanSystemResilienceDevLog.ts";

export function analyzeAdaptiveCoordination(input: {
  topology: OperationalUniverseTopology;
  signals: readonly HumanSystemResilienceSignal[];
  coordinationState: ExecutiveCoordinationState;
  humanSystemAdaptationLevel: number;
}): readonly AdaptiveCoordinationRecord[] {
  const records: AdaptiveCoordinationRecord[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    if (regionSignals.length === 0) continue;

    const adaptive = regionSignals.filter(
      (s) => s.resilienceState === "adaptive" || s.resilienceState === "recovering"
    );
    const adaptationScore =
      adaptive.length === 0
        ? input.humanSystemAdaptationLevel * 0.5
        : adaptive.reduce((s, sig) => s + sig.intensity, 0) / adaptive.length;

    const synchronizationQuality = Math.min(
      1,
      Number(
        (
          input.coordinationState.organizationalSynchronizationScore * 0.5 +
          adaptationScore * 0.5
        ).toFixed(4)
      )
    );

    const explanation =
      adaptationScore >= 0.55
        ? `Adaptive coordination supports human-system recovery synchronization in ${region.label}.`
        : `Operational-human recovery interaction in ${region.label} remains uneven under current load.`;

    records.push(
      Object.freeze({
        recordId: `adaptive-coordination::${region.regionId}`,
        regionId: region.regionId,
        adaptationScore: Number(adaptationScore.toFixed(4)),
        synchronizationQuality,
        explanation,
        contributingSignalIds: Object.freeze(regionSignals.map((s) => s.signalId).sort()),
      })
    );
  }

  logHumanSystemResilienceDev("AdaptiveRecovery", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function detectResilienceBottlenecks(input: {
  topology: OperationalUniverseTopology;
  signals: readonly HumanSystemResilienceSignal[];
  coordinationState: ExecutiveCoordinationState;
  trustState: OrganizationalTrustState;
  leadershipState: LeadershipDynamicsState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  resilienceDegradationScore: number;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
}): readonly ResilienceBottleneck[] {
  const bottlenecks: ResilienceBottleneck[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    const fragile = regionSignals.some((s) => s.resilienceState === "fragile");
    const strained = regionSignals.some((s) => s.resilienceState === "strained");
    const drivers = new Set<string>();
    for (const s of regionSignals) {
      for (const d of s.dominantResilienceDrivers ?? []) drivers.add(d);
    }

    let severity: ResilienceBottleneck["severity"] | null = null;
    let reason = "";

    if (
      region.regionId === "logistics" &&
      fragile &&
      input.decisionFrictionState.frictionHotspots.includes("logistics")
    ) {
      severity = "critical";
      reason =
        "Resilience fragility is critical within logistics stabilization systems under sustained dependency pressure.";
    } else if (
      input.leadershipState.leadershipDynamicsLabel === "saturated" &&
      input.coordinationState.coordinationDynamicsLabel === "fragmented" &&
      fragile
    ) {
      severity = "high";
      reason = "Leadership overload and operational instability are driving resilience degradation growth.";
    } else if (
      input.trustState.trustStabilityLabel === "critical" ||
      (input.trustState.trustStabilityLabel === "degrading" && strained)
    ) {
      severity = "high";
      reason = `Trust degradation is elevating human-system resilience fragility in ${region.label}.`;
    } else if (
      input.recoveryState &&
      (input.recoveryState.stabilizationPotential ?? 1) < 0.4 &&
      strained
    ) {
      severity = "high";
      reason = "Operational-human recovery imbalance is constraining resilience adaptation pathways.";
    } else if (
      input.momentumState?.momentumTrendLabel === "accelerating_failure" &&
      fragile
    ) {
      severity = "moderate";
      reason = `Resilience erosion in ${region.label} is coupling to momentum degradation.`;
    } else if (input.resilienceDegradationScore > 0.6 && strained) {
      severity = "moderate";
      reason = `Overloaded resilience pathways are emerging in ${region.label} coordination systems.`;
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `resilience-bottleneck::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          dominantDrivers: Object.freeze([...drivers].sort()),
        })
      );
    }
  }

  logHumanSystemResilienceDev("ResilienceFragility", { bottleneckCount: bottlenecks.length });
  return Object.freeze(bottlenecks.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
