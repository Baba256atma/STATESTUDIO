import test from "node:test";
import assert from "node:assert/strict";

import { HUB_RADIUS, generateHubTopology } from "./hubTopologyGenerator.ts";
import { generateTopology } from "./topologyEngine.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";
import type { TopologyNode } from "./topologyTypes.ts";

function buildOrderedNodes(count: number): TopologyNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `node-${index + 1}`,
    name: `Machine ${String.fromCharCode(65 + index)}`,
  }));
}

function expectedSatellitePosition(satelliteIndex: number, satelliteCount: number) {
  const angle = (Math.PI * 2 * satelliteIndex) / satelliteCount;
  return {
    x: Math.round(HUB_RADIUS * Math.cos(angle) * 1000) / 1000,
    y: 0,
    z: Math.round(HUB_RADIUS * Math.sin(angle) * 1000) / 1000,
  };
}

test.beforeEach(() => {
  resetTopologyDevLogsForTests();
});

test("generateHubTopology places hub at center with 1 satellite for 2 nodes", () => {
  const result = generateHubTopology(buildOrderedNodes(2));
  assert.equal(result.topology, "hub");
  assert.equal(result.nodes.length, 2);
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  assert.deepEqual(result.nodes[1]?.position, expectedSatellitePosition(0, 1));
  assert.equal(result.connections?.length, 1);
  assert.deepEqual(result.connections?.[0], {
    sourceId: "node-1",
    targetId: "node-2",
  });
});

test("generateHubTopology places 4 satellites around circle for 5 nodes", () => {
  const result = generateHubTopology(buildOrderedNodes(5));
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  for (let index = 0; index < 4; index += 1) {
    assert.deepEqual(result.nodes[index + 1]?.position, expectedSatellitePosition(index, 4));
  }
  assert.equal(result.connections?.length, 4);
  result.connections?.forEach((connection) => {
    assert.equal(connection.sourceId, "node-1");
  });
});

test("generateHubTopology places 11 satellites around circle for 12 nodes", () => {
  const result = generateHubTopology(buildOrderedNodes(12));
  assert.equal(result.nodes.length, 12);
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  for (let index = 0; index < 11; index += 1) {
    assert.deepEqual(result.nodes[index + 1]?.position, expectedSatellitePosition(index, 11));
  }
  assert.equal(result.connections?.length, 11);
});

test("generateHubTopology preserves incoming order and hub-first semantics", () => {
  const nodes: TopologyNode[] = [
    { id: "hub", name: "Machine A" },
    { id: "sat-b", name: "Machine B" },
    { id: "sat-c", name: "Machine C" },
  ];
  const result = generateHubTopology(nodes);
  assert.equal(result.nodes[0]?.id, "hub");
  assert.equal(result.nodes[0]?.name, "Machine A");
  assert.deepEqual(result.nodes.map((node) => node.id), ["hub", "sat-b", "sat-c"]);
  assert.deepEqual(result.connections, [
    { sourceId: "hub", targetId: "sat-b" },
    { sourceId: "hub", targetId: "sat-c" },
  ]);
});

test("generateTopology(hub) returns positioned nodes and hub connections via registry", () => {
  const result = generateTopology("hub", buildOrderedNodes(9));
  assert.equal(result.topology, "hub");
  assert.equal(result.nodes.length, 9);
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  assert.equal(result.connections?.length, 8);
  assert.ok(Number.isFinite(result.generatedAt));
});

test("generateHubTopology omits connections for hub-only scene", () => {
  const result = generateHubTopology([{ id: "solo", name: "Solo Hub" }]);
  assert.equal(result.nodes.length, 1);
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  assert.equal(result.connections, undefined);
});
