/**
 * B.15.e — Replay-safe restore hook (contract for a future replay phase; no animation here).
 */

import type { NexoraReplaySnapshot } from "../../screens/nexoraReplaySnapshot.ts";

export type NexoraReplayRestoreAdapters = {
  setFocusedObjectId?: (id: string | null) => void;
  setHighlightedObjectIds?: (ids: string[]) => void;
  /** Optional: push trust/decision copy into HUD or panel state */
  applyTrustCopy?: (trust: NexoraReplaySnapshot["trust"]) => void;
  applyDecisionCopy?: (decision: NonNullable<NexoraReplaySnapshot["decision"]>) => void;
};

export type NexoraReplayRestoreResult = {
  ok: boolean;
  applied: string[];
  notes: string[];
};

/**
 * Applies snapshot fields through thin adapters. Missing adapters → field skipped (note only).
 */
export function restoreReplaySnapshot(
  snapshot: NexoraReplaySnapshot,
  adapters: Partial<NexoraReplayRestoreAdapters>
): NexoraReplayRestoreResult {
  const applied: string[] = [];
  const notes: string[] = [];

  if (adapters.setFocusedObjectId) {
    adapters.setFocusedObjectId(snapshot.scene.focusedObjectId ?? null);
    applied.push("focus");
  } else if (snapshot.scene.focusedObjectId) {
    notes.push("focus: no adapter");
  }

  if (adapters.setHighlightedObjectIds) {
    adapters.setHighlightedObjectIds([...snapshot.scene.highlightedObjectIds]);
    applied.push("highlights");
  } else if (snapshot.scene.highlightedObjectIds.length > 0) {
    notes.push("highlights: no adapter");
  }

  if (adapters.applyTrustCopy) {
    adapters.applyTrustCopy(snapshot.trust);
    applied.push("trust");
  }

  if (snapshot.decision && adapters.applyDecisionCopy) {
    adapters.applyDecisionCopy(snapshot.decision);
    applied.push("decision");
  } else if (snapshot.decision) {
    notes.push("decision: no adapter");
  }

  return { ok: applied.length > 0 || notes.length === 0, applied, notes };
}
