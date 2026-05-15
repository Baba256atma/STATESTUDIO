import test from "node:test";
import assert from "node:assert/strict";
import type { DecisionEvidence, DecisionRiskAssessment } from "../decisionIntelligenceContracts.ts";
import type { DecisionConfidence } from "../decisionIntelligenceContracts.ts";
import {
  calculateDecisionScore,
  calculateEvidenceStrength,
  calculateRiskPressure,
  getDecisionScoreLabel,
  normalizeDecisionScore,
} from "../decisionScoring.ts";

function conf(score01: number): DecisionConfidence {
  return { score01, label: "medium" };
}

test("normalizeDecisionScore clamps above 1 and below 0", () => {
  assert.equal(normalizeDecisionScore(9), 1);
  assert.equal(normalizeDecisionScore(-1), 0);
});

test("NaN becomes safe fallback", () => {
  assert.equal(normalizeDecisionScore(Number.NaN), 0);
});

test("empty evidence gives low evidence strength", () => {
  assert.ok(calculateEvidenceStrength([]) < 0.15);
  assert.ok(calculateEvidenceStrength(undefined) < 0.15);
});

test("high risk + high urgency increases score vs calm baseline", () => {
  const calm = calculateDecisionScore({
    confidence: conf(0.5),
    evidence: [],
    priority: "p3",
    actions: [{ id: "a1", kind: "defer", label: "x", description: "d", reversible: true, requiresConfirmation: false }],
  });
  const risks: readonly DecisionRiskAssessment[] = [
    { id: "r1", severityLabel: "critical", likelihood01: 0.9, impact01: 0.95, linkedSignalIds: [] },
  ];
  const hot = calculateDecisionScore({
    confidence: conf(0.85),
    evidence: [{ id: "e1", title: "t", summary: "s", sourceRef: { kind: "system", subsystem: "x" }, strength01: 0.9, linkedSignalIds: [] }],
    risks,
    priority: "p0",
    actions: [
      { id: "a1", kind: "escalate", label: "x", description: "d", reversible: false, requiresConfirmation: true },
    ],
  });
  assert.ok(hot.score >= calm.score);
});

test("high uncertainty lowers score vs low uncertainty", () => {
  const lowU = calculateDecisionScore({
    confidence: conf(0.7),
    evidence: [],
    priority: "p2",
    projectedOutcomes: [
      { id: "o1", horizonLabel: "h", expectedDelta01: 0.2, uncertainty01: 0.05, narrative: "n" },
    ],
  });
  const highU = calculateDecisionScore({
    confidence: conf(0.7),
    evidence: [],
    priority: "p2",
    projectedOutcomes: [
      { id: "o1", horizonLabel: "h", expectedDelta01: 0.2, uncertainty01: 0.95, narrative: "n" },
    ],
  });
  assert.ok(highU.score < lowU.score);
});

test("labels map correctly", () => {
  assert.equal(getDecisionScoreLabel(0), "weak");
  assert.equal(getDecisionScoreLabel(0.19), "weak");
  assert.equal(getDecisionScoreLabel(0.2), "watch");
  assert.equal(getDecisionScoreLabel(0.5), "actionable");
  assert.equal(getDecisionScoreLabel(0.7), "strong");
  assert.equal(getDecisionScoreLabel(0.9), "critical");
});

test("inputs are not mutated", () => {
  const evidence: DecisionEvidence[] = [
    { id: "e1", title: "t", summary: "s", sourceRef: { kind: "system", subsystem: "sub" }, strength01: 0.5, linkedSignalIds: ["s1"] },
  ];
  const frozen = JSON.stringify(evidence);
  calculateEvidenceStrength(evidence);
  calculateDecisionScore({
    confidence: conf(0.6),
    evidence,
    priority: "p1",
  });
  assert.equal(JSON.stringify(evidence), frozen);
});

test("calculateRiskPressure uses risks and outcomes", () => {
  const r = calculateRiskPressure(
    [{ id: "r1", severityLabel: "high", likelihood01: 0.8, impact01: 0.7, linkedSignalIds: [] }],
    [{ id: "o1", horizonLabel: "q", expectedDelta01: -0.4, uncertainty01: 0.2, narrative: "n" }]
  );
  assert.ok(r > 0.2);
});
