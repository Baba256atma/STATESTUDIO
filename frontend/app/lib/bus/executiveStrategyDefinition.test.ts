import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatformFreezeState } from "./executiveOkrPlatformFreezeIndex.ts";
import { getExecutiveStrategyPlatform } from "./executiveStrategyIndex.ts";
import {
  buildExecutiveStrategyDefinition,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  EXECUTIVE_STRATEGY_DEFINITIONS,
  ExecutiveStrategyDefinitionPlatform,
  getExecutiveStrategyDefinitionManifest,
  listExecutiveStrategyDefinitionPublicApis,
  listExecutiveStrategyDefinitions,
  validateExecutiveStrategyDefinition,
} from "./executiveStrategyDefinitionIndex.ts";
import type { ExecutiveStrategyDefinitionRegistry } from "./executiveStrategyDefinitionTypes.ts";

test("platform identity", () => {
  const registry = EXECUTIVE_STRATEGY_DEFINITION_REGISTRY;

  assert.equal(registry.platformId, "BUS-18");
  assert.equal(registry.platformName, "Executive Strategy Definition Platform");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.foundationPlatformId, "BUS-17");
});

test("strategy definition contracts", () => {
  assert.equal(EXECUTIVE_STRATEGY_DEFINITIONS.length, 2);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITIONS.every((strategy) => strategy.mission.missionStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITIONS.every((strategy) => strategy.vision.visionStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITIONS.every((strategy) => strategy.version.semanticVersion === "1.0.0"), true);
});

test("registries", () => {
  const registry = EXECUTIVE_STRATEGY_DEFINITION_REGISTRY;

  assert.equal(registry.strategyDefinitions.length, 2);
  assert.equal(registry.categories.length, 4);
  assert.equal(registry.statuses.length, 5);
  assert.equal(registry.priorities.length, 5);
  assert.equal(registry.lifecycles.length, 5);
  assert.equal(registry.versions.length, 2);
  assert.equal(registry.owners.length, 3);
  assert.equal(Object.isFrozen(registry), true);
});

test("dependency boundaries", () => {
  const kpiFreezeState = getExecutiveKpiPlatformFreezeState();
  const okrFreezeState = getExecutiveOkrPlatformFreezeState();
  const strategyFoundation = getExecutiveStrategyPlatform();
  const manifest = getExecutiveStrategyDefinitionManifest();

  assert.equal(kpiFreezeState.status, "PASS");
  assert.equal(okrFreezeState.status, "PASS");
  assert.equal(strategyFoundation.validation.valid, true);
  assert.equal(manifest.kpiFreezeAvailable, true);
  assert.equal(manifest.okrFreezeAvailable, true);
  assert.equal(manifest.strategyFoundationAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategyDefinition();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategyDefinitionManifest();
  const second = getExecutiveStrategyDefinitionManifest();

  assert.equal(first.platformId, "BUS-18");
  assert.equal(first.strategyDefinitionCount, 2);
  assert.equal(first.certificationStatus, "Definition Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategyDefinitionPlatform.buildExecutiveStrategyDefinition, "function");
  assert.equal(typeof ExecutiveStrategyDefinitionPlatform.validateExecutiveStrategyDefinition, "function");
  assert.equal(typeof ExecutiveStrategyDefinitionPlatform.getExecutiveStrategyDefinitionManifest, "function");
  assert.equal(typeof ExecutiveStrategyDefinitionPlatform.listExecutiveStrategyDefinitions, "function");
  assert.equal(typeof ExecutiveStrategyDefinitionPlatform.listExecutiveStrategyDefinitionPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = buildExecutiveStrategyDefinition();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategyDefinitionPlatform), true);
});

test("list helpers", () => {
  assert.equal(listExecutiveStrategyDefinitions(), EXECUTIVE_STRATEGY_DEFINITIONS);
  assert.equal(listExecutiveStrategyDefinitionPublicApis().length, 6);
});

test("version integrity", () => {
  const platform = buildExecutiveStrategyDefinition();

  assert.equal(platform.registry.versions.every((version) => version.semanticVersion === "1.0.0"), true);
  assert.equal(platform.registry.strategyDefinitions.every((strategy) => strategy.version.semanticVersion === "1.0.0"), true);
});

test("detects duplicate strategies", () => {
  const duplicateRegistry: ExecutiveStrategyDefinitionRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
    strategyDefinitions: Object.freeze([
      EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.strategyDefinitions[0],
      EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.strategyDefinitions[0],
    ]),
  });
  const validation = validateExecutiveStrategyDefinition(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-strategy-id:strategy-profitable-growth"), true);
});

test("detects duplicate public APIs", () => {
  const duplicateRegistry: ExecutiveStrategyDefinitionRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.publicApis[0],
    ]),
  });
  const validation = validateExecutiveStrategyDefinition(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-public-api:ExecutiveStrategyDefinitionPlatform"), true);
});
