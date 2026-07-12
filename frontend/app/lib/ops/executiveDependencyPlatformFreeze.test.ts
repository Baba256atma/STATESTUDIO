import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveDependencyPlatformCertifiedPhaseRegistry,
  ExecutiveDependencyPlatformFreezeCompatibility,
  ExecutiveDependencyPlatformFreezeRegistry,
  ExecutiveDependencyPlatformRegressionMetadata,
  buildExecutiveDependencyPlatformFreezeManifest,
  getExecutiveDependencyPlatformFreezeStatus,
  getExecutiveDependencyPlatformFreezeSummary,
  runExecutiveDependencyPlatformFreeze,
  validateExecutiveDependencyPlatformFreeze,
} from "./executiveDependencyPlatformFreezeIndex.ts";

test("freeze registry", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyPlatformFreezeRegistry), true);
  assert.equal(ExecutiveDependencyPlatformFreezeRegistry.freezeId, "OPS-7:8");
  assert.equal(ExecutiveDependencyPlatformCertifiedPhaseRegistry.length, 7);
});

test("freeze compatibility", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyPlatformFreezeCompatibility), true);
  assert.equal(ExecutiveDependencyPlatformFreezeCompatibility.internal.length, 7);
  assert.equal(
    ExecutiveDependencyPlatformFreezeCompatibility.crossPlatform.length,
    5,
  );
});

test("freeze manifest", () => {
  const manifest = buildExecutiveDependencyPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeId, "OPS-7:8");
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
});

test("freeze validation", () => {
  const validation = validateExecutiveDependencyPlatformFreeze();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("freeze runner", () => {
  const result = runExecutiveDependencyPlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 19);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildExecutiveDependencyPlatformFreezeManifest()), true);
  assert.equal(Object.isFrozen(runExecutiveDependencyPlatformFreeze()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    buildExecutiveDependencyPlatformFreezeManifest(),
    buildExecutiveDependencyPlatformFreezeManifest(),
  );
  assert.deepEqual(
    runExecutiveDependencyPlatformFreeze(),
    runExecutiveDependencyPlatformFreeze(),
  );
  assert.deepEqual(
    getExecutiveDependencyPlatformFreezeSummary(),
    getExecutiveDependencyPlatformFreezeSummary(),
  );
});

test("release summary", () => {
  const manifest = buildExecutiveDependencyPlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});

test("extension policy", () => {
  assert.equal(
    buildExecutiveDependencyPlatformFreezeManifest().extensionPolicy.status,
    "Locked",
  );
});

test("regression summary", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyPlatformRegressionMetadata), true);
  assert.equal(ExecutiveDependencyPlatformRegressionMetadata.length, 13);
});

test("public API stability", () => {
  assert.equal(getExecutiveDependencyPlatformFreezeStatus(), "PASS");
  assert.equal(
    buildExecutiveDependencyPlatformFreezeManifest().metadataOnlySummary.publicApiStable,
    true,
  );
});
