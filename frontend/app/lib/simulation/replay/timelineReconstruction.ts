/**
 * D7:1:9 — Timeline reconstruction for executive replay (read-only).
 */

import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { OperationalTimeline, TimelineCausalLink } from "../timeline/timelineTypes.ts";
import { getReplayOrderedTimelineSnapshots } from "../timeline/operationalTimelineEvolutionEngine.ts";
import { buildReplayTrackFromOperationalTimeline } from "../timeline/timelineReplayBridge.ts";
import { buildTimelinePlaybackIndex } from "../timeline/timelinePlayback.ts";
import type {
  DivergenceReplayPoint,
  PropagationReplayMarker,
  TimelineReconstructionBundle,
} from "./replayTypes.ts";
import { extractDecisionReplayMarkers } from "./decisionReplayTracking.ts";
import { logReplayDev } from "./replayDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function readFragility(snapshot: SimulationStateSnapshot): number {
  const n = Number(snapshot.operationalMetrics?.fragility ?? 0.2);
  return Number.isFinite(n) ? n : 0.2;
}

function groupCausalityByTick(
  links: readonly TimelineCausalLink[]
): Record<number, TimelineCausalLink[]> {
  const byTick: Record<number, TimelineCausalLink[]> = {};
  for (const link of links) {
    const tick = Math.floor(Number(link.generatedTick) || 0);
    if (!byTick[tick]) byTick[tick] = [];
    byTick[tick].push(link);
  }
  for (const tick of Object.keys(byTick)) {
    byTick[Number(tick)]!.sort((a, b) => a.linkId.localeCompare(b.linkId));
  }
  return byTick;
}

function buildPropagationMarkers(
  timeline: OperationalTimeline
): PropagationReplayMarker[] {
  const markers: PropagationReplayMarker[] = [];
  for (const link of timeline.causality) {
    if (!link.reason?.toLowerCase().includes("propagation")) continue;
    markers.push(
      Object.freeze({
        tick: Math.floor(Number(link.generatedTick) || 0),
        sourceEventId: link.sourceEventId,
        affectedObjectIds: Object.freeze([...link.affectedObjectIds].sort()),
        propagationType: link.propagationType,
      })
    );
  }
  return markers.sort((a, b) => a.tick - b.tick || a.sourceEventId.localeCompare(b.sourceEventId));
}

export function buildDivergenceReplayPoints(
  forest: ScenarioBranchForestState | undefined,
  timelineId: string
): DivergenceReplayPoint[] {
  if (!forest) return [];
  return forest.divergences
    .filter((d) => {
      const branch = forest.branches.find((b) => b.branchId === d.branchId);
      return branch?.childTimelineId === timelineId || branch?.parentTimelineId === timelineId;
    })
    .map((d) =>
      Object.freeze({
        tick: d.branchPointTick,
        branchId: d.branchId,
        parentTimelineId: d.parentTimelineId,
        changedObjectIds: Object.freeze([...d.changedObjectIds].sort()),
        operationalImpactScore: d.operationalImpactScore,
        summary: d.notes?.[0],
      })
    )
    .sort((a, b) => a.tick - b.tick || (a.branchId ?? "").localeCompare(b.branchId ?? ""));
}

export function detectOperationalTransitions(
  ordered: readonly SimulationStateSnapshot[]
): { escalationTick?: number; recoveryTick?: number } {
  let escalationTick: number | undefined;
  let recoveryTick: number | undefined;
  let prevFragility = readFragility(ordered[0]!);

  for (let i = 1; i < ordered.length; i += 1) {
    const snap = ordered[i]!;
    const frag = readFragility(snap);
    if (escalationTick == null && frag - prevFragility >= 0.12) {
      escalationTick = snap.timestamp.tick;
    }
    if (recoveryTick == null && prevFragility - frag >= 0.1) {
      recoveryTick = snap.timestamp.tick;
    }
    prevFragility = frag;
  }

  return { escalationTick, recoveryTick };
}

/**
 * Reconstruct replay bundle from timeline without mutating source data.
 */
export function reconstructTimelineForReplay(input: {
  sourceTimeline: OperationalTimeline;
  branchForest?: ScenarioBranchForestState;
  warRoomInterventionFingerprints?: readonly string[];
}): TimelineReconstructionBundle {
  const timeline = input.sourceTimeline;
  const orderedSnapshots = getReplayOrderedTimelineSnapshots(timeline);
  const causalityRaw = groupCausalityByTick(timeline.causality);
  const causalityByTick: Record<number, readonly TimelineCausalLink[]> = {};
  for (const [tick, links] of Object.entries(causalityRaw)) {
    causalityByTick[Number(tick)] = Object.freeze([...links]);
  }

  const decisionMarkers = extractDecisionReplayMarkers({
    timeline,
    warRoomInterventionFingerprints: input.warRoomInterventionFingerprints,
  });

  const divergencePoints = buildDivergenceReplayPoints(input.branchForest, timeline.timelineId);
  const propagationMarkers = buildPropagationMarkers(timeline);
  const playbackIndex = buildTimelinePlaybackIndex(timeline);
  const replayTrack = buildReplayTrackFromOperationalTimeline(timeline);

  const fingerprint = stableStringify({
    timelineId: timeline.timelineId,
    snapshots: orderedSnapshots.map((s) => s.fingerprint),
    decisions: decisionMarkers.map((d) => d.decisionId),
    divergence: divergencePoints.map((d) => d.branchId),
  });

  logReplayDev("TimelineReplay", {
    timelineId: timeline.timelineId,
    frames: orderedSnapshots.length,
    decisions: decisionMarkers.length,
    divergencePoints: divergencePoints.length,
  });

  return Object.freeze({
    timelineId: timeline.timelineId,
    orderedSnapshots: Object.freeze(orderedSnapshots),
    causalityByTick: Object.freeze(causalityByTick),
    decisionMarkers: Object.freeze(decisionMarkers),
    divergencePoints: Object.freeze(divergencePoints),
    propagationMarkers: Object.freeze(propagationMarkers),
    playbackIndex,
    replayTrack,
    fingerprint,
  });
}

export function resolveReplayTickAtFrame(
  reconstruction: TimelineReconstructionBundle,
  frameIndex: number
): number {
  const frames = reconstruction.replayTrack.frames;
  if (frames.length === 0) return 0;
  const idx = Math.max(0, Math.min(frames.length - 1, Math.floor(frameIndex)));
  const tick = Number(frames[idx]?.snapshot?.tick ?? reconstruction.playbackIndex.minTick);
  return Math.floor(Number.isFinite(tick) ? tick : 0);
}
