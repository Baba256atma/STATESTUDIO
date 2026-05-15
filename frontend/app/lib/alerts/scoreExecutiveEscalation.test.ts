import test from "node:test";
import assert from "node:assert/strict";

import {
  alertLevelFromEscalation,
  alertStateFromInputs,
  scoreExecutiveEscalation,
} from "./scoreExecutiveEscalation.ts";

test("executive escalation scoring is stable and clamped", () => {
  const score = scoreExecutiveEscalation({
    compressedInsight: {
      id: "compressed_supplier",
      title: "Supplier dependency is the dominant executive pressure",
      summary: "Supplier pressure.",
      supportingInsightIds: ["insight_supplier"],
      relatedObjectIds: ["supplier", "inventory"],
      priority: "critical",
      confidenceLevel: "high",
      executiveFocus: "Supplier dependency",
      createdAt: 0,
    },
    monitoring: {
      id: "monitor_supplier",
      title: "Supplier pressure",
      summary: "Supplier pressure remains critical.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "critical",
      trend: "degrading",
      confidence: 0.82,
      urgencyScore: 0.88,
      createdAt: 0,
    },
    confidence: {
      id: "confidence_supplier",
      confidenceLevel: "high",
      confidenceScore: 0.84,
      rationale: "Supported.",
      createdAt: 0,
    },
  });

  assert.equal(score, scoreExecutiveEscalation({
    compressedInsight: {
      id: "compressed_supplier",
      title: "Supplier dependency is the dominant executive pressure",
      summary: "Supplier pressure.",
      supportingInsightIds: ["insight_supplier"],
      relatedObjectIds: ["supplier", "inventory"],
      priority: "critical",
      confidenceLevel: "high",
      executiveFocus: "Supplier dependency",
      createdAt: 0,
    },
    monitoring: {
      id: "monitor_supplier",
      title: "Supplier pressure",
      summary: "Supplier pressure remains critical.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "critical",
      trend: "degrading",
      confidence: 0.82,
      urgencyScore: 0.88,
      createdAt: 0,
    },
    confidence: {
      id: "confidence_supplier",
      confidenceLevel: "high",
      confidenceScore: 0.84,
      rationale: "Supported.",
      createdAt: 0,
    },
  }));
  assert.ok(score >= 0);
  assert.ok(score <= 1);
  assert.equal(alertLevelFromEscalation(score), "critical");
});

test("alert level and state mappings stay calm", () => {
  assert.equal(alertLevelFromEscalation(0.2), "info");
  assert.equal(alertLevelFromEscalation(0.5), "attention");
  assert.equal(alertLevelFromEscalation(0.7), "urgent");
  assert.equal(alertStateFromInputs({ level: "info", timeline: { id: "t", title: "t", summary: "s", relatedObjectIds: [], trend: "stable", momentumScore: 0.1, confidence: 0.7, createdAt: 0 } }), "resolved");
  assert.equal(alertStateFromInputs({ level: "attention" }), "new");
});
