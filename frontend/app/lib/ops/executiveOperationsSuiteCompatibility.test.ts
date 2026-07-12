import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveOperationsSuiteCompatibilityIndex.ts";
import { ExecutiveOperationsSuiteCompatibility, ExecutiveOperationsSuiteCompatibilityManifest, ExecutiveOperationsSuiteCompatibilityMatrix, ExecutiveOperationsSuiteCompatibilityMetadata, ExecutiveOperationsSuiteCompatibilityNamespace, ExecutiveOperationsSuiteCompatibilityRegistry, ExecutiveOperationsSuiteRegressionInventory, getExecutiveOperationsSuiteCompatibility, getExecutiveOperationsSuiteCompatibilityEntryById, getExecutiveOperationsSuiteCompatibilityManifest, getExecutiveOperationsSuiteCompatibilityMatrix, getExecutiveOperationsSuiteCompatibilityMetadata, getExecutiveOperationsSuiteCompatibilityRegistry, getExecutiveOperationsSuiteRegressionSummary } from "./executiveOperationsSuiteCompatibilityIndex.ts";

test("compatibility object contains exactly five immutable sections", () => {
  assert.ok(ExecutiveOperationsSuiteCompatibility);
  assert.deepEqual(Object.keys(ExecutiveOperationsSuiteCompatibility), ["metadata", "registry", "matrix", "manifest", "summary"]);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteCompatibility), true);
  assert.equal(Object.values(ExecutiveOperationsSuiteCompatibility).every(Object.isFrozen), true);
});
test("compatibility registry and regression inventory are complete and unique", () => {
  assert.equal(ExecutiveOperationsSuiteCompatibilityRegistry.length, 10);
  assert.equal(ExecutiveOperationsSuiteRegressionInventory.length >= 12, true);
  assert.equal(new Set(ExecutiveOperationsSuiteCompatibilityRegistry.map((entry) => entry.id)).size, ExecutiveOperationsSuiteCompatibilityRegistry.length);
  assert.equal(new Set(ExecutiveOperationsSuiteRegressionInventory.map((entry) => entry.id)).size, ExecutiveOperationsSuiteRegressionInventory.length);
  assert.equal(ExecutiveOperationsSuiteCompatibilityRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveOperationsSuiteRegressionInventory.every(Object.isFrozen), true);
});
test("compatibility matrix is immutable and canonically ordered", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteCompatibilityMatrix), true);
  assert.equal(ExecutiveOperationsSuiteCompatibilityMatrix.length, 9);
  assert.deepEqual(ExecutiveOperationsSuiteCompatibilityMatrix.map((entry) => entry.order), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(ExecutiveOperationsSuiteCompatibilityMatrix[0] && [ExecutiveOperationsSuiteCompatibilityMatrix[0].source, ExecutiveOperationsSuiteCompatibilityMatrix[0].target], ["OPS-1", "OPS-2"]);
  assert.deepEqual(ExecutiveOperationsSuiteCompatibilityMatrix[8] && [ExecutiveOperationsSuiteCompatibilityMatrix[8].source, ExecutiveOperationsSuiteCompatibilityMatrix[8].target], ["OPS Suite", "Public API"]);
});
test("manifest, metadata, and derived summaries are consistent", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteCompatibilityManifest), true);
  assert.equal(ExecutiveOperationsSuiteCompatibilityMetadata.namespace, ExecutiveOperationsSuiteCompatibilityNamespace);
  assert.equal(ExecutiveOperationsSuiteCompatibilityMetadata.compatibilityEntryCount, ExecutiveOperationsSuiteCompatibilityRegistry.length);
  assert.equal(getExecutiveOperationsSuiteRegressionSummary().regressionEntryCount, ExecutiveOperationsSuiteRegressionInventory.length);
  assert.equal(ExecutiveOperationsSuiteCompatibility.summary.nextPhase, "OPS-10:8");
});
test("exact lookup returns compatibility metadata or undefined", () => {
  assert.equal(getExecutiveOperationsSuiteCompatibilityEntryById("suite-compat-platform")?.category, "Platform");
  assert.equal(getExecutiveOperationsSuiteCompatibilityEntryById("SUITE-COMPAT-PLATFORM"), undefined);
  assert.equal(getExecutiveOperationsSuiteCompatibilityEntryById("unknown"), undefined);
});
test("helper APIs return canonical frozen deterministic objects", () => {
  assert.equal(getExecutiveOperationsSuiteCompatibility(), ExecutiveOperationsSuiteCompatibility);
  assert.equal(getExecutiveOperationsSuiteCompatibilityRegistry(), ExecutiveOperationsSuiteCompatibilityRegistry);
  assert.equal(getExecutiveOperationsSuiteCompatibilityMatrix(), ExecutiveOperationsSuiteCompatibilityMatrix);
  assert.equal(getExecutiveOperationsSuiteCompatibilityManifest(), ExecutiveOperationsSuiteCompatibilityManifest);
  assert.equal(getExecutiveOperationsSuiteCompatibilityMetadata(), ExecutiveOperationsSuiteCompatibilityMetadata);
  assert.deepEqual(getExecutiveOperationsSuiteCompatibility(), getExecutiveOperationsSuiteCompatibility());
});
test("public API is stable without compatibility or regression execution", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveOperationsSuiteCompatibility", "ExecutiveOperationsSuiteCompatibilityRegistry", "ExecutiveOperationsSuiteCompatibilityMatrix", "ExecutiveOperationsSuiteRegressionInventory"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /^(runCompatibility|executeRegression|runRegression|repairCompatibility|upgradeCompatibility|registerCompatibility)$/.test(key)), false);
  assert.equal(keys.some((key) => /internal|test|builder/i.test(key)), false);
});
