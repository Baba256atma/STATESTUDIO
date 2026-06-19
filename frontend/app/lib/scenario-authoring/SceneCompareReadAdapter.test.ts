import test from "node:test";
import assert from "node:assert/strict";

import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
} from "./ScenarioComparisonContract.ts";
import {
  buildExecutiveCompareSummary,
} from "./ExecutiveCompareSummary.ts";
import type { ExecutiveCompareSummary as ExecutiveCompareSummaryContract } from "./executiveCompareSummaryContract.ts";
import {
  adaptSceneCompareRead,
  C2_SCENE_ADAPTER_COMPLETE_TAG,
  getSceneCompareReadAdapterResult,
  resetSceneCompareReadAdapterForTests,
  SCENE_COMPARE_ADAPTER_DIAGNOSTIC,
  SCENE_COMPARE_READY_DIAGNOSTIC,
  SceneCompareReadAdapter,
} from "./SceneCompareReadAdapter.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  type ExecutiveSimulationSummary,
} from "./simulationResultAggregatorContract.ts";

function simulationSummary(id: string, impact: number, confidence: number): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    request: Object.freeze({
      draftId: id,
      dryRun: true,
      sceneMutation: false,
      dsMutation: false,
      routingMutation: false,
    }),
    overallScenarioImpact: impact,
    confidence,
    keyPositiveEffects: Object.freeze([`${id} positive effect`]),
    keyNegativeEffects: Object.freeze([`${id} negative effect`]),
  });
}

function comparison() {
  const request = buildScenarioComparisonRequest({
    comparisonId: "compare:scene-adapter",
    mode: "scenario_vs_scenario",
    scenarioA: {
      scenarioId: "scenario-a",
      label: "Scenario A",
      summary: simulationSummary("scenario-a", 72, 82),
      baseline: false,
    },
    scenarioB: {
      scenarioId: "scenario-b",
      label: "Scenario B",
      summary: simulationSummary("scenario-b", 55, 76),
      baseline: false,
    },
  });
  const objectDifference = buildScenarioDifferenceProfile({
    differenceId: "object-diff",
    category: "object",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 12,
    riskMovementDelta: -3,
    kpiMovementDelta: 2,
    confidenceDelta: 4,
    objectCountDelta: 1,
    relationshipCountDelta: 0,
    kpiCountDelta: 0,
    riskCountDelta: 0,
    advantage: "scenarioA",
    summary: "Object impact favors Scenario A.",
  });
  const riskDifference = buildScenarioDifferenceProfile({
    differenceId: "risk-diff",
    category: "risk",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 2,
    riskMovementDelta: -8,
    kpiMovementDelta: 0,
    confidenceDelta: -2,
    objectCountDelta: 0,
    relationshipCountDelta: 0,
    kpiCountDelta: 0,
    riskCountDelta: 1,
    advantage: "scenarioA",
    summary: "Risk exposure favors Scenario A.",
  });

  return buildScenarioComparisonResult({
    request,
    differences: [objectDifference, riskDifference],
    primaryDifference: objectDifference,
  });
}

test.beforeEach(() => {
  resetSceneCompareReadAdapterForTests();
});

test("exports C2 scene compare adapter tag and diagnostics", () => {
  assert.equal(C2_SCENE_ADAPTER_COMPLETE_TAG, "[C2_SCENE_ADAPTER_COMPLETE]");
  assert.equal(SCENE_COMPARE_ADAPTER_DIAGNOSTIC, "[SCENE_COMPARE_ADAPTER]");
  assert.equal(SCENE_COMPARE_READY_DIAGNOSTIC, "[SCENE_COMPARE_READY]");
  assert.deepEqual(SceneCompareReadAdapter.diagnostics, [
    "[SCENE_COMPARE_ADAPTER]",
    "[SCENE_COMPARE_READY]",
  ]);
});

test("reads C1 comparison and executive summary into immutable overlay profile", () => {
  const result = comparison();
  const executiveSummary = buildExecutiveCompareSummary({ comparison: result });
  const beforeComparison = JSON.stringify(result);
  const beforeSummary = JSON.stringify(executiveSummary);

  const adapterResult = adaptSceneCompareRead({ comparison: result, executiveSummary });

  assert.equal(adapterResult.comparisonId, "compare:scene-adapter");
  assert.equal(adapterResult.overlayProfile.comparisonId, "compare:scene-adapter");
  assert.equal(adapterResult.overlayProfile.scenarioAId, "scenario-a");
  assert.equal(adapterResult.overlayProfile.scenarioBId, "scenario-b");
  assert.equal(adapterResult.markerCount, 3);
  assert.equal(adapterResult.overlayProfile.markers[0]?.markerKind, "object");
  assert.equal(adapterResult.overlayProfile.markers[1]?.markerKind, "risk");
  assert.equal(adapterResult.overlayProfile.markers[2]?.markerKind, "summary");
  assert.equal(adapterResult.overlayProfile.markers[2]?.scenarioRole, executiveSummary.recommendedOption);
  assert.equal(adapterResult.readOnly, true);
  assert.equal(adapterResult.recalculation, false);
  assert.equal(adapterResult.mutation, false);
  assert.equal(adapterResult.sceneMutation, false);
  assert.equal(adapterResult.topologyMutation, false);
  assert.equal(adapterResult.routingMutation, false);
  assert.equal(JSON.stringify(result), beforeComparison);
  assert.equal(JSON.stringify(executiveSummary), beforeSummary);
  assert.equal(Object.isFrozen(adapterResult), true);
  assert.equal(Object.isFrozen(adapterResult.overlayProfile), true);
  assert.equal(Object.isFrozen(adapterResult.overlayProfile.markers), true);
  assert.throws(() => {
    (adapterResult.overlayProfile.markers as unknown as object[]).push({});
  }, TypeError);
});

test("rejects unaligned C1 output without mutating adapter state", () => {
  const result = comparison();
  const executiveSummary = buildExecutiveCompareSummary({ comparison: result });
  const mismatchedSummary: ExecutiveCompareSummaryContract = Object.freeze({
    ...executiveSummary,
    comparisonId: "compare:other",
  });

  assert.throws(() => {
    adaptSceneCompareRead({ comparison: result, executiveSummary: mismatchedSummary });
  }, /aligned C:1 comparison/);
  assert.equal(getSceneCompareReadAdapterResult().comparisonId, "");
});
