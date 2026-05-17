/**
 * D7:2:4 — Regional fragility accumulation intelligence (deterministic).
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { RegionFragilityMetrics, RegionFragilityProfile } from "./fragilityConcentrationTypes.ts";
import { logFragilityDev } from "./fragilityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function buildRegionalFragilityProfiles(input: {
  topology: OperationalUniverseTopology;
  pressureState?: EnterprisePressureState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionFragilityMetrics>>;
  stressFactor?: number;
}): RegionFragilityProfile[] {
  const pressureByRegion = new Map(
    (input.pressureState?.regionAccumulations ?? []).map((a) => [a.regionId, a])
  );
  const hotspotRegions = new Set(
    (input.pressureState?.fragilityHotspots ?? []).map((h) => h.regionId)
  );
  const saturatedRegions = new Set(input.pressureState?.saturationRegions ?? []);
  const bottleneckRegions = new Set(input.flowState?.bottleneckRegions ?? []);
  const flowPressureByRegion = new Map(
    (input.flowState?.regionPressures ?? []).map((p) => [p.regionId, p])
  );

  const profiles: RegionFragilityProfile[] = [];

  for (const region of input.topology.operationalRegions) {
    const metrics = input.regionMetrics?.[region.regionId];
    const pressureAcc = pressureByRegion.get(region.regionId);
    const flowPressure = flowPressureByRegion.get(region.regionId);

    const baseFragility = clamp01(
      metrics?.fragility ?? region.fragilityScore ?? 0.28
    );
    const load = clamp01(metrics?.operationalLoad ?? 0.35);
    const recovery = clamp01(metrics?.recoveryCapacity ?? 1 - baseFragility);
    const recoveryWeakness = clamp01(1 - recovery + (input.stressFactor ?? 0) * 0.08);
    const dependencyOverload = clamp01(
      (pressureAcc?.dependencyConcentration ?? metrics?.dependencyConcentration ?? 0.3) *
        0.6 +
        (pressureAcc?.accumulatedPressure ?? 0) * 0.4
    );
    const propagationSusceptibility = clamp01(
      (flowPressure?.congestionScore ?? 0.25) * 0.5 +
        (pressureAcc?.inboundPressure ?? 0.2) * 0.5
    );
    const resilienceReduction = clamp01(
      load * 0.35 + recoveryWeakness * 0.35 + dependencyOverload * 0.3
    );

    let fragilityScore = clamp01(
      baseFragility * 0.35 +
        recoveryWeakness * 0.2 +
        dependencyOverload * 0.2 +
        propagationSusceptibility * 0.15 +
        resilienceReduction * 0.1
    );

    const drivers: string[] = [];
    if (hotspotRegions.has(region.regionId)) {
      fragilityScore = clamp01(fragilityScore + 0.12);
      drivers.push("dependency pressure hotspot");
    }
    if (saturatedRegions.has(region.regionId)) {
      fragilityScore = clamp01(fragilityScore + 0.08);
      drivers.push("operational saturation");
    }
    if (bottleneckRegions.has(region.regionId)) {
      fragilityScore = clamp01(fragilityScore + 0.1);
      drivers.push("flow bottleneck congestion");
    }
    if ((metrics?.approvalDelay ?? 0) > 0.5) {
      fragilityScore = clamp01(fragilityScore + 0.1);
      drivers.push("executive approval bottleneck");
    }
    if (recoveryWeakness > 0.55) {
      drivers.push("recovery capacity weakness");
    }
    if (dependencyOverload > 0.55) {
      drivers.push("dependency overload");
    }
    if (drivers.length === 0 && fragilityScore > 0.4) {
      drivers.push("elevated regional fragility exposure");
    }

    profiles.push(
      Object.freeze({
        regionId: region.regionId,
        fragilityScore,
        recoveryWeakness,
        dependencyOverload,
        propagationSusceptibility,
        resilienceReduction,
        drivers: Object.freeze([...new Set(drivers)].sort()),
      })
    );
  }

  const sorted = profiles.sort((a, b) => a.regionId.localeCompare(b.regionId));
  logFragilityDev("FragilityMap", {
    profileCount: sorted.length,
    topologyId: input.topology.topologyId,
  });
  return sorted;
}

export function identifyCriticalRegions(
  profiles: readonly RegionFragilityProfile[]
): readonly string[] {
  return Object.freeze(
    profiles
      .filter((p) => p.fragilityScore >= 0.62)
      .sort((a, b) => b.fragilityScore - a.fragilityScore)
      .map((p) => p.regionId)
  );
}

export function identifyConcentrationHotspots(
  profiles: readonly RegionFragilityProfile[]
): readonly string[] {
  return Object.freeze(
    profiles
      .filter((p) => p.fragilityScore >= 0.48)
      .sort((a, b) => b.fragilityScore - a.fragilityScore)
      .map((p) => p.regionId)
  );
}
