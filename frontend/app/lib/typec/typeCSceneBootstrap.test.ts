import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../sceneTypes.ts";
import {
  TYPE_C_CORE_OBJECT_ID,
  ensureTypeCCoreObject,
  hasTypeCCoreObject,
} from "./typeCSceneBootstrap.ts";

function emptyScene(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [],
      loops: [],
    },
  };
}

test("ensureTypeCCoreObject adds core only to empty Type-C scene", () => {
  const next = ensureTypeCCoreObject(emptyScene(), "type_c");
  assert.equal(next?.scene.objects?.length, 1);
  assert.equal(next?.scene.objects?.[0]?.id, TYPE_C_CORE_OBJECT_ID);
  assert.equal(hasTypeCCoreObject(next), true);
});

test("ensureTypeCCoreObject does not duplicate existing core", () => {
  const once = ensureTypeCCoreObject(emptyScene(), "type_c");
  const twice = ensureTypeCCoreObject(once, "type_c");
  assert.equal(twice?.scene.objects?.filter((object) => object.id === TYPE_C_CORE_OBJECT_ID).length, 1);
});

test("ensureTypeCCoreObject preserves existing non-empty scenes", () => {
  const scene: SceneJson = {
    state_vector: {},
    scene: {
      objects: [{ id: "existing", label: "Existing", type: "box" }],
      loops: [],
    },
  };
  const next = ensureTypeCCoreObject(scene, "type_c");
  assert.equal(next, scene);
  assert.equal(next?.scene.objects?.length, 1);
  assert.equal(hasTypeCCoreObject(next), false);
});

test("ensureTypeCCoreObject does nothing outside Type-C mode", () => {
  const scene = emptyScene();
  const next = ensureTypeCCoreObject(scene, "default");
  assert.equal(next, scene);
  assert.equal(next?.scene.objects?.length, 0);
});
