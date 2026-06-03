import test from "node:test";
import assert from "node:assert/strict";

import type { SceneObject } from "../../sceneTypes.ts";
import {
  bindTopologyToSceneObjects,
  readSceneObjectOriginalPosition,
  sceneObjectToTopologyNode,
} from "./topologySceneBinding.ts";
import { FLOW_NODE_SPACING } from "./flowTopologyGenerator.ts";
import { HUB_RADIUS } from "./hubTopologyGenerator.ts";
import { resetTopologyBindingBrakeLogsForTests } from "./topologyBindingDevLog.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";

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
});

test("topologyMode off preserves JSON positions without enabling topology", () => {
  const result = bindTopologyToSceneObjects({
    sceneObjects: buildSceneObjects(5),
    topologyMode: "off",
  });
  assert.equal(result.topologyEnabled, false);
  assert.equal(result.topologyType, "off");
  assert.equal(result.bindings.length, 5);
  assert.equal(result.connections.length, 0);
  assert.equal(result.bindings[0]?.source, "json");
  assert.deepEqual(result.bindings[0]?.finalPosition, { x: 0, y: 0, z: 0 });
  assert.equal(result.bindings[0]?.topologyPosition, undefined);
});

test("topologyMode auto generates topology bindings and connections", () => {
  const result = bindTopologyToSceneObjects({
    sceneObjects: buildSceneObjects(5),
    topologyMode: "auto",
  });
  assert.equal(result.topologyEnabled, true);
  assert.equal(result.topologyType, "hub");
  assert.equal(result.bindings.length, 5);
  assert.equal(result.connections.length, 4);
  assert.equal(result.bindings.every((binding) => binding.source === "topology"), true);
  assert.deepEqual(result.bindings[0]?.finalPosition, { x: 0, y: 0, z: 0 });
});

test("topologyMode flow and hub bind positions by index", () => {
  const flow = bindTopologyToSceneObjects({
    sceneObjects: buildSceneObjects(3),
    topologyMode: "flow",
  });
  assert.equal(flow.topologyType, "flow");
  assert.deepEqual(flow.bindings[1]?.finalPosition, {
    x: FLOW_NODE_SPACING,
    y: 0,
    z: 0,
  });
  assert.equal(flow.connections.length, 2);

  const hub = bindTopologyToSceneObjects({
    sceneObjects: buildSceneObjects(3),
    topologyMode: "hub",
  });
  assert.equal(hub.topologyType, "hub");
  assert.deepEqual(hub.bindings[0]?.finalPosition, { x: 0, y: 0, z: 0 });
  assert.equal(hub.bindings[1]?.finalPosition?.x, HUB_RADIUS);
  assert.equal(hub.connections.length, 2);
});

test("handles 0, 1, 2, 5, and 12 objects", () => {
  for (const count of [0, 1, 2, 5, 12] as const) {
    const result = bindTopologyToSceneObjects({
      sceneObjects: buildSceneObjects(count),
      topologyMode: "auto",
    });
    assert.equal(result.bindings.length, count);
    assert.equal(result.diagnostics.objectCount, count);
  }
});

test("falls back when JSON position is missing", () => {
  const result = bindTopologyToSceneObjects({
    sceneObjects: [{ id: "missing-pos", label: "No Position" }],
    topologyMode: "auto",
  });
  assert.equal(result.bindings[0]?.source, "topology");
  assert.ok(result.bindings[0]?.finalPosition);
  assert.equal(result.diagnostics.warnings.some((warning) => warning.includes("Missing JSON position")), true);
});

test("duplicate object ids produce warnings without crashing", () => {
  const result = bindTopologyToSceneObjects({
    sceneObjects: [
      { id: "dup", label: "A", position: [1, 0, 0] },
      { id: "dup", label: "B", position: [2, 0, 0] },
    ],
    topologyMode: "auto",
  });
  assert.equal(result.bindings.length, 2);
  assert.equal(
    result.diagnostics.warnings.some((warning) => warning.includes("Duplicate object id detected: dup")),
    true
  );
});

test("scene object conversion helpers are non-mutating", () => {
  const object: SceneObject = {
    id: "machine-a",
    label: "Machine A",
    position: [3, 0, 2],
  };
  const snapshot = JSON.stringify(object);
  const node = sceneObjectToTopologyNode(object, 0);
  assert.equal(JSON.stringify(object), snapshot);
  assert.equal(node.id, "machine-a");
  assert.deepEqual(node.position, { x: 3, y: 0, z: 2 });
  assert.deepEqual(readSceneObjectOriginalPosition(object), { x: 3, y: 0, z: 2 });
});

test("undefined sceneObjects input is treated as empty idle", () => {
  const result = bindTopologyToSceneObjects({
    sceneObjects: undefined as unknown as SceneObject[],
    topologyMode: "auto",
  });
  assert.equal(result.bindings.length, 0);
  assert.equal(result.topologyEnabled, false);
  assert.equal(result.diagnostics.idle, true);
  assert.equal(result.diagnostics.reason, "empty_scene");
});

test("off mode uses fallback origin when JSON position is missing", () => {
  const result = bindTopologyToSceneObjects({
    sceneObjects: [{ id: "no-pos", label: "No Pos" }],
    topologyMode: "off",
  });
  assert.equal(result.bindings[0]?.source, "fallback");
  assert.deepEqual(result.bindings[0]?.finalPosition, { x: 0, y: 0, z: 0 });
});
