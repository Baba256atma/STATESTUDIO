/**
 * B.22 — adaptive bias heuristics.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraExecutionOutcome } from "../execution/nexoraExecutionOutcome.ts";
import type { NexoraScenarioMemoryEntry } from "../scenario/nexoraScenarioMemory.ts";
import type { NexoraDecisionQualityReport } from "./nexoraDecisionQuality.ts";
import { buildAdaptiveBias } from "./nexoraAdaptiveBias.ts";

function q(partial: Partial<NexoraDecisionQualityReport>): NexoraDecisionQualityReport {
  return {
    score: 0.5,
    qualityTier: "medium",
    trend: "stable",
    successfulRuns: 0,
    failedRuns: 0,
    totalRatedRuns: 3,
    summary: "",
    ...partial,
  };
}

test("enough successful balanced runs → prefer balanced", () => {
  const quality = q({
    qualityTier: "high",
    totalRatedRuns: 5,
    dominantRecommendedOption: "balanced",
    successfulRuns: 4,
    failedRuns: 0,
    score: 0.75,
  });
  const memory: NexoraScenarioMemoryEntry[] = [
    { runId: "a", recommendedOptionId: "balanced", executionOutcomeLabel: "better", timestamp: 1 },
    { runId: "b", recommendedOptionId: "balanced", executionOutcomeLabel: "better", timestamp: 2 },
    { runId: "c", recommendedOptionId: "balanced", executionOutcomeLabel: "same", timestamp: 3 },
  ];
  const r = buildAdaptiveBias({ quality, memory, outcomes: [] });
  assert.equal(r.preferredOptionId, "balanced");
  assert.ok(r.confidence === "high" || r.confidence === "medium");
});

test("weak aggressive history → discourage aggressive", () => {
  const quality = q({
    qualityTier: "medium",
    totalRatedRuns: 4,
    dominantRecommendedOption: "conservative",
    score: 0.55,
  });
  const memory: NexoraScenarioMemoryEntry[] = [
    { runId: "r1", recommendedOptionId: "aggressive", executionOutcomeLabel: "worse", timestamp: 1 },
    { runId: "r2", recommendedOptionId: "aggressive", executionOutcomeLabel: "worse", timestamp: 2 },
  ];
  const outcomes: NexoraExecutionOutcome[] = [];
  const r = buildAdaptiveBias({ quality, memory, outcomes });
  assert.equal(r.discouragedOptionId, "aggressive");
});

test("too little data → low confidence / no strong bias", () => {
  const quality = q({
    qualityTier: "medium",
    totalRatedRuns: 2,
    dominantRecommendedOption: "balanced",
  });
  const r = buildAdaptiveBias({ quality, memory: [], outcomes: [] });
  assert.equal(r.confidence, "low");
  assert.equal(r.preferredOptionId, undefined);
});

test("low quality → no meaningful bias", () => {
  const quality = q({
    qualityTier: "low",
    totalRatedRuns: 5,
    dominantRecommendedOption: "balanced",
  });
  const r = buildAdaptiveBias({ quality, memory: [], outcomes: [] });
  assert.equal(r.confidence, "low");
  assert.equal(r.preferredOptionId, undefined);
});

test("deterministic output", () => {
  const quality = q({
    qualityTier: "medium",
    totalRatedRuns: 4,
    dominantRecommendedOption: "balanced",
  });
  const memory: NexoraScenarioMemoryEntry[] = [
    { runId: "x", recommendedOptionId: "balanced", executionOutcomeLabel: "better", timestamp: 1 },
  ];
  const a = buildAdaptiveBias({ quality, memory, outcomes: [] });
  const b = buildAdaptiveBias({ quality, memory, outcomes: [] });
  assert.deepEqual(a, b);
});
