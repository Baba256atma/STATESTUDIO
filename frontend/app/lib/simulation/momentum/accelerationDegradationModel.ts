/**
 * D7:2:6 — Acceleration and degradation zone modeling.
 */

import type { RegionMomentumProfile } from "./operationalMomentumTypes.ts";
import { logMomentumDev } from "./momentumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function identifyAccelerationZones(
  profiles: readonly RegionMomentumProfile[]
): readonly string[] {
  const zones = profiles
    .filter(
      (p) =>
        p.accelerationRate >= 0.52 &&
        p.degradationRate >= 0.45 &&
        p.momentumVector < -0.1
    )
    .map((p) => p.regionId)
    .sort();

  logMomentumDev("DegradationTrend", { accelerationZoneCount: zones.length, regions: zones });
  return Object.freeze(zones);
}

export function identifyDegradationZones(
  profiles: readonly RegionMomentumProfile[]
): readonly string[] {
  const zones = profiles
    .filter((p) => p.degradationRate >= 0.55 && p.momentumVector <= -0.15)
    .map((p) => p.regionId)
    .sort();

  logMomentumDev("DegradationTrend", { degradationZoneCount: zones.length, regions: zones });
  return Object.freeze(zones);
}

export function identifyStagnationZones(
  profiles: readonly RegionMomentumProfile[]
): readonly string[] {
  return Object.freeze(
    profiles
      .filter(
        (p) =>
          Math.abs(p.momentumVector) < 0.12 &&
          p.inertiaScore >= 0.45 &&
          p.stabilizationVelocity < 0.45
      )
      .map((p) => p.regionId)
      .sort()
  );
}

export function calculateRecoveryMomentumScore(
  profiles: readonly RegionMomentumProfile[]
): number {
  if (profiles.length === 0) return 0.35;
  return clamp01(
    profiles.reduce((s, p) => s + p.recoveryMomentum, 0) / profiles.length
  );
}

export function calculateOrganizationalMomentumScore(input: {
  profiles: readonly RegionMomentumProfile[];
  recoveryMomentumScore: number;
  priorTickMomentumScore?: number;
}): number {
  if (input.profiles.length === 0) return 0.4;
  const avgVector =
    input.profiles.reduce((s, p) => s + p.momentumVector, 0) / input.profiles.length;
  const normalized = clamp01((avgVector + 1) / 2);
  const trendBoost =
    input.priorTickMomentumScore != null
      ? clamp01((normalized - input.priorTickMomentumScore) * 0.15)
      : 0;

  return clamp01(normalized * 0.55 + input.recoveryMomentumScore * 0.35 + trendBoost);
}

export function classifyMomentumTrendLabel(input: {
  organizationalMomentumScore: number;
  degradationZoneCount: number;
  accelerationZoneCount: number;
  recoveryMomentumScore: number;
  collapseRisk: import("../fragility/fragilityConcentrationTypes.ts").OperationalFragilityMap["collapseRiskLabel"];
}): import("./operationalMomentumTypes.ts").EnterpriseMomentumState["momentumTrendLabel"] {
  if (
    input.degradationZoneCount >= 2 ||
    (input.organizationalMomentumScore < 0.38 && input.accelerationZoneCount >= 1) ||
    input.collapseRisk === "approaching"
  ) {
    return "accelerating_failure";
  }
  if (input.recoveryMomentumScore >= 0.58 && input.organizationalMomentumScore >= 0.52) {
    return "recovering";
  }
  if (
    input.organizationalMomentumScore >= 0.48 &&
    input.degradationZoneCount === 0 &&
    input.accelerationZoneCount === 0
  ) {
    return "stabilizing";
  }
  return "stagnating";
}
