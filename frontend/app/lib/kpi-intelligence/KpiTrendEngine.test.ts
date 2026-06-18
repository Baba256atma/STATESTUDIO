import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiTrendEngine,
  buildKpiTrendRegistry,
  calculateKpiTrendProfile,
  getKpiTrendRegistry,
  resetKpiTrendEngineForTests,
  resolveKpiTrendDirection,
} from "./KpiTrendEngine.ts";
import {
  KPI_TREND_ENGINE_DIAGNOSTIC,
  KPI_TREND_UPDATED_DIAGNOSTIC,
} from "./kpiTrendContract.ts";
import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

const revenueProfile: KpiIntelligenceProfile = Object.freeze({
  kpiId: "revenue",
  label: "Revenue",
  category: "Revenue",
  value: 120,
  target: 100,
  intelligenceScore: 100,
  confidence: 90,
  direction: "up",
  source: "scene",
});

test.beforeEach(() => {
  resetKpiTrendEngineForTests();
});

test("calculates KPI trend profile from historical snapshots", () => {
  const trend = calculateKpiTrendProfile(revenueProfile, [
    { kpiId: "revenue", value: 90, capturedAt: "2026-01-01T00:00:00.000Z" },
    { kpiId: "revenue", value: 100, capturedAt: "2026-02-01T00:00:00.000Z" },
    { kpiId: "revenue", value: 120, capturedAt: "2026-03-01T00:00:00.000Z" },
  ]);

  assert.equal(trend.kpiId, "revenue");
  assert.equal(trend.trendDirection, "Improving");
  assert.equal(trend.trendStrength, 33);
  assert.equal(trend.snapshotCount, 3);
  assert.equal(trend.sourceProfile, revenueProfile);
  assert.equal(Object.isFrozen(trend), true);
});

test("detects stable declining and volatile trend directions", () => {
  assert.equal(resolveKpiTrendDirection([100, 101, 100]), "Stable");
  assert.equal(resolveKpiTrendDirection([100, 92, 85]), "Declining");
  assert.equal(resolveKpiTrendDirection([100, 130, 80, 125]), "Volatile");
});

test("builds immutable KPI trend registry with diagnostics", () => {
  const registry = buildKpiTrendRegistry({
    profiles: [revenueProfile],
    historicalSnapshots: [
      { kpiId: "revenue", value: 100, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "revenue", value: 106, capturedAt: "2026-02-01T00:00:00.000Z" },
    ],
  });

  assert.equal(registry.kpiCount, 1);
  assert.equal(registry.trendByKpiId.revenue?.trendDirection, "Improving");
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.diagnostics.includes(KPI_TREND_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_TREND_UPDATED_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.trendByKpiId), true);
  assert.equal(getKpiTrendRegistry().kpiCount, 1);
});

test("KPI trend engine reads scene snapshots without mutation", () => {
  const sceneJson = {
    scene: {
      kpis: [{ id: "delivery", label: "Delivery", value: 90, target: 100, category: "Delivery" }],
      kpiSnapshots: [
        { kpiId: "delivery", value: 95, capturedAt: "2026-01-01T00:00:00.000Z" },
        { kpiId: "delivery", value: 88, capturedAt: "2026-02-01T00:00:00.000Z" },
      ],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = KpiTrendEngine.buildKpiTrendRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.trendByKpiId.delivery?.trendDirection, "Declining");
  assert.equal(Object.prototype.hasOwnProperty.call(sceneJson.scene.kpis[0], "trendDirection"), false);
});
