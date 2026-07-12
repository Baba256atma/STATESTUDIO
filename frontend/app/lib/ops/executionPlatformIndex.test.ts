import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveOperationsPlatform,
  ExecutiveOperationsPlatformPublicRegistry,
  ExecutiveOperationsPlatformReleaseSummary,
  validateExecutionPlatformIndex,
} from "./executionPlatformIndex.ts";

test("namespace exists", () => {
  assert.ok(ExecutiveOperationsPlatform);
});

test("namespace includes foundation, metadata, model, validation, manifest, publicIndex", () => {
  assert.ok("foundation" in ExecutiveOperationsPlatform);
  assert.ok("metadata" in ExecutiveOperationsPlatform);
  assert.ok("model" in ExecutiveOperationsPlatform);
  assert.ok("validation" in ExecutiveOperationsPlatform);
  assert.ok("manifest" in ExecutiveOperationsPlatform);
  assert.ok("publicIndex" in ExecutiveOperationsPlatform);
});

test("public registry is complete", () => {
  assert.equal(ExecutiveOperationsPlatformPublicRegistry.totalExportCount >= 22, true);
  assert.equal(ExecutiveOperationsPlatformPublicRegistry.publicApiStatus, "Stable");
});

test("release summary is complete", () => {
  assert.equal(ExecutiveOperationsPlatformReleaseSummary.platformId, "OPS-1:1");
  assert.equal(ExecutiveOperationsPlatformReleaseSummary.phaseCount, 4);
  assert.equal(ExecutiveOperationsPlatformReleaseSummary.releaseReadiness, "Ready");
});

test("validation returns PASS", () => {
  const validation = validateExecutionPlatformIndex();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("namespace is immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsPlatform), true);
});

test("output is deterministic", () => {
  assert.deepEqual(
    ExecutiveOperationsPlatformReleaseSummary,
    ExecutiveOperationsPlatformReleaseSummary,
  );
  assert.deepEqual(
    validateExecutionPlatformIndex(),
    validateExecutionPlatformIndex(),
  );
});

test("public API is stable", () => {
  assert.equal(ExecutiveOperationsPlatform.metadataOnly, true);
  assert.equal(ExecutiveOperationsPlatform.immutable, true);
  assert.equal(ExecutiveOperationsPlatform.deterministic, true);
});
