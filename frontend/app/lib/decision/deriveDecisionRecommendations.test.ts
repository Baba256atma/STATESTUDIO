import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildDecisionRecommendationOverlayState,
  deriveDecisionRecommendations,
  groupDecisionRecommendations,
} from "./deriveDecisionRecommendations.ts";
import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { EnrichedDomainRelationship } from "../domain/enrichDomainRelationships.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";

const insights: ExecutiveInsight[] = [
  {
    id: "exec_insight_supplier",
    title: "Supplier Dependency Fragility",
    summary: "Supplier dependency is the primary operational pressure.",
    category: "dependency",
    severity: "critical",
    confidence: 0.88,
    priorityScore: 94,
    affectedObjectIds: ["supplier", "inventory"],
    recommendedFocus: "supplier dependency concentration",
    domainId: "supply_chain",
    sourceType: "fragility",
    createdAt: 0,
  },
];

const scenarios: DomainScenario[] = [
  {
    id: "supplier_diversification",
    domainId: "supply_chain",
    title: "Supplier Diversification",
    description: "Add backup supplier path.",
    type: "mitigation",
    confidence: 0.84,
    severity: "medium",
    relatedObjectIds: ["supplier", "inventory"],
    affectedObjectIds: ["supplier", "inventory"],
    impacts: [
      { category: "risk", direction: "decrease", magnitude: 70 },
      { category: "stability", direction: "increase", magnitude: 55 },
    ],
    recommendedActions: ["Add secondary supplier path"],
    executiveSummary: "Supplier diversification reduces upstream concentration.",
    recommendedFocus: "supplier backup path",
    createdAt: 0,
  },
  {
    id: "accept_delay",
    domainId: "supply_chain",
    title: "Accept Delay Risk",
    description: "Accept supplier delay risk.",
    type: "delay",
    confidence: 0.48,
    severity: "high",
    relatedObjectIds: ["supplier", "delivery"],
    affectedObjectIds: ["supplier", "inventory", "delivery"],
    impacts: [],
    recommendedActions: [],
    executiveSummary: "Delay risk can reach delivery.",
    createdAt: 0,
  },
];

const comparison: ScenarioComparison = {
  id: "compare_supplier",
  scenarioAId: "accept_delay",
  scenarioBId: "supplier_diversification",
  comparisonTitle: "Supplier Strategy Comparison",
  executiveSummary: "Supplier diversification reduces propagation exposure.",
  stabilityDelta: 24,
  fragilityDelta: -32,
  propagationDelta: -20,
  confidenceDelta: 18,
  recommendedScenarioId: "supplier_diversification",
  tradeoffs: ["Reduces dependency concentration"],
  createdAt: 0,
};

const propagationHints: DomainPropagationHint[] = [
  {
    sourceObjectId: "supplier",
    targetObjectId: "inventory",
    propagationStrength: 0.9,
    propagationType: "dependency",
  },
  {
    sourceObjectId: "inventory",
    targetObjectId: "delivery",
    propagationStrength: 0.7,
    propagationType: "delay",
  },
];

const fragilityScores: DomainFragilityScore[] = [
  { objectId: "supplier", score: 88, level: "critical" },
];

const relationships: EnrichedDomainRelationship[] = [
  {
    edgeId: "edge_supplier_inventory",
    sourceObjectId: "supplier",
    targetObjectId: "inventory",
    relationshipType: "dependency",
    meta: {
      semantic: "dependency",
      strength: 0.86,
      directional: true,
      executiveLabel: "Operational Dependency",
    },
    executiveExplanation: "Inventory depends on Supplier stability.",
  },
];

test("derives prioritized executive recommendations", () => {
  const recommendations = deriveDecisionRecommendations({
    domainId: "supply_chain",
    insights,
    scenarios,
    comparisons: [comparison],
    propagationHints,
    fragilityScores,
    relationships,
  });

  assert.ok(recommendations.length > 0);
  assert.equal(recommendations[0].priority, "critical");
  assert.ok(recommendations.some((item) => item.category === "diversify"));
  assert.ok(recommendations[0].rationale.length > 0);
});

test("recommendation derivation is deterministic and does not mutate input", () => {
  const input = { insights, scenarios, comparisons: [comparison], propagationHints, fragilityScores, relationships };
  const copy = structuredClone(input);

  const first = deriveDecisionRecommendations(input);
  const second = deriveDecisionRecommendations(input);

  assert.deepEqual(second, first);
  assert.deepEqual(input, copy);
});

test("recommendations are capped and deduped", () => {
  const recommendations = deriveDecisionRecommendations({
    insights: [...insights, ...insights, ...insights],
    scenarios: [...scenarios, ...scenarios],
    comparisons: [comparison, comparison],
    fragilityScores: [...fragilityScores, ...fragilityScores],
  });

  const ids = new Set(recommendations.map((item) => item.id));
  assert.equal(ids.size, recommendations.length);
  assert.ok(recommendations.length <= 6);
});

test("grouping and overlay state are passive metadata", () => {
  const recommendations = deriveDecisionRecommendations({
    insights,
    scenarios,
    comparisons: [comparison],
  });
  const groups = groupDecisionRecommendations(recommendations);
  const overlay = buildDecisionRecommendationOverlayState({ recommendations });

  assert.ok(groups.length > 0);
  assert.equal(overlay.topRecommendationId, recommendations[0].id);
  assert.ok(overlay.affectedObjectIds.includes("supplier"));
  assert.ok(overlay.executiveSummary.includes(recommendations[0].title));
});

test("empty input returns safe empty recommendation set", () => {
  const recommendations = deriveDecisionRecommendations({});
  const overlay = buildDecisionRecommendationOverlayState({ recommendations });

  assert.deepEqual(recommendations, []);
  assert.equal(overlay.executiveSummary, "No decision recommendation is available yet.");
});
