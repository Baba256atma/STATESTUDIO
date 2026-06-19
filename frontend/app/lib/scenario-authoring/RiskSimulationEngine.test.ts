import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRiskIntelligenceRegistry,
  resetRiskIntelligenceRuntimeForTests,
} from "../risk-intelligence/RiskIntelligenceRuntime.ts";
import {
  getRiskSimulationResult,
  resetRiskSimulationEngineForTests,
  RiskSimulationEngine,
  runRiskSimulation,
} from "./RiskSimulationEngine.ts";
import {
  RISK_SIMULATION_ENGINE_DIAGNOSTIC,
  RISK_SIMULATION_READY_DIAGNOSTIC,
  S2_RISK_SIMULATION_COMPLETE_TAG,
} from "./riskSimulationEngineContract.ts";
import {
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_LABEL,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
} from "./scenarioDraftBuilderContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

function buildRequest(): ScenarioSimulationRequest {
  return Object.freeze({
    draftId: "scenario-draft:risk-simulation",
    baselineReference: Object.freeze({
      baselineScenarioId: SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
      baselineDraftId: SCENARIO_DRAFT_BASELINE_DRAFT_ID,
      baselineLabel: SCENARIO_DRAFT_BASELINE_LABEL,
      inputModelId: "scenario-draft:risk-simulation",
      preserved: true,
    }),
    dryRun: true,
    sceneMutation: false,
    dsMutation: false,
    routingMutation: false,
  });
}

function buildRiskRegistry() {
  return buildRiskIntelligenceRegistry({
    risks: Object.freeze([
      Object.freeze({
        riskId: "risk-supplier",
        subjectId: "supplier-1",
        label: "Supplier Delay Risk",
        category: "Supply Risk",
        severity: 82,
        exposure: 76,
        confidence: 88,
        momentum: "worsening",
      }),
    ]),
  });
}

test.beforeEach(() => {
  resetRiskIntelligenceRuntimeForTests();
  resetRiskSimulationEngineForTests();
});

test("exports S2 risk simulation tag and diagnostics", () => {
  assert.equal(S2_RISK_SIMULATION_COMPLETE_TAG, "[S2_RISK_SIMULATION_COMPLETE]");
  assert.equal(RISK_SIMULATION_ENGINE_DIAGNOSTIC, "[RISK_SIMULATION_ENGINE]");
  assert.equal(RISK_SIMULATION_READY_DIAGNOSTIC, "[RISK_SIMULATION_READY]");
  assert.deepEqual(RiskSimulationEngine.diagnostics, [
    "[RISK_SIMULATION_ENGINE]",
    "[RISK_SIMULATION_READY]",
  ]);
});

test("simulates deterministic risk deltas from ScenarioSimulationRequest and DS-6 risk intelligence", () => {
  const request = buildRequest();
  const registry = buildRiskRegistry();
  const beforeRegistry = JSON.stringify(registry);
  const beforeRequest = JSON.stringify(request);

  const result = runRiskSimulation({ request, riskIntelligence: registry });

  assert.equal(result.riskCount, 1);
  assert.equal(result.riskMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.readOnly, true);
  assert.equal(result.deterministicScenarioDelta, true);
  assert.equal(typeof result.riskImpacts[0]?.riskDelta, "number");
  assert.equal(typeof result.riskImpacts[0]?.riskConfidence, "number");
  assert.equal(JSON.stringify(registry), beforeRegistry);
  assert.equal(JSON.stringify(request), beforeRequest);
  assert.throws(() => {
    (result.riskImpacts as unknown as object[]).push({});
  }, TypeError);
});

test("uses latest DS-6 risk intelligence registry when one is not supplied", () => {
  buildRiskRegistry();

  const result = RiskSimulationEngine.runRiskSimulation({ request: buildRequest() });

  assert.equal(result.riskCount, 1);
  assert.equal(result.riskImpacts[0]?.riskId, "risk-supplier");
});

test("stores latest risk simulation result read-only", () => {
  const result = RiskSimulationEngine.runRiskSimulation({
    request: buildRequest(),
    riskIntelligence: buildRiskRegistry(),
  });

  assert.equal(getRiskSimulationResult(), result);
  assert.equal(RiskSimulationEngine.getRiskSimulationResult().riskMutation, false);
});
