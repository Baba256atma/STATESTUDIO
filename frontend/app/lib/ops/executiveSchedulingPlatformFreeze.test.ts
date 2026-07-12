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
  buildExecutiveSchedulingPlatformFreezeManifest,
  ExecutiveSchedulingPlatformFreezeCompatibility,
  ExecutiveSchedulingPlatformProjectCompatibility,
  ExecutiveSchedulingPlatformRegressionMetadata,
  ExecutiveSchedulingPlatformResourceCompatibility,
  ExecutiveSchedulingPlatformTaskCompatibility,
  ExecutiveSchedulingPlatformWorkflowCompatibility,
  getExecutiveSchedulingPlatformFreezeSummary,
  runExecutiveSchedulingPlatformFreeze,
  validateExecutiveSchedulingPlatformFreeze,
} from "./executiveSchedulingPlatformFreezeIndex.ts";

test("freeze registry", () => {
  const manifest = buildExecutiveSchedulingPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest.certifiedPhaseRegistry), true);
  assert.equal(manifest.certifiedPhaseRegistry.length, 7);
});

test("freeze compatibility", () => {
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatformFreezeCompatibility), true);
  assert.equal(ExecutiveSchedulingPlatformFreezeCompatibility.length, 3);
});

test("freeze manifest", () => {
  const manifest = buildExecutiveSchedulingPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeId, "OPS-6:8");
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
});

test("freeze validation", () => {
  const validation = validateExecutiveSchedulingPlatformFreeze();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("freeze runner", () => {
  const result = runExecutiveSchedulingPlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 19);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildExecutiveSchedulingPlatformFreezeManifest()), true);
  assert.equal(Object.isFrozen(runExecutiveSchedulingPlatformFreeze()), true);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    buildExecutiveSchedulingPlatformFreezeManifest(),
    buildExecutiveSchedulingPlatformFreezeManifest(),
  );
  assert.deepEqual(
    runExecutiveSchedulingPlatformFreeze(),
    runExecutiveSchedulingPlatformFreeze(),
  );
  assert.deepEqual(
    getExecutiveSchedulingPlatformFreezeSummary(),
    getExecutiveSchedulingPlatformFreezeSummary(),
  );
});

test("release summary", () => {
  const manifest = buildExecutiveSchedulingPlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});

test("extension policy", () => {
  assert.equal(
    buildExecutiveSchedulingPlatformFreezeManifest().extensionPolicy.status,
    "Locked",
  );
});

test("regression summary", () => {
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatformRegressionMetadata), true);
  assert.equal(ExecutiveSchedulingPlatformRegressionMetadata.length, 12);
});

test("public API surface", () => {
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatformTaskCompatibility), true);
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatformWorkflowCompatibility), true);
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatformProjectCompatibility), true);
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatformResourceCompatibility), true);
});

test("compatibility with OPS-1 through OPS-6:7", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.equal(
    ExecutiveSchedulingPlatformFreezeCompatibility[0]?.target,
    "OPS-1 Public Platform",
  );
});
