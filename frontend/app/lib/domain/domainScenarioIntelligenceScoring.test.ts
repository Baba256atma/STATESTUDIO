import { test } from "node:test";
import * as assert from "node:assert/strict";

import { scoreDomainScenarioIntelligence } from "./domainScenarioIntelligenceScoring.ts";

test("scenario intelligence scoring is clamped and prioritized", () => {
  const score = scoreDomainScenarioIntelligence({
    severity: "critical",
    baseConfidence: 2,
    propagationReach: 20,
    relationshipStrength: 2,
    fragilityScore: 200,
  });

  assert.equal(score.confidence, 1);
  assert.equal(score.priority, "critical");
});

test("scenario intelligence scoring is deterministic", () => {
  const input = {
    severity: "medium" as const,
    baseConfidence: 0.52,
    propagationReach: 2,
    relationshipStrength: 0.7,
    fragilityScore: 44,
  };

  assert.deepEqual(scoreDomainScenarioIntelligence(input), scoreDomainScenarioIntelligence(input));
});
