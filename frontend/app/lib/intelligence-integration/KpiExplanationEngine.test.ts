import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiExplanationEngine,
  buildKpiExplanationRegistry,
  resetKpiExplanationEngineForTests,
} from "./KpiExplanationEngine.ts";
import {
  INT3_KPI_EXPLANATION_COMPLETE_TAG,
  KPI_EXPLANATION_ENGINE_DIAGNOSTIC,
  KPI_EXPLANATION_READY_DIAGNOSTIC,
} from "./kpiExplanationEngineContract.ts";
import { resetExecutiveKpiSummaryForTests } from "../kpi-intelligence/ExecutiveKpiSummary.ts";
import { resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { resetKpiDiscoveryEngineForTests } from "../kpi-intelligence/KpiDiscoveryEngine.ts";
import { resetKpiHealthEngineForTests } from "../kpi-intelligence/KpiHealthEngine.ts";
import { resetKpiTrendEngineForTests } from "../kpi-intelligence/KpiTrendEngine.ts";
import { resetKpiDependencyEngineForTests } from "../kpi-intelligence/KpiDependencyEngine.ts";
import { resetKpiImpactEngineForTests } from "../kpi-intelligence/KpiImpactEngine.ts";

const SAMPLE_SCENE = {
  scene: {
    objects: [
      { id: "supplier-1", label: "Primary Supplier", type: "supplier", active: false, sourceConfidence: 15 },
      { id: "inventory-1", label: "Inventory", type: "inventory", activityLevel: 55 },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
        status: "healthy",
        confidence: 75,
        metadata: { supplyRisk: 85, dependency: 88 },
      },
    ],
    kpis: [
      { id: "revenue", label: "Revenue", category: "Revenue", value: 80, target: 100, direction: "up" },
      { id: "cost", label: "Operating Cost", category: "Cost", value: 95, target: 70, direction: "up" },
    ],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
};

test.beforeEach(() => {
  resetKpiExplanationEngineForTests();
  resetExecutiveKpiSummaryForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetKpiDiscoveryEngineForTests();
  resetKpiHealthEngineForTests();
  resetKpiTrendEngineForTests();
  resetKpiDependencyEngineForTests();
  resetKpiImpactEngineForTests();
});

test("exports INT-3 KPI explanation completion tag", () => {
  assert.equal(INT3_KPI_EXPLANATION_COMPLETE_TAG, "[INT3_KPI_EXPLANATION_COMPLETE]");
  assert.equal(KPI_EXPLANATION_ENGINE_DIAGNOSTIC, "[KPI_EXPLANATION_ENGINE]");
  assert.equal(KPI_EXPLANATION_READY_DIAGNOSTIC, "[KPI_EXPLANATION_READY]");
});

test("generates executive KPI explanations from DS-5 intelligence", () => {
  const registry = buildKpiExplanationRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.explanationReady, true);
  assert.ok(registry.explanationCount > 0);
  assert.ok(registry.explanations.length > 0);
  assert.ok(registry.explanations.every((entry) => entry.executiveSummary.length > 0));
  assert.ok(registry.explanations.every((entry) => entry.healthExplanation.length > 0));
  assert.ok(registry.explanations.every((entry) => entry.trendExplanation.length > 0));
  assert.ok(registry.explanations.every((entry) => entry.impactExplanation.length > 0));
  assert.ok(registry.explanations.every((entry) => entry.confidenceExplanation.length > 0));
  assert.equal(registry.diagnostics.includes(KPI_EXPLANATION_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_EXPLANATION_READY_DIAGNOSTIC), true);
});

test("explains why KPIs are improving, declining, or critical", () => {
  const registry = buildKpiExplanationRegistry({
    sceneJson: SAMPLE_SCENE,
    historicalSnapshots: Object.freeze([
      { kpiId: "revenue", value: 95 },
      { kpiId: "revenue", value: 85 },
      { kpiId: "revenue", value: 80 },
    ]),
  });

  assert.ok(registry.improvingExplanations.length > 0 || registry.explanations.some((e) => e.kind === "improving" || e.kind === "stable"));
  assert.ok(registry.decliningExplanations.length > 0);

  for (const entry of registry.explanations) {
    if (entry.whyImproving) assert.ok(entry.whyImproving.length > 0);
    if (entry.whyDeclining) assert.ok(entry.whyDeclining.length > 0);
    if (entry.whyCritical) assert.ok(entry.whyCritical.length > 0);
  }
});

test("consumes KPI intelligence without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  KpiExplanationEngine.buildKpiExplanationRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
});
