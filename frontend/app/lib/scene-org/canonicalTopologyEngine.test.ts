import assert from "node:assert/strict";
import { test } from "node:test";
import { createSceneOrgSavedScene } from "./sceneOrgWorkspacePlacementContract.ts";
import { parseSceneOrgSavedScenes, serializeSceneOrgSavedScenes } from "./sceneOrgSavedSceneDurability.ts";
import {
  analyzeCanonicalTopology,
  canonicalTopologySupport,
  projectCanonicalTopology,
  type CanonicalTopologyCandidate,
} from "./canonicalTopologyEngine.ts";

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
    provenance: { origin: "MANAGER_DECLARED" as const },
  };
}

function status(analysis: ReturnType<typeof analyzeCanonicalTopology>, type: string, hierarchy = false): CanonicalTopologyCandidate | undefined {
  return analysis.candidates.find((candidate) => candidate.topologyType === type && candidate.hierarchy === hierarchy);
}

test("star recognition keeps canonical edges and reports two-node ambiguity", () => {
  const nodes = ["a", "b", "c", "d"];
  const relationships = [edge("e1", "a", "b"), edge("e2", "a", "c"), edge("e3", "a", "d")];
  const analysis = analyzeCanonicalTopology({ workspaceId, deckId: "production", nodeIds: nodes, relationships });
  const star = status(analysis, "STAR");
  assert.equal(star?.structuralStatus, "MATCH");
  assert.equal(star?.centerNodeId, "a");
  assert.deepEqual(star?.relationshipIds, ["e1", "e2", "e3"]);
  assert.equal(analysis.syntheticCanonicalEdges, false);
  assert.equal(status(analysis, "TREE")?.structuralStatus, "MATCH");
  assert.equal(analysis.recommendedPresentation, null);
  const extra = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: nodes,
    relationships: [...relationships, edge("e4", "b", "c")],
  });
  assert.equal(status(extra, "STAR")?.structuralStatus, "NO_MATCH");
  const pair = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b"],
    relationships: [edge("e1", "a", "b")],
  });
  assert.equal(status(pair, "STAR")?.structuralStatus, "PARTIAL_MATCH");
  assert.deepEqual(status(pair, "STAR")?.centerCandidates, ["a", "b"]);
  const projected = projectCanonicalTopology({ analysis, topologyType: "STAR" });
  assert.equal(projected?.positions.a?.x, 0);
  assert.equal(projected?.positions.b?.z, 0);
  assert.ok(Math.abs(projected?.positions.b?.x ?? 9) <= 4);
});

test("ring recognition requires a canonical cycle and ignores a circle without edges", () => {
  const nodes = ["a", "b", "c"];
  const cycle = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: nodes,
    relationships: [edge("e1", "a", "b"), edge("e2", "b", "c"), edge("e3", "c", "a")],
  });
  assert.equal(status(cycle, "RING")?.structuralStatus, "MATCH");
  assert.deepEqual(status(cycle, "RING")?.relationshipIds, ["e1", "e2", "e3"]);
  assert.match(status(cycle, "RING")?.directionHandling ?? "", /directed cycle/);
  const broken = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: nodes,
    relationships: [edge("e1", "a", "b"), edge("e2", "b", "c")],
  });
  assert.equal(status(broken, "RING")?.structuralStatus, "NO_MATCH");
  const empty = analyzeCanonicalTopology({ workspaceId, deckId: "production", nodeIds: nodes, relationships: [] });
  assert.equal(status(empty, "RING")?.structuralStatus, "INSUFFICIENT_DATA");
  const disconnected = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c", "d"],
    relationships: [edge("e1", "a", "b"), edge("e2", "b", "c"), edge("e3", "c", "a")],
  });
  assert.equal(status(disconnected, "RING")?.structuralStatus, "NO_MATCH");
});

test("mesh recognition distinguishes full connectivity from a tree", () => {
  const full = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c"],
    relationships: [edge("e1", "a", "b"), edge("e2", "b", "c"), edge("e3", "c", "a")],
  });
  assert.equal(status(full, "MESH")?.structuralStatus, "MATCH");
  assert.equal(status(full, "MESH")?.meshKind, "FULL");
  const partial = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c", "d"],
    relationships: [edge("e1", "a", "b"), edge("e2", "b", "c"), edge("e3", "c", "a"), edge("e4", "a", "d"), edge("e5", "b", "d")],
  });
  assert.equal(status(partial, "MESH")?.meshKind, "PARTIAL");
  const tree = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c"],
    relationships: [edge("e1", "a", "b"), edge("e2", "a", "c")],
  });
  assert.equal(status(tree, "MESH")?.structuralStatus, "NO_MATCH");
  const disconnected = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c", "d"],
    relationships: [edge("e1", "a", "b"), edge("e2", "c", "d")],
  });
  assert.equal(status(disconnected, "MESH")?.structuralStatus, "NO_MATCH");
});

test("bus stays unsupported and a path is not classified as a bus", () => {
  assert.equal(canonicalTopologySupport().bus, "UNSUPPORTED_SEMANTICS");
  const path = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c", "d"],
    relationships: [edge("e1", "a", "b"), edge("e2", "b", "c"), edge("e3", "c", "d")],
  });
  assert.equal(status(path, "BUS")?.structuralStatus, "UNSUPPORTED_SEMANTICS");
  assert.equal(path.busStatus, "UNSUPPORTED_SEMANTICS");
  assert.equal(projectCanonicalTopology({ analysis: path, topologyType: "BUS" }), null);
  assert.equal(status(path, "TREE")?.structuralStatus, "MATCH");
});

