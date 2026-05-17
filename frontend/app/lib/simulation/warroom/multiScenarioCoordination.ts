/**
 * D7:1:8 — Multi-scenario coordination (isolated scenarios, shared sync context).
 */

import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { ExecutiveScenarioKind } from "../branching/branchingTypes.ts";
import { resolveExecutiveBranchLabel } from "../branching/branchingExecutiveSemantics.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import { compareMultipleScenarios } from "../comparison/executiveScenarioComparisonEngine.ts";
import type {
  MultiScenarioComparisonResult,
  ScenarioComparisonSnapshot,
} from "../comparison/scenarioComparisonTypes.ts";
import { extractTimelineMetricProfile } from "../comparison/scenarioMetricsExtractor.ts";
import type { WarRoomScenarioSlot, WarRoomSyncRecord } from "./warRoomTypes.ts";
import { logWarRoomDev } from "./warRoomDevLog.ts";

function riskLevel(fragility: number): "low" | "moderate" | "high" | "critical" {
  if (fragility >= 0.75) return "critical";
  if (fragility >= 0.55) return "high";
  if (fragility >= 0.35) return "moderate";
  return "low";
}

export function buildWarRoomScenarioSlotsFromForest(input: {
  forest: ScenarioBranchForestState;
  baselineScenarioId?: string;
}): WarRoomScenarioSlot[] {
  const baselineId = input.baselineScenarioId ?? "baseline";
  const rootTimeline = input.forest.timelinesById[input.forest.rootTimelineId];
  if (!rootTimeline) return [];

  const slots: WarRoomScenarioSlot[] = [
    {
      scenarioId: baselineId,
      timelineId: rootTimeline.timelineId,
      label: "Baseline reality",
      role: "baseline",
      executiveLabel: "Current operational path",
    },
  ];

  for (const branch of [...input.forest.branches].sort((a, b) => a.branchId.localeCompare(b.branchId))) {
    slots.push({
      scenarioId: branch.branchId,
      timelineId: branch.childTimelineId,
      label: branch.label,
      role: "alternative",
      executiveLabel: resolveExecutiveBranchLabel({
        kind: branch.executiveScenarioKind,
        label: branch.label,
        divergenceReason: branch.divergenceReason,
      }),
    });
  }

  return slots;
}

export function cloneTimelinesByScenario(
  slots: readonly WarRoomScenarioSlot[],
  forest: ScenarioBranchForestState
): Record<string, OperationalTimeline> {
  const out: Record<string, OperationalTimeline> = {};
  for (const slot of slots) {
    const timeline =
      forest.timelinesById[slot.timelineId] ??
      Object.values(forest.timelinesById).find((t) => t.timelineId === slot.timelineId);
    if (timeline) out[slot.scenarioId] = timeline;
  }
  return out;
}

export function synchronizeWarRoomTimelines(input: {
  scenarioSlots: readonly WarRoomScenarioSlot[];
  timelinesByScenarioId: Readonly<Record<string, OperationalTimeline>>;
  syncAtTick?: number;
}): WarRoomSyncRecord {
  const ticks = input.scenarioSlots.map(
    (s) => input.timelinesByScenarioId[s.scenarioId]?.currentTick ?? 0
  );
  const naturalSync = ticks.length > 0 ? Math.min(...ticks) : 0;
  const requested =
    input.syncAtTick != null && Number.isFinite(Number(input.syncAtTick))
      ? Math.floor(Number(input.syncAtTick))
      : naturalSync;
  const syncTick = Math.min(requested, naturalSync);

  logWarRoomDev("Orchestration", {
    syncTick,
    scenarioCount: input.scenarioSlots.length,
    ticks,
  });

  return Object.freeze({
    syncTick,
    synchronizedScenarioIds: Object.freeze(
      input.scenarioSlots.map((s) => s.scenarioId).sort()
    ),
    createdAt: new Date(Date.UTC(2026, 0, 1) + syncTick * 1000).toISOString(),
  });
}

export function runCoordinatedScenarioComparison(input: {
  baselineScenarioId: string;
  scenarioSlots: readonly WarRoomScenarioSlot[];
  timelinesByScenarioId: Readonly<Record<string, OperationalTimeline>>;
  forest: ScenarioBranchForestState;
  syncTick: number;
}):
  | {
      ok: true;
      result: MultiScenarioComparisonResult;
      snapshots: readonly ScenarioComparisonSnapshot[];
    }
  | { ok: false; message: string } {
  const baseline = input.timelinesByScenarioId[input.baselineScenarioId];
  if (!baseline) {
    return { ok: false, message: `Missing baseline scenario ${input.baselineScenarioId}` };
  }

  const comparisons = input.scenarioSlots
    .filter((s) => s.scenarioId !== input.baselineScenarioId)
    .map((s) => ({
      scenarioId: s.scenarioId,
      timeline: input.timelinesByScenarioId[s.scenarioId]!,
    }))
    .filter((row) => row.timeline != null);

  if (comparisons.length === 0) {
    return { ok: false, message: "No alternative scenarios available for comparison" };
  }

  const result = compareMultipleScenarios({
    baseline,
    comparisons,
    compareAtTick: input.syncTick,
    forest: input.forest,
  });

  if (!("comparisons" in result)) {
    const message =
      result.guard.ok === false ? result.guard.message : "Scenario comparison rejected";
    return { ok: false, message };
  }

  return {
    ok: true,
    result,
    snapshots: result.comparisons,
  };
}

export function scenarioRiskLevelForSlot(
  slot: WarRoomScenarioSlot,
  timelinesByScenarioId: Readonly<Record<string, OperationalTimeline>>,
  syncTick: number
): "low" | "moderate" | "high" | "critical" {
  const timeline = timelinesByScenarioId[slot.scenarioId];
  if (!timeline) return "moderate";
  const profile = extractTimelineMetricProfile(timeline, syncTick);
  return riskLevel(profile.fragility);
}

export function executiveKindLabel(kind?: ExecutiveScenarioKind): string | undefined {
  if (!kind) return undefined;
  return resolveExecutiveBranchLabel({ kind, label: kind });
}
