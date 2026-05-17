/**
 * D7:1:4 — Timeline playback readiness (infrastructure only; no UI).
 */

import type { OperationalTimeline, TimelinePlaybackIndex, TimelineScrubPoint } from "./timelineTypes.ts";
import { EXECUTIVE_TIMELINE_PHASE_LABELS } from "./timelineExecutiveSemantics.ts";
import { buildTimelineSnapshotId } from "./timelineSnapshotIndex.ts";

export function buildTimelinePlaybackIndex(timeline: OperationalTimeline): TimelinePlaybackIndex {
  const scrubPoints: TimelineScrubPoint[] = timeline.history.entries.map((entry) => ({
    tick: entry.tick,
    snapshotId: entry.snapshotId,
    label: `${EXECUTIVE_TIMELINE_PHASE_LABELS[entry.executivePhase]} (T${entry.tick})`,
  }));

  if (scrubPoints.length === 0 && timeline.snapshots.length > 0) {
    for (const snap of timeline.snapshots) {
      scrubPoints.push({
        tick: snap.timestamp.tick,
        snapshotId: buildTimelineSnapshotId(timeline.timelineId, snap.timestamp.tick, snap.fingerprint),
        label: `Tick ${snap.timestamp.tick}`,
      });
    }
  }

  const ticks = scrubPoints.map((p) => p.tick);
  const minTick = ticks.length ? Math.min(...ticks) : 0;
  const maxTick = ticks.length ? Math.max(...ticks) : 0;

  return {
    timelineId: timeline.timelineId,
    branchId: timeline.branchId,
    minTick,
    maxTick,
    scrubPoints,
    branchAnchorId: `${timeline.timelineId}::main`,
  };
}

export function resolvePlaybackTickAtIndex(
  playback: TimelinePlaybackIndex,
  frameIndex: number
): number | null {
  if (!playback.scrubPoints.length) return null;
  const idx = Math.max(0, Math.min(playback.scrubPoints.length - 1, Math.floor(frameIndex)));
  return playback.scrubPoints[idx]!.tick;
}
