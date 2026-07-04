import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_KPI_CAPABILITIES,
  EXECUTIVE_KPI_PLATFORM_REGISTRY,
  ExecutiveKpiPlatform,
  getExecutiveKpiPlatform,
  getExecutiveKpiPlatformManifest,
  listExecutiveKpiCapabilities,
  listExecutiveKpiPublicApis,
  validateExecutiveKpiPlatform,
} from "./executiveKpiPlatform.ts";
import type { ExecutiveKpiPlatformRegistry } from "./executiveKpiPlatformTypes.ts";

test("publishes platform identity", () => {
  const registry = EXECUTIVE_KPI_PLATFORM_REGISTRY;

  assert.equal(registry.platformName, "Executive KPI Platform");
  assert.equal(registry.platformId, "BUS-1");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.lifecycle.status, "Foundation");
  assert.equal(registry.lifecycle.state, "Immutable");
});

test("publishes registry integrity", () => {
  const registry = EXECUTIVE_KPI_PLATFORM_REGISTRY;

  assert.equal(registry.dependencies.length, 7);
  assert.equal(registry.consumers.length, 3);
  assert.equal(registry.capabilities.length, 10);
  assert.equal(registry.publicApis.length, 6);
  assert.equal(Object.isFrozen(registry), true);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiPlatformManifest();
  const second = getExecutiveKpiPlatformManifest();

  assert.equal(first.platformId, "BUS-1");
  assert.equal(first.phase, "BUS-1");
  assert.equal(first.certificationStatus, "Foundation Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("exports public APIs", () => {
  assert.equal(typeof ExecutiveKpiPlatform.getExecutiveKpiPlatform, "function");
  assert.equal(typeof ExecutiveKpiPlatform.getExecutiveKpiPlatformManifest, "function");
  assert.equal(typeof ExecutiveKpiPlatform.validateExecutiveKpiPlatform, "function");
  assert.equal(typeof ExecutiveKpiPlatform.listExecutiveKpiCapabilities, "function");
  assert.equal(typeof ExecutiveKpiPlatform.listExecutiveKpiPublicApis, "function");
});

test("publishes capability registry", () => {
  const capabilities = listExecutiveKpiCapabilities();

  assert.equal(capabilities, EXECUTIVE_KPI_CAPABILITIES);
  assert.equal(capabilities.every((capability) => capability.declarationOnly), true);
  assert.equal(capabilities.some((capability) => capability.capabilityId === "kpi-validation"), true);
});

test("publishes public API registry", () => {
  const publicApis = listExecutiveKpiPublicApis();

  assert.equal(publicApis.length, 6);
  assert.equal(publicApis.every((api) => api.stable && api.runtime === false), true);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiPlatform();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate capabilities", () => {
  const duplicateRegistry: ExecutiveKpiPlatformRegistry = Object.freeze({
    ...EXECUTIVE_KPI_PLATFORM_REGISTRY,
    capabilities: Object.freeze([
      EXECUTIVE_KPI_PLATFORM_REGISTRY.capabilities[0],
      EXECUTIVE_KPI_PLATFORM_REGISTRY.capabilities[0],
    ]),
  });
  const validation = validateExecutiveKpiPlatform(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-capability:kpi-registry"), true);
});

test("detects duplicate public APIs", () => {
  const duplicateRegistry: ExecutiveKpiPlatformRegistry = Object.freeze({
    ...EXECUTIVE_KPI_PLATFORM_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_KPI_PLATFORM_REGISTRY.publicApis[0],
      EXECUTIVE_KPI_PLATFORM_REGISTRY.publicApis[0],
    ]),
  });
  const validation = validateExecutiveKpiPlatform(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-public-api:ExecutiveKpiPlatform"), true);
});

test("publishes immutable platform facade", () => {
  const platform = getExecutiveKpiPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveKpiPlatform), true);
});
