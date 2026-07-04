import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { ExecutiveReasoningFoundation } from "./executiveReasoningIndex.ts";
import { ExecutiveReasoningQueryLayer } from "./executiveReasoningQueryIndex.ts";
import { ExecutiveReasoningCertificationLayer } from "./executiveReasoningCertificationIndex.ts";
import {
  EXECUTIVE_REASONING_EXTENSION_POLICY,
  EXECUTIVE_REASONING_PHASE_REGISTRY,
  EXECUTIVE_REASONING_PLATFORM_IDENTITY,
  EXECUTIVE_REASONING_PUBLIC_API_REGISTRY,
  EXECUTIVE_REASONING_RELEASE_METADATA,
  ExecutiveReasoningPlatformFreeze,
  buildExecutiveReasoningPlatformFreezeManifest,
  getExecutiveReasoningPlatformCompatibilityMatrix,
  getExecutiveReasoningPlatformFreezeState,
  isExecutiveReasoningPlatformCompatibilityMatrixValid,
  isExecutiveReasoningPlatformFreezeManifestValid,
  listExecutiveReasoningPlatformPhases,
  listExecutiveReasoningPlatformPublicApis,
  runExecutiveReasoningPlatformFreeze,
} from "./executiveReasoningPlatformFreezeIndex.ts";

test("publishes platform identity", () => {
  assert.equal(EXECUTIVE_REASONING_PLATFORM_IDENTITY.platformId, "nexora-executive-reasoning-platform");
  assert.equal(EXECUTIVE_REASONING_PLATFORM_IDENTITY.version, "APP-REASON-4");
  assert.equal(EXECUTIVE_REASONING_PLATFORM_IDENTITY.releaseStage, "frozen");
  assert.equal(EXECUTIVE_REASONING_PLATFORM_IDENTITY.runtimeBehavior, false);
});

test("publishes phase registry", () => {
  assert.equal(EXECUTIVE_REASONING_PHASE_REGISTRY.length, 4);
  assert.deepEqual(
    EXECUTIVE_REASONING_PHASE_REGISTRY.map((entry) => entry.phaseId),
    ["APP-REASON-1", "APP-REASON-2", "APP-REASON-3", "APP-REASON-4"]
  );
  assert.equal(listExecutiveReasoningPlatformPhases()[3].status, "frozen");
});

test("publishes public API registry", () => {
  const apiNames = EXECUTIVE_REASONING_PUBLIC_API_REGISTRY.map((entry) => `${entry.phaseId}:${entry.apiName}`);
  assert.equal(EXECUTIVE_REASONING_PUBLIC_API_REGISTRY.length > 0, true);
  assert.equal(new Set(apiNames).size, apiNames.length);
  assert.equal(listExecutiveReasoningPlatformPublicApis().some((entry) => entry.apiName === "ExecutiveReasoningPlatformFreeze"), true);
});

test("publishes compatibility matrix", () => {
  const matrix = getExecutiveReasoningPlatformCompatibilityMatrix();
  assert.equal(matrix.length, 17);
  assert.equal(matrix.some((entry) => entry.targetLayer === "ExecutiveContextPlatformFreeze"), true);
  assert.equal(matrix.some((entry) => entry.targetLayer === "Future Executive Judgment Platform"), true);
  assert.equal(isExecutiveReasoningPlatformCompatibilityMatrixValid(matrix), true);
});

test("publishes extension policy", () => {
  assert.equal(EXECUTIVE_REASONING_EXTENSION_POLICY.allowsNewReasoningContracts, true);
  assert.equal(EXECUTIVE_REASONING_EXTENSION_POLICY.allowsExecutiveReasoningExecution, false);
  assert.equal(EXECUTIVE_REASONING_EXTENSION_POLICY.allowsRecommendations, false);
  assert.equal(EXECUTIVE_REASONING_EXTENSION_POLICY.allowsRuntimeMutation, false);
});

test("generates freeze manifest", () => {
  const manifest = buildExecutiveReasoningPlatformFreezeManifest();
  assert.equal(manifest.platformIdentity.version, "APP-REASON-4");
  assert.equal(manifest.releaseMetadata.releaseVersion, "APP-REASON-4");
  assert.equal(manifest.certificationDependency, "PASS");
  assert.equal(manifest.regressionDependency, "PASS");
});

