/**
 * D7:1:4 — Temporal integrity guards for operational timelines.
 */

import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { OperationalTimeline, TimelineCausalLink } from "./timelineTypes.ts";
import { logTimelineDev } from "./timelineDevLog.ts";

export type TimelineGuardCode =
  | "missing_tick"
  | "duplicate_tick"
  | "backward_progression"
  | "corrupted_snapshot_order"
  | "invalid_causality"
  | "stale_timeline_mutation"
  | "snapshot_tick_mismatch";

export type TimelineGuardResult =
  | { ok: true }
  | { ok: false; code: TimelineGuardCode; message: string };

export function guardTimelineTickProgression(
  currentTick: number,
  nextTick: number
): TimelineGuardResult {
  const cur = Math.floor(Number(currentTick) || 0);
  const next = Math.floor(Number(nextTick) || 0);
  if (next <= cur) {
    const result: TimelineGuardResult = {
      ok: false,
      code: next === cur ? "duplicate_tick" : "backward_progression",
      message:
        next === cur
          ? `Duplicate tick ${next} cannot be appended twice`
          : `Backward progression: tick ${next} follows tick ${cur}`,
    };
    logTimelineDev("TimelineGuard", { ...result, currentTick: cur, nextTick: next });
    return result;
  }
  if (next !== cur + 1) {
    const result: TimelineGuardResult = {
      ok: false,
      code: "missing_tick",
      message: `Missing tick sequence: expected ${cur + 1}, received ${next}`,
    };
    logTimelineDev("TimelineGuard", { ...result });
    return result;
  }
  return { ok: true };
}

export function guardSnapshotTickAlignment(
  snapshot: SimulationStateSnapshot,
  expectedTick: number
): TimelineGuardResult {
  const tick = snapshot.timestamp?.tick;
  if (Math.floor(Number(tick) || 0) !== Math.floor(Number(expectedTick) || 0)) {
    const result: TimelineGuardResult = {
      ok: false,
      code: "snapshot_tick_mismatch",
      message: `Snapshot tick ${tick} does not match expected ${expectedTick}`,
    };
    logTimelineDev("TimelineGuard", { ...result });
    return result;
  }
  return { ok: true };
}

export function guardSnapshotOrder(snapshots: readonly SimulationStateSnapshot[]): TimelineGuardResult {
  for (let i = 1; i < snapshots.length; i += 1) {
    const prev = snapshots[i - 1]!.timestamp.tick;
    const cur = snapshots[i]!.timestamp.tick;
    if (cur <= prev) {
      const result: TimelineGuardResult = {
        ok: false,
        code: "corrupted_snapshot_order",
        message: `Snapshot order corrupted at index ${i}: tick ${cur} after ${prev}`,
      };
      logTimelineDev("TimelineGuard", { ...result });
      return result;
    }
  }
  return { ok: true };
}

export function guardCausalLinksForTick(
  links: readonly TimelineCausalLink[],
  tick: number
): TimelineGuardResult {
  const t = Math.floor(Number(tick) || 0);
  for (const link of links) {
    if (Math.floor(Number(link.generatedTick) || 0) !== t) {
      const result: TimelineGuardResult = {
        ok: false,
        code: "invalid_causality",
        message: `Causal link ${link.linkId} tick ${link.generatedTick} != ${t}`,
      };
      logTimelineDev("TimelineGuard", { ...result });
      return result;
    }
    if (!String(link.sourceEventId ?? "").trim()) {
      return {
        ok: false,
        code: "invalid_causality",
        message: `Causal link ${link.linkId} missing sourceEventId`,
      };
    }
  }
  return { ok: true };
}

export function guardStaleTimelineMutation(
  timeline: OperationalTimeline,
  expectedTimelineId: string
): TimelineGuardResult {
  if (timeline.timelineId !== expectedTimelineId) {
    const result: TimelineGuardResult = {
      ok: false,
      code: "stale_timeline_mutation",
      message: `Timeline id mismatch: ${timeline.timelineId} != ${expectedTimelineId}`,
    };
    logTimelineDev("TimelineGuard", { ...result });
    return result;
  }
  return { ok: true };
}

export function validateOperationalTimeline(timeline: OperationalTimeline): TimelineGuardResult {
  const order = guardSnapshotOrder(timeline.snapshots);
  if (!order.ok) return order;
  if (timeline.snapshots.length > 0) {
    const last = timeline.snapshots[timeline.snapshots.length - 1]!;
    if (last.timestamp.tick !== timeline.currentTick) {
      return {
        ok: false,
        code: "corrupted_snapshot_order",
        message: `currentTick ${timeline.currentTick} does not match last snapshot tick ${last.timestamp.tick}`,
      };
    }
  }
  return { ok: true };
}
