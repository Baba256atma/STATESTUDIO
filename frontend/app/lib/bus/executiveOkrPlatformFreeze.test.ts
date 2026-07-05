import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveOkrPlatformFreeze,
  buildExecutiveOkrPlatformFreezeManifest,
  getExecutiveOkrPlatformCompatibilityMatrix,
  getExecutiveOkrPlatformExtensionPolicy,
  getExecutiveOkrPlatformFreezeState,
  runExecutiveOkrPlatformCertification,
  runExecutiveOkrPlatformFreeze,
  runExecutiveOkrPlatformRegression,
} from "./executiveOkrPlatformFreezeIndex.ts";

test("certification passes", () => {
  const certification = runExecutiveOkrPlatformCertification();

  assert.equal(certification.status, "PASS");
  assert.equal(certification.diagnostics.length, 0);
});

test("regression passes", () => {
  const regression = runExecutiveOkrPlatformRegression();

  assert.equal(regression.status, "PASS");
  assert.equal(regression.totalEntries, 15);
  assert.equal(regression.failedEntries, 0);
});

test("freeze passes", () => {
  const freeze = runExecutiveOkrPlatformFreeze();

  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.finalState, "Certified Frozen Released");
});

test("manifest valid", () => {
  const manifest = buildExecutiveOkrPlatformFreezeManifest();

  assert.equal(manifest.platformIdentity.platformId, "BUS-OKR");
  assert.equal(manifest.phaseRegistry.length, 16);
  assert.equal(manifest.regressionEntryCount, 15);
  assert.equal(manifest.certificationGateCount >= 13, true);
});

test("registry and compatibility valid", () => {
  const compatibility = getExecutiveOkrPlatformCompatibilityMatrix();

  assert.equal(compatibility.length >= 9, true);
  assert.equal(compatibility.some((entry) => entry.targetLayer === "BUS-15 Executive OKR Alignment Platform"), true);
});

test("public APIs exported", () => {
  assert.equal(typeof ExecutiveOkrPlatformFreeze.buildExecutiveOkrPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveOkrPlatformFreeze.runExecutiveOkrPlatformCertification, "function");
  assert.equal(typeof ExecutiveOkrPlatformFreeze.runExecutiveOkrPlatformRegression, "function");
  assert.equal(typeof ExecutiveOkrPlatformFreeze.runExecutiveOkrPlatformFreeze, "function");
  assert.equal(typeof ExecutiveOkrPlatformFreeze.getExecutiveOkrPlatformFreezeState, "function");
});

test("platform identity and release metadata valid", () => {
  const manifest = buildExecutiveOkrPlatformFreezeManifest();

  assert.equal(manifest.releaseMetadata.releaseVersion, "BUS-16");
  assert.equal(manifest.releaseMetadata.certificationStatus, "Certified");
  assert.equal(manifest.releaseMetadata.freezeStatus, "Frozen");
  assert.equal(manifest.releaseMetadata.releaseStatus, "Released");
});

test("extension policy valid", () => {
  const extensionPolicy = getExecutiveOkrPlatformExtensionPolicy();

  assert.equal(extensionPolicy.requiresPublicApiConsumption, true);
  assert.equal(extensionPolicy.allowsOkrExecution, false);
  assert.equal(extensionPolicy.allowsRuntimeExecution, false);
});

test("deterministic outputs and immutable metadata", () => {
  const first = buildExecutiveOkrPlatformFreezeManifest();
  const second = buildExecutiveOkrPlatformFreezeManifest();
  const state = getExecutiveOkrPlatformFreezeState();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(state), true);
});
