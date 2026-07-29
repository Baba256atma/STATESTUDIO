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
import {
  EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS,
  EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY,
  listExecutiveStrategicRoadmaps,
} from "./executiveStrategicRoadmapIndex.ts";
import {
  EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY,
  listExecutiveStrategyAlignments,
} from "./executiveStrategyAlignmentIndex.ts";
import {
  EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
} from "./executiveStrategyMonitoringIndex.ts";
import { buildExecutiveStrategySimulation, EXECUTIVE_STRATEGY_SIMULATION_ASSUMPTION_REGISTRY, EXECUTIVE_STRATEGY_SIMULATION_OUTCOME_REGISTRY, EXECUTIVE_STRATEGY_SIMULATION_REGISTRY, EXECUTIVE_STRATEGY_SIMULATION_RELATIONSHIPS, EXECUTIVE_STRATEGY_SIMULATION_SCENARIO_REGISTRY, EXECUTIVE_STRATEGY_SIMULATIONS, ExecutiveStrategySimulationPlatform, getExecutiveStrategySimulationManifest, validateExecutiveStrategySimulation } from "./executiveStrategySimulationIndex.ts";
import type { ExecutiveStrategySimulationRegistry } from "./executiveStrategySimulationTypes.ts";

test("platform identity", () => {
  const registry = EXECUTIVE_STRATEGY_SIMULATION_REGISTRY;
  assert.equal(registry.platformId, "BUS-25");
  assert.equal(registry.platformName, "Executive Strategy Simulation Platform");
  assert.equal(registry.version, "1.0.0");
  assert.equal(registry.foundationPlatformId, "BUS-17");
  assert.equal(registry.definitionPlatformId, "BUS-18");
  assert.equal(registry.themePlatformId, "BUS-19");
  assert.equal(registry.objectivePlatformId, "BUS-20");
  assert.equal(registry.initiativePlatformId, "BUS-21");
  assert.equal(registry.roadmapPlatformId, "BUS-22");
  assert.equal(registry.alignmentPlatformId, "BUS-23");
  assert.equal(registry.monitoringPlatformId, "BUS-24");
});

test("simulation contracts", () => {
  assert.equal(EXECUTIVE_STRATEGY_SIMULATIONS.length, 3);
  assert.equal(EXECUTIVE_STRATEGY_SIMULATIONS.every((entry) => entry.purpose.purposeStatement.length > 0), true);
  assert.equal(EXECUTIVE_STRATEGY_SIMULATIONS.every((entry) => entry.outcomes.length > 0), true);
});

test("registry integrity", () => {
  const registry = EXECUTIVE_STRATEGY_SIMULATION_REGISTRY;
  assert.equal(registry.simulations.length, 3);
  assert.equal(registry.profiles.length, 3);
  assert.equal(registry.categories.length, 3);
  assert.equal(registry.statuses.length, 4);
  assert.equal(registry.scenarios.length, 3);
  assert.equal(registry.outcomes.length, 6);
  assert.equal(registry.assumptions.length, 6);
  assert.equal(registry.constraints.length, 6);
  assert.equal(Object.isFrozen(registry), true);
});

test("relationship registry", () => {
  assert.equal(EXECUTIVE_STRATEGY_SIMULATION_RELATIONSHIPS.length, 85);
  assert.equal(EXECUTIVE_STRATEGY_SIMULATION_RELATIONSHIPS.some((relationship) => relationship.relationshipType === "SimulationToOutcome"), true);
});

test("scenario and outcome registries", () => {
  assert.equal(EXECUTIVE_STRATEGY_SIMULATION_SCENARIO_REGISTRY.length, 3);
  assert.equal(EXECUTIVE_STRATEGY_SIMULATION_OUTCOME_REGISTRY.length, 6);
  assert.equal(EXECUTIVE_STRATEGY_SIMULATION_ASSUMPTION_REGISTRY.length, 6);
});

