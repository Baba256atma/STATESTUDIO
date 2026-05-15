import assert from "node:assert/strict";
import test from "node:test";

import { deriveExecutiveFocusSummary } from "./deriveExecutiveFocusSummary.ts";
import { buildExecutiveUxDiagnostics, logExecutiveUxDiagnostics } from "./executiveUxDiagnostics.ts";

test("returns a steady-state summary when no signals are present", () => {
  const summary = deriveExecutiveFocusSummary({ signals: [] });

  assert.equal(summary.headline, "Executive focus is steady");
  assert.equal(summary.recommendedPanel, "executive_dashboard");
  assert.equal(summary.visualTreatment.allowFlash, false);
});

test("derives one canonical executive focus summary from noisy signals", () => {
  const summary = deriveExecutiveFocusSummary({
    signals: [
      {
        id: "alert-supplier",
        sourceType: "alert",
        title: "Supplier propagation pressure",
        summary: "Supplier instability is increasing delivery exposure. Additional duplicate wording follows.",
        severity: "critical",
        confidence: 0.88,
        relatedObjectIds: ["supplier", "delivery"],
        recommendedFocus: "Reduce supplier dependency concentration.",
      },
      {
        id: "alert-supplier",
        sourceType: "alert",
        title: "Supplier propagation pressure",
        severity: "critical",
        confidence: 0.88,
        relatedObjectIds: ["delivery", "supplier"],
      },
      {
        id: "memory-supplier",
        sourceType: "memory",
        title: "Supplier fragility has recurred",
        severity: "medium",
        confidence: 0.7,
        relatedObjectIds: ["supplier"],
      },
    ],
  });

  assert.equal(summary.primarySignalId, "alert-supplier");
  assert.equal(summary.level, "immediate_focus");
  assert.equal(summary.recommendedPanel, "decision_strip");
  assert.equal(summary.noiseReductionCount, 1);
  assert.deepEqual(summary.relatedObjectIds, ["supplier", "delivery"]);
  assert.equal(summary.confidenceLevel, "very_high");
});

test("softens false certainty in executive summaries", () => {
  const summary = deriveExecutiveFocusSummary({
    signals: [
      {
        id: "forecast",
        sourceType: "monitoring",
        title: "Delivery forecast",
        summary: "Delivery will definitely fail unless action happens.",
        severity: "high",
        confidence: 0.72,
      },
    ],
  });

  assert.equal(summary.summary.includes("will definitely"), false);
  assert.equal(summary.summary.includes("is expected to"), true);
});

test("builds deduped executive UX diagnostics without requiring logging", () => {
  const diagnostics = buildExecutiveUxDiagnostics({
    signals: [
      { id: "a", sourceType: "alert", severity: "critical", confidence: 1 },
      { id: "b", sourceType: "memory", severity: "low", confidence: 0.3 },
    ],
  });

  const signature = logExecutiveUxDiagnostics(diagnostics, { enabled: false });
  assert.equal(signature, diagnostics.signature);
  assert.equal(diagnostics.activePrimarySignals, 1);
});
