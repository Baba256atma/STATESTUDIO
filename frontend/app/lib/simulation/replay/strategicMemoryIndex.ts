/**
 * D7:1:9 — Strategic memory indexing (in-memory contracts only; no persistence DB).
 */

import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { ScenarioComparisonSnapshot } from "../comparison/scenarioComparisonTypes.ts";
import type { DecisionSimulationOutcome } from "../decision/strategicDecisionTypes.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { WarRoomSessionHistory } from "../warroom/warRoomTypes.ts";
import type {
  BuildStrategicMemoryInput,
  StrategicMemoryEntry,
  StrategicMemoryIndex,
  StrategicMemorySnapshot,
  TimelineReconstructionBundle,
} from "./replayTypes.ts";
import { detectOperationalTransitions } from "./timelineReconstruction.ts";
import { logReplayDev } from "./replayDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function memoryCreatedAt(tick = 0): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function pushIndex(
  map: Record<string, string[]>,
  key: string,
  entryId: string
): void {
  if (!map[key]) map[key] = [];
  if (!map[key]!.includes(entryId)) map[key]!.push(entryId);
}

export function buildStrategicMemoryIndex(
  entries: readonly StrategicMemoryEntry[],
  replayId: string
): StrategicMemoryIndex {
  const byTimelineId: Record<string, string[]> = {};
  const byReplayId: Record<string, string[]> = { [replayId]: [] };
  const byDecisionId: Record<string, string[]> = {};
  const byScenarioId: Record<string, string[]> = {};

  for (const entry of entries) {
    pushIndex(byTimelineId, entry.timelineId, entry.entryId);
    byReplayId[replayId]!.push(entry.entryId);
    for (const decisionId of entry.relatedDecisionIds ?? []) {
      pushIndex(byDecisionId, decisionId, entry.entryId);
    }
    for (const event of entry.keyEvents ?? []) {
      if (event.startsWith("scenario:")) {
        pushIndex(byScenarioId, event.slice("scenario:".length), entry.entryId);
      }
    }
  }

  for (const key of Object.keys(byTimelineId)) byTimelineId[key]!.sort();
  byReplayId[replayId]!.sort();

  return Object.freeze({
    byTimelineId: Object.freeze(
      Object.fromEntries(
        Object.entries(byTimelineId).map(([k, v]) => [k, Object.freeze([...v].sort())])
      )
    ),
    byReplayId: Object.freeze(
      Object.fromEntries(
        Object.entries(byReplayId).map(([k, v]) => [k, Object.freeze([...v].sort())])
      )
    ),
    byDecisionId: Object.freeze(
      Object.fromEntries(
        Object.entries(byDecisionId).map(([k, v]) => [k, Object.freeze([...v].sort())])
      )
    ),
    byScenarioId: Object.freeze(
      Object.fromEntries(
        Object.entries(byScenarioId).map(([k, v]) => [k, Object.freeze([...v].sort())])
      )
    ),
  });
}

