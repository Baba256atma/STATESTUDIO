/**
 * D7:1:5 — Branching scenario timeline engine (immutable forks, isolated branches).
 */

import { createSimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import { getSnapshotAtTimelineTick } from "../timeline/operationalTimelineEvolutionEngine.ts";
import {
  buildTimelineSnapshotId,
  findSnapshotReferenceAtTick,
  freezeSimulationSnapshot,
  indexSnapshotsForTimeline,
} from "../timeline/timelineSnapshotIndex.ts";
import { buildTimelinePlaybackIndex } from "../timeline/timelinePlayback.ts";
import { createEmptyTimelineHistory, appendTimelineHistoryEntry } from "../timeline/timelineHistory.ts";
import { resolveExecutiveTimelinePhase } from "../timeline/timelineExecutiveSemantics.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type {
  BranchDivergenceSummary,
  ExecutiveScenarioKind,
  ScenarioBranchForestState,
  ScenarioTimelineBranch,
  TimelineBranchPoint,
} from "./branchingTypes.ts";
import { computeBranchDivergenceSummary } from "./branchDivergence.ts";
import {
  resolveExecutiveBranchLabel,
  slugifyBranchId,
} from "./branchingExecutiveSemantics.ts";
import { logBranchingDev } from "./branchingDevLog.ts";
import {
  computeBranchDepth,
  guardBranchDepth,
  guardBranchPointTick,
  guardDuplicateBranchId,
  guardMaxActiveBranches,
  guardStaleParentTimeline,
  type BranchGuardResult,
} from "./branchingGuards.ts";

export interface BranchForkHeadPatch {
  objectStatePatches?: Record<string, Record<string, unknown>>;
  operationalMetrics?: {
    fragility?: number;
    confidence?: number;
    operationalLoad?: number;
  };
  propagationState?: unknown;
}

export interface BranchDivergenceInput {
  branchId?: string;
  label?: string;
  executiveScenarioKind?: ExecutiveScenarioKind;
  divergenceReason?: string;
  triggeringEventId?: string;
  forkHeadPatch?: BranchForkHeadPatch;
}

export interface CreateScenarioBranchInput {
  sourceTimeline: OperationalTimeline;
  forest: ScenarioBranchForestState;
  branchPointTick: number;
  divergenceInput: BranchDivergenceInput;
}

export type CreateScenarioBranchResult =
  | {
      ok: true;
      parentTimeline: OperationalTimeline;
      branchTimeline: OperationalTimeline;
      branch: ScenarioTimelineBranch;
      branchPoint: TimelineBranchPoint;
      divergence: BranchDivergenceSummary;
      forest: ScenarioBranchForestState;
    }
  | { ok: false; guard: BranchGuardResult };

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function cloneSnapshotsUpToTick(
  source: OperationalTimeline,
  tick: number
): SimulationStateSnapshot[] {
  return source.snapshots
    .filter((s) => s.timestamp.tick <= tick)
    .sort((a, b) => a.timestamp.tick - b.timestamp.tick)
    .map((s) => freezeSimulationSnapshot(s));
}

function applyForkHeadPatch(
  snapshot: SimulationStateSnapshot,
  patch?: BranchForkHeadPatch
): SimulationStateSnapshot {
  if (!patch) return freezeSimulationSnapshot(snapshot);
  const objectStates = freezeSimulationSnapshot(snapshot).objectStates;
  for (const [objectId, delta] of Object.entries(patch.objectStatePatches ?? {})) {
    const prev =
      objectStates[objectId] && typeof objectStates[objectId] === "object" && !Array.isArray(objectStates[objectId])
        ? (objectStates[objectId] as Record<string, unknown>)
        : {};
    objectStates[objectId] = { ...prev, ...delta };
  }
  const metrics = {
    ...(snapshot.operationalMetrics ?? {}),
    ...(patch.operationalMetrics ?? {}),
  };
  const propagationState =
    patch.propagationState !== undefined ? patch.propagationState : snapshot.propagationState;
  return createSimulationStateSnapshot({
    simulationId: snapshot.simulationId,
    branchId: snapshot.branchId,
    timestamp: { ...snapshot.timestamp },
    objectStates,
    propagationState,
    operationalMetrics: metrics,
  });
}

