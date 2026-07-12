import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import {
  ExecutiveDependencyRegistry,
} from "./dependencyRegistryIndex.ts";
import {
  ExecutiveDependencyModel,
  getDependencyGraphModel,
  getDependencyImpactModel,
  getExecutiveDependencyModel,
} from "./dependencyModelIndex.ts";

test("node model", () => {
  assert.equal(ExecutiveDependencyModel.nodes.length, 5);
  assert.equal(ExecutiveDependencyModel.nodes[0]?.entityType, "Task");
  assert.equal(ExecutiveDependencyModel.nodes[4]?.entityType, "Schedule");
});

test("edge model", () => {
  assert.equal(ExecutiveDependencyModel.edges.length, 4);
  assert.equal(
    ExecutiveDependencyModel.edges.some((edge) => edge.relationshipType === "requires"),
    true,
  );
});

test("graph model", () => {
  const graph = getDependencyGraphModel();
  assert.equal(graph.length, 1);
  assert.equal(graph[0]?.nodes.length, 5);
  assert.equal(graph[0]?.edges.length, 4);
});

test("impact model", () => {
  const impact = getDependencyImpactModel();
  assert.equal(impact.length, 7);
  assert.equal(impact[0]?.type, "direct-impact");
});

test("metadata", () => {
  assert.equal(ExecutiveDependencyModel.metadata.modelVersion, "1.0.0");
  assert.equal(ExecutiveDependencyModel.metadata.compatibilityVersion, "1.0.0");
  assert.equal(ExecutiveDependencyModel.summary.status, "PASS");
});

test("namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyModel), true);
  assert.ok("nodes" in ExecutiveDependencyModel);
  assert.ok("edges" in ExecutiveDependencyModel);
  assert.ok("graph" in ExecutiveDependencyModel);
  assert.ok("impact" in ExecutiveDependencyModel);
  assert.ok("metadata" in ExecutiveDependencyModel);
});

test("helper APIs", () => {
  assert.deepEqual(getExecutiveDependencyModel(), ExecutiveDependencyModel);
  assert.deepEqual(getExecutiveDependencyModel().graph, getDependencyGraphModel());
  assert.deepEqual(getExecutiveDependencyModel().impact, getDependencyImpactModel());
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveDependencyModel()), true);
  assert.equal(Object.isFrozen(getDependencyGraphModel()), true);
  assert.equal(Object.isFrozen(getDependencyImpactModel()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(getExecutiveDependencyModel(), getExecutiveDependencyModel());
  assert.deepEqual(getDependencyGraphModel(), getDependencyGraphModel());
  assert.deepEqual(getDependencyImpactModel(), getDependencyImpactModel());
});

test("public API stability", () => {
  assert.equal(ExecutiveDependencyModel.metadata.metadataOnly, true);
  assert.equal(ExecutiveDependencyModel.immutable, true);
  assert.equal(ExecutiveDependencyModel.graph[0]?.platformMetadata.platformId, "OPS-7:1");
  assert.equal(ExecutiveDependencyIntelligenceFoundation.registry.platformId, "OPS-7:1");
  assert.equal(ExecutiveDependencyRegistry.metadata.registryVersion, "1.0.0");
});
