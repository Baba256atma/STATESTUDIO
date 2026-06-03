import test from "node:test";
import assert from "node:assert/strict";

import type { SceneObject } from "../../sceneTypes.ts";
import { bindTopologyToSceneObjects } from "./topologySceneBinding.ts";
import {
  buildTopologyRuntimeLayoutPositions,
  resolveEffectiveLayoutPositions,
} from "./topologyScenePositioning.ts";
import { resetTopologyBindingBrakeLogsForTests } from "./topologyBindingDevLog.ts";
import { resetTopologyConnectionBrakeLogsForTests } from "./topologyConnectionDevLog.ts";
import {
  buildTopologyConnectionLineId,
  resolveTopologyConnectionLines,
} from "./topologyConnectionResolver.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";
import { resetTopologyPositioningBrakeLogsForTests } from "./topologyPositioningDevLog.ts";
import {
  resolveTopologyRuntimePosition,
  topologyPositionDistance,
} from "./topologyRuntimePosition.ts";

function buildSceneObjects(count: number): SceneObject[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `obj-${index + 1}`,
    label: `Object ${index + 1}`,
    position: [index * 1.5, 0, index * 0.5] as [number, number, number],
  }));
}

function resolveLinesForMode(mode: "off" | "auto" | "flow" | "hub", count: number) {
  const objects = buildSceneObjects(count);
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: mode });
  const runtimeLayoutPositions = buildTopologyRuntimeLayoutPositions({
    sceneObjects: objects,
    binding,
  });
  return resolveTopologyConnectionLines({
    connections: binding.connections,
    runtimeLayoutPositions,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: binding.topologyEnabled,
    sceneObjectCount: objects.length,
  });
}

test.beforeEach(() => {
  resetTopologyBindingBrakeLogsForTests();
  resetTopologyConnectionBrakeLogsForTests();
  resetTopologyDevLogsForTests();
  resetTopologyPositioningBrakeLogsForTests();
});

test("buildTopologyConnectionLineId is deterministic", () => {
  assert.equal(buildTopologyConnectionLineId("a", "b"), "a__to__b");
});

test("topologyMode off yields no valid lines", () => {
  const result = resolveLinesForMode("off", 3);
  assert.equal(result.diagnostics.connectionCount, 0);
  assert.equal(result.diagnostics.validLineCount, 0);
  assert.equal(result.lines.length, 0);
});

test("flow topology creates chain lines for 2-4 objects", () => {
  for (const count of [2, 3, 4] as const) {
    const result = resolveLinesForMode("flow", count);
    assert.equal(result.diagnostics.validLineCount, count - 1);
    assert.equal(result.lines.every((line) => line.valid), true);
    assert.equal(result.lines[0]?.id, "obj-1__to__obj-2");
  }
});

test("hub topology creates center-to-satellite lines for 5 and 12 objects", () => {
  for (const count of [5, 12] as const) {
    const result = resolveLinesForMode("hub", count);
    assert.equal(result.diagnostics.validLineCount, count - 1);
    assert.equal(result.lines.every((line) => line.sourceId === "obj-1"), true);
  }
});

test("auto topology resolves valid lines for common counts", () => {
  const two = resolveLinesForMode("auto", 2);
  assert.equal(two.diagnostics.validLineCount, 1);

  const five = resolveLinesForMode("auto", 5);
  assert.equal(five.diagnostics.validLineCount, 4);
});

test("handles 0 and 1 objects without crashing", () => {
  const empty = resolveLinesForMode("auto", 0);
  assert.equal(empty.lines.length, 0);

  const single = resolveLinesForMode("auto", 1);
  assert.equal(single.lines.length, 0);
});

test("skips missing positions and self connections safely", () => {
  const runtimeLayoutPositions = {
    a: [0, 0, 0] as [number, number, number],
    b: [4, 0, 0] as [number, number, number],
  };

  const missingTarget = resolveTopologyConnectionLines({
    connections: [{ sourceId: "a", targetId: "missing" }],
    runtimeLayoutPositions,
    topologyEnabled: true,
  });
  assert.equal(missingTarget.diagnostics.validLineCount, 0);
  assert.equal(missingTarget.lines[0]?.valid, false);

  const selfConnection = resolveTopologyConnectionLines({
    connections: [{ sourceId: "a", targetId: "a" }],
    runtimeLayoutPositions,
  });
  assert.equal(selfConnection.lines.length, 0);

  const duplicate = resolveTopologyConnectionLines({
    connections: [
      { sourceId: "a", targetId: "b" },
      { sourceId: "a", targetId: "b" },
    ],
    runtimeLayoutPositions,
  });
  assert.equal(duplicate.lines.length, 1);
  assert.equal(duplicate.diagnostics.validLineCount, 1);
});

test("invalid positions produce invalid lines without crashing", () => {
  const runtimeLayoutPositions = {
    a: [Number.NaN, 0, 0] as [number, number, number],
    b: [4, 0, 0] as [number, number, number],
  };
  const result = resolveTopologyConnectionLines({
    connections: [{ sourceId: "a", targetId: "b" }],
    runtimeLayoutPositions,
    topologyEnabled: true,
  });
  assert.equal(result.lines.length, 1);
  assert.equal(result.lines[0]?.valid, false);
  assert.equal(result.diagnostics.invalidLineCount, 1);
});

test("empty binding connections only emit diagnostics", () => {
  const result = resolveTopologyConnectionLines({
    connections: [],
    runtimeLayoutPositions: {},
    topologyEnabled: false,
    sceneObjectCount: 0,
  });
  assert.equal(result.lines.length, 0);
  assert.equal(result.diagnostics.connectionCount, 0);
});

test("connection endpoints match runtime layout positions used by objects", () => {
  const objects: SceneObject[] = [
    { id: "hub", name: "Capacity Buffer", label: "Capacity Buffer", position: [0, 0, 0] },
    { id: "sat-a", label: "Sat A", position: [2, 0, 0] },
  ];
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "flow" });
  const runtimeLayoutPositions = buildTopologyRuntimeLayoutPositions({
    sceneObjects: objects,
    binding,
  });
  const effectiveLayout = resolveEffectiveLayoutPositions({
    topologyEnabled: binding.topologyEnabled,
    topologyLayoutPositions: runtimeLayoutPositions,
  });
  const connections = resolveTopologyConnectionLines({
    connections: binding.connections,
    runtimeLayoutPositions: effectiveLayout,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: binding.topologyEnabled,
    sceneObjectCount: objects.length,
  });

  const line = connections.lines[0];
  assert.ok(line?.valid);
  const hubRuntime = resolveTopologyRuntimePosition({
    objectId: "hub",
    runtimeLayoutPositions: effectiveLayout,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: true,
  });
  const hubByName = resolveTopologyRuntimePosition({
    objectId: "Capacity Buffer",
    runtimeLayoutPositions: effectiveLayout,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: true,
  });
  assert.deepEqual(hubByName.position, hubRuntime.position);
  assert.equal(topologyPositionDistance(line.sourcePosition, hubRuntime.position), 0);
});
