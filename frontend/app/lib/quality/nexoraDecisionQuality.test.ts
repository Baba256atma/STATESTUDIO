/**
 * B.21 — decision quality evaluator tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraExecutionOutcome } from "../execution/nexoraExecutionOutcome.ts";
import type { NexoraScenarioMemoryEntry } from "../scenario/nexoraScenarioMemory.ts";
import { evaluateDecisionQuality, buildDecisionQualityInputSignature } from "./nexoraDecisionQuality.ts";

function o(
  runId: string,
  label: NexoraExecutionOutcome["outcomeLabel"],
  recordedAt: number,
  score: number
): NexoraExecutionOutcome {
  return {
    runId,
    outcomeLabel: label,
    outcomeScore: score,
    recordedAt,
  };
}

function m(
  runId: string,
  posture: string,
  option: NexoraScenarioMemoryEntry["recommendedOptionId"],
  outcome: NexoraScenarioMemoryEntry["executionOutcomeLabel"],
  ts: number
): NexoraScenarioMemoryEntry {
  return {
    runId,
    decisionPosture: posture,
    recommendedOptionId: option,
    executionOutcomeLabel: outcome,
    executionOutcomeScore: outcome === "better" ? 1 : outcome === "worse" ? -1 : 0,
    timestamp: ts,
  };
}

test("mostly better outcomes → high quality", () => {
  const t0 = 1_700_000_000_000;
  const outcomes = [
    o("a", "better", t0, 1),
    o("b", "better", t0 + 1, 1),
    o("c", "same", t0 + 2, 0),
    o("d", "better", t0 + 3, 1),
  ];
  const r = evaluateDecisionQuality({ outcomes, memory: [] });
  assert.equal(r.qualityTier, "high");
  assert.ok(r.score >= 0.85);
  assert.equal(r.successfulRuns, 3);
  assert.equal(r.failedRuns, 0);
});

test("mostly worse outcomes → low quality", () => {
  const t0 = 1_700_000_000_000;
  const outcomes = [
    o("a", "worse", t0, -1),
    o("b", "worse", t0 + 1, -1),
    o("c", "same", t0 + 2, 0),
    o("d", "worse", t0 + 3, -1),
  ];
  const r = evaluateDecisionQuality({ outcomes, memory: [] });
  assert.equal(r.qualityTier, "low");
  assert.ok(r.score <= 0.2);
  assert.equal(r.failedRuns, 3);
});

test("mixed outcomes → medium quality", () => {
  const t0 = 1_700_000_000_000;
  const outcomes = [
    o("a", "better", t0, 1),
    o("b", "worse", t0 + 1, -1),
    o("c", "same", t0 + 2, 0),
    o("d", "better", t0 + 3, 1),
  ];
  const r = evaluateDecisionQuality({ outcomes, memory: [] });
  assert.equal(r.qualityTier, "medium");
  assert.ok(r.score > 0.34 && r.score < 0.66);
});

test("trend improving (last runs better than earlier in window)", () => {
  const t0 = 1_700_000_000_000;
  const outcomes = [
    o("a", "worse", t0, -1),
    o("b", "same", t0 + 1, 0),
    o("c", "better", t0 + 2, 1),
    o("d", "better", t0 + 3, 1),
  ];
  const r = evaluateDecisionQuality({ outcomes, memory: [] });
  assert.equal(r.trend, "improving");
});

test("trend declining", () => {
  const t0 = 1_700_000_000_000;
  const outcomes = [
    o("a", "better", t0, 1),
    o("b", "better", t0 + 1, 1),
    o("c", "same", t0 + 2, 0),
    o("d", "worse", t0 + 3, -1),
  ];
  const r = evaluateDecisionQuality({ outcomes, memory: [] });
  assert.equal(r.trend, "declining");
});

test("best posture identified from memory + outcomes", () => {
  const t0 = 1_700_000_000_000;
  const outcomes = [
    o("r1", "better", t0, 1),
    o("r2", "same", t0 + 1, 0),
    o("r3", "worse", t0 + 2, -1),
    o("r4", "worse", t0 + 3, -1),
  ];
  const memory: NexoraScenarioMemoryEntry[] = [
    m("r1", "Stabilize supply", "balanced", "better", t0),
    m("r2", "Stabilize supply", "balanced", "same", t0 + 1),
    m("r3", "Cut cost hard", "aggressive", "worse", t0 + 2),
    m("r4", "Cut cost hard", "aggressive", "worse", t0 + 3),
  ];
  const r = evaluateDecisionQuality({ outcomes, memory });
  assert.equal(r.bestPosture, "Stabilize supply");
  assert.equal(r.weakestPosture, "Cut cost hard");
});

test("deterministic output for same inputs", () => {
  const t0 = 1_700_000_000_000;
  const outcomes = [o("x", "same", t0, 0), o("y", "better", t0 + 1, 1)];
  const memory: NexoraScenarioMemoryEntry[] = [m("x", "P", "conservative", "same", t0)];
  const a = evaluateDecisionQuality({ outcomes, memory });
  const b = evaluateDecisionQuality({ outcomes, memory });
  assert.deepEqual(a, b);
  const s1 = buildDecisionQualityInputSignature(outcomes, memory);
  const s2 = buildDecisionQualityInputSignature(outcomes, memory);
  assert.equal(s1, s2);
});
