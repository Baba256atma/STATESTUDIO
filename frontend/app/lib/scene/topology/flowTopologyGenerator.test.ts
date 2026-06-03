import test from "node:test";
import assert from "node:assert/strict";

import { FLOW_NODE_SPACING, generateFlowTopology } from "./flowTopologyGenerator.ts";
import { generateTopology } from "./topologyEngine.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";
import type { TopologyNode } from "./topologyTypes.ts";

function buildOrderedNodes(count: number): TopologyNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `node-${index + 1}`,
    name: `Machine ${String.fromCharCode(65 + index)}`,
  }));
}

function assertHorizontalPositions(nodes: TopologyNode[], count: number): void {
  assert.equal(nodes.length, count);
  for (let index = 0; index < count; index += 1) {
    assert.deepEqual(nodes[index]?.position, {
      x: index * FLOW_NODE_SPACING,
      y: 0,
      z: 0,
    });
  }
}

test.beforeEach(() => {
  resetTopologyDevLogsForTests();
});

test("generateFlowTopology positions 2 nodes at (0,0,0) and (4,0,0)", () => {
  const result = generateFlowTopology(buildOrderedNodes(2));
  assert.equal(result.topology, "flow");
  assertHorizontalPositions(result.nodes, 2);
  assert.equal(result.connections?.length, 1);
  assert.deepEqual(result.connections?.[0], {
    sourceId: "node-1",
    targetId: "node-2",
  });
});

test("generateFlowTopology positions 5 nodes at 0, 4, 8, 12, 16", () => {
  const result = generateFlowTopology(buildOrderedNodes(5));
  assertHorizontalPositions(result.nodes, 5);
  assert.equal(result.nodes[4]?.position?.x, 16);
  assert.equal(result.connections?.length, 4);
});

test("generateFlowTopology positions 12 nodes ending at x = 44", () => {
  const result = generateFlowTopology(buildOrderedNodes(12));
  assertHorizontalPositions(result.nodes, 12);
  assert.equal(result.nodes[11]?.position?.x, 44);
  assert.equal(result.connections?.length, 11);
});

test("generateFlowTopology preserves incoming node order", () => {
  const nodes: TopologyNode[] = [
    { id: "machine-a", name: "Machine A" },
    { id: "machine-b", name: "Machine B" },
    { id: "machine-c", name: "Machine C" },
  ];
  const result = generateFlowTopology(nodes);
  assert.deepEqual(
    result.nodes.map((node) => node.name),
    ["Machine A", "Machine B", "Machine C"]
  );
  assert.deepEqual(result.connections, [
    { sourceId: "machine-a", targetId: "machine-b" },
    { sourceId: "machine-b", targetId: "machine-c" },
  ]);
});

test("generateTopology(flow) returns positioned nodes and connections via registry", () => {
  const result = generateTopology("flow", buildOrderedNodes(7));
  assert.equal(result.topology, "flow");
  assert.equal(result.nodes.length, 7);
  assert.equal(result.nodes[6]?.position?.x, 24);
  assert.equal(result.connections?.length, 6);
  assert.ok(Number.isFinite(result.generatedAt));
});

test("generateFlowTopology omits connections for a single node", () => {
  const result = generateFlowTopology([{ id: "solo", name: "Solo" }]);
  assert.equal(result.nodes.length, 1);
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  assert.equal(result.connections, undefined);
});
