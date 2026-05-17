/**
 * D7:1:6 — Scenario comparison guard rails.
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import { logComparisonDev } from "./comparisonDevLog.ts";

export type ComparisonGuardCode =
  | "identical_timelines"
  | "incompatible_branch_origins"
  | "tick_out_of_range"
  | "missing_snapshot_at_tick"
  | "stale_forest_reference"
  | "empty_scenario_id"
  | "recursive_comparison";

export type ComparisonGuardResult =
  | { ok: true; compareAtTick: number }
  | { ok: false; code: ComparisonGuardCode; message: string };

export function resolveCompareAtTick(
  baseline: OperationalTimeline,
  comparison: OperationalTimeline,
  requestedTick?: number
): number {
  if (requestedTick != null && Number.isFinite(Number(requestedTick))) {
    return Math.floor(Number(requestedTick));
  }
  return Math.min(baseline.currentTick, comparison.currentTick);
}

export function guardScenarioComparison(input: {
  baseline: OperationalTimeline;
  comparison: OperationalTimeline;
  baselineScenarioId: string;
  comparisonScenarioId: string;
  compareAtTick?: number;
  forest?: ScenarioBranchForestState | null;
}): ComparisonGuardResult {
  const baselineId = String(input.baselineScenarioId ?? "").trim();
  const comparisonId = String(input.comparisonScenarioId ?? "").trim();
  if (!baselineId || !comparisonId) {
    return { ok: false, code: "empty_scenario_id", message: "Scenario ids are required" };
  }
  if (baselineId === comparisonId && input.baseline.timelineId === input.comparison.timelineId) {
    const result = {
      ok: false as const,
      code: "identical_timelines" as const,
      message: "Cannot compare a scenario to itself",
    };
    logComparisonDev("ComparisonGuard", { ...result });
    return result;
  }

  const tick = resolveCompareAtTick(input.baseline, input.comparison, input.compareAtTick);
  if (tick > input.baseline.currentTick || tick > input.comparison.currentTick) {
    const result = {
      ok: false as const,
      code: "tick_out_of_range" as const,
      message: `Compare tick ${tick} exceeds timeline bounds`,
    };
    logComparisonDev("ComparisonGuard", { ...result });
    return result;
  }

  const baseSnap = input.baseline.snapshots.find((s) => s.timestamp.tick === tick);
  const cmpSnap = input.comparison.snapshots.find((s) => s.timestamp.tick === tick);
  if (!baseSnap || !cmpSnap) {
    const result = {
      ok: false as const,
      code: "missing_snapshot_at_tick" as const,
      message: `Missing snapshot at tick ${tick} for one or both timelines`,
    };
    logComparisonDev("ComparisonGuard", { ...result });
    return result;
  }

  const forest = input.forest;
  if (forest) {
    const baseInForest = forest.timelinesById[input.baseline.timelineId];
    const cmpInForest = forest.timelinesById[input.comparison.timelineId];
    if (!baseInForest || !cmpInForest) {
      const result = {
        ok: false as const,
        code: "stale_forest_reference" as const,
        message: "One or both timelines are not registered in the scenario forest",
      };
      logComparisonDev("ComparisonGuard", { ...result });
      return result;
    }
    const sameRoot =
      (baseInForest.parentTimelineId ?? baseInForest.timelineId) ===
        (cmpInForest.parentTimelineId ?? cmpInForest.timelineId) ||
      baseInForest.timelineId === cmpInForest.parentTimelineId ||
      cmpInForest.timelineId === baseInForest.parentTimelineId;
    const sharedFork =
      baseInForest.forkTick != null &&
      cmpInForest.forkTick != null &&
      baseInForest.forkTick === cmpInForest.forkTick;
    if (!sameRoot && !sharedFork && baseInForest.timelineId !== forest.rootTimelineId) {
      const result = {
        ok: false as const,
        code: "incompatible_branch_origins" as const,
        message: "Timelines do not share a compatible branch origin for comparison",
      };
      logComparisonDev("ComparisonGuard", { ...result });
      return result;
    }
  }

  return { ok: true, compareAtTick: tick };
}
