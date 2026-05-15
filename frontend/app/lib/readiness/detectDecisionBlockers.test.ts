import assert from "node:assert/strict";
import test from "node:test";
import { detectDecisionBlockers } from "./detectDecisionBlockers.ts";

test("decision blockers identify propagation coordination drift and confidence gaps", () => {
  const blockers = detectDecisionBlockers({
    relatedObjectIds: ["supplier", "delivery"],
    confidenceSignals: [{
      id: "confidence_low",
      confidenceLevel: "low",
      confidenceScore: 0.3,
      rationale: "Weak evidence.",
      uncertaintyFactors: ["Signals remain mixed"],
      createdAt: 0,
    }],
    fragilityZones: [{
      id: "zone_supplier",
      title: "Supplier corridor",
      summary: "Supplier pressure.",
      zoneType: "critical_corridor",
      relatedObjectIds: ["supplier", "delivery"],
      propagationIntensity: 0.82,
      fragilityScore: 84,
      systemicReach: 0.8,
      createdAt: 0,
    }],
    coordinationInsights: [{
      id: "coordination_supplier",
      title: "Coordination gap",
      summary: "Coordination pressure.",
      dependencyType: "cross_domain_sync",
      relatedObjectIds: ["supplier", "delivery"],
      coordinationComplexity: 0.72,
      synchronizationRisk: 0.68,
      createdAt: 0,
    }],
    driftSignals: [{
      id: "drift_supplier",
      title: "Supplier drift",
      summary: "Supplier drift.",
      driftType: "propagation_expansion",
      relatedObjectIds: ["supplier", "delivery"],
      driftIntensity: 0.7,
      createdAt: 0,
    }],
  });

  assert.ok(blockers.length >= 4);
  assert.equal(blockers[0].severity === "critical" || blockers[0].severity === "high", true);
  assert.ok(blockers.some((blocker) => blocker.label === "Unresolved propagation corridor"));
  assert.ok(blockers.some((blocker) => blocker.label === "Coordination readiness gap"));
});

test("decision blockers stay quiet when evidence is stable", () => {
  const blockers = detectDecisionBlockers({
    relatedObjectIds: ["supplier"],
    confidenceSignals: [{
      id: "confidence_high",
      confidenceLevel: "high",
      confidenceScore: 0.82,
      rationale: "Stable evidence.",
      createdAt: 0,
    }],
  });

  assert.deepEqual(blockers, []);
});
