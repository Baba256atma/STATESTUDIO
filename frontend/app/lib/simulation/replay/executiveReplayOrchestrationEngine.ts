/**
 * D7:1:9 — Executive replay orchestration engine (immutable, deterministic).
 */

import type {
  CreateSimulationReplaySessionInput,
  ReplayOrchestrationSnapshot,
  ReplayPanelContract,
  ReplaySimulationTimelineInput,
  ReplaySimulationTimelineResult,
  SimulationReplaySession,
} from "./replayTypes.ts";
import {
  assertReplayReadOnlyTimeline,
  buildReplayContentFingerprint,
  buildReplayRequestFingerprint,
  guardReplayFrameAccess,
  guardReplaySimulationTimeline,
} from "./replayGuards.ts";
import { reconstructTimelineForReplay, resolveReplayTickAtFrame } from "./timelineReconstruction.ts";
import { buildStrategicMemorySnapshot } from "./strategicMemoryIndex.ts";
import { buildExecutiveReplayNarrative } from "./executiveReplayNarratives.ts";
import { logReplayDev } from "./replayDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function replaySessionCreatedAt(): string {
  return new Date(Date.UTC(2026, 0, 1)).toISOString();
}

export function createSimulationReplaySession(
  input: CreateSimulationReplaySessionInput
): SimulationReplaySession {
  const session: SimulationReplaySession = Object.freeze({
    replayId: String(input.replayId).trim(),
    sourceTimelineId: String(input.sourceTimelineId).trim(),
    createdAt: replaySessionCreatedAt(),
    replayStatus: "prepared",
    title: input.title?.trim(),
    sourceWarRoomSessionId: input.sourceWarRoomSessionId?.trim(),
  });

  logReplayDev("ReplaySession", {
    replayId: session.replayId,
    sourceTimelineId: session.sourceTimelineId,
  });

  return session;
}

export function buildReplayPanelContract(input: {
  session: SimulationReplaySession;
  snapshot: ReplayOrchestrationSnapshot;
}): ReplayPanelContract {
  const scrubPoints = input.snapshot.reconstruction.replayTrack.frames.map((frame, frameIndex) =>
    Object.freeze({
      frameIndex,
      tick: Number(frame.snapshot?.tick ?? 0),
      label: String(frame.label ?? `Tick ${frame.snapshot?.tick ?? frameIndex}`),
    })
  );

  const memoryHighlights = [...input.snapshot.memory.entries]
    .sort((a, b) => (b.replayImportanceScore ?? 0) - (a.replayImportanceScore ?? 0))
    .slice(0, 5)
    .map((e) => e.summary ?? e.entryId);

  const viewHint =
    input.snapshot.reconstruction.decisionMarkers.length > 0
      ? "decision_audit"
      : input.snapshot.reconstruction.divergencePoints.length > 0
        ? "divergence_map"
        : input.snapshot.memory.entries.length > 4
          ? "memory_index"
          : "timeline_scrub";

  return Object.freeze({
    replayId: input.session.replayId,
    sourceTimelineId: input.session.sourceTimelineId,
    status: input.session.replayStatus,
    minTick: input.snapshot.reconstruction.playbackIndex.minTick,
    maxTick: input.snapshot.reconstruction.playbackIndex.maxTick,
    scrubPoints: Object.freeze(scrubPoints),
    decisionMarkers: Object.freeze([...input.snapshot.reconstruction.decisionMarkers]),
    memoryHighlights: Object.freeze(memoryHighlights),
    narrativeHeadline: input.snapshot.narrative.headline,
    viewHint,
  });
}

function resolveStartFrameIndex(
  reconstruction: ReplayOrchestrationSnapshot["reconstruction"],
  startAtTick?: number
): number {
  if (startAtTick == null) return 0;
  const target = Math.floor(Number(startAtTick));
  const frames = reconstruction.replayTrack.frames;
  const idx = frames.findIndex((f) => Number(f.snapshot?.tick ?? -1) === target);
  return idx >= 0 ? idx : 0;
}

/**
 * Reconstruct and replay a simulation timeline without mutating source history.
 */
