import test from "node:test";
import assert from "node:assert/strict";

import {
  buildKpiIntelligenceRegistry,
  resetKpiIntelligenceRuntimeForTests,
} from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import {
  getKpiSimulationResult,
  KpiSimulationEngine,
  resetKpiSimulationEngineForTests,
  runKpiSimulation,
} from "./KpiSimulationEngine.ts";
import {
  KPI_SIMULATION_ENGINE_DIAGNOSTIC,
  KPI_SIMULATION_READY_DIAGNOSTIC,
  S2_KPI_SIMULATION_COMPLETE_TAG,
} from "./kpiSimulationEngineContract.ts";
import {
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_LABEL,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
} from "./scenarioDraftBuilderContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

function buildRequest(): ScenarioSimulationRequest {
  return Object.freeze({
    draftId: "scenario-draft:kpi-simulation",
    baselineReference: Object.freeze({
      baselineScenarioId: SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
      baselineDraftId: SCENARIO_DRAFT_BASELINE_DRAFT_ID,
      baselineLabel: SCENARIO_DRAFT_BASELINE_LABEL,
      inputModelId: "scenario-draft:kpi-simulation",
      preserved: true,
    }),
    dryRun: true,
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });
}

function buildKpiRegistry() {
  return buildKpiIntelligenceRegistry({
    dataSourceKpis: Object.freeze([
      Object.freeze({
        id: "revenue",
        label: "Revenue",
        category: "Revenue",
        value: 92,
        target: 110,
        direction: "up",
        confidence: 84,
      }),
      Object.freeze({
        id: "risk_exposure",
        label: "Risk Exposure",
        category: "Risk Exposure",
        value: 68,
        target: 40,
        direction: "down",
        confidence: 76,
      }),
    ]),
  });
}

test.beforeEach(() => {
  resetKpiIntelligenceRuntimeForTests();
  resetKpiSimulationEngineForTests();
});

test("exports S2 KPI simulation tag and diagnostics", () => {
  assert.equal(S2_KPI_SIMULATION_COMPLETE_TAG, "[S2_KPI_SIMULATION_COMPLETE]");
  assert.equal(KPI_SIMULATION_ENGINE_DIAGNOSTIC, "[KPI_SIMULATION_ENGINE]");
  assert.equal(KPI_SIMULATION_READY_DIAGNOSTIC, "[KPI_SIMULATION_READY]");
  assert.deepEqual(KpiSimulationEngine.diagnostics, [
    "[KPI_SIMULATION_ENGINE]",
    "[KPI_SIMULATION_READY]",
  ]);
});

test("simulates KPI-level deterministic deltas from ScenarioSimulationRequest and DS-5 KPI intelligence", () => {
  const request = buildRequest();
  const registry = buildKpiRegistry();
  const beforeRegistry = JSON.stringify(registry);
  const beforeRequest = JSON.stringify(request);

  const result = runKpiSimulation({ request, kpiIntelligence: registry });

  assert.equal(result.kpiCount, 2);
  assert.equal(result.kpiMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.readOnly, true);
  assert.equal(result.deterministicScenarioDelta, true);
  assert.equal(result.forecastExecution, false);
  assert.equal(result.request.baselineReference?.preserved, true);

  const revenue = result.kpiImpacts.find((impact) => impact.kpiId === "revenue");
  assert.ok(revenue);
  assert.equal(typeof revenue.kpiHealthDelta, "number");
  assert.equal(typeof revenue.kpiTrendDelta, "number");
  assert.equal(typeof revenue.kpiImpactDelta, "number");
  assert.equal(typeof revenue.kpiConfidence, "number");
  assert.equal(revenue.kpiMutation, false);
  assert.equal(revenue.forecastExecution, false);
  assert.equal(revenue.deterministicScenarioDelta, true);
  assert.equal(JSON.stringify(registry), beforeRegistry);
  assert.equal(JSON.stringify(request), beforeRequest);
  assert.throws(() => {
    (result.kpiImpacts as unknown as object[]).push({});
  }, TypeError);
});

test("uses latest DS-5 KPI intelligence registry when one is not supplied", () => {
  buildKpiRegistry();

  const result = KpiSimulationEngine.runKpiSimulation({ request: buildRequest() });

  assert.equal(result.kpiCount, 2);
  assert.equal(result.kpiImpacts[0]?.kpiId, "revenue");
  assert.equal(result.forecastExecution, false);
});

test("stores latest KPI simulation result read-only", () => {
  const result = KpiSimulationEngine.runKpiSimulation({
    request: buildRequest(),
    kpiIntelligence: buildKpiRegistry(),
  });

  assert.equal(getKpiSimulationResult(), result);
  assert.equal(KpiSimulationEngine.getKpiSimulationResult().kpiMutation, false);
});
