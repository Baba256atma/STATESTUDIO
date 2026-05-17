/**
 * D7:2:3 — Operational saturation and fragility hotspot detection.
 */

import type {
  DependencyPressureSignal,
  FragilityHotspot,
  RegionPressureAccumulation,
  RegionPressureMetrics,
} from "./dependencyPressureTypes.ts";
import type { OperationalRegion } from "../topology/topologyTypes.ts";
import { logPressureDev } from "./pressureDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function detectSaturationRegions(input: {
  accumulations: readonly RegionPressureAccumulation[];
  regionMetrics?: Readonly<Record<string, RegionPressureMetrics>>;
}): readonly string[] {
  const saturated: string[] = [];

  for (const acc of input.accumulations) {
    const metrics = input.regionMetrics?.[acc.regionId];
    const load = clamp01(metrics?.operationalLoad ?? 0.35);
    const recoveryStrain = clamp01(metrics?.recoveryStrain ?? 0.25);

    if (acc.accumulatedPressure >= 0.72) {
      saturated.push(acc.regionId);
    } else if (acc.dependencyConcentration >= 0.75 && acc.inboundPressure >= 0.6) {
      saturated.push(acc.regionId);
    } else if (load > 0.7 && recoveryStrain > 0.55) {
      saturated.push(acc.regionId);
    } else if (acc.regionId === "executive" && (metrics?.approvalDelay ?? 0) > 0.6) {
      saturated.push(acc.regionId);
    }
  }

  logPressureDev("Saturation", {
    count: saturated.length,
    regions: saturated.sort(),
  });

  return Object.freeze([...new Set(saturated)].sort());
}

export function detectFragilityHotspots(input: {
  regions: readonly OperationalRegion[];
  signals: readonly DependencyPressureSignal[];
  accumulations: readonly RegionPressureAccumulation[];
  saturationRegions: readonly string[];
  regionMetrics?: Readonly<Record<string, RegionPressureMetrics>>;
}): readonly FragilityHotspot[] {
  const hotspots: FragilityHotspot[] = [];
  const accumulationByRegion = new Map(input.accumulations.map((a) => [a.regionId, a]));
  const saturatedSet = new Set(input.saturationRegions);

  for (const region of input.regions) {
    const acc = accumulationByRegion.get(region.regionId);
    const metrics = input.regionMetrics?.[region.regionId];
    const fragility = clamp01(metrics?.fragility ?? region.fragilityScore ?? 0.28);
    const contributing = input.signals
      .filter(
        (s) =>
          s.targetRegionId === region.regionId ||
          (s.sourceRegionId === region.regionId && s.targetRegionId === region.regionId)
      )
      .map((s) => s.signalId)
      .sort();

    let severity: FragilityHotspot["severity"] | null = null;
    let reason = "";

    if (saturatedSet.has(region.regionId) && fragility > 0.55) {
      severity = "critical";
      reason = `${region.label} is approaching operational saturation under concentrated fragility.`;
    } else if (acc && acc.accumulatedPressure >= 0.65 && acc.dependencyConcentration >= 0.6) {
      severity = "high";
      reason = `${region.label} shows high dependency concentration with elevated accumulated pressure.`;
    } else if (region.regionId === "logistics" && acc && acc.inboundPressure > 0.55) {
      severity = "high";
      reason =
        "Logistics dependency pressure is elevated due to upstream manufacturing or recovery instability.";
    } else if (region.regionId === "executive" && (metrics?.approvalDelay ?? 0) > 0.5) {
      severity = "moderate";
      reason = "Executive approval bottleneck is slowing operational recovery.";
    } else if (acc && acc.fragilityExposure > 0.5 && acc.inboundPressure > 0.45) {
      severity = "moderate";
      reason = `${region.label} absorbs dependency stress under rising fragility exposure.`;
    } else if (region.regionId === "manufacturing" && metrics?.recoveryStrain && metrics.recoveryStrain > 0.6) {
      severity = "moderate";
      reason = "Manufacturing recovery strain is amplifying downstream operational pressure.";
    }

    if (severity) {
      hotspots.push(
        Object.freeze({
          hotspotId: `hotspot::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          contributingSignalIds: Object.freeze(contributing),
        })
      );
    }
  }

  logPressureDev("PressureHotspot", {
    count: hotspots.length,
    regions: hotspots.map((h) => h.regionId),
  });

  return Object.freeze(hotspots.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
