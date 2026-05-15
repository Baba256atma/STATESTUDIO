import assert from "node:assert/strict";
import test from "node:test";
import {
  buildOrganizationalResilienceOverlayState,
  deriveOrganizationalResilienceSignals,
} from "./deriveOrganizationalResilience.ts";

test("derives organizational resilience signals from recovery evidence", () => {
  const signals = deriveOrganizationalResilienceSignals({
    forecasts: [{
      id: "forecast_improving",
      title: "Improving",
      summary: "Improving.",
      direction: "improving",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      confidence: 0.82,
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_stable",
      title: "Stable monitoring",
      summary: "Stable monitoring.",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      monitoringStatus: "stable",
      trend: "improving",
      confidence: 0.82,
      urgencyScore: 0.16,
      domainId: "supply_chain",
      createdAt: 0,
    }],
    interventions: [{
      id: "intervention_diversify",
      title: "Diversify supplier",
      summary: "Diversify supplier path.",
      category: "diversify",
      relatedObjectIds: ["supplier", "inventory", "delivery"],
      propagationReductionPotential: 0.76,
      priority: "high",
      domainIds: ["supply_chain"],
      createdAt: 0,
    }],
  });

  assert.equal(signals.length, 1);
  assert.ok(signals[0].resilienceScore > 0.45);
  assert.ok(signals[0].recoveryCapacity);
  assert.match(signals[0].summary, /resilience|stability|recovery/i);
});

test("organizational resilience derivation is deterministic and does not mutate input", () => {
  const params = {
    forecasts: [{
      id: "forecast_stable",
      title: "Stable",
      summary: "Stable.",
      direction: "stable" as const,
      relatedObjectIds: ["database", "service"],
      confidence: 0.8,
      createdAt: 0,
    }],
    decisionReviews: [{
      id: "review_stabilized",
      title: "Stabilized",
      summary: "Stabilized.",
      relatedObjectIds: ["database", "service"],
      reviewStatus: "stabilized" as const,
      confidence: 0.78,
      createdAt: 0,
    }],
  };
  const before = JSON.stringify(params);

  const first = deriveOrganizationalResilienceSignals(params);
  const second = deriveOrganizationalResilienceSignals(params);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(params), before);
});

test("organizational resilience overlay is passive and empty state is safe", () => {
  const empty = buildOrganizationalResilienceOverlayState({ signals: [] });
  assert.equal(empty.resilienceScore, 0);
  assert.deepEqual(empty.relatedObjectIds, []);

  const overlay = buildOrganizationalResilienceOverlayState({
    signals: [{
      id: "organizational_resilience_stable_supplier",
      title: "Stable Resilience: supplier",
      summary: "Operational stability is holding across supplier.",
      resilienceState: "stable",
      relatedObjectIds: ["supplier"],
      resilienceScore: 0.58,
      createdAt: 0,
    }],
  });

  assert.equal(overlay.topSignalId, "organizational_resilience_stable_supplier");
  assert.equal(overlay.resilienceState, "stable");
});
