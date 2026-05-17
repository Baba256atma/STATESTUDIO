/**
 * D7:1:6 — Executive scenario comparison tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { createSimulationStateSnapshot, createSimulationTimestamp } from "../simulationFoundation.index.ts";
import { createOperationalTimeline } from "../timeline/operationalTimelineEvolutionEngine.ts";
import {
  createScenarioBranch,
  createScenarioBranchForest,
} from "../branching/branchingScenarioTimelineEngine.ts";
import {
  buildComparisonFingerprint,
  compareMultipleScenarios,
  compareScenarioTimelines,
  freezeComparisonSnapshot,
} from "./executiveScenarioComparisonEngine.ts";
import { analyzeScenarioDelta } from "./scenarioDeltaAnalysis.ts";
import { analyzeStrategicTradeoffs, buildScenarioComparisonMetrics } from "./strategicTradeoffAnalysis.ts";
import { buildExecutiveComparisonNarrative } from "./executiveScenarioNarratives.ts";
import { extractTimelineMetricProfile } from "./scenarioMetricsExtractor.ts";

function snap(
  tick: number,
  opts: {
    fragility?: number;
    supplyState?: string;
    inventoryState?: string;
    propagationPaths?: string[][];
  } = {}
) {
  const fragility = opts.fragility ?? 0.2;
  return createSimulationStateSnapshot({
    simulationId: "sim-cmp",
    timestamp: createSimulationTimestamp(tick, { epochSimulatedAt: "2026-01-01T00:00:00.000Z" }),
    objectStates: {
      inventory: { operationalState: opts.inventoryState ?? "stable" },
      supply: { operationalState: opts.supplyState ?? "stable" },
    },
    operationalMetrics: { fragility, confidence: 0.75, operationalLoad: 0.3 },
    propagationState:
      opts.propagationPaths && opts.propagationPaths.length > 0
        ? {
            propagationChains: opts.propagationPaths.map((ids, i) => ({
              chainId: `chain-${i}`,
              path: { traversedObjectIds: ids },
            })),
            intensityMap: {},
          }
        : undefined,
  });
}

test("deterministic comparison fingerprints", () => {
  const base = createOperationalTimeline({ timelineId: "tl-a", initialSnapshot: snap(0, { fragility: 0.2 }) });
  const cmp = createOperationalTimeline({
    timelineId: "tl-b",
    initialSnapshot: snap(0, { fragility: 0.55, supplyState: "degraded" }),
  });

  const r1 = compareScenarioTimelines({
    baseline: base,
    comparison: cmp,
    baselineScenarioId: "future_a",
    comparisonScenarioId: "future_b",
    compareAtTick: 0,
  });
  const r2 = compareScenarioTimelines({
    baseline: base,
    comparison: cmp,
    baselineScenarioId: "future_a",
    comparisonScenarioId: "future_b",
    compareAtTick: 0,
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.equal(r1.snapshot.metrics.fragilityDelta, r2.snapshot.metrics.fragilityDelta);
});

test("delta analysis detects risk escalation and recovery differences", () => {
  const base = createOperationalTimeline({
    timelineId: "tl-d0",
    initialSnapshot: snap(0, { inventoryState: "degraded", supplyState: "stable" }),
  });
  const cmp = createOperationalTimeline({
    timelineId: "tl-d1",
    initialSnapshot: snap(0, { supplyState: "critical", inventoryState: "recovering" }),
  });
  const delta = analyzeScenarioDelta({ baseline: base, comparison: cmp, compareAtTick: 0 });
  assert.ok(delta.changedObjects.includes("supply"));
  assert.ok(delta.riskEscalations.includes("supply"));
  assert.ok(delta.recoveryDifferences.includes("inventory"));
  assert.ok(delta.divergenceSeverity > 0);
});

test("tradeoff analysis explains strategic dimensions", () => {
  const baseline = extractTimelineMetricProfile(
    createOperationalTimeline({ timelineId: "tl-t0", initialSnapshot: snap(0, { fragility: 0.7 }) }),
    0
  );
  const comparison = extractTimelineMetricProfile(
    createOperationalTimeline({ timelineId: "tl-t1", initialSnapshot: snap(0, { fragility: 0.25 }) }),
    0
  );
  const metrics = buildScenarioComparisonMetrics(baseline, comparison);
  const tradeoffs = analyzeStrategicTradeoffs({ metrics, baseline, comparison });
  assert.ok(tradeoffs.some((t) => t.dimension === "stability"));
  assert.ok(tradeoffs.some((t) => t.dimension === "resilience"));
  assert.ok(metrics.fragilityDelta < 0);
});

test("executive narrative is strategic not technical", () => {
  const baseline = extractTimelineMetricProfile(
    createOperationalTimeline({ timelineId: "tl-n0", initialSnapshot: snap(0, { fragility: 0.2 }) }),
    0
  );
  const comparison = extractTimelineMetricProfile(
    createOperationalTimeline({ timelineId: "tl-n1", initialSnapshot: snap(0, { fragility: 0.65 }) }),
    0
  );
  const metrics = buildScenarioComparisonMetrics(baseline, comparison);
  const narrative = buildExecutiveComparisonNarrative({
    baselineScenarioId: "steady_growth",
    comparisonScenarioId: "fast_expansion",
    metrics,
    delta: {
      changedObjects: ["supply"],
      riskEscalations: ["supply"],
      recoveryDifferences: [],
      majorOperationalChanges: ["supply: stable → degraded"],
      propagationPathChanges: [],
      divergenceSeverity: 0.2,
    },
    tradeoffs: analyzeStrategicTradeoffs({ metrics, baseline, comparison }),
    baselineProfile: baseline,
    comparisonProfile: comparison,
  });
  assert.match(narrative.headline, /safer|similar|risk/i);
  assert.ok(!narrative.headline.includes("node graph"));
  assert.ok(narrative.summary.length > 10);
});

test("comparison does not mutate source timelines", () => {
  const base = createOperationalTimeline({ timelineId: "tl-m0", initialSnapshot: snap(0) });
  const cmp = createOperationalTimeline({ timelineId: "tl-m1", initialSnapshot: snap(0, { fragility: 0.5 }) });
  const frozenBase = JSON.stringify(base);
  const frozenCmp = JSON.stringify(cmp);
  const result = compareScenarioTimelines({
    baseline: base,
    comparison: cmp,
    baselineScenarioId: "a",
    comparisonScenarioId: "b",
  });
  assert.ok(result.ok);
  assert.equal(JSON.stringify(base), frozenBase);
  assert.equal(JSON.stringify(cmp), frozenCmp);
});

test("replay-safe frozen comparison snapshot", () => {
  const base = createOperationalTimeline({ timelineId: "tl-r0", initialSnapshot: snap(0) });
  const cmp = createOperationalTimeline({ timelineId: "tl-r1", initialSnapshot: snap(0, { fragility: 0.4 }) });
  const result = compareScenarioTimelines({
    baseline: base,
    comparison: cmp,
    baselineScenarioId: "a",
    comparisonScenarioId: "b",
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeComparisonSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.metrics as { fragilityDelta: number }).fragilityDelta = 9;
  });
  assert.equal(frozen.fingerprint, result.snapshot.fingerprint);
});

test("rejects identical timeline self-comparison", () => {
  const tl = createOperationalTimeline({ timelineId: "tl-self", initialSnapshot: snap(0) });
  const result = compareScenarioTimelines({
    baseline: tl,
    comparison: tl,
    baselineScenarioId: "same",
    comparisonScenarioId: "same",
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.guard.code, "identical_timelines");
});

test("rejects tick out of range", () => {
  const base = createOperationalTimeline({ timelineId: "tl-o0", initialSnapshot: snap(0) });
  const cmp = createOperationalTimeline({ timelineId: "tl-o1", initialSnapshot: snap(0) });
  const result = compareScenarioTimelines({
    baseline: base,
    comparison: cmp,
    baselineScenarioId: "a",
    comparisonScenarioId: "b",
    compareAtTick: 99,
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.guard.code, "tick_out_of_range");
});

test("branch forest sibling comparison with replay fingerprint stability", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-forest", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);

  const a = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: {
      branchId: "recovery_path",
      forkHeadPatch: { operationalMetrics: { fragility: 0.25 }, objectStatePatches: { supply: { operationalState: "recovering" } } },
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
      branchId: "crisis_path",
      forkHeadPatch: { operationalMetrics: { fragility: 0.8 }, objectStatePatches: { supply: { operationalState: "critical" } } },
    },
  });
  assert.ok(b.ok);
  if (!b.ok) return;
  forest = b.forest;

  const timelineA = forest.timelinesById[a.branchTimeline.timelineId]!;
  const timelineB = forest.timelinesById[b.branchTimeline.timelineId]!;

  const result = compareScenarioTimelines({
    baseline: timelineA,
    comparison: timelineB,
    baselineScenarioId: "recovery_path",
    comparisonScenarioId: "crisis_path",
    compareAtTick: 0,
    forest,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(result.snapshot.narrative.headline.length > 0);
  assert.ok(result.snapshot.metrics.fragilityDelta > 0);
  const fp = buildComparisonFingerprint({
    baselineScenarioId: "recovery_path",
    comparisonScenarioId: "crisis_path",
    compareAtTick: 0,
    baselineTimelineId: timelineA.timelineId,
    comparisonTimelineId: timelineB.timelineId,
    metrics: result.snapshot.metrics,
    delta: result.snapshot.delta,
  });
  assert.equal(fp, result.snapshot.fingerprint);
});

test("compareMultipleScenarios builds panel contract", () => {
  let parent = createOperationalTimeline({ timelineId: "tl-multi", initialSnapshot: snap(0) });
  let forest = createScenarioBranchForest(parent);

  const a = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: { branchId: "path_a", forkHeadPatch: { operationalMetrics: { fragility: 0.3 } } },
  });
  assert.ok(a.ok);
  if (!a.ok) return;
  forest = a.forest;
  parent = a.parentTimeline;

  const b = createScenarioBranch({
    sourceTimeline: parent,
    forest,
    branchPointTick: 0,
    divergenceInput: { branchId: "path_b", forkHeadPatch: { operationalMetrics: { fragility: 0.6 } } },
  });
  assert.ok(b.ok);
  if (!b.ok) return;
  forest = b.forest;

  const multi = compareMultipleScenarios({
    baseline: parent,
    comparisons: [
      { timeline: forest.timelinesById[a.branchTimeline.timelineId]!, scenarioId: "path_a" },
      { timeline: forest.timelinesById[b.branchTimeline.timelineId]!, scenarioId: "path_b" },
    ],
    forest,
  });
  assert.ok("comparisons" in multi);
  if (!("comparisons" in multi)) return;
  assert.equal(multi.comparisons.length, 2);
  assert.ok(multi.panelContract.scenarios.length >= 2);
  assert.ok(multi.panelContract.narratives.length === 2);
});
