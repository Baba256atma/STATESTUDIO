import * as assert from "node:assert/strict";
import { test } from "node:test";

import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeIndex.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeIndex.ts";
import { EXECUTIVE_STRATEGY_PLATFORM_REGISTRY, EXECUTIVE_STRATEGY_PUBLIC_APIS } from "./executiveStrategyIndex.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionIndex.ts";
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
  EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY,
  listExecutiveStrategicInitiatives,
} from "./executiveStrategicInitiativeIndex.ts";
import { buildExecutiveStrategicRoadmap, EXECUTIVE_STRATEGIC_ROADMAP_PHASES, EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY, EXECUTIVE_STRATEGIC_ROADMAP_RELATIONSHIPS, EXECUTIVE_STRATEGIC_ROADMAPS, ExecutiveStrategicRoadmapsPlatform, getExecutiveStrategicRoadmapsManifest, validateExecutiveStrategicRoadmap } from "./executiveStrategicRoadmapIndex.ts";
import type { ExecutiveStrategicRoadmapRegistry } from "./executiveStrategicRoadmapTypes.ts";

test("platform identity", () => {
  const registry = EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY;

  assert.equal(registry.platformId, "BUS-22");
  assert.equal(registry.platformName, "Executive Strategic Roadmaps Platform");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.foundationPlatformId, "BUS-17");
  assert.equal(registry.definitionPlatformId, "BUS-18");
  assert.equal(registry.themePlatformId, "BUS-19");
  assert.equal(registry.objectivePlatformId, "BUS-20");
  assert.equal(registry.initiativePlatformId, "BUS-21");
});

test("strategic roadmap contracts", () => {
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAPS.length, 3);
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAPS.every((roadmap) => roadmap.purpose.purposeStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAPS.every((roadmap) => roadmap.scope.scopeStatement.length > 0), true);
});

test("phase registry", () => {
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_PHASES.length, 6);
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_PHASES.some((phase) => phase.phaseType === "Foundation"), true);
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_PHASES.some((phase) => phase.phaseType === "Validation"), true);
});

test("sequence metadata", () => {
  const innovationRoadmap = EXECUTIVE_STRATEGIC_ROADMAPS.find((roadmap) => roadmap.identity.roadmapId === "roadmap-innovation-integration-wave");

  assert.equal(innovationRoadmap?.sequence.length, 2);
  assert.equal(innovationRoadmap?.sequence.every((entry) => entry.sequenceOrder > 0), true);
});

test("relationship registry", () => {
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_RELATIONSHIPS.length, 40);
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_RELATIONSHIPS.some((relationship) => relationship.relationshipType === "RoadmapToPhase"), true);
});

test("registries", () => {
  const registry = EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY;

  assert.equal(registry.roadmaps.length, 3);
  assert.equal(registry.phases.length, 6);
  assert.equal(registry.milestones.length, 6);
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
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
  const manifest = getExecutiveStrategicRoadmapsManifest();

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
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY.platformId, "BUS-21");
  assert.equal(strategicInitiatives.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS.length > 0, true);
  assert.equal(manifest.strategyFoundationAvailable, true);
  assert.equal(manifest.strategyDefinitionsAvailable, true);
  assert.equal(manifest.strategicThemesAvailable, true);
  assert.equal(manifest.strategicObjectivesAvailable, true);
  assert.equal(manifest.strategicInitiativesAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategicRoadmap();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategicRoadmapsManifest();
  const second = getExecutiveStrategicRoadmapsManifest();

  assert.equal(first.platformId, "BUS-22");
  assert.equal(first.roadmapCount, 3);
  assert.equal(first.phaseCount, 6);
  assert.equal(first.milestoneCount, 6);
  assert.equal(first.relationshipCount, 40);
  assert.equal(first.certificationStatus, "Strategic Roadmaps Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategicRoadmapsPlatform.buildExecutiveStrategicRoadmap, "function");
  assert.equal(typeof ExecutiveStrategicRoadmapsPlatform.validateExecutiveStrategicRoadmap, "function");
  assert.equal(typeof ExecutiveStrategicRoadmapsPlatform.getExecutiveStrategicRoadmapsManifest, "function");
  assert.equal(typeof ExecutiveStrategicRoadmapsPlatform.listExecutiveStrategicRoadmaps, "function");
  assert.equal(typeof ExecutiveStrategicRoadmapsPlatform.listExecutiveStrategicRoadmapsPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = buildExecutiveStrategicRoadmap();

  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategicRoadmapsPlatform), true);
});

test("version integrity", () => {
  const platform = buildExecutiveStrategicRoadmap();

  assert.equal(platform.registry.versions.every((version) => version.semanticVersion === "1.0.0"), true);
  assert.equal(platform.registry.roadmaps.every((roadmap) => roadmap.version.semanticVersion === "1.0.0"), true);
});

test("detects duplicate roadmaps", () => {
  const duplicateRegistry: ExecutiveStrategicRoadmapRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
    roadmaps: Object.freeze([
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.roadmaps[0],
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.roadmaps[0],
    ]),
  });
  const validation = validateExecutiveStrategicRoadmap(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-roadmap-id:roadmap-commercial-expansion-wave"), true);
});

test("detects duplicate phase ids", () => {
  const duplicateRegistry: ExecutiveStrategicRoadmapRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
    phases: Object.freeze([
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.phases[0],
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.phases[0],
    ]),
  });
  const validation = validateExecutiveStrategicRoadmap(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-phase-id:roadmap-phase-growth-foundation"), true);
});

test("detects duplicate relationship ids", () => {
  const duplicateRegistry: ExecutiveStrategicRoadmapRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
    relationships: Object.freeze([
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.relationships[0],
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.relationships[0],
    ]),
  });
  const validation = validateExecutiveStrategicRoadmap(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-relationship-id:strategy-growth-to-roadmap-growth"), true);
});

test("detects duplicate public APIs", () => {
  const duplicateRegistry: ExecutiveStrategicRoadmapRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.publicApis[0],
    ]),
  });
  const validation = validateExecutiveStrategicRoadmap(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-public-api:ExecutiveStrategicRoadmapsPlatform"), true);
});
