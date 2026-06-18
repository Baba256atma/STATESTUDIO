import test from "node:test";
import assert from "node:assert/strict";

import {
  ObjectImpactSimulationEngine,
  buildObjectImpactProfileRegistry,
  getObjectImpactProfileRegistry,
  resetObjectImpactSimulationEngineForTests,
} from "./ObjectImpactSimulationEngine.ts";
import { resetScenarioBuilderEngineForTests } from "./ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import {
  OBJECT_IMPACT_READY_DIAGNOSTIC,
  OBJECT_IMPACT_SIMULATION_DIAGNOSTIC,
} from "./objectImpactSimulationContract.ts";
import {
  resetObjectHealthEngineForTests,
} from "../object-intelligence/ObjectHealthEngine.ts";
import {
  resetObjectTrendEngineForTests,
} from "../object-intelligence/ObjectTrendEngine.ts";
import {
  resetObjectImportanceEngineForTests,
} from "../object-intelligence/ObjectImportanceEngine.ts";

test.beforeEach(() => {
  resetObjectImpactSimulationEngineForTests();
  resetScenarioBuilderEngineForTests();
  resetScenarioGenerationRuntimeForTests();
  resetObjectHealthEngineForTests();
  resetObjectTrendEngineForTests();
  resetObjectImportanceEngineForTests();
});

test("builds immutable object impact profiles from object intelligence", () => {
  const registry = buildObjectImpactProfileRegistry({
    sceneObjects: [
      {
        id: "supplier-1",
        label: "Supplier",
        status: "active",
        health: 70,
        relationships: [{ status: "healthy" }],
        role: "hub",
      },
      {
        id: "inventory-1",
        label: "Inventory",
        status: "idle",
        health: 55,
      },
    ],
    relationships: [{ id: "rel-1", sourceId: "supplier-1", targetId: "inventory-1" }],
    kpis: [{ id: "revenue", value: 100 }],
    risks: [{ id: "risk-1", severity: 70 }],
  });

  assert.equal(registry.scenarioCount, 4);
  assert.equal(registry.objectCount, 2);
  assert.equal(registry.profileCount, 8);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.diagnostics.includes(OBJECT_IMPACT_SIMULATION_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_IMPACT_READY_DIAGNOSTIC), true);

  const baselineProfile = registry.profileById["impact-profile:scenario:baseline:supplier-1"];
  assert.ok(baselineProfile);
  assert.equal(baselineProfile.impactResult.healthChange.delta, 0);
  assert.equal(baselineProfile.impactResult.trendChange.delta, 0);
  assert.equal(baselineProfile.impactResult.importanceChange.delta, 0);
  assert.equal(baselineProfile.impactResult.applied, false);
  assert.equal(baselineProfile.impactResult.simulationReady, true);

  const riskProfile = registry.profileById["impact-profile:scenario:risk:supplier-1"];
  assert.ok(riskProfile);
  assert.ok(riskProfile.impactResult.healthChange.delta < 0);
  assert.equal(riskProfile.impactResult.trendChange.projectedDirection, "Declining");
  assert.ok(riskProfile.impactResult.compositeImpactScore > 0);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = {
    scene: {
      objects: [{ id: "line-1", label: "Line", status: "running", health: 62, role: "hub" }],
      relationships: [{ id: "rel-1", sourceId: "line-1", targetId: "line-2" }],
      kpis: [{ id: "throughput", value: 88 }],
      risks: [{ id: "risk-1", severity: 80 }],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = ObjectImpactSimulationEngine.buildObjectImpactProfileRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.profileCount, 4);
  assert.equal(getObjectImpactProfileRegistry().profileCount, 4);
});

test("indexes profiles by object and scenario while evaluating opportunity uplift", () => {
  const registry = buildObjectImpactProfileRegistry({
    sceneObjects: [{ id: "supplier-1", label: "Supplier", status: "active", health: 60, role: "hub" }],
    relationships: [{ id: "rel-1", sourceId: "supplier-1", targetId: "inventory-1" }],
    kpis: [{ id: "margin", value: 40 }],
    risks: [{ id: "supply-risk", severity: 55 }],
  });

  const opportunityProfiles = registry.profilesByScenarioId["scenario:opportunity"];
  assert.ok(opportunityProfiles);
  assert.equal(opportunityProfiles.length, 1);
  assert.ok(opportunityProfiles[0].impactResult.healthChange.delta > 0);
  assert.equal(opportunityProfiles[0].impactResult.trendChange.projectedDirection, "Improving");
  assert.equal(registry.profilesByObjectId["supplier-1"]?.length, 4);
});