test("tree recognition separates dependency structure from organizational hierarchy", () => {
  const dependency = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c"],
    relationships: [edge("e1", "b", "a", "DEPENDS_ON"), edge("e2", "c", "a", "DEPENDS_ON")],
  });
  assert.equal(status(dependency, "TREE", false)?.structuralStatus, "MATCH");
  assert.equal(status(dependency, "TREE", true)?.structuralStatus, "NO_MATCH");
  const hierarchy = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c"],
    relationships: [edge("e1", "b", "a", "REPORTS_TO"), edge("e2", "c", "b", "REPORTS_TO")],
  });
  assert.equal(status(hierarchy, "TREE", true)?.structuralStatus, "MATCH");
  assert.deepEqual(status(hierarchy, "TREE", true)?.rootNodeIds, ["a"]);
  const forest = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c", "d"],
    relationships: [edge("e1", "b", "a", "REPORTS_TO"), edge("e2", "d", "c", "REPORTS_TO")],
  });
  assert.equal(status(forest, "TREE", true)?.structuralStatus, "PARTIAL_MATCH");
  const cycle = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c"],
    relationships: [edge("e1", "a", "b", "DEPENDS_ON"), edge("e2", "b", "c", "DEPENDS_ON"), edge("e3", "c", "a", "DEPENDS_ON")],
  });
  assert.equal(status(cycle, "TREE", false)?.structuralStatus, "NO_MATCH");
});

test("hybrid requires two positive patterns and rejects a single star", () => {
  const hybrid = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c", "d", "e"],
    relationships: [
      edge("e1", "a", "b"),
      edge("e2", "b", "c"),
      edge("e3", "c", "a"),
      edge("e4", "a", "d"),
      edge("e5", "a", "e"),
    ],
  });
  const found = status(hybrid, "HYBRID");
  assert.equal(found?.structuralStatus, "MATCH");
  assert.ok(found?.constituentPatterns.includes("RING"));
  assert.ok(found?.constituentPatterns.includes("STAR"));
  assert.deepEqual(found?.relationshipIds, ["e1", "e2", "e3", "e4", "e5"]);
  const star = analyzeCanonicalTopology({
    workspaceId,
    deckId: "production",
    nodeIds: ["a", "b", "c"],
    relationships: [edge("e1", "a", "b"), edge("e2", "a", "c")],
  });
  assert.equal(status(star, "HYBRID")?.structuralStatus, "INSUFFICIENT_DATA");
});

test("analysis excludes foreign, archived, and missing endpoints without inventing edges", () => {
  const analysis = analyzeCanonicalTopology({
    workspaceId,
    deckId: "finance",
    nodeIds: ["a", "b"],
    relationships: [
      edge("kept", "a", "b"),
      { ...edge("foreign", "a", "b"), workspaceId: "company-b" },
      { ...edge("archived", "a", "b"), status: "ARCHIVED" },
      edge("missing", "a", "gone"),
    ],
  });
  assert.deepEqual(analysis.inputRelationshipIds, ["kept"]);
  assert.equal(analysis.candidates.every((candidate) => candidate.relationshipIds.every((id) => id === "kept" || id === "")), true);
  assert.equal(analysis.workspaceId, workspaceId);
  assert.equal(analysis.deckId, "finance");
});

test("saved scenes store a topology presentation without a relationship graph", () => {
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-a",
    name: "Scene A",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: workspaceId,
    ownerDeckId: "production",
    canonicalReferences: [],
    layout: { presentationDepth: "minimum", leftRegion: "management", rightRegion: "contextual", detailWorkspace: "closed" },
    topologyPresentation: "STAR",
  });
  assert.equal(scene.topologyPresentation, "STAR");
  const raw = JSON.parse(serializeSceneOrgSavedScenes([scene]));
  assert.equal(JSON.stringify(raw).includes("relationshipId"), false);
  raw.scenes[0].topologyPresentation = "BUS";
  const parsed = parseSceneOrgSavedScenes(JSON.stringify(raw));
  assert.equal(parsed.scenes[0]?.topologyPresentation, undefined);
});

test("recognition stays bounded for a 100-node star", () => {
  const nodeIds = Array.from({ length: 100 }, (_, index) => `n${index}`);
  const relationships = nodeIds.slice(1).map((id, index) => edge(`e${index}`, "n0", id));
  const started = Date.now();
  const analysis = analyzeCanonicalTopology({ workspaceId, deckId: "production", nodeIds, relationships });
  assert.ok(Date.now() - started < 1000);
  assert.equal(status(analysis, "STAR")?.structuralStatus, "MATCH");
  assert.equal(status(analysis, "STAR")?.centerNodeId, "n0");
  const sizes = [0, 1, 2, 3, 8, 20, 50];
  for (const size of sizes) {
    const ids = Array.from({ length: size }, (_, index) => `s${index}`);
    const result = analyzeCanonicalTopology({
      workspaceId,
      deckId: "production",
      nodeIds: ids,
      relationships: ids.slice(1).map((id, index) => edge(`s${index}`, ids[0] ?? "s0", id)),
    });
    assert.equal(result.syntheticCanonicalEdges, false);
    assert.equal(result.candidates.length >= 6, true);
  }
});
