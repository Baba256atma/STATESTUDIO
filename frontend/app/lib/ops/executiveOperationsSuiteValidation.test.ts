import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveOperationsSuiteValidationIndex.ts";
import { ExecutiveOperationsSuiteValidation, ExecutiveOperationsSuiteValidationCategories, ExecutiveOperationsSuiteValidationManifest, ExecutiveOperationsSuiteValidationMetadata, ExecutiveOperationsSuiteValidationRegistry, ExecutiveOperationsSuiteValidationSeverities, ExecutiveOperationsSuiteValidationStatus, getExecutiveOperationsSuiteValidation, getExecutiveOperationsSuiteValidationManifest, getExecutiveOperationsSuiteValidationMetadata, getExecutiveOperationsSuiteValidationRegistry, getExecutiveOperationsSuiteValidationRuleById, getExecutiveOperationsSuiteValidationRulesByCategory } from "./executiveOperationsSuiteValidationIndex.ts";

test("validation registry is immutable and comprehensive", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteValidationRegistry), true);
  assert.equal(ExecutiveOperationsSuiteValidationRegistry.length >= 18, true);
  assert.equal(ExecutiveOperationsSuiteValidationRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveOperationsSuiteValidationRegistry.map((rule) => rule.id)).size, ExecutiveOperationsSuiteValidationRegistry.length);
});

test("category and severity inventories are canonical", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteValidationCategories), true);
  assert.equal(new Set(ExecutiveOperationsSuiteValidationCategories).size, ExecutiveOperationsSuiteValidationCategories.length);
  assert.deepEqual(ExecutiveOperationsSuiteValidationSeverities, ["info", "warning", "error", "critical"]);
  assert.equal(ExecutiveOperationsSuiteValidationRegistry.every((rule) => ExecutiveOperationsSuiteValidationCategories.includes(rule.category) && ExecutiveOperationsSuiteValidationSeverities.includes(rule.severity)), true);
});

test("validation metadata consistently references OPS-10:2", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteValidationMetadata), true);
  assert.equal(ExecutiveOperationsSuiteValidationMetadata.sourceRegistryId, "executive-operations-suite-registry");
  assert.equal(ExecutiveOperationsSuiteValidationMetadata.coveredPlatformCount, 9);
  assert.equal(ExecutiveOperationsSuiteValidationMetadata.coveredPhaseCount, 9);
  assert.equal(ExecutiveOperationsSuiteValidationMetadata.validationCount, ExecutiveOperationsSuiteValidationRegistry.length);
  assert.equal(ExecutiveOperationsSuiteValidationStatus.releaseStatus, "Draft");
});

test("validation manifest is immutable and count-consistent", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteValidationManifest), true);
  assert.equal(ExecutiveOperationsSuiteValidationManifest.totalValidationCount, ExecutiveOperationsSuiteValidationRegistry.length);
  assert.equal(ExecutiveOperationsSuiteValidationManifest.registryCoverage.sourcePhase, "OPS-10:2");
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteValidationManifest.validationPolicy), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteValidationManifest.immutablePolicy), true);
});

test("exact deterministic rule lookups work without exceptions", () => {
  assert.equal(getExecutiveOperationsSuiteValidationRuleById("suite-phase-count")?.category, "phase");
  assert.equal(getExecutiveOperationsSuiteValidationRuleById("SUITE-PHASE-COUNT"), undefined);
  assert.equal(getExecutiveOperationsSuiteValidationRuleById("unknown"), undefined);
  const registryRules = getExecutiveOperationsSuiteValidationRulesByCategory("registry");
  assert.equal(Object.isFrozen(registryRules), true);
  assert.equal(registryRules.every((rule) => rule.category === "registry"), true);
  assert.deepEqual(registryRules, getExecutiveOperationsSuiteValidationRulesByCategory("registry"));
  assert.deepEqual(getExecutiveOperationsSuiteValidationRulesByCategory("Registry"), []);
});

test("helpers return frozen canonical metadata structures", () => {
  assert.equal(getExecutiveOperationsSuiteValidation(), ExecutiveOperationsSuiteValidation);
  assert.equal(getExecutiveOperationsSuiteValidationRegistry(), ExecutiveOperationsSuiteValidationRegistry);
  assert.equal(getExecutiveOperationsSuiteValidationManifest(), ExecutiveOperationsSuiteValidationManifest);
  assert.equal(getExecutiveOperationsSuiteValidationMetadata(), ExecutiveOperationsSuiteValidationMetadata);
  assert.equal(Object.isFrozen(getExecutiveOperationsSuiteValidation()), true);
});

test("public API contains no runtime validation or mutation functions", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveOperationsSuiteValidationRegistry", "ExecutiveOperationsSuiteValidationManifest", "getExecutiveOperationsSuiteValidationRuleById", "getExecutiveOperationsSuiteValidationRulesByCategory"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /^(validateSuite|runValidation|executeValidation|repairValidation|fixValidation|registerRule|removeRule|updateValidation)$/.test(key)), false);
  assert.equal(keys.some((key) => /internal|test/i.test(key)), false);
});

test("all exported structures remain metadata-only and deterministic", () => {
  assert.equal(ExecutiveOperationsSuiteValidationRegistry.every((rule) => rule.metadataOnly && rule.status === "Defined"), true);
  assert.equal(ExecutiveOperationsSuiteValidationManifest.metadataOnly, true);
  assert.equal(ExecutiveOperationsSuiteValidation.metadataOnly, true);
  assert.deepEqual(getExecutiveOperationsSuiteValidation(), getExecutiveOperationsSuiteValidation());
});
