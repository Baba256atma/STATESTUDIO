/**
 * D7:2:5 — Recovery propagation intelligence (deterministic, explainable).
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { OperationalFragilityMap } from "../fragility/fragilityConcentrationTypes.ts";
import type {
  RecoveryPropagationRecord,
  RegionRecoveryProfile,
} from "./recoveryCapacityTypes.ts";
import { logRecoveryDev } from "./recoveryDevLog.ts";

const PROPAGATION_ATTENUATION = 0.7;
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

export function analyzeRecoveryPropagation(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionRecoveryProfile[];
  fragilityMap: OperationalFragilityMap;
}): readonly RecoveryPropagationRecord[] {
  const profileByRegion = new Map(input.profiles.map((p) => [p.regionId, p]));
  const adjacency = buildAdjacency(input.topology);
  const records: RecoveryPropagationRecord[] = [];

  const origins = [...input.profiles]
    .sort((a, b) => b.recoveryCapacityScore - a.recoveryCapacityScore)
    .slice(0, 4);

  for (const origin of origins) {
    const isStrongOrigin = origin.recoveryCapacityScore >= 0.55;
    const queue: Array<{ regionId: string; depth: number; strength: number }> = [
      { regionId: origin.regionId, depth: 0, strength: origin.recoveryCapacityScore },
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
        const propagatedStrength = clamp01(
          current.strength * PROPAGATION_ATTENUATION ** (current.depth + 1)
        );
        if (propagatedStrength < 0.06) continue;

        const outcome: RecoveryPropagationRecord["propagationOutcome"] =
          isStrongOrigin && (targetProfile?.recoveryCapacityScore ?? 0) >= 0.4
            ? "stabilization"
            : (targetFragility?.fragilityScore ?? 0) > 0.55
              ? "strain"
              : "stabilization";

        records.push(
          Object.freeze({
            recordId: `recovery-prop::${origin.regionId}::${nextRegionId}::${current.depth + 1}`,
            originRegionId: origin.regionId,
            affectedRegionId: nextRegionId,
            propagationOutcome: outcome,
            propagatedStrength,
            hopDepth: current.depth + 1,
            explanation:
              outcome === "stabilization"
                ? `Recovery capacity from ${origin.regionId} may reduce dependency pressure toward ${nextRegionId}.`
                : `Recovery strain may amplify pressure toward ${nextRegionId} without coordination support.`,
          })
        );

        queue.push({
          regionId: nextRegionId,
          depth: current.depth + 1,
          strength: propagatedStrength,
        });
      }
    }
  }

  logRecoveryDev("Recovery", { propagationRecordCount: records.length });

  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
