import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveExecutionFoundation,
  ExecutionContracts,
  ExecutionPlatformId,
  ExecutionPlatformIdentity,
  ExecutionPlatformName,
  ExecutionPlatformNamespace,
  ExecutionPlatformVersion,
  ExecutionRegistry,
  buildExecutionManifest,
  validateExecutionFoundation,
} from "./executionIndex.ts";

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionFoundation), true);
  assert.equal(Object.isFrozen(ExecutionPlatformIdentity), true);
  assert.equal(Object.isFrozen(ExecutionRegistry), true);
  assert.equal(Object.isFrozen(ExecutionContracts), true);
});

test("registry integrity", () => {
  assert.equal(ExecutionRegistry.platformId, "OPS-1:1");
  assert.equal(ExecutionRegistry.registeredPhases.length, 1);
  assert.equal(ExecutionRegistry.registeredPhases[0]?.phaseName, "Execution Foundation");
});

test("manifest generation", () => {
  const manifest = buildExecutionManifest();

  assert.equal(manifest.identity.platformId, "OPS-1:1");
  assert.equal(manifest.registry.version, "1.0.0");
  assert.equal(manifest.contracts.all.length, 7);
  assert.equal(manifest.publicApis.length, 3);
});

test("validation success", () => {
  const result = validateExecutionFoundation();

  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 6);
});

test("public API stability and namespace consistency", () => {
  assert.equal(ExecutionPlatformId, "OPS-1:1");
  assert.equal(ExecutionPlatformName, "Nexora Executive Operations Execution Foundation");
  assert.equal(
    ExecutionPlatformNamespace,
    "nexora.ops.execution.foundation",
  );
  assert.equal(ExecutionPlatformVersion, "1.0.0");
  assert.equal(ExecutiveExecutionFoundation.metadataOnly, true);
  assert.equal(ExecutiveExecutionFoundation.immutable, true);
});

test("deterministic behavior", () => {
  assert.deepEqual(buildExecutionManifest(), buildExecutionManifest());
  assert.deepEqual(validateExecutionFoundation(), validateExecutionFoundation());
});
