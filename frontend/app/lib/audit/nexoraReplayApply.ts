/**
 * B.16 — Replay apply contract + dispatcher (visual restore; no timeline animation).
 */

import type { NexoraReplaySnapshot } from "../../screens/nexoraReplaySnapshot.ts";

export type NexoraReplayApplySource = "recent_runs" | "imported_bundle" | "dev";

export type NexoraReplayApplyPayload = {
  snapshot: NexoraReplaySnapshot;
  source: NexoraReplayApplySource;
};

/**
 * Stable identity for loop-safe replay apply (ignores snapshot.timestamp and other volatile HUD-only fields).
 */
export function buildReplayApplySignature(payload: NexoraReplayApplyPayload): string {
  const s = payload.snapshot;
  const d = s.decision;
  const trustSum = (s.trust.summary ?? "").slice(0, 240);
  return JSON.stringify({
    v: 1,
    runId: s.runId,
    source: payload.source,
    focus: s.scene.focusedObjectId ?? null,
    hi: [...s.scene.highlightedObjectIds].map(String).sort(),
    frag: s.scene.fragilityLevel ?? null,
    tier: s.trust.confidenceTier ?? null,
    trustSum,
    dec: d
      ? {
          p: d.posture ?? "",
          t: d.tradeoff ?? "",
          n: d.nextMove ?? "",
        }
      : null,
    srcT: s.sources.total,
    srcOk: s.sources.successful,
  });
}

export function filterReplaySnapshotIdsForScene(
  snapshot: NexoraReplaySnapshot,
  sceneIds: ReadonlySet<string>
): { focusInScene: string | null; highlightsInScene: string[] } {
  const rawFocus = snapshot.scene.focusedObjectId?.trim() || null;
  const focusInScene = rawFocus && sceneIds.has(rawFocus) ? rawFocus : null;
  const highlightsInScene: string[] = [];
  const seen = new Set<string>();
  for (const id of snapshot.scene.highlightedObjectIds) {
    const t = String(id).trim();
    if (!t || seen.has(t) || !sceneIds.has(t)) continue;
    seen.add(t);
    highlightsInScene.push(t);
  }
  return { focusInScene, highlightsInScene };
}

export const NEXORA_REPLAY_APPLY_EVENT = "nexora:replay_apply";

export type NexoraReplayApplyEventDetail = {
  payload: NexoraReplayApplyPayload;
  force?: boolean;
};

export function dispatchNexoraReplayApply(
  payload: NexoraReplayApplyPayload,
  options?: { force?: boolean }
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<NexoraReplayApplyEventDetail>(NEXORA_REPLAY_APPLY_EVENT, {
      detail: { payload, force: options?.force === true },
    })
  );
}
