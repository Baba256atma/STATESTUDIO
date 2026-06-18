import test from "node:test";
import assert from "node:assert/strict";

import {
  RelationshipStrengthEngine,
  buildRelationshipStrengthRegistry,
  calculateRelationshipStrengthProfile,
  getRelationshipStrengthRegistry,
  resetRelationshipStrengthEngineForTests,
  resolveRelationshipStrengthLevel,
} from "./RelationshipStrengthEngine.ts";
import {
  RELATIONSHIP_STRENGTH_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_STRENGTH_UPDATED_DIAGNOSTIC,
} from "./relationshipStrengthContract.ts";

test.beforeEach(() => {
  resetRelationshipStrengthEngineForTests();
});

test("calculates relationship strength profile from explicit factors", () => {
  const profile = calculateRelationshipStrengthProfile({
    id: "rel-1",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    type: "dependency",
    metadata: {
      interactionFrequency: 95,
      sharedDependencies: 80,
      relationshipHistory: 88,
      dataConfidence: 90,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  });

  assert.equal(profile?.relationshipId, "rel-1");
  assert.equal(profile?.strengthScore, 89);
  assert.equal(profile?.strengthLevel, "Critical");
  assert.equal(profile?.strengthFactors.interactionFrequency, 95);
  assert.equal(profile?.strengthFactors.sharedDependencies, 80);
  assert.equal(profile?.strengthFactors.relationshipHistory, 88);
  assert.equal(profile?.strengthFactors.dataConfidence, 90);
  assert.equal(profile?.strengthReasoning.length, 3);
  assert.equal(Object.isFrozen(profile), true);
});

test("maps relationship strength score thresholds to levels", () => {
  assert.equal(resolveRelationshipStrengthLevel(90), "Critical");
  assert.equal(resolveRelationshipStrengthLevel(65), "Strong");
  assert.equal(resolveRelationshipStrengthLevel(40), "Moderate");
  assert.equal(resolveRelationshipStrengthLevel(39), "Weak");
});

test("derives shared dependencies from scene objects", () => {
  const registry = buildRelationshipStrengthRegistry({
    sceneJson: {
      scene: {
        objects: [
          { id: "supplier-1", dependencies: ["fuel", "port", "labor"] },
          { id: "inventory-1", dependencies: ["port", "labor", "warehouse"] },
        ],
        relationships: [
          {
            id: "rel-shared",
            sourceId: "supplier-1",
            targetId: "inventory-1",
            type: "supplies",
            direction: "uni",
            metadata: { dataConfidence: 85, relationshipHistory: 70 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  });

  const profile = registry.strengthByRelationshipId["rel-shared"];
  assert.equal(profile?.strengthFactors.sharedDependencies, 50);
  assert.equal(profile?.strengthLevel, "Strong");
});

test("builds immutable relationship strength registry with diagnostics", () => {
  const registry = buildRelationshipStrengthRegistry({
    relationships: [
      {
        id: "rel-low",
        sourceId: "a",
        targetId: "b",
        type: "custom",
        metadata: {
          interactionFrequency: 20,
          sharedDependencies: 10,
          relationshipHistory: 30,
          dataConfidence: 35,
        },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  });

  assert.equal(registry.relationshipCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.routingMutation, false);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_STRENGTH_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_STRENGTH_UPDATED_DIAGNOSTIC), true);
  assert.equal(registry.strengthByRelationshipId["rel-low"]?.strengthLevel, "Weak");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.strengthReasoning), true);
  assert.equal(getRelationshipStrengthRegistry().relationshipCount, 1);
});

test("relationship strength engine does not mutate relationships or objects", () => {
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "a",
    targetId: "b",
    type: "dependency",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const source = { id: "a", dependencies: ["shared"] };
  const target = { id: "b", dependencies: ["shared"] };
  const beforeRelationship = JSON.stringify(relationship);
  const beforeSource = JSON.stringify(source);
  const beforeTarget = JSON.stringify(target);

  const registry = RelationshipStrengthEngine.buildRelationshipStrengthRegistry({
    relationships: [relationship],
    objects: [source, target],
  });

  assert.equal(JSON.stringify(relationship), beforeRelationship);
  assert.equal(JSON.stringify(source), beforeSource);
  assert.equal(JSON.stringify(target), beforeTarget);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "strengthScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "strengthScore"), false);
  assert.equal(registry.strengthByRelationshipId["rel-1"]?.strengthFactors.sharedDependencies, 25);
});
