import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveOperationsSuiteFreezeIndex.ts";
import { ExecutiveOperationsSuiteFreeze, ExecutiveOperationsSuiteFreezeManifest, ExecutiveOperationsSuiteFreezeMetadata, ExecutiveOperationsSuiteFreezeNamespace, ExecutiveOperationsSuiteFreezeRegistry, ExecutiveOperationsSuiteFreezeStatus, getExecutiveOperationsSuiteFreeze, getExecutiveOperationsSuiteFreezeEntryById, getExecutiveOperationsSuiteFreezeManifest, getExecutiveOperationsSuiteFreezeMetadata, getExecutiveOperationsSuiteFreezeRegistry, getExecutiveOperationsSuiteFreezeSummary } from "./executiveOperationsSuiteFreezeIndex.ts";

test("freeze namespace contains exactly four immutable sections", () => {
  assert.ok(ExecutiveOperationsSuiteFreeze);
  assert.deepEqual(Object.keys(ExecutiveOperationsSuiteFreeze), ["metadata", "registry", "manifest", "summary"]);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteFreeze), true);
  assert.equal(Object.values(ExecutiveOperationsSuiteFreeze).every(Object.isFrozen), true);
});
test("freeze registry contains twelve unique ordered immutable locks", () => {
  assert.equal(ExecutiveOperationsSuiteFreezeRegistry.length, 12);
  assert.equal(new Set(ExecutiveOperationsSuiteFreezeRegistry.map((entry) => entry.id)).size, 12);
  assert.equal(ExecutiveOperationsSuiteFreezeRegistry.every((entry) => Object.isFrozen(entry) && entry.locked && entry.status === "Locked"), true);
  assert.deepEqual(ExecutiveOperationsSuiteFreezeRegistry.map((entry) => entry.name), ["Foundation Lock", "Registry Lock", "Validation Lock", "Manifest Lock", "Platform Lock", "Certification Lock", "Compatibility Lock", "Regression Lock", "Public API Lock", "Namespace Lock", "Version Lock", "Release Lock"]);
});
test("manifest and nested snapshots are immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteFreezeManifest), true);
  for (const section of [ExecutiveOperationsSuiteFreezeManifest.freezePolicies, ExecutiveOperationsSuiteFreezeManifest.compatibilitySnapshot, ExecutiveOperationsSuiteFreezeManifest.regressionSnapshot, ExecutiveOperationsSuiteFreezeManifest.dependencySnapshot, ExecutiveOperationsSuiteFreezeManifest.releaseSnapshot, ExecutiveOperationsSuiteFreezeManifest.architecturalSnapshot]) assert.equal(Object.isFrozen(section), true);
});
test("metadata and summary counts are internally consistent", () => {
  const summary = getExecutiveOperationsSuiteFreezeSummary();
  assert.equal(ExecutiveOperationsSuiteFreezeMetadata.namespace, ExecutiveOperationsSuiteFreezeNamespace);
  assert.equal(ExecutiveOperationsSuiteFreezeStatus.releaseStatus, "Frozen");
  assert.equal(summary.lockCount, ExecutiveOperationsSuiteFreezeRegistry.length);
  assert.equal(summary.compatibilitySnapshotCount, ExecutiveOperationsSuiteFreezeManifest.compatibilitySnapshot.entryCount);
  assert.equal(summary.regressionSnapshotCount, ExecutiveOperationsSuiteFreezeManifest.regressionSnapshot.entryCount);
  assert.equal(summary.dependencySnapshotCount, ExecutiveOperationsSuiteFreezeManifest.dependencySnapshot.entryCount);
  assert.equal(summary.nextPhase, "OPS-10:9");
});
test("exact entry lookup returns locks or undefined", () => {
  assert.equal(getExecutiveOperationsSuiteFreezeEntryById("suite-freeze-release")?.name, "Release Lock");
  assert.equal(getExecutiveOperationsSuiteFreezeEntryById("SUITE-FREEZE-RELEASE"), undefined);
  assert.equal(getExecutiveOperationsSuiteFreezeEntryById("unknown"), undefined);
});
test("helper APIs return canonical frozen deterministic structures", () => {
  assert.equal(getExecutiveOperationsSuiteFreeze(), ExecutiveOperationsSuiteFreeze);
  assert.equal(getExecutiveOperationsSuiteFreezeRegistry(), ExecutiveOperationsSuiteFreezeRegistry);
  assert.equal(getExecutiveOperationsSuiteFreezeManifest(), ExecutiveOperationsSuiteFreezeManifest);
  assert.equal(getExecutiveOperationsSuiteFreezeMetadata(), ExecutiveOperationsSuiteFreezeMetadata);
  assert.equal(Object.isFrozen(getExecutiveOperationsSuiteFreezeSummary()), true);
  assert.deepEqual(getExecutiveOperationsSuiteFreeze(), getExecutiveOperationsSuiteFreeze());
});
test("public API is stable without runtime freeze or mutation functions", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveOperationsSuiteFreeze", "ExecutiveOperationsSuiteFreezeRegistry", "ExecutiveOperationsSuiteFreezeManifest", "getExecutiveOperationsSuiteFreezeEntryById"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /^(freezeSuite|lockRelease|executeFreeze|registerFreeze|updateFreeze|unlockSuite)$/.test(key)), false);
  assert.equal(keys.some((key) => /internal|test|builder/i.test(key)), false);
});
