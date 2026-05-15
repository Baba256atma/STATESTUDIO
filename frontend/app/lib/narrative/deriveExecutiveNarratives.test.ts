import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveNarrativeOverlayState,
  deriveExecutiveNarratives,
} from "./deriveExecutiveNarratives.ts";
import { deriveExecutiveNarrativeBriefing } from "./deriveExecutiveNarrativeBriefing.ts";

const executiveInsight = {
  id: "insight_supplier",
  title: "Supplier Dependency Fragility",
  summary: "Supplier dependency pressure.",
  category: "dependency" as const,
  severity: "critical" as const,
  confidence: 0.86,
  priorityScore: 92,
  affectedObjectIds: ["supplier", "inventory"],
  recommendedFocus: "Supplier dependency",
  domainId: "supply_chain",
  sourceType: "relationship" as const,
  createdAt: 0,
};

const recommendation = {
  id: "rec_supplier",
  title: "Reduce Supplier Dependency",
  summary: "Reduce supplier dependency.",
  category: "diversify" as const,
  rationale: "Supplier dependency is elevated.",
  recommendedFocus: "Supplier dependency",
  affectedObjectIds: ["supplier", "inventory"],
  relatedScenarioIds: ["scenario_supplier"],
  confidence: 0.84,
  priority: "critical" as const,
  domainId: "supply_chain",
  createdAt: 0,
};

test("executive narratives synthesize disconnected signals into a coherent story", () => {
  const narratives = deriveExecutiveNarratives({
    executiveInsights: [executiveInsight],
    recommendations: [recommendation],
    timelineIntelligence: [{
      id: "timeline_supplier",
      title: "Supplier timeline degradation",
      summary: "Supplier exposure is degrading.",
      relatedObjectIds: ["supplier", "inventory"],
      trend: "degrading" as const,
      momentumScore: 0.82,
      confidence: 0.78,
      recommendedAttention: "Supplier dependency",
      domainId: "supply_chain",
      createdAt: 0,
    }],
    crossDomainInsights: [{
      id: "cross_supplier_delivery",
      sourceDomainId: "supply_chain",
      targetDomainId: "retail",
      relationshipType: "delivery_impact" as const,
      title: "Supply Chain -> Retail",
      summary: "Supplier instability affects delivery.",
      relatedObjectIds: ["supplier", "inventory"],
      severity: "high" as const,
      confidence: 0.74,
      executiveImpact: "Supplier instability is increasing downstream delivery fragility.",
      createdAt: 0,
    }],
  });

  assert.equal(narratives.length, 1);
  assert.equal(narratives[0].tone, "urgent");
  assert.match(narratives[0].headline, /Supplier dependency/);
  assert.match(narratives[0].strategicMeaning ?? "", /matters/);
  assert.ok(narratives[0].relatedInsightIds.length >= 3);
  assert.ok(narratives[0].relatedScenarioIds?.includes("scenario_supplier"));
});

test("executive narratives are deterministic and passive", () => {
  const input = {
    executiveInsights: [executiveInsight],
    recommendations: [recommendation],
  };
  const before = JSON.stringify(input);
  const first = deriveExecutiveNarratives(input);
  const second = deriveExecutiveNarratives(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
  assert.equal(first[0].createdAt, 0);
});

test("narrative overlay and briefing provide safe fallback states", () => {
  const narratives = deriveExecutiveNarratives({
    executiveInsights: [executiveInsight],
    recommendations: [recommendation],
  });
  const overlay = buildExecutiveNarrativeOverlayState({ narratives });
  const briefing = deriveExecutiveNarrativeBriefing({ narratives });
  const emptyOverlay = buildExecutiveNarrativeOverlayState({ narratives: [] });
  const emptyBriefing = deriveExecutiveNarrativeBriefing({ narratives: [] });

  assert.equal(overlay.topNarrativeId, narratives[0].id);
  assert.equal(briefing.relatedNarrativeIds[0], narratives[0].id);
  assert.equal(emptyOverlay.tone, "informational");
  assert.equal(emptyBriefing.confidence, 0);
});
