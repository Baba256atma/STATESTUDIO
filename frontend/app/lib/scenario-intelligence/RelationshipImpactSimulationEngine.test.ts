import test from "node:test";
import assert from "node:assert/strict";

import {
  RelationshipImpactSimulationEngine,
  buildRelationshipImpactProfileRegistry,
  getRelationshipImpactProfileRegistry,
  resetRelationshipImpactSimulationEngineForTests,
} from "./RelationshipImpactSimulationEngine.ts";
import { resetScenarioBuilderEngineForTests } from "./ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import {
  RELATIONSHIP_IMPACT_READY_DIAGNOSTIC,
  RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTIC,
} from "./relationshipImpactSimulationContract.ts";
import { resetDependencyIntelligenceEngineForTests } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { resetRelationshipInfluenceEngineForTests } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { resetRelationshipRiskExposureEngineForTests } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";

const SAMPLE_OBJECTS = Object.freeze([
  { id: "supplier-1", label: "Supplier", type: "supplier", role: "hub", risk: 40 },
  { id: "inventory-1", label: "Inventory", type: "inventory", risk: 35 },
]);

const SAMPLE_RELATIONSHIPS = Object.freeze([
  {
    id: "rel-1",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    type: "supplies",
    status: "healthy",
    confidence: 75,
    dependencyScore: 70,
  },
  {
    id: "rel-2",
    sourceId: "inventory-1",
    targetId: "supplier-1",
    type: "depends_on",
    status: "stable",
    confidence: 60,
    dependencyScore: 55,
  },
]);

test.beforeEach(() => {
  resetRelationshipImpactSimulationEngineForTests();
  resetScenarioBuilderEngineForTests();
  resetScenarioGenerationRuntimeForTests();
  resetDependencyIntelligenceEngineForTests();
  resetRelationshipInfluenceEngineForTests();
  resetRelationshipRiskExposureEngineForTests();
});

test("builds immutable relationship impact profiles from relationship intelligence", () => {
  const registry = buildRelationshipImpactProfileRegistry({
    objects: SAMPLE_OBJECTS,
    relationships: SAMPLE_RELATIONSHIPS,
  });

  assert.equal(registry.scenarioCount, 4);
  assert.equal(registry.relationshipCount, 2);
  assert.equal(registry.profileCount, 8);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_IMPACT_SIMULATION_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_IMPACT_READY_DIAGNOSTIC), true);

  const baselineProfile = registry.profileById["relationship-impact:scenario:baseline:rel-1"];
  assert.ok(baselineProfile);
  assert.equal(baselineProfile.impactResult.dependencyChange.delta, 0);
  assert.equal(baselineProfile.impactResult.influenceChange.delta, 0);
  assert.equal(baselineProfile.impactResult.riskExposureChange.delta, 0);
  assert.equal(baselineProfile.impactResult.applied, false);
  assert.equal(baselineProfile.impactResult.simulationReady, true);

  const riskProfile = registry.profileById["relationship-impact:scenario:risk:rel-1"];
  assert.ok(riskProfile);
  assert.ok(riskProfile.impactResult.influenceChange.delta < 0);
  assert.ok(riskProfile.impactResult.riskExposureChange.delta > 0);
  assert.ok(riskProfile.impactResult.compositeImpactScore > 0);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = {
    scene: {
      objects: SAMPLE_OBJECTS,
      relationships: SAMPLE_RELATIONSHIPS,
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = RelationshipImpactSimulationEngine.buildRelationshipImpactProfileRegistry({
    sceneJson,
  });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.profileCount, 8);
  assert.equal(getRelationshipImpactProfileRegistry().profileCount, 8);
});

test("indexes profiles by relationship and scenario while evaluating opportunity uplift", () => {
  const registry = buildRelationshipImpactProfileRegistry({
    objects: SAMPLE_OBJECTS,
    relationships: [SAMPLE_RELATIONSHIPS[0]],
  });

  const opportunityProfiles = registry.profilesByScenarioId["scenario:opportunity"];
  assert.ok(opportunityProfiles);
  assert.equal(opportunityProfiles.length, 1);
  assert.ok(opportunityProfiles[0].impactResult.influenceChange.delta > 0);
  assert.equal(opportunityProfiles[0].impactResult.riskExposureChange.direction, "down");
  assert.equal(registry.profilesByRelationshipId["rel-1"]?.length, 4);
});
