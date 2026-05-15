import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStrategicInterventionOverlayState,
  deriveStrategicInterventions,
} from "./deriveStrategicInterventions.ts";
import { buildStabilizationPathway } from "./buildStabilizationPathway.ts";

const zone = {
  id: "zone_supplier",
  title: "Critical corridor",
  summary: "Supplier corridor.",
  zoneType: "critical_corridor" as const,
  relatedObjectIds: ["supplier", "inventory", "delivery"],
  propagationIntensity: 0.86,
  fragilityScore: 78,
  systemicReach: 0.74,
  confidence: 0.82,
  domainIds: ["supply_chain", "retail"],
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
  confidence: 0.84,
  priority: "critical" as const,
  domainId: "supply_chain",
  createdAt: 0,
};

test("derives prioritized strategic interventions from fragility and recommendation evidence", () => {
  const interventions = deriveStrategicInterventions({
    zones: [zone],
    recommendations: [recommendation],
    monitoringSignals: [{
      id: "monitor_supplier",
      title: "Supplier monitoring",
      summary: "Supplier pressure remains active.",
      relatedObjectIds: ["supplier", "inventory"],
      monitoringStatus: "elevated",
      trend: "degrading",
      confidence: 0.78,
      urgencyScore: 0.72,
      domainId: "supply_chain",
      createdAt: 0,
    }],
    decisionGraph: {
      id: "graph",
      nodes: [
        { id: "risk", type: "risk", title: "Risk", createdAt: 0 },
        { id: "recommendation", type: "recommendation", title: "Recommendation", createdAt: 0 },
        { id: "monitor", type: "monitoring", title: "Monitor", createdAt: 0 },
      ],
      edges: [
        { id: "e1", sourceNodeId: "risk", targetNodeId: "recommendation" },
        { id: "e2", sourceNodeId: "recommendation", targetNodeId: "monitor" },
      ],
      createdAt: 0,
    },
  });

  assert.ok(interventions.length > 0);
  assert.equal(interventions[0].priority === "critical" || interventions[0].priority === "high", true);
  assert.ok(interventions.some((item) => item.category === "contain_propagation"));
  assert.ok(interventions.some((item) => item.category === "diversify"));
  assert.equal(interventions.every((item) => item.createdAt === 0), true);
});

test("strategic interventions are deterministic and do not mutate input", () => {
  const input = {
    zones: [zone],
    recommendations: [recommendation],
  };
  const before = JSON.stringify(input);
  const first = deriveStrategicInterventions(input);
  const second = deriveStrategicInterventions(input);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
});

test("intervention overlay and stabilization pathway are passive guidance", () => {
  const interventions = deriveStrategicInterventions({
    zones: [zone],
    recommendations: [recommendation],
  });
  const overlay = buildStrategicInterventionOverlayState({ interventions });
  const pathway = buildStabilizationPathway({ interventions });
  const emptyOverlay = buildStrategicInterventionOverlayState({ interventions: [] });

  assert.equal(overlay.topInterventionId, interventions[0].id);
  assert.ok(overlay.relatedObjectIds.includes("supplier"));
  assert.ok(pathway.length <= 3);
  assert.equal(pathway[0].order, 1);
  assert.equal(emptyOverlay.priority, "low");
});
