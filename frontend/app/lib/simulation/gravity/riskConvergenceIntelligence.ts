/**
 * D7:2:8 — Risk convergence propagation intelligence (deterministic).
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { RegionGravityProfile, RiskConvergenceRecord } from "./systemicRiskGravityTypes.ts";
import { logGravityDev } from "./gravityDevLog.ts";

const CONVERGENCE_ATTENUATION = 0.68;
const MAX_CONVERGENCE_DEPTH = 6;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function buildAdjacency(topology: OperationalUniverseTopology): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  const addEdge = (from: string, to: string) => {
    const list = adjacency.get(from) ?? [];
    if (!list.includes(to)) list.push(to);
    adjacency.set(from, list);
  };
  for (const rel of topology.crossDomainRelationships) {
    addEdge(rel.sourceRegionId, rel.targetRegionId);
  }
  for (const channel of topology.dependencyChannels) {
    addEdge(channel.fromRegionId, channel.toRegionId);
  }
  for (const [from, targets] of adjacency) {
    adjacency.set(from, [...targets].sort());
  }
  return adjacency;
}

export function analyzeRiskConvergence(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionGravityProfile[];
}): readonly RiskConvergenceRecord[] {
  const adjacency = buildAdjacency(input.topology);
  const profileByRegion = new Map(input.profiles.map((p) => [p.regionId, p]));
  const records: RiskConvergenceRecord[] = [];

  const origins = [...input.profiles]
    .filter((p) => p.collapseConvergence >= 0.48)
    .sort((a, b) => b.collapseConvergence - a.collapseConvergence)
    .slice(0, 5);

  for (const origin of origins) {
    const queue: Array<{ regionId: string; depth: number; strength: number }> = [
      { regionId: origin.regionId, depth: 0, strength: origin.collapseConvergence },
    ];
    const visited = new Set<string>([origin.regionId]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= MAX_CONVERGENCE_DEPTH) continue;

      for (const nextRegionId of adjacency.get(current.regionId) ?? []) {
        if (visited.has(nextRegionId)) continue;
        visited.add(nextRegionId);

        const convergenceIntensity = clamp01(
          current.strength * CONVERGENCE_ATTENUATION ** (current.depth + 1)
        );
        if (convergenceIntensity < 0.07) continue;

        const targetProfile = profileByRegion.get(nextRegionId);
        records.push(
          Object.freeze({
            recordId: `convergence::${origin.regionId}::${nextRegionId}::${current.depth + 1}`,
            originRegionId: origin.regionId,
            affectedRegionId: nextRegionId,
            convergenceIntensity,
            hopDepth: current.depth + 1,
            explanation: `Collapse convergence pressure from ${origin.regionId} propagates toward ${nextRegionId}${targetProfile && targetProfile.gravityScore > 0.55 ? " with elevated local gravity" : ""}.`,
          })
        );

        queue.push({
          regionId: nextRegionId,
          depth: current.depth + 1,
          strength: convergenceIntensity,
        });
      }
    }
  }

  logGravityDev("GravityConvergence", { recordCount: records.length });

  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
