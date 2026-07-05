import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatformFreezeState } from "./executiveOkrPlatformFreezeIndex.ts";
import {
  EXECUTIVE_STRATEGY_ENTITY_REGISTRY,
  EXECUTIVE_STRATEGY_PLATFORM_IDENTITY,
  EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
  ExecutiveStrategyFoundation,
  getExecutiveStrategyManifest,
  getExecutiveStrategyPlatform,
  listExecutiveStrategyEntities,
  listExecutiveStrategyPublicApis,
  validateExecutiveStrategyPlatform,
} from "./executiveStrategyIndex.ts";
import type { ExecutiveStrategyPlatformRegistry } from "./executiveStrategyTypes.ts";

test("platform identity", () => {
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.platformName, "Executive Strategy Platform");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.platformId, "BUS-17");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.version, "1.0.0");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.status, "Foundation");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_IDENTITY.namespace, "executive.strategy");
});

test("strategy contracts and entity registry", () => {
  assert.equal(EXECUTIVE_STRATEGY_ENTITY_REGISTRY.length, 17);
  assert.equal(EXECUTIVE_STRATEGY_ENTITY_REGISTRY.some((entity) => entity.contractName === "ExecutiveStrategy"), true);
  assert.equal(EXECUTIVE_STRATEGY_ENTITY_REGISTRY.some((entity) => entity.contractName === "ExecutiveStrategicOkrReference"), true);
});

test("registries", () => {
  const registry = EXECUTIVE_STRATEGY_PLATFORM_REGISTRY;

  assert.equal(registry.entities.length, 17);
  assert.equal(registry.strategyTypes.length, 17);
  assert.equal(registry.statuses.length, 5);
  assert.equal(registry.priorities.length, 5);
  assert.equal(registry.lifecycles.length, 5);
  assert.equal(registry.publicApis.length, 6);
  assert.equal(Object.isFrozen(registry), true);
});

test("dependency boundaries", () => {
  const kpiFreezeState = getExecutiveKpiPlatformFreezeState();
  const okrFreezeState = getExecutiveOkrPlatformFreezeState();
  const manifest = getExecutiveStrategyManifest();

  assert.equal(kpiFreezeState.status, "PASS");
  assert.equal(okrFreezeState.status, "PASS");
  assert.equal(manifest.kpiFreezeAvailable, true);
  assert.equal(manifest.okrFreezeAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategyPlatform();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategyManifest();
  const second = getExecutiveStrategyManifest();

  assert.equal(first.identity.platformId, "BUS-17");
  assert.equal(first.certificationStatus, "Foundation Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategyFoundation.getExecutiveStrategyPlatform, "function");
  assert.equal(typeof ExecutiveStrategyFoundation.getExecutiveStrategyManifest, "function");
  assert.equal(typeof ExecutiveStrategyFoundation.validateExecutiveStrategyPlatform, "function");
  assert.equal(typeof ExecutiveStrategyFoundation.listExecutiveStrategyEntities, "function");
  assert.equal(typeof ExecutiveStrategyFoundation.listExecutiveStrategyPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = getExecutiveStrategyPlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategyFoundation), true);
});

test("list helpers", () => {
  assert.equal(listExecutiveStrategyEntities(), EXECUTIVE_STRATEGY_ENTITY_REGISTRY);
  assert.equal(listExecutiveStrategyPublicApis().length, 6);
});

test("detects duplicate entities", () => {
  const duplicateRegistry: ExecutiveStrategyPlatformRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
    entities: Object.freeze([
      EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.entities[0],
      EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.entities[0],
    ]),
  });
  const validation = validateExecutiveStrategyPlatform(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-entity-id:strategy"), true);
});

test("detects duplicate public APIs", () => {
  const duplicateRegistry: ExecutiveStrategyPlatformRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.publicApis[0],
    ]),
  });
  const validation = validateExecutiveStrategyPlatform(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-public-api:ExecutiveStrategyFoundation"), true);
});

test("contains no runtime behavior metadata", () => {
  const platform = getExecutiveStrategyPlatform();

  assert.equal(platform.registry.extensionPolicy.runtimeExecutionAllowed, false);
  assert.equal(platform.registry.extensionPolicy.strategyExecutionAllowed, false);
  assert.equal(platform.registry.extensionPolicy.businessLogicAllowed, false);
  assert.equal(platform.registry.publicApis.some((api) => api.apiName.toLowerCase().includes("execute")), false);
});
