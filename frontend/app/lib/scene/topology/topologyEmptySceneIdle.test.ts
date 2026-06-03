import test from "node:test";
import assert from "node:assert/strict";

import {
  bindTopologyToSceneObjects,
  buildEmptySceneTopologyIdleBinding,
} from "./topologySceneBinding.ts";
import {
  buildTopologyRuntimeLayoutPositions,
  buildTopologyPositionLookupMap,
} from "./topologyScenePositioning.ts";
import { resolveTopologyConnectionLines } from "./topologyConnectionResolver.ts";
import { computeTopologyCameraFrame } from "./topologyCameraFrame.ts";
import { resetTopologyBindingBrakeLogsForTests } from "./topologyBindingDevLog.ts";
import { resetTopologyConnectionBrakeLogsForTests } from "./topologyConnectionDevLog.ts";
import { resetTopologyPositioningBrakeLogsForTests } from "./topologyPositioningDevLog.ts";
import { resetTopologyCameraBrakeLogsForTests } from "./topologyCameraDevLog.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";

const warnedMessages: string[] = [];
let originalConsoleWarn: typeof console.warn | undefined;

test.beforeEach(() => {
  resetTopologyBindingBrakeLogsForTests();
  resetTopologyConnectionBrakeLogsForTests();
  resetTopologyPositioningBrakeLogsForTests();
  resetTopologyCameraBrakeLogsForTests();
  resetTopologyDevLogsForTests();
  warnedMessages.length = 0;
  originalConsoleWarn = globalThis.console?.warn;
  if (originalConsoleWarn) {
    globalThis.console.warn = (...args: unknown[]) => {
      warnedMessages.push(args.map(String).join(" "));
      originalConsoleWarn!.apply(globalThis.console, args);
    };
  }
});

test.afterEach(() => {
  if (originalConsoleWarn) {
    globalThis.console.warn = originalConsoleWarn;
  }
});

function hasTopologyBrake(prefix: string): boolean {
  return warnedMessages.some((message) => message.includes(prefix));
}

test("Case 1 — initial empty scene is silent idle", () => {
  const idle = buildEmptySceneTopologyIdleBinding();
  assert.equal(idle.diagnostics.idle, true);
  assert.equal(idle.diagnostics.reason, "empty_scene");

  const binding = bindTopologyToSceneObjects({ sceneObjects: [], topologyMode: "auto" });
  assert.deepEqual(binding.diagnostics.idle, true);
  assert.equal(binding.topologyEnabled, false);

  const layout = buildTopologyRuntimeLayoutPositions({
    sceneObjects: [],
    binding,
  });
  assert.equal(layout, undefined);

  const positionMap = buildTopologyPositionLookupMap({
    bindings: binding.bindings,
    topologyEnabled: false,
  });
  assert.equal(positionMap.size, 0);

  const connections = resolveTopologyConnectionLines({
    connections: binding.connections,
    runtimeLayoutPositions: layout,
    bindings: binding.bindings,
    topologyEnabled: false,
    sceneObjectCount: 0,
  });
  assert.equal(connections.lines.length, 0);

  const camera = computeTopologyCameraFrame({ positions: [] });
  assert.equal(camera.valid, false);

  assert.equal(hasTopologyBrake("[TopologyBinding][Brake]"), false);
  assert.equal(hasTopologyBrake("[TopologyPositioning][Brake]"), false);
  assert.equal(hasTopologyBrake("[TopologyConnection][Brake]"), false);
});

test("Case 2 — one object has no connection warning", () => {
  const binding = bindTopologyToSceneObjects({
    sceneObjects: [{ id: "solo", label: "Solo", position: [0, 0, 0] }],
    topologyMode: "auto",
  });
  assert.equal(binding.connections.length, 0);
  assert.equal(binding.bindings.length, 1);

  const layout = buildTopologyRuntimeLayoutPositions({
    sceneObjects: [{ id: "solo", label: "Solo", position: [0, 0, 0] }],
    binding,
  });
  resolveTopologyConnectionLines({
    connections: binding.connections,
    runtimeLayoutPositions: layout,
    bindings: binding.bindings,
    sceneObjects: [{ id: "solo", label: "Solo", position: [0, 0, 0] }],
    topologyEnabled: binding.topologyEnabled,
    sceneObjectCount: 1,
  });

  assert.equal(hasTopologyBrake("[TopologyConnection][Brake] No connections found"), false);
});

test("Case 3 — two objects flow topology with connections", () => {
  const binding = bindTopologyToSceneObjects({
    sceneObjects: [
      { id: "a", label: "A", position: [0, 0, 0] },
      { id: "b", label: "B", position: [1, 0, 0] },
    ],
    topologyMode: "auto",
  });
  assert.equal(binding.topologyType, "flow");
  assert.equal(binding.connections.length, 1);

  const layout = buildTopologyRuntimeLayoutPositions({
    sceneObjects: [
      { id: "a", label: "A", position: [0, 0, 0] },
      { id: "b", label: "B", position: [1, 0, 0] },
    ],
    binding,
  });
  assert.ok(layout);

  const positions = binding.bindings
    .map((entry) => entry.finalPosition)
    .filter((position): position is { x: number; y: number; z: number } => !!position);
  assert.equal(computeTopologyCameraFrame({ positions }).valid, true);
});

test("Case 4 — five objects hub topology with connections", () => {
  const objects = Array.from({ length: 5 }, (_, index) => ({
    id: `obj-${index + 1}`,
    label: `Object ${index + 1}`,
    position: [index, 0, 0] as [number, number, number],
  }));
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "auto" });
  assert.equal(binding.topologyType, "hub");
  assert.equal(binding.connections.length, 4);
});

test("Case 5 — bad data still emits binding brakes", () => {
  const binding = bindTopologyToSceneObjects({
    sceneObjects: [
      { id: "dup", label: "A", position: [0, 0, 0] },
      { id: "dup", label: "B", position: [1, 0, 0] },
      { id: "no-pos", label: "No Pos" },
    ],
    topologyMode: "flow",
  });
  assert.equal(
    binding.diagnostics.warnings.some((warning) => warning.includes("Duplicate object id")),
    true
  );
  assert.equal(
    binding.diagnostics.warnings.some((warning) => warning.includes("Missing JSON position")),
    true
  );
  assert.equal(hasTopologyBrake("[TopologyBinding][Brake]"), true);
});

test("missing connections with multiple objects logs connection brake", () => {
  resolveTopologyConnectionLines({
    connections: [],
    runtimeLayoutPositions: {
      a: [0, 0, 0],
      b: [4, 0, 0],
    },
    topologyEnabled: true,
    sceneObjectCount: 3,
  });
  assert.equal(hasTopologyBrake("[TopologyConnection][Brake] No connections found"), true);
});
