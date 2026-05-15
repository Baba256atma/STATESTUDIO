import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveMonitoringOverlayState,
  deriveExecutiveMonitoringSignals,
} from "./deriveExecutiveMonitoring.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";

const timeline: TimelineIntelligence = {
  id: "timeline_supplier_pressure",
  title: "Supplier Pressure",
  summary: "Supplier dependency pressure is degrading.",
  relatedObjectIds: ["supplier", "inventory"],
  trend: "degrading",
  momentumScore: 0.84,
  confidence: 0.86,
  executiveImpact: "Supplier dependency pressure is expanding.",
  recommendedAttention: "Supplier dependency pressure",
  domainId: "supply_chain",
  createdAt: 0,
};

const memory: StrategicMemoryRecord = {
  id: "memory_supplier_dependency",
  category: "dependency",
  title: "Supplier dependency recurrence",
  summary: "Supplier fragility has remained a recurring operational pressure point.",
  relatedObjectIds: ["supplier", "inventory"],
  severity: "high",
  confidence: 0.82,
  recurrenceCount: 3,
  lastObservedAt: 3,
  firstObservedAt: 0,
  domainId: "supply_chain",
};

const recommendation: DecisionRecommendation = {
  id: "rec_supplier_diversify",
  title: "Reduce Supplier Dependency",
  summary: "Reduce dependency concentration.",
  category: "diversify",
  rationale: "Supplier dependency concentration remains elevated.",
  recommendedFocus: "Supplier dependency pressure",
  affectedObjectIds: ["supplier", "inventory"],
  confidence: 0.87,
  priority: "critical",
  domainId: "supply_chain",
  createdAt: 0,
};

test("monitoring signals derive from timeline memory recommendations and propagation", () => {
  const signals = deriveExecutiveMonitoringSignals({
    domainId: "supply_chain",
    timelineIntelligence: [timeline],
    strategicMemory: [memory],
    recommendations: [recommendation],
    propagationHints: [
      { sourceObjectId: "supplier", targetObjectId: "inventory", propagationStrength: 0.84, propagationType: "dependency" },
      { sourceObjectId: "inventory", targetObjectId: "delivery", propagationStrength: 0.72, propagationType: "delay" },
    ],
    fragilityScores: [{ objectId: "supplier", score: 86, level: "critical" }],
  });

  assert.ok(signals.length >= 1);
  assert.equal(signals[0].monitoringStatus, "critical");
  assert.equal(signals[0].trend, "degrading");
  assert.ok(signals[0].summary.includes("executive"));
  assert.ok(signals[0].relatedObjectIds.includes("supplier"));
  assert.ok(signals.every((signal) => signal.urgencyScore >= 0 && signal.urgencyScore <= 1));
});

test("monitoring derivation is deterministic and does not mutate input", () => {
  const input = {
    domainId: "supply_chain",
    timelineIntelligence: [timeline],
    strategicMemory: [memory],
    recommendations: [recommendation],
    propagationHints: [
      { sourceObjectId: "supplier", targetObjectId: "inventory", propagationStrength: 0.84, propagationType: "dependency" as const },
    ],
  };
  const before = JSON.stringify(input);
  const first = deriveExecutiveMonitoringSignals(input);
  const second = deriveExecutiveMonitoringSignals(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("monitoring overlay is passive metadata and empty state is safe", () => {
  const signals = deriveExecutiveMonitoringSignals({
    timelineIntelligence: [timeline],
    strategicMemory: [memory],
  });
  const overlay = buildExecutiveMonitoringOverlayState({ signals });

  assert.equal(overlay.monitoringStatus, signals[0].monitoringStatus);
  assert.ok(overlay.relatedObjectIds.includes("supplier"));
  assert.ok(overlay.executiveSummary.length > 0);

  const empty = buildExecutiveMonitoringOverlayState({ signals: [] });
  assert.equal(empty.monitoringStatus, "stable");
  assert.equal(empty.lifecycle, "resolved");
  assert.equal(empty.urgencyScore, 0);
});

test("monitoring remains quiet when no source intelligence exists", () => {
  assert.deepEqual(deriveExecutiveMonitoringSignals({}), []);
});
