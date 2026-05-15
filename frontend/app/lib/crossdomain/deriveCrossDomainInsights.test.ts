import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCrossDomainOverlayState,
  deriveCrossDomainInsights,
} from "./deriveCrossDomainInsights.ts";
import { deriveCrossDomainClusters } from "./crossDomainClusters.ts";

const compressedInsight = {
  id: "compressed_supplier",
  title: "Supplier dependency is the dominant executive pressure",
  summary: "Supplier dependency is concentrating executive risk.",
  supportingInsightIds: ["insight_supplier"],
  supportingScenarioIds: ["scenario_supplier"],
  relatedObjectIds: ["supplier", "inventory"],
  priority: "critical" as const,
  confidenceLevel: "high" as const,
  executiveFocus: "Supplier dependency",
  domainId: "supply_chain",
  createdAt: 0,
};

const monitoringSignal = {
  id: "monitor_supplier",
  title: "Supplier pressure",
  summary: "Supplier pressure remains critical.",
  relatedObjectIds: ["supplier", "inventory"],
  monitoringStatus: "critical" as const,
  trend: "degrading" as const,
  confidence: 0.82,
  urgencyScore: 0.88,
  recommendedAttention: "Supplier dependency",
  domainId: "supply_chain",
  createdAt: 0,
};

test("cross-domain insights derive from supply chain pressure", () => {
  const insights = deriveCrossDomainInsights({
    domainId: "supply_chain",
    compressedInsights: [compressedInsight],
    monitoringSignals: [monitoringSignal],
  });

  assert.ok(insights.length >= 1);
  assert.equal(insights[0].sourceDomainId, "supply_chain");
  assert.ok(insights.some((insight) => insight.relationshipType === "delivery_impact"));
  assert.ok(insights[0].relatedObjectIds.includes("supplier"));
  assert.ok(insights[0].summary.includes("Supplier dependency"));
});

test("cross-domain derivation is deterministic and does not mutate input", () => {
  const input = {
    domainId: "supply_chain",
    compressedInsights: [compressedInsight],
    monitoringSignals: [monitoringSignal],
  };
  const before = JSON.stringify(input);
  const first = deriveCrossDomainInsights(input);
  const second = deriveCrossDomainInsights(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("cross-domain overlay and clusters are passive metadata", () => {
  const insights = deriveCrossDomainInsights({
    domainId: "supply_chain",
    compressedInsights: [compressedInsight],
    monitoringSignals: [monitoringSignal],
  });
  const overlay = buildCrossDomainOverlayState({ insights });
  const clusters = deriveCrossDomainClusters({ insights });

  assert.equal(overlay.topInsightId, insights[0].id);
  assert.ok(overlay.relatedDomainIds.includes("supply_chain"));
  assert.ok(clusters.length >= 1);
  assert.ok(clusters[0].insightIds.includes(insights[0].id));
});

test("cross-domain layer remains quiet without source evidence", () => {
  assert.deepEqual(deriveCrossDomainInsights({}), []);
  assert.equal(buildCrossDomainOverlayState({ insights: [] }).executiveSummary, "No cross-domain executive pressure is visible yet.");
});
