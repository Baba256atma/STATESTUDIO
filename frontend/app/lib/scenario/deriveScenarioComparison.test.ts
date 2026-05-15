import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  deriveScenarioComparison,
  deriveScenarioComparisons,
} from "./deriveScenarioComparison.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";

const risky: DomainScenario = {
  id: "risky",
  domainId: "supply_chain",
  title: "Accept delivery delay",
  description: "Accept risk",
  type: "delay",
  confidence: 0.52,
  severity: "high",
  relatedObjectIds: ["supplier", "inventory", "delivery"],
  affectedObjectIds: ["supplier", "inventory", "delivery"],
  impacts: [
    { category: "risk", direction: "increase", magnitude: 74 },
    { category: "timeline", direction: "increase", magnitude: 66 },
  ],
  recommendedActions: [],
  executiveSummary: "Accept delay risk.",
  metadata: { propagationReach: 3, fragilityScore: 80, relationshipStrength: 0.9 },
};

const safer: DomainScenario = {
  id: "safer",
  domainId: "supply_chain",
  title: "Supplier diversification",
  description: "Add backup path",
  type: "mitigation",
  confidence: 0.84,
  severity: "medium",
  relatedObjectIds: ["supplier", "inventory"],
  affectedObjectIds: ["supplier", "inventory"],
  impacts: [
    { category: "risk", direction: "decrease", magnitude: 72 },
    { category: "stability", direction: "increase", magnitude: 58 },
  ],
  recommendedActions: [],
  executiveSummary: "Diversify supplier path.",
  metadata: { propagationReach: 1, fragilityScore: 36, relationshipStrength: 0.68 },
};

const watch: DomainScenario = {
  ...safer,
  id: "watch",
  title: "Monitor inventory",
  confidence: 0.6,
  severity: "low",
  impacts: [{ category: "confidence", direction: "increase", magnitude: 18 }],
};

test("derives advisory comparison and recommends safer scenario", () => {
  const comparison = deriveScenarioComparison({ scenarioA: risky, scenarioB: safer });

  assert.equal(comparison.recommendedScenarioId, "safer");
  assert.ok(comparison.executiveSummary.includes("Supplier diversification"));
  assert.ok(comparison.tradeoffs.length > 0);
  assert.equal(comparison.createdAt, 0);
});

test("comparison derivation is deterministic", () => {
  const first = deriveScenarioComparisons({ scenarios: [risky, safer, watch] });
  const second = deriveScenarioComparisons({ scenarios: [risky, safer, watch] });

  assert.deepEqual(second, first);
  assert.ok(first.length <= 6);
});

test("comparison derivation does not mutate scenarios", () => {
  const scenarios = [risky, safer, watch];
  const copy = structuredClone(scenarios);

  deriveScenarioComparisons({ scenarios });

  assert.deepEqual(scenarios, copy);
});
