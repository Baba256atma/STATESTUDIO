import test from "node:test";
import assert from "node:assert/strict";

import type { SceneObject } from "../../sceneTypes.ts";
import { bindTopologyToSceneObjects } from "./topologySceneBinding.ts";
import {
  buildTopologyRuntimeLayoutPositions,
  resolveEffectiveLayoutPositions,
} from "./topologyScenePositioning.ts";
import { resolveTopologyConnectionLines } from "./topologyConnectionResolver.ts";
import {
  collectConnectionRuntimeAuditRecords,
  CONNECTION_TOPOLOGY_MATCH_THRESHOLD,
  summarizeConnectionRuntimeAudit,
} from "./connectionRuntimeAudit.ts";

const defaultVisibility = {
  propagation: false,
  risk_flow: false,
  scenario: false,
  dependency: false,
};

test("topology connections classify as topology-driven when using runtime layout positions", () => {
  const objects: SceneObject[] = [
    { id: "a", label: "A", position: [0, 0, 0] },
    { id: "b", label: "B", position: [9, 0, 9] },
  ];
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "flow" });
  const runtimeLayoutPositions = buildTopologyRuntimeLayoutPositions({ sceneObjects: objects, binding });
  const layout = resolveEffectiveLayoutPositions({
    topologyEnabled: binding.topologyEnabled,
    topologyLayoutPositions: runtimeLayoutPositions,
  });
  const connections = resolveTopologyConnectionLines({
    connections: binding.connections,
    runtimeLayoutPositions: layout,
    bindings: binding.bindings,
    sceneObjects: objects,
    topologyEnabled: binding.topologyEnabled,
    sceneObjectCount: objects.length,
  });

  const records = collectConnectionRuntimeAuditRecords({
    topologyEnabled: true,
    topologyLines: connections.lines,
    topologyConnectionLinesVisible: true,
    runtimeLayoutPositions: layout,
    bindings: binding.bindings,
    sceneObjects: objects,
    sceneJson: { scene: { objects } },
    overlayVisibility: defaultVisibility,
    propagationOverlay: null,
    decisionPathOverlay: null,
  });

  assert.equal(records.length, 1);
  assert.equal(records[0]?.layer, "topology");
  assert.equal(records[0]?.classification, "topology-driven");
  assert.equal(records[0]?.activeSourcePositionProvider, "topologyRuntime.position");
  assert.equal(records[0]?.activeTargetPositionProvider, "topologyRuntime.position");
  assert.ok(records[0]!.sourcePositionMatch < CONNECTION_TOPOLOGY_MATCH_THRESHOLD);
  assert.ok(records[0]!.targetPositionMatch < CONNECTION_TOPOLOGY_MATCH_THRESHOLD);

  const summary = summarizeConnectionRuntimeAudit(records);
  assert.equal(summary.topologyPositionSourceActive, true);
});

test("relationship connections classify as legacy-position-driven when using scene object positions", () => {
  const objects: SceneObject[] = [
    { id: "a", label: "A", position: [1, 0, 2] },
    { id: "b", label: "B", position: [3, 0, 4] },
  ];
  const records = collectConnectionRuntimeAuditRecords({
    topologyEnabled: true,
    topologyLines: [],
    topologyConnectionLinesVisible: false,
    runtimeLayoutPositions: { a: [8, 0, 0], b: [12, 0, 0] },
    bindings: [],
    sceneObjects: objects,
    sceneJson: {
      scene: {
        objects,
        relationships: [{ id: "rel-1", sourceId: "a", targetId: "b", type: "dependency", direction: "forward" }],
      },
    },
    overlayVisibility: defaultVisibility,
    propagationOverlay: null,
    decisionPathOverlay: null,
    viewMode: "3D",
  });

  assert.equal(records.length, 1);
  assert.equal(records[0]?.layer, "relationship");
  assert.equal(records[0]?.classification, "legacy-position-driven");
  assert.equal(records[0]?.activeSourcePositionProvider, "sceneObject.position");
});
