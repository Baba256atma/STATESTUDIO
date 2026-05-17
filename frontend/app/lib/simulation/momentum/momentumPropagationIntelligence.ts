/**
 * D7:2:6 — Momentum propagation intelligence (deterministic, explainable).
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type {
  MomentumDirection,
  MomentumPropagationRecord,
  RegionMomentumProfile,
} from "./operationalMomentumTypes.ts";
import { logMomentumDev } from "./momentumDevLog.ts";

const PROPAGATION_ATTENUATION = 0.68;
const MAX_PROPAGATION_DEPTH = 6;

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

export function analyzeMomentumPropagation(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionMomentumProfile[];
  fragilityMap: OperationalFragilityMap;
}): readonly MomentumPropagationRecord[] {
  const profileByRegion = new Map(input.profiles.map((p) => [p.regionId, p]));
  const adjacency = buildAdjacency(input.topology);
  const records: MomentumPropagationRecord[] = [];

  const origins = [...input.profiles]
    .sort((a, b) => Math.abs(b.momentumVector) - Math.abs(a.momentumVector))
    .slice(0, 5);

  for (const origin of origins) {
    if (Math.abs(origin.momentumVector) < 0.1) continue;

    const propagatedDirection: MomentumDirection =
      origin.momentumVector > 0.15
        ? "stabilizing"
        : origin.momentumVector < -0.15
          ? "degrading"
          : "stagnating";

    const queue: Array<{ regionId: string; depth: number; strength: number }> = [
      {
        regionId: origin.regionId,
        depth: 0,
        strength: Math.abs(origin.momentumVector),
      },
    ];
    const visited = new Set<string>([origin.regionId]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= MAX_PROPAGATION_DEPTH) continue;

      for (const nextRegionId of adjacency.get(current.regionId) ?? []) {
        if (visited.has(nextRegionId)) continue;
        visited.add(nextRegionId);

        const targetProfile = profileByRegion.get(nextRegionId);
        const targetFragility = input.fragilityMap.regionProfiles.find(
          (p) => p.regionId === nextRegionId
        );
        const propagatedIntensity = clamp01(
          current.strength * PROPAGATION_ATTENUATION ** (current.depth + 1)
        );
        if (propagatedIntensity < 0.06) continue;

        const direction: MomentumDirection =
          propagatedDirection === "stabilizing" &&
          (targetProfile?.recoveryMomentum ?? 0) >= 0.4
            ? "recovering"
            : propagatedDirection === "degrading" &&
                (targetFragility?.fragilityScore ?? 0) > 0.5
              ? "accelerating"
              : propagatedDirection;

        records.push(
          Object.freeze({
            recordId: `momentum-prop::${origin.regionId}::${nextRegionId}::${current.depth + 1}`,
            originRegionId: origin.regionId,
            affectedRegionId: nextRegionId,
            propagatedDirection: direction,
            propagatedIntensity,
            hopDepth: current.depth + 1,
            explanation:
              direction === "stabilizing" || direction === "recovering"
                ? `Positive momentum from ${origin.regionId} may support cross-domain stabilization toward ${nextRegionId}.`
                : `Degradation momentum from ${origin.regionId} may expand instability toward ${nextRegionId}.`,
          })
        );

        queue.push({
          regionId: nextRegionId,
          depth: current.depth + 1,
          strength: propagatedIntensity,
        });
      }
    }
  }

  logMomentumDev("RecoveryMomentum", { propagationRecordCount: records.length });

  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
