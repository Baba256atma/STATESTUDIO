import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiForecastFoundation,
  buildKpiForecastFoundationRegistry,
  getKpiForecastFoundationRegistry,
  resetKpiForecastFoundationForTests,
} from "./KpiForecastFoundation.ts";
import {
  KPI_FORECAST_FOUNDATION_DIAGNOSTIC,
  KPI_FORECAST_READY_DIAGNOSTIC,
} from "./kpiForecastFoundationContract.ts";

test.beforeEach(() => {
  resetKpiForecastFoundationForTests();
});

test("builds forecast-ready KPI structures without prediction", () => {
  const registry = buildKpiForecastFoundationRegistry({
    kpis: [{ id: "revenue", label: "Revenue", value: 120, target: 100, category: "Revenue" }],
    historicalSnapshots: [
      { kpiId: "revenue", value: 100, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "revenue", value: 120, capturedAt: "2026-02-01T00:00:00.000Z" },
    ],
    scenarioInputs: [
      {
        scenarioId: "growth-case",
        label: "Growth Case",
        assumptions: { pricing: "expanded" },
      },
    ],
  });

  const profile = registry.forecastByKpiId.revenue;
  assert.equal(registry.kpiCount, 1);
  assert.equal(registry.foundationOnly, true);
  assert.equal(registry.predictionActive, false);
  assert.equal(profile?.futureProjections.length, 3);
  assert.equal(profile?.futureProjections[0]?.projectionReady, true);
  assert.equal(profile?.futureProjections[0]?.predictedValue, null);
  assert.equal(profile?.trendContinuation?.trendDirection, "Improving");
  assert.equal(profile?.trendContinuation?.continuationReady, true);
  assert.equal(profile?.scenarioInputs[0]?.scenarioId, "growth-case");
  assert.equal(profile?.predictionActive, false);
});

test("publishes immutable forecast foundation registry with diagnostics", () => {
  const registry = buildKpiForecastFoundationRegistry({
    kpis: [{ id: "delivery", label: "Delivery", value: 90, target: 100, category: "Delivery" }],
  });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.diagnostics.includes(KPI_FORECAST_FOUNDATION_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_FORECAST_READY_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.futureProjections), true);
  assert.equal(Object.isFrozen(registry.forecastByKpiId), true);
  assert.equal(getKpiForecastFoundationRegistry().kpiCount, 1);
});

test("forecast foundation reads scene KPIs without mutation", () => {
  const sceneJson = {
    scene: {
      kpis: [{ id: "risk", label: "Risk Exposure", value: 80, target: 50, category: "Risk Exposure" }],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = KpiForecastFoundation.buildKpiForecastFoundationRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.forecastByKpiId.risk?.futureProjections.length, 3);
  assert.equal(Object.prototype.hasOwnProperty.call(sceneJson.scene.kpis[0], "predictedValue"), false);
});
