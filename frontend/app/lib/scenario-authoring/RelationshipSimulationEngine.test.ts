import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRelationshipIntelligenceRegistry,
  resetRelationshipIntelligenceRuntimeForTests,
} from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import {
  getRelationshipSimulationResult,
  RelationshipSimulationEngine,
  resetRelationshipSimulationEngineForTests,
  runRelationshipSimulation,
} from "./RelationshipSimulationEngine.ts";
import {
  RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_SIMULATION_READY_DIAGNOSTIC,
  S2_RELATIONSHIP_SIMULATION_COMPLETE_TAG,
} from "./relationshipSimulationEngineContract.ts";
import {
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_LABEL,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
} from "./scenarioDraftBuilderContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

function buildRequest(): ScenarioSimulationRequest {
  return Object.freeze({
    draftId: "scenario-draft:relationship-simulation",
    baselineReference: Object.freeze({
      baselineScenarioId: SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
      baselineDraftId: SCENARIO_DRAFT_BASELINE_DRAFT_ID,
      baselineLabel: SCENARIO_DRAFT_BASELINE_LABEL,
      inputModelId: "scenario-draft:relationship-simulation",
      preserved: true,
    }),
    dryRun: true,
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });
}

function buildRelationshipRegistry() {
  return buildRelationshipIntelligenceRegistry({
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "dependency",
        metadata: {
          strength: 82,
          dependency: 91,
          influence: 76,
          confidence: 84,
          riskExposure: 70,
        },
      }),
      Object.freeze({
        id: "rel-production",
        sourceId: "inventory-1",
        targetId: "production-1",
        type: "supports",
        metadata: {
          strength: 64,
          dependency: 58,
          influence: 62,
          confidence: 72,
          riskExposure: 44,
        },
      }),
    ]),
  });
}

test.beforeEach(() => {
  resetRelationshipIntelligenceRuntimeForTests();
  resetRelationshipSimulationEngineForTests();
});

test("exports S2 relationship simulation tag and diagnostics", () => {
  assert.equal(S2_RELATIONSHIP_SIMULATION_COMPLETE_TAG, "[S2_RELATIONSHIP_SIMULATION_COMPLETE]");
  assert.equal(RELATIONSHIP_SIMULATION_ENGINE_DIAGNOSTIC, "[RELATIONSHIP_SIMULATION_ENGINE]");
  assert.equal(RELATIONSHIP_SIMULATION_READY_DIAGNOSTIC, "[RELATIONSHIP_SIMULATION_READY]");
  assert.deepEqual(RelationshipSimulationEngine.diagnostics, [
    "[RELATIONSHIP_SIMULATION_ENGINE]",
    "[RELATIONSHIP_SIMULATION_READY]",
  ]);
});

test("simulates relationship-level deltas from ScenarioSimulationRequest and DS-4 relationship intelligence", () => {
  const request = buildRequest();
  const registry = buildRelationshipRegistry();
  const beforeRegistry = JSON.stringify(registry);
  const beforeRequest = JSON.stringify(request);

  const result = runRelationshipSimulation({ request, relationshipIntelligence: registry });

  assert.equal(result.relationshipCount, 2);
  assert.equal(result.topologyMutation, false);
  assert.equal(result.objectMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.readOnly, true);
  assert.equal(result.simulationExecuted, true);
  assert.equal(result.request.baselineReference?.preserved, true);

  const supply = result.relationshipImpacts.find((impact) => impact.relationshipId === "rel-supply");
  assert.ok(supply);
  assert.equal(typeof supply.dependencyDelta, "number");
  assert.equal(typeof supply.influenceDelta, "number");
  assert.equal(typeof supply.riskExposureDelta, "number");
  assert.equal(typeof supply.relationshipConfidence, "number");
  assert.equal(supply.topologyMutation, false);
  assert.equal(JSON.stringify(registry), beforeRegistry);
  assert.equal(JSON.stringify(request), beforeRequest);
  assert.throws(() => {
    (result.relationshipImpacts as unknown as object[]).push({});
  }, TypeError);
});

test("uses latest DS-4 relationship intelligence registry when one is not supplied", () => {
  buildRelationshipRegistry();

  const result = RelationshipSimulationEngine.runRelationshipSimulation({ request: buildRequest() });

  assert.equal(result.relationshipCount, 2);
  assert.equal(result.relationshipImpacts[0]?.relationshipId, "rel-supply");
});

test("stores latest relationship simulation result read-only", () => {
  const result = RelationshipSimulationEngine.runRelationshipSimulation({
    request: buildRequest(),
    relationshipIntelligence: buildRelationshipRegistry(),
  });

  assert.equal(getRelationshipSimulationResult(), result);
  assert.equal(RelationshipSimulationEngine.getRelationshipSimulationResult().topologyMutation, false);
});
