import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveOperationsSuitePublicIndex.ts";
import { ExecutiveOperationsSuitePublicApiRegistry, ExecutiveOperationsSuitePublicFoundation, ExecutiveOperationsSuitePublicIndexNamespace, ExecutiveOperationsSuitePublicIndexStatus, getExecutiveOperationsSuitePublicApiRegistry, getExecutiveOperationsSuitePublicFoundation, getExecutiveOperationsSuitePublicMetadata, getExecutiveOperationsSuiteReleaseSummary } from "./executiveOperationsSuitePublicIndex.ts";

const sections = ["foundation", "registry", "validation", "manifest", "platform", "certification", "compatibility", "freeze", "publicIndex"];

test("public namespace contains exactly nine ordered immutable sections", () => {
  assert.ok(ExecutiveOperationsSuitePublicFoundation);
  assert.deepEqual(Object.keys(ExecutiveOperationsSuitePublicFoundation), sections);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePublicFoundation), true);
  assert.equal(Object.values(ExecutiveOperationsSuitePublicFoundation).every(Object.isFrozen), true);
});
test("public metadata marks the suite released and frozen", () => {
  const metadata = getExecutiveOperationsSuitePublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(metadata.namespace, ExecutiveOperationsSuitePublicIndexNamespace);
  assert.equal(ExecutiveOperationsSuitePublicIndexStatus.releaseStatus, "Released");
  assert.equal(ExecutiveOperationsSuitePublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveOperationsSuitePublicIndexStatus.publicApiStable, true);
});
test("public API registry inventories exactly the approved release surface", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePublicApiRegistry), true);
  assert.equal(ExecutiveOperationsSuitePublicApiRegistry.length, 12);
  assert.equal(ExecutiveOperationsSuitePublicApiRegistry.every((entry) => Object.isFrozen(entry) && entry.status === "Released" && entry.publicStability === "Stable"), true);
  assert.equal(new Set(ExecutiveOperationsSuitePublicApiRegistry.map((entry) => entry.exportName)).size, 12);
});
test("release summary is immutable, complete, and deterministic", () => {
  const summary = getExecutiveOperationsSuiteReleaseSummary();
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(summary.releaseState, "Released");
  assert.equal(summary.certificationState, "Locked");
  assert.equal(summary.compatibilityState, "Compatible");
  assert.equal(summary.freezeState, "Locked");
  assert.equal(summary.platformCount, 9);
  assert.equal(summary.phaseCount, 9);
  assert.equal(summary.publicApiCount, 12);
  assert.equal(summary.releaseReadiness, "ReadyForPublicIndex");
  assert.deepEqual(summary, getExecutiveOperationsSuiteReleaseSummary());
});
test("helpers return canonical frozen references", () => {
  assert.equal(getExecutiveOperationsSuitePublicFoundation(), ExecutiveOperationsSuitePublicFoundation);
  assert.equal(getExecutiveOperationsSuitePublicApiRegistry(), ExecutiveOperationsSuitePublicApiRegistry);
  assert.equal(Object.isFrozen(getExecutiveOperationsSuitePublicFoundation()), true);
  assert.equal(Object.isFrozen(getExecutiveOperationsSuitePublicMetadata()), true);
});
test("release sections reference official OPS-10:8 lock metadata", () => {
  for (const section of sections.slice(0, 7)) {
    const reference = ExecutiveOperationsSuitePublicFoundation[section as keyof typeof ExecutiveOperationsSuitePublicFoundation];
    assert.ok("lock" in reference);
    assert.equal(reference.lock?.status, "Locked");
  }
  assert.equal(ExecutiveOperationsSuitePublicFoundation.freeze.summary.releaseStatus, "Frozen");
});
test("public exports are exact and contain no internal or runtime APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveOperationsSuitePublicFoundation", "ExecutiveOperationsSuitePublicApiRegistry",
    "ExecutiveOperationsSuitePublicIndexId", "ExecutiveOperationsSuitePublicIndexName",
    "ExecutiveOperationsSuitePublicIndexDescription", "ExecutiveOperationsSuitePublicIndexVersion",
    "ExecutiveOperationsSuitePublicIndexNamespace", "ExecutiveOperationsSuitePublicIndexStatus",
    "getExecutiveOperationsSuitePublicFoundation", "getExecutiveOperationsSuitePublicMetadata",
    "getExecutiveOperationsSuitePublicApiRegistry", "getExecutiveOperationsSuiteReleaseSummary",
  ].sort());
  const keys = Object.keys(publicApi);
  assert.equal(keys.some((key) => /builder|internal|test|execute|run|register|update|remove|unlock|certify|validate/i.test(key)), false);
});
