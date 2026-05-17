/**
 * D7:2:5 — Organizational resilience modeling.
 */

import type {
  OrganizationalRecoveryState,
  RegionRecoveryProfile,
  RecoveryCapacityZone,
} from "./recoveryCapacityTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import { logRecoveryDev } from "./recoveryDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function calculateResilienceScore(input: {
  profiles: readonly RegionRecoveryProfile[];
  fragilityMap: OperationalFragilityMap;
  zones: readonly RecoveryCapacityZone[];
}): number {
  if (input.profiles.length === 0) return 0.35;
  const avgRecovery =
    input.profiles.reduce((s, p) => s + p.recoveryCapacityScore, 0) / input.profiles.length;
  const avgDegradation =
    input.profiles.reduce((s, p) => s + p.resilienceDegradation, 0) / input.profiles.length;
  const strongZoneFactor = clamp01(
    input.zones.filter((z) => z.recoveryCapacity === "strong").length * 0.1 +
      input.zones.filter((z) => z.recoveryCapacity === "stable").length * 0.05
  );
  const fragilityPenalty = clamp01(input.fragilityMap.systemicExposureScore * 0.35);

  const score = clamp01(
    avgRecovery * 0.45 + (1 - avgDegradation) * 0.25 + strongZoneFactor - fragilityPenalty * 0.35
  );

  logRecoveryDev("Resilience", { resilienceScore: score });
  return score;
}

export function calculateStabilizationPotential(input: {
  profiles: readonly RegionRecoveryProfile[];
  fragilityMap: OperationalFragilityMap;
}): number {
  const efficiencyAvg =
    input.profiles.length === 0
      ? 0.4
      : input.profiles.reduce((s, p) => s + p.stabilizationEfficiency, 0) / input.profiles.length;
  const coordinationAvg =
    input.profiles.length === 0
      ? 0.4
      : input.profiles.reduce((s, p) => s + p.recoveryCoordination, 0) / input.profiles.length;

  return clamp01(
    efficiencyAvg * 0.45 +
      coordinationAvg * 0.35 +
      (1 - input.fragilityMap.cascadePotentialScore) * 0.2
  );
}

export function calculateRecoveryThroughputScore(
  profiles: readonly RegionRecoveryProfile[]
): number {
  if (profiles.length === 0) return 0.4;
  return clamp01(
    profiles.reduce((s, p) => s + p.recoveryThroughput, 0) / profiles.length
  );
}

export function classifyResilienceLabel(input: {
  resilienceScore: number;
  fragilityMap: OperationalFragilityMap;
  bottleneckCount: number;
}): OrganizationalRecoveryState["resilienceLabel"] {
  if (
    input.resilienceScore < 0.38 ||
    input.fragilityMap.collapseRiskLabel === "approaching" ||
    input.bottleneckCount >= 3
  ) {
    return "fragile";
  }
  if (input.resilienceScore < 0.58 || input.fragilityMap.collapseRiskLabel === "elevated") {
    return "strained";
  }
  return "robust";
}
