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
import {
  EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY,
  listExecutiveStrategicObjectives,
} from "./executiveStrategicObjectiveIndex.ts";
import {
  buildExecutiveStrategicInitiative,
  EXECUTIVE_STRATEGIC_INITIATIVE_MILESTONES,
  EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
  EXECUTIVE_STRATEGIC_INITIATIVE_RELATIONSHIPS,
  EXECUTIVE_STRATEGIC_INITIATIVES,
  ExecutiveStrategicInitiativesPlatform,
  getExecutiveStrategicInitiativesManifest,
  listExecutiveStrategicInitiatives,
  listExecutiveStrategicInitiativesPublicApis,
  validateExecutiveStrategicInitiative,
} from "./executiveStrategicInitiativeIndex.ts";
import type { ExecutiveStrategicInitiativeRegistry } from "./executiveStrategicInitiativeTypes.ts";

test("platform identity", () => {
  const registry = EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY;

  assert.equal(registry.platformId, "BUS-21");
  assert.equal(registry.platformName, "Executive Strategic Initiatives Platform");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.foundationPlatformId, "BUS-17");
  assert.equal(registry.definitionPlatformId, "BUS-18");
  assert.equal(registry.themePlatformId, "BUS-19");
  assert.equal(registry.objectivePlatformId, "BUS-20");
});

test("strategic initiative contracts", () => {
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVES.length, 3);
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVES.every((initiative) => initiative.purpose.purposeStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVES.every((initiative) => initiative.scope.scopeStatement.length > 0), true);
});

test("initiative hierarchy", () => {
  const growthInitiative = EXECUTIVE_STRATEGIC_INITIATIVES.find((initiative) => initiative.identity.initiativeId === "initiative-commercial-value-architecture");
  const innovationInitiative = EXECUTIVE_STRATEGIC_INITIATIVES.find((initiative) => initiative.identity.initiativeId === "initiative-innovation-acceleration-lab");

  assert.equal(growthInitiative?.childInitiativeIds.includes("initiative-innovation-acceleration-lab"), true);
  assert.equal(innovationInitiative?.parentInitiativeId, "initiative-commercial-value-architecture");
});

test("milestone registry", () => {
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVE_MILESTONES.length, 6);
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVE_MILESTONES.some((milestone) => milestone.milestoneType === "Readiness"), true);
});

test("relationship registry", () => {
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVE_RELATIONSHIPS.length, 29);
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVE_RELATIONSHIPS.some((relationship) => relationship.relationshipType === "InitiativeToMilestone"), true);
});

test("registries", () => {
  const registry = EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY;

  assert.equal(registry.initiatives.length, 3);
  assert.equal(registry.categories.length, 4);
  assert.equal(registry.statuses.length, 5);
  assert.equal(registry.priorities.length, 5);
  assert.equal(registry.lifecycles.length, 5);
  assert.equal(registry.owners.length, 3);
  assert.equal(registry.versions.length, 3);
  assert.equal(registry.milestones.length, 6);
  assert.equal(Object.isFrozen(registry), true);
});

test("dependency boundaries", () => {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const manifest = getExecutiveStrategicInitiativesManifest();

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
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY.platformId, "BUS-20");
  assert.equal(strategicObjectives.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS.length > 0, true);
  assert.equal(manifest.strategyFoundationAvailable, true);
  assert.equal(manifest.strategyDefinitionsAvailable, true);
  assert.equal(manifest.strategicThemesAvailable, true);
  assert.equal(manifest.strategicObjectivesAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategicInitiative();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategicInitiativesManifest();
  const second = getExecutiveStrategicInitiativesManifest();

  assert.equal(first.platformId, "BUS-21");
  assert.equal(first.initiativeCount, 3);
  assert.equal(first.milestoneCount, 6);
  assert.equal(first.relationshipCount, 29);
  assert.equal(first.certificationStatus, "Strategic Initiatives Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategicInitiativesPlatform.buildExecutiveStrategicInitiative, "function");
  assert.equal(typeof ExecutiveStrategicInitiativesPlatform.validateExecutiveStrategicInitiative, "function");
  assert.equal(typeof ExecutiveStrategicInitiativesPlatform.getExecutiveStrategicInitiativesManifest, "function");
  assert.equal(typeof ExecutiveStrategicInitiativesPlatform.listExecutiveStrategicInitiatives, "function");
  assert.equal(typeof ExecutiveStrategicInitiativesPlatform.listExecutiveStrategicInitiativesPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = buildExecutiveStrategicInitiative();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategicInitiativesPlatform), true);
});

test("version integrity", () => {
  const platform = buildExecutiveStrategicInitiative();

  assert.equal(platform.registry.versions.every((version) => version.semanticVersion === "1.0.0"), true);
  assert.equal(platform.registry.initiatives.every((initiative) => initiative.version.semanticVersion === "1.0.0"), true);
});

test("detects duplicate initiatives", () => {
  const duplicateRegistry: ExecutiveStrategicInitiativeRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
    initiatives: Object.freeze([
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.initiatives[0],
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.initiatives[0],
    ]),
  });
  const validation = validateExecutiveStrategicInitiative(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-initiative-id:initiative-commercial-value-architecture"), true);
});

test("detects duplicate milestone ids", () => {
  const duplicateRegistry: ExecutiveStrategicInitiativeRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
    milestones: Object.freeze([
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.milestones[0],
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.milestones[0],
    ]),
  });
  const validation = validateExecutiveStrategicInitiative(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-milestone-id:milestone-growth-readiness"), true);
});

test("detects duplicate public APIs", () => {
  const duplicateRegistry: ExecutiveStrategicInitiativeRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.publicApis[0],
    ]),
  });
  const validation = validateExecutiveStrategicInitiative(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-public-api:ExecutiveStrategicInitiativesPlatform"), true);
});
