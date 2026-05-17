/**
 * D7:2:6 — Regional momentum signal derivation (deterministic).
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  MomentumDirection,
  OperationalMomentumSignal,
  RegionMomentumMetrics,
  RegionMomentumProfile,
} from "./operationalMomentumTypes.ts";
import { logMomentumDev } from "./momentumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function clampSigned(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(-1, n)).toFixed(4));
}

function directionFromVector(vector: number): MomentumDirection {
  if (vector > 0.35) return "recovering";
  if (vector > 0.12) return "stabilizing";
  if (vector < -0.35) return "degrading";
  if (vector < -0.12) return "accelerating";
  return "stagnating";
}

export function buildRegionalMomentumProfiles(input: {
  topology: OperationalUniverseTopology;
  recoveryState: OrganizationalRecoveryState;
  fragilityMap: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionMomentumMetrics>>;
  stressFactor?: number;
  priorTickMomentumScore?: number;
}): RegionMomentumProfile[] {
  const recoveryByRegion = new Map(
    input.recoveryState.regionProfiles.map((p) => [p.regionId, p])
  );
  const fragilityByRegion = new Map(
    input.fragilityMap.regionProfiles.map((p) => [p.regionId, p])
  );
  const flowPressureByRegion = new Map(
    (input.flowState?.regionPressures ?? []).map((p) => [p.regionId, p])
  );
  const bottleneckSet = new Set(input.flowState?.bottleneckRegions ?? []);
  const saturatedSet = new Set(input.pressureState?.saturationRegions ?? []);

  const profiles: RegionMomentumProfile[] = [];

  for (const region of input.topology.operationalRegions) {
    const metrics = input.regionMetrics?.[region.regionId];
    const recovery = recoveryByRegion.get(region.regionId);
    const fragility = fragilityByRegion.get(region.regionId);
    const flowPressure = flowPressureByRegion.get(region.regionId);

    const recoveryMomentum = clamp01(
      (recovery?.recoveryCapacityScore ?? 0.5) * 0.5 +
        (recovery?.stabilizationEfficiency ?? 0.45) * 0.3 +
        (input.flowState?.operationalMomentum ?? 0.5) * 0.2
    );
    const degradationRate = clamp01(
      (fragility?.fragilityScore ?? 0.3) * 0.4 +
        (fragility?.resilienceReduction ?? 0.25) * 0.3 +
        (flowPressure?.congestionScore ?? 0.25) * 0.2 +
        (input.pressureState?.systemicPressureScore ?? 0.3) * 0.1 +
        (input.stressFactor ?? 0) * 0.15
    );
    const accelerationRate = clamp01(
      degradationRate * 0.55 +
        (metrics?.operationalLoad ?? 0.35) * 0.25 +
        (saturatedSet.has(region.regionId) ? 0.2 : 0)
    );
    const inertiaScore = clamp01(
      (metrics?.coordinationLag ?? 0.25) * 0.35 +
        (recovery?.resilienceDegradation ?? 0.3) * 0.35 +
        (bottleneckSet.has(region.regionId) ? 0.25 : 0.1)
    );
    const stabilizationVelocity = clamp01(
      recoveryMomentum * 0.5 +
        (1 - inertiaScore) * 0.3 +
        (input.recoveryState.stabilizationPotential ?? 0.45) * 0.2 -
        degradationRate * 0.25
    );

    const momentumVector = clampSigned(
      recoveryMomentum * 0.45 +
        stabilizationVelocity * 0.25 -
        degradationRate * 0.35 -
        accelerationRate * 0.15 -
        inertiaScore * 0.1
    );

    const drivers: string[] = [];
    if (recoveryMomentum > 0.55) drivers.push("positive recovery momentum");
    if (degradationRate > 0.55) drivers.push("instability escalation velocity");
    if (inertiaScore > 0.5) drivers.push("organizational inertia");
    if (stabilizationVelocity > 0.5) drivers.push("stabilization velocity");
    if (bottleneckSet.has(region.regionId)) drivers.push("flow congestion drag");
    if (drivers.length === 0) {
      drivers.push(directionFromVector(momentumVector) + " regional momentum");
    }

    profiles.push(
      Object.freeze({
        regionId: region.regionId,
        momentumVector,
        accelerationRate,
        degradationRate,
        inertiaScore,
        recoveryMomentum,
        stabilizationVelocity,
        drivers: Object.freeze([...new Set(drivers)].sort()),
      })
    );
  }

  logMomentumDev("OperationalVelocity", {
    profileCount: profiles.length,
    topologyId: input.topology.topologyId,
    priorTick: input.priorTickMomentumScore ?? null,
  });

  return profiles.sort((a, b) => a.regionId.localeCompare(b.regionId));
}

export function deriveMomentumSignalsFromProfiles(
  profiles: readonly RegionMomentumProfile[]
): OperationalMomentumSignal[] {
  const signals: OperationalMomentumSignal[] = [];

  for (const profile of profiles) {
    const direction = directionFromVector(profile.momentumVector);
    const intensity = clamp01(
      Math.abs(profile.momentumVector) * 0.6 +
        profile.accelerationRate * 0.2 +
        profile.recoveryMomentum * 0.2
    );
    if (intensity < 0.12 && direction === "stagnating") continue;

    signals.push(
      Object.freeze({
        signalId: `momentum::${profile.regionId}::${direction}`,
        affectedRegionIds: Object.freeze([profile.regionId]),
        momentumDirection: direction,
        intensity,
        executiveLabel: `${profile.regionId} momentum is ${direction}`,
      })
    );
  }

  logMomentumDev("Momentum", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}
