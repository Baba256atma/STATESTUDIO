import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDecisionConfidenceOverlayState,
  deriveDecisionConfidence,
} from "./deriveDecisionConfidence.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";

const recommendation: DecisionRecommendation = {
  id: "rec_supplier",
  title: "Reduce Supplier Dependency",
  summary: "Reduce supplier dependency concentration.",
  category: "diversify",
  rationale: "Supplier dependency is the main pressure.",
  recommendedFocus: "Reduce supplier dependency",
  affectedObjectIds: ["supplier", "inventory"],
  confidence: 0.86,
  priority: "high",
  domainId: "supply_chain",
  createdAt: 0,
};

const monitoring: ExecutiveMonitoringSignal = {
  id: "monitor_supplier",
  title: "Supplier pressure remains elevated",
  summary: "Supplier pressure remains monitored.",
  relatedObjectIds: ["supplier"],
  monitoringStatus: "watch",
  trend: "stable",
  confidence: 0.76,
  urgencyScore: 0.42,
  recommendedAttention: "Maintain supplier visibility.",
  domainId: "supply_chain",
  createdAt: 0,
};

test("decision confidence derives recommendation confidence with supporting signals", () => {
  const confidence = deriveDecisionConfidence({
    domainId: "supply_chain",
    recommendations: [recommendation],
    monitoringSignals: [monitoring],
    timelineIntelligence: [{
      id: "timeline",
      title: "Stable Timeline",
      summary: "Timeline is stable.",
      relatedObjectIds: ["supplier"],
      trend: "stable",
      momentumScore: 0.2,
      confidence: 0.82,
      createdAt: 0,
    }],
    strategicMemory: [{
      id: "memory",
      category: "dependency",
      title: "Supplier recurrence",
      summary: "Recurring supplier evidence.",
      relatedObjectIds: ["supplier"],
      severity: "medium",
      confidence: 0.78,
      recurrenceCount: 3,
      firstObservedAt: 0,
      lastObservedAt: 3,
    }],
  });

  assert.equal(confidence.length, 1);
  assert.equal(confidence[0].relatedRecommendationId, "rec_supplier");
  assert.ok(["high", "very_high"].includes(confidence[0].confidenceLevel));
  assert.ok(confidence[0].supportingSignals?.length);
  assert.ok(confidence[0].rationale.includes("Confidence"));
});

test("decision confidence exposes ambiguity when signals are volatile", () => {
  const confidence = deriveDecisionConfidence({
    recommendations: [recommendation],
    timelineIntelligence: [{
      id: "timeline",
      title: "Volatile Timeline",
      summary: "Timeline is volatile.",
      relatedObjectIds: ["supplier"],
      trend: "volatile",
      momentumScore: 0.72,
      confidence: 0.58,
      createdAt: 0,
    }],
    scenarioComparisons: [{
      id: "comparison",
      scenarioAId: "a",
      scenarioBId: "b",
      comparisonTitle: "A vs B",
      executiveSummary: "Options are close.",
      stabilityDelta: 1,
      fragilityDelta: -1,
      propagationDelta: 2,
      confidenceDelta: 2,
      tradeoffs: [],
      createdAt: 0,
    }],
  });

  assert.ok(confidence[0].uncertaintyFactors?.includes("Timeline behavior remains volatile."));
  assert.ok(confidence[0].uncertaintyFactors?.includes("Scenario comparison results remain close."));
});

test("decision confidence is deterministic and does not mutate input", () => {
  const input = {
    recommendations: [recommendation],
    monitoringSignals: [monitoring],
  };
  const before = JSON.stringify(input);
  const first = deriveDecisionConfidence(input);
  const second = deriveDecisionConfidence(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("decision confidence overlay is passive metadata and empty state is safe", () => {
  const confidence = deriveDecisionConfidence({ recommendations: [recommendation], monitoringSignals: [monitoring] });
  const overlay = buildDecisionConfidenceOverlayState({ confidence });

  assert.equal(overlay.confidenceLevel, confidence[0].confidenceLevel);
  assert.ok(overlay.executiveSummary.length > 0);

  const empty = buildDecisionConfidenceOverlayState({ confidence: [] });
  assert.equal(empty.confidenceLevel, "low");
  assert.equal(empty.confidenceScore, 0);
  assert.equal(empty.executiveSummary, "No decision confidence signal is available yet.");
});

test("decision confidence remains quiet with no evidence", () => {
  assert.deepEqual(deriveDecisionConfidence({}), []);
});