test("validates freeze manifest", () => {
  const manifest = buildExecutiveReasoningPlatformFreezeManifest();
  assert.equal(isExecutiveReasoningPlatformFreezeManifestValid(manifest), true);
});

test("runs freeze runner", () => {
  const freeze = runExecutiveReasoningPlatformFreeze();
  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.checks.every((entry) => entry.passed), true);
  assert.equal(freeze.certificationStatus, "PASS");
});

test("returns freeze state", () => {
  const freeze = getExecutiveReasoningPlatformFreezeState();
  assert.equal(freeze.status, "PASS");
  assert.equal(Object.isFrozen(freeze), true);
});

test("uses deterministic fingerprint", () => {
  const left = buildExecutiveReasoningPlatformFreezeManifest();
  const right = buildExecutiveReasoningPlatformFreezeManifest();
  assert.equal(left.fingerprint, right.fingerprint);
});

test("exports public freeze APIs", () => {
  assert.equal(typeof ExecutiveReasoningPlatformFreeze.buildExecutiveReasoningPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveReasoningPlatformFreeze.isExecutiveReasoningPlatformFreezeManifestValid, "function");
  assert.equal(typeof ExecutiveReasoningPlatformFreeze.runExecutiveReasoningPlatformFreeze, "function");
  assert.equal(typeof ExecutiveReasoningPlatformFreeze.getExecutiveReasoningPlatformFreezeState, "function");
  assert.equal(typeof ExecutiveReasoningPlatformFreeze.listExecutiveReasoningPlatformPublicApis, "function");
});

test("keeps APP-REASON-1 compatibility", () => {
  assert.equal(ExecutiveReasoningFoundation.validateExecutiveReasoningFoundation().valid, true);
  assert.equal(ExecutiveReasoningFoundation.validateExecutiveReasoningRegistry(ExecutiveReasoningFoundation.createExecutiveReasoningRegistry()).valid, true);
});

test("keeps APP-REASON-2 compatibility", () => {
  const registry = ExecutiveReasoningFoundation.createExecutiveReasoningRegistry();
  const snapshot = ExecutiveReasoningQueryLayer.buildExecutiveReasoningSnapshot(registry);
  assert.equal(ExecutiveReasoningQueryLayer.validateExecutiveReasoningSnapshot(snapshot).valid, true);
});

test("keeps APP-REASON-3 compatibility", () => {
  assert.equal(ExecutiveReasoningCertificationLayer.runExecutiveReasoningCertification().status, "PASS");
  assert.equal(ExecutiveReasoningCertificationLayer.runExecutiveReasoningRegression().status, "PASS");
});

test("keeps APP-CTX compatibility", () => {
  const manifest = buildExecutiveReasoningPlatformFreezeManifest();
  assert.equal(manifest.compatibilityMatrix.some((entry) => entry.targetLayer === "ExecutiveContextPlatformFreeze"), true);
});

test("keeps APP-DOM compatibility", () => {
  const manifest = buildExecutiveReasoningPlatformFreezeManifest();
  assert.equal(manifest.compatibilityMatrix.some((entry) => entry.targetLayer === "APP-DOM Platform Freeze"), true);
});

test("keeps DOM compatibility", () => {
  const manifest = buildExecutiveReasoningPlatformFreezeManifest();
  assert.equal(manifest.compatibilityMatrix.some((entry) => entry.targetLayer === "DomainExpertisePlatformFreeze"), true);
});

test("publishes release metadata", () => {
  assert.equal(EXECUTIVE_REASONING_RELEASE_METADATA.certificationDependency, "APP-REASON-3");
  assert.equal(EXECUTIVE_REASONING_RELEASE_METADATA.regressionDependency, "APP-REASON regression");
  assert.equal(EXECUTIVE_REASONING_RELEASE_METADATA.deterministic, true);
});

test("is strict TypeScript source without direct internals", () => {
  const sources = [
    readFileSync("app/lib/app-reason/executiveReasoningPlatformFreezeTypes.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningPlatformFreezeRegistry.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningPlatformCompatibility.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningPlatformFreezeManifest.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningPlatformFreezeRunner.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningPlatformFreezeIndex.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes("../app-context/"), false);
  assert.equal(sources.includes("../dom/"), false);
  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("execute reasoning"), false);
});
