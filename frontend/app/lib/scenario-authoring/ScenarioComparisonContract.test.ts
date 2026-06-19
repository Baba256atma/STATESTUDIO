import test from "node:test";
import assert from "node:assert/strict";

import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
  C1_COMPARE_CONTRACT_COMPLETE_TAG,
  COMPARE_CONTRACT_DIAGNOSTIC,
  COMPARE_CONTRACT_READY_DIAGNOSTIC,
  SCENARIO_COMPARISON_CONTRACT,
  type ScenarioComparisonSubject,
} from "./ScenarioComparisonContract.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  type ExecutiveSimulationSummary,
} from "./simulationResultAggregatorContract.ts";

function summary(overrides: Partial<ExecutiveSimulationSummary> = {}): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    ...overrides,
    keyPositiveEffects: Object.freeze([...(overrides.keyPositiveEffects ?? [])]),
    keyNegativeEffects: Object.freeze([...(overrides.keyNegativeEffects ?? [])]),
    riskMovement: Object.freeze(overrides.riskMovement ?? EMPTY_EXECUTIVE_SIMULATION_SUMMARY.riskMovement),
    kpiMovement: Object.freeze(overrides.kpiMovement ?? EMPTY_EXECUTIVE_SIMULATION_SUMMARY.kpiMovement),
  });
}

function subject(scenarioId: string, baseline = false): ScenarioComparisonSubject {
  return Object.freeze({
    scenarioId,
    label: baseline ? "Baseline" : scenarioId,
    summary: summary({
      overallScenarioImpact: baseline ? 50 : 64,
      confidence: baseline ? 80 : 76,
    }),
    baseline,
  });
}

test("exports C1 compare contract tag and diagnostics", () => {
  assert.equal(C1_COMPARE_CONTRACT_COMPLETE_TAG, "[C1_COMPARE_CONTRACT_COMPLETE]");
  assert.equal(COMPARE_CONTRACT_DIAGNOSTIC, "[COMPARE_CONTRACT]");
  assert.equal(COMPARE_CONTRACT_READY_DIAGNOSTIC, "[COMPARE_CONTRACT_READY]");
  assert.equal(SCENARIO_COMPARISON_CONTRACT.supportsScenarioVsScenario, true);
  assert.equal(SCENARIO_COMPARISON_CONTRACT.supportsScenarioVsBaseline, true);
  assert.equal(SCENARIO_COMPARISON_CONTRACT.readOnly, true);
  assert.equal(SCENARIO_COMPARISON_CONTRACT.mutation, false);
});

test("builds immutable Scenario A vs Scenario B comparison contracts", () => {
  const request = buildScenarioComparisonRequest({
    comparisonId: "compare:a-b",
    mode: "scenario_vs_scenario",
    scenarioA: subject("scenario-a"),
    scenarioB: subject("scenario-b"),
  });
  const difference = buildScenarioDifferenceProfile({
    differenceId: "diff:a-b",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 12,
    riskMovementDelta: -4,
    kpiMovementDelta: 8,
    confidenceDelta: -2,
    objectCountDelta: 0,
    relationshipCountDelta: 1,
    kpiCountDelta: 0,
    riskCountDelta: 1,
    advantage: "scenarioA",
    summary: "Scenario A has stronger overall impact.",
  });
  const result = buildScenarioComparisonResult({
    request,
    differences: [difference],
    primaryDifference: difference,
  });

  assert.equal(result.request.mode, "scenario_vs_scenario");
  assert.deepEqual(result.comparedScenarioIds, ["scenario-a", "scenario-b"]);
  assert.equal(result.readOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.objectMutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.request), true);
  assert.equal(Object.isFrozen(result.differences), true);
  assert.equal(Object.isFrozen(result.differences[0]), true);
  assert.throws(() => {
    (result.differences as unknown as object[]).push({});
  }, TypeError);
});

test("supports Scenario vs Baseline without mutation authority", () => {
  const result = buildScenarioComparisonResult({
    request: buildScenarioComparisonRequest({
      comparisonId: "compare:baseline",
      mode: "scenario_vs_baseline",
      scenarioA: subject("scenario-a"),
      scenarioB: subject("baseline", true),
    }),
    differences: [
      buildScenarioDifferenceProfile({
        differenceId: "diff:baseline",
        scenarioAId: "scenario-a",
        scenarioBId: "baseline",
        overallImpactDelta: 14,
        riskMovementDelta: -6,
        kpiMovementDelta: 3,
        confidenceDelta: -4,
        objectCountDelta: 0,
        relationshipCountDelta: 0,
        kpiCountDelta: 0,
        riskCountDelta: 0,
        advantage: "scenarioA",
        summary: "Scenario A improves impact versus baseline.",
      }),
    ],
    primaryDifference: null,
  });

  assert.equal(result.request.mode, "scenario_vs_baseline");
  assert.equal(result.request.scenarioB.baseline, true);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.topologyMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.objectMutation, false);
});
