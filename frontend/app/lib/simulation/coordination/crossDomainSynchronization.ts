/**
 * D7:3:2 — Cross-domain executive synchronization intelligence.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { CrossDomainSynchronizationRecord } from "./coordinationDynamicsTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logCoordinationDev } from "./coordinationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

function actorsCoveringRegions(
  actorState: HumanActorSimulationState,
  regionIds: string[]
): string[] {
  return actorState.activeActors
    .filter((a) => regionIds.some((r) => a.assignedRegionIds.includes(r)))
    .map((a) => a.actorId)
    .sort();
}

export function analyzeCrossDomainSynchronization(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  communicationDelayFactor?: number;
}): readonly CrossDomainSynchronizationRecord[] {
  const records: CrossDomainSynchronizationRecord[] = [];
  const seen = new Set<string>();
  const delay = clamp01(input.communicationDelayFactor ?? 0);

  for (const rel of input.topology.crossDomainRelationships) {
    const key = `${rel.sourceRegionId}|${rel.targetRegionId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const participants = actorsCoveringRegions(input.actorState, [
      rel.sourceRegionId,
      rel.targetRegionId,
    ]);
    const execBoost = input.actorState.activeActors
      .filter((a) => a.role === "executive" || a.role === "coordinator")
      .reduce((s, a) => s + a.coordinationContribution, 0);
    const execCount = Math.max(
      1,
      input.actorState.activeActors.filter((a) => a.role === "executive" || a.role === "coordinator").length
    );

    const synchronizationQuality = clamp01(
      (execBoost / execCount) * 0.5 + (1 - input.actorState.coordinationPressure) * 0.35 - delay * 0.15
    );
    const frictionScore = clamp01(
      input.actorState.coordinationPressure * 0.4 + delay * 0.25 + (1 - synchronizationQuality) * 0.35
    );

    if (synchronizationQuality < 0.25 && frictionScore < 0.35) continue;

    records.push(
      Object.freeze({
        recordId: `sync::${key}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        synchronizationQuality,
        frictionScore,
        participatingActorIds: Object.freeze(participants),
        explanation:
          synchronizationQuality >= 0.55
            ? `Executive synchronization between ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} supports operational stability.`
            : `Cross-domain coordination between ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} shows friction under current pressure.`,
      })
    );
  }

  logCoordinationDev("Synchronization", { recordCount: records.length });

  return Object.freeze(
    records.sort(
      (a, b) => b.frictionScore - a.frictionScore || a.recordId.localeCompare(b.recordId)
    )
  );
}
