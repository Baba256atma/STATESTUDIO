import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentPublicIndex.ts";
import { ExecutiveRequestIntentPlatformPublicFoundation, ExecutiveRequestIntentPublicApiRegistry, ExecutiveRequestIntentPublicIndexStatus, getExecutiveRequestIntentPublicApiRegistry, getExecutiveRequestIntentPublicFoundation, getExecutiveRequestIntentPublicMetadata, getExecutiveRequestIntentReleaseSummary } from "./executiveRequestIntentPublicIndex.ts";

test("public foundation contains exactly nine immutable sections in canonical order", () => {
  assert.deepEqual(Object.keys(ExecutiveRequestIntentPlatformPublicFoundation), [
    "foundation", "registry", "model", "validation", "manifest",
    "platform", "certification", "freeze", "publicIndex",
  ]);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformPublicFoundation), true);
  assert.equal(Object.values(ExecutiveRequestIntentPlatformPublicFoundation).every(Object.isFrozen), true);
});

test("public metadata is complete, immutable, and release-ready", () => {
  const metadata = getExecutiveRequestIntentPublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(metadata.status), true);
  assert.equal(metadata.publicIndexId, "ENG-2:9");
  assert.equal(metadata.namespace, "nexora.engine.executive.request-intent.public");
  assert.equal(metadata.owner, "ENG-2");
  assert.equal(ExecutiveRequestIntentPublicIndexStatus.releaseStatus, "Released");
  assert.equal(ExecutiveRequestIntentPublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveRequestIntentPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveRequestIntentPublicIndexStatus.publicApiStatus, "Stable");
});

test("public API registry completely describes 76 stable unique APIs", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPublicApiRegistry), true);
  assert.equal(ExecutiveRequestIntentPublicApiRegistry.length, 76);
  assert.equal(ExecutiveRequestIntentPublicApiRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveRequestIntentPublicApiRegistry.map(({ apiIdentifier }) => apiIdentifier)).size, 76);
  assert.equal(ExecutiveRequestIntentPublicApiRegistry.every(({ stability, visibility, releaseStatus }) => stability === "Stable" && visibility === "Public" && releaseStatus === "Released"), true);
});

test("duplicate compatibility helper names remain phase-owned and collision-safe", () => {
  const compatibilityHelpers = ExecutiveRequestIntentPublicApiRegistry.filter(({ exportName }) => exportName === "getExecutiveRequestIntentCompatibilitySummary");
  assert.deepEqual(compatibilityHelpers.map(({ ownerPhase }) => ownerPhase), ["ENG-2:7", "ENG-2:8"]);
  assert.equal(new Set(compatibilityHelpers.map(({ namespace }) => namespace)).size, 2);
});

test("helpers return deterministic canonical immutable references", () => {
  assert.equal(getExecutiveRequestIntentPublicFoundation(), ExecutiveRequestIntentPlatformPublicFoundation);
  assert.equal(getExecutiveRequestIntentPublicApiRegistry(), ExecutiveRequestIntentPublicApiRegistry);
  assert.equal(getExecutiveRequestIntentPublicMetadata(), getExecutiveRequestIntentPublicMetadata());
  assert.equal(getExecutiveRequestIntentReleaseSummary(), getExecutiveRequestIntentReleaseSummary());
  assert.equal(Object.isFrozen(getExecutiveRequestIntentReleaseSummary()), true);
});

test("release summary preserves ownership, collision, and dependency policies", () => {
  const summary = getExecutiveRequestIntentReleaseSummary();
  assert.equal(summary.completedPhaseCount, 8);
  assert.equal(summary.namespaceSectionCount, 9);
  assert.equal(summary.totalPublicApiCount, 76);
  assert.equal(summary.ownershipStatus, "Protected");
  assert.equal(summary.collisionStatus, "CollisionSafe");
  assert.equal(summary.dependencyPolicy, "PublicIndicesOnly");
});

test("public module exposes exactly twelve approved APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestIntentPlatformPublicFoundation", "ExecutiveRequestIntentPublicApiRegistry",
    "ExecutiveRequestIntentPublicIndexId", "ExecutiveRequestIntentPublicIndexVersion",
    "ExecutiveRequestIntentPublicIndexName", "ExecutiveRequestIntentPublicIndexDescription",
    "ExecutiveRequestIntentPublicIndexNamespace", "ExecutiveRequestIntentPublicIndexStatus",
    "getExecutiveRequestIntentPublicFoundation", "getExecutiveRequestIntentPublicMetadata",
    "getExecutiveRequestIntentPublicApiRegistry", "getExecutiveRequestIntentReleaseSummary",
  ].sort());
});
