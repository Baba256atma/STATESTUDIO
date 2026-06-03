import test from "node:test";
import assert from "node:assert/strict";

import type { SceneObject } from "../../sceneTypes.ts";
import { bindTopologyToSceneObjects } from "./topology/topologySceneBinding.ts";
import { buildTopologyRuntimeLayoutPositions } from "./topology/topologyScenePositioning.ts";
import { resetRuntimeObjectPositionDevLogsForTests } from "./runtimeObjectPositionDevLog.ts";
import { resolveRuntimeObjectPosition } from "./runtimeObjectPosition.ts";

test.beforeEach(() => {
  resetRuntimeObjectPositionDevLogsForTests();
});

test("resolveRuntimeObjectPosition prefers topology runtime layout positions", () => {
  const objects: SceneObject[] = [
    { id: "buf-1", name: "Capacity Buffer", label: "Capacity Buffer", position: [0, 0, 0] },
    { id: "sat-a", label: "Sat A", position: [9, 0, 9] },
  ];
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "flow" });
  const topologyRuntimeLayoutPositions = buildTopologyRuntimeLayoutPositions({
    sceneObjects: objects,
    binding,
  });
  assert.ok(topologyRuntimeLayoutPositions);

  const resolved = resolveRuntimeObjectPosition({
    objectId: "Capacity Buffer",
    sceneObjects: objects,
    topologyRuntimeLayoutPositions,
    logProvider: false,
  });

  assert.equal(resolved.provider, "topologyRuntime.position");
  assert.deepEqual(resolved.position, {
    x: topologyRuntimeLayoutPositions["buf-1"]![0],
    y: topologyRuntimeLayoutPositions["buf-1"]![1],
    z: topologyRuntimeLayoutPositions["buf-1"]![2],
  });
});

test("resolveRuntimeObjectPosition falls back to scene JSON when runtime layout missing", () => {
  const objects: SceneObject[] = [{ id: "legacy-a", position: [2, 3, 4] }];
  const resolved = resolveRuntimeObjectPosition({
    objectId: "legacy-a",
    sceneObjects: objects,
    logProvider: false,
  });
  assert.equal(resolved.provider, "sceneObject.position");
  assert.deepEqual(resolved.position, { x: 2, y: 3, z: 4 });
});

test("resolveRuntimeObjectPosition uses layoutPositions when topology map absent", () => {
  const objects: SceneObject[] = [{ id: "obj-a", position: [1, 1, 1] }];
  const resolved = resolveRuntimeObjectPosition({
    objectId: "obj-a",
    sceneObjects: objects,
    layoutPositions: { "obj-a": [5, 6, 7] },
    logProvider: false,
  });
  assert.equal(resolved.provider, "layoutEngine.position");
  assert.deepEqual(resolved.position, { x: 5, y: 6, z: 7 });
});
