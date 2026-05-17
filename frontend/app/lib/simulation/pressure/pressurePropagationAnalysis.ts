/**
 * D7:2:3 — Deterministic dependency stress propagation analysis.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  DependencyPressureSignal,
  DependencyPressureType,
  PressurePropagationRecord,
  RegionPressureAccumulation,
} from "./dependencyPressureTypes.ts";
import { DEFAULT_MAX_PRESSURE_PROPAGATION_DEPTH } from "./pressureGuards.ts";
import { logPressureDev } from "./pressureDevLog.ts";

const PROPAGATION_ATTENUATION = 0.72;

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
    adjacency.set(
      from,
      [...targets].sort((a, b) => a.localeCompare(b))
    );
  }
  return adjacency;
}

export function analyzePressurePropagation(input: {
  topology: OperationalUniverseTopology;
  signals: readonly DependencyPressureSignal[];
  regionAccumulations: readonly RegionPressureAccumulation[];
}): {
  propagationRecords: readonly PressurePropagationRecord[];
  adjustedAccumulations: readonly RegionPressureAccumulation[];
} {
  const adjacency = buildAdjacency(input.topology);
  const records: PressurePropagationRecord[] = [];
  const accumulationByRegion = new Map(
    input.regionAccumulations.map((a) => [a.regionId, { ...a }])
  );

  const origins = [...input.regionAccumulations]
    .filter((a) => a.accumulatedPressure >= 0.5)
    .sort((a, b) => b.accumulatedPressure - a.accumulatedPressure)
    .slice(0, 6);

  for (const origin of origins) {
    const originSignals = input.signals.filter((s) => s.sourceRegionId === origin.regionId);
    const dominantType: DependencyPressureType =
      originSignals[0]?.pressureType ?? "operational";
    const baseIntensity = origin.accumulatedPressure;

    const queue: Array<{ regionId: string; depth: number; intensity: number }> = [
      { regionId: origin.regionId, depth: 0, intensity: baseIntensity },
    ];
    const visited = new Set<string>([origin.regionId]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= DEFAULT_MAX_PRESSURE_PROPAGATION_DEPTH) continue;

      for (const nextRegionId of adjacency.get(current.regionId) ?? []) {
        if (visited.has(nextRegionId)) continue;
        visited.add(nextRegionId);

        const propagatedIntensity = clamp01(
          current.intensity * PROPAGATION_ATTENUATION ** (current.depth + 1)
        );
        if (propagatedIntensity < 0.08) continue;

        records.push(
          Object.freeze({
            recordId: `propagation::${origin.regionId}::${nextRegionId}::${current.depth + 1}`,
            originRegionId: origin.regionId,
            affectedRegionId: nextRegionId,
            propagatedIntensity,
            hopDepth: current.depth + 1,
            pressureType: dominantType,
            explanation: `Pressure from ${origin.regionId} propagated to ${nextRegionId} at depth ${current.depth + 1}.`,
          })
        );

        const existing = accumulationByRegion.get(nextRegionId);
        if (existing) {
          accumulationByRegion.set(
            nextRegionId,
            Object.freeze({
              ...existing,
              accumulatedPressure: clamp01(
                existing.accumulatedPressure + propagatedIntensity * 0.35
              ),
              inboundPressure: clamp01(existing.inboundPressure + propagatedIntensity * 0.25),
            })
          );
        }

        queue.push({
          regionId: nextRegionId,
          depth: current.depth + 1,
          intensity: propagatedIntensity,
        });
      }
    }
  }

  const sortedRecords = Object.freeze(
    records.sort((a, b) => a.recordId.localeCompare(b.recordId))
  );

  logPressureDev("PressureCascade", {
    recordCount: sortedRecords.length,
    origins: origins.map((o) => o.regionId),
  });

  const adjustedAccumulations = Object.freeze(
    [...accumulationByRegion.values()].sort((a, b) => a.regionId.localeCompare(b.regionId))
  );

  return {
    propagationRecords: sortedRecords,
    adjustedAccumulations,
  };
}
