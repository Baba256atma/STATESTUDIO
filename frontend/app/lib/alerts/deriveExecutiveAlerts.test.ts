import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveAlertOverlayState,
  deriveExecutiveAlerts,
} from "./deriveExecutiveAlerts.ts";

const compressedInsight = {
  id: "compressed_supplier",
  title: "Supplier dependency is the dominant executive pressure",
  summary: "Supplier dependency is concentrating executive risk.",
  supportingInsightIds: ["insight_supplier", "monitor_supplier"],
  supportingScenarioIds: ["scenario_supplier"],
  relatedObjectIds: ["supplier", "inventory"],
  priority: "critical" as const,
  confidenceLevel: "high" as const,
  executiveFocus: "Supplier dependency",
  domainId: "supply_chain",
  createdAt: 0,
};

const monitoringSignal = {
  id: "monitor_supplier",
  title: "Supplier pressure",
  summary: "Supplier pressure remains critical.",
  relatedObjectIds: ["supplier", "inventory"],
  monitoringStatus: "critical" as const,
  trend: "degrading" as const,
  confidence: 0.82,
  urgencyScore: 0.88,
  recommendedAttention: "Supplier dependency",
  domainId: "supply_chain",
  createdAt: 0,
};

test("executive alerts derive meaningful escalation from compressed intelligence", () => {
  const alerts = deriveExecutiveAlerts({
    domainId: "supply_chain",
    compressedInsights: [compressedInsight],
    monitoringSignals: [monitoringSignal],
    confidenceSignals: [{
      id: "confidence_supplier",
      confidenceLevel: "high",
      confidenceScore: 0.84,
      rationale: "Confidence remains high.",
      createdAt: 0,
    }],
  });

  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].level, "critical");
  assert.ok(alerts[0].summary.includes("executive"));
  assert.ok(alerts[0].relatedObjectIds.includes("supplier"));
  assert.ok(alerts[0].relatedInsightIds?.includes("insight_supplier"));
  assert.ok(alerts[0].relatedScenarioIds?.includes("scenario_supplier"));
});

test("executive alerts suppress stable low-noise conditions", () => {
  const alerts = deriveExecutiveAlerts({
    monitoringSignals: [{
      ...monitoringSignal,
      monitoringStatus: "stable",
      trend: "improving",
      urgencyScore: 0.08,
      confidence: 0.4,
    }],
  });

  assert.deepEqual(alerts, []);
});

test("executive alert derivation is deterministic and does not mutate input", () => {
  const input = {
    compressedInsights: [compressedInsight],
    monitoringSignals: [monitoringSignal],
  };
  const before = JSON.stringify(input);
  const first = deriveExecutiveAlerts(input);
  const second = deriveExecutiveAlerts(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("executive alert overlay is passive metadata and empty state is safe", () => {
  const alerts = deriveExecutiveAlerts({
    compressedInsights: [compressedInsight],
    monitoringSignals: [monitoringSignal],
  });
  const overlay = buildExecutiveAlertOverlayState({ alerts });

  assert.equal(overlay.topAlertId, alerts[0].id);
  assert.equal(overlay.level, "critical");
  assert.ok(overlay.relatedObjectIds.includes("supplier"));

  const empty = buildExecutiveAlertOverlayState({ alerts: [] });
  assert.equal(empty.level, "info");
  assert.equal(empty.state, "resolved");
  assert.equal(empty.activeAlertCount, 0);
});
