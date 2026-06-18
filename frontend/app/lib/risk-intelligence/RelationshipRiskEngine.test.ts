import test from "node:test";
import assert from "node:assert/strict";

import { calculateDependencyProfile } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { calculateRelationshipInfluenceProfile } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { calculateRelationshipRiskExposureProfile } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";
import { calculateRelationshipStrengthProfile } from "../relationship-intelligence/RelationshipStrengthEngine.ts";
import {
  RelationshipRiskEngine,
  buildRelationshipRiskRegistry,
  calculateRelationshipRiskProfile,
  calculateRelationshipRiskProfileFromIntelligence,
  getRelationshipRiskRegistry,
  resetRelationshipRiskEngineForTests,
} from "./RelationshipRiskEngine.ts";
import {
  RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC,
} from "./relationshipRiskProfileContract.ts";

test.beforeEach(() => {
  resetRelationshipRiskEngineForTests();
});

test("exports canonical relationship risk diagnostics", () => {
  assert.equal(RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC, "[RELATIONSHIP_RISK_ENGINE]");
  assert.equal(RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC, "[RELATIONSHIP_RISK_UPDATED]");
});

test("generates relationship risk score from dependency influence exposure and strength", () => {
  const relationship = {
    id: "rel-1",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    type: "dependency",
    direction: "uni",
    metadata: {
      dependency: 88,
      influence: 82,
      operationalRisk: 70,
      supplyRisk: 75,
      strength: 0.86,
      confidence: 0.9,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  const profile = calculateRelationshipRiskProfile(relationship);

  assert.equal(profile?.relationshipId, "rel-1");
  assert.equal(typeof profile?.relationshipRiskScore, "number");
  assert.equal((profile?.relationshipRiskScore ?? -1) >= 0 && (profile?.relationshipRiskScore ?? 101) <= 100, true);
  assert.equal(typeof profile?.riskFactors.dependencyScore, "number");
  assert.equal(typeof profile?.riskFactors.influenceScore, "number");
  assert.equal(typeof profile?.riskFactors.riskExposureScore, "number");
  assert.equal(typeof profile?.riskFactors.strengthScore, "number");
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile?.riskFactors), true);
});

test("detects single point of failure and critical dependency", () => {
  const relationship = {
    id: "rel-spof",
    sourceId: "supplier-1",
    targetId: "production-1",
    type: "dependency",
    direction: "uni",
    metadata: {
      dependency: 95,
      redundancy: 10,
      continuityRisk: 90,
      operationalRisk: 88,
      supplyRisk: 92,
      influence: 90,
      strength: 0.92,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  const profile = calculateRelationshipRiskProfile(relationship);

  assert.equal(profile?.singlePointOfFailure, true);
  assert.equal(profile?.criticalDependency, true);
  assert.equal((profile?.relationshipRiskScore ?? 0) >= 75, true);
});

test("composes relationship risk profile from intelligence outputs", () => {
  const raw = {
    id: "rel-compose",
    sourceId: "a",
    targetId: "b",
    type: "supplies",
    direction: "uni",
    metadata: { confidence: 80 },
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const dependency = calculateDependencyProfile(raw)!;
  const influence = calculateRelationshipInfluenceProfile(raw)!;
  const riskExposure = calculateRelationshipRiskExposureProfile(raw)!;
  const strength = calculateRelationshipStrengthProfile(raw)!;

  const profile = calculateRelationshipRiskProfileFromIntelligence(
    dependency,
    influence,
    riskExposure,
    strength
  );

  assert.equal(profile.relationshipId, "rel-compose");
  assert.equal(profile.sourceId, "a");
  assert.equal(profile.targetId, "b");
  assert.equal(typeof profile.relationshipRiskScore, "number");
});

test("creates immutable relationship risk registry with diagnostics", () => {
  const registry = buildRelationshipRiskRegistry({
    sceneJson: {
      scene: {
        objects: [
          { id: "supplier-1", tags: ["supplier"], risk_kind: "supply" },
          { id: "inventory-1", type: "inventory" },
        ],
        relationships: [
          {
            id: "rel-supply",
            sourceId: "supplier-1",
            targetId: "inventory-1",
            type: "supplies",
            direction: "uni",
            metadata: { confidence: 75, supplyRisk: 80 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
          {
            id: "rel-block",
            sourceId: "inventory-1",
            targetId: "supplier-1",
            type: "blocks",
            direction: "bi",
            metadata: { operationalRisk: 90, dependency: 92, redundancy: 8 },
            createdAt: "2026-01-02T00:00:00.000Z",
          },
        ],
      },
    },
  });

  assert.equal(registry.relationshipCount, 2);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.routingMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC), true);
  assert.equal(typeof registry.riskByRelationshipId["rel-supply"]?.relationshipRiskScore, "number");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(getRelationshipRiskRegistry().relationshipCount, 2);
});

test("relationship risk computation does not mutate source relationships", () => {
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "a",
    targetId: "b",
    type: "dependency",
    direction: "uni",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const before = JSON.stringify(relationship);

  const registry = RelationshipRiskEngine.buildRelationshipRiskRegistry({
    relationships: [relationship],
  });

  assert.equal(JSON.stringify(relationship), before);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "relationshipRiskScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "singlePointOfFailure"), false);
  assert.equal(typeof registry.riskByRelationshipId["rel-1"]?.relationshipRiskScore, "number");
});
