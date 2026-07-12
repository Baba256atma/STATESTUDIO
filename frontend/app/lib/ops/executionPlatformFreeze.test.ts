import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExecutionPlatformFreezeManifest,
  ExecutionPlatformFreezeCompatibility,
  ExecutionPlatformRegressionMetadata,
  getExecutionPlatformFreezeSummary,
  runExecutionPlatformFreeze,
} from "./executionPlatformFreezeIndex.ts";

test("freeze manifest builds", () => {
  const manifest = buildExecutionPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeId, "OPS-1:8");
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
});

test("freeze runner returns PASS", () => {
  const result = runExecutionPlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 8);
});

test("certification dependency is PASS", () => {
  assert.equal(
    buildExecutionPlatformFreezeManifest().certificationDependency.certificationStatus,
    "PASS",
  );
});

test("regression metadata exists", () => {
  assert.equal(Object.isFrozen(ExecutionPlatformRegressionMetadata), true);
  assert.equal(ExecutionPlatformRegressionMetadata.length, 8);
});

test("compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(ExecutionPlatformFreezeCompatibility), true);
  assert.equal(ExecutionPlatformFreezeCompatibility.length, 6);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildExecutionPlatformFreezeManifest()), true);
  assert.equal(Object.isFrozen(runExecutionPlatformFreeze()), true);
});

test("deterministic output", () => {
  assert.deepEqual(
    buildExecutionPlatformFreezeManifest(),
    buildExecutionPlatformFreezeManifest(),
  );
  assert.deepEqual(
    runExecutionPlatformFreeze(),
    runExecutionPlatformFreeze(),
  );
  assert.deepEqual(
    getExecutionPlatformFreezeSummary(),
    getExecutionPlatformFreezeSummary(),
  );
});

test("public API stability", () => {
  const manifest = buildExecutionPlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});
