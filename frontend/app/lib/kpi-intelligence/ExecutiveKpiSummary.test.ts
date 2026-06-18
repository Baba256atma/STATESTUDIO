import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveKpiSummary,
  getExecutiveKpiSummary,
  resetExecutiveKpiSummaryForTests,
} from "./ExecutiveKpiSummary.ts";
import {
  EXEC_KPI_SUMMARY_DIAGNOSTIC,
  EXEC_KPI_SUMMARY_READY_DIAGNOSTIC,
} from "./executiveKpiSummaryContract.ts";

test.beforeEach(() => {
  resetExecutiveKpiSummaryForTests();
});

test("builds executive KPI summary with rankings and attention", () => {
  const summary = buildExecutiveKpiSummary({
    kpis: [
      {
        id: "revenue",
        label: "Revenue",
        category: "Revenue",
        value: 120,
        target: 100,
        confidence: 90,
        dependencyScore: 86,
      },
      {
        id: "delivery",
        label: "Delivery",
        category: "Delivery",
        value: 60,
        target: 100,
        confidence: 62,
        businessInfluence: 90,
        financialInfluence: 78,
        operationalInfluence: 92,
      },
    ],
    historicalSnapshots: [
      { kpiId: "revenue", value: 100, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "revenue", value: 120, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "delivery", value: 95, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "delivery", value: 60, capturedAt: "2026-02-01T00:00:00.000Z" },
    ],
  });

  assert.equal(summary.kpiCount, 2);
  assert.equal(summary.averageHealthScore, 79);
  assert.equal(summary.averageImpactScore, 85);
  assert.equal(summary.averageDependencyScore, 83);
  assert.equal(summary.averageConfidenceScore, 76);
  assert.equal(summary.topPerformingKpis[0], "revenue: health 97");
  assert.equal(summary.topDecliningKpis[0], "delivery: declining 37");
  assert.equal(summary.topCriticalKpis[0]?.startsWith("delivery:"), true);
  assert.equal(summary.recommendedAttention[0]?.kpiId, "delivery");
  assert.equal(summary.recommendedAttention[0]?.attentionLevel, "prioritize");
  assert.equal(summary.diagnostics.includes(EXEC_KPI_SUMMARY_DIAGNOSTIC), true);
  assert.equal(summary.diagnostics.includes(EXEC_KPI_SUMMARY_READY_DIAGNOSTIC), true);
  assert.equal(summary.readOnly, true);
  assert.equal(summary.sceneMutation, false);
  assert.equal(summary.mrpMutation, false);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(Object.isFrozen(summary.profiles), true);
  assert.equal(Object.isFrozen(summary.recommendedAttention), true);
  assert.equal(getExecutiveKpiSummary().kpiCount, 2);
});

test("returns empty executive KPI summary when no profiles are available", () => {
  const summary = buildExecutiveKpiSummary();

  assert.equal(summary.kpiCount, 0);
  assert.equal(summary.executiveSummary, "No KPI intelligence is available.");
  assert.equal(summary.recommendedAttention.length, 0);
  assert.equal(Object.isFrozen(summary.topPerformingKpis), true);
});

test("executive KPI summary reads scene data without mutation", () => {
  const sceneJson = {
    scene: {
      kpis: [
        {
          id: "risk",
          label: "Risk Exposure",
          category: "Risk Exposure",
          value: 90,
          target: 50,
          confidence: 50,
        },
      ],
      kpiSnapshots: [
        { kpiId: "risk", value: 70, capturedAt: "2026-01-01T00:00:00.000Z" },
        { kpiId: "risk", value: 90, capturedAt: "2026-02-01T00:00:00.000Z" },
      ],
    },
  };
  const before = JSON.stringify(sceneJson);

  const summary = buildExecutiveKpiSummary({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(summary.kpiCount, 1);
  assert.equal(summary.profiles[0]?.kpiId, "risk");
  assert.equal(Object.prototype.hasOwnProperty.call(sceneJson.scene.kpis[0], "recommendedAttention"), false);
});
