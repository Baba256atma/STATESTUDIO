import test from "node:test";
import assert from "node:assert/strict";

import { deriveExecutiveFocusGuidance } from "./deriveExecutiveFocusGuidance.ts";

test("executive focus guidance compresses competing signals into one focus", () => {
  const focus = deriveExecutiveFocusGuidance({
    alerts: [{
      id: "alert_supplier",
      title: "Supplier escalation",
      summary: "Supplier pressure escalated.",
      level: "urgent",
      relatedObjectIds: ["supplier"],
      rationale: "Propagation expanded.",
      recommendedAttention: "Review supplier dependency concentration",
      confidence: 0.82,
      createdAt: 0,
    }],
    compressedInsights: [{
      id: "compressed_supplier",
      title: "Supplier dependency",
      summary: "Supplier pressure remains dominant.",
      supportingInsightIds: ["insight_supplier"],
      relatedObjectIds: ["supplier"],
      priority: "critical",
      executiveFocus: "Supplier dependency",
      createdAt: 0,
    }],
  });

  assert.equal(focus, "Review supplier dependency concentration");
});

test("executive focus guidance has a safe fallback", () => {
  assert.equal(
    deriveExecutiveFocusGuidance({}),
    "Maintain executive awareness of current strategic signals.",
  );
});
