/**
 * D7:1:5 — Branching guard rails (no exponential explosions).
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { ScenarioBranchForestState } from "./branchingTypes.ts";
import { logBranchingDev } from "./branchingDevLog.ts";

export const DEFAULT_MAX_ACTIVE_BRANCHES = 8;
export const DEFAULT_MAX_BRANCH_DEPTH = 4;

export type BranchGuardCode =
  | "max_branches_exceeded"
  | "max_branch_depth_exceeded"
  | "duplicate_branch_id"
  | "invalid_branch_point"
  | "stale_parent_timeline"
  | "branch_point_after_current_tick";

export type BranchGuardResult =
  | { ok: true }
  | { ok: false; code: BranchGuardCode; message: string };

export function computeBranchDepth(
  timeline: OperationalTimeline,
  forest: ScenarioBranchForestState
): number {
  let depth = 0;
  let parentId = timeline.parentTimelineId ?? null;
  const seen = new Set<string>();
  while (parentId) {
    if (seen.has(parentId)) break;
    seen.add(parentId);
    depth += 1;
    const parent = forest.timelinesById[parentId];
    parentId = parent?.parentTimelineId ?? null;
  }
  return depth;
}

export function guardMaxActiveBranches(
  forest: ScenarioBranchForestState,
  maxBranches: number = DEFAULT_MAX_ACTIVE_BRANCHES
): BranchGuardResult {
  if (forest.branches.length >= maxBranches) {
    const result: BranchGuardResult = {
      ok: false,
      code: "max_branches_exceeded",
      message: `Active branches ${forest.branches.length} exceeds max ${maxBranches}`,
    };
    logBranchingDev("BranchGuard", { ...result });
    return result;
  }
  return { ok: true };
}

export function guardBranchDepth(
  parentTimeline: OperationalTimeline,
  forest: ScenarioBranchForestState,
  maxDepth: number = DEFAULT_MAX_BRANCH_DEPTH
): BranchGuardResult {
  const nextDepth = computeBranchDepth(parentTimeline, forest) + 1;
  if (nextDepth > maxDepth) {
    const result: BranchGuardResult = {
      ok: false,
      code: "max_branch_depth_exceeded",
      message: `Branch depth ${nextDepth} exceeds max ${maxDepth}`,
    };
    logBranchingDev("BranchGuard", { ...result });
    return result;
  }
  return { ok: true };
}

export function guardDuplicateBranchId(
  forest: ScenarioBranchForestState,
  branchId: string
): BranchGuardResult {
  const id = String(branchId ?? "").trim();
  if (forest.branches.some((b) => b.branchId === id)) {
    const result: BranchGuardResult = {
      ok: false,
      code: "duplicate_branch_id",
      message: `Duplicate branch id ${id}`,
    };
    logBranchingDev("BranchGuard", { ...result });
    return result;
  }
  return { ok: true };
}

export function guardBranchPointTick(
  sourceTimeline: OperationalTimeline,
  branchPointTick: number
): BranchGuardResult {
  const tick = Math.floor(Number(branchPointTick) || 0);
  if (tick < 0 || tick > sourceTimeline.currentTick) {
    const result: BranchGuardResult = {
      ok: false,
      code: tick > sourceTimeline.currentTick ? "branch_point_after_current_tick" : "invalid_branch_point",
      message: `Branch point tick ${tick} invalid for timeline at ${sourceTimeline.currentTick}`,
    };
    logBranchingDev("BranchGuard", { ...result });
    return result;
  }
  const snap = sourceTimeline.snapshots.find((s) => s.timestamp.tick === tick);
  if (!snap) {
    const result: BranchGuardResult = {
      ok: false,
      code: "invalid_branch_point",
      message: `No snapshot at branch point tick ${tick}`,
    };
    logBranchingDev("BranchGuard", { ...result });
    return result;
  }
  return { ok: true };
}

export function guardStaleParentTimeline(
  forest: ScenarioBranchForestState,
  parentTimelineId: string
): BranchGuardResult {
  if (!forest.timelinesById[parentTimelineId]) {
    const result: BranchGuardResult = {
      ok: false,
      code: "stale_parent_timeline",
      message: `Parent timeline ${parentTimelineId} not found in forest`,
    };
    logBranchingDev("BranchGuard", { ...result });
    return result;
  }
  return { ok: true };
}
