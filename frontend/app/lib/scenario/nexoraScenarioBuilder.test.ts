/**
 * B.18 — Scenario builder determinism.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraAuditRecord } from "../audit/nexoraAuditContract.ts";
import type { ScenarioMemoryInsights } from "./nexoraScenarioMemory.ts";
import {
  buildScenarioB18Signature,
  buildScenarioVariants,
  fragilityRank,
  pickRecommendedOption,
} from "./nexoraScenarioBuilder.ts";

function baseAudit(frag: string, drivers: string[]): NexoraAuditRecord {
  return {
    runId: "run-x",
    timestamp: 1,
    sources: [],
    merge: { sourceCount: 1, successfulSourceCount: 1, mergedSignalCount: 1 },
    signals: { count: 1, topTypes: [] },
    scanner: { fragilityLevel: frag, drivers },
    trust: { confidenceTier: "medium", summary: "ok" },
  };
}

test("low fragility: variants stay in low/medium band", () => {
  const v = buildScenarioVariants(baseAudit("low", ["a", "b"]), { confidenceTier: "high" });
  assert.ok(v.every((x) => fragilityRank(x.fragilityLevel) <= fragilityRank("medium")));
});

test("high fragility: conservative reduces vs aggressive", () => {
  const v = buildScenarioVariants(baseAudit("high", ["d1"]), { confidenceTier: "medium" });
  const con = v.find((x) => x.id === "conservative")!;
  const agg = v.find((x) => x.id === "aggressive")!;
  assert.ok(fragilityRank(con.fragilityLevel) <= fragilityRank(agg.fragilityLevel));
});

test("trust low: aggressive tier is downgraded (not high)", () => {
  const v = buildScenarioVariants(baseAudit("medium", ["x"]), { confidenceTier: "low" });
  const agg = v.find((x) => x.id === "aggressive")!;
  assert.notEqual(agg.confidenceTier, "high");
});

test("deterministic: same inputs yield identical JSON", () => {
  const a = baseAudit("medium", ["d1", "d2"]);
  const t = { confidenceTier: "medium" as const, summary: "s" };
  const d = { posture: "p", tradeoff: "t", nextMove: "n" };
  assert.equal(JSON.stringify(buildScenarioVariants(a, t, d)), JSON.stringify(buildScenarioVariants(a, t, d)));
});

test("pickRecommendedOption prefers lower fragility when confidence acceptable", () => {
  const variants = [
    { id: "aggressive", label: "A", fragilityLevel: "high", confidenceTier: "medium", summary: "", drivers: [] },
    { id: "conservative", label: "C", fragilityLevel: "low", confidenceTier: "medium", summary: "", drivers: [] },
    { id: "balanced", label: "B", fragilityLevel: "medium", confidenceTier: "medium", summary: "", drivers: [] },
  ];
  assert.equal(pickRecommendedOption(variants), "conservative");
});

test("pickRecommendedOption falls back to balanced when all confidence low", () => {
  const variants = [
    { id: "conservative", label: "C", fragilityLevel: "low", confidenceTier: "low", summary: "", drivers: [] },
    { id: "balanced", label: "B", fragilityLevel: "medium", confidenceTier: "low", summary: "", drivers: [] },
    { id: "aggressive", label: "A", fragilityLevel: "high", confidenceTier: "low", summary: "", drivers: [] },
  ];
  assert.equal(pickRecommendedOption(variants), "balanced");
});

test("buildScenarioB18Signature stable", () => {
  const a = baseAudit("high", []);
  assert.equal(buildScenarioB18Signature(a, "medium"), buildScenarioB18Signature(a, "medium"));
});

test("pickRecommendedOption respects dominant history when not more fragile than baseline", () => {
  const variants = [
    { id: "aggressive", label: "A", fragilityLevel: "high", confidenceTier: "medium", summary: "", drivers: [] },
    { id: "conservative", label: "C", fragilityLevel: "low", confidenceTier: "medium", summary: "", drivers: [] },
    { id: "balanced", label: "B", fragilityLevel: "medium", confidenceTier: "medium", summary: "", drivers: [] },
  ];
  const insights: ScenarioMemoryInsights = {
    similarRuns: 2,
    repeatedDecision: false,
    dominantRecommendedOption: "balanced",
    stabilityTrend: "stable",
    historicalPatternLabel: "mixed",
    optionSeenCounts: { conservative: 0, balanced: 2, aggressive: 0 },
  };
  assert.equal(pickRecommendedOption(variants, insights), "balanced");
});

test("pickRecommendedOption ignores dominant when it is more fragile than baseline", () => {
  const variants = [
    { id: "aggressive", label: "A", fragilityLevel: "high", confidenceTier: "medium", summary: "", drivers: [] },
    { id: "conservative", label: "C", fragilityLevel: "low", confidenceTier: "medium", summary: "", drivers: [] },
    { id: "balanced", label: "B", fragilityLevel: "medium", confidenceTier: "medium", summary: "", drivers: [] },
  ];
  const insights: ScenarioMemoryInsights = {
    similarRuns: 1,
    repeatedDecision: false,
    dominantRecommendedOption: "aggressive",
    stabilityTrend: "stable",
    historicalPatternLabel: "mixed",
    optionSeenCounts: { conservative: 0, balanced: 0, aggressive: 3 },
  };
  assert.equal(pickRecommendedOption(variants, insights), "conservative");
});
