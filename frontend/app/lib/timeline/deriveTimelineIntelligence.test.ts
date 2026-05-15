import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildTimelineIntelligenceOverlayState,
  buildTimelineMemorySnapshot,
  deriveTimelineIntelligence,
} from "./deriveTimelineIntelligence.ts";
import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";

const insights: ExecutiveInsight[] = [
  {
    id: "insight_supplier",
    title: "Supplier Dependency Fragility",
    summary: "Supplier dependency is escalating.",
    category: "dependency",
    severity: "critical",
    confidence: 0.9,
    priorityScore: 94,
    affectedObjectIds: ["supplier", "inventory"],
    recommendedFocus: "supplier dependency",
    domainId: "supply_chain",
    sourceType: "fragility",
    createdAt: 0,
  },
];

const recommendations: DecisionRecommendation[] = [
  {
    id: "rec_supplier",
    title: "Diversify Supplier Dependency",
    summary: "Reduce concentration by diversifying supplier dependency.",
    category: "diversify",
    rationale: "Supplier concentration is high.",
    recommendedFocus: "supplier dependency",
    affectedObjectIds: ["supplier", "inventory"],
    relatedScenarioIds: ["supplier_diversification"],
    confidence: 0.88,
    priority: "critical",
    domainId: "supply_chain",
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
    impacts: [],
    recommendedActions: [],
    executiveSummary: "Supplier diversification reduces upstream concentration.",
    recommendedFocus: "supplier backup path",
    createdAt: 0,
  },
];

const propagationHints: DomainPropagationHint[] = [
  {
    sourceObjectId: "supplier",
    targetObjectId: "inventory",
    propagationStrength: 0.92,
    propagationType: "dependency",
  },
  {
    sourceObjectId: "inventory",
    targetObjectId: "delivery",
    propagationStrength: 0.74,
    propagationType: "delay",
  },
];

const fragilityScores: DomainFragilityScore[] = [
  { objectId: "supplier", score: 90, level: "critical" },
];

test("derives time-aware executive intelligence", () => {
  const timeline = deriveTimelineIntelligence({
    domainId: "supply_chain",
    insights,
    recommendations,
    scenarios,
    propagationHints,
    fragilityScores,
    memory: { previousPropagationIntensity: 0.2 },
  });

  assert.equal(timeline.length, 1);
  assert.equal(timeline[0].trend, "critical");
  assert.ok(timeline[0].momentumScore >= 0 && timeline[0].momentumScore <= 1);
  assert.ok(timeline[0].summary.includes("requires immediate") || timeline[0].summary.includes("expanding"));
  assert.ok(timeline[0].relatedObjectIds.includes("supplier"));
  assert.equal(timeline[0].createdAt, 0);
});

test("timeline intelligence is deterministic and does not mutate input", () => {
  const input = {
    domainId: "supply_chain",
    insights,
    recommendations,
    scenarios,
    propagationHints,
    fragilityScores,
    memory: { previousPropagationIntensity: 0.2 },
  };
  const copy = structuredClone(input);

  const first = deriveTimelineIntelligence(input);
  const second = deriveTimelineIntelligence(input);

  assert.deepEqual(second, first);
  assert.deepEqual(input, copy);
});

test("overlay state is passive metadata", () => {
  const timeline = deriveTimelineIntelligence({
    domainId: "supply_chain",
    insights,
    recommendations,
    propagationHints,
  });
  const overlay = buildTimelineIntelligenceOverlayState({ intelligence: timeline });

  assert.equal(overlay.topTimelineIntelligenceId, timeline[0].id);
  assert.ok(overlay.relatedObjectIds.includes("supplier"));
  assert.ok(overlay.executiveSummary.length > 0);
});

test("empty timeline input returns safe empty state", () => {
  const timeline = deriveTimelineIntelligence({});
  const overlay = buildTimelineIntelligenceOverlayState({ intelligence: timeline });

  assert.deepEqual(timeline, []);
  assert.equal(overlay.trend, "stable");
  assert.equal(overlay.executiveSummary, "No timeline intelligence is available yet.");
});

test("memory snapshot stores previous trend and propagation intensity", () => {
  const timeline = deriveTimelineIntelligence({
    domainId: "supply_chain",
    insights,
    recommendations,
    propagationHints,
  });
  const memory = buildTimelineMemorySnapshot({
    previous: timeline[0],
    recommendation: recommendations[0],
    propagationHints,
  });

  assert.equal(memory.previousTrend, timeline[0].trend);
  assert.equal(memory.previousRecommendationPriority, "critical");
  assert.ok((memory.previousPropagationIntensity ?? 0) > 0);
});
