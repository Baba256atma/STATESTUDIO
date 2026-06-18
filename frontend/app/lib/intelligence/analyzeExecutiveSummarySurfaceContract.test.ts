import test from "node:test";
import assert from "node:assert/strict";

import {
  ANALYZE_SUMMARY_DIAGNOSTIC,
  ANALYZE_SUMMARY_READY_DIAGNOSTIC,
  ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC,
  INT1_ANALYZE_SURFACE_COMPLETE_TAG,
  buildAnalyzeExecutiveSummaryView,
} from "./analyzeExecutiveSummarySurfaceContract.ts";

const SAMPLE_INTELLIGENCE = Object.freeze({
  objectId: "supplier-1",
  objectName: "Primary Supplier",
  healthScore: 72,
  impactScore: 55,
  trendLabel: "Declining",
  trendSummary: "Object supplier-1 trend declining with strength 40.",
  importanceScore: 68,
  riskScore: 81,
  scenarioSummary: "Executive scenario intelligence covers 4 scenario(s).",
  intelligenceSummary: "Analyze binding for Primary Supplier.",
  bindingStatus: "bound" as const,
  bindingReady: true as const,
});

test("exports INT-1 analyze surface completion tag", () => {
  assert.equal(INT1_ANALYZE_SURFACE_COMPLETE_TAG, "[INT1_ANALYZE_SURFACE_COMPLETE]");
  assert.equal(ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC, "[ANALYZE_SUMMARY_SURFACE]");
  assert.equal(ANALYZE_SUMMARY_READY_DIAGNOSTIC, "[ANALYZE_SUMMARY_READY]");
  assert.equal(ANALYZE_SUMMARY_DIAGNOSTIC, "[ANALYZE_SUMMARY_SURFACE]");
});

test("builds executive summary surface with all analyze intelligence fields", () => {
  const summary = buildAnalyzeExecutiveSummaryView({
    intelligence: SAMPLE_INTELLIGENCE,
    profile: Object.freeze({
      profileId: "analyze-intelligence:1.1.0",
      version: "1.2.0",
      analyzeSummary: "Analyze intelligence profile ready.",
      health: Object.freeze({
        score: 72,
        summary: "health",
        objectAverageScore: 70,
        kpiAverageScore: 74,
        contractReady: true,
      }),
      impact: Object.freeze({
        score: 55,
        summary: "impact",
        objectAverageScore: 50,
        kpiAverageScore: 60,
        contractReady: true,
      }),
      trend: Object.freeze({
        summary: "trend",
        improvingCount: 0,
        stableCount: 1,
        decliningCount: 1,
        volatileCount: 0,
        topDecliningKpis: Object.freeze([]),
        contractReady: true,
      }),
      importance: Object.freeze({
        score: 68,
        summary: "importance",
        recommendedAttentionCount: 1,
        contractReady: true,
      }),
      risk: Object.freeze({
        score: 81,
        summary: "risk",
        topRisks: Object.freeze(["delay-risk"]),
        recommendedAttentionCount: 1,
        contractReady: true,
      }),
      scenarioSummary: Object.freeze({
        summary: "Scenario summary",
        scenarioCount: 4,
        recommendedScenarioId: "scenario:baseline",
        recommendedScenarioLabel: "Baseline",
        contractReady: true,
      }),
      confidence: Object.freeze({
        score: 63,
        summary: "confidence",
        objectAverageScore: 58,
        kpiAverageScore: 68,
        contractReady: true,
      }),
      snapshotVersion: "1.1.0",
      readOnly: true,
      sceneMutation: false,
      objectMutation: false,
      routingMutation: false,
      mrpMutation: false,
      simulationActive: false,
      uiRendering: false,
      diagnostics: Object.freeze(["[ANALYZE_INTELLIGENCE_CONTRACT]", "[ANALYZE_INTELLIGENCE_CONTRACT_READY]"] as const),
    }),
  });

  assert.equal(summary.summaryReady, true);
  assert.equal(summary.healthLabel, "72");
  assert.equal(summary.impactLabel, "55");
  assert.equal(summary.trendLabel, "Declining");
  assert.equal(summary.importanceLabel, "68");
  assert.equal(summary.riskLabel, "81");
  assert.equal(summary.confidenceLabel, "63");
  assert.equal(summary.scenarioSummaryLabel, "Baseline");
  assert.equal(Object.isFrozen(summary), true);
});
