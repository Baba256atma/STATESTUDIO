import test from "node:test";
import assert from "node:assert/strict";

import {
  RiskVisualizationContractRuntime,
  buildRiskVisualizationRegistry,
  getRiskVisualizationRegistry,
  resetRiskVisualizationContractForTests,
} from "./RiskVisualizationContractRuntime.ts";
import {
  EMPTY_RISK_VISUALIZATION_REGISTRY,
  RISK_VISUALIZATION_CONTRACT_DIAGNOSTIC,
  RISK_VISUALIZATION_READY_DIAGNOSTIC,
  type RiskVisualizationContract,
} from "./riskVisualizationContract.ts";

test.beforeEach(() => {
  resetRiskVisualizationContractForTests();
});

test("defines visualization-ready risk contract fields without rendering authority", () => {
  const entry: RiskVisualizationContract = Object.freeze({
    nodeId: "supplier-1",
    nodeKind: "object",
    label: "Primary Supplier",
    riskScore: 82,
    riskLevel: "High",
    riskPropagation: Object.freeze({
      chainId: "chain:supplier-1->inventory-1:supplier-1>rel-1>inventory-1",
      propagationScore: 76,
      sourceId: "supplier-1",
      targetId: "inventory-1",
      sourceKind: "object",
      targetKind: "object",
      role: "source",
    }),
    riskPriority: "prioritize",
  });

  assert.equal(entry.riskScore, 82);
  assert.equal(entry.riskLevel, "High");
  assert.equal(entry.riskPropagation?.propagationScore, 76);
  assert.equal(entry.riskPriority, "prioritize");
  assert.equal(Object.isFrozen(entry), true);
  assert.equal(Object.isFrozen(entry.riskPropagation), true);
});

test("publishes frozen empty visualization registry with diagnostics", () => {
  assert.equal(EMPTY_RISK_VISUALIZATION_REGISTRY.entryCount, 0);
  assert.equal(EMPTY_RISK_VISUALIZATION_REGISTRY.sceneMutation, false);
  assert.equal(EMPTY_RISK_VISUALIZATION_REGISTRY.dashboardMutation, false);
  assert.equal(EMPTY_RISK_VISUALIZATION_REGISTRY.renderingMutation, false);
  assert.equal(
    EMPTY_RISK_VISUALIZATION_REGISTRY.diagnostics.includes(RISK_VISUALIZATION_CONTRACT_DIAGNOSTIC),
    true
  );
  assert.equal(
    EMPTY_RISK_VISUALIZATION_REGISTRY.diagnostics.includes(RISK_VISUALIZATION_READY_DIAGNOSTIC),
    true
  );
  assert.equal(Object.isFrozen(EMPTY_RISK_VISUALIZATION_REGISTRY), true);
});

test("builds visualization registry publishing risk score level propagation and priority", () => {
  const registry = buildRiskVisualizationRegistry({
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
          { id: "inventory-1", label: "Inventory", type: "inventory", activityLevel: 55 },
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
        ],
        kpis: [
          {
            id: "schedule",
            label: "Schedule",
            objectId: "inventory-1",
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

  assert.equal(registry.entryCount > 0, true);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.renderingMutation, false);
  assert.equal(registry.diagnostics.includes(RISK_VISUALIZATION_CONTRACT_DIAGNOSTIC), true);

  const supplier = registry.entryByNodeId["supplier-1"];
  assert.equal(typeof supplier?.riskScore, "number");
  assert.equal(typeof supplier?.riskLevel, "string");
  assert.equal(typeof supplier?.riskPriority, "string");
  assert.equal(
    registry.entries.some((entry) => entry.riskPropagation != null),
    true
  );

  const relationship = registry.entryByNodeId["rel-supply"];
  assert.equal(relationship?.nodeKind, "relationship");
  assert.equal(typeof relationship?.riskScore, "number");

  assert.equal(Object.isFrozen(registry.entries), true);
  assert.equal(Object.isFrozen(registry.entries[0]), true);
  assert.equal(getRiskVisualizationRegistry().entryCount, registry.entryCount);
});

test("maps risk levels from scores", () => {
  assert.equal(RiskVisualizationContractRuntime.resolveRiskLevel(20), "Low");
  assert.equal(RiskVisualizationContractRuntime.resolveRiskLevel(45), "Medium");
  assert.equal(RiskVisualizationContractRuntime.resolveRiskLevel(70), "High");
  assert.equal(RiskVisualizationContractRuntime.resolveRiskLevel(90), "Critical");
});

test("visualization contract builder does not mutate source graph records", () => {
  const object: Record<string, unknown> = {
    id: "source-1",
    label: "Source",
    type: "supplier",
    active: false,
    sourceConfidence: 10,
  };
  const before = JSON.stringify(object);

  buildRiskVisualizationRegistry({
    objects: [object, { id: "target-1", label: "Target" }],
    relationships: [
      {
        id: "rel-1",
        sourceId: "source-1",
        targetId: "target-1",
        type: "dependency",
        metadata: { dependency: 90 },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  });

  assert.equal(JSON.stringify(object), before);
  assert.equal(Object.prototype.hasOwnProperty.call(object, "riskLevel"), false);
});
