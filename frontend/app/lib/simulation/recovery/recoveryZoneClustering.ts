/**
 * D7:2:5 — Recovery capacity zone clustering.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  RecoveryCapacityLevel,
  RecoveryCapacityZone,
  RegionRecoveryProfile,
} from "./recoveryCapacityTypes.ts";
import { logRecoveryDev } from "./recoveryDevLog.ts";

const CLUSTER_RECOVERY_THRESHOLD = 0.38;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function levelFromScore(avg: number): RecoveryCapacityLevel {
  if (avg >= 0.72) return "strong";
  if (avg >= 0.55) return "stable";
  if (avg >= 0.38) return "limited";
  return "weak";
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

export function clusterRecoveryCapacityZones(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionRecoveryProfile[];
}): readonly RecoveryCapacityZone[] {
  const profileByRegion = new Map(input.profiles.map((p) => [p.regionId, p]));
  const adjacency = buildAdjacency(input.topology);

  const strongOrStable = input.profiles
    .filter((p) => p.recoveryCapacityScore >= CLUSTER_RECOVERY_THRESHOLD)
    .map((p) => p.regionId)
    .sort();

  const visited = new Set<string>();
  const zones: RecoveryCapacityZone[] = [];

  for (const startId of strongOrStable) {
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
          neighborProfile.recoveryCapacityScore >= CLUSTER_RECOVERY_THRESHOLD - 0.1
        ) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    const clusterProfiles = cluster
      .map((id) => profileByRegion.get(id))
      .filter((p): p is RegionRecoveryProfile => Boolean(p));
    const scores = clusterProfiles.map((p) => p.recoveryCapacityScore);
    const averageRecoveryScore = clamp01(scores.reduce((s, v) => s + v, 0) / scores.length);
    const peakRecoveryScore = clamp01(Math.max(...scores));

    const driverCounts = new Map<string, number>();
    for (const profile of clusterProfiles) {
      for (const driver of profile.drivers) {
        driverCounts.set(driver, (driverCounts.get(driver) ?? 0) + 1);
      }
    }
    const stabilizationDrivers = Object.freeze(
      [...driverCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 4)
        .map(([driver]) => driver)
    );

    const sortedRegions = Object.freeze([...cluster].sort());
    zones.push(
      Object.freeze({
        zoneId: `recovery-zone::${sortedRegions.join("+")}`,
        affectedRegionIds: sortedRegions,
        recoveryCapacity: levelFromScore(averageRecoveryScore),
        averageRecoveryScore,
        peakRecoveryScore,
        stabilizationDrivers,
        executiveLabel: `Recovery capacity zone across ${sortedRegions.join(", ")}`,
      })
    );
  }

  const sortedZones = Object.freeze(
    zones.sort((a, b) => b.averageRecoveryScore - a.averageRecoveryScore || a.zoneId.localeCompare(b.zoneId))
  );

  logRecoveryDev("Recovery", { zoneCount: sortedZones.length });
  return sortedZones;
}
