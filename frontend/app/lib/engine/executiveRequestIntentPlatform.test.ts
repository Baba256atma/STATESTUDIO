import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentPlatformIndex.ts";
import { ExecutiveRequestIntentPlatform, ExecutiveRequestIntentPlatformMetadata, ExecutiveRequestIntentPlatformRegistry, getExecutiveRequestIntentPlatform, getExecutiveRequestIntentPlatformMetadata, getExecutiveRequestIntentPlatformRegistry, getExecutiveRequestIntentPlatformSummary } from "./executiveRequestIntentPlatformIndex.ts";

test("canonical platform contains exactly five immutable namespace sections", () => {
  assert.deepEqual(Object.keys(ExecutiveRequestIntentPlatform), ["foundation", "registry", "model", "validation", "manifest"]);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatform), true);
  assert.equal(Object.values(ExecutiveRequestIntentPlatform).every(Object.isFrozen), true);
});

test("platform registry completely describes approved public-index dependencies", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformRegistry), true);
  assert.equal(ExecutiveRequestIntentPlatformRegistry.length, 5);
  assert.equal(ExecutiveRequestIntentPlatformRegistry.every(Object.isFrozen), true);
  assert.deepEqual(ExecutiveRequestIntentPlatformRegistry.map(({ phase }) => phase), ["ENG-2:1", "ENG-2:2", "ENG-2:3", "ENG-2:4", "ENG-2:5"]);
  assert.equal(ExecutiveRequestIntentPlatformRegistry.every(({ publicIndexReference }) => publicIndexReference.endsWith("Index.ts")), true);
});

test("platform metadata preserves namespace and ownership boundaries", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformMetadata), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformMetadata.ownershipPolicy), true);
  assert.equal(ExecutiveRequestIntentPlatformMetadata.namespace, "nexora.engine.executive.request-intent.platform");
  assert.equal(ExecutiveRequestIntentPlatformMetadata.owner, "ENG-2");
  assert.equal(ExecutiveRequestIntentPlatformMetadata.ownershipPolicy.eng1OwnershipPreserved, true);
  assert.equal(ExecutiveRequestIntentPlatformMetadata.ownershipPolicy.dependencyPolicy, "PublicIndicesOnly");
});

test("helpers return deterministic canonical immutable metadata", () => {
  assert.equal(getExecutiveRequestIntentPlatform(), ExecutiveRequestIntentPlatform);
  assert.equal(getExecutiveRequestIntentPlatformRegistry(), ExecutiveRequestIntentPlatformRegistry);
  assert.equal(getExecutiveRequestIntentPlatformMetadata(), ExecutiveRequestIntentPlatformMetadata);
  assert.equal(getExecutiveRequestIntentPlatformSummary(), getExecutiveRequestIntentPlatformSummary());
  assert.equal(Object.isFrozen(getExecutiveRequestIntentPlatformSummary()), true);
});

test("platform summary reports complete collision-safe aggregation", () => {
  const summary = getExecutiveRequestIntentPlatformSummary();
  assert.equal(summary.componentCount, 5);
  assert.equal(summary.namespaceSectionCount, 5);
  assert.equal(summary.publicDependencyCount, 5);
  assert.equal(summary.ownershipStatus, "Preserved");
  assert.equal(summary.collisionStatus, "CollisionSafe");
});

test("public API exposes exactly seven approved symbols", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestIntentPlatform", "ExecutiveRequestIntentPlatformRegistry",
    "ExecutiveRequestIntentPlatformMetadata", "getExecutiveRequestIntentPlatform",
    "getExecutiveRequestIntentPlatformRegistry", "getExecutiveRequestIntentPlatformMetadata",
    "getExecutiveRequestIntentPlatformSummary",
  ].sort());
});
