import test from "node:test";
import assert from "node:assert/strict";

import {
  DependencyIntelligenceEngine,
  buildDependencyIntelligenceRegistry,
  calculateDependencyProfile,
  getDependencyIntelligenceRegistry,
  resetDependencyIntelligenceEngineForTests,
  resolveDependencyLevel,
} from "./DependencyIntelligenceEngine.ts";
import {
  DEPENDENCY_ENGINE_DIAGNOSTIC,
  DEPENDENCY_UPDATED_DIAGNOSTIC,
} from "./dependencyIntelligenceContract.ts";

test.beforeEach(() => {
  resetDependencyIntelligenceEngineForTests();
});

test("calculates dependency profile and detects single point of failure", () => {
  const profile = calculateDependencyProfile({
    id: "rel-1",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    type: "dependency",
    direction: "uni",
    metadata: {
      dependencyWeight: 95,
      directionCriticality: 88,
      redundancy: 10,
      continuityRisk: 90,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  });

  assert.equal(profile?.dependencyScore, 91);
  assert.equal(profile?.dependencyLevel, "Critical Dependency");
  assert.equal(profile?.singlePointOfFailure, true);
  assert.equal(profile?.dependencyFactors.dependencyWeight, 95);
  assert.equal(profile?.dependencyFactors.directionCriticality, 88);
  assert.equal(profile?.dependencyFactors.redundancy, 10);
  assert.equal(profile?.dependencyFactors.continuityRisk, 90);
  assert.equal(profile?.dependencyReasoning.some((entry) => entry.includes("Single point")), true);
  assert.equal(Object.isFrozen(profile), true);
});

test("maps dependency score thresholds to levels", () => {
  assert.equal(resolveDependencyLevel(90), "Critical Dependency");
  assert.equal(resolveDependencyLevel(65), "Highly Dependent");
  assert.equal(resolveDependencyLevel(40), "Dependent");
  assert.equal(resolveDependencyLevel(39), "Independent");
});

test("uses target object alternates as redundancy and avoids false SPoF", () => {
  const registry = buildDependencyIntelligenceRegistry({
    sceneJson: {
      scene: {
        objects: [
          { id: "supplier-1" },
          { id: "inventory-1", alternativeSourceIds: ["supplier-2", "supplier-3"] },
        ],
        relationships: [
          {
            id: "rel-redundant",
            sourceId: "supplier-1",
            targetId: "inventory-1",
            type: "supplies",
            direction: "uni",
            metadata: { dependencyWeight: 90, continuityRisk: 70 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  });

  const profile = registry.dependencyByRelationshipId["rel-redundant"];
  assert.equal(profile?.dependencyFactors.redundancy, 70);
  assert.equal(profile?.singlePointOfFailure, false);
});

test("builds immutable dependency registry with diagnostics", () => {
  const registry = buildDependencyIntelligenceRegistry({
    relationships: [
      {
        id: "rel-low",
        sourceId: "a",
        targetId: "b",
        type: "information",
        direction: "bi",
        metadata: {
          dependencyWeight: 20,
          directionCriticality: 30,
          redundancy: 90,
          continuityRisk: 20,
        },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  });

  assert.equal(registry.relationshipCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.routingMutation, false);
  assert.equal(registry.diagnostics.includes(DEPENDENCY_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(DEPENDENCY_UPDATED_DIAGNOSTIC), true);
  assert.equal(registry.dependencyByRelationshipId["rel-low"]?.dependencyLevel, "Independent");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.dependencyReasoning), true);
  assert.equal(getDependencyIntelligenceRegistry().relationshipCount, 1);
});

test("dependency engine does not mutate relationships or objects", () => {
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "a",
    targetId: "b",
    type: "dependency",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const source = { id: "a" };
  const target = { id: "b", alternativeSourceIds: ["c"] };
  const beforeRelationship = JSON.stringify(relationship);
  const beforeSource = JSON.stringify(source);
  const beforeTarget = JSON.stringify(target);

  const registry = DependencyIntelligenceEngine.buildDependencyIntelligenceRegistry({
    relationships: [relationship],
    objects: [source, target],
  });

  assert.equal(JSON.stringify(relationship), beforeRelationship);
  assert.equal(JSON.stringify(source), beforeSource);
  assert.equal(JSON.stringify(target), beforeTarget);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "dependencyScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(target, "singlePointOfFailure"), false);
  assert.equal(registry.dependencyByRelationshipId["rel-1"]?.dependencyFactors.redundancy, 35);
});
