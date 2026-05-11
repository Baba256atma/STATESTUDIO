import { test } from "node:test";
import * as assert from "node:assert/strict";

import { prioritizeExecutiveInsights } from "./domainExecutivePrioritization.ts";
import { buildExecutiveRecommendations } from "./domainExecutiveRecommendations.ts";
import type { DomainExecutiveInsight } from "./domainExecutiveIntelligence.ts";

const insights: DomainExecutiveInsight[] = [
  {
    id: "low",
    domainId: "general",
    title: "Low watch",
    summary: "Low watch.",
    posture: "watch",
    priority: "low",
    confidence: 0.5,
    relatedObjectIds: ["a"],
    recommendedActions: ["Monitor"],
    explanation: "Low watch.",
  },
  {
    id: "critical",
    domainId: "general",
    title: "Critical pressure",
    summary: "Critical pressure.",
    posture: "critical",
    priority: "critical",
    confidence: 0.72,
    relatedObjectIds: ["b"],
    relatedSignalIds: ["s1", "s2"],
    recommendedActions: ["Escalate"],
    explanation: "Critical pressure.",
  },
];

test("executive ranking is stable", () => {
  const first = prioritizeExecutiveInsights({ insights });
  const second = prioritizeExecutiveInsights({ insights });

  assert.deepEqual(second, first);
  assert.equal(first[0]?.insightId, "critical");
  assert.equal(first[0]?.rank, 1);
});

test("executive recommendations are generated", () => {
  const recommendation = buildExecutiveRecommendations({ insights });

  assert.equal(recommendation.headline, "Critical pressure");
  assert.equal(recommendation.posture, "critical");
  assert.ok(recommendation.topRecommendations.includes("Escalate"));
  assert.ok(recommendation.confidence >= 0 && recommendation.confidence <= 1);
});

test("empty executive recommendation is safe", () => {
  const recommendation = buildExecutiveRecommendations({ insights: [] });

  assert.equal(recommendation.posture, "watch");
  assert.ok(recommendation.explanation.length > 0);
});

test("no duplicate recommendations", () => {
  const recommendation = buildExecutiveRecommendations({
    insights: [
      insights[0],
      { ...insights[0], id: "low_copy" },
    ],
  });

  assert.deepEqual(recommendation.topRecommendations, ["Monitor"]);
});
