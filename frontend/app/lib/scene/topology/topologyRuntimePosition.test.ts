import test from "node:test";
import assert from "node:assert/strict";

import type { SceneObject } from "../../sceneTypes.ts";
import { bindTopologyToSceneObjects } from "./topologySceneBinding.ts";
import { buildTopologyRuntimeLayoutPositions } from "./topologyScenePositioning.ts";
import { resetTopologyBindingBrakeLogsForTests } from "./topologyBindingDevLog.ts";
import { resetTopologyPositioningBrakeLogsForTests } from "./topologyPositioningDevLog.ts";
import {
  collectTopologyRuntimePositionAliasKeys,
  resolveTopologyRuntimePosition,
  topologyPositionDistance,
} from "./topologyRuntimePosition.ts";
import { resetTopologyRuntimePositionDevLogsForTests } from "./topologyRuntimePositionDevLog.ts";

function buildObjects(count: number): SceneObject[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `obj-${index + 1}`,
    label: `Object ${index + 1}`,
    position: [index * 2, 0, index * 0.5] as [number, number, number],
  }));
}

test.beforeEach(() => {
  resetTopologyBindingBrakeLogsForTests();
  resetTopologyPositioningBrakeLogsForTests();
  resetTopologyRuntimePositionDevLogsForTests();
});

test("resolveTopologyRuntimePosition prefers runtime layout positions", () => {
  const objects = buildObjects(2);
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "flow" });
  const runtimeLayoutPositions = buildTopologyRuntimeLayoutPositions({
    sceneObjects: objects,
    binding,
  });
  assert.ok(runtimeLayoutPositions);

  const resolved = resolveTopologyRuntimePosition({
    objectId: "obj-2",
    runtimeLayoutPositions,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: true,
  });
  assert.equal(resolved.source, "runtime_layout");
  assert.deepEqual(resolved.position, {
    x: runtimeLayoutPositions["obj-2"]![0],
    y: runtimeLayoutPositions["obj-2"]![1],
    z: runtimeLayoutPositions["obj-2"]![2],
  });
});

test("resolveTopologyRuntimePosition resolves object aliases", () => {
  const objects: SceneObject[] = [
    { id: "buf-1", name: "Capacity Buffer", label: "Capacity Buffer", position: [0, 0, 0] },
  ];
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "auto" });
  const runtimeLayoutPositions = buildTopologyRuntimeLayoutPositions({
    sceneObjects: objects,
    binding,
  });
  assert.ok(runtimeLayoutPositions);

  const aliasKeys = collectTopologyRuntimePositionAliasKeys({
    objectId: "Capacity Buffer",
    bindings: binding.bindings,
    sceneObjects: objects,
  });
  assert.equal(aliasKeys.includes("buf-1"), true);
  assert.equal(aliasKeys.includes("Capacity Buffer"), true);

  const byName = resolveTopologyRuntimePosition({
    objectId: "Capacity Buffer",
    runtimeLayoutPositions,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: true,
  });
  const byId = resolveTopologyRuntimePosition({
    objectId: "buf-1",
    runtimeLayoutPositions,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: true,
  });
  assert.deepEqual(byName.position, byId.position);
});

test("topologyPositionDistance returns zero for identical positions", () => {
  assert.equal(topologyPositionDistance({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 }), 0);
});
