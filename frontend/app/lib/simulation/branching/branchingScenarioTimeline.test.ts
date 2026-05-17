/**
 * D7:1:5 — Branching scenario timeline tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { createSimulationStateSnapshot, createSimulationTimestamp } from "../simulationFoundation.index.ts";
import {
  advanceOperationalTimeline,
  createOperationalTimeline,
} from "../timeline/operationalTimelineEvolutionEngine.ts";
import {
  commitBranchTimelineEvolution,
  createScenarioBranch,
  createScenarioBranchForest,
  scenarioBranchForestFingerprint,
} from "./branchingScenarioTimelineEngine.ts";
import { buildScenarioBranchComparisonMatrix } from "./branchComparison.ts";
import { DEFAULT_MAX_ACTIVE_BRANCHES, guardMaxActiveBranches } from "./branchingGuards.ts";

function snap(tick: number, fragility = 0.2) {
  return createSimulationStateSnapshot({
    simulationId: "sim-1",
    timestamp: createSimulationTimestamp(tick, { epochSimulatedAt: "2026-01-01T00:00:00.000Z" }),
    objectStates: {
      inventory: { operationalState: "stable" },
      supply: { operationalState: "stable" },
    },
    operationalMetrics: { fragility, confidence: 0.75, operationalLoad: 0.3 },
  });
}

test("branch fork preserves immutable parent timeline", () => {
  const parent = createOperationalTimeline({ timelineId: "tl-root", initialSnapshot: snap(0) });
  const parentFrozen = JSON.stringify(parent);
  let forest = createScenarioBranchForest(parent);

  const fork = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: {
      executiveScenarioKind: "supply_recovery_success",
      divergenceReason: "Recovery succeeds",
      forkHeadPatch: {
        operationalMetrics: { fragility: 0.25 },
        objectStatePatches: { supply: { operationalState: "recovering" } },
      },
    },
  });
  assert.ok(fork.ok);
  if (!fork.ok) return;
  forest = fork.forest;

  assert.equal(JSON.stringify(parent), parentFrozen);
  assert.equal(parent.snapshots.length, 1);
  assert.equal(fork.branchTimeline.snapshots.length, 1);
  assert.equal(fork.branchTimeline.parentTimelineId, "tl-root");
  assert.equal(fork.branchTimeline.forkTick, 0);
});

test("sibling branches are isolated", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-sib", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);

  const a = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: {
      branchId: "future_a",
      executiveScenarioKind: "supply_recovery_success",
      forkHeadPatch: { operationalMetrics: { fragility: 0.3 } },
    },
  });
  assert.ok(a.ok);
  if (!a.ok) return;
  forest = a.forest;
  parent = a.parentTimeline;

  const b = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: {
      branchId: "future_b",
      executiveScenarioKind: "partial_recovery_failure",
      forkHeadPatch: { operationalMetrics: { fragility: 0.7 } },
    },
  });
  assert.ok(b.ok);
  if (!b.ok) return;
  forest = b.forest;

  const timelineA = forest.timelinesById[a.branchTimeline.timelineId]!;
  const timelineB = forest.timelinesById[b.branchTimeline.timelineId]!;
  assert.notEqual(timelineA.timelineId, timelineB.timelineId);
  assert.notEqual(
    timelineA.snapshots[0]!.operationalMetrics?.fragility,
    timelineB.snapshots[0]!.operationalMetrics?.fragility
  );
});

test("branch isolation: evolving child does not mutate parent", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-iso", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);
  const fork = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: { branchId: "iso_branch", label: "Controlled stabilization" },
  });
  assert.ok(fork.ok);
  if (!fork.ok) return;
  forest = fork.forest;
  parent = fork.parentTimeline;

  const advanced = advanceOperationalTimeline({
    timeline: fork.branchTimeline,
    simulationEvents: [],
    nextSnapshot: snap(1, 0.55),
    nextTick: 1,
  });
  assert.ok(advanced.ok);
  if (!advanced.ok) return;

  forest = commitBranchTimelineEvolution(forest, fork.branchTimeline.timelineId, advanced.timeline);
  assert.equal(parent.snapshots.length, 1);
  assert.equal(parent.currentTick, 0);
  assert.equal(forest.timelinesById[fork.branchTimeline.timelineId]!.currentTick, 1);
});

test("deterministic branch ordering in forest", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-det", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);
  for (const id of ["branch_z", "branch_a", "branch_m"]) {
    const r = createScenarioBranch({
      sourceTimeline: parent,
      forest,
      branchPointTick: 0,
      divergenceInput: { branchId: id, label: id },
    });
    assert.ok(r.ok);
    if (!r.ok) return;
    forest = r.forest;
    parent = r.parentTimeline;
  }
  assert.deepEqual(
    forest.branches.map((b) => b.branchId),
    ["branch_a", "branch_m", "branch_z"]
  );
});

test("max active branches guard", () => {
  const parent = createOperationalTimeline({ timelineId: "tl-max", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);
  for (let i = 0; i < DEFAULT_MAX_ACTIVE_BRANCHES; i += 1) {
    const r = createScenarioBranch({
      sourceTimeline: parent,
      forest,
      branchPointTick: 0,
      divergenceInput: { branchId: `branch_${i}`, label: `Future ${i}` },
    });
    assert.ok(r.ok);
    if (!r.ok) return;
    forest = r.forest;
  }
  const blocked = guardMaxActiveBranches(forest);
  assert.equal(blocked.ok, false);
});

test("comparison matrix lists siblings at branch point", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-cmp", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);
  for (const id of ["future_a", "future_b"]) {
    const r = createScenarioBranch({
      sourceTimeline: parent,
      forest,
      branchPointTick: 0,
      divergenceInput: {
        branchId: id,
        executiveScenarioKind:
          id === "future_a" ? "supply_recovery_success" : "global_crisis_escalation",
      },
    });
    assert.ok(r.ok);
    if (!r.ok) return;
    forest = r.forest;
    parent = r.parentTimeline;
  }
  const matrix = buildScenarioBranchComparisonMatrix({
    forest,
    parentTimelineId: "tl-cmp",
    branchPointTick: 0,
  });
  assert.equal(matrix.rows.length, 2);
  assert.equal(matrix.rows[0]!.branchId, "future_a");
  assert.equal(matrix.rows[1]!.branchId, "future_b");
});

test("replay-safe forest fingerprint stable", () => {
  const parent = createOperationalTimeline({ timelineId: "tl-fp", initialSnapshot: snap(0) });
  const forest = createScenarioBranchForest(parent);
  const fp1 = scenarioBranchForestFingerprint(forest);
  const fp2 = scenarioBranchForestFingerprint(forest);
  assert.equal(fp1, fp2);
});
