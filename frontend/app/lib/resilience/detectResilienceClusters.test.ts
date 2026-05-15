import assert from "node:assert/strict";
import test from "node:test";
import { detectResilienceClusters } from "./detectResilienceClusters.ts";

test("detects resilience clusters from improving monitoring forecast and intervention evidence", () => {
  const clusters = detectResilienceClusters({
    forecasts: [{
      id: "forecast_improving",
      title: "Improving",
      summary: "Improving.",
      direction: "improving",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      confidence: 0.8,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_stable",
      title: "Stable",
      summary: "Stable.",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.8,
      urgencyScore: 0.15,
      domainId: "supply_chain",
      createdAt: 0,
    }],
    interventions: [{
      id: "intervention_reduce_dependency",
      title: "Reduce dependency",
      summary: "Reduce dependency.",
      category: "reduce_dependency",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      propagationReductionPotential: 0.7,
      priority: "high",
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
  });

  assert.equal(clusters.length, 1);
  assert.deepEqual(clusters[0].relatedObjectIds, ["delivery", "inventory", "supplier"]);
  assert.ok(clusters[0].resilienceScore > 0.35);
});

test("resilience cluster detection is deterministic and does not mutate input", () => {
  const params = {
    decisionReviews: [{
      id: "review_resolved",
      title: "Resolved",
      summary: "Resolved.",
      relatedObjectIds: ["database", "service"],
      reviewStatus: "resolved" as const,
      confidence: 0.82,
      createdAt: 0,
    }],
  };
  const before = JSON.stringify(params);

  assert.deepEqual(detectResilienceClusters(params), detectResilienceClusters(params));
  assert.equal(JSON.stringify(params), before);
});
