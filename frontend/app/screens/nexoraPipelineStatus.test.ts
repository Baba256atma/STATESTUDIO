/**
 * Phase B.3 — Visible Status Feedback (pipeline HUD helpers).
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { FragilityScanResponse } from "../types/fragilityScanner.ts";
import {
  buildPipelineStatusSignature,
  countMappedObjectsFromFragilityScan,
  createInitialPipelineStatusUi,
  normalizeFragilityLevelForUi,
  shouldSkipPipelineStatusCommit,
  type NexoraPipelineStatusUi,
} from "./nexoraPipelineStatus.ts";

function status(partial: Partial<NexoraPipelineStatusUi>): NexoraPipelineStatusUi {
  return { ...createInitialPipelineStatusUi(), ...partial };
}

test("buildPipelineStatusSignature: identical snapshots produce identical signatures", () => {
  const a = status({
    status: "ready",
    source: "ingestion",
    signalsCount: 3,
    mappedObjectsCount: 2,
    fragilityLevel: "medium",
    summary: "Pressure on supply.",
    updatedAt: 1_700_000_000_000,
    errorMessage: null,
    lastBridgeSource: "dev",
  });
  const b = { ...a };
  assert.equal(buildPipelineStatusSignature(a), buildPipelineStatusSignature(b));
});

test("buildPipelineStatusSignature: changed status changes signature", () => {
  const base = status({
    status: "processing",
    source: "ingestion",
    signalsCount: 2,
    mappedObjectsCount: 0,
    fragilityLevel: null,
    summary: "x",
    updatedAt: 100,
    lastBridgeSource: "ingest",
  });
  const ready = { ...base, status: "ready" as const, mappedObjectsCount: 2, fragilityLevel: "high" as const };
  assert.notEqual(buildPipelineStatusSignature(base), buildPipelineStatusSignature(ready));
});

test("buildPipelineStatusSignature: changed counts / level / summary / error / bridge / updatedAt change signature", () => {
  const s0 = status({
    status: "ready",
    source: "ingestion",
    signalsCount: 1,
    mappedObjectsCount: 1,
    fragilityLevel: "low",
    summary: "a",
    updatedAt: 1,
    errorMessage: null,
    lastBridgeSource: "x",
  });
  assert.notEqual(buildPipelineStatusSignature(s0), buildPipelineStatusSignature({ ...s0, signalsCount: 2 }));
  assert.notEqual(buildPipelineStatusSignature(s0), buildPipelineStatusSignature({ ...s0, mappedObjectsCount: 2 }));
  assert.notEqual(buildPipelineStatusSignature(s0), buildPipelineStatusSignature({ ...s0, fragilityLevel: "critical" }));
  assert.notEqual(buildPipelineStatusSignature(s0), buildPipelineStatusSignature({ ...s0, summary: "b" }));
  assert.notEqual(buildPipelineStatusSignature(s0), buildPipelineStatusSignature({ ...s0, errorMessage: "e" }));
  assert.notEqual(buildPipelineStatusSignature(s0), buildPipelineStatusSignature({ ...s0, lastBridgeSource: "y" }));
  assert.notEqual(buildPipelineStatusSignature(s0), buildPipelineStatusSignature({ ...s0, updatedAt: 2 }));
});

test("buildPipelineStatusSignature: insightLine change changes signature", () => {
  const s0 = status({
    status: "ready",
    source: "ingestion",
    signalsCount: 1,
    mappedObjectsCount: 1,
    fragilityLevel: "medium",
    summary: "a",
    insightLine: "Supply pressure rising",
    updatedAt: 1,
    errorMessage: null,
    lastBridgeSource: "x",
  });
  assert.notEqual(buildPipelineStatusSignature(s0), buildPipelineStatusSignature({ ...s0, insightLine: "Stable baseline" }));
});

test("buildPipelineStatusSignature: B.12 trust fields change signature", () => {
  const base = status({
    status: "ready",
    source: "ingestion",
    signalsCount: 2,
    mappedObjectsCount: 2,
    fragilityLevel: "medium",
    summary: "Pressure",
    updatedAt: 1,
    errorMessage: null,
    lastBridgeSource: "x",
    confidenceTier: "medium",
    confidenceScore: 0.5,
    validationWarnings: [],
    trustSummaryLine: "Moderate confidence — validate key assumptions.",
  });
  const shifted = {
    ...base,
    confidenceTier: "low" as const,
    confidenceScore: 0.35,
    trustSummaryLine: "Limited confidence — gather more evidence.",
  };
  assert.notEqual(buildPipelineStatusSignature(base), buildPipelineStatusSignature(shifted));
});

test("buildPipelineStatusSignature: B.7 decision fields change signature", () => {
  const base = status({
    status: "ready",
    source: "ingestion",
    signalsCount: 2,
    mappedObjectsCount: 2,
    fragilityLevel: "medium",
    summary: "Pressure",
    insightLine: "Supply pressure",
    decisionPosture: null,
    decisionTradeoff: null,
    decisionNextMove: null,
    decisionTone: null,
    updatedAt: 1,
    errorMessage: null,
    lastBridgeSource: "x",
  });
  const withDecision = {
    ...base,
    decisionPosture: "Stabilize supply",
    decisionTradeoff: "Cost may rise",
    decisionNextMove: "Increase buffer",
    decisionTone: "steady" as const,
  };
  assert.notEqual(buildPipelineStatusSignature(base), buildPipelineStatusSignature(withDecision));
});

test("buildPipelineStatusSignature: summary truncated to 120 chars for signature", () => {
  const long = "x".repeat(200);
  const a = status({ summary: long, updatedAt: 1 });
  const b = status({ summary: long.slice(0, 120), updatedAt: 1 });
  assert.equal(buildPipelineStatusSignature(a), buildPipelineStatusSignature(b));
});

test("normalizeFragilityLevelForUi: moderate maps to medium", () => {
  assert.equal(normalizeFragilityLevelForUi("moderate"), "medium");
  assert.equal(normalizeFragilityLevelForUi("MODERATE"), "medium");
});

test("normalizeFragilityLevelForUi: preserves low, medium, high, critical", () => {
  assert.equal(normalizeFragilityLevelForUi("low"), "low");
  assert.equal(normalizeFragilityLevelForUi("medium"), "medium");
  assert.equal(normalizeFragilityLevelForUi("high"), "high");
  assert.equal(normalizeFragilityLevelForUi("critical"), "critical");
});

test("normalizeFragilityLevelForUi: null, empty, and unknown return null", () => {
  assert.equal(normalizeFragilityLevelForUi(null), null);
  assert.equal(normalizeFragilityLevelForUi(undefined), null);
  assert.equal(normalizeFragilityLevelForUi(""), null);
  assert.equal(normalizeFragilityLevelForUi("   "), null);
  assert.equal(normalizeFragilityLevelForUi("nope"), null);
});

test("countMappedObjectsFromFragilityScan: unions primary, affected, highlighted, objects, suggested_objects with uniqueness", () => {
  const result: FragilityScanResponse = {
    ok: true,
    summary: "s",
    fragility_score: 0.5,
    fragility_level: "medium",
    drivers: [],
    suggested_objects: ["delivery", "inventory", "delivery"],
    scene_payload: {
      highlighted_object_ids: ["inventory", "risk_zone"],
      primary_object_ids: ["delivery"],
      affected_object_ids: ["inventory", "buffer"],
      dim_unrelated_objects: true,
      objects: [{ id: "delivery" }, { id: "" }, { id: "buffer" }],
      highlights: [],
      suggested_focus: [],
    },
  };
  assert.equal(countMappedObjectsFromFragilityScan(result), 4);
});

test("countMappedObjectsFromFragilityScan: empty and missing data returns 0", () => {
  const minimal: FragilityScanResponse = {
    ok: true,
    summary: "s",
    fragility_score: 0,
    fragility_level: "low",
    drivers: [],
  };
  assert.equal(countMappedObjectsFromFragilityScan(minimal), 0);
});

test("countMappedObjectsFromFragilityScan: suggested_objects only", () => {
  const result: FragilityScanResponse = {
    ok: true,
    summary: "s",
    fragility_score: 0.1,
    fragility_level: "low",
    drivers: [],
    suggested_objects: ["a", "b"],
  };
  assert.equal(countMappedObjectsFromFragilityScan(result), 2);
});

test("shouldSkipPipelineStatusCommit: never skips when no prior signature", () => {
  const snap = status({ status: "ready", signalsCount: 1, updatedAt: 1, lastBridgeSource: "x" });
  assert.equal(shouldSkipPipelineStatusCommit(snap, null), false);
});

test("shouldSkipPipelineStatusCommit: skips when snapshot matches last committed signature", () => {
  const snap = status({
    status: "ready",
    source: "ingestion",
    signalsCount: 2,
    mappedObjectsCount: 1,
    fragilityLevel: "medium",
    summary: "ok",
    updatedAt: 42,
    lastBridgeSource: "ingest",
  });
  const sig = buildPipelineStatusSignature(snap);
  assert.equal(shouldSkipPipelineStatusCommit(snap, sig), true);
});

test("shouldSkipPipelineStatusCommit: does not skip when snapshot differs from last committed", () => {
  const a = status({ status: "processing", signalsCount: 1, updatedAt: 1, lastBridgeSource: "x" });
  const b = { ...a, status: "ready" as const };
  const sigA = buildPipelineStatusSignature(a);
  assert.equal(shouldSkipPipelineStatusCommit(b, sigA), false);
});

test("B.3 commit simulation: duplicate consecutive snapshots count as one logical apply", () => {
  const snapshots = [
    status({ status: "ready", signalsCount: 3, mappedObjectsCount: 2, updatedAt: 1, lastBridgeSource: "a" }),
    status({ status: "ready", signalsCount: 3, mappedObjectsCount: 2, updatedAt: 1, lastBridgeSource: "a" }),
    status({ status: "ready", signalsCount: 3, mappedObjectsCount: 2, updatedAt: 2, lastBridgeSource: "a" }),
  ];
  let lastSig: string | null = null;
  let applyCount = 0;
  for (const snap of snapshots) {
    if (shouldSkipPipelineStatusCommit(snap, lastSig)) continue;
    lastSig = buildPipelineStatusSignature(snap);
    applyCount++;
  }
  assert.equal(applyCount, 2);
});
