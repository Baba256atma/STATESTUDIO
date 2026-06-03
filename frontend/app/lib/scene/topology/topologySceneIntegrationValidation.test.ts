/**
 * Prompt 5 — end-to-end topology scene integration validation (pure pipeline).
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { SceneObject } from "../../sceneTypes.ts";
import { bindTopologyToSceneObjects } from "./topologySceneBinding.ts";
import {
  buildTopologyRuntimeLayoutPositions,
  isValidScenePosition,
  resolveEffectiveLayoutPositions,
} from "./topologyScenePositioning.ts";
import { resolveTopologyConnectionLines } from "./topologyConnectionResolver.ts";
import {
  buildTopologyCameraSignature,
  computeTopologyCameraFrame,
} from "./topologyCameraFrame.ts";
import { generateTopology } from "./topologyEngine.ts";
import { getTopologyGenerator, topologyRegistry } from "./topologyRegistry.ts";
import { resetTopologyBindingBrakeLogsForTests } from "./topologyBindingDevLog.ts";
import { resetTopologyConnectionBrakeLogsForTests } from "./topologyConnectionDevLog.ts";
import { resetTopologyCameraBrakeLogsForTests } from "./topologyCameraDevLog.ts";
import { resetTopologyPositioningBrakeLogsForTests } from "./topologyPositioningDevLog.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";

function buildObjects(count: number): SceneObject[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `obj-${index + 1}`,
    label: `Object ${index + 1}`,
    position: [index * 2, 0, index * 0.5] as [number, number, number],
  }));
}

function runPipeline(mode: "off" | "auto" | "flow" | "hub", count: number) {
  const objects = buildObjects(count);
  const snapshot = JSON.stringify(objects);
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: mode });
  const layout = buildTopologyRuntimeLayoutPositions({ sceneObjects: objects, binding });
  const effectiveLayout = resolveEffectiveLayoutPositions({
    topologyEnabled: binding.topologyEnabled,
    topologyLayoutPositions: layout,
    executiveLayoutPositions: undefined,
  });
  const connections = resolveTopologyConnectionLines({
    connections: binding.connections,
    runtimeLayoutPositions: layout,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: binding.topologyEnabled,
  });
  const cameraPositions = binding.bindings
    .map((entry) => entry.finalPosition)
    .filter((position): position is { x: number; y: number; z: number } =>
      isValidScenePosition(position)
    );
  const cameraFrame = computeTopologyCameraFrame({ positions: cameraPositions });
  const signature = buildTopologyCameraSignature(binding.bindings);
  return {
    objects,
    snapshot,
    binding,
    layout,
    effectiveLayout,
    connections,
    cameraFrame,
    signature,
  };
}

test.beforeEach(() => {
  resetTopologyBindingBrakeLogsForTests();
  resetTopologyConnectionBrakeLogsForTests();
  resetTopologyCameraBrakeLogsForTests();
  resetTopologyPositioningBrakeLogsForTests();
  resetTopologyDevLogsForTests();
});

test("Group 1 — canonical topology entry points only", () => {
  assert.equal(typeof generateTopology, "function");
  assert.equal(typeof topologyRegistry.flow, "function");
  assert.equal(typeof topologyRegistry.hub, "function");
  assert.equal(typeof getTopologyGenerator("flow"), "function");
  assert.doesNotThrow(() => generateTopology("auto", []));
});

test("Group 2 — scene binding matrix and diagnostics", () => {
  for (const count of [0, 1, 2, 5, 12] as const) {
    const { binding } = runPipeline("auto", count);
    assert.equal(binding.bindings.length, count);
    assert.equal(binding.diagnostics.objectCount, count);
    assert.equal(binding.diagnostics.bindingCount, count);
    if (count <= 1) {
      assert.equal(binding.connections.length, 0);
    } else if (count <= 4) {
      assert.equal(binding.topologyType, "flow");
      assert.equal(binding.connections.length, count - 1);
    } else {
      assert.equal(binding.topologyType, "hub");
      assert.equal(binding.connections.length, count - 1);
    }
  }

  const missing = bindTopologyToSceneObjects({
    sceneObjects: [{ id: "x", label: "X" }],
    topologyMode: "auto",
  });
  assert.equal(missing.diagnostics.warnings.length > 0, true);

  const duplicate = bindTopologyToSceneObjects({
    sceneObjects: [
      { id: "dup", label: "A", position: [0, 0, 0] },
      { id: "dup", label: "B", position: [1, 0, 0] },
    ],
    topologyMode: "flow",
  });
  assert.equal(duplicate.bindings.length, 2);
  assert.equal(
    duplicate.diagnostics.warnings.some((warning) => warning.includes("Duplicate object id")),
    true
  );
});

test("Group 3 — JSON preserved, runtime layout applied when enabled", () => {
  const enabled = runPipeline("flow", 3);
  assert.equal(enabled.binding.topologyEnabled, true);
  assert.ok(enabled.layout);
  assert.deepEqual(enabled.objects[0]?.position, [0, 0, 0]);
  assert.equal(JSON.stringify(enabled.objects), enabled.snapshot);

  const disabled = runPipeline("off", 3);
  assert.equal(disabled.binding.topologyEnabled, false);
  assert.equal(disabled.layout, undefined);
  assert.equal(disabled.effectiveLayout, undefined);
});

test("Group 4 — connection lines for flow and hub", () => {
  const flow = runPipeline("flow", 3);
  assert.equal(flow.connections.diagnostics.validLineCount, 2);
  assert.equal(flow.connections.lines.every((line) => line.valid), true);

  const hub = runPipeline("hub", 5);
  assert.equal(hub.connections.diagnostics.validLineCount, 4);
  assert.equal(hub.connections.lines[0]?.sourceId, "obj-1");

  const invalid = resolveTopologyConnectionLines({
    connections: [{ sourceId: "obj-1", targetId: "missing" }],
    runtimeLayoutPositions: hub.layout,
    bindings: hub.binding.bindings,
    sceneObjects: hub.objects,
    topologyEnabled: true,
  });
  assert.equal(invalid.diagnostics.validLineCount, 0);
});

test("Group 5 — camera frame for topology counts", () => {
  for (const count of [1, 2, 5, 12] as const) {
    const { cameraFrame } = runPipeline("auto", count);
    assert.equal(cameraFrame.valid, true);
    assert.ok(Number.isFinite(cameraFrame.radius));
    assert.ok(Number.isFinite(cameraFrame.cameraPosition.x));
    assert.deepEqual(cameraFrame.target, cameraFrame.center);
  }

  const first = runPipeline("flow", 4);
  const second = runPipeline("flow", 4);
  assert.equal(first.signature, second.signature);
});

test("Group 6 — topology off disables runtime layout and connections", () => {
  const off = runPipeline("off", 5);
  assert.equal(off.binding.topologyEnabled, false);
  assert.equal(off.binding.connections.length, 0);
  assert.equal(off.layout, undefined);
  assert.equal(off.connections.diagnostics.connectionCount, 0);
  assert.equal(off.effectiveLayout, undefined);
});
