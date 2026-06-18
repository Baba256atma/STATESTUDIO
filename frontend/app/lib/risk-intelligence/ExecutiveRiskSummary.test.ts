import test from "node:test";
import assert from "node:assert/strict";

import {
  ExecutiveRiskSummaryEngine,
  buildExecutiveRiskSummary,
  getExecutiveRiskSummary,
  resetExecutiveRiskSummaryForTests,
} from "./ExecutiveRiskSummary.ts";
import {
  EXEC_RISK_SUMMARY_DIAGNOSTIC,
  EXEC_RISK_SUMMARY_READY_DIAGNOSTIC,
} from "./executiveRiskSummaryContract.ts";

test.beforeEach(() => {
  resetExecutiveRiskSummaryForTests();
});

test("exports canonical executive risk summary diagnostics", () => {
  assert.equal(EXEC_RISK_SUMMARY_DIAGNOSTIC, "[EXEC_RISK_SUMMARY]");
  assert.equal(EXEC_RISK_SUMMARY_READY_DIAGNOSTIC, "[EXEC_RISK_SUMMARY_READY]");
});

test("returns empty executive risk summary for an empty graph", () => {
  const summary = buildExecutiveRiskSummary();

  assert.equal(summary.objectRiskCount, 0);
  assert.equal(summary.relationshipRiskCount, 0);
  assert.equal(summary.kpiRiskCount, 0);
  assert.equal(summary.topRisks.length, 0);
  assert.equal(summary.topRiskChains.length, 0);
  assert.equal(summary.topVulnerabilities.length, 0);
  assert.equal(summary.recommendedAttention.length, 0);
  assert.equal(Object.isFrozen(summary), true);
});

test("aggregates object relationship KPI and propagation risk intelligence", () => {
  const summary = buildExecutiveRiskSummary({
    sceneJson: {
      scene: {
        objects: [
          {
            id: "supplier-1",
            label: "Primary Supplier",
            type: "supplier",
            active: false,
            sourceConfidence: 15,
            relationships: [{ status: "broken", confidence: 20 }],
          },
          {
            id: "inventory-1",
            label: "Inventory",
            type: "inventory",
            activityLevel: 55,
          },
          {
            id: "production-1",
            label: "Production",
            type: "production",
            role: "executive",
            importance: 90,
            active: false,
            sourceConfidence: 20,
          },
        ],
        relationships: [
          {
            id: "rel-supply",
            sourceId: "supplier-1",
            targetId: "inventory-1",
            type: "supplies",
            direction: "uni",
            metadata: { supplyRisk: 85, dependency: 88, strength: 0.9, redundancy: 6 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
          {
            id: "rel-dependency",
            sourceId: "inventory-1",
            targetId: "production-1",
            type: "dependency",
            direction: "uni",
            metadata: { operationalRisk: 90, dependency: 92, redundancy: 8 },
            createdAt: "2026-01-02T00:00:00.000Z",
          },
        ],
        kpis: [
          {
            id: "schedule",
            label: "Schedule",
            objectId: "production-1",
            value: 42,
            target: 60,
            category: "Schedule",
            confidence: 55,
          },
        ],
        kpiSnapshots: [
          { kpiId: "schedule", value: 58, capturedAt: "2026-01-01T00:00:00.000Z" },
          { kpiId: "schedule", value: 50, capturedAt: "2026-02-01T00:00:00.000Z" },
          { kpiId: "schedule", value: 42, capturedAt: "2026-03-01T00:00:00.000Z" },
        ],
      },
    },
  });

  assert.equal(summary.objectRiskCount, 3);
  assert.equal(summary.relationshipRiskCount, 2);
  assert.equal(summary.kpiRiskCount, 1);
  assert.equal(summary.propagationScore >= 35, true);
  assert.equal(summary.topRisks.length > 0, true);
  assert.equal(summary.topRiskChains.length > 0, true);
  assert.equal(summary.topVulnerabilities.length > 0, true);
  assert.equal(summary.recommendedAttention.length > 0, true);
  assert.equal(summary.executiveSummary.includes("Executive risk intelligence covers"), true);
  assert.equal(summary.readOnly, true);
  assert.equal(summary.sceneMutation, false);
  assert.equal(summary.diagnostics.includes(EXEC_RISK_SUMMARY_DIAGNOSTIC), true);
  assert.equal(summary.diagnostics.includes(EXEC_RISK_SUMMARY_READY_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(summary.topRisks), true);
  assert.equal(Object.isFrozen(summary.profiles), true);
  assert.equal(getExecutiveRiskSummary().objectRiskCount, 3);
});

test("recommended attention prioritizes highest risk nodes and chains", () => {
  const summary = buildExecutiveRiskSummary({
    sceneJson: {
      scene: {
        objects: [
          {
            id: "supplier-1",
            label: "Supplier",
            type: "supplier",
            active: false,
            sourceConfidence: 10,
          },
          { id: "inventory-1", label: "Inventory", type: "inventory" },
        ],
        relationships: [
          {
            id: "rel-1",
            sourceId: "supplier-1",
            targetId: "inventory-1",
            type: "supplies",
            metadata: { supplyRisk: 90, dependency: 95, redundancy: 5, strength: 0.95 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  });

  const attention = summary.recommendedAttention;
  assert.equal(attention.length > 0, true);
  assert.equal(
    attention.some(
      (entry) =>
        entry.attentionLevel === "prioritize" ||
        entry.attentionLevel === "immediate" ||
        entry.attentionLevel === "review"
    ),
    true
  );
  assert.equal(
    attention.some((entry) => entry.nodeKind === "object" || entry.nodeKind === "relationship" || entry.nodeKind === "chain"),
    true
  );
});

test("executive risk summary does not mutate source graph records", () => {
  const object: Record<string, unknown> = {
    id: "source-1",
    label: "Source",
    type: "supplier",
    active: false,
    sourceConfidence: 10,
  };
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "source-1",
    targetId: "target-1",
    type: "dependency",
    metadata: { dependency: 90 },
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const beforeObject = JSON.stringify(object);
  const beforeRelationship = JSON.stringify(relationship);

  ExecutiveRiskSummaryEngine.buildExecutiveRiskSummary({
    objects: [object, { id: "target-1", label: "Target" }],
    relationships: [relationship],
  });

  assert.equal(JSON.stringify(object), beforeObject);
  assert.equal(JSON.stringify(relationship), beforeRelationship);
  assert.equal(Object.prototype.hasOwnProperty.call(object, "topRisks"), false);
});
