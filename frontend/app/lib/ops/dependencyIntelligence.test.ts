import assert from "node:assert/strict";
import test from "node:test";

import {
  DependencyCompatibilityVersion,
  DependencyEdgeContract,
  DependencyGraphContract,
  DependencyIntelligenceContracts,
  DependencyIntelligenceMetadata,
  DependencyIntelligenceRegistry,
  DependencyNodeContract,
  ExecutiveDependencyIntelligenceFoundation,
  getExecutiveDependencyFoundation,
  getExecutiveDependencyMetadata,
} from "./dependencyIntelligenceIndex.ts";

test("contracts", () => {
  assert.equal(Object.isFrozen(DependencyIntelligenceContracts), true);
  assert.equal(DependencyNodeContract.id, "dependency-node-contract");
  assert.equal(DependencyEdgeContract.type, "Supporting");
  assert.equal(DependencyGraphContract.nodes.length, 1);
});

test("registry", () => {
  assert.equal(Object.isFrozen(DependencyIntelligenceRegistry), true);
  assert.equal(DependencyIntelligenceRegistry.platformId, "OPS-7:1");
  assert.equal(DependencyIntelligenceRegistry.registeredPhases.length, 1);
});

test("metadata", () => {
  assert.equal(Object.isFrozen(DependencyIntelligenceMetadata), true);
  assert.equal(DependencyCompatibilityVersion, "1.0.0");
  assert.equal(
    DependencyIntelligenceMetadata.supportedRelationshipDirections.length,
    3,
  );
  assert.equal(
    DependencyIntelligenceMetadata.supportedLifecycleStatuses.length,
    6,
  );
});

test("foundation namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyIntelligenceFoundation), true);
  assert.ok("contracts" in ExecutiveDependencyIntelligenceFoundation);
  assert.ok("registry" in ExecutiveDependencyIntelligenceFoundation);
  assert.ok("metadata" in ExecutiveDependencyIntelligenceFoundation);
  assert.ok("types" in ExecutiveDependencyIntelligenceFoundation);
});

test("helper APIs", () => {
  assert.deepEqual(
    getExecutiveDependencyFoundation(),
    ExecutiveDependencyIntelligenceFoundation,
  );
  assert.deepEqual(
    getExecutiveDependencyMetadata(),
    DependencyIntelligenceMetadata,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveDependencyFoundation()), true);
  assert.equal(Object.isFrozen(getExecutiveDependencyMetadata()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveDependencyFoundation(),
    getExecutiveDependencyFoundation(),
  );
  assert.deepEqual(
    getExecutiveDependencyMetadata(),
    getExecutiveDependencyMetadata(),
  );
});

test("public API surface", () => {
  assert.equal(ExecutiveDependencyIntelligenceFoundation.descriptor.contractCount, 3);
  assert.equal(
    ExecutiveDependencyIntelligenceFoundation.descriptor.registryStatus,
    "Complete",
  );
  assert.equal(ExecutiveDependencyIntelligenceFoundation.metadataOnly, true);
});
