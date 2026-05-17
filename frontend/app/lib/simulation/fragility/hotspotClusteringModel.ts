/**
 * D7:2:4 — Hotspot clustering and concentration zone detection.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  FragilityConcentrationLevel,
  FragilityConcentrationZone,
  RegionFragilityProfile,
} from "./fragilityConcentrationTypes.ts";
import { logFragilityDev } from "./fragilityDevLog.ts";

const CLUSTER_FRAGILITY_THRESHOLD = 0.42;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function levelFromScore(avg: number, peak: number): FragilityConcentrationLevel {
  if (peak >= 0.75 || avg >= 0.68) return "critical";
  if (peak >= 0.6 || avg >= 0.55) return "high";
  if (peak >= 0.48 || avg >= 0.42) return "moderate";
  return "low";
}

function buildAdjacency(topology: OperationalUniverseTopology): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>();
  const addEdge = (a: string, b: string) => {
    if (a === b) return;
    const setA = adjacency.get(a) ?? new Set();
    setA.add(b);
    adjacency.set(a, setA);
    const setB = adjacency.get(b) ?? new Set();
    setB.add(a);
    adjacency.set(b, setB);
  };

  for (const rel of topology.crossDomainRelationships) {
    addEdge(rel.sourceRegionId, rel.targetRegionId);
  }
  for (const channel of topology.dependencyChannels) {
    addEdge(channel.fromRegionId, channel.toRegionId);
  }
  return adjacency;
}

export function clusterFragilityConcentrationZones(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionFragilityProfile[];
}): readonly FragilityConcentrationZone[] {
  const profileByRegion = new Map(input.profiles.map((p) => [p.regionId, p]));
  const adjacency = buildAdjacency(input.topology);
  const elevated = input.profiles
    .filter((p) => p.fragilityScore >= CLUSTER_FRAGILITY_THRESHOLD)
    .map((p) => p.regionId)
    .sort();

  const visited = new Set<string>();
  const zones: FragilityConcentrationZone[] = [];

  for (const startId of elevated) {
    if (visited.has(startId)) continue;

    const cluster: string[] = [];
    const queue = [startId];
    visited.add(startId);

    while (queue.length > 0) {
      const current = queue.shift()!;
      cluster.push(current);

      for (const neighbor of adjacency.get(current) ?? []) {
        const neighborProfile = profileByRegion.get(neighbor);
        if (
          !visited.has(neighbor) &&
          neighborProfile &&
          neighborProfile.fragilityScore >= CLUSTER_FRAGILITY_THRESHOLD - 0.08
        ) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    if (cluster.length === 0) continue;

    const clusterProfiles = cluster
      .map((id) => profileByRegion.get(id))
      .filter((p): p is RegionFragilityProfile => Boolean(p));
    const scores = clusterProfiles.map((p) => p.fragilityScore);
    const averageFragilityScore = clamp01(
      scores.reduce((s, v) => s + v, 0) / scores.length
    );
    const peakFragilityScore = clamp01(Math.max(...scores));

    const driverCounts = new Map<string, number>();
    for (const profile of clusterProfiles) {
      for (const driver of profile.drivers) {
        driverCounts.set(driver, (driverCounts.get(driver) ?? 0) + 1);
      }
    }
    const dominantFragilityDrivers = Object.freeze(
      [...driverCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 4)
        .map(([driver]) => driver)
    );

    const sortedRegions = Object.freeze([...cluster].sort());
    const concentrationLevel = levelFromScore(averageFragilityScore, peakFragilityScore);

    zones.push(
      Object.freeze({
        zoneId: `zone::${sortedRegions.join("+")}`,
        affectedRegionIds: sortedRegions,
        concentrationLevel,
        averageFragilityScore,
        peakFragilityScore,
        dominantFragilityDrivers,
        executiveLabel: `Fragility concentration across ${sortedRegions.join(", ")}`,
      })
    );
  }

  const sortedZones = Object.freeze(
    zones.sort((a, b) => b.peakFragilityScore - a.peakFragilityScore || a.zoneId.localeCompare(b.zoneId))
  );

  logFragilityDev("FragilityCluster", {
    zoneCount: sortedZones.length,
    levels: sortedZones.map((z) => z.concentrationLevel),
  });

  return sortedZones;
}
