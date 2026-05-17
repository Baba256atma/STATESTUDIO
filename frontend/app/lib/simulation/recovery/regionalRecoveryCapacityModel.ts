/**
 * D7:2:5 — Regional recovery capacity modeling (deterministic).
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { RegionRecoveryMetrics, RegionRecoveryProfile } from "./recoveryCapacityTypes.ts";
import { logRecoveryDev } from "./recoveryDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function capacityLevel(score: number): import("./recoveryCapacityTypes.ts").RecoveryCapacityLevel {
  if (score >= 0.72) return "strong";
  if (score >= 0.55) return "stable";
  if (score >= 0.38) return "limited";
  return "weak";
}

export function buildRegionalRecoveryProfiles(input: {
  topology: OperationalUniverseTopology;
  fragilityMap: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionRecoveryMetrics>>;
  stressFactor?: number;
}): RegionRecoveryProfile[] {
  const fragilityByRegion = new Map(
    input.fragilityMap.regionProfiles.map((p) => [p.regionId, p])
  );
  const criticalSet = new Set(input.fragilityMap.criticalRegions);
  const saturatedSet = new Set(input.pressureState?.saturationRegions ?? []);
  const bottleneckSet = new Set(input.flowState?.bottleneckRegions ?? []);

  const profiles: RegionRecoveryProfile[] = [];

  for (const region of input.topology.operationalRegions) {
    const metrics = input.regionMetrics?.[region.regionId];
    const fragility = fragilityByRegion.get(region.regionId);
    const baseRecovery = clamp01(metrics?.recoveryCapacity ?? 1 - (fragility?.fragilityScore ?? 0.35));
    const load = clamp01(metrics?.operationalLoad ?? 0.35);
    const coordination = clamp01(
      metrics?.coordinationStrength ?? (region.regionId === "executive" ? 0.45 : 0.58)
    );

    const stabilizationEfficiency = clamp01(
      baseRecovery * 0.45 +
        (input.flowState?.operationalMomentum ?? 0.5) * 0.2 +
        (1 - (fragility?.recoveryWeakness ?? 0.3)) * 0.35 -
        load * 0.15
    );
    const recoveryCoordination = clamp01(
      coordination * 0.6 + (input.pressureState?.pressureStabilityLabel === "stable" ? 0.25 : 0.1)
    );
    const adaptiveRecovery = clamp01(
      baseRecovery * 0.5 + stabilizationEfficiency * 0.3 + recoveryCoordination * 0.2
    );
    const flowThroughputs =
      input.flowState?.activeFlows
        .filter(
          (f) =>
            f.targetRegionId === region.regionId || f.sourceRegionId === region.regionId
        )
        .map((f) => f.throughput ?? 0.55) ?? [];
    const avgFlowThroughput =
      flowThroughputs.length > 0
        ? flowThroughputs.reduce((s, v) => s + v, 0) / flowThroughputs.length
        : 0.55;
    const recoveryThroughput = clamp01(
      baseRecovery * 0.4 + avgFlowThroughput * 0.35 - (fragility?.propagationSusceptibility ?? 0.25) * 0.25
    );

    let resilienceDegradation = clamp01(
      (fragility?.fragilityScore ?? 0.3) * 0.4 +
        (fragility?.resilienceReduction ?? 0.25) * 0.35 +
        (input.stressFactor ?? 0) * 0.25
    );

    let recoveryCapacityScore = clamp01(
      baseRecovery * 0.3 +
        stabilizationEfficiency * 0.25 +
        recoveryCoordination * 0.2 +
        adaptiveRecovery * 0.15 +
        recoveryThroughput * 0.1 -
        resilienceDegradation * 0.35
    );

    const drivers: string[] = [];
    if (recoveryCapacityScore >= 0.6) {
      drivers.push("stable recovery coordination");
    }
    if (stabilizationEfficiency >= 0.55) {
      drivers.push("effective stabilization efficiency");
    }
    if (criticalSet.has(region.regionId)) {
      recoveryCapacityScore = clamp01(recoveryCapacityScore - 0.15);
      resilienceDegradation = clamp01(resilienceDegradation + 0.1);
      drivers.push("elevated fragility constrains recovery");
    }
    if (saturatedSet.has(region.regionId)) {
      recoveryCapacityScore = clamp01(recoveryCapacityScore - 0.1);
      drivers.push("operational saturation limits recovery throughput");
    }
    if (bottleneckSet.has(region.regionId)) {
      recoveryCapacityScore = clamp01(recoveryCapacityScore - 0.08);
      drivers.push("flow congestion delays stabilization");
    }
    if ((metrics?.approvalDelay ?? 0) > 0.5) {
      recoveryCapacityScore = clamp01(recoveryCapacityScore - 0.12);
      drivers.push("executive approval bottleneck");
    }
    if (drivers.length === 0) {
      drivers.push(capacityLevel(recoveryCapacityScore) + " regional recovery capacity");
    }

    profiles.push(
      Object.freeze({
        regionId: region.regionId,
        recoveryCapacityScore,
        stabilizationEfficiency,
        recoveryCoordination,
        adaptiveRecovery,
        recoveryThroughput,
        resilienceDegradation,
        drivers: Object.freeze([...new Set(drivers)].sort()),
      })
    );
  }

  const sorted = profiles.sort((a, b) => a.regionId.localeCompare(b.regionId));
  logRecoveryDev("RecoveryCapacity", {
    profileCount: sorted.length,
    topologyId: input.topology.topologyId,
  });
  return sorted;
}
