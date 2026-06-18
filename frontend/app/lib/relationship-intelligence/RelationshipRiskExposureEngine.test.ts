import test from "node:test";
import assert from "node:assert/strict";

import {
  RelationshipRiskExposureEngine,
  buildRelationshipRiskExposureRegistry,
  calculateRelationshipRiskExposureProfile,
  getRelationshipRiskExposureRegistry,
  resetRelationshipRiskExposureEngineForTests,
  resolveRelationshipRiskExposureLevel,
} from "./RelationshipRiskExposureEngine.ts";
import {
  RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC,
} from "./relationshipRiskExposureContract.ts";

test.beforeEach(() => {
  resetRelationshipRiskExposureEngineForTests();
});

test("calculates relationship risk exposure profile from explicit factors", () => {
  const profile = calculateRelationshipRiskExposureProfile({
    id: "rel-1",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    type: "supplies",
    metadata: {
      operationalRisk: 90,
      financialRisk: 75,
      supplyRisk: 95,
      executionRisk: 80,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  });

  assert.equal(profile?.riskExposureScore, 87);
  assert.equal(profile?.riskExposureLevel, "Critical");
  assert.deepEqual(profile?.riskTypes, [
    "Operational Risk",
    "Financial Risk",
    "Supply Risk",
    "Execution Risk",
  ]);
  assert.equal(profile?.riskExposureFactors.operationalRisk, 90);
  assert.equal(profile?.riskExposureFactors.financialRisk, 75);
  assert.equal(profile?.riskExposureFactors.supplyRisk, 95);
  assert.equal(profile?.riskExposureFactors.executionRisk, 80);
  assert.equal(Object.isFrozen(profile), true);
});

test("maps risk exposure thresholds to levels", () => {
  assert.equal(resolveRelationshipRiskExposureLevel(90), "Critical");
  assert.equal(resolveRelationshipRiskExposureLevel(65), "High");
  assert.equal(resolveRelationshipRiskExposureLevel(40), "Medium");
  assert.equal(resolveRelationshipRiskExposureLevel(39), "Low");
});

test("detects risk types from relationship and connected object metadata", () => {
  const registry = buildRelationshipRiskExposureRegistry({
    sceneJson: {
      scene: {
        objects: [
          { id: "supplier-1", tags: ["supplier"], risk_kind: "supply" },
          { id: "revenue-1", tags: ["revenue", "delivery"], category: "financial" },
        ],
        relationships: [
          {
            id: "rel-derived",
            sourceId: "supplier-1",
            targetId: "revenue-1",
            type: "blocks",
            direction: "uni",
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  });

  const profile = registry.riskExposureByRelationshipId["rel-derived"];
  assert.equal(profile?.riskExposureLevel, "High");
  assert.equal(profile?.riskTypes.includes("Supply Risk"), true);
  assert.equal(profile?.riskTypes.includes("Financial Risk"), true);
  assert.equal(profile?.riskTypes.includes("Execution Risk"), true);
});

test("builds immutable risk exposure registry with diagnostics", () => {
  const registry = buildRelationshipRiskExposureRegistry({
    relationships: [
      {
        id: "rel-low",
        sourceId: "a",
        targetId: "b",
        type: "information",
        metadata: {
          operationalRisk: 20,
          financialRisk: 30,
          supplyRisk: 15,
          executionRisk: 25,
        },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  });

  assert.equal(registry.relationshipCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.routingMutation, false);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC), true);
  assert.equal(registry.riskExposureByRelationshipId["rel-low"]?.riskExposureLevel, "Low");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.riskTypes), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.riskExposureReasoning), true);
  assert.equal(getRelationshipRiskExposureRegistry().relationshipCount, 1);
});

test("risk exposure engine does not mutate relationships or objects", () => {
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "a",
    targetId: "b",
    type: "dependency",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const source = { id: "a", tags: ["supplier"] };
  const target = { id: "b", tags: ["inventory"] };
  const beforeRelationship = JSON.stringify(relationship);
  const beforeSource = JSON.stringify(source);
  const beforeTarget = JSON.stringify(target);

  const registry = RelationshipRiskExposureEngine.buildRelationshipRiskExposureRegistry({
    relationships: [relationship],
    objects: [source, target],
  });

  assert.equal(JSON.stringify(relationship), beforeRelationship);
  assert.equal(JSON.stringify(source), beforeSource);
  assert.equal(JSON.stringify(target), beforeTarget);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "riskExposureScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "riskExposureScore"), false);
  assert.equal(registry.riskExposureByRelationshipId["rel-1"]?.riskTypes.includes("Supply Risk"), true);
});
