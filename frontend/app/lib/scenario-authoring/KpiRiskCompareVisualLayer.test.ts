import test from "node:test";
import assert from "node:assert/strict";

import {
  buildKpiDifferenceProfile,
  buildRiskDifferenceProfile,
  C2_KPI_RISK_VISUAL_COMPLETE_TAG,
  generateKpiRiskCompareVisualLayer,
  getKpiRiskCompareVisualLayerResult,
  KPI_RISK_VISUAL_LAYER_DIAGNOSTIC,
  KPI_RISK_VISUAL_READY_DIAGNOSTIC,
  KpiRiskCompareVisualLayer,
  resetKpiRiskCompareVisualLayerForTests,
  type KpiDifferenceProfile,
  type RiskDifferenceProfile,
} from "./KpiRiskCompareVisualLayer.ts";

function kpiDifference(kpiId: string, delta: number): KpiDifferenceProfile {
  return buildKpiDifferenceProfile({
    differenceId: `kpi-diff:${kpiId}`,
    comparisonId: "compare:kpi-risk",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    kpiId,
    kpiLabel: kpiId,
    kpiHealthDelta: delta,
    kpiTrendDelta: 0,
    kpiImpactDelta: delta,
    confidence: 84,
    summary: `${kpiId} visual marker`,
  });
}

function riskDifference(riskId: string, delta: number): RiskDifferenceProfile {
  return buildRiskDifferenceProfile({
    differenceId: `risk-diff:${riskId}`,
    comparisonId: "compare:kpi-risk",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    riskId,
    riskLabel: riskId,
    riskExposureDelta: delta,
    riskProbabilityDelta: 0,
    confidence: 79,
    summary: `${riskId} visual marker`,
  });
}

test.beforeEach(() => {
  resetKpiRiskCompareVisualLayerForTests();
});

test("exports C2 KPI risk visual tag and diagnostics", () => {
  assert.equal(C2_KPI_RISK_VISUAL_COMPLETE_TAG, "[C2_KPI_RISK_VISUAL_COMPLETE]");
  assert.equal(KPI_RISK_VISUAL_LAYER_DIAGNOSTIC, "[KPI_RISK_VISUAL_LAYER]");
  assert.equal(KPI_RISK_VISUAL_READY_DIAGNOSTIC, "[KPI_RISK_VISUAL_READY]");
  assert.deepEqual(KpiRiskCompareVisualLayer.diagnostics, [
    "[KPI_RISK_VISUAL_LAYER]",
    "[KPI_RISK_VISUAL_READY]",
  ]);
});

test("generates KPI visual layer markers", () => {
  const result = generateKpiRiskCompareVisualLayer({
    kpiDifferences: [
      kpiDifference("revenue", 6),
      kpiDifference("margin", -4),
    ],
    riskDifferences: [],
  });

  assert.equal(result.kpiMarkers.length, 2);
  assert.equal(result.riskMarkers.length, 0);
  assert.equal(result.kpiImprovementCount, 1);
  assert.equal(result.kpiDeclineCount, 1);
  assert.deepEqual(result.kpiMarkers.map((marker) => marker.display), [
    "KPI Improvement",
    "KPI Decline",
  ]);
  assert.equal(result.visualOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(result.kpiMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(Object.isFrozen(result.kpiMarkers), true);
});

test("generates risk visual layer markers without mutation", () => {
  const increase = riskDifference("supplier-risk", 5);
  const reduction = riskDifference("delay-risk", -7);
  const beforeIncrease = JSON.stringify(increase);
  const beforeReduction = JSON.stringify(reduction);

  const result = generateKpiRiskCompareVisualLayer({
    kpiDifferences: [],
    riskDifferences: [increase, reduction],
  });

  assert.equal(result.kpiMarkers.length, 0);
  assert.equal(result.riskMarkers.length, 2);
  assert.equal(result.riskIncreaseCount, 1);
  assert.equal(result.riskReductionCount, 1);
  assert.deepEqual(result.riskMarkers.map((marker) => marker.display), [
    "Risk Increase",
    "Risk Reduction",
  ]);
  assert.equal(result.visualOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(result.riskMutation, false);
  assert.equal(result.topologyMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(JSON.stringify(increase), beforeIncrease);
  assert.equal(JSON.stringify(reduction), beforeReduction);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.riskMarkers), true);
  assert.throws(() => {
    (result.riskMarkers as unknown as object[]).push({});
  }, TypeError);
  assert.equal(getKpiRiskCompareVisualLayerResult(), result);
});
