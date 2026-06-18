import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiHealthEngine,
  buildKpiHealthRegistry,
  calculateKpiHealthProfile,
  getKpiHealthRegistry,
  resetKpiHealthEngineForTests,
  resolveKpiHealthState,
} from "./KpiHealthEngine.ts";
import {
  KPI_HEALTH_ENGINE_DIAGNOSTIC,
  KPI_HEALTH_UPDATED_DIAGNOSTIC,
} from "./kpiHealthContract.ts";
import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

test.beforeEach(() => {
  resetKpiHealthEngineForTests();
});

test("calculates KPI health profile with 0-100 score and state", () => {
  const profile: KpiIntelligenceProfile = Object.freeze({
    kpiId: "delivery",
    label: "Delivery",
    category: "Delivery",
    value: 96,
    target: 95,
    intelligenceScore: 92,
    confidence: 90,
    direction: "up",
    source: "scene",
  });

  const health = calculateKpiHealthProfile(profile);

  assert.equal(health.kpiId, "delivery");
  assert.equal(health.healthScore, 94);
  assert.equal(health.healthState, "Healthy");
  assert.equal(health.thresholds.healthy, 80);
  assert.equal(health.sourceProfile, profile);
  assert.equal(Object.isFrozen(health), true);
  assert.equal(Object.isFrozen(health.thresholds), true);
});

test("maps KPI health states using custom thresholds", () => {
  const thresholds = Object.freeze({ healthy: 90, stable: 70, warning: 50 });

  assert.equal(resolveKpiHealthState(90, thresholds), "Healthy");
  assert.equal(resolveKpiHealthState(70, thresholds), "Stable");
  assert.equal(resolveKpiHealthState(50, thresholds), "Warning");
  assert.equal(resolveKpiHealthState(49, thresholds), "Critical");
});

test("builds immutable KPI health registry from raw KPI input", () => {
  const registry = buildKpiHealthRegistry({
    kpis: [
      { id: "revenue", label: "Revenue", value: 120, target: 100, category: "Revenue", confidence: 85 },
      { id: "risk", label: "Risk Exposure", value: 90, target: 50, category: "Risk Exposure", confidence: 70 },
    ],
    thresholds: { healthy: 85, stable: 65, warning: 45 },
  });

  assert.equal(registry.kpiCount, 2);
  assert.equal(registry.healthByKpiId.revenue?.healthState, "Healthy");
  assert.equal(registry.healthByKpiId.risk?.healthState, "Critical");
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.diagnostics.includes(KPI_HEALTH_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_HEALTH_UPDATED_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.healthByKpiId), true);
  assert.equal(getKpiHealthRegistry().kpiCount, 2);
});

test("KPI health engine does not mutate source KPI records", () => {
  const kpi = {
    id: "margin",
    label: "Margin",
    value: 20,
    target: 30,
    category: "Margin",
    confidence: 80,
  };
  const before = JSON.stringify(kpi);

  const registry = KpiHealthEngine.buildKpiHealthRegistry({ kpis: [kpi] });

  assert.equal(JSON.stringify(kpi), before);
  assert.equal(Object.prototype.hasOwnProperty.call(kpi, "healthScore"), false);
  assert.equal(registry.healthByKpiId.margin?.healthState, "Stable");
});
