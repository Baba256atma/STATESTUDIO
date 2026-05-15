import test from "node:test";
import assert from "node:assert/strict";
import type { DecisionEvidence, DecisionSignal } from "../decisionIntelligenceContracts.ts";
import {
  calculateEvidenceConflictScore,
  calculateEvidenceFreshness,
  calculateEvidenceReliability,
  evaluateDecisionEvidence,
} from "../decisionEvidenceEvaluator.ts";

const REF = 1_720_000_000_000; // fixed reference epoch ms

function ev(p: Partial<DecisionEvidence> & Pick<DecisionEvidence, "id" | "strength01">): DecisionEvidence {
  return {
    title: "t",
    summary: "s",
    sourceRef: { kind: "system", subsystem: "test" },
    linkedSignalIds: [],
    ...p,
  };
}

test("empty evidence arrays", () => {
  const r = evaluateDecisionEvidence({ evidence: [], referenceTimeMs: REF });
  assert.equal(r.evidenceCount, 0);
  assert.equal(r.summaryLabel, "insufficient");
  assert.equal(r.overallQuality, 0);
  assert.equal(r.weakEvidence, true);
  assert.equal(r.sparseEvidence, true);
});

test("high reliability evidence", () => {
  const evidence: readonly DecisionEvidence[] = [
    ev({
      id: "e1",
      strength01: 0.92,
      sourceRef: { kind: "scenario", scenarioId: "sc-1" },
      sourceTrust01: 0.95,
      recordedAt: new Date(REF - 1000 * 60 * 60).toISOString(),
    }),
    ev({
      id: "e2",
      strength01: 0.88,
      sourceRef: { kind: "manual", actorId: "exec-1" },
      recordedAt: new Date(REF - 2000).toISOString(),
    }),
  ];
  const r = evaluateDecisionEvidence({ evidence, referenceTimeMs: REF });
  assert.ok(r.reliability > 0.55);
  assert.ok(r.overallQuality > 0.45);
  assert.equal(r.sparseEvidence, false);
});

test("stale evidence lowers freshness", () => {
  const old = new Date(REF - 1000 * 60 * 60 * 24 * 40).toISOString();
  const fresh = evaluateDecisionEvidence({
    evidence: [ev({ id: "a", strength01: 0.8, recordedAt: new Date(REF - 1000).toISOString() })],
    referenceTimeMs: REF,
  });
  const stale = evaluateDecisionEvidence({
    evidence: [ev({ id: "a", strength01: 0.8, recordedAt: old })],
    referenceTimeMs: REF,
    maxEvidenceAgeMs: 1000 * 60 * 60 * 24 * 14,
  });
  assert.ok(stale.freshness < fresh.freshness);
});

test("conflicting linked signal values raise conflict score", () => {
  const evidence: readonly DecisionEvidence[] = [
    ev({ id: "e1", strength01: 0.7, linkedSignalIds: ["s1"] }),
    ev({ id: "e2", strength01: 0.75, linkedSignalIds: ["s1"] }),
  ];
  const signals: readonly DecisionSignal[] = [
    {
      id: "s1",
      kind: "metric",
      label: "m",
      value: 0.1,
      detectedAt: "2020-01-01T00:00:00.000Z",
      sourceRef: { kind: "system", subsystem: "x" },
    },
    {
      id: "s1",
      kind: "metric",
      label: "m2",
      value: 0.95,
      detectedAt: "2020-01-01T00:00:01.000Z",
      sourceRef: { kind: "system", subsystem: "x" },
    },
  ];
  const c = calculateEvidenceConflictScore(evidence, signals);
  assert.ok(c > 0.2);
  const r = evaluateDecisionEvidence({ evidence, signals, referenceTimeMs: REF });
  assert.equal(r.conflictingEvidence, true);
});

test("sparse evidence detected", () => {
  const r = evaluateDecisionEvidence({
    evidence: [ev({ id: "only", strength01: 0.9 })],
    referenceTimeMs: REF,
  });
  assert.equal(r.sparseEvidence, true);
});

test("duplicate evidence ids deduped for count", () => {
  const r = evaluateDecisionEvidence({
    evidence: [
      ev({ id: "dup", strength01: 0.5 }),
      ev({ id: "dup", strength01: 0.9 }),
    ],
    referenceTimeMs: REF,
  });
  assert.equal(r.evidenceCount, 1);
});

test("undefined timestamps handled", () => {
  const r = evaluateDecisionEvidence({
    evidence: [ev({ id: "x", strength01: 0.6 })],
    referenceTimeMs: REF,
  });
  assert.ok(Number.isFinite(r.freshness));
  assert.ok(r.freshness > 0 && r.freshness <= 1);
});

test("NaN safety on strength and trust", () => {
  const r = evaluateDecisionEvidence({
    evidence: [ev({ id: "n", strength01: Number.NaN as unknown as number, sourceTrust01: Number.NaN as unknown as number })],
    referenceTimeMs: REF,
  });
  assert.ok(Number.isFinite(r.overallQuality));
  assert.ok(r.overallQuality >= 0 && r.overallQuality <= 1);
});

test("deterministic outputs for same inputs", () => {
  const input = {
    evidence: [ev({ id: "e1", strength01: 0.55 }), ev({ id: "e2", strength01: 0.6 })],
    referenceTimeMs: REF,
  } as const;
  const a = evaluateDecisionEvidence(input);
  const b = evaluateDecisionEvidence(input);
  assert.deepEqual(a, b);
});

test("immutable inputs", () => {
  const evidence: DecisionEvidence[] = [
    ev({ id: "e1", strength01: 0.4, linkedSignalIds: ["s1"] }),
  ];
  const signals: DecisionSignal[] = [
    {
      id: "s1",
      kind: "metric",
      label: "L",
      value: 2,
      detectedAt: "2020-01-01T00:00:00.000Z",
      sourceRef: { kind: "system", subsystem: "x" },
    },
  ];
  const fe = JSON.stringify(evidence);
  const fs = JSON.stringify(signals);
  evaluateDecisionEvidence({ evidence, signals, referenceTimeMs: REF });
  calculateEvidenceReliability(evidence, signals);
  calculateEvidenceFreshness(evidence, REF);
  calculateEvidenceConflictScore(evidence, signals);
  assert.equal(JSON.stringify(evidence), fe);
  assert.equal(JSON.stringify(signals), fs);
});

test("contradictory confidence weights on signals", () => {
  const evidence = [ev({ id: "e1", strength01: 0.8, linkedSignalIds: ["s1"] })];
  const signals: DecisionSignal[] = [
    {
      id: "s1",
      kind: "metric",
      label: "L",
      value: 1,
      detectedAt: "2020-01-01T00:00:00.000Z",
      sourceRef: { kind: "system", subsystem: "x" },
      confidenceWeight01: 0.1,
    },
    {
      id: "s1",
      kind: "metric",
      label: "L2",
      value: 1,
      detectedAt: "2020-01-01T00:00:01.000Z",
      sourceRef: { kind: "system", subsystem: "x" },
      confidenceWeight01: 0.95,
    },
  ];
  const r = evaluateDecisionEvidence({ evidence, signals, referenceTimeMs: REF });
  assert.ok(Number.isFinite(r.reliability));
});
