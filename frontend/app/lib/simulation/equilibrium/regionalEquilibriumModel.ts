/**
 * D7:2:7 — Regional operational balance modeling (deterministic).
 */

import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  EquilibriumState,
  OperationalEquilibriumSignal,
  RegionEquilibriumMetrics,
  RegionEquilibriumProfile,
} from "./equilibriumTypes.ts";
import { logEquilibriumDev } from "./equilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function equilibriumStateFromBalance(balance: number, drift: number): EquilibriumState {
  if (balance < 0.28 || drift > 0.65) return "critical";
  if (balance < 0.42) return "imbalanced";
  if (balance >= 0.62 && drift < 0.35) return "stable";
  if (balance >= 0.5) return "recovering";
  return "strained";
}

export function buildRegionalEquilibriumProfiles(input: {
  topology: OperationalUniverseTopology;
  momentumState: EnterpriseMomentumState;
  recoveryState: OrganizationalRecoveryState;
  fragilityMap: OperationalFragilityMap;
  pressureState?: EnterprisePressureState;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionEquilibriumMetrics>>;
  priorEquilibriumScore?: number;
  stressFactor?: number;
}): RegionEquilibriumProfile[] {
  const recoveryByRegion = new Map(
    input.recoveryState.regionProfiles.map((p) => [p.regionId, p])
  );
  const fragilityByRegion = new Map(
    input.fragilityMap.regionProfiles.map((p) => [p.regionId, p])
  );
  const momentumByRegion = new Map(
    input.momentumState.regionProfiles.map((p) => [p.regionId, p])
  );
  const pressureByRegion = new Map(
    (input.pressureState?.regionAccumulations ?? []).map((a) => [a.regionId, a])
  );
  const saturatedSet = new Set(input.pressureState?.saturationRegions ?? []);

  const profiles: RegionEquilibriumProfile[] = [];

  for (const region of input.topology.operationalRegions) {
    const metrics = input.regionMetrics?.[region.regionId];
    const recovery = recoveryByRegion.get(region.regionId);
    const fragility = fragilityByRegion.get(region.regionId);
    const momentum = momentumByRegion.get(region.regionId);
    const pressure = pressureByRegion.get(region.regionId);

    const recoveryCapacity = clamp01(metrics?.recoveryCapacity ?? recovery?.recoveryCapacityScore ?? 0.5);
    const fragilityExposure = clamp01(fragility?.fragilityScore ?? metrics?.fragility ?? 0.3);
    const pressureLoad = clamp01(pressure?.accumulatedPressure ?? metrics?.operationalLoad ?? 0.35);

    const pressureRecoveryRatio = clamp01(
      recoveryCapacity / Math.max(0.15, pressureLoad + fragilityExposure * 0.5)
    );
    const momentumAlignment = clamp01(
      ((momentum?.momentumVector ?? 0) + 1) / 2 * 0.5 +
        (momentum?.stabilizationVelocity ?? 0.45) * 0.3 +
        (input.flowState?.operationalMomentum ?? 0.5) * 0.2
    );

    let balanceScore = clamp01(
      pressureRecoveryRatio * 0.35 +
        momentumAlignment * 0.3 +
        (1 - fragilityExposure) * 0.25 -
        (momentum?.degradationRate ?? 0.25) * 0.1
    );

    const overextensionScore = clamp01(
      pressureLoad * 0.4 +
        fragilityExposure * 0.35 +
        (saturatedSet.has(region.regionId) ? 0.25 : 0) +
        (metrics?.operationalLoad ?? 0.35) * 0.15
    );

    if (overextensionScore > 0.65) {
      balanceScore = clamp01(balanceScore - 0.12);
    }

    const driftVelocity = clamp01(
      (fragilityExposure - recoveryCapacity) * 0.35 +
        (momentum?.degradationRate ?? 0.2) * 0.25 +
        (input.stressFactor ?? 0) * 0.2 +
        (input.priorEquilibriumScore != null
          ? Math.max(0, input.priorEquilibriumScore - balanceScore) * 0.2
          : 0)
    );

    const drivers: string[] = [];
    if (pressureRecoveryRatio > 0.55) drivers.push("recovery offsets pressure");
    if (momentumAlignment > 0.55) drivers.push("sustainable momentum alignment");
    if (overextensionScore > 0.6) drivers.push("operational overextension");
    if (driftVelocity > 0.5) drivers.push("equilibrium erosion drift");
    if (drivers.length === 0) {
      drivers.push(equilibriumStateFromBalance(balanceScore, driftVelocity) + " balance");
    }

    profiles.push(
      Object.freeze({
        regionId: region.regionId,
        balanceScore,
        pressureRecoveryRatio,
        momentumAlignment,
        fragilityExposure,
        overextensionScore,
        driftVelocity,
        drivers: Object.freeze([...new Set(drivers)].sort()),
      })
    );
  }

  logEquilibriumDev("OperationalBalance", {
    profileCount: profiles.length,
    topologyId: input.topology.topologyId,
  });

  return profiles.sort((a, b) => a.regionId.localeCompare(b.regionId));
}

export function deriveEquilibriumSignalsFromProfiles(
  profiles: readonly RegionEquilibriumProfile[]
): OperationalEquilibriumSignal[] {
  const signals: OperationalEquilibriumSignal[] = [];

  for (const profile of profiles) {
    const state = equilibriumStateFromBalance(profile.balanceScore, profile.driftVelocity);
    const intensity = clamp01(
      Math.abs(profile.balanceScore - 0.5) * 0.5 +
        profile.driftVelocity * 0.3 +
        profile.overextensionScore * 0.2
    );
    if (intensity < 0.1 && state === "stable") continue;

    signals.push(
      Object.freeze({
        signalId: `equilibrium::${profile.regionId}::${state}`,
        affectedRegionIds: Object.freeze([profile.regionId]),
        equilibriumState: state,
        intensity: Math.max(0.12, intensity),
        executiveLabel: `${profile.regionId} operational balance is ${state}`,
      })
    );
  }

  logEquilibriumDev("Equilibrium", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}
