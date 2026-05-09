import assert from "node:assert/strict";
import test from "node:test";

import type { SceneJson } from "../sceneTypes.ts";
import { ensureTypeCCoreObject } from "./typeCSceneBootstrap.ts";
import { addTypeCSystemModelToScene } from "./typeCSystemModeling.ts";
import {
  addScenarioToState,
  buildTypeCScenarioFromScene,
  markScenarioReadyForDecision,
  selectTypeCScenario,
} from "./typeCScenarioBuilder.ts";
import { buildTypeCDecisionReadinessSnapshot } from "./typeCDecisionReadiness.ts";
import type { TypeCScenarioState } from "./typeCScenarioTypes.ts";

function coreScene(): SceneJson {
  return ensureTypeCCoreObject({
    state_vector: {},
    scene: { objects: [], loops: [] },
  }, "type_c") as SceneJson;
}

function objectOnlyScene(): SceneJson {
  return {
    ...coreScene(),
    scene: {
      ...coreScene().scene,
      objects: [
        ...(coreScene().scene.objects ?? []),
        { id: "typec_supplier", label: "Supplier" },
        { id: "typec_inventory", label: "Inventory" },
      ],
      loops: [],
    },
  };
}

function supplyChainScene(): SceneJson {
  return addTypeCSystemModelToScene(coreScene(), ["Supplier", "Inventory", "Delivery"]);
}

function scenarioState(scene: SceneJson): TypeCScenarioState {
  const scenario = buildTypeCScenarioFromScene(scene);
  assert.ok(scenario);
  return addScenarioToState({ scenarios: [], selectedScenarioId: null }, scenario);
}

test("buildTypeCDecisionReadinessSnapshot returns not_ready with no scenario", () => {
  const snapshot = buildTypeCDecisionReadinessSnapshot({
    scene: supplyChainScene(),
    scenarioState: { scenarios: [], selectedScenarioId: null },
  });
  assert.equal(snapshot.level, "not_ready");
  assert.equal(snapshot.missing.includes("selected_scenario"), true);
});

test("buildTypeCDecisionReadinessSnapshot returns partial for selected draft scenario", () => {
  const scene = supplyChainScene();
  const state = scenarioState(scene);
  const selected = selectTypeCScenario(state, state.scenarios[0].id);
  const snapshot = buildTypeCDecisionReadinessSnapshot({ scene, scenarioState: selected });
  assert.equal(snapshot.level, "partial");
  assert.equal(snapshot.missing.includes("scenario_ready_status"), true);
});

test("buildTypeCDecisionReadinessSnapshot flags ready scenario without enough objects", () => {
  const scene = addTypeCSystemModelToScene(coreScene(), ["Supplier"]);
  const scenario = {
    id: "manual_ready",
    title: "Manual",
    status: "ready_for_decision" as const,
    source: "scene_graph" as const,
    objectIds: ["typec_supplier"],
    loopIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: "Manual",
  };
  const snapshot = buildTypeCDecisionReadinessSnapshot({
    scene,
    scenarioState: { scenarios: [scenario], selectedScenarioId: scenario.id },
  });
  assert.equal(snapshot.level, "partial");
  assert.equal(snapshot.missing.includes("minimum_objects"), true);
});

test("buildTypeCDecisionReadinessSnapshot flags ready scenario with objects but no loops", () => {
  const scene = objectOnlyScene();
  const state = scenarioState(scene);
  const ready = markScenarioReadyForDecision(selectTypeCScenario(state, state.scenarios[0].id), state.scenarios[0].id);
  const snapshot = buildTypeCDecisionReadinessSnapshot({ scene, scenarioState: ready });
  assert.equal(snapshot.level, "partial");
  assert.equal(snapshot.missing.includes("connections"), true);
});

test("buildTypeCDecisionReadinessSnapshot returns ready with ready scenario, objects, and loop", () => {
  const scene = supplyChainScene();
  const state = scenarioState(scene);
  const ready = markScenarioReadyForDecision(selectTypeCScenario(state, state.scenarios[0].id), state.scenarios[0].id);
  const snapshot = buildTypeCDecisionReadinessSnapshot({ scene, scenarioState: ready });
  assert.equal(snapshot.level, "ready");
  assert.deepEqual(snapshot.missing, []);
});

test("buildTypeCDecisionReadinessSnapshot prefers selected scenario over other ready scenario", () => {
  const scene = supplyChainScene();
  const first = buildTypeCScenarioFromScene(scene);
  const second = first ? { ...first, id: "other_ready", status: "ready_for_decision" as const } : null;
  assert.ok(first);
  assert.ok(second);
  const state = {
    scenarios: [{ ...first, status: "selected" as const }, second],
    selectedScenarioId: first.id,
  };
  const snapshot = buildTypeCDecisionReadinessSnapshot({ scene, scenarioState: state });
  assert.equal(snapshot.scenarioId, first.id);
  assert.equal(snapshot.level, "partial");
});

test("buildTypeCDecisionReadinessSnapshot handles null scene safely", () => {
  const snapshot = buildTypeCDecisionReadinessSnapshot({
    scene: null,
    scenarioState: { scenarios: [], selectedScenarioId: null },
  });
  assert.equal(snapshot.level, "not_ready");
  assert.equal(snapshot.objectCount, 0);
});

test("buildTypeCDecisionReadinessSnapshot does not mutate input", () => {
  const scene = supplyChainScene();
  const state = scenarioState(scene);
  const beforeObjects = scene.scene.objects;
  const beforeScenarios = state.scenarios;
  buildTypeCDecisionReadinessSnapshot({ scene, scenarioState: state });
  assert.equal(scene.scene.objects, beforeObjects);
  assert.equal(state.scenarios, beforeScenarios);
});
