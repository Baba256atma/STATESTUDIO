import test from "node:test";
import assert from "node:assert/strict";

import {
  RelationshipInfluenceEngine,
  buildRelationshipInfluenceRegistry,
  calculateRelationshipInfluenceProfile,
  getRelationshipInfluenceRegistry,
  resetRelationshipInfluenceEngineForTests,
  resolveRelationshipInfluenceDirection,
  resolveRelationshipInfluenceLevel,
} from "./RelationshipInfluenceEngine.ts";
import {
  RELATIONSHIP_INFLUENCE_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_INFLUENCE_UPDATED_DIAGNOSTIC,
} from "./relationshipInfluenceContract.ts";

test.beforeEach(() => {
  resetRelationshipInfluenceEngineForTests();
});

test("calculates relationship influence profile from explicit factors", () => {
  const profile = calculateRelationshipInfluenceProfile({
    id: "rel-influence",
    sourceId: "exec",
    targetId: "revenue",
    type: "influences",
    direction: "uni",
    metadata: {
      businessInfluence: 95,
      decisionInfluence: 88,
      dependencyInfluence: 82,
      confidence: 90,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  });

  assert.equal(profile?.relationshipId, "rel-influence");
  assert.equal(profile?.influenceScore, 89);
  assert.equal(profile?.influenceLevel, "Critical");
  assert.equal(profile?.influenceDirection, "source-to-target");
  assert.equal(profile?.influenceFactors.businessInfluence, 95);
  assert.equal(profile?.influenceFactors.decisionInfluence, 88);
  assert.equal(profile?.influenceFactors.dependencyInfluence, 82);
  assert.equal(profile?.influenceFactors.confidence, 90);
  assert.equal(profile?.influenceReasoning.length, 3);
  assert.equal(Object.isFrozen(profile), true);
});

test("maps relationship influence thresholds and directions", () => {
  assert.equal(resolveRelationshipInfluenceLevel(90), "Critical");
  assert.equal(resolveRelationshipInfluenceLevel(65), "High");
  assert.equal(resolveRelationshipInfluenceLevel(40), "Moderate");
  assert.equal(resolveRelationshipInfluenceLevel(39), "Low");
  assert.equal(resolveRelationshipInfluenceDirection({ direction: "bi" }, 80), "bidirectional");
  assert.equal(resolveRelationshipInfluenceDirection({ direction: "reverse" }, 80), "target-to-source");
  assert.equal(resolveRelationshipInfluenceDirection({ direction: "uni" }, 10), "neutral");
});

test("derives influence from scene objects and relationship type", () => {
  const registry = buildRelationshipInfluenceRegistry({
    sceneJson: {
      scene: {
        objects: [
          { id: "exec", role: "executive", tags: ["governance"] },
          { id: "revenue", category: "revenue", dependencies: ["pipeline", "pricing"] },
        ],
        relationships: [
          {
            id: "rel-derived",
            sourceId: "exec",
            targetId: "revenue",
            type: "supports",
            direction: "bi",
            metadata: { confidence: 85 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  });

  const profile = registry.influenceByRelationshipId["rel-derived"];
  assert.equal(profile?.influenceDirection, "bidirectional");
  assert.equal(profile?.influenceLevel, "High");
  assert.equal(profile?.influenceFactors.decisionInfluence, 78);
});

test("builds immutable relationship influence registry with diagnostics", () => {
  const registry = buildRelationshipInfluenceRegistry({
    relationships: [
      {
        id: "rel-low",
        sourceId: "a",
        targetId: "b",
        type: "custom",
        metadata: {
          businessInfluence: 20,
          decisionInfluence: 20,
          dependencyInfluence: 20,
          confidence: 30,
        },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  });

  assert.equal(registry.relationshipCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.routingMutation, false);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_INFLUENCE_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_INFLUENCE_UPDATED_DIAGNOSTIC), true);
  assert.equal(registry.influenceByRelationshipId["rel-low"]?.influenceLevel, "Low");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.influenceReasoning), true);
  assert.equal(getRelationshipInfluenceRegistry().relationshipCount, 1);
});

test("relationship influence engine does not mutate relationships or objects", () => {
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "a",
    targetId: "b",
    type: "influences",
    direction: "uni",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const source = { id: "a", role: "executive" };
  const target = { id: "b", dependencies: ["shared"] };
  const beforeRelationship = JSON.stringify(relationship);
  const beforeSource = JSON.stringify(source);
  const beforeTarget = JSON.stringify(target);

  const registry = RelationshipInfluenceEngine.buildRelationshipInfluenceRegistry({
    relationships: [relationship],
    objects: [source, target],
  });

  assert.equal(JSON.stringify(relationship), beforeRelationship);
  assert.equal(JSON.stringify(source), beforeSource);
  assert.equal(JSON.stringify(target), beforeTarget);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "influenceScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "influenceScore"), false);
  assert.equal(registry.influenceByRelationshipId["rel-1"]?.influenceDirection, "source-to-target");
});
