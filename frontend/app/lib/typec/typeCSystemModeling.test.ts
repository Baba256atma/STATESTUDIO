import assert from "node:assert/strict";
import test from "node:test";

import type { SceneJson } from "../sceneTypes.ts";
import { TYPE_C_CORE_OBJECT_ID, ensureTypeCCoreObject } from "./typeCSceneBootstrap.ts";
import { addTypeCObjectToScene } from "./typeCObjectActions.ts";
import { addTypeCSystemModelToScene } from "./typeCSystemModeling.ts";

const SUPPLY_CHAIN = ["Supplier", "Inventory", "Delivery"];

function coreScene(): SceneJson {
  return ensureTypeCCoreObject({
    state_vector: {},
    scene: { objects: [], loops: [] },
  }, "type_c") as SceneJson;
}

function edges(scene: SceneJson) {
  return scene.scene.loops?.flatMap((loop) => loop.edges ?? []) ?? [];
}

function edgeCount(scene: SceneJson, from: string, to: string): number {
  return edges(scene).filter((edge) => edge.from === from && edge.to === to).length;
}

test("addTypeCSystemModelToScene adds all labels", () => {
  const next = addTypeCSystemModelToScene(coreScene(), SUPPLY_CHAIN);
  const ids = new Set(next.scene.objects?.map((object) => object.id));
  assert.equal(ids.has("typec_supplier"), true);
  assert.equal(ids.has("typec_inventory"), true);
  assert.equal(ids.has("typec_delivery"), true);
});

test("addTypeCSystemModelToScene connects core to all labels", () => {
  const next = addTypeCSystemModelToScene(coreScene(), SUPPLY_CHAIN);
  assert.equal(edgeCount(next, TYPE_C_CORE_OBJECT_ID, "typec_supplier"), 1);
  assert.equal(edgeCount(next, TYPE_C_CORE_OBJECT_ID, "typec_inventory"), 1);
  assert.equal(edgeCount(next, TYPE_C_CORE_OBJECT_ID, "typec_delivery"), 1);
});

test("addTypeCSystemModelToScene connects Supplier to Inventory to Delivery", () => {
  const next = addTypeCSystemModelToScene(coreScene(), SUPPLY_CHAIN);
  assert.equal(edgeCount(next, "typec_supplier", "typec_inventory"), 1);
  assert.equal(edgeCount(next, "typec_inventory", "typec_delivery"), 1);
});

test("addTypeCSystemModelToScene does not duplicate existing objects", () => {
  const once = addTypeCSystemModelToScene(coreScene(), SUPPLY_CHAIN);
  const twice = addTypeCSystemModelToScene(once, SUPPLY_CHAIN);
  assert.equal(twice.scene.objects?.filter((object) => object.id === "typec_supplier").length, 1);
  assert.equal(twice.scene.objects?.filter((object) => object.id === "typec_inventory").length, 1);
  assert.equal(twice.scene.objects?.filter((object) => object.id === "typec_delivery").length, 1);
});

test("addTypeCSystemModelToScene does not duplicate existing chain edges", () => {
  const once = addTypeCSystemModelToScene(coreScene(), SUPPLY_CHAIN);
  const twice = addTypeCSystemModelToScene(once, SUPPLY_CHAIN);
  assert.equal(edgeCount(twice, "typec_supplier", "typec_inventory"), 1);
  assert.equal(edgeCount(twice, "typec_inventory", "typec_delivery"), 1);
});

test("addTypeCSystemModelToScene handles partial existing scene", () => {
  const partial = addTypeCObjectToScene(coreScene(), { label: "Supplier" });
  const next = addTypeCSystemModelToScene(partial, SUPPLY_CHAIN);
  assert.equal(next.scene.objects?.filter((object) => object.id === "typec_supplier").length, 1);
  assert.equal(next.scene.objects?.some((object) => object.id === "typec_inventory"), true);
  assert.equal(next.scene.objects?.some((object) => object.id === "typec_delivery"), true);
  assert.equal(edgeCount(next, "typec_supplier", "typec_inventory"), 1);
  assert.equal(edgeCount(next, "typec_inventory", "typec_delivery"), 1);
});

test("addTypeCSystemModelToScene ignores empty labels", () => {
  const next = addTypeCSystemModelToScene(coreScene(), ["", "Supplier", " ", "Inventory"]);
  assert.equal(next.scene.objects?.some((object) => object.id === "typec_supplier"), true);
  assert.equal(next.scene.objects?.some((object) => object.id === "typec_inventory"), true);
  assert.equal(next.scene.objects?.some((object) => object.id === "typec_delivery"), false);
  assert.equal(edgeCount(next, "typec_supplier", "typec_inventory"), 1);
});
