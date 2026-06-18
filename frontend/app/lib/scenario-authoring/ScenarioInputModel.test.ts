import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioInputModelRuntime,
  buildScenarioInputModel,
  deserializeScenarioInputModel,
  resetScenarioInputModelForTests,
  serializeScenarioInputModel,
} from "./ScenarioInputModel.ts";
import {
  SCENARIO_INPUT_MODEL_DIAGNOSTIC,
  SCENARIO_INPUT_MODEL_READY_DIAGNOSTIC,
  S1_INPUT_MODEL_COMPLETE_TAG,
} from "./scenarioInputModelContract.ts";

test.beforeEach(() => {
  resetScenarioInputModelForTests();
});

test("exports S1 input model completion tag", () => {
  assert.equal(S1_INPUT_MODEL_COMPLETE_TAG, "[S1_INPUT_MODEL_COMPLETE]");
  assert.equal(SCENARIO_INPUT_MODEL_DIAGNOSTIC, "[SCENARIO_INPUT_MODEL]");
  assert.equal(SCENARIO_INPUT_MODEL_READY_DIAGNOSTIC, "[SCENARIO_INPUT_MODEL_READY]");
});

test("builds immutable scenario input model with proposed changes only", () => {
  const model = buildScenarioInputModel({
    draftId: "scenario-draft:abc123",
    objectChanges: [
      {
        targetId: "supplier-1",
        label: "Primary Supplier",
        field: "active",
        proposedValue: "false",
        rationale: "Model supplier outage.",
      },
    ],
    relationshipChanges: [
      {
        targetId: "rel-supply",
        field: "dependency",
        proposedValue: "95",
        rationale: "Increase dependency exposure.",
      },
    ],
    kpiChanges: [
      {
        targetId: "schedule",
        field: "value",
        proposedValue: "38",
        rationale: "Project schedule slip.",
      },
    ],
    riskChanges: [
      {
        targetId: "delay-risk",
        field: "severity",
        proposedValue: "85",
        rationale: "Escalate delay risk.",
      },
    ],
  });

  assert.equal(model.draftOnly, true);
  assert.equal(model.executionActive, false);
  assert.equal(model.simulationActive, false);
  assert.equal(model.dsMutation, false);
  assert.equal(model.sceneMutation, false);
  assert.equal(model.changeCount, 4);
  assert.equal(model.objectChanges.length, 1);
  assert.equal(model.relationshipChanges.length, 1);
  assert.equal(model.kpiChanges.length, 1);
  assert.equal(model.riskChanges.length, 1);
  assert.equal(Object.isFrozen(model), true);
  assert.equal(Object.isFrozen(model.proposedChanges), true);
  assert.equal(model.diagnostics.includes(SCENARIO_INPUT_MODEL_DIAGNOSTIC), true);
  assert.equal(model.diagnostics.includes(SCENARIO_INPUT_MODEL_READY_DIAGNOSTIC), true);
});

test("serializes and deserializes scenario input model correctly", () => {
  const model = buildScenarioInputModel({
    draftId: "scenario-draft:serialize",
    objectChanges: [
      {
        targetId: "inventory-1",
        field: "activityLevel",
        proposedValue: "40",
      },
    ],
    riskChanges: [
      {
        targetId: "delay-risk",
        field: "severity",
        proposedValue: "70",
      },
    ],
  });

  const serialized = serializeScenarioInputModel(model);
  const restored = deserializeScenarioInputModel(serialized);

  assert.equal(restored.draftId, model.draftId);
  assert.equal(restored.changeCount, model.changeCount);
  assert.equal(restored.objectChanges[0]?.targetId, "inventory-1");
  assert.equal(restored.riskChanges[0]?.proposedValue, "70");
  assert.equal(restored.draftOnly, true);
  assert.equal(restored.executionActive, false);
  assert.equal(restored.simulationActive, false);
  assert.equal(Object.isFrozen(restored), true);
});

test("scenario input model runtime does not mutate source change payloads", () => {
  const objectChange = {
    targetId: "supplier-1",
    field: "active",
    proposedValue: "false",
  };
  const before = JSON.stringify(objectChange);

  ScenarioInputModelRuntime.buildScenarioInputModel({
    draftId: "scenario-draft:immutable",
    objectChanges: [objectChange],
  });

  assert.equal(JSON.stringify(objectChange), before);
});
