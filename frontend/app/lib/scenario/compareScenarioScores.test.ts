import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  compareScenarioScores,
  measureScenarioForComparison,
} from "./compareScenarioScores.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";

const risky: DomainScenario = {
  id: "risky",
  domainId: "supply_chain",
  title: "Accept supplier delay risk",
  description: "Accept delay",
  type: "delay",
  confidence: 0.55,
  severity: "high",
  relatedObjectIds: ["supplier", "inventory", "delivery"],
  affectedObjectIds: ["supplier", "inventory", "delivery"],
  impacts: [
    { category: "risk", direction: "increase", magnitude: 70 },
    { category: "timeline", direction: "increase", magnitude: 60 },
  ],
  recommendedActions: [],
  executiveSummary: "Delay risk accepted.",
  metadata: { propagationReach: 3, fragilityScore: 82, relationshipStrength: 0.86 },
};

const safer: DomainScenario = {
  id: "safer",
  domainId: "supply_chain",
  title: "Add backup supplier",
  description: "Diversify source",
  type: "mitigation",
  confidence: 0.82,
  severity: "medium",
  relatedObjectIds: ["supplier", "inventory"],
  affectedObjectIds: ["supplier", "inventory"],
  impacts: [
    { category: "risk", direction: "decrease", magnitude: 68 },
    { category: "stability", direction: "increase", magnitude: 52 },
  ],
  recommendedActions: [],
  executiveSummary: "Diversify supplier path.",
  metadata: { propagationReach: 1, fragilityScore: 42, relationshipStrength: 0.72 },
};

test("scenario metrics are clamped", () => {
  const metrics = measureScenarioForComparison(risky);

  assert.ok(metrics.fragilityScore >= 0 && metrics.fragilityScore <= 100);
  assert.ok(metrics.propagationScore >= 0 && metrics.propagationScore <= 100);
  assert.ok(metrics.stabilityScore >= 0 && metrics.stabilityScore <= 100);
  assert.ok(metrics.confidenceScore >= 0 && metrics.confidenceScore <= 100);
});

test("comparison deltas describe scenario B relative to A", () => {
  const comparison = compareScenarioScores({ scenarioA: risky, scenarioB: safer });

  assert.ok(comparison.fragilityDelta < 0);
  assert.ok(comparison.propagationDelta < 0);
  assert.ok(comparison.stabilityDelta > 0);
  assert.ok(comparison.confidenceDelta > 0);
});
