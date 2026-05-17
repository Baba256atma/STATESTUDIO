/**
 * D7:1:5 — Divergence tracking between parent and child branch timelines.
 */

import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { SimulationPropagationSnapshotState } from "../simulationPropagationTypes.ts";
import type { BranchDivergenceSummary } from "./branchingTypes.ts";

function objectKeys(snapshot: SimulationStateSnapshot): string[] {
  return Object.keys(snapshot.objectStates ?? {}).sort();
}

function stableJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function propagationPaths(state: unknown): string[] {
  const p = state as SimulationPropagationSnapshotState | undefined;
  if (!p?.propagationChains?.length) return [];
  return p.propagationChains
    .map((c) => c.path.traversedObjectIds.join("->"))
    .filter(Boolean)
    .sort();
}

export function computeBranchDivergenceSummary(input: {
  branchId: string;
  parentTimelineId: string;
  branchPointTick: number;
  parentSnapshot: SimulationStateSnapshot;
  childForkSnapshot: SimulationStateSnapshot;
}): BranchDivergenceSummary {
  const changedObjectIds: string[] = [];
  const keys = new Set([...objectKeys(input.parentSnapshot), ...objectKeys(input.childForkSnapshot)]);
  for (const id of [...keys].sort()) {
    const left = input.parentSnapshot.objectStates[id];
    const right = input.childForkSnapshot.objectStates[id];
    if (stableJson(left) !== stableJson(right)) {
      changedObjectIds.push(id);
    }
  }

  const parentPaths = propagationPaths(input.parentSnapshot.propagationState);
  const childPaths = propagationPaths(input.childForkSnapshot.propagationState);
  const changedPropagationPaths = childPaths.filter((p) => !parentPaths.includes(p));

  const parentFrag = Number(input.parentSnapshot.operationalMetrics?.fragility ?? 0);
  const childFrag = Number(input.childForkSnapshot.operationalMetrics?.fragility ?? 0);
  const parentLoad = Number(input.parentSnapshot.operationalMetrics?.operationalLoad ?? 0);
  const childLoad = Number(input.childForkSnapshot.operationalMetrics?.operationalLoad ?? 0);
  const operationalImpactScore = Number(
    (
      Math.abs(childFrag - parentFrag) * 0.6 +
      Math.abs(childLoad - parentLoad) * 0.4 +
      Math.min(1, changedObjectIds.length * 0.08)
    ).toFixed(4)
  );

  return {
    branchId: input.branchId,
    parentTimelineId: input.parentTimelineId,
    branchPointTick: input.branchPointTick,
    changedObjectIds,
    changedPropagationPaths,
    operationalImpactScore,
    notes:
      changedObjectIds.length > 0
        ? [`${changedObjectIds.length} operational object(s) diverged at fork.`]
        : ["Fork differs in metrics or propagation only."],
  };
}
