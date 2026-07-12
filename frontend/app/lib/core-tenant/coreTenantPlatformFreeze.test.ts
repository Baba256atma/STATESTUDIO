import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExecutiveTenantPlatformFreezeManifest,
  CORE_TENANT_PLATFORM_COMPATIBILITY_MATRIX,
  CORE_TENANT_PLATFORM_DEPENDENCY_REGISTRY,
  CORE_TENANT_PLATFORM_EXTENSION_POLICY,
  CORE_TENANT_PLATFORM_PHASE_REGISTRY,
  CORE_TENANT_PLATFORM_PUBLIC_API_REGISTRY,
  ExecutiveTenantPlatformFreeze,
  getExecutiveTenantCompatibilityMatrix,
  getExecutiveTenantExtensionPolicy,
  getExecutiveTenantPlatformState,
  runExecutiveTenantPlatformFreeze,
} from "./coreTenantPlatformFreezeIndex.ts";

test("TEN-1 through TEN-7 consumed", () => {
  const manifest = buildExecutiveTenantPlatformFreezeManifest();

  assert.equal(manifest.certificationReference.certifiedContracts.length, 7);
  assert.equal(manifest.dependencyRegistry.length, 7);
});

test("certification reference verified", () => {
  const manifest = buildExecutiveTenantPlatformFreezeManifest();

  assert.equal(manifest.certificationReference.certificationPhaseId, "CORE-TEN-7");
  assert.equal(manifest.certificationReference.certificationStatus, "PASS");
});

test("freeze manifest builds deterministically", () => {
  const first = buildExecutiveTenantPlatformFreezeManifest();
  const second = buildExecutiveTenantPlatformFreezeManifest();

  assert.equal(first.platformId, "CORE-TEN-8");
  assert.equal(first.platformNamespace, "nexora.core.tenant.freeze");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(Object.isFrozen(first), true);
});

test("compatibility matrix complete", () => {
  assert.equal(CORE_TENANT_PLATFORM_COMPATIBILITY_MATRIX.length, 14);
  assert.equal(getExecutiveTenantCompatibilityMatrix().every((entry) => entry.compatible), true);
});

test("extension policy published", () => {
  const policy = getExecutiveTenantExtensionPolicy();

  assert.equal(policy.policyId, "core-tenant-platform-extension-policy");
  assert.equal(policy.publicApiConsumptionOnly, true);
  assert.equal(policy.runtimeExecutionAllowed, false);
  assert.equal(policy.persistenceAllowed, false);
});

test("public api, phase, and dependency registries complete", () => {
  assert.equal(CORE_TENANT_PLATFORM_PUBLIC_API_REGISTRY.length > 0, true);
  assert.equal(CORE_TENANT_PLATFORM_PHASE_REGISTRY.length, 8);
  assert.equal(CORE_TENANT_PLATFORM_DEPENDENCY_REGISTRY.length, 7);
});

test("regression summary and freeze state published", () => {
  const manifest = buildExecutiveTenantPlatformFreezeManifest();
  const state = getExecutiveTenantPlatformState();

  assert.equal(manifest.regressionSummary.status, "PASS");
  assert.equal(state.freezeState, "FROZEN");
  assert.equal(state.releaseState, "RELEASED");
});

test("freeze runner and public api work", () => {
  const freeze = runExecutiveTenantPlatformFreeze();

  assert.equal(freeze.manifest.release.releaseState, "CERTIFIED_FROZEN_RELEASED");
  assert.equal(typeof ExecutiveTenantPlatformFreeze.buildExecutiveTenantPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveTenantPlatformFreeze.runExecutiveTenantPlatformFreeze, "function");
  assert.equal(typeof ExecutiveTenantPlatformFreeze.getExecutiveTenantPlatformState, "function");
});

test("no runtime behavior exists", () => {
  assert.equal(CORE_TENANT_PLATFORM_EXTENSION_POLICY.runtimeIsolationAllowed, false);
  assert.equal("switch" in ExecutiveTenantPlatformFreeze, false);
  assert.equal("authenticate" in ExecutiveTenantPlatformFreeze, false);
  assert.equal("persist" in ExecutiveTenantPlatformFreeze, false);
  assert.equal(Object.isFrozen(ExecutiveTenantPlatformFreeze), true);
});

