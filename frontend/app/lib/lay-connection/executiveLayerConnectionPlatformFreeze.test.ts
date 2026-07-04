import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveLayerConnectionPlatformFreeze,
  ExecutiveLayerConnectionPlatformFreezeFacade,
  buildExecutiveLayerConnectionFreezeManifest,
  getExecutiveLayerConnectionCompatibilityMatrix,
  getExecutiveLayerConnectionExtensionPolicy,
  getExecutiveLayerConnectionFreezeState,
  listExecutiveLayerConnectionPhases,
  listExecutiveLayerConnectionPublicApis,
  runExecutiveLayerConnectionCertification,
  runExecutiveLayerConnectionFreeze,
  runExecutiveLayerConnectionRegression,
} from "./executiveLayerConnectionPlatformFreezeIndex.ts";

test("publishes platform freeze identity", () => {
  assert.equal(ExecutiveLayerConnectionPlatformFreeze.platformId, "executive-layer-connection-platform-freeze");
  assert.equal(ExecutiveLayerConnectionPlatformFreeze.releaseMetadata.platformVersion, "LAY-CONN-12");
  assert.equal(ExecutiveLayerConnectionPlatformFreeze.releaseMetadata.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveLayerConnectionPlatformFreeze), true);
});

test("publishes phase registry", () => {
  const phases = listExecutiveLayerConnectionPhases();

  assert.equal(phases.length, 11);
  assert.equal(phases.every((phase) => phase.required && phase.certified), true);
  assert.equal(phases.some((phase) => phase.phaseId === "LAY-CONN-11"), true);
});

test("publishes public api registry", () => {
  const publicApis = listExecutiveLayerConnectionPublicApis();

  assert.equal(publicApis.length, 10);
  assert.equal(publicApis.every((api) => api.stable), true);
  assert.equal(publicApis.some((api) => api.apiName === "runExecutiveLayerConnectionFreeze"), true);
});

test("publishes compatibility matrix", () => {
  const compatibility = getExecutiveLayerConnectionCompatibilityMatrix();

  assert.equal(compatibility.length, 11);
  assert.equal(compatibility.every((entry) => entry.compatible && entry.required && entry.mode === "certified"), true);
  assert.equal(compatibility.some((entry) => entry.platformId === "LAY-CONN-10"), true);
});

test("publishes extension policy", () => {
  const policy = getExecutiveLayerConnectionExtensionPolicy();

  assert.equal(policy.extensionMode, "additive-only");
  assert.equal(policy.certifiedPhaseMutationAllowed, false);
  assert.equal(policy.runtimeBehaviorAllowed, false);
});

test("runs regression", () => {
  const regression = runExecutiveLayerConnectionRegression();

  assert.equal(regression.status, "PASS");
  assert.equal(regression.entries.length, 11);
  assert.equal(regression.entries.every((entry) => entry.passed), true);
});

test("runs certification", () => {
  const certification = runExecutiveLayerConnectionCertification();

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.length, 10);
  assert.equal(certification.gates.every((gate) => gate.passed), true);
});

test("generates freeze manifest", () => {
  const manifest = buildExecutiveLayerConnectionFreezeManifest();

  assert.equal(manifest.platformId, "executive-layer-connection-platform-freeze");
  assert.equal(manifest.platformVersion, "LAY-CONN-12");
  assert.equal(manifest.certifiedPhases.length, 11);
  assert.equal(manifest.certificationResult.status, "PASS");
  assert.equal(manifest.freezeState.status, "Frozen");
  assert.equal(Object.isFrozen(manifest), true);
});

test("publishes freeze state", () => {
  const state = getExecutiveLayerConnectionFreezeState();

  assert.equal(state.status, "Frozen");
  assert.equal(state.certificationStatus, "PASS");
  assert.equal(state.regressionStatus, "PASS");
  assert.equal(state.declaration, "The Executive Layer Connection Platform is Certified, Frozen, and Released.");
});

test("runs freeze", () => {
  const state = runExecutiveLayerConnectionFreeze();

  assert.equal(state.status, "Frozen");
  assert.equal(state.immutable, true);
});

test("exports public freeze APIs", () => {
  assert.equal(typeof ExecutiveLayerConnectionPlatformFreezeFacade.buildExecutiveLayerConnectionFreezeManifest, "function");
  assert.equal(typeof ExecutiveLayerConnectionPlatformFreezeFacade.runExecutiveLayerConnectionCertification, "function");
  assert.equal(typeof ExecutiveLayerConnectionPlatformFreezeFacade.runExecutiveLayerConnectionRegression, "function");
  assert.equal(typeof ExecutiveLayerConnectionPlatformFreezeFacade.runExecutiveLayerConnectionFreeze, "function");
  assert.equal(typeof ExecutiveLayerConnectionPlatformFreezeFacade.getExecutiveLayerConnectionFreezeState, "function");
  assert.equal(typeof ExecutiveLayerConnectionPlatformFreezeFacade.listExecutiveLayerConnectionPhases, "function");
});

test("preserves deterministic behavior", () => {
  const first = buildExecutiveLayerConnectionFreezeManifest();
  const second = buildExecutiveLayerConnectionFreezeManifest();

  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.deepEqual(first.certifiedPhases, second.certifiedPhases);
});
