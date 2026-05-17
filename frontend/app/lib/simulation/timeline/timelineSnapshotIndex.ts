/**
 * D7:1:4 — Deterministic snapshot indexing for operational timelines.
 */

import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { TimelineSnapshotReference } from "./timelineTypes.ts";

export function buildTimelineSnapshotId(timelineId: string, tick: number, fingerprint: string): string {
  const fp = String(fingerprint ?? "").slice(0, 12);
  return `${timelineId}::tick::${tick}::${fp}`;
}

export function buildTimelineSnapshotReference(
  timelineId: string,
  snapshot: SimulationStateSnapshot
): TimelineSnapshotReference {
  const tick = snapshot.timestamp.tick;
  return {
    tick,
    snapshotId: buildTimelineSnapshotId(timelineId, tick, snapshot.fingerprint),
    createdAt: snapshot.timestamp.simulatedAt,
    fingerprint: snapshot.fingerprint,
  };
}

export function indexSnapshotsForTimeline(
  timelineId: string,
  snapshots: readonly SimulationStateSnapshot[]
): TimelineSnapshotReference[] {
  return [...snapshots]
    .sort((a, b) => a.timestamp.tick - b.timestamp.tick)
    .map((snap) => buildTimelineSnapshotReference(timelineId, snap));
}

export function findSnapshotReferenceAtTick(
  index: readonly TimelineSnapshotReference[],
  tick: number
): TimelineSnapshotReference | null {
  const target = Math.floor(Number(tick) || 0);
  for (let i = index.length - 1; i >= 0; i -= 1) {
    if (index[i]!.tick === target) return index[i]!;
    if (index[i]!.tick < target) break;
  }
  return null;
}

/** Immutable deep-freeze of snapshot fields for history integrity. */
export function freezeSimulationSnapshot(snapshot: SimulationStateSnapshot): SimulationStateSnapshot {
  return {
    simulationId: snapshot.simulationId,
    branchId: snapshot.branchId,
    timestamp: { ...snapshot.timestamp },
    objectStates: JSON.parse(JSON.stringify(snapshot.objectStates ?? {})) as Record<string, unknown>,
    ...(snapshot.propagationState !== undefined
      ? { propagationState: JSON.parse(JSON.stringify(snapshot.propagationState)) }
      : {}),
    ...(snapshot.operationalMetrics !== undefined
      ? { operationalMetrics: { ...snapshot.operationalMetrics } }
      : {}),
    fingerprint: snapshot.fingerprint,
  };
}
