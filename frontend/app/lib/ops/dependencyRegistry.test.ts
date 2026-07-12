import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import {
  ExecutiveDependencyRegistry,
  getDependencyEntityRegistry,
  getDependencyLifecycleRegistry,
  getDependencyRelationshipRegistry,
  getExecutiveDependencyRegistry,
} from "./dependencyRegistryIndex.ts";

test("entity registry", () => {
  const entities = getDependencyEntityRegistry();
  assert.equal(Object.isFrozen(entities), true);
  assert.equal(entities.length, 5);
  assert.equal(entities[0]?.name, "Task");
});

test("relationship registry", () => {
  const relationships = getDependencyRelationshipRegistry();
  assert.equal(Object.isFrozen(relationships), true);
  assert.equal(relationships.length, 9);
  assert.equal(
    relationships.some((relationship) => relationship.type === "dependsOn"),
    true,
  );
});

test("lifecycle registry", () => {
  const lifecycle = getDependencyLifecycleRegistry();
  assert.equal(Object.isFrozen(lifecycle), true);
  assert.equal(lifecycle.length, 4);
  assert.equal(lifecycle[1]?.id, "active");
});

test("registry metadata", () => {
  assert.equal(ExecutiveDependencyRegistry.metadata.supportedEntityCount, 5);
  assert.equal(
    ExecutiveDependencyRegistry.metadata.supportedRelationshipCount,
    9,
  );
  assert.equal(ExecutiveDependencyRegistry.metadata.supportedLifecycleCount, 4);
  assert.equal(ExecutiveDependencyRegistry.summary.status, "PASS");
});

test("namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyRegistry), true);
  assert.ok("entities" in ExecutiveDependencyRegistry);
  assert.ok("relationships" in ExecutiveDependencyRegistry);
  assert.ok("lifecycle" in ExecutiveDependencyRegistry);
  assert.ok("metadata" in ExecutiveDependencyRegistry);
});

test("helper APIs", () => {
  assert.deepEqual(getExecutiveDependencyRegistry(), ExecutiveDependencyRegistry);
  assert.deepEqual(
    getExecutiveDependencyRegistry().entities,
    getDependencyEntityRegistry(),
  );
  assert.deepEqual(
    getExecutiveDependencyRegistry().relationships,
    getDependencyRelationshipRegistry(),
  );
  assert.deepEqual(
    getExecutiveDependencyRegistry().lifecycle,
    getDependencyLifecycleRegistry(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveDependencyRegistry()), true);
  assert.equal(
    Object.isFrozen(getExecutiveDependencyRegistry().metadata),
    true,
  );
});

test("deterministic output", () => {
  assert.deepEqual(
    getExecutiveDependencyRegistry(),
    getExecutiveDependencyRegistry(),
  );
  assert.deepEqual(
    getDependencyEntityRegistry(),
    getDependencyEntityRegistry(),
  );
  assert.deepEqual(
    getDependencyRelationshipRegistry(),
    getDependencyRelationshipRegistry(),
  );
  assert.deepEqual(
    getDependencyLifecycleRegistry(),
    getDependencyLifecycleRegistry(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveDependencyRegistry.metadata.metadataOnly, true);
  assert.equal(ExecutiveDependencyRegistry.immutable, true);
  assert.equal(
    ExecutiveDependencyIntelligenceFoundation.contracts.graph.platformMetadata.platformId,
    "OPS-7:1",
  );
});
