import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import {
  EXECUTIVE_OKR_CAPABILITIES,
  EXECUTIVE_OKR_PLATFORM_REGISTRY,
  ExecutiveOkrPlatform,
  getExecutiveOkrPlatform,
  getExecutiveOkrPlatformManifest,
  listExecutiveOkrCapabilities,
  listExecutiveOkrPublicApis,
  validateExecutiveOkrPlatform,
} from "./executiveOkrPlatform.ts";
import type { ExecutiveOkrPlatformRegistry } from "./executiveOkrPlatformTypes.ts";

test("consumes certified KPI freeze public API", () => {
  const freezeState = getExecutiveKpiPlatformFreezeState();
  const manifest = getExecutiveOkrPlatformManifest();

  assert.equal(freezeState.status, "PASS");
  assert.equal(freezeState.finalState, "Certified Frozen Released");
  assert.equal(manifest.kpiFreezeAvailable, true);
});

test("publishes platform identity", () => {
  const registry = EXECUTIVE_OKR_PLATFORM_REGISTRY;

  assert.equal(registry.platformName, "Executive OKR Platform");
  assert.equal(registry.platformId, "BUS-13");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.lifecycle.status, "Foundation");
  assert.equal(registry.lifecycle.state, "Immutable");
});

test("publishes registry integrity", () => {
  const registry = EXECUTIVE_OKR_PLATFORM_REGISTRY;

  assert.equal(registry.dependencies.length, 9);
  assert.equal(registry.consumers.length, 4);
  assert.equal(registry.capabilities.length, 10);
  assert.equal(registry.publicApis.length, 6);
  assert.equal(registry.kpiPlatformFreezeDependency, "Executive KPI Platform Freeze");
  assert.equal(Object.isFrozen(registry), true);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveOkrPlatformManifest();
  const second = getExecutiveOkrPlatformManifest();

  assert.equal(first.platformId, "BUS-13");
  assert.equal(first.phase, "BUS-13");
  assert.equal(first.certificationStatus, "Foundation Certified");
  assert.equal(first.kpiFreezeState, "Certified Frozen Released");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveOkrPlatform();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("exports public APIs", () => {
  assert.equal(typeof ExecutiveOkrPlatform.getExecutiveOkrPlatform, "function");
  assert.equal(typeof ExecutiveOkrPlatform.getExecutiveOkrPlatformManifest, "function");
  assert.equal(typeof ExecutiveOkrPlatform.validateExecutiveOkrPlatform, "function");
  assert.equal(typeof ExecutiveOkrPlatform.listExecutiveOkrCapabilities, "function");
  assert.equal(typeof ExecutiveOkrPlatform.listExecutiveOkrPublicApis, "function");
});

test("publishes capability registry", () => {
  const capabilities = listExecutiveOkrCapabilities();

  assert.equal(capabilities, EXECUTIVE_OKR_CAPABILITIES);
  assert.equal(capabilities.every((capability) => capability.declarationOnly), true);
  assert.equal(capabilities.some((capability) => capability.capabilityId === "okr-kpi-linkage-metadata"), true);
});

test("publishes public API registry", () => {
  const publicApis = listExecutiveOkrPublicApis();

  assert.equal(publicApis.length, 6);
  assert.equal(publicApis.every((api) => api.stable && api.runtime === false), true);
});

test("detects duplicate capabilities", () => {
  const duplicateRegistry: ExecutiveOkrPlatformRegistry = Object.freeze({
    ...EXECUTIVE_OKR_PLATFORM_REGISTRY,
    capabilities: Object.freeze([
      EXECUTIVE_OKR_PLATFORM_REGISTRY.capabilities[0],
      EXECUTIVE_OKR_PLATFORM_REGISTRY.capabilities[0],
    ]),
  });
  const validation = validateExecutiveOkrPlatform(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-capability:okr-registry"), true);
});

test("detects duplicate public APIs", () => {
  const duplicateRegistry: ExecutiveOkrPlatformRegistry = Object.freeze({
    ...EXECUTIVE_OKR_PLATFORM_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_OKR_PLATFORM_REGISTRY.publicApis[0],
      EXECUTIVE_OKR_PLATFORM_REGISTRY.publicApis[0],
    ]),
  });
  const validation = validateExecutiveOkrPlatform(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-public-api:ExecutiveOkrPlatform"), true);
});

test("publishes immutable platform facade", () => {
  const platform = getExecutiveOkrPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveOkrPlatform), true);
});

test("contains no runtime behavior metadata", () => {
  const platform = getExecutiveOkrPlatform();

  assert.equal(platform.registry.extensionPolicy.runtimeExecutionAllowed, false);
  assert.equal(platform.registry.extensionPolicy.okrScoringAllowed, false);
  assert.equal(platform.registry.extensionPolicy.progressCalculationAllowed, false);
  assert.equal(platform.registry.publicApis.some((api) => api.apiName.toLowerCase().includes("execute")), false);
});
