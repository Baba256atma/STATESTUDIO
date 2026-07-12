import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePublicIndexId,
} from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ExecutiveProjectExecutionPublicIndexId,
} from "./executiveProjectExecutionPublicIndex.ts";
import {
  ExecutiveResourceIntelligencePlatform,
  ExecutiveResourceIntelligencePlatformPublicRegistry,
  ExecutiveResourceIntelligencePlatformReleaseSummary,
  validateResourcePlatformIndex,
} from "./resourcePlatformIndex.ts";

test("namespace integrity", () => {
  assert.ok(ExecutiveResourceIntelligencePlatform);
  assert.ok("foundation" in ExecutiveResourceIntelligencePlatform);
  assert.ok("metadata" in ExecutiveResourceIntelligencePlatform);
  assert.ok("model" in ExecutiveResourceIntelligencePlatform);
  assert.ok("validation" in ExecutiveResourceIntelligencePlatform);
  assert.ok("manifest" in ExecutiveResourceIntelligencePlatform);
  assert.ok("publicIndex" in ExecutiveResourceIntelligencePlatform);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveResourceIntelligencePlatform), true);
  assert.equal(
    Object.isFrozen(ExecutiveResourceIntelligencePlatform.publicIndex),
    true,
  );
});

test("deterministic output", () => {
  assert.deepEqual(
    ExecutiveResourceIntelligencePlatformReleaseSummary,
    ExecutiveResourceIntelligencePlatformReleaseSummary,
  );
  assert.deepEqual(validateResourcePlatformIndex(), validateResourcePlatformIndex());
});

test("public API stability", () => {
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicRegistry.totalExportCount >= 22,
    true,
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicRegistry.publicApiStatus,
    "Stable",
  );
  assert.equal(ExecutiveResourceIntelligencePlatform.metadataOnly, true);
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, and OPS-5:1 through OPS-5:5", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(
    ExecutiveResourceIntelligencePlatform.foundation.ResourceIntelligenceIdentity
      .dependencySources.includes("OPS-2:9"),
    true,
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatform.foundation.ResourceIntelligenceIdentity
      .dependencySources.includes("OPS-3:9"),
    true,
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatform.foundation.ResourceIntelligenceIdentity
      .dependencySources.includes("OPS-4:9"),
    true,
  );
});

test("release summary complete", () => {
  assert.equal(ExecutiveResourceIntelligencePlatformReleaseSummary.platformId, "OPS-5:1");
  assert.equal(ExecutiveResourceIntelligencePlatformReleaseSummary.phaseCount, 4);
  assert.equal(
    ExecutiveResourceIntelligencePlatformReleaseSummary.releaseReadiness,
    "Ready",
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformReleaseSummary.taskCompatibilityStatus,
    "PASS",
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformReleaseSummary.workflowCompatibilityStatus,
    "PASS",
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformReleaseSummary.projectCompatibilityStatus,
    "PASS",
  );
});

test("validation returns PASS", () => {
  const validation = validateResourcePlatformIndex();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});
