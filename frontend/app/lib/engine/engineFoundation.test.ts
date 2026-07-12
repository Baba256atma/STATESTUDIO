import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./engineIndex.ts";
import { ExecutiveEngineContracts, ExecutiveEngineFoundation, ExecutiveEngineMetadata, ExecutiveEngineRegistry, getExecutiveEngineFoundation, getExecutiveEngineMetadata } from "./engineIndex.ts";

test("foundation publishes contracts, registry, and metadata", () => {
  assert.ok(ExecutiveEngineFoundation);
  assert.equal(ExecutiveEngineFoundation.contracts, ExecutiveEngineContracts);
  assert.equal(ExecutiveEngineFoundation.registry, ExecutiveEngineRegistry);
  assert.equal(ExecutiveEngineFoundation.metadata, ExecutiveEngineMetadata);
  assert.equal(ExecutiveEngineContracts.length, 8);
});

test("all foundation exports and nested metadata are frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveEngineFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveEngineContracts), true);
  assert.equal(ExecutiveEngineContracts.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(ExecutiveEngineRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveEngineMetadata), true);
  assert.equal(Object.isFrozen(ExecutiveEngineMetadata.responsibilities), true);
  assert.equal(Object.isFrozen(ExecutiveEngineMetadata.publicDependencies), true);
  assert.equal(Object.isFrozen(ExecutiveEngineMetadata.boundaries), true);
  assert.equal(Object.isFrozen(ExecutiveEngineMetadata.releaseMetadata), true);
});

test("contract identifiers and responsibilities are unique", () => {
  assert.equal(new Set(ExecutiveEngineContracts.map((contract) => contract.id)).size, ExecutiveEngineContracts.length);
  assert.equal(new Set(ExecutiveEngineContracts.map((contract) => contract.responsibility)).size, ExecutiveEngineContracts.length);
});

test("helpers return canonical deterministic references", () => {
  assert.equal(getExecutiveEngineFoundation(), ExecutiveEngineFoundation);
  assert.equal(getExecutiveEngineMetadata(), ExecutiveEngineMetadata);
  assert.deepEqual(getExecutiveEngineFoundation(), getExecutiveEngineFoundation());
  assert.deepEqual(getExecutiveEngineMetadata(), getExecutiveEngineMetadata());
});

test("metadata describes public dependencies and runtime-free boundaries", () => {
  assert.deepEqual(ExecutiveEngineMetadata.publicDependencies, ["CORE", "CORE-TEN", "BUS", "OPS"]);
  assert.equal(ExecutiveEngineMetadata.metadataOnly, true);
  assert.equal(ExecutiveEngineMetadata.foundationStatus, "FoundationDefined");
  assert.equal(ExecutiveEngineMetadata.boundaries.includes("No orchestration execution"), true);
  assert.equal(ExecutiveEngineMetadata.releaseMetadata.nextPhase, "ENG-1:2");
});

test("public API is exact and contains no runtime services", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveEngineContracts", "ExecutiveEngineFoundation", "ExecutiveEngineMetadata",
    "ExecutiveEngineRegistry", "getExecutiveEngineFoundation", "getExecutiveEngineMetadata",
  ].sort());
  assert.deepEqual([...ExecutiveEngineMetadata.publicApiSurface].sort(), Object.keys(publicApi).sort());
  assert.equal(Object.keys(publicApi).some((key) => /reason|plan|orchestrat|execute|route|runtime|service/i.test(key)), false);
});
