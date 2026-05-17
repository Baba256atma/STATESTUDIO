/**
 * D7:2:8 — Systemic collapse pressure and convergence scoring.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type {
  EnterpriseRiskGravityState,
  RegionGravityProfile,
  SystemicRiskGravityZone,
} from "./systemicRiskGravityTypes.ts";
import { logGravityDev } from "./gravityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function calculateSystemicCollapsePressure(input: {
  profiles: readonly RegionGravityProfile[];
  gravityZones: readonly SystemicRiskGravityZone[];
  fragilityMap: OperationalFragilityMap;
  equilibriumState: EnterpriseEquilibriumState;
  momentumState?: EnterpriseMomentumState;
}): number {
  if (input.profiles.length === 0) return 0.25;
  const peakGravity = Math.max(...input.profiles.map((p) => p.gravityScore));
  const avgConvergence =
    input.profiles.reduce((s, p) => s + p.collapseConvergence, 0) / input.profiles.length;
  const criticalZoneFactor = clamp01(
    input.gravityZones.filter((z) => z.gravityLevel === "critical").length * 0.12 +
      input.gravityZones.filter((z) => z.gravityLevel === "high").length * 0.06
  );
  const momentumPenalty =
    input.momentumState?.momentumTrendLabel === "accelerating_failure" ? 0.15 : 0;

  const score = clamp01(
    peakGravity * 0.35 +
      avgConvergence * 0.3 +
      input.fragilityMap.systemicExposureScore * 0.2 +
      (1 - input.equilibriumState.equilibriumScore) * 0.15 +
      criticalZoneFactor +
      momentumPenalty
  );

  logGravityDev("CollapsePressure", { systemicCollapsePressure: score });
  return score;
}

export function calculateGravityConvergenceScore(input: {
  profiles: readonly RegionGravityProfile[];
  gravityZones: readonly SystemicRiskGravityZone[];
  convergenceRecordCount: number;
}): number {
  const multiRegionZones = input.gravityZones.filter((z) => z.affectedRegionIds.length >= 2).length;
  const avgAttraction =
    input.profiles.length === 0
      ? 0.3
      : input.profiles.reduce((s, p) => s + p.instabilityAttraction, 0) / input.profiles.length;

  return clamp01(
    avgAttraction * 0.45 + multiRegionZones * 0.08 + input.convergenceRecordCount * 0.03
  );
}

export function classifyGravityRiskLabel(input: {
  systemicCollapsePressure: number;
  gravityConvergenceScore: number;
  criticalZoneCount: number;
  equilibriumLabel: EnterpriseEquilibriumState["equilibriumLabel"];
}): EnterpriseRiskGravityState["gravityRiskLabel"] {
  if (
    input.systemicCollapsePressure > 0.72 ||
    input.criticalZoneCount >= 2 ||
    input.equilibriumLabel === "critical_imbalance"
  ) {
    return "critical";
  }
  if (input.systemicCollapsePressure > 0.52 || input.gravityConvergenceScore > 0.55) {
    return "elevated";
  }
  return "contained";
}
