import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildStrategicMemoryOverlayState,
  buildTimelineMemoryFromStrategicMemory,
  deriveStrategicMemory,
} from "./deriveStrategicMemory.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";

const insight: ExecutiveInsight = {
  id: "insight_supplier",
  title: "Supplier Dependency Fragility",
  summary: "Supplier dependency is repeatedly fragile.",
  category: "dependency",
  severity: "critical",
  confidence: 0.9,
  priorityScore: 94,
  affectedObjectIds: ["supplier", "inventory"],
  recommendedFocus: "supplier dependency",
  domainId: "supply_chain",
  sourceType: "fragility",
  createdAt: 0,
};

const recommendation: DecisionRecommendation = {
  id: "rec_supplier",
  title: "Diversify Supplier Dependency",
  summary: "Reduce supplier concentration.",
  category: "diversify",
  rationale: "Supplier dependency concentration remains elevated.",
  recommendedFocus: "supplier dependency",
  affectedObjectIds: ["supplier", "inventory"],
  relatedScenarioIds: ["supplier_diversification"],
  confidence: 0.88,
  priority: "critical",
  domainId: "supply_chain",
  createdAt: 0,
};

const timeline: TimelineIntelligence = {
  id: "timeline_supplier",
  title: "Critical momentum around supplier dependency",
  summary: "Dependency pressure around supplier dependency requires immediate executive attention.",
  relatedObjectIds: ["supplier", "inventory"],
  trend: "critical",
  momentumScore: 0.86,
  confidence: 0.9,
  recommendedAttention: "supplier dependency",
  domainId: "supply_chain",
  createdAt: 0,
};

const scenario: DomainScenario = {
  id: "supplier_diversification",
  domainId: "supply_chain",
  title: "Supplier Diversification",
  description: "Add backup path.",
  type: "mitigation",
  confidence: 0.84,
  severity: "medium",
  relatedObjectIds: ["supplier", "inventory"],
  affectedObjectIds: ["supplier", "inventory"],
  impacts: [],
  recommendedActions: [],
  executiveSummary: "Supplier diversification reduces upstream concentration.",
  recommendedFocus: "supplier dependency",
  createdAt: 0,
};

const propagationHints: DomainPropagationHint[] = [
  {
    sourceObjectId: "supplier",
    targetObjectId: "inventory",
    propagationStrength: 0.8,
    propagationType: "dependency",
  },
  {
    sourceObjectId: "supplier",
    targetObjectId: "delivery",
    propagationStrength: 0.7,
    propagationType: "delay",
  },
];

test("derives strategic memory from executive intelligence sources", () => {
  const records = deriveStrategicMemory({
    domainId: "supply_chain",
    insights: [insight],
    recommendations: [recommendation],
    timelineIntelligence: [timeline],
    scenarios: [scenario],
    propagationHints,
    now: 10,
  });

  assert.ok(records.length > 0);
  assert.ok(records.some((record) => record.category === "dependency"));
  assert.ok(records.some((record) => record.category === "timeline"));
  assert.ok(records.some((record) => record.category === "propagation"));
  assert.ok(records[0].recurrenceCount && records[0].recurrenceCount >= 1);
});

test("strategic memory merges recurrence across existing records", () => {
  const first = deriveStrategicMemory({
    domainId: "supply_chain",
    insights: [insight],
    now: 1,
  });
  const second = deriveStrategicMemory({
    domainId: "supply_chain",
    existingRecords: first,
    insights: [insight],
    now: 3,
  });
  const matching = second.find((record) => record.id === first[0].id);

  assert.ok(matching);
  assert.equal(matching?.recurrenceCount, 2);
  assert.equal(matching?.firstObservedAt, 1);
  assert.equal(matching?.lastObservedAt, 3);
});

test("strategic memory derivation is deterministic and does not mutate input", () => {
  const input = {
    domainId: "supply_chain",
    insights: [insight],
    recommendations: [recommendation],
    timelineIntelligence: [timeline],
    scenarios: [scenario],
    propagationHints,
    now: 10,
  };
  const copy = structuredClone(input);

  const first = deriveStrategicMemory(input);
  const second = deriveStrategicMemory(input);

  assert.deepEqual(second, first);
  assert.deepEqual(input, copy);
});

test("strategic memory overlay is passive metadata", () => {
  const records = deriveStrategicMemory({
    domainId: "supply_chain",
    insights: [insight],
    recommendations: [recommendation],
    now: 10,
  });
  const overlay = buildStrategicMemoryOverlayState({ records });

  assert.equal(overlay.topMemoryId, records[0].id);
  assert.ok(overlay.relatedObjectIds.includes("supplier"));
  assert.ok(overlay.executiveSummary.length > 0);
  assert.ok(overlay.recurringCategories.length > 0);
});

test("strategic memory builds timeline memory snapshot", () => {
  const records = deriveStrategicMemory({
    domainId: "supply_chain",
    insights: [insight],
    existingRecords: deriveStrategicMemory({ domainId: "supply_chain", insights: [insight], now: 1 }),
    now: 4,
  });
  const snapshot = buildTimelineMemoryFromStrategicMemory(records);

  assert.ok(snapshot.previousPropagationIntensity !== undefined);
  assert.ok(["degrading", "stable", "improving"].includes(snapshot.previousTrend ?? "stable"));
});

test("empty strategic memory returns safe overlay", () => {
  const records = deriveStrategicMemory({});
  const overlay = buildStrategicMemoryOverlayState({ records });

  assert.deepEqual(records, []);
  assert.equal(overlay.executiveSummary, "No strategic memory pattern is available yet.");
  assert.equal(overlay.memoryState, "monitoring");
});
