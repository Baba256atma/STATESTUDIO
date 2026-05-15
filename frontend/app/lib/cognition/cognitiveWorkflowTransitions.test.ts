import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCognitiveWorkflowEvidence,
  deriveCandidateCognitiveStage,
  stabilizeCognitiveStage,
} from "./cognitiveWorkflowTransitions.ts";

test("critical alerts move cognition into risk interpretation", () => {
  const evidence = buildCognitiveWorkflowEvidence({
    alerts: [{
      id: "alert_supplier",
      title: "Supplier escalation",
      summary: "Supplier pressure escalated.",
      level: "critical",
      relatedObjectIds: ["supplier"],
      rationale: "Propagation expanded.",
      confidence: 0.88,
      createdAt: 0,
    }],
  });

  assert.equal(evidence.alertLevel, "critical");
  assert.equal(deriveCandidateCognitiveStage(evidence), "risk_interpretation");
});

test("candidate stages reflect comparison, decision, confidence, and monitoring contexts", () => {
  assert.equal(deriveCandidateCognitiveStage(buildCognitiveWorkflowEvidence({
    comparisons: [{
      id: "compare_supplier",
      scenarioAId: "a",
      scenarioBId: "b",
      comparisonTitle: "Supplier Comparison",
      executiveSummary: "Compare supplier paths.",
      stabilityDelta: 12,
      fragilityDelta: -18,
      propagationDelta: -10,
      confidenceDelta: 8,
      tradeoffs: [],
      createdAt: 0,
    }],
  })), "comparison");

  assert.equal(deriveCandidateCognitiveStage(buildCognitiveWorkflowEvidence({
    recommendations: [{
      id: "rec_supplier",
      title: "Reduce Supplier Dependency",
      summary: "Reduce supplier dependency.",
      category: "diversify",
      rationale: "Supplier pressure is elevated.",
      affectedObjectIds: ["supplier"],
      confidence: 0.8,
      priority: "high",
      createdAt: 0,
    }],
    decisionGraph: {
      id: "graph",
      nodes: [
        { id: "risk", type: "risk", title: "Risk", createdAt: 0 },
        { id: "scenario", type: "scenario", title: "Scenario", createdAt: 0 },
        { id: "rec", type: "recommendation", title: "Recommendation", createdAt: 0 },
      ],
      edges: [
        { id: "e1", sourceNodeId: "risk", targetNodeId: "scenario" },
        { id: "e2", sourceNodeId: "scenario", targetNodeId: "rec" },
      ],
      createdAt: 0,
    },
  })), "decision_focus");

  assert.equal(deriveCandidateCognitiveStage(buildCognitiveWorkflowEvidence({
    recommendations: [{
      id: "rec_supplier",
      title: "Reduce Supplier Dependency",
      summary: "Reduce supplier dependency.",
      category: "diversify",
      rationale: "Supplier pressure is elevated.",
      affectedObjectIds: ["supplier"],
      confidence: 0.8,
      priority: "high",
      createdAt: 0,
    }],
    confidenceSignals: [{
      id: "confidence_supplier",
      relatedRecommendationId: "rec_supplier",
      confidenceLevel: "low",
      confidenceScore: 0.34,
      rationale: "Signals are mixed.",
      createdAt: 0,
    }],
  })), "confidence_review");
});

test("stage stabilization prevents minor workflow flicker but preserves critical escalation", () => {
  const previousWorkflow = {
    id: "workflow",
    currentStage: "strategic_framing" as const,
    stageHeadline: "Strategic Framing",
    updatedAt: 0,
  };

  assert.equal(stabilizeCognitiveStage({
    previousWorkflow,
    candidateStage: "comparison",
    evidence: {
      alertLevel: "none",
      compressedInsightCount: 2,
      comparisonCount: 1,
      recommendationCount: 0,
      lowConfidenceCount: 0,
      monitoringActive: false,
      graphHasPath: false,
    },
  }), "strategic_framing");

  assert.equal(stabilizeCognitiveStage({
    previousWorkflow,
    candidateStage: "awareness",
    evidence: {
      alertLevel: "critical",
      compressedInsightCount: 0,
      comparisonCount: 0,
      recommendationCount: 0,
      lowConfidenceCount: 0,
      monitoringActive: false,
      graphHasPath: false,
    },
  }), "risk_interpretation");
});
