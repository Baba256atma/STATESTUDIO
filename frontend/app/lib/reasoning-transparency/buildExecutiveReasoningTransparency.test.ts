import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveMetaCognitionSnapshot } from "../meta-cognition/buildExecutiveMetaCognitionSnapshot";
import { buildExecutiveReasoningTransparency } from "./buildExecutiveReasoningTransparency";

test("buildExecutiveReasoningTransparency produces stable executive contract", () => {
  const meta = buildExecutiveMetaCognitionSnapshot({
    organizationId: "org-test",
    sceneJson: { scene: { objects: [{ id: "a" }, { id: "b" }], loops: [{ id: "l1" }] } },
    canonicalRecommendation: {
      id: "rec-1",
      primary: { action: "Stabilize supplier coordination" },
      alternatives: [{ action: "Wait", tradeoff: "Lower disruption risk, slower recovery." }],
      reasoning: { why: "Dependency pressure is elevated.", key_drivers: ["Supplier latency"] },
      confidence: { score: 0.72, level: "medium" },
      source: "simulation",
      created_at: 1000,
    },
    pipelineStatus: { fragilityLevel: "high", signalsCount: 2 },
    timestamp: 1000,
  });

  const t1 = buildExecutiveReasoningTransparency({
    metaCognition: meta,
    canonicalRecommendation: {
      id: "rec-1",
      primary: { action: "Stabilize supplier coordination" },
      alternatives: [{ action: "Wait", tradeoff: "Lower disruption risk, slower recovery." }],
      reasoning: { why: "Dependency pressure is elevated.", key_drivers: ["Supplier latency"] },
      confidence: { score: 0.72, level: "medium" },
      source: "simulation",
      created_at: 1000,
    },
    pipelineStatus: { fragilityLevel: "high" },
    timestamp: 1000,
  });

  const t2 = buildExecutiveReasoningTransparency({
    metaCognition: meta,
    canonicalRecommendation: {
      id: "rec-1",
      primary: { action: "Stabilize supplier coordination" },
      alternatives: [{ action: "Wait", tradeoff: "Lower disruption risk, slower recovery." }],
      reasoning: { why: "Dependency pressure is elevated.", key_drivers: ["Supplier latency"] },
      confidence: { score: 0.72, level: "medium" },
      source: "simulation",
      created_at: 1000,
    },
    pipelineStatus: { fragilityLevel: "high" },
    timestamp: 1000,
  });

  assert.equal(t1.signature, t2.signature);
  assert.equal(t1.advisoryId, "rec-1");
  assert.ok(t1.assumptions.length >= 1);
  assert.ok(t1.uncertaintySources.length >= 1);
  assert.ok(t1.tradeoffs.length >= 1);
  assert.ok(t1.reasoningSummary.length > 0);
  assert.ok(t1.rightRailLine.includes("Why:"));
});
