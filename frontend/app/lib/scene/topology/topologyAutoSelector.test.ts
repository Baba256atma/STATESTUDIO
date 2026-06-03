import test from "node:test";
import assert from "node:assert/strict";

import {
  formatTopologySelectionReason,
  generateAutoTopology,
  selectTopology,
} from "./topologyAutoSelector.ts";
import { FLOW_NODE_SPACING } from "./flowTopologyGenerator.ts";
import { HUB_RADIUS } from "./hubTopologyGenerator.ts";
import { generateTopology } from "./topologyEngine.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";
import type { TopologyNode } from "./topologyTypes.ts";

function buildNodes(count: number): TopologyNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `node-${index + 1}`,
    name: `Node ${index + 1}`,
  }));
}

test.beforeEach(() => {
  resetTopologyDevLogsForTests();
});

test("selectTopology follows MVP node-count rules", () => {
  assert.equal(selectTopology([]), "flow");
  assert.equal(selectTopology(buildNodes(1)), "hub");
  assert.equal(selectTopology(buildNodes(2)), "flow");
  assert.equal(selectTopology(buildNodes(4)), "flow");
  assert.equal(selectTopology(buildNodes(5)), "hub");
  assert.equal(selectTopology(buildNodes(12)), "hub");
});

test("formatTopologySelectionReason uses readable labels", () => {
  assert.equal(formatTopologySelectionReason(3, "flow"), "3 nodes -> Flow Topology");
  assert.equal(formatTopologySelectionReason(9, "hub"), "9 nodes -> Hub Topology");
  assert.equal(formatTopologySelectionReason(1, "hub"), "1 node -> Hub Topology");
});

test("generateAutoTopology applies flow layout for 3 nodes", () => {
  const result = generateAutoTopology(buildNodes(3));
  assert.equal(result.topology, "flow");
  assert.equal(result.autoSelected, true);
  assert.equal(result.selectionReason, "3 nodes -> Flow Topology");
  assert.equal(result.nodes.length, 3);
  assert.equal(result.connections?.length, 2);
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  assert.deepEqual(result.nodes[2]?.position, {
    x: 2 * FLOW_NODE_SPACING,
    y: 0,
    z: 0,
  });
});

test("generateAutoTopology applies hub layout for 9 nodes", () => {
  const result = generateAutoTopology(buildNodes(9));
  assert.equal(result.topology, "hub");
  assert.equal(result.autoSelected, true);
  assert.equal(result.selectionReason, "9 nodes -> Hub Topology");
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  assert.equal(result.connections?.length, 8);
  const angle = 0;
  assert.deepEqual(result.nodes[1]?.position, {
    x: Math.round(HUB_RADIUS * Math.cos(angle) * 1000) / 1000,
    y: 0,
    z: Math.round(HUB_RADIUS * Math.sin(angle) * 1000) / 1000,
  });
});

test("generateTopology(auto) returns layout metadata and resolved topology", () => {
  const flowResult = generateTopology("auto", buildNodes(4));
  assert.equal(flowResult.topology, "flow");
  assert.equal(flowResult.autoSelected, true);
  assert.equal(flowResult.selectionReason, "4 nodes -> Flow Topology");
  assert.equal(flowResult.nodes.length, 4);
  assert.equal(flowResult.connections?.length, 3);

  const hubResult = generateTopology("auto", buildNodes(5));
  assert.equal(hubResult.topology, "hub");
  assert.equal(hubResult.autoSelected, true);
  assert.equal(hubResult.selectionReason, "5 nodes -> Hub Topology");
  assert.equal(hubResult.nodes.length, 5);
  assert.equal(hubResult.connections?.length, 4);
});

test("generateTopology(auto) uses flow for empty scene", () => {
  const result = generateTopology("auto", []);
  assert.equal(result.topology, "flow");
  assert.equal(result.autoSelected, true);
  assert.equal(result.selectionReason, "0 nodes -> Flow Topology");
  assert.equal(result.nodes.length, 0);
  assert.equal(result.connections, undefined);
});
