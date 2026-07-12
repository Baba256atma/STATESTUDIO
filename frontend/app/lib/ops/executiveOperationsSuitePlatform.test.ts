import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveOperationsSuitePlatformIndex.ts";
import { ExecutiveOperationsSuitePlatform, ExecutiveOperationsSuitePlatformNamespace, ExecutiveOperationsSuitePlatformRegistry, ExecutiveOperationsSuitePlatformStatus, getExecutiveOperationsSuitePlatform, getExecutiveOperationsSuitePlatformMetadata, getExecutiveOperationsSuitePlatformRegistry, getExecutiveOperationsSuitePlatformSummary } from "./executiveOperationsSuitePlatformIndex.ts";
import { ExecutiveOperationsSuiteValidationMetadata } from "./executiveOperationsSuiteValidationIndex.ts";

test("platform namespace contains exactly six immutable sections", () => {
  assert.ok(ExecutiveOperationsSuitePlatform);
  assert.deepEqual(Object.keys(ExecutiveOperationsSuitePlatform), ["foundation", "registry", "validation", "manifest", "metadata", "summary"]);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePlatform), true);
  assert.equal(Object.values(ExecutiveOperationsSuitePlatform).every(Object.isFrozen), true);
});

test("platform registry contains four ordered components", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePlatformRegistry), true);
  assert.equal(ExecutiveOperationsSuitePlatformRegistry.length, 4);
  assert.deepEqual(ExecutiveOperationsSuitePlatformRegistry.map((entry) => entry.id), ["foundation", "registry", "validation", "manifest"]);
  assert.deepEqual(ExecutiveOperationsSuitePlatformRegistry.map((entry) => entry.role), ["Foundation", "Registry", "Validation", "Manifest"]);
  assert.equal(ExecutiveOperationsSuitePlatformRegistry.every(Object.isFrozen), true);
});

test("platform metadata is internally consistent", () => {
  const metadata = getExecutiveOperationsSuitePlatformMetadata();
  assert.equal(metadata.id, "executive-operations-suite-platform");
  assert.equal(metadata.namespace, ExecutiveOperationsSuitePlatformNamespace);
  assert.equal(metadata.status, ExecutiveOperationsSuitePlatformStatus);
  assert.equal(metadata.status.releaseStatus, "Draft");
  assert.equal(metadata.consumedPhases.length, 4);
});

test("summary counts are derived from consumed layers", () => {
  const summary = getExecutiveOperationsSuitePlatformSummary();
  assert.equal(summary.platformCount, 9);
  assert.equal(summary.phaseCount, 9);
  assert.equal(summary.componentCount, ExecutiveOperationsSuitePlatformRegistry.length);
  assert.equal(summary.validationRuleCount, ExecutiveOperationsSuiteValidationMetadata.validationCount);
  assert.equal(summary.readiness, "ReadyForCertification");
});

test("helper APIs return canonical frozen deterministic objects", () => {
  assert.equal(getExecutiveOperationsSuitePlatform(), ExecutiveOperationsSuitePlatform);
  assert.equal(getExecutiveOperationsSuitePlatformRegistry(), ExecutiveOperationsSuitePlatformRegistry);
  for (const result of [getExecutiveOperationsSuitePlatform(), getExecutiveOperationsSuitePlatformMetadata(), getExecutiveOperationsSuitePlatformSummary(), getExecutiveOperationsSuitePlatformRegistry()]) assert.equal(Object.isFrozen(result), true);
  assert.deepEqual(getExecutiveOperationsSuitePlatformSummary(), getExecutiveOperationsSuitePlatformSummary());
});

test("nested public component namespaces remain immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePlatform.foundation), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePlatform.registry), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePlatform.validation), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePlatform.manifest), true);
});

test("public platform API is stable without mutation or runtime functions", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveOperationsSuitePlatform", "ExecutiveOperationsSuitePlatformRegistry", "getExecutiveOperationsSuitePlatform", "getExecutiveOperationsSuitePlatformSummary"]) assert.ok(keys.includes(required));
  assert.equal(keys.includes("ExecutiveOperationsSuitePlatformComponentRegistry"), false);
  assert.equal(keys.some((key) => /run|execute|orchestrat|monitor|schedule|automate|validate|certif|freeze|register|update|remove|internal|test/i.test(key)), false);
});
