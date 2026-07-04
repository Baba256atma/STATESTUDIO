import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveContextBuilder } from "./executiveContextIndex.ts";
import { ExecutiveContextQueryLayer } from "./executiveContextQueryIndex.ts";
import { ExecutiveContextCertificationLayer } from "./executiveContextCertificationIndex.ts";
import {
  EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX,
  EXECUTIVE_CONTEXT_EXTENSION_POLICY,
  EXECUTIVE_CONTEXT_PHASE_REGISTRY,
  EXECUTIVE_CONTEXT_PLATFORM_IDENTITY,
  EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY,
  ExecutiveContextPlatformFreeze,
  buildExecutiveContextPlatformFreezeManifest,
  getExecutiveContextPlatformFreezeState,
  isExecutiveContextPlatformCompatibilityMatrixValid,
  isExecutiveContextPlatformFreezeManifestValid,
  listExecutiveContextPlatformPhases,
  listExecutiveContextPlatformPublicApis,
  runExecutiveContextPlatformFreeze,
} from "./executiveContextPlatformFreezeIndex.ts";

test("publishes executive context platform identity", () => {
  assert.equal(EXECUTIVE_CONTEXT_PLATFORM_IDENTITY.platformId, "nexora-executive-context-platform");
  assert.equal(EXECUTIVE_CONTEXT_PLATFORM_IDENTITY.version, "APP-CTX-4");
  assert.equal(EXECUTIVE_CONTEXT_PLATFORM_IDENTITY.runtimeBehavior, false);
});

test("publishes executive context phase registry", () => {
  assert.equal(EXECUTIVE_CONTEXT_PHASE_REGISTRY.length, 4);
  assert.equal(EXECUTIVE_CONTEXT_PHASE_REGISTRY[3].phaseId, "APP-CTX-4");
});

test("publishes executive context public API registry", () => {
  const apiKeys = EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY.map((entry) => `${entry.phaseId}:${entry.apiName}`);

  assert.equal(apiKeys.includes("APP-CTX-4:ExecutiveContextPlatformFreeze"), true);
  assert.equal(new Set(apiKeys).size, apiKeys.length);
});

test("publishes executive context compatibility matrix", () => {
  assert.equal(EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX.length, 15);
  assert.equal(isExecutiveContextPlatformCompatibilityMatrixValid(), true);
  assert.equal(EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "APP-DOM Platform Freeze"), true);
  assert.equal(EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "DOM Platform Freeze"), true);
});

test("publishes executive context extension policy", () => {
  assert.equal(EXECUTIVE_CONTEXT_EXTENSION_POLICY.allowsNewContextSections, true);
  assert.equal(EXECUTIVE_CONTEXT_EXTENSION_POLICY.allowsExecutiveReasoning, false);
  assert.equal(EXECUTIVE_CONTEXT_EXTENSION_POLICY.allowsRecommendations, false);
  assert.equal(EXECUTIVE_CONTEXT_EXTENSION_POLICY.allowsRuntimeMutation, false);
});

test("builds executive context platform freeze manifest", () => {
  const manifest = buildExecutiveContextPlatformFreezeManifest();

  assert.equal(manifest.certificationDependency, "PASS");
  assert.equal(manifest.regressionDependency, "PASS");
  assert.equal(manifest.metadataOnly, true);
});

test("validates executive context platform freeze manifest", () => {
  assert.equal(isExecutiveContextPlatformFreezeManifestValid(buildExecutiveContextPlatformFreezeManifest()), true);
});

test("runs executive context platform freeze", () => {
  assert.equal(runExecutiveContextPlatformFreeze().status, "PASS");
});

test("returns executive context platform freeze state", () => {
  const state = getExecutiveContextPlatformFreezeState();

  assert.equal(state.status, "PASS");
  assert.equal(state.checks.every((check) => check.passed), true);
  assert.equal(Object.isFrozen(state), true);
});

test("uses deterministic executive context platform fingerprint", () => {
  const first = buildExecutiveContextPlatformFreezeManifest();
  const second = buildExecutiveContextPlatformFreezeManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("exports public executive context platform APIs", () => {
  assert.equal(typeof ExecutiveContextPlatformFreeze.buildExecutiveContextPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveContextPlatformFreeze.runExecutiveContextPlatformFreeze, "function");
  assert.equal(Object.isFrozen(ExecutiveContextPlatformFreeze), true);
  assert.equal(listExecutiveContextPlatformPhases().length, 4);
  assert.equal(listExecutiveContextPlatformPublicApis().length > 0, true);
});

test("keeps APP-CTX-1 compatibility", () => {
  assert.equal(ExecutiveContextBuilder.isExecutiveContextValid(ExecutiveContextBuilder.createExecutiveContext()), true);
});

test("keeps APP-CTX-2 compatibility", () => {
  const snapshot = ExecutiveContextQueryLayer.buildExecutiveContextSnapshot(ExecutiveContextBuilder.createExecutiveContext());

  assert.equal(ExecutiveContextQueryLayer.validateExecutiveContextSnapshot(snapshot).valid, true);
});

test("keeps APP-CTX-3 compatibility", () => {
  assert.equal(ExecutiveContextCertificationLayer.runExecutiveContextCertification().status, "PASS");
});

test("keeps APP-DOM compatibility", () => {
  assert.equal(ExecutiveContextBuilder.buildExecutiveContextManifest().consumedAppDomainPlatform, "APP-DOM-4");
});

test("keeps DOM compatibility through APP-DOM metadata", () => {
  assert.equal(EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "DOM Platform Freeze"), true);
});

test("does not expose runtime intelligence behavior", () => {
  const apiNames = EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY.map((entry) => entry.apiName).join(" ");

  assert.equal(apiNames.includes("execute"), false);
  assert.equal(apiNames.includes("infer"), false);
  assert.equal(apiNames.includes("score"), false);
  assert.equal(apiNames.includes("rank"), false);
});
