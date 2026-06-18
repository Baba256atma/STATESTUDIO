import test from "node:test";
import assert from "node:assert/strict";

import {
  SCENARIO_AUTHORING_CONTRACT,
  S1_AUTHORING_CONTRACT_COMPLETE_TAG,
  SCENARIO_AUTHORING_CONTRACT_DIAGNOSTIC,
  SCENARIO_AUTHORING_READY_DIAGNOSTIC,
  buildScenarioDraft,
  freezeScenarioDraftChange,
} from "./scenarioAuthoringContract.ts";

test("exports S1 authoring contract completion tag", () => {
  assert.equal(S1_AUTHORING_CONTRACT_COMPLETE_TAG, "[S1_AUTHORING_CONTRACT_COMPLETE]");
  assert.equal(SCENARIO_AUTHORING_CONTRACT_DIAGNOSTIC, "[SCENARIO_AUTHORING_CONTRACT]");
  assert.equal(SCENARIO_AUTHORING_READY_DIAGNOSTIC, "[SCENARIO_AUTHORING_READY]");
});

test("scenario authoring contract supports baseline alternative risk and opportunity types", () => {
  assert.deepEqual(SCENARIO_AUTHORING_CONTRACT.supportedScenarioTypes, [
    "baseline",
    "alternative",
    "risk",
    "opportunity",
  ]);
  assert.equal(SCENARIO_AUTHORING_CONTRACT.simulationActive, false);
  assert.equal(SCENARIO_AUTHORING_CONTRACT.sceneMutation, false);
  assert.equal(SCENARIO_AUTHORING_CONTRACT.routingMutation, false);
  assert.equal(SCENARIO_AUTHORING_CONTRACT.topologyMutation, false);
});

test("buildScenarioDraft returns immutable draft structures", () => {
  const draft = buildScenarioDraft({
    name: "Supplier Delay Risk",
    scenarioType: "risk",
    summary: "Model supplier delay impact on production schedule.",
    focusObjectIds: ["supplier-1"],
    assumptions: ["Primary supplier remains unavailable for 14 days."],
  });

  assert.equal(Object.isFrozen(draft), true);
  assert.equal(Object.isFrozen(draft.metadata), true);
  assert.equal(Object.isFrozen(draft.assumptions), true);
  assert.equal(Object.isFrozen(draft.focusObjectIds), true);
  assert.equal(Object.isFrozen(draft.changes), true);
  assert.equal(draft.readOnlyIntelligence, true);
  assert.equal(draft.simulationActive, false);
  assert.equal(draft.validationState, "valid");
});

test("freezeScenarioDraftChange returns immutable change records", () => {
  const change = freezeScenarioDraftChange({
    field: "summary",
    priorValue: null,
    nextValue: "Updated summary",
    changeReason: "Assistant suggested clearer executive summary.",
  });

  assert.equal(Object.isFrozen(change), true);
  assert.ok(change.changeId.length > 0);
  assert.ok(change.recordedAt.length > 0);
});
