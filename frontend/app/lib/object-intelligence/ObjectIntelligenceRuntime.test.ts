import test from "node:test";
import assert from "node:assert/strict";

import type { ExecutiveSceneObject } from "../sceneTypes.ts";
import {
  buildObjectIntelligenceRegistry,
  getObjectIntelligenceRegistry,
  resetObjectIntelligenceRuntimeForTests,
} from "./ObjectIntelligenceRuntime.ts";
import {
  OBJECT_INTELLIGENCE_PROFILE_CREATED_DIAGNOSTIC,
  OBJECT_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
} from "./objectIntelligenceContract.ts";

test.beforeEach(() => {
  resetObjectIntelligenceRuntimeForTests();
});

test("creates immutable object intelligence registry from scene objects", () => {
  const sceneObject = {
    id: "supplier-1",
    label: "Supplier 1",
    type: "supplier",
    health: 72,
    impact: 88,
    confidence: 91,
    importance: 77,
    trend: "improving",
  };

  const registry = buildObjectIntelligenceRegistry({
    sceneJson: {
      scene: {
        objects: [sceneObject],
      },
    },
  });

  assert.equal(registry.objectCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(OBJECT_INTELLIGENCE_RUNTIME_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_INTELLIGENCE_PROFILE_CREATED_DIAGNOSTIC), true);
  assert.equal(registry.profileByObjectId["supplier-1"]?.health, 72);
  assert.equal(registry.profileByObjectId["supplier-1"]?.impact, 88);
  assert.equal(registry.profileByObjectId["supplier-1"]?.confidence, 91);
  assert.equal(registry.profileByObjectId["supplier-1"]?.importance, 77);
  assert.equal(registry.profileByObjectId["supplier-1"]?.trend, "improving");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
});

test("does not mutate source scene objects", () => {
  const source: Record<string, unknown> = {
    id: "inventory-1",
    label: "Inventory",
    type: "inventory",
  };
  const before = JSON.stringify(source);

  const registry = buildObjectIntelligenceRegistry({ sceneObjects: [source] });

  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "health"), false);
  assert.equal(registry.profileByObjectId["inventory-1"]?.health, 75);
});

test("supports canonical ExecutiveSceneObject intelligence fields", () => {
  const executiveObject: ExecutiveSceneObject = {
    id: "revenue-1",
    label: "Revenue",
    type: "revenue",
    objectId: "revenue-1",
    objectType: "revenue",
    source: "scene",
    health: 80,
    impact: 70,
    confidence: 85,
    importance: 92,
    trend: "stable",
    healthScore: 80,
    healthState: "Stable",
    factors: {
      dataCompleteness: 100,
      activityLevel: 80,
      relationshipStability: 70,
      sourceConfidence: 85,
    },
    impactScore: 75,
    impactLevel: "High",
    impactFactors: {
      relationshipCount: 72,
      connectedKpis: 80,
      connectedRisks: 60,
      businessDependency: 88,
    },
    confidenceScore: 82,
    confidenceExplanation: "Confidence is 82% with solid support.",
    confidenceReasoning: ["Data quality is solid."],
    confidenceFactors: {
      dataQuality: 80,
      dataFreshness: 84,
      sourceReliability: 82,
      relationshipCertainty: 80,
    },
    trendDirection: "Stable",
    trendStrength: 80,
    trendEvidence: [78, 80, 79],
    trendReasoning: ["Trend direction is Stable."],
    importanceScore: 86,
    importanceLevel: "Strategic",
    importanceFactors: {
      businessInfluence: 88,
      executiveRelevance: 90,
      dependencyWeight: 80,
      topologyCentrality: 84,
    },
    importanceReasoning: ["Importance level is Strategic."],
  };

  const registry = buildObjectIntelligenceRegistry({ sceneObjects: [executiveObject] });

  assert.equal(registry.profileByObjectId["revenue-1"]?.importance, 92);
  assert.equal(getObjectIntelligenceRegistry().objectCount, 1);
});
