/**
 * Decision intelligence engine — focused behavioral tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDecisionIntelligence,
  buildDecisionIntelligenceInput,
  resolveDecisionConfidence,
  resolveDecisionSeverity,
} from "./decisionIntelligenceEngine.ts";

test("resolveDecisionSeverity: stable when score and signals are low", () => {
  const sev = resolveDecisionSeverity({
    scannerSummary: { fragilityScore: 0.2, fragilityLevel: "low", drivers: [], summary: "ok" },
    latestSignals: [],
    panelContext: { conflictCount: 0 },
  });
  assert.equal(sev, "stable");
});

test("resolveDecisionSeverity: warning from score threshold", () => {
  const sev = resolveDecisionSeverity({
    scannerSummary: { fragilityScore: 0.5, fragilityLevel: "-", drivers: ["delivery_delay"] },
    latestSignals: [],
    panelContext: { conflictCount: 0 },
  });
  assert.equal(sev, "warning");
});

test("resolveDecisionSeverity: critical from high score", () => {
  const sev = resolveDecisionSeverity({
    scannerSummary: { fragilityScore: 0.85, fragilityLevel: "high", drivers: ["supplier_load"] },
    latestSignals: [{ id: "a", type: "pressure", strength: 0.9, severity: "high" }],
    panelContext: { conflictCount: 0 },
  });
  assert.equal(sev, "critical");
});

test("resolveDecisionConfidence: rises with scanner + drivers + signal diversity", () => {
  const low = resolveDecisionConfidence({
    scannerSummary: null,
    latestSignals: [],
    sceneObjects: [],
  });
  assert.ok(low.score < 0.5);

  const high = resolveDecisionConfidence({
    scannerSummary: {
      fragilityScore: 0.6,
      fragilityLevel: "medium",
      drivers: ["supplier_load", "inventory_pressure"],
      summary: "Elevated propagation risk across fulfillment.",
    },
    latestSignals: [
      { id: "1", type: "pressure", strength: 0.5 },
      { id: "2", type: "conflict", strength: 0.5 },
    ],
    sceneObjects: [{ id: "supplier_load", highlighted: true }],
    panelContext: { conflictCount: 1 },
  });
  assert.ok(high.score >= low.score);
});

test("buildDecisionIntelligence: at most three actions", () => {
  const input = buildDecisionIntelligenceInput({
    domainId: "retail_supply",
    activeSection: "executive",
    selectedObjectId: null,
    selectedObjectName: null,
    sceneObjects: [],
    fragilityScore: 0.88,
    fragilityLevel: "high",
    dominantDriver: { key: "delivery_delay", value: 0.9 },
    fragilityScanResult: {
      summary: "Supplier overload is increasing delay pressure.",
      drivers: [{ label: "supplier_load", score: 0.9 }],
      suggested_objects: [],
    },
    conflicts: [],
    strategicAdvice: null,
    riskPropagation: null,
    volatility: 0.5,
    mode: "demo",
  });
  const out = buildDecisionIntelligence(input);
  assert.ok(out.actions.length <= 3);
  assert.ok(["stable", "warning", "critical"].includes(out.severity));
  assert.ok(["low", "medium", "high"].includes(out.confidence.level));
  assert.ok(out.title.length > 0);
  assert.ok(out.summary.length > 0);
});

test("buildDecisionIntelligence: tolerates partial / empty input", () => {
  const out = buildDecisionIntelligence({});
  assert.equal(out.severity, "stable");
  assert.ok(Array.isArray(out.actions));
  assert.ok(out.actions.length <= 3);
});
