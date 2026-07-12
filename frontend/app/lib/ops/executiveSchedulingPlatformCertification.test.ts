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
  ExecutiveResourceIntelligencePublicIndexId,
} from "./executiveResourceIntelligencePublicIndex.ts";
import {
  ExecutiveSchedulingPlatformCertificationRegistry,
  ExecutiveSchedulingPlatformCompatibility,
  buildExecutiveSchedulingPlatformCertificationManifest,
  certifyExecutiveSchedulingPlatform,
  getExecutiveSchedulingCertificationSummary,
  getExecutiveSchedulingPlatformCertification,
  runExecutiveSchedulingPlatformCertification,
} from "./executiveSchedulingPlatformCertificationIndex.ts";

test("certification registry", () => {
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatformCertificationRegistry), true);
  assert.equal(
    ExecutiveSchedulingPlatformCertificationRegistry.certifiedPhases.length,
    6,
  );
  assert.equal(
    ExecutiveSchedulingPlatformCertificationRegistry.certificationStatus,
    "PASS",
  );
});

test("compatibility metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatformCompatibility), true);
  assert.equal(ExecutiveSchedulingPlatformCompatibility.internal.length, 6);
  assert.equal(ExecutiveSchedulingPlatformCompatibility.crossPlatform.length, 4);
});

test("certification manifest", () => {
  const manifest = buildExecutiveSchedulingPlatformCertificationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.releaseReadiness.status, "Ready");
});

test("certification runner", () => {
  const result = runExecutiveSchedulingPlatformCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, 15);
});

test("certification helpers", () => {
  assert.equal(certifyExecutiveSchedulingPlatform(), "PASS");
  assert.equal(getExecutiveSchedulingPlatformCertification().status, "PASS");
  assert.equal(
    getExecutiveSchedulingCertificationSummary().certificationStatus,
    "PASS",
  );
});

test("immutable exports", () => {
  assert.equal(
    Object.isFrozen(buildExecutiveSchedulingPlatformCertificationManifest()),
    true,
  );
  assert.equal(Object.isFrozen(runExecutiveSchedulingPlatformCertification()), true);
});

test("deterministic execution", () => {
  assert.deepEqual(
    buildExecutiveSchedulingPlatformCertificationManifest(),
    buildExecutiveSchedulingPlatformCertificationManifest(),
  );
  assert.deepEqual(
    runExecutiveSchedulingPlatformCertification(),
    runExecutiveSchedulingPlatformCertification(),
  );
  assert.deepEqual(
    getExecutiveSchedulingCertificationSummary(),
    getExecutiveSchedulingCertificationSummary(),
  );
});

test("public API surface", () => {
  assert.equal(
    getExecutiveSchedulingPlatformCertification().manifest.metadataOnly,
    true,
  );
  assert.equal(
    getExecutiveSchedulingPlatformCertification().result.status,
    "PASS",
  );
});

test("compatibility with OPS-1 through OPS-6:6", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.equal(
    ExecutiveSchedulingPlatformCompatibility.crossPlatform[0]?.target,
    "OPS-2 Task Platform",
  );
});
