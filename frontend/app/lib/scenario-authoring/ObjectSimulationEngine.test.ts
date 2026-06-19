import test from "node:test";
import assert from "node:assert/strict";

import { buildObjectIntelligenceRegistry, resetObjectIntelligenceRuntimeForTests } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import {
  getObjectSimulationResult,
  ObjectSimulationEngine,
  resetObjectSimulationEngineForTests,
  runObjectSimulation,
} from "./ObjectSimulationEngine.ts";
import {
  OBJECT_SIMULATION_ENGINE_DIAGNOSTIC,
  OBJECT_SIMULATION_READY_DIAGNOSTIC,
  S2_OBJECT_SIMULATION_COMPLETE_TAG,
} from "./objectSimulationEngineContract.ts";
import {
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_LABEL,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
} from "./scenarioDraftBuilderContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

function buildRequest(): ScenarioSimulationRequest {
  return Object.freeze({
    draftId: "scenario-draft:object-simulation",
    baselineReference: Object.freeze({
      baselineScenarioId: SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
      baselineDraftId: SCENARIO_DRAFT_BASELINE_DRAFT_ID,
      baselineLabel: SCENARIO_DRAFT_BASELINE_LABEL,
      inputModelId: "scenario-draft:object-simulation",
      preserved: true,
    }),
    dryRun: true,
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });
}

function buildObjectRegistry() {
  return buildObjectIntelligenceRegistry({
    dataSourceObjects: Object.freeze([
      Object.freeze({
        id: "supplier-1",
        label: "Primary Supplier",
        type: "supplier",
        health: 62,
        impact: 84,
        confidence: 78,
        importance: 92,
        trend: "declining",
      }),
      Object.freeze({
        id: "warehouse-1",
        label: "Regional Warehouse",
        type: "facility",
        health: 82,
        impact: 48,
        confidence: 70,
        importance: 60,
        trend: "stable",
      }),
    ]),
  });
}

test.beforeEach(() => {
  resetObjectIntelligenceRuntimeForTests();
  resetObjectSimulationEngineForTests();
});

test("exports S2 object simulation tag and diagnostics", () => {
  assert.equal(S2_OBJECT_SIMULATION_COMPLETE_TAG, "[S2_OBJECT_SIMULATION_COMPLETE]");
  assert.equal(OBJECT_SIMULATION_ENGINE_DIAGNOSTIC, "[OBJECT_SIMULATION_ENGINE]");
  assert.equal(OBJECT_SIMULATION_READY_DIAGNOSTIC, "[OBJECT_SIMULATION_READY]");
  assert.deepEqual(ObjectSimulationEngine.diagnostics, [
    "[OBJECT_SIMULATION_ENGINE]",
    "[OBJECT_SIMULATION_READY]",
  ]);
});

test("simulates object-level deltas from ScenarioSimulationRequest and DS-3 object intelligence", () => {
  const request = buildRequest();
  const registry = buildObjectRegistry();
  const beforeRegistry = JSON.stringify(registry);
  const beforeRequest = JSON.stringify(request);

  const result = runObjectSimulation({ request, objectIntelligence: registry });

  assert.equal(result.objectCount, 2);
  assert.equal(result.objectMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.readOnly, true);
  assert.equal(result.simulationExecuted, true);
  assert.equal(result.request.baselineReference?.preserved, true);

  const supplier = result.objectImpacts.find((impact) => impact.objectId === "supplier-1");
  assert.ok(supplier);
  assert.equal(typeof supplier.objectHealthDelta, "number");
  assert.equal(typeof supplier.objectImpactDelta, "number");
  assert.equal(typeof supplier.objectTrendDelta, "number");
  assert.equal(typeof supplier.objectConfidence, "number");
  assert.equal(supplier.objectMutation, false);
  assert.equal(JSON.stringify(registry), beforeRegistry);
  assert.equal(JSON.stringify(request), beforeRequest);
  assert.throws(() => {
    (result.objectImpacts as unknown as object[]).push({});
  }, TypeError);
});

test("uses latest DS-3 object intelligence registry when one is not supplied", () => {
  buildObjectRegistry();

  const result = ObjectSimulationEngine.runObjectSimulation({ request: buildRequest() });

  assert.equal(result.objectCount, 2);
  assert.equal(result.objectImpacts[0]?.objectId, "supplier-1");
});

test("stores latest object simulation result read-only", () => {
  const result = ObjectSimulationEngine.runObjectSimulation({
    request: buildRequest(),
    objectIntelligence: buildObjectRegistry(),
  });

  assert.equal(getObjectSimulationResult(), result);
  assert.equal(ObjectSimulationEngine.getObjectSimulationResult().objectMutation, false);
});
