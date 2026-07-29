import * as assert from "node:assert/strict";
import { test } from "node:test";

import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import { EXECUTIVE_STRATEGY_PLATFORM_REGISTRY, EXECUTIVE_STRATEGY_PUBLIC_APIS } from "./executiveStrategyRegistry.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionRegistry.ts";
import {
  EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_THEME_REGISTRY,
  listExecutiveStrategicThemes,
} from "./executiveStrategicThemeIndex.ts";
import { buildExecutiveStrategicObjective, EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY, EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS, EXECUTIVE_STRATEGIC_OBJECTIVES, ExecutiveStrategicObjectivesPlatform, getExecutiveStrategicObjectivesManifest, validateExecutiveStrategicObjective } from "./executiveStrategicObjectiveIndex.ts";
import type { ExecutiveStrategicObjectiveRegistry } from "./executiveStrategicObjectiveTypes.ts";

test("platform identity", () => {
  const registry = EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY;

  assert.equal(registry.platformId, "BUS-20");
  assert.equal(registry.platformName, "Executive Strategic Objectives Platform");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.foundationPlatformId, "BUS-17");
  assert.equal(registry.definitionPlatformId, "BUS-18");
  assert.equal(registry.themePlatformId, "BUS-19");
});

test("strategic objective contracts", () => {
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVES.length, 3);
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVES.every((objective) => objective.purpose.purposeStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVES.every((objective) => objective.scope.scopeStatement.length > 0), true);
});

test("objective hierarchy", () => {
  const growthObjective = EXECUTIVE_STRATEGIC_OBJECTIVES.find((objective) => objective.identity.objectiveId === "objective-expand-profitable-revenue");
  const innovationObjective = EXECUTIVE_STRATEGIC_OBJECTIVES.find((objective) => objective.identity.objectiveId === "objective-accelerate-innovation-throughput");

  assert.equal(growthObjective?.childObjectiveIds.includes("objective-accelerate-innovation-throughput"), true);
  assert.equal(innovationObjective?.parentObjectiveId, "objective-expand-profitable-revenue");
});

test("relationship registry", () => {
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS.length, 19);
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS.some((relationship) => relationship.relationshipType === "ParentObjectiveToChildObjective"), true);
});

test("registries", () => {
  const registry = EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY;

  assert.equal(registry.objectives.length, 3);
  assert.equal(registry.categories.length, 4);
  assert.equal(registry.statuses.length, 5);
  assert.equal(registry.priorities.length, 5);
  assert.equal(registry.lifecycles.length, 5);
  assert.equal(registry.owners.length, 3);
  assert.equal(registry.versions.length, 3);
  assert.equal(Object.isFrozen(registry), true);
});

test("dependency boundaries", () => {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const manifest = getExecutiveStrategicObjectivesManifest();

  assert.equal(kpiFreezeManifest.platformIdentity.state, "Certified Frozen Released");
  assert.equal(okrFreezeManifest.platformIdentity.state, "Certified Frozen Released");
  assert.equal(EXECUTIVE_STRATEGY_PLATFORM_REGISTRY.identity.platformId, "BUS-17");
  assert.equal(EXECUTIVE_STRATEGY_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITION_REGISTRY.platformId, "BUS-18");
  assert.equal(strategyDefinitions.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_THEME_REGISTRY.platformId, "BUS-19");
  assert.equal(strategicThemes.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_THEME_PUBLIC_APIS.length > 0, true);
  assert.equal(manifest.strategyFoundationAvailable, true);
  assert.equal(manifest.strategyDefinitionsAvailable, true);
  assert.equal(manifest.strategicThemesAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategicObjective();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategicObjectivesManifest();
  const second = getExecutiveStrategicObjectivesManifest();

  assert.equal(first.platformId, "BUS-20");
  assert.equal(first.objectiveCount, 3);
  assert.equal(first.relationshipCount, 19);
  assert.equal(first.certificationStatus, "Strategic Objectives Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategicObjectivesPlatform.buildExecutiveStrategicObjective, "function");
  assert.equal(typeof ExecutiveStrategicObjectivesPlatform.validateExecutiveStrategicObjective, "function");
  assert.equal(typeof ExecutiveStrategicObjectivesPlatform.getExecutiveStrategicObjectivesManifest, "function");
  assert.equal(typeof ExecutiveStrategicObjectivesPlatform.listExecutiveStrategicObjectives, "function");
  assert.equal(typeof ExecutiveStrategicObjectivesPlatform.listExecutiveStrategicObjectivesPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = buildExecutiveStrategicObjective();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategicObjectivesPlatform), true);
});

test("version integrity", () => {
  const platform = buildExecutiveStrategicObjective();

  assert.equal(platform.registry.versions.every((version) => version.semanticVersion === "1.0.0"), true);
  assert.equal(platform.registry.objectives.every((objective) => objective.version.semanticVersion === "1.0.0"), true);
});

test("detects duplicate objectives", () => {
  const duplicateRegistry: ExecutiveStrategicObjectiveRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
    objectives: Object.freeze([
      EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.objectives[0],
      EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.objectives[0],
    ]),
  });
  const validation = validateExecutiveStrategicObjective(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-objective-id:objective-expand-profitable-revenue"), true);
});

test("detects duplicate public APIs", () => {
  const duplicateRegistry: ExecutiveStrategicObjectiveRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.publicApis[0],
    ]),
  });
  const validation = validateExecutiveStrategicObjective(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-public-api:ExecutiveStrategicObjectivesPlatform"), true);
});
