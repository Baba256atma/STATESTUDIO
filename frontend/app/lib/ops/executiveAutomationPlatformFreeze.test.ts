import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveAutomationPlatformCertifiedPhaseRegistry,
  ExecutiveAutomationPlatformFreezeCompatibility,
  ExecutiveAutomationPlatformFreezeRegistry,
  ExecutiveAutomationPlatformRegressionMetadata,
  buildExecutiveAutomationPlatformFreezeManifest,
  getExecutiveAutomationPlatformFreezeStatus,
  getExecutiveAutomationPlatformFreezeSummary,
  runExecutiveAutomationPlatformFreeze,
  validateExecutiveAutomationPlatformFreeze,
} from "./executiveAutomationPlatformFreezeIndex.ts";

test("freeze registry", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatformFreezeRegistry), true);
  assert.equal(ExecutiveAutomationPlatformFreezeRegistry.freezeId, "OPS-8:8");
  assert.equal(ExecutiveAutomationPlatformCertifiedPhaseRegistry.length, 7);
});

test("freeze compatibility", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatformFreezeCompatibility), true);
  assert.equal(ExecutiveAutomationPlatformFreezeCompatibility.internal.length, 7);
  assert.equal(
    ExecutiveAutomationPlatformFreezeCompatibility.crossPlatform.length,
    6,
  );
});

test("freeze manifest", () => {
  const manifest = buildExecutiveAutomationPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeId, "OPS-8:8");
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
});

test("freeze validation", () => {
  const validation = validateExecutiveAutomationPlatformFreeze();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("freeze runner", () => {
  const result = runExecutiveAutomationPlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 19);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildExecutiveAutomationPlatformFreezeManifest()), true);
  assert.equal(Object.isFrozen(runExecutiveAutomationPlatformFreeze()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    buildExecutiveAutomationPlatformFreezeManifest(),
    buildExecutiveAutomationPlatformFreezeManifest(),
  );
  assert.deepEqual(
    runExecutiveAutomationPlatformFreeze(),
    runExecutiveAutomationPlatformFreeze(),
  );
  assert.deepEqual(
    getExecutiveAutomationPlatformFreezeSummary(),
    getExecutiveAutomationPlatformFreezeSummary(),
  );
});

test("release summary", () => {
  const manifest = buildExecutiveAutomationPlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});

test("extension policy", () => {
  assert.equal(
    buildExecutiveAutomationPlatformFreezeManifest().extensionPolicy.status,
    "Locked",
  );
});

test("regression summary", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatformRegressionMetadata), true);
  assert.equal(ExecutiveAutomationPlatformRegressionMetadata.length, 14);
});

test("public API stability", () => {
  assert.equal(getExecutiveAutomationPlatformFreezeStatus(), "PASS");
  assert.equal(
    buildExecutiveAutomationPlatformFreezeManifest().metadataOnlySummary.publicApiStable,
    true,
  );
});
