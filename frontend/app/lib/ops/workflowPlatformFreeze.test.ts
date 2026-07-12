import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import {
  buildWorkflowPlatformFreezeManifest,
  getWorkflowPlatformFreezeSummary,
  runWorkflowPlatformFreeze,
  WorkflowPlatformFreezeCompatibility,
  WorkflowPlatformRegressionMetadata,
  WorkflowPlatformTaskCompatibility,
} from "./workflowPlatformFreezeIndex.ts";

test("freeze manifest builds", () => {
  const manifest = buildWorkflowPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeId, "OPS-3:8");
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
});

test("freeze runner returns PASS", () => {
  const result = runWorkflowPlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 9);
});

test("certification dependency is PASS", () => {
  assert.equal(
    buildWorkflowPlatformFreezeManifest().certificationDependency.certificationStatus,
    "PASS",
  );
});

test("regression metadata exists", () => {
  assert.equal(Object.isFrozen(WorkflowPlatformRegressionMetadata), true);
  assert.equal(WorkflowPlatformRegressionMetadata.length, 10);
});

test("workflow compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(WorkflowPlatformFreezeCompatibility), true);
  assert.equal(WorkflowPlatformFreezeCompatibility.length, 5);
});

test("task compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(WorkflowPlatformTaskCompatibility), true);
  assert.equal(WorkflowPlatformTaskCompatibility.length, 2);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildWorkflowPlatformFreezeManifest()), true);
  assert.equal(Object.isFrozen(runWorkflowPlatformFreeze()), true);
});

test("deterministic output", () => {
  assert.deepEqual(
    buildWorkflowPlatformFreezeManifest(),
    buildWorkflowPlatformFreezeManifest(),
  );
  assert.deepEqual(
    runWorkflowPlatformFreeze(),
    runWorkflowPlatformFreeze(),
  );
  assert.deepEqual(
    getWorkflowPlatformFreezeSummary(),
    getWorkflowPlatformFreezeSummary(),
  );
});

test("public API stability", () => {
  const manifest = buildWorkflowPlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});

test("compatibility with OPS-1 and OPS-2 public platforms", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(
    WorkflowPlatformFreezeCompatibility[0]?.target,
    "OPS-1 Public Platform",
  );
  assert.equal(
    WorkflowPlatformTaskCompatibility[0]?.target,
    "OPS-2 Task Intelligence Public Platform",
  );
});
