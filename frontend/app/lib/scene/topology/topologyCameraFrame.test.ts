import test from "node:test";
import assert from "node:assert/strict";

import { bindTopologyToSceneObjects } from "./topologySceneBinding.ts";
import {
  buildTopologyCameraSignature,
  computeTopologyCameraFrame,
  DEFAULT_TOPOLOGY_CAMERA_PADDING,
  MIN_CAMERA_RADIUS,
} from "./topologyCameraFrame.ts";
import { resetTopologyBindingBrakeLogsForTests } from "./topologyBindingDevLog.ts";
import { resetTopologyCameraBrakeLogsForTests } from "./topologyCameraDevLog.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";

test.beforeEach(() => {
  resetTopologyBindingBrakeLogsForTests();
  resetTopologyCameraBrakeLogsForTests();
  resetTopologyDevLogsForTests();
});

test("computeTopologyCameraFrame returns invalid when no positions", () => {
  const frame = computeTopologyCameraFrame({ positions: [] });
  assert.equal(frame.valid, false);
  assert.equal(frame.diagnostics.validPositionCount, 0);
});

test("computeTopologyCameraFrame centers and frames valid positions", () => {
  const frame = computeTopologyCameraFrame({
    positions: [
      { x: 0, y: 0, z: 0 },
      { x: 8, y: 0, z: 0 },
    ],
    padding: DEFAULT_TOPOLOGY_CAMERA_PADDING,
  });
  assert.equal(frame.valid, true);
  assert.deepEqual(frame.center, { x: 4, y: 0, z: 0 });
  assert.equal(frame.radius, Math.max(MIN_CAMERA_RADIUS, 4 + DEFAULT_TOPOLOGY_CAMERA_PADDING));
  assert.equal(frame.target.x, 4);
  assert.equal(frame.cameraPosition.y, frame.center.y + frame.radius * 0.7);
  assert.equal(frame.cameraPosition.z, frame.center.z + frame.radius * 1.6);
});

test("computeTopologyCameraFrame enforces minimum radius", () => {
  const frame = computeTopologyCameraFrame({
    positions: [{ x: 0, y: 0, z: 0 }],
  });
  assert.equal(frame.valid, true);
  assert.equal(frame.radius, MIN_CAMERA_RADIUS);
});

test("computeTopologyCameraFrame ignores invalid positions safely", () => {
  const frame = computeTopologyCameraFrame({
    positions: [{ x: Number.NaN, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }],
  });
  assert.equal(frame.valid, true);
  assert.equal(frame.diagnostics.validPositionCount, 1);
  assert.deepEqual(frame.center, { x: 2, y: 0, z: 0 });
});

test("buildTopologyCameraSignature is deterministic", () => {
  const binding = bindTopologyToSceneObjects({
    sceneObjects: [
      { id: "a", label: "A", position: [0, 0, 0] },
      { id: "b", label: "B", position: [4, 0, 0] },
    ],
    topologyMode: "flow",
  });
  const signature = buildTopologyCameraSignature(binding.bindings);
  assert.match(signature, /a:/);
  assert.match(signature, /b:/);
  assert.equal(signature, buildTopologyCameraSignature(binding.bindings));
});

test("topology binding positions produce valid frames for flow and hub counts", () => {
  for (const count of [0, 1, 2, 5, 12] as const) {
    const binding = bindTopologyToSceneObjects({
      sceneObjects: Array.from({ length: count }, (_, index) => ({
        id: `obj-${index + 1}`,
        label: `Object ${index + 1}`,
        position: [index, 0, 0] as [number, number, number],
      })),
      topologyMode: "auto",
    });
    const positions = binding.bindings
      .map((entry) => entry.finalPosition)
      .filter((position): position is { x: number; y: number; z: number } => !!position);
    const frame = computeTopologyCameraFrame({ positions });
    if (count === 0) {
      assert.equal(frame.valid, false);
      continue;
    }
    assert.equal(frame.valid, true);
  }
});
