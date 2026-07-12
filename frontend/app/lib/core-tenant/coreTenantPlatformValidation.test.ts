import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExecutiveTenantValidationManifest,
  CORE_TENANT_VALIDATION_METADATA,
  ExecutiveTenantValidationPlatform,
  runExecutiveTenantPlatformValidation,
} from "./coreTenantPlatformValidationIndex.ts";

test("validation gates pass", () => {
  const result = runExecutiveTenantPlatformValidation();

  assert.equal(result.status, "PASS");
  assert.equal(result.gates.length, 14);
  assert.equal(result.gates.every((gate) => gate.passed), true);
});

test("cross-phase compatibility verified", () => {
  const result = runExecutiveTenantPlatformValidation();
  const gate = result.gates.find((entry) => entry.gateId === "gate-cross-phase");

  assert.equal(gate?.passed, true);
  assert.equal(result.dependencies.length, 5);
  assert.equal(result.dependencies.every((dependency) => dependency.available), true);
});

test("manifest builds deterministically", () => {
  const first = buildExecutiveTenantValidationManifest();
  const second = buildExecutiveTenantValidationManifest();

  assert.equal(first.platformId, "CORE-TEN-6");
  assert.equal(first.platformNamespace, "nexora.core.tenant.validation");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(Object.isFrozen(first), true);
});

test("public APIs verified", () => {
  assert.equal(typeof ExecutiveTenantValidationPlatform.buildExecutiveTenantValidationManifest, "function");
  assert.equal(typeof ExecutiveTenantValidationPlatform.runExecutiveTenantPlatformValidation, "function");
  assert.equal(Object.isFrozen(ExecutiveTenantValidationPlatform), true);
});

test("boundary verification", () => {
  const result = runExecutiveTenantPlatformValidation();

  assert.equal(result.gates.some((gate) => gate.gateId === "gate-no-runtime" && gate.passed), true);
  assert.equal(result.gates.some((gate) => gate.gateId === "gate-no-auth" && gate.passed), true);
  assert.equal(result.gates.some((gate) => gate.gateId === "gate-no-persistence" && gate.passed), true);
  assert.equal(result.gates.some((gate) => gate.gateId === "gate-no-crud" && gate.passed), true);
  assert.equal(result.gates.some((gate) => gate.gateId === "gate-no-switching" && gate.passed), true);
});

test("metadata is immutable and complete", () => {
  assert.equal(CORE_TENANT_VALIDATION_METADATA.namespace, "nexora.core.tenant.validation");
  assert.deepEqual(CORE_TENANT_VALIDATION_METADATA.supportedContracts, ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4", "CORE-TEN-5"]);
  assert.equal(Object.isFrozen(CORE_TENANT_VALIDATION_METADATA), true);
});

test("summary and snapshot are consistent", () => {
  const result = runExecutiveTenantPlatformValidation();

  assert.equal(result.summary.totalGates, result.gates.length);
  assert.equal(result.summary.totalChecks, result.checks.length);
  assert.equal(result.snapshot.gateCount, result.gates.length);
  assert.equal(result.snapshot.checkCount, result.checks.length);
  assert.equal(result.snapshot.status, "PASS");
});

