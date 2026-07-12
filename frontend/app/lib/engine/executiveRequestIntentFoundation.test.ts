import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentIndex.ts";
import { ExecutiveRequestIntentContracts, ExecutiveRequestIntentFoundation, ExecutiveRequestIntentMetadata, ExecutiveRequestIntentRegistry, getExecutiveRequestIntentFoundation, getExecutiveRequestIntentMetadata, getExecutiveRequestIntentRegistry } from "./executiveRequestIntentIndex.ts";

test("foundation aggregates the canonical request and intent metadata", () => {
  assert.equal(ExecutiveRequestIntentFoundation.contracts, ExecutiveRequestIntentContracts);
  assert.equal(ExecutiveRequestIntentFoundation.registry, ExecutiveRequestIntentRegistry);
  assert.equal(ExecutiveRequestIntentFoundation.metadata, ExecutiveRequestIntentMetadata);
  assert.equal(ExecutiveRequestIntentContracts.length, 7);
  assert.equal(ExecutiveRequestIntentRegistry.length, 10);
});

test("foundation exports and registry records are immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentContracts), true);
  assert.equal(ExecutiveRequestIntentContracts.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentRegistry), true);
  assert.equal(ExecutiveRequestIntentRegistry.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentMetadata), true);
});

test("registry and contract identifiers are unique", () => {
  assert.equal(new Set(ExecutiveRequestIntentRegistry.map(({ id }) => id)).size, ExecutiveRequestIntentRegistry.length);
  assert.equal(new Set(ExecutiveRequestIntentContracts.map(({ id }) => id)).size, ExecutiveRequestIntentContracts.length);
});

test("metadata identifies the ENG-2:1 architectural foundation", () => {
  assert.equal(ExecutiveRequestIntentMetadata.moduleId, "ENG-2:1");
  assert.equal(ExecutiveRequestIntentMetadata.namespace, "nexora.engine.executive.request-intent.foundation");
  assert.equal(ExecutiveRequestIntentMetadata.metadataOnly, true);
  assert.equal(ExecutiveRequestIntentMetadata.releaseStatus, "Draft");
});

test("helpers return deterministic canonical references", () => {
  assert.equal(getExecutiveRequestIntentFoundation(), ExecutiveRequestIntentFoundation);
  assert.equal(getExecutiveRequestIntentRegistry(), ExecutiveRequestIntentRegistry);
  assert.equal(getExecutiveRequestIntentMetadata(), ExecutiveRequestIntentMetadata);
  assert.deepEqual(getExecutiveRequestIntentFoundation(), getExecutiveRequestIntentFoundation());
});

test("public API is exact and stable", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestIntentFoundation", "ExecutiveRequestIntentContracts",
    "ExecutiveRequestIntentRegistry", "ExecutiveRequestIntentMetadata",
    "getExecutiveRequestIntentFoundation", "getExecutiveRequestIntentRegistry",
    "getExecutiveRequestIntentMetadata",
  ].sort());
});