export function createScenarioBranchForest(rootTimeline: OperationalTimeline): ScenarioBranchForestState {
  return {
    rootTimelineId: rootTimeline.timelineId,
    timelinesById: { [rootTimeline.timelineId]: rootTimeline },
    branches: [],
    branchPoints: [],
    divergences: [],
    fingerprint: stableStringify({ root: rootTimeline.timelineId, branches: [] }),
  };
}

export function upsertTimelineInForest(
  forest: ScenarioBranchForestState,
  timeline: OperationalTimeline
): ScenarioBranchForestState {
  return {
    ...forest,
    timelinesById: { ...forest.timelinesById, [timeline.timelineId]: timeline },
    fingerprint: stableStringify({
      root: forest.rootTimelineId,
      timelines: Object.keys({ ...forest.timelinesById, [timeline.timelineId]: true }).sort(),
      branches: forest.branches.map((b) => b.branchId),
    }),
  };
}

/**
 * Fork an alternative future timeline from `branchPointTick` without mutating the parent.
 */
export function createScenarioBranch(input: CreateScenarioBranchInput): CreateScenarioBranchResult {
  const parent = input.sourceTimeline;
  const forest = input.forest;
  const branchPointTick = Math.floor(Number(input.branchPointTick) || 0);

  const guards: BranchGuardResult[] = [
    guardStaleParentTimeline(forest, parent.timelineId),
    guardBranchPointTick(parent, branchPointTick),
    guardMaxActiveBranches(forest),
    guardBranchDepth(parent, forest),
  ];
  for (const g of guards) {
    if (!g.ok) return { ok: false, guard: g };
  }

  const label = resolveExecutiveBranchLabel({
    kind: input.divergenceInput.executiveScenarioKind,
    label: input.divergenceInput.label,
    divergenceReason: input.divergenceInput.divergenceReason,
  });
  const branchId =
    String(input.divergenceInput.branchId ?? "").trim() ||
    `${slugifyBranchId(label) || "future"}_${branchPointTick}`;

  const dup = guardDuplicateBranchId(forest, branchId);
  if (!dup.ok) return { ok: false, guard: dup };

  const parentSnapshot = getSnapshotAtTimelineTick(parent, branchPointTick);
  if (!parentSnapshot) {
    return {
      ok: false,
      guard: {
        ok: false,
        code: "invalid_branch_point",
        message: `Missing parent snapshot at tick ${branchPointTick}`,
      },
    };
  }

  const childTimelineId = `${parent.timelineId}::branch::${branchId}`;
  const inheritedSnapshots = cloneSnapshotsUpToTick(parent, branchPointTick);
  const forkHead = applyForkHeadPatch(parentSnapshot, input.divergenceInput.forkHeadPatch);

  const childBranchDepth = computeBranchDepth(parent, forest) + 1;
  const childSimulationBranchId = `${parent.branchId}/${branchId}`;

  const forkSnapshots = inheritedSnapshots.map((snap, index) => {
    if (index === inheritedSnapshots.length - 1) {
      return createSimulationStateSnapshot({
        simulationId: snap.simulationId,
        branchId: childSimulationBranchId,
        timestamp: { ...forkHead.timestamp },
        objectStates: { ...forkHead.objectStates },
        propagationState: forkHead.propagationState,
        operationalMetrics: forkHead.operationalMetrics,
      });
    }
    return createSimulationStateSnapshot({
      ...snap,
      branchId: childSimulationBranchId,
    });
  });

  const snapshotIndex = indexSnapshotsForTimeline(childTimelineId, forkSnapshots);
  const executive = resolveExecutiveTimelinePhase({
    tick: branchPointTick,
    metrics: forkHead.operationalMetrics,
    propagationState: forkHead.propagationState,
  });

  let history = createEmptyTimelineHistory();
  for (const snap of forkSnapshots) {
    history = appendTimelineHistoryEntry({
      history,
      snapshot: snap,
      timelineId: childTimelineId,
      executive,
      causalLinks: [],
    });
  }

  const branchTimeline: OperationalTimeline = {
    timelineId: childTimelineId,
    branchId: childSimulationBranchId,
    createdAt: new Date().toISOString(),
    snapshots: forkSnapshots,
    snapshotIndex,
    currentTick: branchPointTick,
    status: "idle",
    causality: [],
    history,
    playback: {
      timelineId: childTimelineId,
      branchId: childSimulationBranchId,
      minTick: forkSnapshots[0]?.timestamp.tick ?? 0,
      maxTick: branchPointTick,
      scrubPoints: [],
      branchAnchorId: `${parent.timelineId}::${branchId}`,
    },
    parentTimelineId: parent.timelineId,
    forkTick: branchPointTick,
  };
  branchTimeline.playback = buildTimelinePlaybackIndex(branchTimeline);

  const sourceSnapshotId =
    findSnapshotReferenceAtTick(parent.snapshotIndex, branchPointTick)?.snapshotId ??
    buildTimelineSnapshotId(parent.timelineId, branchPointTick, parentSnapshot.fingerprint);

  const branch: ScenarioTimelineBranch = {
    branchId,
    parentTimelineId: parent.timelineId,
    branchPointTick,
    label,
    createdAt: new Date().toISOString(),
    divergenceReason: input.divergenceInput.divergenceReason,
    executiveScenarioKind: input.divergenceInput.executiveScenarioKind,
    triggeringEventId: input.divergenceInput.triggeringEventId,
    childTimelineId,
    branchDepth: childBranchDepth,
  };

  const existingPoint = forest.branchPoints.find(
    (p) => p.parentTimelineId === parent.timelineId && p.tick === branchPointTick
  );
  const branchPoint: TimelineBranchPoint = existingPoint
    ? {
        ...existingPoint,
        createdBranches: [...existingPoint.createdBranches, branchId].sort(),
      }
    : {
        tick: branchPointTick,
        sourceSnapshotId,
        parentTimelineId: parent.timelineId,
        triggeringEventId: input.divergenceInput.triggeringEventId,
        createdBranches: [branchId],
      };

  const divergence = computeBranchDivergenceSummary({
    branchId,
    parentTimelineId: parent.timelineId,
    branchPointTick,
    parentSnapshot: freezeSimulationSnapshot(parentSnapshot),
    childForkSnapshot: forkHead,
  });

  const branchPoints = existingPoint
    ? forest.branchPoints.map((p) =>
        p.parentTimelineId === parent.timelineId && p.tick === branchPointTick ? branchPoint : p
      )
    : [...forest.branchPoints, branchPoint].sort(
        (a, b) => a.tick - b.tick || a.parentTimelineId.localeCompare(b.parentTimelineId)
      );

  const nextForest: ScenarioBranchForestState = {
    rootTimelineId: forest.rootTimelineId,
    timelinesById: { ...forest.timelinesById, [childTimelineId]: branchTimeline },
    branches: [...forest.branches, branch].sort((a, b) => a.branchId.localeCompare(b.branchId)),
    branchPoints,
    divergences: [...forest.divergences, divergence].sort((a, b) =>
      a.branchId.localeCompare(b.branchId)
    ),
    fingerprint: stableStringify({
      root: forest.rootTimelineId,
      branches: [...forest.branches, branch].map((b) => b.branchId).sort(),
    }),
  };

  logBranchingDev("BranchFork", {
    parentTimelineId: parent.timelineId,
    childTimelineId,
    branchId,
    branchPointTick,
    label,
  });
  logBranchingDev("ScenarioDivergence", {
    branchId,
    changedObjects: divergence.changedObjectIds.length,
    impact: divergence.operationalImpactScore,
  });
  logBranchingDev("TimelineBranch", {
    branchId,
    depth: childBranchDepth,
    siblings: branchPoint.createdBranches.length,
  });

  return {
    ok: true,
    parentTimeline: parent,
    branchTimeline,
    branch,
    branchPoint,
    divergence,
    forest: nextForest,
  };
}

export function scenarioBranchForestFingerprint(forest: ScenarioBranchForestState): string {
  return forest.fingerprint;
}

/** Update a branch timeline in the forest after isolated evolution (parent untouched). */
export function commitBranchTimelineEvolution(
  forest: ScenarioBranchForestState,
  branchTimelineId: string,
  evolved: OperationalTimeline
): ScenarioBranchForestState {
  const existing = forest.timelinesById[branchTimelineId];
  if (!existing) return forest;
  if (evolved.parentTimelineId !== existing.parentTimelineId) {
    return forest;
  }
  return upsertTimelineInForest(forest, evolved);
}
