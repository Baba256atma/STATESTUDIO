import test from "node:test";
import assert from "node:assert/strict";

import { buildKpiIntelligenceRegistry, resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { buildObjectIntelligenceRegistry, resetObjectIntelligenceRuntimeForTests } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import { buildRelationshipIntelligenceRegistry, resetRelationshipIntelligenceRuntimeForTests } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import { runKpiSimulation, resetKpiSimulationEngineForTests } from "./KpiSimulationEngine.ts";
import { runObjectSimulation, resetObjectSimulationEngineForTests } from "./ObjectSimulationEngine.ts";
import { runRelationshipSimulation, resetRelationshipSimulationEngineForTests } from "./RelationshipSimulationEngine.ts";
import {
  aggregateSimulationResults,
  getExecutiveSimulationSummary,
  resetSimulationResultAggregatorForTests,
  SimulationResultAggregator,
} from "./SimulationResultAggregator.ts";
import {
  S2_AGGREGATOR_COMPLETE_TAG,
  SIMULATION_RESULT_AGGREGATOR_DIAGNOSTIC,
  SIMULATION_RESULT_READY_DIAGNOSTIC,
} from "./simulationResultAggregatorContract.ts";
import {
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_LABEL,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
} from "./scenarioDraftBuilderContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

function buildRequest(): ScenarioSimulationRequest {
  return Object.freeze({
    draftId: "scenario-draft:aggregator",
    baselineReference: Object.freeze({
      baselineScenarioId: SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
      baselineDraftId: SCENARIO_DRAFT_BASELINE_DRAFT_ID,
      baselineLabel: SCENARIO_DRAFT_BASELINE_LABEL,
      inputModelId: "scenario-draft:aggregator",
      preserved: true,
    }),
    dryRun: true,
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });
}

function buildSimulationInputs(request: ScenarioSimulationRequest) {
  const objectSimulation = runObjectSimulation({
    request,
    objectIntelligence: buildObjectIntelligenceRegistry({
      dataSourceObjects: [
        { id: "supplier-1", label: "Supplier", type: "supplier", health: 62, impact: 84, confidence: 78, importance: 92, trend: "declining" },
      ],
    }),
  });
  const relationshipSimulation = runRelationshipSimulation({
    request,
    relationshipIntelligence: buildRelationshipIntelligenceRegistry({
      relationships: [
        {
          id: "rel-supply",
          sourceId: "supplier-1",
          targetId: "inventory-1",
          type: "dependency",
          metadata: { dependency: 91, influence: 76, confidence: 84, riskExposure: 70 },
        },
      ],
    }),
  });
  const kpiSimulation = runKpiSimulation({
    request,
    kpiIntelligence: buildKpiIntelligenceRegistry({
      dataSourceKpis: [
        { id: "revenue", label: "Revenue", category: "Revenue", value: 92, target: 110, direction: "up", confidence: 84 },
      ],
    }),
  });

  return { objectSimulation, relationshipSimulation, kpiSimulation };
}

test.beforeEach(() => {
  resetObjectIntelligenceRuntimeForTests();
  resetRelationshipIntelligenceRuntimeForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetObjectSimulationEngineForTests();
  resetRelationshipSimulationEngineForTests();
  resetKpiSimulationEngineForTests();
  resetSimulationResultAggregatorForTests();
});

test("exports S2 aggregator tag and diagnostics", () => {
  assert.equal(S2_AGGREGATOR_COMPLETE_TAG, "[S2_AGGREGATOR_COMPLETE]");
  assert.equal(SIMULATION_RESULT_AGGREGATOR_DIAGNOSTIC, "[SIMULATION_RESULT_AGGREGATOR]");
  assert.equal(SIMULATION_RESULT_READY_DIAGNOSTIC, "[SIMULATION_RESULT_READY]");
  assert.deepEqual(SimulationResultAggregator.diagnostics, [
    "[SIMULATION_RESULT_AGGREGATOR]",
    "[SIMULATION_RESULT_READY]",
  ]);
});

test("aggregates object relationship KPI and risk simulation results into executive summary", () => {
  const request = buildRequest();
  const simulations = buildSimulationInputs(request);
  const beforeObject = JSON.stringify(simulations.objectSimulation);
  const beforeRelationship = JSON.stringify(simulations.relationshipSimulation);
  const beforeKpi = JSON.stringify(simulations.kpiSimulation);

  const summary = aggregateSimulationResults({
    request,
    ...simulations,
    riskSimulation: Object.freeze({
      riskImpacts: Object.freeze([
        Object.freeze({ riskId: "risk-supplier", label: "Supplier Risk", riskDelta: 14, riskConfidence: 82 }),
      ]),
      readOnly: true,
      routingMutation: false,
    }),
  });

  assert.equal(summary.version, "1.0.0");
  assert.equal(typeof summary.overallScenarioImpact, "number");
  assert.equal(Array.isArray(summary.keyPositiveEffects), true);
  assert.equal(Array.isArray(summary.keyNegativeEffects), true);
  assert.equal(typeof summary.riskMovement.delta, "number");
  assert.equal(typeof summary.kpiMovement.delta, "number");
  assert.equal(typeof summary.confidence, "number");
  assert.equal(summary.objectCount, 1);
  assert.equal(summary.relationshipCount, 1);
  assert.equal(summary.kpiCount, 1);
  assert.equal(summary.riskCount, 1);
  assert.equal(summary.uiRendering, false);
  assert.equal(summary.routingMutation, false);
  assert.equal(summary.readOnly, true);
  assert.equal(JSON.stringify(simulations.objectSimulation), beforeObject);
  assert.equal(JSON.stringify(simulations.relationshipSimulation), beforeRelationship);
  assert.equal(JSON.stringify(simulations.kpiSimulation), beforeKpi);
  assert.throws(() => {
    (summary.keyNegativeEffects as string[]).push("mutate");
  }, TypeError);
});

test("derives risk movement from relationship risk exposure when risk simulation is absent", () => {
  const request = buildRequest();
  const simulations = buildSimulationInputs(request);

  const summary = SimulationResultAggregator.aggregateSimulationResults({
    request,
    ...simulations,
  });

  assert.equal(summary.riskCount, 0);
  assert.equal(summary.riskMovement.direction, "negative");
  assert.equal(summary.routingMutation, false);
});

test("stores latest executive simulation summary", () => {
  const request = buildRequest();
  const summary = SimulationResultAggregator.aggregateSimulationResults({
    request,
    ...buildSimulationInputs(request),
  });

  assert.equal(getExecutiveSimulationSummary(), summary);
  assert.equal(SimulationResultAggregator.getExecutiveSimulationSummary().uiRendering, false);
});
