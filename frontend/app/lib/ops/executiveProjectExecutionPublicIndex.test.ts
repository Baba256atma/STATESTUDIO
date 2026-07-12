import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ExecutiveProjectExecutionPlatformPublicFoundation,
  ExecutiveProjectExecutionPublicApiRegistry,
  ExecutiveProjectExecutionPublicIndexId,
  ExecutiveProjectExecutionPublicIndexStatus,
  getExecutiveProjectExecutionPublicApiRegistry,
  getExecutiveProjectExecutionPublicFoundation,
  getExecutiveProjectExecutionPublicMetadata,
  getExecutiveProjectExecutionReleaseSummary,
} from "./executiveProjectExecutionPublicIndex.ts";

test("namespace structure", () => {
  assert.ok(ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("foundation" in ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("metadata" in ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("model" in ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("validation" in ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("manifest" in ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("platform" in ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("certification" in ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("freeze" in ExecutiveProjectExecutionPlatformPublicFoundation);
  assert.ok("publicIndex" in ExecutiveProjectExecutionPlatformPublicFoundation);
});

test("metadata", () => {
  const metadata = getExecutiveProjectExecutionPublicMetadata();

  assert.equal(metadata.publicIndexId, "OPS-4:9");
  assert.equal(metadata.platformId, "OPS-4:1");
  assert.equal(metadata.status.releaseStatus, "Released");
  assert.equal(Object.isFrozen(metadata), true);
});

test("registry", () => {
  assert.equal(
    ExecutiveProjectExecutionPublicApiRegistry.totalExportCount >= 36,
    true,
  );
  assert.equal(ExecutiveProjectExecutionPublicApiRegistry.publicApiStatus, "Stable");
  assert.equal(
    getExecutiveProjectExecutionPublicApiRegistry().publicIndexApis.length,
    12,
  );
});

test("helper functions", () => {
  const summary = getExecutiveProjectExecutionReleaseSummary();

  assert.equal(summary.platformId, "OPS-4:1");
  assert.equal(summary.phaseCount, 8);
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.taskCompatibilityStatus, "PASS");
  assert.equal(summary.workflowCompatibilityStatus, "PASS");
  assert.equal(summary.releaseReadiness, "Ready");
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveProjectExecutionPlatformPublicFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveProjectExecutionPublicApiRegistry), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveProjectExecutionPublicFoundation(),
    getExecutiveProjectExecutionPublicFoundation(),
  );
  assert.deepEqual(
    getExecutiveProjectExecutionPublicMetadata(),
    getExecutiveProjectExecutionPublicMetadata(),
  );
  assert.deepEqual(
    getExecutiveProjectExecutionReleaseSummary(),
    getExecutiveProjectExecutionReleaseSummary(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveProjectExecutionPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveProjectExecutionPlatformPublicFoundation.immutable, true);
});

test("project compatibility present", () => {
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicFoundation.freeze.ProjectPlatformFreezeCompatibility
      .length,
    3,
  );
});

test("task compatibility present", () => {
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicFoundation.freeze.ProjectPlatformTaskCompatibility
      .length,
    2,
  );
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicFoundation.publicIndex.releaseSummary
      .taskCompatibilityStatus,
    "PASS",
  );
});

test("workflow compatibility present", () => {
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicFoundation.freeze.ProjectPlatformWorkflowCompatibility
      .length,
    2,
  );
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicFoundation.publicIndex.releaseSummary
      .workflowCompatibilityStatus,
    "PASS",
  );
});

test("compatibility with OPS-1, OPS-2, OPS-3, and OPS-4", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.deepEqual(
    ExecutiveProjectExecutionPlatformPublicFoundation.foundation.ProjectExecutionIdentity
      .dependencySources,
    ["OPS-1:9", "OPS-2:9", "OPS-3:9"],
  );
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicFoundation.certification
      .buildProjectPlatformCertificationManifest().certifiedPhases.length,
    6,
  );
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicFoundation.freeze
      .buildProjectPlatformFreezeManifest().certifiedPhaseRegistry.length,
    7,
  );
});

