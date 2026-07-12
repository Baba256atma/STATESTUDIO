import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import {
  buildTaskPlatformFreezeManifest,
  getTaskPlatformFreezeSummary,
  runTaskPlatformFreeze,
  TaskPlatformFreezeCompatibility,
  TaskPlatformRegressionMetadata,
} from "./taskPlatformFreezeIndex.ts";

test("freeze manifest builds", () => {
  const manifest = buildTaskPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeId, "OPS-2:8");
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
});

test("freeze runner returns PASS", () => {
  const result = runTaskPlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 8);
});

test("certification dependency is PASS", () => {
  assert.equal(
    buildTaskPlatformFreezeManifest().certificationDependency.certificationStatus,
    "PASS",
  );
});

test("regression metadata exists", () => {
  assert.equal(Object.isFrozen(TaskPlatformRegressionMetadata), true);
  assert.equal(TaskPlatformRegressionMetadata.length, 8);
});

test("compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(TaskPlatformFreezeCompatibility), true);
  assert.equal(TaskPlatformFreezeCompatibility.length, 6);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildTaskPlatformFreezeManifest()), true);
  assert.equal(Object.isFrozen(runTaskPlatformFreeze()), true);
});

test("deterministic output", () => {
  assert.deepEqual(
    buildTaskPlatformFreezeManifest(),
    buildTaskPlatformFreezeManifest(),
  );
  assert.deepEqual(
    runTaskPlatformFreeze(),
    runTaskPlatformFreeze(),
  );
  assert.deepEqual(
    getTaskPlatformFreezeSummary(),
    getTaskPlatformFreezeSummary(),
  );
});

test("public API stability", () => {
  const manifest = buildTaskPlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});

test("compatibility with OPS-1 public platform", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(TaskPlatformFreezeCompatibility[0]?.target, "OPS-1 Public Platform");
});
