import assert from "node:assert/strict";
import test from "node:test";
import {
  ExecutionMonitoringValidationGroups,
  ExecutionMonitoringValidationRegistry,
  ExecutionMonitoringValidationRuleCatalog,
  buildExecutionMonitoringValidationManifest,
  getExecutionMonitoringValidationSummary,
  validateExecutionMonitoringFoundation,
  validateExecutionMonitoringModel,
  validateExecutionMonitoringPlatform,
  validateExecutionMonitoringRegistry,
  validateExecutiveExecutionMonitoringPlatform,
} from "./executionMonitoringValidationIndex.ts";

test("publishes the canonical immutable validation rule catalog", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringValidationGroups), true);
  assert.equal(Object.isFrozen(ExecutionMonitoringValidationRuleCatalog), true);
  assert.equal(ExecutionMonitoringValidationGroups.length, 4);
  assert.equal(ExecutionMonitoringValidationRuleCatalog.length, 22);
  assert.deepEqual(ExecutionMonitoringValidationGroups.map((group) => group.rules.length), [3, 7, 7, 5]);
});

test("publishes frozen registry metadata", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringValidationRegistry), true);
  assert.equal(ExecutionMonitoringValidationRegistry.validationMetadata.ruleCount, 22);
  assert.deepEqual(ExecutionMonitoringValidationRegistry.compatibilityMetadata.consumedPhases, ["OPS-9:1", "OPS-9:2", "OPS-9:3"]);
});

test("builds the deterministic validation manifest", () => {
  const manifest = buildExecutionMonitoringValidationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-9:4");
  assert.equal(manifest.validationSummary.status, "PASS");
  assert.equal(manifest.supportedRuleGroups.length, 4);
});

test("all architectural validation helpers pass", () => {
  assert.equal(validateExecutionMonitoringFoundation().status, "PASS");
  assert.equal(validateExecutionMonitoringRegistry().status, "PASS");
  assert.equal(validateExecutionMonitoringModel().status, "PASS");
  assert.equal(validateExecutionMonitoringPlatform().status, "PASS");
  assert.equal(validateExecutiveExecutionMonitoringPlatform().status, "PASS");
  assert.equal(validateExecutiveExecutionMonitoringPlatform().failedChecks, 0);
});

test("returns immutable deterministic outputs", () => {
  const first = validateExecutiveExecutionMonitoringPlatform();
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.checks), true);
  assert.deepEqual(first, validateExecutiveExecutionMonitoringPlatform());
  assert.deepEqual(getExecutionMonitoringValidationSummary(), getExecutionMonitoringValidationSummary());
});

test("keeps the approved public API stable", async () => {
  const publicApi = await import("./executionMonitoringValidationIndex.ts");
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutionMonitoringValidationCompatibilityMetadata", "ExecutionMonitoringValidationGroups",
    "ExecutionMonitoringValidationMetadata", "ExecutionMonitoringValidationRegistry",
    "ExecutionMonitoringValidationRuleCatalog", "buildExecutionMonitoringValidationManifest",
    "getExecutionMonitoringValidationSummary", "validateExecutionMonitoringFoundation",
    "validateExecutionMonitoringModel", "validateExecutionMonitoringPlatform",
    "validateExecutionMonitoringRegistry", "validateExecutiveExecutionMonitoringPlatform",
  ].sort());
});
