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
  buildProjectPlatformFreezeManifest,
  getProjectPlatformFreezeSummary,
  runProjectPlatformFreeze,
  ProjectPlatformFreezeCompatibility,
  ProjectPlatformRegressionMetadata,
  ProjectPlatformTaskCompatibility,
  ProjectPlatformWorkflowCompatibility,
} from "./projectPlatformFreezeIndex.ts";

test("freeze manifest builds", () => {
  const manifest = buildProjectPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeId, "OPS-4:8");
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
});

test("freeze runner returns PASS", () => {
  const result = runProjectPlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 10);
});

test("certification dependency is PASS", () => {
  assert.equal(
    buildProjectPlatformFreezeManifest().certificationDependency.certificationStatus,
    "PASS",
  );
});

test("regression metadata exists", () => {
  assert.equal(Object.isFrozen(ProjectPlatformRegressionMetadata), true);
  assert.equal(ProjectPlatformRegressionMetadata.length, 10);
});

test("project compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(ProjectPlatformFreezeCompatibility), true);
  assert.equal(ProjectPlatformFreezeCompatibility.length, 3);
});

test("task compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(ProjectPlatformTaskCompatibility), true);
  assert.equal(ProjectPlatformTaskCompatibility.length, 2);
});

test("workflow compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(ProjectPlatformWorkflowCompatibility), true);
  assert.equal(ProjectPlatformWorkflowCompatibility.length, 2);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildProjectPlatformFreezeManifest()), true);
  assert.equal(Object.isFrozen(runProjectPlatformFreeze()), true);
});

test("deterministic output", () => {
  assert.deepEqual(
    buildProjectPlatformFreezeManifest(),
    buildProjectPlatformFreezeManifest(),
  );
  assert.deepEqual(
    runProjectPlatformFreeze(),
    runProjectPlatformFreeze(),
  );
  assert.deepEqual(
    getProjectPlatformFreezeSummary(),
    getProjectPlatformFreezeSummary(),
  );
});

test("public API stability", () => {
  const manifest = buildProjectPlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});

test("compatibility with OPS-1, OPS-2, and OPS-3 public platforms", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ProjectPlatformFreezeCompatibility[0]?.target, "OPS-1 Public Platform");
});