export function buildStrategicMemorySnapshot(input: BuildStrategicMemoryInput): StrategicMemorySnapshot {
  const entries: StrategicMemoryEntry[] = [];
  const timeline = input.sourceTimeline;
  const { escalationTick, recoveryTick } = detectOperationalTransitions(
    input.reconstruction.orderedSnapshots
  );

  for (const historyEntry of timeline.history.entries) {
    entries.push(
      Object.freeze({
        entryId: `phase::${timeline.timelineId}::${historyEntry.tick}`,
        timelineId: timeline.timelineId,
        kind: "timeline_phase",
        tick: historyEntry.tick,
        replayImportanceScore: historyEntry.tick === escalationTick ? 0.9 : 0.4,
        createdAt: memoryCreatedAt(historyEntry.tick),
        summary: historyEntry.executiveLabel,
        keyEvents: Object.freeze([`phase:${historyEntry.executivePhase}`]),
      })
    );
  }

  for (const marker of input.reconstruction.decisionMarkers) {
    entries.push(
      Object.freeze({
        entryId: `decision::${marker.decisionId}`,
        timelineId: timeline.timelineId,
        kind: "decision",
        tick: marker.appliedAtTick,
        relatedDecisionIds: Object.freeze([marker.decisionId]),
        replayImportanceScore: 0.85,
        createdAt: memoryCreatedAt(marker.appliedAtTick),
        summary: marker.rationale ?? `Decision ${marker.decisionId} applied at tick ${marker.appliedAtTick}.`,
        keyEvents: Object.freeze([...(marker.resultingScenarioChanges ?? [])]),
      })
    );
  }

  for (const point of input.reconstruction.divergencePoints) {
    entries.push(
      Object.freeze({
        entryId: `divergence::${point.branchId ?? "unknown"}::${point.tick}`,
        timelineId: timeline.timelineId,
        kind: "divergence",
        tick: point.tick,
        replayImportanceScore: Number((point.operationalImpactScore ?? 0.5).toFixed(2)),
        createdAt: memoryCreatedAt(point.tick),
        summary: point.summary ?? `Scenario diverged at tick ${point.tick}.`,
        keyEvents: Object.freeze([...(point.changedObjectIds ?? [])]),
      })
    );
  }

  for (const prop of input.reconstruction.propagationMarkers) {
    entries.push(
      Object.freeze({
        entryId: `propagation::${prop.sourceEventId}::${prop.tick}`,
        timelineId: timeline.timelineId,
        kind: "propagation",
        tick: prop.tick,
        replayImportanceScore: 0.55,
        createdAt: memoryCreatedAt(prop.tick),
        summary: `Propagation cascade from ${prop.sourceEventId}.`,
        keyEvents: Object.freeze([...prop.affectedObjectIds]),
      })
    );
  }

  for (const snap of input.comparisonSnapshots ?? []) {
    entries.push(
      Object.freeze({
        entryId: `comparison::${snap.comparison.comparisonId}`,
        timelineId: timeline.timelineId,
        kind: "comparison",
        tick: snap.compareAtTick,
        replayImportanceScore: 0.7,
        createdAt: memoryCreatedAt(snap.compareAtTick),
        summary: snap.narrative.headline,
        keyEvents: Object.freeze(
          snap.comparison.comparedScenarioIds.map((id) => `scenario:${id}`)
        ),
      })
    );
  }

  for (const item of input.warRoomHistory?.interventionSequence ?? []) {
    entries.push(
      Object.freeze({
        entryId: `intervention::${item.decisionId}`,
        timelineId: item.projectedTimelineId,
        kind: "intervention",
        tick: item.stepIndex,
        relatedDecisionIds: Object.freeze([item.decisionId]),
        replayImportanceScore: 0.8,
        createdAt: memoryCreatedAt(item.stepIndex),
        summary: `War-room intervention on ${item.targetScenarioId}.`,
        keyEvents: Object.freeze([`scenario:${item.targetScenarioId}`]),
      })
    );
  }

  if (recoveryTick != null) {
    entries.push(
      Object.freeze({
        entryId: `recovery::${timeline.timelineId}::${recoveryTick}`,
        timelineId: timeline.timelineId,
        kind: "timeline_phase",
        tick: recoveryTick,
        replayImportanceScore: 0.75,
        createdAt: memoryCreatedAt(recoveryTick),
        summary: `Recovery progression detected at tick ${recoveryTick}.`,
        keyEvents: Object.freeze(["recovery_signal"]),
      })
    );
  }

  const sorted = entries.sort((a, b) => {
    const ta = a.tick ?? 0;
    const tb = b.tick ?? 0;
    if (ta !== tb) return ta - tb;
    return a.entryId.localeCompare(b.entryId);
  });

  const index = buildStrategicMemoryIndex(sorted, input.memoryId);
  const fingerprint = stableStringify({
    memoryId: input.memoryId,
    entryIds: sorted.map((e) => e.entryId),
    indexKeys: Object.keys(index.byTimelineId).length,
  });

  logReplayDev("StrategicMemory", {
    memoryId: input.memoryId,
    entryCount: sorted.length,
    fingerprint,
  });

  return Object.freeze({
    memoryId: input.memoryId,
    entries: Object.freeze(sorted.map((e) => Object.freeze({ ...e }))),
    index,
    fingerprint,
  });
}

export function lookupMemoryByDecisionId(
  memory: StrategicMemorySnapshot,
  decisionId: string
): readonly StrategicMemoryEntry[] {
  const ids = memory.index.byDecisionId[decisionId] ?? [];
  return memory.entries.filter((e) => ids.includes(e.entryId));
}

export function lookupMemoryByTimelineId(
  memory: StrategicMemorySnapshot,
  timelineId: string
): readonly StrategicMemoryEntry[] {
  const ids = memory.index.byTimelineId[timelineId] ?? [];
  return memory.entries.filter((e) => ids.includes(e.entryId));
}