export function replaySimulationTimeline(
  input: ReplaySimulationTimelineInput
): ReplaySimulationTimelineResult {
  const timelineFrozen = JSON.stringify(input.sourceTimeline);

  const contentFingerprint = buildReplayContentFingerprint({
    sourceTimelineId: input.sourceTimeline.timelineId,
    snapshotFingerprints: input.sourceTimeline.snapshots.map((s) => s.fingerprint),
    startAtTick: input.startAtTick,
  });
  const pendingFingerprint = buildReplayRequestFingerprint({
    replayId: input.session.replayId,
    sourceTimelineId: input.sourceTimeline.timelineId,
    snapshotFingerprints: input.sourceTimeline.snapshots.map((s) => s.fingerprint),
    startAtTick: input.startAtTick,
  });

  const guard = guardReplaySimulationTimeline({
    session: input.session,
    sourceTimeline: input.sourceTimeline,
    priorReplayFingerprints: input.priorReplayFingerprints,
    pendingFingerprint: contentFingerprint,
    replayChain: input.session.sourceWarRoomSessionId
      ? [input.session.sourceWarRoomSessionId]
      : [],
  });
  if (!guard.ok) return { ok: false, guard };

  logReplayDev("Replay", {
    replayId: input.session.replayId,
    timelineId: input.sourceTimeline.timelineId,
    snapshots: input.sourceTimeline.snapshots.length,
  });

  const warRoomHistory =
    input.warRoomHistory ?? input.warRoomSnapshot?.history;

  const reconstruction = reconstructTimelineForReplay({
    sourceTimeline: input.sourceTimeline,
    branchForest: input.branchForest,
    warRoomInterventionFingerprints: warRoomHistory?.interventionSequence.map((i) => i.fingerprint),
  });

  const memory = buildStrategicMemorySnapshot({
    memoryId: `memory::${input.session.replayId}`,
    sourceTimeline: input.sourceTimeline,
    reconstruction,
    warRoomHistory,
    interventionOutcomes:
      input.interventionOutcomes ?? input.warRoomSnapshot?.interventionOutcomes,
    comparisonSnapshots:
      input.comparisonSnapshots ?? [...(input.warRoomSnapshot?.comparisonSnapshots ?? [])],
    branchForest: input.branchForest,
  });

  const narrative = buildExecutiveReplayNarrative({
    sourceTimelineId: input.sourceTimeline.timelineId,
    reconstruction,
    decisionMarkers: reconstruction.decisionMarkers,
    sessionTitle: input.session.title,
  });

  const mutationGuard = assertReplayReadOnlyTimeline(timelineFrozen, input.sourceTimeline);
  if (!mutationGuard.ok) return { ok: false, guard: mutationGuard };

  const currentFrameIndex = resolveStartFrameIndex(reconstruction, input.startAtTick);
  const currentTick = resolveReplayTickAtFrame(reconstruction, currentFrameIndex);

  const updatedSession: SimulationReplaySession = Object.freeze({
    ...input.session,
    replayStatus: "completed",
  });

  const fingerprint = stableStringify({
    pendingFingerprint,
    reconstruction: reconstruction.fingerprint,
    memory: memory.fingerprint,
    currentTick,
  });

  const snapshot: ReplayOrchestrationSnapshot = Object.freeze({
    session: updatedSession,
    reconstruction,
    memory,
    narrative: Object.freeze({
      ...narrative,
      bullets: Object.freeze([...narrative.bullets]),
    }),
    currentFrameIndex,
    currentTick,
    fingerprint,
  });

  const panelContract = buildReplayPanelContract({ session: updatedSession, snapshot });

  logReplayDev("ReplaySession", {
    replayId: input.session.replayId,
    fingerprint,
    frameIndex: currentFrameIndex,
    tick: currentTick,
  });

  return { ok: true, snapshot, panelContract };
}

export function advanceReplayToFrame(
  snapshot: ReplayOrchestrationSnapshot,
  frameIndex: number
): ReplayOrchestrationSnapshot | { ok: false; guard: import("./replayGuards.ts").ReplayGuardResult } {
  const frameCount = snapshot.reconstruction.replayTrack.frames.length;
  const guard = guardReplayFrameAccess({
    frameIndex,
    frameCount,
    tick: resolveReplayTickAtFrame(snapshot.reconstruction, frameIndex),
    maxTick: snapshot.reconstruction.playbackIndex.maxTick,
  });
  if (!guard.ok) return { ok: false, guard };

  const currentTick = resolveReplayTickAtFrame(snapshot.reconstruction, frameIndex);
  return Object.freeze({
    ...snapshot,
    currentFrameIndex: frameIndex,
    currentTick,
    session: Object.freeze({
      ...snapshot.session,
      replayStatus: frameIndex >= frameCount - 1 ? "completed" : "playing",
    }),
  });
}

export function freezeReplayOrchestrationSnapshot(
  snapshot: ReplayOrchestrationSnapshot
): ReplayOrchestrationSnapshot {
  return Object.freeze({
    ...snapshot,
    session: Object.freeze({ ...snapshot.session }),
    reconstruction: Object.freeze({
      ...snapshot.reconstruction,
      orderedSnapshots: Object.freeze([...snapshot.reconstruction.orderedSnapshots]),
      decisionMarkers: Object.freeze([...snapshot.reconstruction.decisionMarkers]),
      divergencePoints: Object.freeze([...snapshot.reconstruction.divergencePoints]),
      propagationMarkers: Object.freeze([...snapshot.reconstruction.propagationMarkers]),
    }),
    memory: Object.freeze({
      ...snapshot.memory,
      entries: Object.freeze(snapshot.memory.entries.map((e) => Object.freeze({ ...e }))),
    }),
    narrative: Object.freeze({ ...snapshot.narrative }),
  });
}
