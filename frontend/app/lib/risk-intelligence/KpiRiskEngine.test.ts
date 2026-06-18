import test from "node:test";
import assert from "node:assert/strict";

import { calculateKpiHealthProfile } from "../kpi-intelligence/KpiHealthEngine.ts";
import { calculateKpiImpactProfile } from "../kpi-intelligence/KpiImpactEngine.ts";
import { calculateKpiTrendProfile } from "../kpi-intelligence/KpiTrendEngine.ts";
import type { KpiIntelligenceProfile } from "../kpi-intelligence/kpiIntelligenceContract.ts";
import {
  KpiRiskEngine,
  buildKpiRiskRegistry,
  calculateKpiRiskProfile,
  calculateKpiRiskProfileFromIntelligence,
  getKpiRiskRegistry,
  resetKpiRiskEngineForTests,
} from "./KpiRiskEngine.ts";
import {
  KPI_RISK_ENGINE_DIAGNOSTIC,
  KPI_RISK_UPDATED_DIAGNOSTIC,
} from "./kpiRiskProfileContract.ts";

const healthyProfile: KpiIntelligenceProfile = Object.freeze({
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

test.beforeEach(() => {
  resetKpiRiskEngineForTests();
});

test("exports canonical KPI risk diagnostics", () => {
  assert.equal(KPI_RISK_ENGINE_DIAGNOSTIC, "[KPI_RISK_ENGINE]");
  assert.equal(KPI_RISK_UPDATED_DIAGNOSTIC, "[KPI_RISK_UPDATED]");
});

test("generates 0-100 kpi risk score from health trend and impact", () => {
  const profile = calculateKpiRiskProfile(healthyProfile, {
    historicalSnapshots: [
      { kpiId: "delivery", value: 90, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "delivery", value: 94, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "delivery", value: 96, capturedAt: "2026-03-01T00:00:00.000Z" },
    ],
  });

  assert.equal(profile.kpiId, "delivery");
  assert.equal(typeof profile.kpiRiskScore, "number");
  assert.equal(profile.kpiRiskScore >= 0 && profile.kpiRiskScore <= 100, true);
  assert.equal(profile.decliningKpi, false);
  assert.equal(profile.criticalKpi, false);
  assert.equal(profile.volatileKpi, false);
  assert.equal(profile.riskFactors.healthState, "Healthy");
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile.riskFactors), true);
});

test("detects declining critical and volatile KPIs", () => {
  const decliningProfile: KpiIntelligenceProfile = Object.freeze({
    kpiId: "margin",
    label: "Margin",
    category: "Margin",
    value: 42,
    target: 60,
    intelligenceScore: 38,
    confidence: 55,
    direction: "up",
    source: "scene",
  });
  const declining = calculateKpiRiskProfile(decliningProfile, {
    historicalSnapshots: [
      { kpiId: "margin", value: 58, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "margin", value: 50, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "margin", value: 42, capturedAt: "2026-03-01T00:00:00.000Z" },
    ],
  });

  assert.equal(declining.decliningKpi, true);
  assert.equal(declining.criticalKpi, true);
  assert.equal(declining.volatileKpi, false);
  assert.equal(declining.kpiRiskScore >= 50, true);

  const volatileProfile: KpiIntelligenceProfile = Object.freeze({
    kpiId: "capacity",
    label: "Capacity",
    category: "Capacity",
    value: 70,
    target: 75,
    intelligenceScore: 68,
    confidence: 72,
    direction: "neutral",
    source: "scene",
  });
  const volatile = calculateKpiRiskProfile(volatileProfile, {
    historicalSnapshots: [
      { kpiId: "capacity", value: 70, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "capacity", value: 95, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "capacity", value: 55, capturedAt: "2026-03-01T00:00:00.000Z" },
      { kpiId: "capacity", value: 88, capturedAt: "2026-04-01T00:00:00.000Z" },
    ],
  });

  assert.equal(volatile.volatileKpi, true);
  assert.equal(volatile.decliningKpi, false);
});

test("composes KPI risk profile from intelligence outputs", () => {
  const source: KpiIntelligenceProfile = Object.freeze({
    kpiId: "risk",
    label: "Risk Exposure",
    category: "Risk Exposure",
    value: 90,
    target: 50,
    intelligenceScore: 40,
    confidence: 70,
    direction: "down",
    source: "scene",
  });
  const health = calculateKpiHealthProfile(source);
  const trend = calculateKpiTrendProfile(source, [
    { kpiId: "risk", value: 70, capturedAt: "2026-01-01T00:00:00.000Z" },
    { kpiId: "risk", value: 82, capturedAt: "2026-02-01T00:00:00.000Z" },
    { kpiId: "risk", value: 90, capturedAt: "2026-03-01T00:00:00.000Z" },
  ]);
  const impact = calculateKpiImpactProfile(source);

  const profile = calculateKpiRiskProfileFromIntelligence(health, trend, impact);

  assert.equal(profile.kpiId, "risk");
  assert.equal(typeof profile.kpiRiskScore, "number");
  assert.equal(profile.criticalKpi, true);
});

test("creates immutable KPI risk registry with diagnostics", () => {
  const registry = buildKpiRiskRegistry({
    kpis: [
      { id: "revenue", label: "Revenue", value: 120, target: 100, category: "Revenue", confidence: 85 },
      { id: "risk", label: "Risk Exposure", value: 90, target: 50, category: "Risk Exposure", confidence: 70 },
    ],
    historicalSnapshots: [
      { kpiId: "revenue", value: 100, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "revenue", value: 110, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "risk", value: 60, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "risk", value: 78, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "risk", value: 90, capturedAt: "2026-03-01T00:00:00.000Z" },
    ],
  });

  assert.equal(registry.kpiCount, 2);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(KPI_RISK_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_RISK_UPDATED_DIAGNOSTIC), true);
  assert.equal(typeof registry.riskByKpiId.revenue?.kpiRiskScore, "number");
  assert.equal(registry.riskByKpiId.risk?.criticalKpi, true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(getKpiRiskRegistry().kpiCount, 2);
});

test("KPI risk computation does not mutate source KPI records", () => {
  const kpi = {
    id: "schedule",
    label: "Schedule",
    value: 80,
    target: 90,
    category: "Schedule",
    confidence: 75,
  };
  const before = JSON.stringify(kpi);

  const registry = KpiRiskEngine.buildKpiRiskRegistry({ kpis: [kpi] });

  assert.equal(JSON.stringify(kpi), before);
  assert.equal(Object.prototype.hasOwnProperty.call(kpi, "kpiRiskScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(kpi, "criticalKpi"), false);
  assert.equal(typeof registry.riskByKpiId.schedule?.kpiRiskScore, "number");
});
