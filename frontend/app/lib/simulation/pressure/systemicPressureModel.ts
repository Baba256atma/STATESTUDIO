/**
 * D7:2:3 — Systemic pressure and cascade risk scoring.
 */

import type {
  EnterprisePressureState,
  FragilityHotspot,
  PressurePropagationRecord,
  RegionPressureAccumulation,
} from "./dependencyPressureTypes.ts";
import { logPressureDev } from "./pressureDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function calculateSystemicPressureScore(
  accumulations: readonly RegionPressureAccumulation[]
): number {
  if (accumulations.length === 0) return 0.2;
  const avg = accumulations.reduce((sum, a) => sum + a.accumulatedPressure, 0) / accumulations.length;
  const peak = Math.max(...accumulations.map((a) => a.accumulatedPressure));
  return clamp01(avg * 0.6 + peak * 0.4);
}

export function calculateCascadeRiskScore(input: {
  accumulations: readonly RegionPressureAccumulation[];
  propagationRecords: readonly PressurePropagationRecord[];
  hotspots: readonly FragilityHotspot[];
  saturationRegionCount: number;
}): number {
  const propagationFactor = clamp01(input.propagationRecords.length * 0.04);
  const hotspotPenalty = clamp01(
    input.hotspots.filter((h) => h.severity === "critical").length * 0.15 +
      input.hotspots.filter((h) => h.severity === "high").length * 0.08
  );
  const saturationFactor = clamp01(input.saturationRegionCount * 0.12);
  const fragilityPeak =
    input.accumulations.length === 0
      ? 0.25
      : Math.max(...input.accumulations.map((a) => a.fragilityExposure));

  const score = clamp01(
    propagationFactor + hotspotPenalty + saturationFactor + fragilityPeak * 0.35
  );

  logPressureDev("DependencyPressure", {
    cascadeRiskScore: score,
    propagationRecords: input.propagationRecords.length,
  });

  return score;
}

export function classifyPressureStability(input: {
  systemicPressureScore: number;
  cascadeRiskScore: number;
  saturationRegionCount: number;
}): EnterprisePressureState["pressureStabilityLabel"] {
  if (
    input.systemicPressureScore > 0.72 ||
    input.cascadeRiskScore > 0.7 ||
    input.saturationRegionCount >= 3
  ) {
    return "critical";
  }
  if (input.systemicPressureScore > 0.52 || input.cascadeRiskScore > 0.45) {
    return "elevated";
  }
  return "stable";
}
