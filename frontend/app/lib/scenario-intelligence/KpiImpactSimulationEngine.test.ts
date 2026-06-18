import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiImpactSimulationEngine,
  buildKpiImpactProfileRegistry,
  getKpiImpactProfileRegistry,
  resetKpiImpactSimulationEngineForTests,
} from "./KpiImpactSimulationEngine.ts";
import { resetScenarioBuilderEngineForTests } from "./ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import {
  KPI_IMPACT_READY_DIAGNOSTIC,
  KPI_IMPACT_SIMULATION_DIAGNOSTIC,
} from "./kpiImpactSimulationContract.ts";
import { resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { resetKpiHealthEngineForTests } from "../kpi-intelligence/KpiHealthEngine.ts";
import { resetKpiTrendEngineForTests } from "../kpi-intelligence/KpiTrendEngine.ts";
import { resetKpiImpactEngineForTests } from "../kpi-intelligence/KpiImpactEngine.ts";
import { resetKpiForecastFoundationForTests } from "../kpi-intelligence/KpiForecastFoundation.ts";

test.beforeEach(() => {
  resetKpiImpactSimulationEngineForTests();
  resetScenarioBuilderEngineForTests();
  resetScenarioGenerationRuntimeForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetKpiHealthEngineForTests();
  resetKpiTrendEngineForTests();
  resetKpiImpactEngineForTests();
  resetKpiForecastFoundationForTests();
});

test("builds immutable KPI impact profiles with forecast impact states", () => {
  const registry = buildKpiImpactProfileRegistry({
    kpis: [
      { id: "revenue", label: "Revenue", category: "Revenue", value: 80, target: 100, direction: "up" },
      { id: "cost", label: "Cost", category: "Cost", value: 80, target: 70, direction: "down" },
    ],
  });

  assert.equal(registry.scenarioCount, 4);
  assert.equal(registry.kpiCount, 2);
  assert.equal(registry.profileCount, 8);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.diagnostics.includes(KPI_IMPACT_SIMULATION_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_IMPACT_READY_DIAGNOSTIC), true);

  const baselineProfile = registry.profileById["kpi-impact:scenario:baseline:revenue"];
  assert.ok(baselineProfile);
  assert.equal(baselineProfile.impactResult.impactState, "Neutral");
  assert.equal(baselineProfile.impactResult.forecastImpact.forecastDelta, 0);
  assert.equal(baselineProfile.impactResult.forecastImpact.predictionActive, false);
  assert.equal(baselineProfile.impactResult.applied, false);

  const riskProfile = registry.profileById["kpi-impact:scenario:risk:revenue"];
  assert.ok(riskProfile);
  assert.equal(riskProfile.impactResult.impactState, "Negative");
  assert.ok(riskProfile.impactResult.forecastImpact.forecastDelta < 0);
  assert.equal(riskProfile.impactResult.forecastImpact.horizonImpacts.length, 3);

  const opportunityProfile = registry.profileById["kpi-impact:scenario:opportunity:revenue"];
  assert.ok(opportunityProfile);
  assert.equal(opportunityProfile.impactResult.impactState, "Positive");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = {
    scene: {
      kpis: [
        { id: "margin", label: "Margin", category: "Margin", value: 32, target: 30, direction: "up" },
      ],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = KpiImpactSimulationEngine.buildKpiImpactProfileRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.profileCount, 4);
  assert.equal(getKpiImpactProfileRegistry().profileCount, 4);
});

test("indexes profiles by KPI and scenario with inverted cost impact semantics", () => {
  const registry = buildKpiImpactProfileRegistry({
    kpis: [{ id: "cost", label: "Cost", category: "Cost", value: 80, target: 70, direction: "down" }],
  });

  const riskProfiles = registry.profilesByScenarioId["scenario:risk"];
  assert.ok(riskProfiles);
  assert.equal(riskProfiles.length, 1);
  assert.equal(riskProfiles[0].impactResult.impactState, "Positive");
  assert.equal(registry.profilesByKpiId["cost"]?.length, 4);
});
