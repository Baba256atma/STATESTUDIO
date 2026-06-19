import test from "node:test";
import assert from "node:assert/strict";

import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
} from "./ScenarioComparisonContract.ts";
import {
  buildExecutiveCompareSummary,
  ExecutiveCompareSummary,
  getExecutiveCompareSummary,
  resetExecutiveCompareSummaryForTests,
} from "./ExecutiveCompareSummary.ts";
import {
  C1_EXEC_SUMMARY_COMPLETE_TAG,
  EXEC_COMPARE_SUMMARY_DIAGNOSTIC,
  EXEC_COMPARE_SUMMARY_READY_DIAGNOSTIC,
} from "./executiveCompareSummaryContract.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  type ExecutiveSimulationSummary,
} from "./simulationResultAggregatorContract.ts";

function simulationSummary(id: string, confidence = 80): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    request: Object.freeze({
      draftId: id,
      dryRun: true,
      sceneMutation: false,
      dsMutation: false,
      routingMutation: false,
    }),
    overallScenarioImpact: id === "scenario-a" ? 68 : 55,
    confidence,
    keyPositiveEffects: Object.freeze(["Positive effect"]),
    keyNegativeEffects: Object.freeze(["Negative effect"]),
  });
}

function comparison() {
  const request = buildScenarioComparisonRequest({
    comparisonId: "compare:exec",
    mode: "scenario_vs_scenario",
    scenarioA: {
      scenarioId: "scenario-a",
      label: "Scenario A",
      summary: simulationSummary("scenario-a", 82),
      baseline: false,
    },
    scenarioB: {
      scenarioId: "scenario-b",
      label: "Scenario B",
      summary: simulationSummary("scenario-b", 74),
      baseline: false,
    },
  });
  const differences = [
    buildScenarioDifferenceProfile({
      differenceId: "object-diff",
      category: "object",
      scenarioAId: "scenario-a",
      scenarioBId: "scenario-b",
      overallImpactDelta: 8,
      riskMovementDelta: -2,
      kpiMovementDelta: 1,
      confidenceDelta: 3,
      objectCountDelta: 1,
      relationshipCountDelta: 0,
      kpiCountDelta: 0,
      riskCountDelta: 0,
      advantage: "scenarioA",
      summary: "Object resilience is stronger.",
    }),
    buildScenarioDifferenceProfile({
      differenceId: "relationship-diff",
      category: "relationship",
      scenarioAId: "scenario-a",
      scenarioBId: "scenario-b",
      overallImpactDelta: -2,
      riskMovementDelta: 5,
      kpiMovementDelta: 0,
      confidenceDelta: -4,
      objectCountDelta: 0,
      relationshipCountDelta: 1,
      kpiCountDelta: 0,
      riskCountDelta: 0,
      advantage: "scenarioB",
      summary: "Relationship exposure is lower.",
    }),
    buildScenarioDifferenceProfile({
      differenceId: "kpi-diff",
      category: "kpi",
      scenarioAId: "scenario-a",
      scenarioBId: "scenario-b",
      overallImpactDelta: 4,
      riskMovementDelta: 0,
      kpiMovementDelta: 6,
      confidenceDelta: 1,
      objectCountDelta: 0,
      relationshipCountDelta: 0,
      kpiCountDelta: 1,
      riskCountDelta: 0,
      advantage: "scenarioA",
      summary: "KPI movement is stronger.",
    }),
    buildScenarioDifferenceProfile({
      differenceId: "risk-diff",
      category: "risk",
      scenarioAId: "scenario-a",
      scenarioBId: "scenario-b",
      overallImpactDelta: 2,
      riskMovementDelta: -7,
      kpiMovementDelta: 0,
      confidenceDelta: 2,
      objectCountDelta: 0,
      relationshipCountDelta: 0,
      kpiCountDelta: 0,
      riskCountDelta: 1,
      advantage: "scenarioA",
      summary: "Risk movement is better.",
    }),
  ];

  return buildScenarioComparisonResult({
    request,
    differences,
    primaryDifference: differences[0],
  });
}

test.beforeEach(() => {
  resetExecutiveCompareSummaryForTests();
});

test("exports C1 executive compare summary tag and diagnostics", () => {
  assert.equal(C1_EXEC_SUMMARY_COMPLETE_TAG, "[C1_EXEC_SUMMARY_COMPLETE]");
  assert.equal(EXEC_COMPARE_SUMMARY_DIAGNOSTIC, "[EXEC_COMPARE_SUMMARY]");
  assert.equal(EXEC_COMPARE_SUMMARY_READY_DIAGNOSTIC, "[EXEC_COMPARE_SUMMARY_READY]");
  assert.deepEqual(ExecutiveCompareSummary.diagnostics, [
    "[EXEC_COMPARE_SUMMARY]",
    "[EXEC_COMPARE_SUMMARY_READY]",
  ]);
});

test("generates executive comparison summary with recommendation", () => {
  const summary = buildExecutiveCompareSummary({ comparison: comparison() });

  assert.equal(summary.comparisonId, "compare:exec");
  assert.equal(summary.scenarioAId, "scenario-a");
  assert.equal(summary.scenarioBId, "scenario-b");
  assert.equal(summary.advantages.length > 0, true);
  assert.equal(summary.disadvantages.length > 0, true);
  assert.equal(summary.keyTradeoffs.length > 0, true);
  assert.equal(summary.recommendedOption, "scenarioA");
  assert.match(summary.recommendationRationale, /Scenario A/);
  assert.equal(typeof summary.comparisonConfidence, "number");
  assert.equal(summary.objectDifferenceCount, 1);
  assert.equal(summary.relationshipDifferenceCount, 1);
  assert.equal(summary.kpiDifferenceCount, 1);
  assert.equal(summary.riskDifferenceCount, 1);
  assert.equal(summary.uiRendering, false);
  assert.equal(summary.mutation, false);
  assert.equal(summary.routingMutation, false);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(Object.isFrozen(summary.advantages), true);
  assert.throws(() => {
    (summary.keyTradeoffs as string[]).push("mutate");
  }, TypeError);
});

test("stores latest executive compare summary", () => {
  const summary = ExecutiveCompareSummary.buildExecutiveCompareSummary({ comparison: comparison() });

  assert.equal(getExecutiveCompareSummary(), summary);
  assert.equal(ExecutiveCompareSummary.getExecutiveCompareSummary().objectMutation, false);
});