test("dependency boundaries", () => {
  const kpiFreezeManifest = buildExecutiveKpiPlatformFreezeManifest();
  const okrFreezeManifest = buildExecutiveOkrPlatformFreezeManifest();
  const strategyDefinitions = listExecutiveStrategyDefinitions();
  const strategicThemes = listExecutiveStrategicThemes();
  const strategicObjectives = listExecutiveStrategicObjectives();
  const strategicInitiatives = listExecutiveStrategicInitiatives();
  const strategicRoadmaps = listExecutiveStrategicRoadmaps();
  const strategyAlignments = listExecutiveStrategyAlignments();
  const manifest = getExecutiveStrategySimulationManifest();

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
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_REGISTRY.platformId, "BUS-22");
  assert.equal(strategicRoadmaps.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGIC_ROADMAP_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_REGISTRY.platformId, "BUS-23");
  assert.equal(strategyAlignments.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_ALIGNMENT_PUBLIC_APIS.length > 0, true);
  assert.equal(EXECUTIVE_STRATEGY_MONITORING_REGISTRY.platformId, "BUS-24");
  assert.equal(EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS.length > 0, true);
  assert.equal(manifest.strategyMonitoringAvailable, true);
});

test("validation", () => {
  const validation = validateExecutiveStrategySimulation();
  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("manifest", () => {
  const first = getExecutiveStrategySimulationManifest();
  const second = getExecutiveStrategySimulationManifest();
  assert.equal(first.platformId, "BUS-25");
  assert.equal(first.simulationCount, 3);
  assert.equal(first.scenarioCount, 3);
  assert.equal(first.outcomeCount, 6);
  assert.equal(first.assumptionCount, 6);
  assert.equal(first.relationshipCount, 85);
  assert.equal(first.certificationStatus, "Strategy Simulation Platform Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("public APIs", () => {
  assert.equal(typeof ExecutiveStrategySimulationPlatform.buildExecutiveStrategySimulation, "function");
  assert.equal(typeof ExecutiveStrategySimulationPlatform.validateExecutiveStrategySimulation, "function");
  assert.equal(typeof ExecutiveStrategySimulationPlatform.getExecutiveStrategySimulationManifest, "function");
  assert.equal(typeof ExecutiveStrategySimulationPlatform.listExecutiveStrategySimulations, "function");
  assert.equal(typeof ExecutiveStrategySimulationPlatform.listExecutiveStrategySimulationPublicApis, "function");
});

test("immutable behavior", () => {
  const platform = buildExecutiveStrategySimulation();
  assert.equal(platform.validation.valid, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(ExecutiveStrategySimulationPlatform), true);
});

test("version integrity", () => {
  const platform = buildExecutiveStrategySimulation();
  assert.equal(platform.registry.versions.every((version) => version.semanticVersion === "1.0.0"), true);
  assert.equal(platform.registry.simulations.every((entry) => entry.version.semanticVersion === "1.0.0"), true);
});

test("duplicate detection", () => {
  const duplicateSimulations: ExecutiveStrategySimulationRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_SIMULATION_REGISTRY,
    simulations: Object.freeze([
      EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.simulations[0],
      EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.simulations[0],
    ]),
  });
  const duplicateRelationships: ExecutiveStrategySimulationRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_SIMULATION_REGISTRY,
    relationships: Object.freeze([
      EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.relationships[0],
      EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.relationships[0],
    ]),
  });
  const duplicateApis: ExecutiveStrategySimulationRegistry = Object.freeze({
    ...EXECUTIVE_STRATEGY_SIMULATION_REGISTRY,
    publicApis: Object.freeze([
      EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.publicApis[0],
      EXECUTIVE_STRATEGY_SIMULATION_REGISTRY.publicApis[0],
    ]),
  });
  assert.equal(validateExecutiveStrategySimulation(duplicateSimulations).errors.includes("duplicate-simulation-id:simulation-profitable-growth-expansion"), true);
  assert.equal(validateExecutiveStrategySimulation(duplicateRelationships).errors.includes("duplicate-relationship-id:simulation-growth-strategy"), true);
  assert.equal(validateExecutiveStrategySimulation(duplicateApis).errors.includes("duplicate-public-api:ExecutiveStrategySimulationPlatform"), true);
});
