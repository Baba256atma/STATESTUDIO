import test from "node:test";
import assert from "node:assert/strict";

import { buildScenarioDraft } from "./scenarioAuthoringContract.ts";
import {
  getScenarioPairSelectorResult,
  resetScenarioPairSelectorForTests,
  ScenarioPairSelector,
  selectScenarioPair,
} from "./ScenarioPairSelector.ts";
import {
  C1_PAIR_SELECTOR_COMPLETE_TAG,
  SCENARIO_PAIR_SELECTOR_DIAGNOSTIC,
  SCENARIO_PAIR_SELECTOR_READY_DIAGNOSTIC,
} from "./scenarioPairSelectorContract.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  type ExecutiveSimulationSummary,
} from "./simulationResultAggregatorContract.ts";

function draft(id: string, baseline = false) {
  return buildScenarioDraft({
    draftId: id,
    name: baseline ? "Baseline" : id,
    scenarioType: baseline ? "baseline" : "risk",
    summary: `${id} summary`,
    description: `${id} description`,
    assumptions: ["Baseline reference preserved."],
    focusObjectIds: baseline ? [] : ["supplier-1"],
  });
}

function simulation(id: string): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    request: Object.freeze({
      draftId: id,
      dryRun: true,
      sceneMutation: false,
      dsMutation: false,
      routingMutation: false,
    }),
    overallScenarioImpact: 62,
    confidence: 78,
    keyPositiveEffects: Object.freeze(["KPI movement improves."]),
    keyNegativeEffects: Object.freeze(["Risk pressure remains."]),
  });
}

test.beforeEach(() => {
  resetScenarioPairSelectorForTests();
});

test("exports C1 pair selector tag and diagnostics", () => {
  assert.equal(C1_PAIR_SELECTOR_COMPLETE_TAG, "[C1_PAIR_SELECTOR_COMPLETE]");
  assert.equal(SCENARIO_PAIR_SELECTOR_DIAGNOSTIC, "[SCENARIO_PAIR_SELECTOR]");
  assert.equal(SCENARIO_PAIR_SELECTOR_READY_DIAGNOSTIC, "[SCENARIO_PAIR_SELECTOR_READY]");
  assert.deepEqual(ScenarioPairSelector.diagnostics, [
    "[SCENARIO_PAIR_SELECTOR]",
    "[SCENARIO_PAIR_SELECTOR_READY]",
  ]);
});

test("accepts Draft A vs Draft B without executing simulation", () => {
  const result = selectScenarioPair({
    comparisonId: "pair:draft",
    mode: "draft_vs_draft",
    scenarioA: { kind: "draft", draft: draft("draft-a") },
    scenarioB: { kind: "draft", draft: draft("draft-b") },
  });

  assert.equal(result.accepted, true);
  assert.equal(result.simulationExecution, false);
  assert.equal(result.comparisonRequest?.mode, "scenario_vs_scenario");
  assert.deepEqual(result.comparisonRequest?.scenarioA.scenarioId, "draft-a");
  assert.equal(result.readOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.comparisonRequest), true);
});

test("accepts Simulation A vs Simulation B", () => {
  const result = ScenarioPairSelector.selectScenarioPair({
    comparisonId: "pair:simulation",
    mode: "simulation_vs_simulation",
    scenarioA: { kind: "simulation", simulation: simulation("simulation-a") },
    scenarioB: { kind: "simulation", simulation: simulation("simulation-b") },
  });

  assert.equal(result.accepted, true);
  assert.equal(result.comparisonRequest?.mode, "scenario_vs_scenario");
  assert.equal(result.comparisonRequest?.scenarioB.scenarioId, "simulation-b");
});

test("accepts Baseline vs Simulation", () => {
  const result = selectScenarioPair({
    comparisonId: "pair:baseline",
    mode: "baseline_vs_simulation",
    scenarioA: { kind: "draft", draft: draft("baseline", true), baseline: true },
    scenarioB: { kind: "simulation", simulation: simulation("simulation-a") },
  });

  assert.equal(result.accepted, true);
  assert.equal(result.comparisonRequest?.mode, "scenario_vs_baseline");
  assert.equal(result.comparisonRequest?.scenarioA.baseline, true);
  assert.equal(result.comparisonRequest?.scenarioB.baseline, false);
});

test("rejects invalid comparisons", () => {
  const invalidDraft = buildScenarioDraft({
    draftId: "invalid",
    name: "",
    scenarioType: "risk",
    summary: "",
  });
  const invalid = selectScenarioPair({
    comparisonId: "pair:invalid",
    mode: "draft_vs_draft",
    scenarioA: { kind: "draft", draft: invalidDraft },
    scenarioB: { kind: "draft", draft: draft("draft-b") },
  });
  assert.equal(invalid.accepted, false);
  assert.equal(invalid.comparisonRequest, null);

  const duplicate = selectScenarioPair({
    comparisonId: "pair:duplicate",
    mode: "simulation_vs_simulation",
    scenarioA: { kind: "simulation", simulation: simulation("same") },
    scenarioB: { kind: "simulation", simulation: simulation("same") },
  });
  assert.equal(duplicate.accepted, false);

  const archived = selectScenarioPair({
    comparisonId: "pair:archived",
    mode: "draft_vs_draft",
    scenarioA: { kind: "draft", draft: Object.freeze({ ...draft("archived"), registryStatus: "archived" }) as ReturnType<typeof draft> },
    scenarioB: { kind: "draft", draft: draft("draft-b") },
  });
  assert.equal(archived.accepted, false);
});

test("stores latest selector result", () => {
  const result = ScenarioPairSelector.selectScenarioPair({
    comparisonId: "pair:latest",
    mode: "draft_vs_draft",
    scenarioA: { kind: "draft", draft: draft("draft-a") },
    scenarioB: { kind: "draft", draft: draft("draft-b") },
  });

  assert.equal(getScenarioPairSelectorResult(), result);
  assert.equal(ScenarioPairSelector.getScenarioPairSelectorResult().simulationExecution, false);
});
