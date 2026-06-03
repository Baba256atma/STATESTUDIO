import test from "node:test";
import assert from "node:assert/strict";

import type { SceneObject } from "../../sceneTypes.ts";
import { bindTopologyToSceneObjects } from "./topologySceneBinding.ts";
import { FLOW_NODE_SPACING } from "./flowTopologyGenerator.ts";
import { HUB_RADIUS } from "./hubTopologyGenerator.ts";
import { resetTopologyBindingBrakeLogsForTests } from "./topologyBindingDevLog.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";
import { resetTopologyPositioningBrakeLogsForTests } from "./topologyPositioningDevLog.ts";
import {
  buildTopologyRuntimeLayoutPositions,
  isValidScenePosition,
  resolveRuntimeScenePosition,
} from "./topologyScenePositioning.ts";

function buildSceneObjects(count: number, withPosition = true): SceneObject[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `obj-${index + 1}`,
    label: `Object ${index + 1}`,
    ...(withPosition
      ? {
          position: [index * 1.5, 0, index * 0.5] as [number, number, number],
        }
      : {}),
  }));
}

test.beforeEach(() => {
  resetTopologyBindingBrakeLogsForTests();
  resetTopologyDevLogsForTests();
  resetTopologyPositioningBrakeLogsForTests();
});

test("isValidScenePosition accepts finite xyz only", () => {
  assert.equal(isValidScenePosition({ x: 1, y: 2, z: 3 }), true);
  assert.equal(isValidScenePosition({ x: NaN, y: 0, z: 0 }), false);
  assert.equal(isValidScenePosition(null), false);
  assert.equal(isValidScenePosition([1, 2, 3]), false);
});

test("resolveRuntimeScenePosition prefers topology when enabled", () => {
  const resolved = resolveRuntimeScenePosition({
    objectId: "obj-1",
    jsonPosition: { x: 9, y: 0, z: 9 },
    topologyPosition: { x: 4, y: 0, z: 0 },
    topologyEnabled: true,
  });
  assert.equal(resolved.source, "topology");
  assert.deepEqual(resolved.position, { x: 4, y: 0, z: 0 });
});

test("resolveRuntimeScenePosition falls back to json then origin", () => {
  const jsonFallback = resolveRuntimeScenePosition({
    objectId: "obj-1",
    jsonPosition: { x: 2, y: 0, z: 1 },
    topologyEnabled: true,
  });
  assert.equal(jsonFallback.source, "json");

  const originFallback = resolveRuntimeScenePosition({
    objectId: "obj-1",
    topologyEnabled: true,
  });
  assert.equal(originFallback.source, "origin");
  assert.deepEqual(originFallback.position, { x: 0, y: 0, z: 0 });
});

test("resolveRuntimeScenePosition uses json when topology disabled", () => {
  const resolved = resolveRuntimeScenePosition({
    objectId: "obj-1",
    jsonPosition: { x: 3, y: 0, z: 2 },
    topologyPosition: { x: 8, y: 0, z: 0 },
    topologyEnabled: false,
  });
  assert.equal(resolved.source, "json");
  assert.deepEqual(resolved.position, { x: 3, y: 0, z: 2 });
});

test("topologyMode off keeps JSON positions in runtime layout map", () => {
  const objects = buildSceneObjects(3);
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "off" });
  const layout = buildTopologyRuntimeLayoutPositions({ sceneObjects: objects, binding });
  assert.equal(layout, undefined);
  assert.equal(binding.topologyEnabled, false);
  assert.deepEqual(objects[0]?.position, [0, 0, 0]);
});

test("topologyMode auto flow layout for 2-4 objects", () => {
  for (const count of [2, 3, 4] as const) {
    const objects = buildSceneObjects(count);
    const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "auto" });
    const layout = buildTopologyRuntimeLayoutPositions({ sceneObjects: objects, binding });
    assert.equal(binding.topologyType, "flow");
    assert.ok(layout);
    assert.deepEqual(layout?.["obj-2"], [FLOW_NODE_SPACING, 0, 0]);
    assert.deepEqual(objects[0]?.position, [0, 0, 0]);
  }
});

test("topologyMode auto hub layout for 5-12 objects", () => {
  for (const count of [5, 12] as const) {
    const objects = buildSceneObjects(count);
    const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "auto" });
    const layout = buildTopologyRuntimeLayoutPositions({ sceneObjects: objects, binding });
    assert.equal(binding.topologyType, "hub");
    assert.ok(layout);
    assert.deepEqual(layout?.["obj-1"], [0, 0, 0]);
    assert.equal(layout?.["obj-2"]?.[0], HUB_RADIUS);
  }
});

test("topologyMode flow and hub produce layout positions", () => {
  const flowObjects = buildSceneObjects(2);
  const flowBinding = bindTopologyToSceneObjects({ sceneObjects: flowObjects, topologyMode: "flow" });
  const flowLayout = buildTopologyRuntimeLayoutPositions({ sceneObjects: flowObjects, binding: flowBinding });
  assert.deepEqual(flowLayout?.["obj-2"], [FLOW_NODE_SPACING, 0, 0]);

  const hubObjects = buildSceneObjects(5);
  const hubBinding = bindTopologyToSceneObjects({ sceneObjects: hubObjects, topologyMode: "hub" });
  const hubLayout = buildTopologyRuntimeLayoutPositions({ sceneObjects: hubObjects, binding: hubBinding });
  assert.deepEqual(hubLayout?.["obj-1"], [0, 0, 0]);
});

test("handles missing JSON position and empty binding safely", () => {
  const missingPosObjects = [{ id: "no-pos", label: "No Pos" }];
  const binding = bindTopologyToSceneObjects({
    sceneObjects: missingPosObjects,
    topologyMode: "auto",
  });
  const layout = buildTopologyRuntimeLayoutPositions({
    sceneObjects: missingPosObjects,
    binding,
  });
  assert.ok(layout?.["no-pos"]);
  assert.deepEqual(missingPosObjects[0]?.position, undefined);

  const emptyBinding = bindTopologyToSceneObjects({ sceneObjects: [], topologyMode: "auto" });
  const emptyLayout = buildTopologyRuntimeLayoutPositions({
    sceneObjects: [],
    binding: emptyBinding,
  });
  assert.equal(emptyLayout, undefined);
});

test("invalid json position falls back to origin without mutating objects", () => {
  const objects: SceneObject[] = [{ id: "bad", label: "Bad", position: [Number.NaN, 0, 0] }];
  const snapshot = JSON.stringify(objects);
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "off" });
  const resolved = resolveRuntimeScenePosition({
    objectId: "bad",
    jsonPosition: binding.bindings[0]?.originalPosition,
    topologyEnabled: false,
  });
  assert.equal(resolved.source, "origin");
  assert.equal(JSON.stringify(objects), snapshot);
});
