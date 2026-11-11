import assert from "node:assert/strict";
import { test } from "node:test";
import { analyzeCanonicalTopology, projectCanonicalTopology } from "./canonicalTopologyEngine.ts";
import {
  canonicalTopologyStatusLabel,
  describeTopologyMembership,
  mergePresentationPositions,
  topologyPresentationSelectable,
} from "./canonicalTopologyPresentation.ts";

const workspaceId = "company-a";

function edge(id: string, source: string, target: string, type = "DEPENDS_ON") {
  return {
    relationshipId: id,
    workspaceId,
    sourceObjectId: source,
    targetObjectId: target,
    relationshipType: type,
    direction: "DIRECTED" as const,
    status: "ACTIVE" as const,
    provenance: { origin: "MANAGER_DECLARED" },
  };
}

test("status labels stay honest and Bus is not selectable", () => {
  assert.equal(canonicalTopologyStatusLabel("MATCH"), "Detected");
  assert.equal(canonicalTopologyStatusLabel("PARTIAL_MATCH"), "Partially matched");
  assert.equal(canonicalTopologyStatusLabel("NO_MATCH"), "Not detected");
  assert.equal(canonicalTopologyStatusLabel("INSUFFICIENT_DATA"), "Insufficient data");
  assert.equal(canonicalTopologyStatusLabel("UNSUPPORTED_SEMANTICS"), "Unsupported semantics");
  assert.equal(topologyPresentationSelectable("STAR", "MATCH"), true);
  assert.equal(topologyPresentationSelectable("STAR", "NO_MATCH"), false);
  assert.equal(topologyPresentationSelectable("BUS", "UNSUPPORTED_SEMANTICS"), false);
});

test("a dependency star reports a peripheral role without a hierarchy claim", () => {
  const analysis = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c"],
    relationships: [edge("e1", "a", "b"), edge("e2", "a", "c")],
  });
  const role = describeTopologyMembership({
    analysis,
    objectId: "b",
    selectedType: "STAR",
    hierarchy: false,
  });
  assert.equal(role.presentation, "STAR");
  assert.equal(role.role, "peripheral");
  assert.equal(role.hierarchyClaim, false);
  assert.equal(describeTopologyMembership({
    analysis,
    objectId: "b",
    selectedType: null,
    hierarchy: false,
  }).role, "unclassified");
  assert.equal(projectCanonicalTopology({ analysis, topologyType: "BUS" }), null);
});

test("manual positions survive a proposed layout and an explicit apply replaces them", () => {
  const preserved = mergePresentationPositions({
    current: { a: { x: 1, y: 1 }, b: { x: 0, y: 0 } },
    manualIds: ["a"],
    proposed: { a: { x: 3, y: 3 }, c: { x: 2, y: 2 } },
    action: "preserve",
  });
  assert.deepEqual(preserved.positions.a, { x: 1, y: 1 });
  assert.deepEqual(preserved.positions.c, { x: 2, y: 2 });
  assert.deepEqual(preserved.manualIds, ["a"]);
  const applied = mergePresentationPositions({
    current: preserved.positions,
    manualIds: preserved.manualIds,
    proposed: { a: { x: 0, y: 0 }, b: { x: 9, y: 0 } },
    action: "apply",
  });
  assert.deepEqual(applied.positions.a, { x: 0, y: 0 });
  assert.equal(applied.positions.b, undefined);
  assert.deepEqual(applied.manualIds, []);
  const rejected = mergePresentationPositions({
    current: {},
    manualIds: [],
    proposed: { a: { x: 40, y: 0 } },
    action: "apply",
  });
  assert.equal(rejected.positions.a, undefined);
});
