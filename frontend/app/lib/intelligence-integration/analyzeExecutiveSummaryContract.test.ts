import test from "node:test";
import assert from "node:assert/strict";

import {
  ANALYZE_SUMMARY_READY_DIAGNOSTIC,
  ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC,
  buildAnalyzeExecutiveSummaryView,
} from "./analyzeExecutiveSummaryContract.ts";

test("builds executive summary surface with health impact trend importance risk confidence and scenario summary", () => {
  const summary = buildAnalyzeExecutiveSummaryView({
    intelligence: Object.freeze({
      objectId: "supplier-1",
      objectName: "Primary Supplier",
      healthScore: 72,
      impactScore: 55,
      trendLabel: "Declining",
      trendSummary: "Object supplier-1 trend declining with strength 40.",
      importanceScore: 68,
      riskScore: 81,
      scenarioSummary: "Scenario summary text.",
      intelligenceSummary: "Analyze binding for Primary Supplier.",
      bindingStatus: "bound",
      bindingReady: true,
    }),
  });

  assert.equal(summary.summaryReady, true);
  assert.equal(summary.healthLabel, "72");
  assert.equal(summary.impactLabel, "55");
  assert.equal(summary.trendLabel, "Declining");
  assert.equal(summary.importanceLabel, "68");
  assert.equal(summary.riskLabel, "81");
  assert.equal(Object.isFrozen(summary), true);
});

test("exports analyze summary surface diagnostics", () => {
  assert.equal(ANALYZE_SUMMARY_SURFACE_DIAGNOSTIC, "[ANALYZE_SUMMARY_SURFACE]");
  assert.equal(ANALYZE_SUMMARY_READY_DIAGNOSTIC, "[ANALYZE_SUMMARY_READY]");
});
