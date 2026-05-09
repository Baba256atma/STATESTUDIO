import assert from "node:assert/strict";
import test from "node:test";

import type { SceneJson } from "../sceneTypes.ts";
import { TYPE_C_CORE_OBJECT_ID, ensureTypeCCoreObject } from "./typeCSceneBootstrap.ts";
import { addTypeCSystemModelToScene } from "./typeCSystemModeling.ts";
import {
  addScenarioToState,
  buildTypeCScenarioFromScene,
  getReadyTypeCScenarios,
  getSelectedTypeCScenario,
  ignoreTypeCScenario,
  markScenarioReadyForDecision,
  selectTypeCScenario,
} from "./typeCScenarioBuilder.ts";
import type { TypeCScenarioState } from "./typeCScenarioTypes.ts";

function coreScene(): SceneJson {
  return ensureTypeCCoreObject({
    state_vector: {},
    scene: { objects: [], loops: [] },
  }, "type_c") as SceneJson;
}

function supplyChainScene(): SceneJson {
  return addTypeCSystemModelToScene(coreScene(), ["Supplier", "Inventory", "Delivery"]);
}

function salesScene(): SceneJson {
  return addTypeCSystemModelToScene(coreScene(), ["Customer", "Demand", "Sales"]);
}

test("buildTypeCScenarioFromScene returns null if graph has fewer than 2 non-core objects", () => {
  const oneObjectScene = addTypeCSystemModelToScene(coreScene(), ["Supplier"]);
  assert.equal(buildTypeCScenarioFromScene(oneObjectScene), null);
});

test("buildTypeCScenarioFromScene builds scenario from Supplier to Inventory to Delivery", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  assert.equal(scenario.title, "Scenario: Supplier → Inventory → Delivery");
  assert.equal(scenario.summary, "Scenario based on Supplier → Inventory → Delivery");
});

test("buildTypeCScenarioFromScene excludes nexora_core from objectIds", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  assert.equal(scenario.objectIds.includes(TYPE_C_CORE_OBJECT_ID), false);
});

test("buildTypeCScenarioFromScene creates deterministic id", () => {
  const first = buildTypeCScenarioFromScene(supplyChainScene());
  const second = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(first);
  assert.ok(second);
  assert.equal(first.id, second.id);
});

test("addScenarioToState does not duplicate scenario", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const initial: TypeCScenarioState = { scenarios: [], selectedScenarioId: null };
  const once = addScenarioToState(initial, scenario);
  const twice = addScenarioToState(once, scenario);
  assert.equal(twice.scenarios.length, 1);
});

test("selectTypeCScenario selects scenario", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const state = addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario);
  const selected = selectTypeCScenario(state, scenario.id);
  assert.equal(selected.selectedScenarioId, scenario.id);
  assert.equal(selected.scenarios[0].status, "selected");
});

test("ignoreTypeCScenario ignores scenario", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const state = selectTypeCScenario(addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario), scenario.id);
  const ignored = ignoreTypeCScenario(state, scenario.id);
  assert.equal(ignored.selectedScenarioId, null);
  assert.equal(ignored.scenarios[0].status, "ignored");
});

test("scenario state helpers do not mutate original state", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const initial: TypeCScenarioState = { scenarios: [], selectedScenarioId: null };
  const added = addScenarioToState(initial, scenario);
  const selected = selectTypeCScenario(added, scenario.id);
  assert.equal(initial.scenarios.length, 0);
  assert.equal(added.selectedScenarioId, null);
  assert.equal(added.scenarios[0].status, "draft");
  assert.equal(selected.scenarios[0].status, "selected");
});

test("selectTypeCScenario marks scenario selected", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const state = addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario);
  const selected = selectTypeCScenario(state, scenario.id);
  assert.equal(selected.scenarios[0].status, "selected");
});

test("selectTypeCScenario returns previous selected scenario to draft", () => {
  const first = buildTypeCScenarioFromScene(supplyChainScene());
  const second = buildTypeCScenarioFromScene(salesScene());
  assert.ok(first);
  assert.ok(second);
  const state = addScenarioToState(addScenarioToState({ scenarios: [], selectedScenarioId: null }, first), second);
  const firstSelected = selectTypeCScenario(state, first.id);
  const secondSelected = selectTypeCScenario(firstSelected, second.id);
  assert.equal(secondSelected.scenarios.find((scenario) => scenario.id === first.id)?.status, "draft");
  assert.equal(secondSelected.scenarios.find((scenario) => scenario.id === second.id)?.status, "selected");
});

test("ignoreTypeCScenario marks scenario ignored", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const state = addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario);
  const ignored = ignoreTypeCScenario(state, scenario.id);
  assert.equal(ignored.scenarios[0].status, "ignored");
});

test("markScenarioReadyForDecision marks selected scenario ready", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const selected = selectTypeCScenario(addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario), scenario.id);
  const ready = markScenarioReadyForDecision(selected, scenario.id);
  assert.equal(ready.selectedScenarioId, scenario.id);
  assert.equal(ready.scenarios[0].status, "ready_for_decision");
});

test("markScenarioReadyForDecision does not mark ignored scenario ready", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const ignored = ignoreTypeCScenario(addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario), scenario.id);
  const ready = markScenarioReadyForDecision(ignored, scenario.id);
  assert.equal(ready, ignored);
  assert.equal(ready.scenarios[0].status, "ignored");
});

test("missing scenario id returns original state", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const state = addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario);
  assert.equal(selectTypeCScenario(state, "missing"), state);
  assert.equal(ignoreTypeCScenario(state, "missing"), state);
  assert.equal(markScenarioReadyForDecision(state, "missing"), state);
});

test("getSelectedTypeCScenario returns selected scenario", () => {
  const scenario = buildTypeCScenarioFromScene(supplyChainScene());
  assert.ok(scenario);
  const selected = selectTypeCScenario(addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario), scenario.id);
  assert.equal(getSelectedTypeCScenario(selected)?.id, scenario.id);
});

test("getReadyTypeCScenarios returns ready scenarios", () => {
  const first = buildTypeCScenarioFromScene(supplyChainScene());
  const second = buildTypeCScenarioFromScene(salesScene());
  assert.ok(first);
  assert.ok(second);
  const state = addScenarioToState(addScenarioToState({ scenarios: [], selectedScenarioId: null }, first), second);
  const ready = markScenarioReadyForDecision(state, second.id);
  assert.deepEqual(getReadyTypeCScenarios(ready).map((scenario) => scenario.id), [second.id]);
});
