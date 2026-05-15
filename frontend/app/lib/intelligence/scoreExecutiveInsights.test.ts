import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  priorityTierFromScore,
  scoreExecutiveInsightPriority,
} from "./scoreExecutiveInsights.ts";

test("priority score is clamped and deterministic", () => {
  const input = {
    severity: "critical" as const,
    confidence: 2,
    propagationReach: 99,
    dependencyDensity: 99,
    relationshipStrength: 2,
    objectCentrality: 2,
    domainWeight: 2,
  };

  assert.equal(scoreExecutiveInsightPriority(input), 100);
  assert.equal(scoreExecutiveInsightPriority(input), scoreExecutiveInsightPriority(input));
});

test("priority tier maps scores to executive bands", () => {
  assert.equal(priorityTierFromScore(10), "monitor");
  assert.equal(priorityTierFromScore(30), "attention");
  assert.equal(priorityTierFromScore(60), "urgent");
  assert.equal(priorityTierFromScore(90), "critical");
});
