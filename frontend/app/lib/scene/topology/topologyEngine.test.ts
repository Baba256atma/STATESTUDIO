import test from "node:test";
import assert from "node:assert/strict";

import { FLOW_NODE_SPACING } from "./flowTopologyGenerator.ts";
import { HUB_RADIUS } from "./hubTopologyGenerator.ts";
import { generateTopology } from "./topologyEngine.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";
import type { TopologyNode } from "./topologyTypes.ts";

function buildNodes(count: number): TopologyNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `node-${index + 1}`,
    name: `Node ${index + 1}`,
    position: { x: index * 2, y: 0, z: index },
  }));
}

function assertValidFlowTopologyResult(
  result: ReturnType<typeof generateTopology>,
  expectedCount: number
): void {
  assert.equal(result.topology, "flow");
  assert.equal(result.nodes.length, expectedCount);
  assert.ok(Number.isFinite(result.generatedAt));
  assert.ok(result.generatedAt > 0);
  result.nodes.forEach((node, index) => {
    assert.equal(node.id, `node-${index + 1}`);
    assert.equal(node.name, `Node ${index + 1}`);
    assert.deepEqual(node.position, {
      x: index * FLOW_NODE_SPACING,
      y: 0,
      z: 0,
    });
  });
  if (expectedCount > 1) {
    assert.equal(result.connections?.length, expectedCount - 1);
  }
}

function expectedHubSatellitePosition(satelliteIndex: number, satelliteCount: number) {
  const angle = (Math.PI * 2 * satelliteIndex) / satelliteCount;
  return {
    x: Math.round(HUB_RADIUS * Math.cos(angle) * 1000) / 1000,
    y: 0,
    z: Math.round(HUB_RADIUS * Math.sin(angle) * 1000) / 1000,
  };
}

function assertValidHubTopologyResult(
  result: ReturnType<typeof generateTopology>,
  expectedCount: number
): void {
  assert.equal(result.topology, "hub");
  assert.equal(result.nodes.length, expectedCount);
  assert.ok(Number.isFinite(result.generatedAt));
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  const satelliteCount = expectedCount - 1;
  for (let index = 0; index < satelliteCount; index += 1) {
    assert.equal(result.nodes[index + 1]?.id, `node-${index + 2}`);
    assert.deepEqual(
      result.nodes[index + 1]?.position,
      expectedHubSatellitePosition(index, satelliteCount)
    );
  }
  if (satelliteCount > 0) {
    assert.equal(result.connections?.length, satelliteCount);
    result.connections?.forEach((connection) => {
      assert.equal(connection.sourceId, "node-1");
    });
  }
}

test.beforeEach(() => {
  resetTopologyDevLogsForTests();
});

test("generateTopology(flow) works for 2, 5, and 12 nodes", () => {
  for (const count of [2, 5, 12] as const) {
    const result = generateTopology("flow", buildNodes(count));
    assertValidFlowTopologyResult(result, count);
  }
});

test("generateTopology(hub) works for 2, 5, and 12 nodes", () => {
  for (const count of [2, 5, 12] as const) {
    const result = generateTopology("hub", buildNodes(count));
    assertValidHubTopologyResult(result, count);
  }
});

test("generateTopology preserves nodes without positions", () => {
  const result = generateTopology("ring", [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Beta" },
  ]);
  assert.equal(result.topology, "ring");
  assert.equal(result.nodes.length, 2);
  assert.equal(result.nodes[0]?.position, undefined);
  assert.equal(result.nodes[1]?.name, "Beta");
});

test("generateTopology supports all registry topology types", () => {
  const nodes = buildNodes(3);
  for (const topology of ["flow", "hub", "ring", "cluster", "hybrid"] as const) {
    const result = generateTopology(topology, nodes);
    assert.equal(result.topology, topology);
    assert.equal(result.nodes.length, 3);
  }
});

test("generateTopology rejects nodes without id", () => {
  assert.throws(
    () => generateTopology("flow", [{ id: "  ", name: "Empty" }]),
    /non-empty id/
  );
});
