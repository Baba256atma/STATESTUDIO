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
  buildResourcePlatformCertificationManifest,
  getResourcePlatformCertificationSummary,
  runResourcePlatformCertification,
  ResourcePlatformCertificationRegistry,
  ResourcePlatformCompatibility,
} from "./resourcePlatformCertificationIndex.ts";

test("certification manifest builds", () => {
  const manifest = buildResourcePlatformCertificationManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.publicApiStatus, "Stable");
});

test("certification runner returns PASS", () => {
  const result = runResourcePlatformCertification();

  assert.equal(result.overallStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 11);
});

test("registry integrity", () => {
  assert.equal(Object.isFrozen(ResourcePlatformCertificationRegistry), true);
  assert.equal(ResourcePlatformCertificationRegistry.length, 9);
});

test("task compatibility certification exists", () => {
  assert.equal(
    ResourcePlatformCertificationRegistry.some(
      (entry) => entry.certificationScope === "OPS-2 Task Compatibility",
    ),
    true,
  );
});

test("workflow compatibility certification exists", () => {
  assert.equal(
    ResourcePlatformCertificationRegistry.some(
      (entry) => entry.certificationScope === "OPS-3 Workflow Compatibility",
    ),
    true,
  );
});

test("project compatibility certification exists", () => {
  assert.equal(
    ResourcePlatformCertificationRegistry.some(
      (entry) => entry.certificationScope === "OPS-4 Project Compatibility",
    ),
    true,
  );
});

test("compatibility metadata integrity", () => {
  assert.equal(Object.isFrozen(ResourcePlatformCompatibility), true);
  assert.equal(ResourcePlatformCompatibility.length, 6);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    buildResourcePlatformCertificationManifest(),
    buildResourcePlatformCertificationManifest(),
  );
  assert.deepEqual(
    runResourcePlatformCertification(),
    runResourcePlatformCertification(),
  );
  assert.deepEqual(
    getResourcePlatformCertificationSummary(),
    getResourcePlatformCertificationSummary(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildResourcePlatformCertificationManifest()), true);
  assert.equal(Object.isFrozen(runResourcePlatformCertification()), true);
});

test("public API stability", () => {
  assert.equal(
    buildResourcePlatformCertificationManifest().certificationStatus,
    "PASS",
  );
  assert.equal(
    getResourcePlatformCertificationSummary().overallStatus,
    "PASS",
  );
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, and OPS-5:1 through OPS-5:6", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(
    ResourcePlatformCompatibility[0]?.target,
    "OPS-1 Public Platform",
  );
});
