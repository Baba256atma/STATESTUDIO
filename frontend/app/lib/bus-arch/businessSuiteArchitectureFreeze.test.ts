import assert from "node:assert/strict";
import test from "node:test";

import {
  BusinessSuiteArchitectureCompatibility,
  buildBusinessSuiteArchitectureFreezeManifest,
  getBusinessSuiteArchitectureState,
  runBusinessSuiteArchitectureCertification,
  runBusinessSuiteArchitectureFreeze,
  runBusinessSuiteArchitectureRegression,
} from "./businessSuiteArchitectureFreezeIndex.ts";

test("certification passes", () => {
  const certification = runBusinessSuiteArchitectureCertification();

  assert.equal(certification.status, "PASS");
  assert.equal(certification.diagnostics.length, 0);
});

test("regression passes", () => {
  const regression = runBusinessSuiteArchitectureRegression();

  assert.equal(regression.status, "PASS");
  assert.equal(regression.phaseResults.length, 5);
});

test("freeze passes", () => {
  const freeze = runBusinessSuiteArchitectureFreeze();

  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.certificationStatus, "Certified");
  assert.equal(freeze.freezeStatus, "Frozen");
  assert.equal(freeze.releaseStatus, "Released");
});

test("compatibility matrix complete", () => {
  assert.equal(BusinessSuiteArchitectureCompatibility.length, 19);
  assert.equal(BusinessSuiteArchitectureCompatibility.some((entry) => entry.targetId === "BUS-ARCH-5"), true);
});

test("release metadata valid", () => {
  const manifest = buildBusinessSuiteArchitectureFreezeManifest();

  assert.equal(manifest.releaseMetadata.releaseState, "Certified, Frozen, Released");
  assert.equal(manifest.releaseMetadata.version, "1.0.0");
});

test("public APIs exported", () => {
  assert.equal(typeof buildBusinessSuiteArchitectureFreezeManifest, "function");
  assert.equal(typeof runBusinessSuiteArchitectureCertification, "function");
  assert.equal(typeof runBusinessSuiteArchitectureRegression, "function");
  assert.equal(typeof runBusinessSuiteArchitectureFreeze, "function");
  assert.equal(typeof getBusinessSuiteArchitectureState, "function");
  assert.equal(Array.isArray(BusinessSuiteArchitectureCompatibility), true);
});

test("deterministic outputs", () => {
  const first = buildBusinessSuiteArchitectureFreezeManifest();
  const second = buildBusinessSuiteArchitectureFreezeManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("immutable metadata", () => {
  const manifest = buildBusinessSuiteArchitectureFreezeManifest();
  const state = getBusinessSuiteArchitectureState();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(state), true);
});

test("architecture officially certified", () => {
  const state = getBusinessSuiteArchitectureState();

  assert.equal(state.certificationStatus, "Certified");
  assert.equal(state.freezeStatus, "Frozen");
  assert.equal(state.releaseStatus, "Released");
});
