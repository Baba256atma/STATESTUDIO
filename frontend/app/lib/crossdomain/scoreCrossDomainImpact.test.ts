import test from "node:test";
import assert from "node:assert/strict";

import {
  crossDomainSeverityFromScore,
  scoreCrossDomainImpact,
} from "./scoreCrossDomainImpact.ts";

test("cross-domain impact scoring is stable and clamped", () => {
  const score = scoreCrossDomainImpact({
    relatedObjectCount: 4,
    compressedInsights: [{
      id: "compressed_supplier",
      title: "Supplier dependency",
      summary: "Supplier pressure.",
      supportingInsightIds: ["insight_supplier"],
      relatedObjectIds: ["supplier", "inventory"],
      priority: "critical",
      confidenceLevel: "high",
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier pressure",
      summary: "Supplier pressure.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "critical",
      confidence: 0.82,
      urgencyScore: 0.9,
      createdAt: 0,
    }],
    alerts: [{
      id: "alert_supplier",
      title: "Supplier pressure requires executive attention",
      summary: "Supplier pressure is elevated.",
      level: "urgent",
      relatedObjectIds: ["supplier"],
      rationale: "Escalation is based on supplier pressure.",
      confidence: 0.84,
      createdAt: 0,
    }],
    ruleConfidence: 0.78,
  });

  assert.equal(score, scoreCrossDomainImpact({
    relatedObjectCount: 4,
    compressedInsights: [{
      id: "compressed_supplier",
      title: "Supplier dependency",
      summary: "Supplier pressure.",
      supportingInsightIds: ["insight_supplier"],
      relatedObjectIds: ["supplier", "inventory"],
      priority: "critical",
      confidenceLevel: "high",
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier pressure",
      summary: "Supplier pressure.",
      relatedObjectIds: ["supplier"],
      monitoringStatus: "critical",
      confidence: 0.82,
      urgencyScore: 0.9,
      createdAt: 0,
    }],
    alerts: [{
      id: "alert_supplier",
      title: "Supplier pressure requires executive attention",
      summary: "Supplier pressure is elevated.",
      level: "urgent",
      relatedObjectIds: ["supplier"],
      rationale: "Escalation is based on supplier pressure.",
      confidence: 0.84,
      createdAt: 0,
    }],
    ruleConfidence: 0.78,
  }));
  assert.ok(score >= 0);
  assert.ok(score <= 1);
  assert.equal(crossDomainSeverityFromScore(score), "high");
});

test("cross-domain severity maps impact bands", () => {
  assert.equal(crossDomainSeverityFromScore(0.2), "low");
  assert.equal(crossDomainSeverityFromScore(0.5), "medium");
  assert.equal(crossDomainSeverityFromScore(0.7), "high");
  assert.equal(crossDomainSeverityFromScore(0.9), "critical");
});
