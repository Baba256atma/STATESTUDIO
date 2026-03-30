import test from "node:test";
import assert from "node:assert/strict";

import { AdvicePanelDataSchema } from "./panelDataContract.ts";
import {
  normalizeAdviceConfidence,
  normalizeCanonicalAdvicePanelData,
} from "./adviceAdapter.ts";

test("normalizeAdviceConfidence maps numeric confidence into canonical object shape", () => {
  assert.deepEqual(normalizeAdviceConfidence(0.72), { score: 0.72 });
});

test("normalizeCanonicalAdvicePanelData preserves canonical confidence objects", () => {
  const advice = normalizeCanonicalAdvicePanelData({
    title: "Advice",
    summary: "Inventory pressure is rising",
    confidence: { score: 0.68, level: 0.82 },
  });

  assert.ok(advice);
  assert.deepEqual(advice?.confidence, { score: 0.68, level: 0.82 });
  assert.ok(AdvicePanelDataSchema.safeParse(advice).success);
});

test("normalizeCanonicalAdvicePanelData safely accepts legacy numeric confidence", () => {
  const advice = normalizeCanonicalAdvicePanelData({
    summary: "Delivery risk is increasing",
    recommendation: "Stabilize supplier intake",
    confidence: 0.72,
  });

  assert.ok(advice);
  assert.deepEqual(advice?.confidence, { score: 0.72 });
  assert.ok(AdvicePanelDataSchema.safeParse(advice).success);
});

test("normalizeCanonicalAdvicePanelData returns schema-valid advice when confidence is missing", () => {
  const advice = normalizeCanonicalAdvicePanelData({
    summary: "No major disruption detected",
    recommendation: "Keep monitoring",
  });

  assert.ok(advice);
  assert.equal(advice?.confidence, null);
  assert.ok(AdvicePanelDataSchema.safeParse(advice).success);
});

test("normalizeCanonicalAdvicePanelData drops malformed confidence instead of throwing", () => {
  const advice = normalizeCanonicalAdvicePanelData({
    summary: "Inventory pressure is manageable",
    recommendation: "Maintain current posture",
    confidence: "high",
  });

  assert.ok(advice);
  assert.equal(advice?.confidence, null);
  assert.ok(AdvicePanelDataSchema.safeParse(advice).success);
});

test("normalizeCanonicalAdvicePanelData handles grouped prompt style partial advice payloads", () => {
  const advice = normalizeCanonicalAdvicePanelData(
    {
      summary: "Inventory shortage is delaying delivery",
      recommended_actions: [{ action: "Stabilize supplier intake" }],
      confidence: 0.72,
    },
    {
      defaultTitle: "Advice",
      fallbackWhy: "Inventory pressure is spreading into delivery operations.",
      fallbackRecommendation: "Stabilize supplier intake",
      fallbackRiskSummary: "Delivery delay risk is rising.",
      fallbackRecommendations: ["Stabilize supplier intake"],
    }
  );

  assert.ok(advice);
  assert.equal(advice?.title, "Advice");
  assert.equal(advice?.recommendation, "Stabilize supplier intake");
  assert.deepEqual(advice?.confidence, { score: 0.72 });
  assert.ok(AdvicePanelDataSchema.safeParse(advice).success);
});
