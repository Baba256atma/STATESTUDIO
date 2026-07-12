import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePlatform,
  ExecutiveTaskIntelligencePlatformPublicRegistry,
  ExecutiveTaskIntelligencePlatformReleaseSummary,
  validateTaskPlatformIndex,
} from "./taskPlatformIndex.ts";

test("namespace exists", () => {
  assert.ok(ExecutiveTaskIntelligencePlatform);
});

test("namespace includes foundation, metadata, model, validation, manifest, publicIndex", () => {
  assert.ok("foundation" in ExecutiveTaskIntelligencePlatform);
  assert.ok("metadata" in ExecutiveTaskIntelligencePlatform);
  assert.ok("model" in ExecutiveTaskIntelligencePlatform);
  assert.ok("validation" in ExecutiveTaskIntelligencePlatform);
  assert.ok("manifest" in ExecutiveTaskIntelligencePlatform);
  assert.ok("publicIndex" in ExecutiveTaskIntelligencePlatform);
});

test("public registry is complete", () => {
  assert.equal(
    ExecutiveTaskIntelligencePlatformPublicRegistry.totalExportCount >= 22,
    true,
  );
  assert.equal(
    ExecutiveTaskIntelligencePlatformPublicRegistry.publicApiStatus,
    "Stable",
  );
});

test("release summary is complete", () => {
  assert.equal(
    ExecutiveTaskIntelligencePlatformReleaseSummary.platformId,
    "OPS-2:1",
  );
  assert.equal(ExecutiveTaskIntelligencePlatformReleaseSummary.phaseCount, 4);
  assert.equal(
    ExecutiveTaskIntelligencePlatformReleaseSummary.releaseReadiness,
    "Ready",
  );
});

test("validation returns PASS", () => {
  const validation = validateTaskPlatformIndex();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("namespace is immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveTaskIntelligencePlatform), true);
});

test("output is deterministic", () => {
  assert.deepEqual(
    ExecutiveTaskIntelligencePlatformReleaseSummary,
    ExecutiveTaskIntelligencePlatformReleaseSummary,
  );
  assert.deepEqual(validateTaskPlatformIndex(), validateTaskPlatformIndex());
});

test("public API is stable", () => {
  assert.equal(ExecutiveTaskIntelligencePlatform.metadataOnly, true);
  assert.equal(ExecutiveTaskIntelligencePlatform.immutable, true);
  assert.equal(ExecutiveTaskIntelligencePlatform.deterministic, true);
});

test("compatibility with OPS-1 public platform", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(
    ExecutiveTaskIntelligencePlatform.foundation.TaskIntelligenceIdentity.dependencySource,
    "OPS-1:9",
  );
});
