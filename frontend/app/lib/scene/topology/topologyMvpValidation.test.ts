/**
 * Prompt 5 — MVP validation suite for the Type-C scene topology system.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FLOW_NODE_SPACING,
  HUB_RADIUS,
  formatTopologySelectionReason,
  generateAutoTopology,
  generateTopology,
  getTopologyGenerator,
  selectTopology,
  topologyRegistry,
  type TopologyConnection,
  type TopologyNode,
  type TopologyResult,
  type TopologyType,
} from "./index.ts";
import { resetTopologyDevLogsForTests } from "./topologyDevLog.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

function buildNodes(count: number, prefix = "node"): TopologyNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    name: `Node ${index + 1}`,
  }));
}

function flowPosition(index: number) {
  return { x: index * FLOW_NODE_SPACING, y: 0, z: 0 };
}

function hubSatellitePosition(satelliteIndex: number, satelliteCount: number) {
  const angle = (Math.PI * 2 * satelliteIndex) / satelliteCount;
  return {
    x: Math.round(HUB_RADIUS * Math.cos(angle) * 1000) / 1000,
    y: 0,
    z: Math.round(HUB_RADIUS * Math.sin(angle) * 1000) / 1000,
  };
}

function assertFlowChain(result: TopologyResult, count: number): void {
  assert.equal(result.topology, "flow");
  assert.equal(result.nodes.length, count);
  for (let index = 0; index < count; index += 1) {
    assert.deepEqual(result.nodes[index]?.position, flowPosition(index));
  }
  if (count > 1) {
    assert.equal(result.connections?.length, count - 1);
    for (let index = 0; index < count - 1; index += 1) {
      assert.deepEqual(result.connections?.[index], {
        sourceId: result.nodes[index]!.id,
        targetId: result.nodes[index + 1]!.id,
      });
    }
  } else {
    assert.equal(result.connections, undefined);
  }
}

function assertHubLayout(result: TopologyResult, count: number): void {
  assert.equal(result.topology, "hub");
  assert.equal(result.nodes.length, count);
  if (count === 0) return;
  assert.deepEqual(result.nodes[0]?.position, { x: 0, y: 0, z: 0 });
  const satelliteCount = count - 1;
  for (let index = 0; index < satelliteCount; index += 1) {
    assert.deepEqual(result.nodes[index + 1]?.position, hubSatellitePosition(index, satelliteCount));
    assert.equal(result.connections?.[index]?.sourceId, result.nodes[0]?.id);
    assert.equal(result.connections?.[index]?.targetId, result.nodes[index + 1]?.id);
  }
}

test.beforeEach(() => {
  resetTopologyDevLogsForTests();
});

test("Group 1 — foundation exports and canonical routing", () => {
  const exportedTypes: TopologyType[] = ["flow", "hub", "ring", "cluster", "hybrid", "auto"];
  for (const topology of exportedTypes) {
    assert.doesNotThrow(() => generateTopology(topology, []));
  }
  assert.equal(typeof generateTopology, "function");
  assert.equal(typeof getTopologyGenerator, "function");
  assert.ok(topologyRegistry.flow);
  assert.ok(topologyRegistry.hub);
  assert.equal(Object.keys(topologyRegistry).length, 5);
});

test("Group 2 — flow topology layout and connections", () => {
  for (const count of [2, 3, 5, 12] as const) {
    const result = generateTopology("flow", buildNodes(count));
    assertFlowChain(result, count);
  }
  const ordered = [
    { id: "a", name: "Machine A" },
    { id: "b", name: "Machine B" },
    { id: "c", name: "Machine C" },
  ];
  const result = generateTopology("flow", ordered);
  assert.deepEqual(result.nodes.map((node) => node.name), ["Machine A", "Machine B", "Machine C"]);
});

test("Group 3 — hub topology layout and connections", () => {
  assertHubLayout(generateTopology("hub", []), 0);
  assertHubLayout(generateTopology("hub", buildNodes(1)), 1);
  assertHubLayout(generateTopology("hub", buildNodes(2)), 2);
  assertHubLayout(generateTopology("hub", buildNodes(5)), 5);
  assertHubLayout(generateTopology("hub", buildNodes(12)), 12);
});

test("Group 4 — auto selection matrix", () => {
  const matrix: Array<{ count: number; expected: "flow" | "hub" }> = [
    { count: 0, expected: "flow" },
    { count: 1, expected: "hub" },
    { count: 2, expected: "flow" },
    { count: 3, expected: "flow" },
    { count: 4, expected: "flow" },
    { count: 5, expected: "hub" },
    { count: 8, expected: "hub" },
    { count: 12, expected: "hub" },
  ];

  for (const entry of matrix) {
    assert.equal(selectTopology(buildNodes(entry.count)), entry.expected);
    const result = generateTopology("auto", buildNodes(entry.count));
    assert.equal(result.topology, entry.expected);
    assert.equal(result.autoSelected, true);
    assert.equal(
      result.selectionReason,
      formatTopologySelectionReason(entry.count, entry.expected)
    );
  }
});

test("Group 5 — runtime safety for empty, undefined, and large scenes", () => {
  assert.doesNotThrow(() => generateTopology("auto", []));
  assert.doesNotThrow(() => generateTopology("flow", undefined));
  assert.doesNotThrow(() => generateTopology("hub", null));
  assert.doesNotThrow(() => generateAutoTopology(undefined as unknown as TopologyNode[]));

  const empty = generateTopology("auto", undefined);
  assert.equal(empty.topology, "flow");
  assert.equal(empty.nodes.length, 0);

  const large = generateTopology("auto", buildNodes(100));
  assert.equal(large.topology, "hub");
  assert.equal(large.nodes.length, 100);
  assert.equal(large.connections?.length, 99);
});

test("Group 6 — pure data layer (no Three.js / React scene coupling)", () => {
  const topologyFiles = [
    "topologyTypes.ts",
    "topologyEngine.ts",
    "topologyRegistry.ts",
    "flowTopologyGenerator.ts",
    "hubTopologyGenerator.ts",
    "topologyAutoSelector.ts",
    "topologyDevLog.ts",
    "topologyAutoDevLog.ts",
    "flowTopologyDevLog.ts",
    "hubTopologyDevLog.ts",
    "index.ts",
  ];
  const forbidden = [
    "from \"three\"",
    "from 'three'",
    "@react-three",
    "meshstandardmaterial",
    "buffergeometry",
    "useframe",
  ];
  for (const file of topologyFiles) {
    const source = readFileSync(join(__dirname, file), "utf8").toLowerCase();
    for (const token of forbidden) {
      assert.equal(
        source.includes(token),
        false,
        `${file} must remain a pure data layer (found "${token}")`
      );
    }
  }
});

test("Group 7 — future topology types remain registry-extensible", () => {
  const future: Array<Exclude<TopologyType, "auto">> = ["ring", "cluster", "hybrid"];
  for (const topology of future) {
    const result = generateTopology(topology, buildNodes(3));
    assert.equal(result.topology, topology);
    assert.equal(result.nodes.length, 3);
    assert.ok(typeof result.generatedAt === "number");
  }
  const connectionShape: TopologyConnection = { sourceId: "a", targetId: "b" };
  assert.ok(connectionShape.sourceId);
});

test("Integration note — scene layout systems remain separate pending migration", () => {
  const compositionSource = readFileSync(
    join(__dirname, "../composition/normalizeExecutiveObjectLayout.ts"),
    "utf8"
  );
  assert.equal(
    compositionSource.includes("generateTopology"),
    false,
    "executive layout not yet wired to topology engine (documented migration target)"
  );
});
