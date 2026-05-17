/**
 * D7:2:7 — Stability and imbalance zone modeling.
 */

import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type {
  EnterpriseEquilibriumState,
  RegionEquilibriumProfile,
} from "./equilibriumTypes.ts";
import { logEquilibriumDev } from "./equilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function identifyStabilityZones(
  profiles: readonly RegionEquilibriumProfile[]
): readonly string[] {
  const zones = profiles
    .filter((p) => p.balanceScore >= 0.58 && p.driftVelocity < 0.4)
    .map((p) => p.regionId)
    .sort();
  logEquilibriumDev("Equilibrium", { stabilityZoneCount: zones.length });
  return Object.freeze(zones);
}

export function identifyImbalanceZones(
  profiles: readonly RegionEquilibriumProfile[]
): readonly string[] {
  const zones = profiles
    .filter((p) => p.balanceScore < 0.45 || p.driftVelocity >= 0.55)
    .map((p) => p.regionId)
    .sort();
  logEquilibriumDev("Imbalance", { imbalanceZoneCount: zones.length, regions: zones });
  return Object.freeze(zones);
}

export function identifyOverextendedRegions(
  profiles: readonly RegionEquilibriumProfile[]
): readonly string[] {
  return Object.freeze(
    profiles
      .filter((p) => p.overextensionScore >= 0.62)
      .map((p) => p.regionId)
      .sort()
  );
}

export function calculateEquilibriumScore(
  profiles: readonly RegionEquilibriumProfile[]
): number {
  if (profiles.length === 0) return 0.4;
  return clamp01(profiles.reduce((s, p) => s + p.balanceScore, 0) / profiles.length);
}

export function calculateBalanceSustainabilityScore(input: {
  profiles: readonly RegionEquilibriumProfile[];
  recoveryState: OrganizationalRecoveryState;
  momentumState: EnterpriseMomentumState;
  flowMomentum?: number;
}): number {
  const avgBalance =
    input.profiles.length === 0
      ? 0.4
      : input.profiles.reduce((s, p) => s + p.balanceScore, 0) / input.profiles.length;
  const recoveryFactor = clamp01(input.recoveryState.resilienceScore * 0.4);
  const momentumFactor = clamp01(input.momentumState.organizationalMomentumScore * 0.35);
  const flowFactor = clamp01((input.flowMomentum ?? 0.5) * 0.25);

  return clamp01(avgBalance * 0.45 + recoveryFactor + momentumFactor * 0.35 + flowFactor * 0.15);
}

export function calculateInstabilityDriftScore(
  profiles: readonly RegionEquilibriumProfile[],
  fragilityMap: OperationalFragilityMap
): number {
  if (profiles.length === 0) return 0.25;
  const avgDrift = profiles.reduce((s, p) => s + p.driftVelocity, 0) / profiles.length;
  return clamp01(avgDrift * 0.6 + fragilityMap.systemicExposureScore * 0.25 + fragilityMap.concentrationDensity * 0.15);
}

export function classifyEquilibriumLabel(input: {
  equilibriumScore: number;
  instabilityDriftScore: number;
  imbalanceZoneCount: number;
  momentumTrend: EnterpriseMomentumState["momentumTrendLabel"];
  collapseRisk: OperationalFragilityMap["collapseRiskLabel"];
}): EnterpriseEquilibriumState["equilibriumLabel"] {
  if (
    input.collapseRisk === "approaching" ||
    input.equilibriumScore < 0.35 ||
    input.imbalanceZoneCount >= 3
  ) {
    return "critical_imbalance";
  }
  if (
    input.momentumTrend === "recovering" &&
    input.equilibriumScore >= 0.48 &&
    input.instabilityDriftScore < 0.55
  ) {
    return "recovering";
  }
  if (input.equilibriumScore >= 0.58 && input.instabilityDriftScore < 0.45) {
    return "balanced";
  }
  return "strained";
}
