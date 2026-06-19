import test from "node:test";
import assert from "node:assert/strict";

import { buildScenarioDraft, freezeScenarioDraftChange } from "./scenarioAuthoringContract.ts";
import {
  createScenarioDraftRegistryEntry,
  getScenarioDraftRegistrySnapshot,
  resetScenarioDraftRegistryForTests,
} from "./ScenarioDraftRegistry.ts";
import {
  getScenarioSimulationResult,
  resetScenarioSimulationRuntimeForTests,
  runScenarioSimulation,
  ScenarioSimulationRuntime,
} from "./ScenarioSimulationRuntime.ts";
import {
  SCENARIO_SIMULATION_READY_DIAGNOSTIC,
  SCENARIO_SIMULATION_RUNTIME_DIAGNOSTIC,
  S2_RUNTIME_COMPLETE_TAG,
} from "./scenarioSimulationRuntimeContract.ts";

function buildSavedDraft() {
  const draft = buildScenarioDraft({
    draftId: "scenario-draft:s2-runtime",
    name: "Supplier Continuity Scenario",
    scenarioType: "risk",
    summary: "Simulate supplier continuity pressure.",
    description: "Read-only S2 runtime fixture.",
    assumptions: ["Baseline preserved.", "Supplier recovery takes two weeks."],
    focusObjectIds: ["supplier-1", "plant-1"],
  });

  return Object.freeze({
    ...draft,
    changes: Object.freeze([
      freezeScenarioDraftChange({
        changeId: "change:supplier-delay",
        field: "risk.probability",
        priorValue: "medium",
        nextValue: "high",
        changeReason: "Stress supplier continuity assumptions.",
        recordedAt: draft.metadata.createdAt,
      }),
    ]),
  });
}

test.beforeEach(() => {
  resetScenarioDraftRegistryForTests();
  resetScenarioSimulationRuntimeForTests();
});

test("exports S2 runtime completion tag and diagnostics", () => {
  assert.equal(S2_RUNTIME_COMPLETE_TAG, "[S2_RUNTIME_COMPLETE]");
  assert.equal(SCENARIO_SIMULATION_RUNTIME_DIAGNOSTIC, "[SCENARIO_SIMULATION_RUNTIME]");
  assert.equal(SCENARIO_SIMULATION_READY_DIAGNOSTIC, "[SCENARIO_SIMULATION_READY]");
  assert.deepEqual(ScenarioSimulationRuntime.diagnostics, [
    "[SCENARIO_SIMULATION_RUNTIME]",
    "[SCENARIO_SIMULATION_READY]",
  ]);
});

test("consumes saved S1 ScenarioDrafts and returns immutable simulation result", () => {
  const draft = buildSavedDraft();
  const originalDraft = JSON.stringify(draft);
  const created = createScenarioDraftRegistryEntry({ draft });
  assert.equal(created.success, true);

  const result = runScenarioSimulation({
    draftId: draft.draftId,
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });

  assert.equal(result.status, "ready");
  assert.equal(result.savedDraftConsumed, true);
  assert.equal(result.metadata?.draftId, draft.draftId);
  assert.equal(result.metadata?.savedDraftConsumed, true);
  assert.equal(result.metadata?.immutable, true);
  assert.equal(result.changeCount, 1);
  assert.equal(result.readinessScore, 85);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.topologyMutation, false);
  assert.equal(result.draftMutation, false);
  assert.equal(JSON.stringify(draft), originalDraft);
  assert.throws(() => {
    (result.focusObjectIds as string[]).push("mutate");
  }, TypeError);
});

test("does not mutate registry, scene, DS, or routing state", () => {
  const draft = buildSavedDraft();
  createScenarioDraftRegistryEntry({ draft });
  const beforeRegistry = getScenarioDraftRegistrySnapshot();

  runScenarioSimulation({
    draftId: draft.draftId,
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });

  const afterRegistry = getScenarioDraftRegistrySnapshot();
  assert.equal(beforeRegistry.draftCount, afterRegistry.draftCount);
  assert.equal(beforeRegistry.updatedAt, afterRegistry.updatedAt);
  assert.equal(afterRegistry.simulationResultsStored, false);
  assert.equal(afterRegistry.dsMutation, false);
  assert.equal(afterRegistry.intelligenceMutation, false);
});

test("blocks unknown drafts and mutation-authorized requests", () => {
  const missing = runScenarioSimulation({
    draftId: "scenario-draft:missing",
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });
  assert.equal(missing.status, "blocked");
  assert.equal(missing.savedDraftConsumed, false);

  const invalidRequest = runScenarioSimulation({
    draftId: "scenario-draft:any",
    sceneMutation: true as false,
    dsMutation: false,
    routingMutation: false,
  });
  assert.equal(invalidRequest.status, "blocked");
  assert.match(invalidRequest.validationMessages[0], /disable mutation authority/);
});

test("stores latest simulation result without registry writeback", () => {
  const draft = buildSavedDraft();
  createScenarioDraftRegistryEntry({ draft });

  const result = ScenarioSimulationRuntime.runScenarioSimulation({
    draftId: draft.draftId,
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });

  assert.equal(getScenarioSimulationResult(), result);
  assert.equal(ScenarioSimulationRuntime.getScenarioSimulationResult().metadata?.draftId, draft.draftId);
});
