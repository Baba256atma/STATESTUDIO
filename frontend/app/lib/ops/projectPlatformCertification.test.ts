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
  buildProjectPlatformCertificationManifest,
  getProjectPlatformCertificationSummary,
  runProjectPlatformCertification,
  ProjectPlatformCertificationRegistry,
  ProjectPlatformCompatibility,
} from "./projectPlatformCertificationIndex.ts";

test("certification manifest builds", () => {
  const manifest = buildProjectPlatformCertificationManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.publicApiStatus, "Stable");
});

test("certification runner returns PASS", () => {
  const result = runProjectPlatformCertification();

  assert.equal(result.overallStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 10);
});

test("registry integrity", () => {
  assert.equal(Object.isFrozen(ProjectPlatformCertificationRegistry), true);
  assert.equal(ProjectPlatformCertificationRegistry.length, 8);
});

test("task compatibility certification exists", () => {
  assert.equal(
    ProjectPlatformCertificationRegistry.some(
      (entry) => entry.certificationScope === "OPS-2 Task Compatibility",
    ),
    true,
  );
});

test("workflow compatibility certification exists", () => {
  assert.equal(
    ProjectPlatformCertificationRegistry.some(
      (entry) => entry.certificationScope === "OPS-3 Workflow Compatibility",
    ),
    true,
  );
});

test("compatibility metadata integrity", () => {
  assert.equal(Object.isFrozen(ProjectPlatformCompatibility), true);
  assert.equal(ProjectPlatformCompatibility.length, 6);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    buildProjectPlatformCertificationManifest(),
    buildProjectPlatformCertificationManifest(),
  );
  assert.deepEqual(
    runProjectPlatformCertification(),
    runProjectPlatformCertification(),
  );
  assert.deepEqual(
    getProjectPlatformCertificationSummary(),
    getProjectPlatformCertificationSummary(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildProjectPlatformCertificationManifest()), true);
  assert.equal(Object.isFrozen(runProjectPlatformCertification()), true);
});

test("public API stability", () => {
  assert.equal(
    buildProjectPlatformCertificationManifest().certificationStatus,
    "PASS",
  );
  assert.equal(
    getProjectPlatformCertificationSummary().overallStatus,
    "PASS",
  );
});

test("compatibility with OPS-1, OPS-2, and OPS-3 public platforms", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(
    ProjectPlatformCompatibility[0]?.target,
    "OPS-1 Public Platform",
  );
});

