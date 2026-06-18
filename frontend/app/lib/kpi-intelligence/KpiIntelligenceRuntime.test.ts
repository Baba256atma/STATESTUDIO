import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiIntelligenceRuntime,
  buildKpiIntelligenceRegistry,
  getKpiIntelligenceRegistry,
  resetKpiIntelligenceRuntimeForTests,
} from "./KpiIntelligenceRuntime.ts";
import {
  KPI_INTELLIGENCE_READY_DIAGNOSTIC,
  KPI_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
  KPI_INTELLIGENCE_SUPPORTED_CATEGORIES,
} from "./kpiIntelligenceContract.ts";

test.beforeEach(() => {
  resetKpiIntelligenceRuntimeForTests();
});

test("builds immutable KPI intelligence registry with supported categories", () => {
  const registry = buildKpiIntelligenceRegistry({
    kpis: [
      { id: "revenue", label: "Revenue", category: "Revenue", value: 120, target: 100 },
      { id: "cost", label: "Cost", category: "Cost", value: 80, target: 100 },
      { id: "margin", label: "Margin", category: "Margin", value: 32, target: 30 },
      { id: "schedule", label: "Schedule", category: "Schedule", value: 92, target: 100 },
      { id: "quality", label: "Quality defects", category: "Quality", value: 4, target: 10 },
      { id: "capacity", label: "Capacity", category: "Capacity", value: 88, target: 90 },
      { id: "delivery", label: "Delivery", category: "Delivery", value: 96, target: 95 },
      { id: "risk", label: "Risk Exposure", category: "Risk Exposure", value: 30, target: 50 },
    ],
  });

  assert.equal(registry.kpiCount, 8);
  assert.deepEqual(registry.supportedCategories, KPI_INTELLIGENCE_SUPPORTED_CATEGORIES);
  assert.equal(registry.profileByKpiId.revenue?.category, "Revenue");
  assert.equal(registry.profileByKpiId.cost?.direction, "down");
  assert.equal(registry.profileByKpiId.risk?.category, "Risk Exposure");
  assert.equal(registry.visualRendering, false);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.diagnostics.includes(KPI_INTELLIGENCE_RUNTIME_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_INTELLIGENCE_READY_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.profileByKpiId), true);
});

test("reads KPI records from scene without mutating scene payload", () => {
  const sceneJson = {
    scene: {
      kpis: [
        {
          id: "delivery_on_time",
          label: "Delivery On Time",
          value: 0.87,
          target: 0.9,
          direction: "up",
          confidence: 0.8,
        },
      ],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = KpiIntelligenceRuntime.buildKpiIntelligenceRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.kpiCount, 1);
  assert.equal(registry.profileByKpiId.delivery_on_time?.category, "Delivery");
  assert.equal(registry.profileByKpiId.delivery_on_time?.confidence, 80);
  assert.equal(Object.prototype.hasOwnProperty.call(sceneJson.scene.kpis[0], "intelligenceScore"), false);
  assert.equal(getKpiIntelligenceRegistry().kpiCount, 1);
});

test("dedupes KPI profiles and keeps first source profile immutable", () => {
  const registry = buildKpiIntelligenceRegistry({
    kpis: [
      { id: "risk_exposure", label: "Risk", value: 70, target: 50, category: "Risk Exposure" },
      { id: "risk_exposure", label: "Risk duplicate", value: 20, target: 50, category: "Risk Exposure" },
    ],
    dataSourceKpis: [{ id: "revenue_growth", label: "Revenue Growth", value: 110, target: 100 }],
  });

  assert.equal(registry.kpiCount, 2);
  assert.equal(registry.profileByKpiId.risk_exposure?.label, "Risk");
  assert.equal(registry.profileByKpiId.risk_exposure?.source, "scene");
  assert.equal(registry.profileByKpiId.revenue_growth?.source, "data_source");
});
