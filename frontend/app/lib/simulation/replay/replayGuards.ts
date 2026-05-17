/**
 * D7:1:9 — Replay + strategic memory guard rails.
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { SimulationReplaySession } from "./replayTypes.ts";
import { logReplayDev } from "./replayDevLog.ts";

export type ReplayGuardCode =
  | "empty_replay_id"
  | "corrupted_timeline"
  | "tick_out_of_range"
  | "invalid_frame_index"
  | "duplicate_replay"
  | "recursive_replay_loop"
  | "stale_replay_session"
  | "replay_corruption"
  | "historical_mutation_blocked";

export type ReplayGuardResult =
  | { ok: true }
  | { ok: false; code: ReplayGuardCode; message: string };

function reject(code: ReplayGuardCode, message: string): ReplayGuardResult {
  const result = { ok: false as const, code, message };
  logReplayDev("ReplayGuard", { code, message });
  return result;
}

export function buildReplayContentFingerprint(input: {
  sourceTimelineId: string;
  snapshotFingerprints: readonly string[];
  startAtTick?: number;
}): string {
  return JSON.stringify({
    sourceTimelineId: input.sourceTimelineId,
    snapshots: [...input.snapshotFingerprints].sort(),
    startAtTick: input.startAtTick ?? null,
  });
}

export function buildReplayRequestFingerprint(input: {
  replayId: string;
  sourceTimelineId: string;
  snapshotFingerprints: readonly string[];
  startAtTick?: number;
}): string {
  return JSON.stringify({
    content: buildReplayContentFingerprint(input),
    replayId: input.replayId,
  });
}

export function guardSimulationReplaySession(session: SimulationReplaySession): ReplayGuardResult {
  if (!String(session.replayId ?? "").trim()) {
    return reject("empty_replay_id", "Replay session id is required");
  }
  if (session.replayStatus === "completed") {
    return reject("stale_replay_session", "Cannot restart a completed replay session without a new session");
  }
  return { ok: true };
}

export function guardReplaySimulationTimeline(input: {
  session: SimulationReplaySession;
  sourceTimeline: OperationalTimeline;
  priorReplayFingerprints?: readonly string[];
  pendingFingerprint?: string;
  parentReplayId?: string;
  replayChain?: readonly string[];
}): ReplayGuardResult {
  const sessionGuard = guardSimulationReplaySession(input.session);
  if (!sessionGuard.ok) return sessionGuard;

  if (!input.sourceTimeline?.timelineId || !Array.isArray(input.sourceTimeline.snapshots)) {
    return reject("corrupted_timeline", "Source timeline is missing or corrupted");
  }

  if (input.sourceTimeline.snapshots.length === 0) {
    return reject("corrupted_timeline", "Source timeline has no snapshots to replay");
  }

  if (input.session.sourceTimelineId !== input.sourceTimeline.timelineId) {
    return reject(
      "replay_corruption",
      "Replay session sourceTimelineId does not match provided timeline"
    );
  }

  const chain = input.replayChain ?? [];
  if (chain.includes(input.session.replayId)) {
    return reject("recursive_replay_loop", `Replay ${input.session.replayId} already in replay chain`);
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorReplayFingerprints ?? []).includes(pending)) {
    return reject("duplicate_replay", "Identical replay was already executed");
  }

  return { ok: true };
}

export function guardReplayFrameAccess(input: {
  frameIndex: number;
  frameCount: number;
  tick?: number;
  maxTick?: number;
}): ReplayGuardResult {
  if (input.frameCount <= 0) {
    return reject("corrupted_timeline", "Replay has no frames");
  }
  if (input.frameIndex < 0 || input.frameIndex >= input.frameCount) {
    return reject(
      "invalid_frame_index",
      `Frame index ${input.frameIndex} out of range (0..${input.frameCount - 1})`
    );
  }
  if (input.tick != null && input.maxTick != null && input.tick > input.maxTick) {
    return reject("tick_out_of_range", `Tick ${input.tick} exceeds timeline max ${input.maxTick}`);
  }
  return { ok: true };
}

/** Explicit guard: replay consumers must not mutate source timeline references. */
export function assertReplayReadOnlyTimeline(
  timelineBefore: string,
  timeline: OperationalTimeline
): ReplayGuardResult {
  const after = JSON.stringify(timeline);
  if (after !== timelineBefore) {
    return reject("historical_mutation_blocked", "Replay attempted to mutate source timeline history");
  }
  return { ok: true };
}
