import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveCanonicalExecutiveSummary,
  validateCanonicalExecutiveSummary,
} from "./canonicalExecutiveSummary.ts";
import { buildIntelligenceHarmonizationDiagnostics } from "./intelligenceHarmonizationDiagnostics.ts";

test("canonical executive summary uses one harmonized cognition model", () => {
  const summary = deriveCanonicalExecutiveSummary({
    signals: [
      {
        id: "alert-1",
        sourceType: "alert",
        severity: "critical",
        confidence: 0.9,
        title: "Supplier propagation pressure",
        summary: "Supplier instability spread will definitely create catastrophic weakness.",
        relatedObjectIds: ["supplier", "delivery"],
        recommendedFocus: "Review supplier dependency propagation.",
      },
    ],
    whyItMatters: "Operational continuity depends on supplier resilience.",
    whatIsChanging: "Propagation pressure is increasing.",
    whatToMonitorNext: "Monitor readiness and delivery propagation.",
  });

  assert.equal(summary.dominantFocus, "critical_blocker");
  assert.deepEqual(summary.relatedObjectIds, ["supplier", "delivery"]);
  assert.equal(summary.whatIsHappening.includes("will definitely"), false);
  assert.equal(summary.whatIsHappening.includes("catastrophic weakness"), false);
  assert.equal(validateCanonicalExecutiveSummary(summary).valid, true);
});

test("canonical executive summary falls back safely when no signals exist", () => {
  const summary = deriveCanonicalExecutiveSummary({ signals: [] });

  assert.equal(summary.headline, "Executive focus is steady");
  assert.equal(summary.sourceSignalIds.length, 0);
  assert.equal(validateCanonicalExecutiveSummary(summary).valid, true);
});

test("harmonization diagnostics are aligned and signature-stable", () => {
  const summary = deriveCanonicalExecutiveSummary({ signals: [] });
  const first = buildIntelligenceHarmonizationDiagnostics({ summary });
  const second = buildIntelligenceHarmonizationDiagnostics({ summary });

  assert.equal(first.semanticAlignmentStatus, "aligned");
  assert.equal(first.narrativeConsistency, "aligned");
  assert.equal(first.panelIdentityClarity, "aligned");
  assert.equal(first.signature, second.signature);
});
