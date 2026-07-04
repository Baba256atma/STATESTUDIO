import assert from "node:assert/strict";
import test from "node:test";

import { AppDomainBridge } from "./appDomainBridgeIndex.ts";
import { AppDomainMappingLayer } from "./appDomainMappingIndex.ts";
import { AppDomainContextLayer } from "./appDomainContextIndex.ts";
import {
  APP_DOMAIN_COMPATIBILITY_MATRIX,
  APP_DOMAIN_EXTENSION_POLICY,
  APP_DOMAIN_PHASE_REGISTRY,
  APP_DOMAIN_PLATFORM_IDENTITY,
  APP_DOMAIN_PUBLIC_API_REGISTRY,
  APP_DOMAIN_RELEASE_METADATA,
  AppDomainPlatformFreeze,
  buildAppDomainPlatformManifest,
  getAppDomainPlatformFreezeState,
  isAppDomainPlatformCompatibilityMatrixValid,
  isAppDomainPlatformManifestValid,
  listAppDomainPlatformPhases,
  listAppDomainPlatformPublicApis,
  runAppDomainPlatformCertification,
  runAppDomainPlatformFreeze,
  runAppDomainPlatformRegression,
} from "./appDomainPlatformFreezeIndex.ts";

test("publishes APP-DOM platform identity", () => {
  assert.equal(APP_DOMAIN_PLATFORM_IDENTITY.platformId, "nexora-app-domain-consumer-platform");
  assert.equal(APP_DOMAIN_PLATFORM_IDENTITY.version, "APP-DOM-4");
  assert.equal(APP_DOMAIN_PLATFORM_IDENTITY.metadataOnly, true);
  assert.equal(APP_DOMAIN_PLATFORM_IDENTITY.runtimeBehavior, false);
});

test("publishes APP-DOM phase registry", () => {
  assert.equal(APP_DOMAIN_PHASE_REGISTRY.length, 4);
  assert.equal(APP_DOMAIN_PHASE_REGISTRY[3].phaseId, "APP-DOM-4");
  assert.equal(APP_DOMAIN_PHASE_REGISTRY.every((entry) => entry.metadataOnly), true);
});

test("publishes APP-DOM public API registry", () => {
  const apiKeys = APP_DOMAIN_PUBLIC_API_REGISTRY.map((entry) => `${entry.phaseId}:${entry.apiName}`);

  assert.equal(apiKeys.includes("APP-DOM-4:AppDomainPlatformFreeze"), true);
  assert.equal(new Set(apiKeys).size, apiKeys.length);
  assert.equal(APP_DOMAIN_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly), true);
});

test("publishes APP-DOM compatibility matrix", () => {
  assert.equal(APP_DOMAIN_COMPATIBILITY_MATRIX.length, 14);
  assert.equal(isAppDomainPlatformCompatibilityMatrixValid(), true);
  assert.equal(APP_DOMAIN_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "DomainExpertisePlatformFreeze"), true);
  assert.equal(APP_DOMAIN_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "Future APP engines"), true);
});

test("publishes APP-DOM extension policy", () => {
  assert.equal(APP_DOMAIN_EXTENSION_POLICY.allowsNewConsumerUtilities, true);
  assert.equal(APP_DOMAIN_EXTENSION_POLICY.allowsExecutiveReasoning, false);
  assert.equal(APP_DOMAIN_EXTENSION_POLICY.allowsRecommendations, false);
  assert.equal(APP_DOMAIN_EXTENSION_POLICY.allowsRuntimeExecution, false);
  assert.equal(APP_DOMAIN_EXTENSION_POLICY.allowsDomainMutations, false);
});

test("publishes APP-DOM release metadata", () => {
  assert.equal(APP_DOMAIN_RELEASE_METADATA.releaseVersion, "APP-DOM-4");
  assert.equal(APP_DOMAIN_RELEASE_METADATA.certificationDependency, "APP-DOM-1 through APP-DOM-3");
  assert.equal(APP_DOMAIN_RELEASE_METADATA.immutable, true);
});

test("builds APP-DOM platform manifest", () => {
  const manifest = buildAppDomainPlatformManifest();

  assert.equal(manifest.certificationStatus, "PASS");
  assert.equal(manifest.regressionStatus, "PASS");
  assert.equal(manifest.metadataOnly, true);
});

test("validates APP-DOM platform manifest", () => {
  assert.equal(isAppDomainPlatformManifestValid(buildAppDomainPlatformManifest()), true);
});

test("passes APP-DOM platform certification", () => {
  const certification = runAppDomainPlatformCertification();

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.length, 10);
  assert.equal(certification.gates.every((gate) => gate.passed), true);
});

test("passes APP-DOM platform regression", () => {
  const regression = runAppDomainPlatformRegression();

  assert.equal(regression.status, "PASS");
  assert.equal(regression.failed, 0);
  assert.equal(regression.entries.length, 4);
});

test("runs APP-DOM platform freeze with PASS", () => {
  assert.equal(runAppDomainPlatformFreeze().status, "PASS");
});

test("returns APP-DOM platform freeze state", () => {
  const state = getAppDomainPlatformFreezeState();

  assert.equal(state.status, "PASS");
  assert.equal(state.checks.every((check) => check.passed), true);
  assert.equal(Object.isFrozen(state), true);
});

test("uses deterministic APP-DOM platform fingerprint", () => {
  const first = buildAppDomainPlatformManifest();
  const second = buildAppDomainPlatformManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("exports public APP-DOM freeze APIs", () => {
  assert.equal(typeof AppDomainPlatformFreeze.buildAppDomainPlatformManifest, "function");
  assert.equal(typeof AppDomainPlatformFreeze.runAppDomainPlatformCertification, "function");
  assert.equal(typeof AppDomainPlatformFreeze.runAppDomainPlatformFreeze, "function");
  assert.equal(Object.isFrozen(AppDomainPlatformFreeze), true);
  assert.equal(listAppDomainPlatformPhases().length, 4);
  assert.equal(listAppDomainPlatformPublicApis().length > 0, true);
});

test("keeps APP-DOM-1 compatibility", () => {
  assert.equal(AppDomainBridge.createAppDomainBridge().state.status, "ready");
});

test("keeps APP-DOM-2 compatibility", () => {
  assert.equal(AppDomainMappingLayer.buildAppDomainMapping().validation.valid, true);
});

test("keeps APP-DOM-3 compatibility", () => {
  assert.equal(AppDomainContextLayer.validateDomainContext(AppDomainContextLayer.createDomainContext()).valid, true);
});

test("keeps DOM compatibility", () => {
  assert.equal(AppDomainBridge.isDomainPlatformCompatible().compatible, true);
});

test("does not expose runtime intelligence behavior", () => {
  const apiNames = APP_DOMAIN_PUBLIC_API_REGISTRY.map((entry) => entry.apiName).join(" ");

  assert.equal(apiNames.includes("execute"), false);
  assert.equal(apiNames.includes("infer"), false);
  assert.equal(apiNames.includes("score"), false);
  assert.equal(apiNames.includes("rank"), false);
  assert.equal(apiNames.includes("generate"), false);
});
