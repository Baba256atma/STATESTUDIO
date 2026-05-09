import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../sceneTypes.ts";
import { TYPE_C_CORE_OBJECT_ID, ensureTypeCCoreObject } from "./typeCSceneBootstrap.ts";
import { addTypeCObjectToScene, buildTypeCObject } from "./typeCObjectActions.ts";

function coreScene(): SceneJson {
  return ensureTypeCCoreObject({
    state_vector: {},
    scene: { objects: [], loops: [] },
  }, "type_c") as SceneJson;
}

test("buildTypeCObject creates stable sanitized id", () => {
  assert.equal(buildTypeCObject({ label: "Supplier Network!" }).id, "typec_supplier_network");
});

test("addTypeCObjectToScene adds object", () => {
  const next = addTypeCObjectToScene(coreScene(), { label: "Supplier" });
  assert.equal(next.scene.objects?.some((object) => object.id === "typec_supplier"), true);
});

test("addTypeCObjectToScene connects object to core", () => {
  const next = addTypeCObjectToScene(coreScene(), { label: "Supplier" });
  const edges = next.scene.loops?.flatMap((loop) => loop.edges) ?? [];
  assert.equal(edges.some((edge) => edge.from === TYPE_C_CORE_OBJECT_ID && edge.to === "typec_supplier"), true);
});

test("duplicate label does not duplicate object", () => {
  const once = addTypeCObjectToScene(coreScene(), { label: "Supplier" });
  const twice = addTypeCObjectToScene(once, { label: " supplier " });
  assert.equal(twice.scene.objects?.filter((object) => object.id === "typec_supplier").length, 1);
});

test("duplicate label does not duplicate edge", () => {
  const once = addTypeCObjectToScene(coreScene(), { label: "Supplier" });
  const twice = addTypeCObjectToScene(once, { label: "Supplier" });
  const edges = twice.scene.loops?.flatMap((loop) => loop.edges) ?? [];
  assert.equal(edges.filter((edge) => edge.from === TYPE_C_CORE_OBJECT_ID && edge.to === "typec_supplier").length, 1);
});

test("addTypeCObjectToScene keeps existing scenes intact when adding", () => {
  const scene = coreScene();
  const originalObjects = scene.scene.objects;
  const next = addTypeCObjectToScene(scene, { label: "Inventory", role: "supply" });
  assert.notEqual(next, scene);
  assert.equal(scene.scene.objects, originalObjects);
  assert.equal(scene.scene.objects?.length, 1);
  assert.equal(next.scene.objects?.length, 2);
});
