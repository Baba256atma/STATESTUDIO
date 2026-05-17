/**
 * D7:1:5 — Scenario branch comparison foundations (no UI).
 */

import type {
  ScenarioBranchComparisonMatrix,
  ScenarioBranchComparisonRow,
  ScenarioBranchForestState,
} from "./branchingTypes.ts";
import { EXECUTIVE_SCENARIO_KIND_LABELS } from "./branchingExecutiveSemantics.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

export function buildScenarioBranchComparisonMatrix(input: {
  forest: ScenarioBranchForestState;
  parentTimelineId: string;
  branchPointTick: number;
}): ScenarioBranchComparisonMatrix {
  const tick = Math.floor(Number(input.branchPointTick) || 0);
  const branches = input.forest.branches
    .filter((b) => b.parentTimelineId === input.parentTimelineId && b.branchPointTick === tick)
    .sort((a, b) => a.branchId.localeCompare(b.branchId));

  const rows: ScenarioBranchComparisonRow[] = branches.map((branch) => {
    const timeline = input.forest.timelinesById[branch.childTimelineId];
    const divergence = input.forest.divergences.find((d) => d.branchId === branch.branchId);
    const historyEntry = timeline?.history.entries[timeline.history.entries.length - 1];
    const executiveLabel =
      (branch.executiveScenarioKind && EXECUTIVE_SCENARIO_KIND_LABELS[branch.executiveScenarioKind]) ||
      branch.label;
    return {
      branchId: branch.branchId,
      childTimelineId: branch.childTimelineId,
      label: branch.label,
      currentTick: timeline?.currentTick ?? tick,
      executiveLabel,
      operationalImpactScore: divergence?.operationalImpactScore ?? 0,
      changedObjectCount: divergence?.changedObjectIds.length ?? 0,
      divergenceReason: branch.divergenceReason,
    };
  });

  return {
    parentTimelineId: input.parentTimelineId,
    branchPointTick: tick,
    rows,
    fingerprint: stableStringify(rows.map((r) => ({ id: r.branchId, impact: r.operationalImpactScore }))),
  };
}

export function listSiblingBranchesAtTick(
  forest: ScenarioBranchForestState,
  parentTimelineId: string,
  branchPointTick: number
): readonly string[] {
  return forest.branches
    .filter((b) => b.parentTimelineId === parentTimelineId && b.branchPointTick === branchPointTick)
    .map((b) => b.branchId)
    .sort();
}
