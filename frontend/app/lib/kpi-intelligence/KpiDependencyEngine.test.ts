import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiDependencyEngine,
  buildKpiDependencyRegistry,
  calculateKpiDependencyProfile,
  getKpiDependencyRegistry,
  resetKpiDependencyEngineForTests,
  resolveKpiDependencyLevel,
} from "./KpiDependencyEngine.ts";
import {
  KPI_DEPENDENCY_ENGINE_DIAGNOSTIC,
  KPI_DEPENDENCY_UPDATED_DIAGNOSTIC,
} from "./kpiDependencyContract.ts";
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
  resetKpiDependencyEngineForTests();
});

test("calculates KPI dependency profile from explicit score", () => {
  const profile = calculateKpiDependencyProfile(revenueProfile, undefined, {
    dependencyScore: 92,
    dependencies: ["pipeline", "pricing"],
  });

  assert.equal(profile.kpiId, "revenue");
  assert.equal(profile.dependencyScore, 92);
  assert.equal(profile.dependencyLevel, "Critical Dependency");
  assert.equal(profile.dependencyCount, 2);
  assert.equal(profile.sourceProfile, revenueProfile);
  assert.equal(Object.isFrozen(profile), true);
});

test("maps KPI dependency thresholds to levels", () => {
  assert.equal(resolveKpiDependencyLevel(85), "Critical Dependency");
  assert.equal(resolveKpiDependencyLevel(65), "Highly Dependent");
  assert.equal(resolveKpiDependencyLevel(40), "Dependent");
  assert.equal(resolveKpiDependencyLevel(39), "Independent");
});

test("builds immutable KPI dependency registry from raw KPI input", () => {
  const registry = buildKpiDependencyRegistry({
    kpis: [
      { id: "delivery", label: "Delivery", value: 96, target: 95, category: "Delivery", dependencies: ["dock", "fleet", "carrier"] },
      { id: "cost", label: "Cost", value: 80, target: 100, category: "Cost" },
    ],
  });

  assert.equal(registry.kpiCount, 2);
  assert.equal(registry.dependencyByKpiId.delivery?.dependencyScore, 81);
  assert.equal(registry.dependencyByKpiId.delivery?.dependencyLevel, "Highly Dependent");
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.diagnostics.includes(KPI_DEPENDENCY_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_DEPENDENCY_UPDATED_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.dependencyByKpiId), true);
  assert.equal(getKpiDependencyRegistry().kpiCount, 2);
});

test("KPI dependency engine reads scene KPIs without mutation", () => {
  const sceneJson = {
    scene: {
      kpis: [
        { id: "risk", label: "Risk Exposure", value: 80, target: 50, category: "Risk Exposure", dependency: "high" },
      ],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = KpiDependencyEngine.buildKpiDependencyRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.dependencyByKpiId.risk?.dependencyScore, 90);
  assert.equal(Object.prototype.hasOwnProperty.call(sceneJson.scene.kpis[0], "dependencyScore"), false);
});
