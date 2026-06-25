/**
 * INT-1.2 — Intelligence Context snapshots.
 * In-memory immutable snapshots for diagnostics, refresh, and replay.
 */

import type {
  IntelligenceContextSnapshot,
  UnifiedIntelligenceContext,
} from "./intelligenceContextContract.ts";

let snapshotSequence = 0;
const snapshots: IntelligenceContextSnapshot[] = [];

function nextSnapshotId(): string {
  snapshotSequence += 1;
  return `ctx_snapshot_${snapshotSequence}_${Date.now()}`;
}

export function createIntelligenceContextSnapshot(input: {
  context: UnifiedIntelligenceContext;
  reason: IntelligenceContextSnapshot["reason"];
}): IntelligenceContextSnapshot {
  const snapshot = Object.freeze({
    snapshotId: nextSnapshotId(),
    context: input.context,
    capturedAt: new Date().toISOString(),
    reason: input.reason,
  });
  snapshots.push(snapshot);
  return snapshot;
}

export function getIntelligenceContextSnapshots(): readonly IntelligenceContextSnapshot[] {
  return Object.freeze([...snapshots]);
}

export function getLatestIntelligenceContextSnapshot(): IntelligenceContextSnapshot | null {
  return snapshots.at(-1) ?? null;
}

export function getIntelligenceContextSnapshotById(
  snapshotId: string
): IntelligenceContextSnapshot | null {
  return snapshots.find((entry) => entry.snapshotId === snapshotId) ?? null;
}

export function resetIntelligenceContextSnapshotsForTests(): void {
  snapshots.length = 0;
  snapshotSequence = 0;
}
