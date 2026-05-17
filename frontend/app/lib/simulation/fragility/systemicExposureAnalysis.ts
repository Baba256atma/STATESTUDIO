/**
 * D7:2:4 — Systemic exposure and cascade potential analysis.
 */

import type {
  FragilityConcentrationZone,
  OperationalFragilityMap,
  RegionFragilityProfile,
} from "./fragilityConcentrationTypes.ts";
import { logFragilityDev } from "./fragilityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function calculateConcentrationDensity(input: {
  profiles: readonly RegionFragilityProfile[];
  zones: readonly FragilityConcentrationZone[];
}): number {
  if (input.profiles.length === 0) return 0;
  const elevatedCount = input.profiles.filter((p) => p.fragilityScore >= 0.45).length;
  const zoneCoverage = new Set(input.zones.flatMap((z) => z.affectedRegionIds)).size;
  return clamp01((elevatedCount / input.profiles.length) * 0.55 + (zoneCoverage / input.profiles.length) * 0.45);
}

export function calculateSystemicExposureScore(input: {
  profiles: readonly RegionFragilityProfile[];
  zones: readonly FragilityConcentrationZone[];
  concentrationDensity: number;
}): number {
  if (input.profiles.length === 0) return 0.2;
  const avgFragility =
    input.profiles.reduce((s, p) => s + p.fragilityScore, 0) / input.profiles.length;
  const peakFragility = Math.max(...input.profiles.map((p) => p.fragilityScore));
  const criticalZoneFactor = clamp01(
    input.zones.filter((z) => z.concentrationLevel === "critical").length * 0.15 +
      input.zones.filter((z) => z.concentrationLevel === "high").length * 0.08
  );
  const overloadFactor = clamp01(
    input.profiles.reduce((s, p) => s + p.dependencyOverload, 0) / input.profiles.length
  );

  const score = clamp01(
    avgFragility * 0.35 +
      peakFragility * 0.25 +
      input.concentrationDensity * 0.2 +
      criticalZoneFactor +
      overloadFactor * 0.15
  );

  logFragilityDev("SystemicExposure", {
    systemicExposureScore: score,
    zoneCount: input.zones.length,
  });

  return score;
}

export function calculateCascadePotentialScore(input: {
  profiles: readonly RegionFragilityProfile[];
  zones: readonly FragilityConcentrationZone[];
  systemicExposureScore: number;
}): number {
  const susceptibilityAvg =
    input.profiles.length === 0
      ? 0.25
      : input.profiles.reduce((s, p) => s + p.propagationSusceptibility, 0) / input.profiles.length;
  const recoveryWeaknessAvg =
    input.profiles.length === 0
      ? 0.25
      : input.profiles.reduce((s, p) => s + p.recoveryWeakness, 0) / input.profiles.length;
  const multiRegionZones = input.zones.filter((z) => z.affectedRegionIds.length >= 2).length;

  return clamp01(
    input.systemicExposureScore * 0.4 +
      susceptibilityAvg * 0.25 +
      recoveryWeaknessAvg * 0.2 +
      multiRegionZones * 0.06
  );
}

export function classifyCollapseRiskLabel(input: {
  systemicExposureScore: number;
  cascadePotentialScore: number;
  criticalRegionCount: number;
}): OperationalFragilityMap["collapseRiskLabel"] {
  if (
    input.systemicExposureScore > 0.72 ||
    input.cascadePotentialScore > 0.68 ||
    input.criticalRegionCount >= 2
  ) {
    return "approaching";
  }
  if (input.systemicExposureScore > 0.52 || input.cascadePotentialScore > 0.48) {
    return "elevated";
  }
  return "contained";
}
