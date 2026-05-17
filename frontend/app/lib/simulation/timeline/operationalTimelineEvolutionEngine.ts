/**
 * D7:1:4 — Operational timeline evolution engine (immutable temporal progression).
 */

import { createSimulationTimestamp } from "../simulationClock.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { SimulationPropagationResult } from "../simulationEventPropagationEngine.ts";
import {
  createSimulationStateSnapshot,
  type SimulationStateSnapshot,
} from "../simulationStateSnapshot.ts";
import type { SimulationBranchId, SimulationOperationalMetrics } from "../simulationTypes.ts";
import type { SimulationPropagationSnapshotState } from "../simulationPropagationTypes.ts";
import { logTimelineDev } from "./timelineDevLog.ts";
import { resolveExecutiveTimelinePhase } from "./timelineExecutiveSemantics.ts";
import {
  appendTimelineHistoryEntry,
  createEmptyTimelineHistory,
} from "./timelineHistory.ts";
import { buildTimelinePlaybackIndex } from "./timelinePlayback.ts";
import { freezeSimulationSnapshot, indexSnapshotsForTimeline } from "./timelineSnapshotIndex.ts";
import {
  guardCausalLinksForTick,
  guardSnapshotTickAlignment,
  guardStaleTimelineMutation,
  guardTimelineTickProgression,
  validateOperationalTimeline,
  type TimelineGuardResult,
} from "./timelineGuards.ts";
import type {
  OperationalTimeline,
  OperationalTimelineStatus,
  TimelineCausalLink,
} from "./timelineTypes.ts";

export interface CreateOperationalTimelineInput {
  timelineId: string;
  initialSnapshot: SimulationStateSnapshot;
  branchId?: SimulationBranchId;
  status?: OperationalTimelineStatus;
}

export interface AdvanceOperationalTimelineInput {
  timeline: OperationalTimeline;
  simulationEvents: readonly SimulationEvent[];
  propagationResults?: readonly SimulationPropagationResult[];
  nextSnapshot: SimulationStateSnapshot;
  nextTick: number;
  causalLinks?: readonly TimelineCausalLink[];
  status?: OperationalTimelineStatus;
}

export type TimelineAdvanceResult =
  | { ok: true; timeline: OperationalTimeline }
  | { ok: false; guard: TimelineGuardResult };

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function uniqueSortedIds(ids: readonly string[]): string[] {
  return [...new Set(ids.map((id) => String(id ?? "").trim()).filter(Boolean))].sort();
}

export function buildCausalLinksFromTurn(input: {
  tick: number;
  simulationEvents: readonly SimulationEvent[];
  propagationResults?: readonly SimulationPropagationResult[];
}): TimelineCausalLink[] {
  const tick = Math.floor(Number(input.tick) || 0);
  const links: TimelineCausalLink[] = [];
  const events = [...input.simulationEvents].sort((a, b) => a.id.localeCompare(b.id));

  for (const event of events) {
    const affected = uniqueSortedIds([
      ...(event.targetObjectIds ?? []),
      ...(event.sourceObjectId ? [event.sourceObjectId] : []),
      ...(((event.payload as { objectId?: string } | undefined)?.objectId
        ? [(event.payload as { objectId: string }).objectId]
        : []) as string[]),
    ]);
    links.push({
      linkId: `cause::${event.id}::t${tick}`,
      sourceEventId: event.id,
      affectedObjectIds: affected,
      generatedTick: tick,
      reason: `Operational event: ${event.type}`,
    });
  }

  const propagationResults = input.propagationResults ?? [];
  for (const result of propagationResults) {
    const affected = uniqueSortedIds(Object.keys(result.intensityByObjectId ?? {}));
    const type = result.propagationEvents[0]?.propagationType;
    links.push({
      linkId: `prop::${result.sourceEventId}::t${tick}`,
      sourceEventId: result.sourceEventId,
      affectedObjectIds: affected,
      generatedTick: tick,
      reason: "Propagation cascade",
      propagationType: type,
    });
    logTimelineDev("TimelineCausality", {
      tick,
      sourceEventId: result.sourceEventId,
      affectedCount: affected.length,
    });
  }

  return links.sort((a, b) => a.linkId.localeCompare(b.linkId));
}

export function buildTimelineSnapshotFromLayers(input: {
  simulationId: string;
  branchId?: SimulationBranchId;
  tick: number;
  epochSimulatedAt?: string;
  objectStates: Record<string, unknown>;
  propagationState?: SimulationPropagationSnapshotState | unknown;
  operationalMetrics?: SimulationOperationalMetrics;
}): SimulationStateSnapshot {
  return createSimulationStateSnapshot({
    simulationId: input.simulationId,
    branchId: input.branchId,
    timestamp: createSimulationTimestamp(input.tick, { epochSimulatedAt: input.epochSimulatedAt }),
    objectStates: input.objectStates,
    propagationState: input.propagationState,
    operationalMetrics: input.operationalMetrics,
  });
}

