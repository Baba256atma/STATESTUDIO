import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import {
  ExecutiveResourceIntelligencePlatformPublicFoundation,
  ExecutiveResourceIntelligencePublicApiRegistry,
  ExecutiveResourceIntelligencePublicIndexId,
  ExecutiveResourceIntelligencePublicIndexStatus,
  getExecutiveResourceIntelligencePublicApiRegistry,
  getExecutiveResourceIntelligencePublicFoundation,
  getExecutiveResourceIntelligencePublicMetadata,
  getExecutiveResourceIntelligenceReleaseSummary,
} from "./executiveResourceIntelligencePublicIndex.ts";

test("namespace structure", () => {
  assert.ok(ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("foundation" in ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("metadata" in ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("model" in ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("validation" in ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("manifest" in ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("platform" in ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("certification" in ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("freeze" in ExecutiveResourceIntelligencePlatformPublicFoundation);
  assert.ok("publicIndex" in ExecutiveResourceIntelligencePlatformPublicFoundation);
});

test("metadata", () => {
  const metadata = getExecutiveResourceIntelligencePublicMetadata();

  assert.equal(metadata.publicIndexId, "OPS-5:9");
  assert.equal(metadata.platformId, "OPS-5:1");
  assert.equal(metadata.status.releaseStatus, "Released");
  assert.equal(Object.isFrozen(metadata), true);
});

test("registry", () => {
  assert.equal(
    ExecutiveResourceIntelligencePublicApiRegistry.totalExportCount >= 38,
    true,
  );
  assert.equal(ExecutiveResourceIntelligencePublicApiRegistry.publicApiStatus, "Stable");
  assert.equal(
    getExecutiveResourceIntelligencePublicApiRegistry().publicIndexApis.length,
    12,
  );
});

test("helper functions", () => {
  const summary = getExecutiveResourceIntelligenceReleaseSummary();

  assert.equal(summary.platformId, "OPS-5:1");
  assert.equal(summary.phaseCount, 8);
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.taskCompatibilityStatus, "PASS");
  assert.equal(summary.workflowCompatibilityStatus, "PASS");
  assert.equal(summary.projectCompatibilityStatus, "PASS");
  assert.equal(summary.releaseReadiness, "Ready");
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveResourceIntelligencePlatformPublicFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveResourceIntelligencePublicApiRegistry), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveResourceIntelligencePublicFoundation(),
    getExecutiveResourceIntelligencePublicFoundation(),
  );
  assert.deepEqual(
    getExecutiveResourceIntelligencePublicMetadata(),
    getExecutiveResourceIntelligencePublicMetadata(),
  );
  assert.deepEqual(
    getExecutiveResourceIntelligenceReleaseSummary(),
    getExecutiveResourceIntelligenceReleaseSummary(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveResourceIntelligencePublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveResourceIntelligencePlatformPublicFoundation.immutable, true);
});

test("resource compatibility present", () => {
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.freeze.ResourcePlatformFreezeCompatibility
      .length,
    3,
  );
});

test("task compatibility present", () => {
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.freeze.ResourcePlatformTaskCompatibility
      .length,
    2,
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.publicIndex.releaseSummary
      .taskCompatibilityStatus,
    "PASS",
  );
});

test("workflow compatibility present", () => {
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.freeze.ResourcePlatformWorkflowCompatibility
      .length,
    2,
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.publicIndex.releaseSummary
      .workflowCompatibilityStatus,
    "PASS",
  );
});

test("project compatibility present", () => {
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.freeze.ResourcePlatformProjectCompatibility
      .length,
    2,
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.publicIndex.releaseSummary
      .projectCompatibilityStatus,
    "PASS",
  );
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, and OPS-5", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.deepEqual(
    ExecutiveResourceIntelligencePlatformPublicFoundation.foundation.ResourceIntelligenceIdentity
      .dependencySources,
    ["OPS-1:9", "OPS-2:9", "OPS-3:9", "OPS-4:9"],
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.certification
      .buildResourcePlatformCertificationManifest().certifiedPhases.length,
    6,
  );
  assert.equal(
    ExecutiveResourceIntelligencePlatformPublicFoundation.freeze
      .buildResourcePlatformFreezeManifest().certifiedPhaseRegistry.length,
    7,
  );
});
