/**
 * D7:2:8 — Instability attractor detection.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  InstabilityAttractor,
  RegionGravityProfile,
  SystemicRiskGravityZone,
} from "./systemicRiskGravityTypes.ts";
import { logGravityDev } from "./gravityDevLog.ts";

export function detectInstabilityAttractors(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionGravityProfile[];
  gravityZones: readonly SystemicRiskGravityZone[];
}): readonly InstabilityAttractor[] {
  const zoneByRegion = new Map<string, string>();
  for (const zone of input.gravityZones) {
    for (const regionId of zone.affectedRegionIds) {
      zoneByRegion.set(regionId, zone.zoneId);
    }
  }

  const attractors: InstabilityAttractor[] = [];

  for (const region of input.topology.operationalRegions) {
    const profile = input.profiles.find((p) => p.regionId === region.regionId);
    if (!profile) continue;

    let severity: InstabilityAttractor["severity"] | null = null;
    let reason = "";

    if (profile.gravityScore >= 0.72 && profile.recoverySuppression >= 0.6) {
      severity = "critical";
      reason = `${region.label} acts as a critical systemic instability attractor under recovery suppression.`;
    } else if (profile.instabilityAttraction >= 0.65 && profile.dependencyCentrality >= 0.55) {
      severity = "high";
      reason = `${region.label} attracts instability through high dependency centrality and fragility pull.`;
    } else if (region.regionId === "logistics" && profile.collapseConvergence >= 0.55) {
      severity = "high";
      reason = "Logistics exerts destabilizing gravitational influence on cross-domain operational flow.";
    } else if (profile.destabilizingInfluence >= 0.55 && profile.gravityScore >= 0.5) {
      severity = "moderate";
      reason = `${region.label} exerts moderate destabilizing influence on enterprise balance.`;
    }

    if (severity) {
      const zoneId = zoneByRegion.get(region.regionId);
      attractors.push(
        Object.freeze({
          attractorId: `attractor::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          contributingZoneIds: Object.freeze(zoneId ? [zoneId] : []),
        })
      );
    }
  }

  logGravityDev("InstabilityAttractor", {
    count: attractors.length,
    regions: attractors.map((a) => a.regionId),
  });

  return Object.freeze(attractors.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}

export function identifyConvergenceHotspots(
  profiles: readonly RegionGravityProfile[]
): readonly string[] {
  return Object.freeze(
    profiles
      .filter((p) => p.collapseConvergence >= 0.58)
      .sort((a, b) => b.collapseConvergence - a.collapseConvergence)
      .map((p) => p.regionId)
  );
}

export function identifyRecoverySuppressionZones(
  profiles: readonly RegionGravityProfile[]
): readonly string[] {
  return Object.freeze(
    profiles
      .filter((p) => p.recoverySuppression >= 0.55)
      .map((p) => p.regionId)
      .sort()
  );
}