export function createOperationalTimeline(input: CreateOperationalTimelineInput): OperationalTimeline {
  const branchId = input.branchId ?? input.initialSnapshot.branchId ?? "main";
  const frozen = freezeSimulationSnapshot(input.initialSnapshot);
  const timelineId = String(input.timelineId ?? "").trim() || `timeline-${Date.now()}`;
  const snapshotIndex = indexSnapshotsForTimeline(timelineId, [frozen]);
  const executive = resolveExecutiveTimelinePhase({
    tick: frozen.timestamp.tick,
    metrics: frozen.operationalMetrics,
    propagationState: frozen.propagationState,
  });
  const history = appendTimelineHistoryEntry({
    history: createEmptyTimelineHistory(),
    snapshot: frozen,
    timelineId,
    executive,
    causalLinks: [],
  });
  const base: OperationalTimeline = {
    timelineId,
    branchId,
    createdAt: new Date().toISOString(),
    snapshots: [frozen],
    snapshotIndex,
    currentTick: frozen.timestamp.tick,
    status: input.status ?? "idle",
    causality: [],
    history,
    playback: {
      timelineId,
      branchId,
      minTick: frozen.timestamp.tick,
      maxTick: frozen.timestamp.tick,
      scrubPoints: [],
      branchAnchorId: `${timelineId}::main`,
    },
  };
  const timeline: OperationalTimeline = {
    ...base,
    playback: buildTimelinePlaybackIndex(base),
  };
  logTimelineDev("Timeline", { phase: "created", timelineId, tick: timeline.currentTick });
  return timeline;
}

export function advanceOperationalTimeline(
  input: AdvanceOperationalTimelineInput
): TimelineAdvanceResult {
  const stale = guardStaleTimelineMutation(input.timeline, input.timeline.timelineId);
  if (!stale.ok) return { ok: false, guard: stale };

  const tickProgress = guardTimelineTickProgression(input.timeline.currentTick, input.nextTick);
  if (!tickProgress.ok) return { ok: false, guard: tickProgress };

  const snapAlign = guardSnapshotTickAlignment(input.nextSnapshot, input.nextTick);
  if (!snapAlign.ok) return { ok: false, guard: snapAlign };

  const frozen = freezeSimulationSnapshot(input.nextSnapshot);
  const causalLinks =
    input.causalLinks ??
    buildCausalLinksFromTurn({
      tick: input.nextTick,
      simulationEvents: input.simulationEvents,
      propagationResults: input.propagationResults,
    });

  const causalGuard = guardCausalLinksForTick(causalLinks, input.nextTick);
  if (!causalGuard.ok) return { ok: false, guard: causalGuard };

  const executive = resolveExecutiveTimelinePhase({
    tick: input.nextTick,
    metrics: frozen.operationalMetrics,
    propagationState: frozen.propagationState as SimulationPropagationSnapshotState | undefined,
    affectedObjectCount: (frozen.propagationState as SimulationPropagationSnapshotState | undefined)
      ?.affectedObjectIds?.length,
  });

  const snapshots = [...input.timeline.snapshots, frozen];
  const snapshotIndex = indexSnapshotsForTimeline(input.timeline.timelineId, snapshots);
  const history = appendTimelineHistoryEntry({
    history: input.timeline.history,
    snapshot: frozen,
    timelineId: input.timeline.timelineId,
    executive,
    causalLinks,
  });

  const nextTimeline: OperationalTimeline = {
    ...input.timeline,
    snapshots,
    snapshotIndex,
    currentTick: input.nextTick,
    status:
      input.status ??
      (input.timeline.status === "idle" ? "running" : input.timeline.status),
    causality: [...input.timeline.causality, ...causalLinks].sort((a, b) =>
      a.linkId.localeCompare(b.linkId)
    ),
    history,
  };
  nextTimeline.playback = buildTimelinePlaybackIndex(nextTimeline);

  const valid = validateOperationalTimeline(nextTimeline);
  if (!valid.ok) return { ok: false, guard: valid };

  logTimelineDev("TimelineTick", {
    timelineId: nextTimeline.timelineId,
    tick: input.nextTick,
    phase: executive.phase,
    snapshots: snapshots.length,
  });

  return { ok: true, timeline: nextTimeline };
}

export function setOperationalTimelineStatus(
  timeline: OperationalTimeline,
  status: OperationalTimelineStatus
): OperationalTimeline {
  return { ...timeline, status };
}

export function operationalTimelineFingerprint(timeline: OperationalTimeline): string {
  return stableStringify({
    timelineId: timeline.timelineId,
    currentTick: timeline.currentTick,
    snapshots: timeline.snapshots.map((s) => s.fingerprint),
    history: timeline.history.fingerprint,
    causality: timeline.causality.map((c) => c.linkId),
  });
}

/** Ordered snapshots for replay consumers (does not mutate timeline). */
export function getReplayOrderedTimelineSnapshots(
  timeline: OperationalTimeline
): readonly SimulationStateSnapshot[] {
  return [...timeline.snapshots].sort((a, b) => a.timestamp.tick - b.timestamp.tick);
}

export function getSnapshotAtTimelineTick(
  timeline: OperationalTimeline,
  tick: number
): SimulationStateSnapshot | null {
  const target = Math.floor(Number(tick) || 0);
  for (let i = timeline.snapshots.length - 1; i >= 0; i -= 1) {
    const snap = timeline.snapshots[i]!;
    if (snap.timestamp.tick === target) return snap;
    if (snap.timestamp.tick < target) break;
  }
  return null;
}
