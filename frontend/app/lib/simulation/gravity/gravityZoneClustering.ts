/**
 * D7:2:8 — Systemic risk gravity zone clustering.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  RegionGravityProfile,
  SystemicGravityLevel,
  SystemicRiskGravityZone,
} from "./systemicRiskGravityTypes.ts";
import { logGravityDev } from "./gravityDevLog.ts";

const CLUSTER_GRAVITY_THRESHOLD = 0.42;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function levelFromScore(avg: number, peak: number): SystemicGravityLevel {
  if (peak >= 0.75 || avg >= 0.68) return "critical";
  if (peak >= 0.58 || avg >= 0.52) return "high";
  if (peak >= 0.45 || avg >= 0.4) return "moderate";
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

export function clusterSystemicRiskGravityZones(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionGravityProfile[];
}): readonly SystemicRiskGravityZone[] {
  const profileByRegion = new Map(input.profiles.map((p) => [p.regionId, p]));
  const adjacency = buildAdjacency(input.topology);

  const elevated = input.profiles
    .filter((p) => p.gravityScore >= CLUSTER_GRAVITY_THRESHOLD)
    .map((p) => p.regionId)
    .sort();

  const visited = new Set<string>();
  const zones: SystemicRiskGravityZone[] = [];

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
          neighborProfile.gravityScore >= CLUSTER_GRAVITY_THRESHOLD - 0.08
        ) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    const clusterProfiles = cluster
      .map((id) => profileByRegion.get(id))
      .filter((p): p is RegionGravityProfile => Boolean(p));
    const scores = clusterProfiles.map((p) => p.gravityScore);
    const averageGravityScore = clamp01(scores.reduce((s, v) => s + v, 0) / scores.length);
    const peakGravityScore = clamp01(Math.max(...scores));

    const driverCounts = new Map<string, number>();
    for (const profile of clusterProfiles) {
      for (const driver of profile.drivers) {
        driverCounts.set(driver, (driverCounts.get(driver) ?? 0) + 1);
      }
    }
    const dominantGravityDrivers = Object.freeze(
      [...driverCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 4)
        .map(([driver]) => driver)
    );

    const sortedRegions = Object.freeze([...cluster].sort());
    zones.push(
      Object.freeze({
        zoneId: `gravity-zone::${sortedRegions.join("+")}`,
        affectedRegionIds: sortedRegions,
        gravityLevel: levelFromScore(averageGravityScore, peakGravityScore),
        averageGravityScore,
        peakGravityScore,
        dominantGravityDrivers,
        executiveLabel: `Systemic risk gravity zone across ${sortedRegions.join(", ")}`,
      })
    );
  }

  const sortedZones = Object.freeze(
    zones.sort((a, b) => b.peakGravityScore - a.peakGravityScore || a.zoneId.localeCompare(b.zoneId))
  );

  logGravityDev("GravityConvergence", { zoneCount: sortedZones.length });
  return sortedZones;
}
