import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiImpactEngine,
  buildKpiImpactRegistry,
  calculateKpiImpactProfile,
  getKpiImpactRegistry,
  resetKpiImpactEngineForTests,
  resolveKpiImpactLevel,
} from "./KpiImpactEngine.ts";
import {
  KPI_IMPACT_ENGINE_DIAGNOSTIC,
  KPI_IMPACT_UPDATED_DIAGNOSTIC,
} from "./kpiImpactContract.ts";
import type { KpiIntelligenceProfile } from "./kpiIntelligenceContract.ts";

test.beforeEach(() => {
  resetKpiImpactEngineForTests();
});

test("calculates KPI impact profile from explicit influence factors", () => {
  const profile: KpiIntelligenceProfile = Object.freeze({
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

  const impact = calculateKpiImpactProfile(profile, {
    businessInfluence: 96,
    financialInfluence: 94,
    operationalInfluence: 80,
  });

  assert.equal(impact.kpiId, "revenue");
  assert.equal(impact.impactScore, 91);
  assert.equal(impact.impactLevel, "Critical");
  assert.equal(impact.impactFactors.businessInfluence, 96);
  assert.equal(impact.impactFactors.financialInfluence, 94);
  assert.equal(impact.impactFactors.operationalInfluence, 80);
  assert.equal(impact.sourceProfile, profile);
  assert.equal(Object.isFrozen(impact), true);
  assert.equal(Object.isFrozen(impact.impactFactors), true);
});

test("maps KPI impact thresholds to levels", () => {
  assert.equal(resolveKpiImpactLevel(85), "Critical");
  assert.equal(resolveKpiImpactLevel(65), "High");
  assert.equal(resolveKpiImpactLevel(40), "Medium");
  assert.equal(resolveKpiImpactLevel(39), "Low");
});

test("builds immutable KPI impact registry from raw KPI input", () => {
  const registry = buildKpiImpactRegistry({
    kpis: [
      {
        id: "delivery",
        label: "Delivery",
        value: 96,
        target: 95,
        category: "Delivery",
        businessInfluence: 88,
        financialInfluence: 72,
        operationalInfluence: 92,
      },
      {
        id: "quality",
        label: "Quality",
        value: 98,
        target: 100,
        category: "Quality",
      },
    ],
  });

  assert.equal(registry.kpiCount, 2);
  assert.equal(registry.impactByKpiId.delivery?.impactScore, 83);
  assert.equal(registry.impactByKpiId.delivery?.impactLevel, "High");
  assert.equal(registry.impactByKpiId.quality?.impactLevel, "High");
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.diagnostics.includes(KPI_IMPACT_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_IMPACT_UPDATED_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.impactByKpiId), true);
  assert.equal(getKpiImpactRegistry().kpiCount, 2);
});

test("KPI impact engine reads scene KPIs without mutation", () => {
  const sceneJson = {
    scene: {
      kpis: [
        {
          id: "margin",
          label: "Margin",
          value: 32,
          target: 30,
          category: "Margin",
          financialInfluence: 95,
        },
      ],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = KpiImpactEngine.buildKpiImpactRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.impactByKpiId.margin?.impactLevel, "High");
  assert.equal(Object.prototype.hasOwnProperty.call(sceneJson.scene.kpis[0], "impactScore"), false);
});
