import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRelationshipIntelligenceRegistry,
  createRelationshipIntelligenceProfile,
  getRelationshipIntelligenceRegistry,
  resetRelationshipIntelligenceRuntimeForTests,
} from "./RelationshipIntelligenceRuntime.ts";
import {
  RELATIONSHIP_INTELLIGENCE_READY_DIAGNOSTIC,
  RELATIONSHIP_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
  type RelationshipWithIntelligence,
} from "./relationshipIntelligenceContract.ts";
import type { NexoraRelationship } from "../relationships/relationshipTypes.ts";

test.beforeEach(() => {
  resetRelationshipIntelligenceRuntimeForTests();
});

test("creates relationship intelligence profile with canonical fields", () => {
  const profile = createRelationshipIntelligenceProfile({
    id: "rel-1",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    type: "dependency",
    direction: "uni",
    metadata: {
      strength: 0.82,
      dependency: 91,
      influence: "high",
      confidence: 0.88,
      riskExposure: "medium",
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  });

  assert.equal(profile?.relationshipId, "rel-1");
  assert.equal(profile?.sourceId, "supplier-1");
  assert.equal(profile?.targetId, "inventory-1");
  assert.equal(profile?.relationshipType, "dependency");
  assert.equal(profile?.strength, 82);
  assert.equal(profile?.dependency, 91);
  assert.equal(profile?.influence, 90);
  assert.equal(profile?.confidence, 88);
  assert.equal(profile?.riskExposure, 60);
  assert.equal(Object.isFrozen(profile), true);
});

test("builds immutable relationship intelligence registry from scene relationships", () => {
  const registry = buildRelationshipIntelligenceRegistry({
    sceneJson: {
      scene: {
        relationships: [
          {
            id: "rel-supply",
            sourceId: "supplier-1",
            targetId: "inventory-1",
            type: "supplies",
            direction: "uni",
            metadata: { confidence: 75 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
          {
            id: "rel-risk",
            sourceId: "inventory-1",
            targetId: "production-1",
            type: "blocks",
            direction: "bi",
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
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_INTELLIGENCE_RUNTIME_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_INTELLIGENCE_READY_DIAGNOSTIC), true);
  assert.equal(registry.profileByRelationshipId["rel-risk"]?.riskExposure, 90);
  assert.equal(registry.profileByRelationshipId["rel-supply"]?.confidence, 75);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(getRelationshipIntelligenceRegistry().relationshipCount, 2);
});

test("relationship intelligence is read-only and does not mutate scene or relationship objects", () => {
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "a",
    targetId: "b",
    type: "influences",
    direction: "bi",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const scene = { scene: { relationships: [relationship] } };
  const beforeRelationship = JSON.stringify(relationship);
  const beforeScene = JSON.stringify(scene);

  const registry = buildRelationshipIntelligenceRegistry({ sceneJson: scene });

  assert.equal(JSON.stringify(relationship), beforeRelationship);
  assert.equal(JSON.stringify(scene), beforeScene);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "strength"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "riskExposure"), false);
  assert.equal(registry.profileByRelationshipId["rel-1"]?.influence, 88);
});

test("supports an extended relationship read-model without changing persisted contract", () => {
  const base: NexoraRelationship = {
    id: "rel-1",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    type: "dependency",
    direction: "uni",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const profile = createRelationshipIntelligenceProfile(base)!;
  const extended: RelationshipWithIntelligence<NexoraRelationship> = {
    ...base,
    ...profile,
  };

  assert.equal(extended.strength, 72);
  assert.equal(extended.dependency, 85);
  assert.equal(extended.confidence, 70);
});
