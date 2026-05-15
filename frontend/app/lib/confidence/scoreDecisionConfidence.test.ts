import test from "node:test";
import assert from "node:assert/strict";

import { scoreDecisionConfidence } from "./scoreDecisionConfidence.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";

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

test("decision confidence scoring is stable and clamped", () => {
  const score = scoreDecisionConfidence({
    recommendation,
    timelineIntelligence: [{
      id: "timeline",
      title: "Stable Timeline",
      summary: "Stabilizing pressure.",
      relatedObjectIds: ["supplier"],
      trend: "stable",
      momentumScore: 0.22,
      confidence: 0.82,
      createdAt: 0,
    }],
    strategicMemory: [{
      id: "memory",
      category: "dependency",
      title: "Supplier recurrence",
      summary: "Recurring evidence.",
      relatedObjectIds: ["supplier"],
      severity: "medium",
      confidence: 0.78,
      recurrenceCount: 3,
      firstObservedAt: 0,
      lastObservedAt: 3,
    }],
  });

  assert.equal(score, scoreDecisionConfidence({
    recommendation,
    timelineIntelligence: [{
      id: "timeline",
      title: "Stable Timeline",
      summary: "Stabilizing pressure.",
      relatedObjectIds: ["supplier"],
      trend: "stable",
      momentumScore: 0.22,
      confidence: 0.82,
      createdAt: 0,
    }],
    strategicMemory: [{
      id: "memory",
      category: "dependency",
      title: "Supplier recurrence",
      summary: "Recurring evidence.",
      relatedObjectIds: ["supplier"],
      severity: "medium",
      confidence: 0.78,
      recurrenceCount: 3,
      firstObservedAt: 0,
      lastObservedAt: 3,
    }],
  }));
  assert.ok(score >= 0);
  assert.ok(score <= 1);
  assert.ok(score > 0.65);
});

test("uncertainty reduces confidence without creating false certainty", () => {
  const clean = scoreDecisionConfidence({ recommendation });
  const uncertain = scoreDecisionConfidence({
    recommendation,
    uncertaintyFactors: [
      "Timeline behavior remains volatile.",
      "Scenario comparison results remain close.",
    ],
  });
  assert.ok(uncertain < clean);
});
