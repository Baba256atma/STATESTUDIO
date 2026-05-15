import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildDecisionRecommendationRationale,
  buildDecisionRecommendationSummary,
  buildDecisionRecommendationTitle,
  groupLabelForDecisionRecommendation,
} from "./decisionRecommendationNarratives.ts";

test("recommendation narratives are concise executive language", () => {
  const title = buildDecisionRecommendationTitle({
    category: "diversify",
    focus: "supplier dependency",
  });
  const summary = buildDecisionRecommendationSummary({
    category: "diversify",
    focus: "supplier dependency",
  });
  const rationale = buildDecisionRecommendationRationale({
    category: "diversify",
    focus: "supplier dependency",
  });

  assert.equal(title, "Diversify Supplier Dependency");
  assert.ok(summary.includes("Reduce concentration"));
  assert.ok(rationale.includes("Concentration"));
  assert.ok(summary.length < 140);
});

test("recommendation group labels are stable", () => {
  assert.equal(groupLabelForDecisionRecommendation("stabilize"), "Stabilization Recommendations");
  assert.equal(groupLabelForDecisionRecommendation("reduce_risk"), "Risk Reduction Recommendations");
  assert.equal(groupLabelForDecisionRecommendation("rebalance"), "Operational Focus Recommendations");
});
