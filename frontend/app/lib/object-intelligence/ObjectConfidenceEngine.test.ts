import test from "node:test";
import assert from "node:assert/strict";

import {
  ObjectConfidenceEngine,
  buildObjectConfidenceRegistry,
  calculateObjectConfidence,
  getObjectConfidenceRegistry,
  resetObjectConfidenceEngineForTests,
} from "./ObjectConfidenceEngine.ts";
import {
  OBJECT_CONFIDENCE_ENGINE_DIAGNOSTIC,
  OBJECT_CONFIDENCE_UPDATED_DIAGNOSTIC,
} from "./objectConfidenceContract.ts";

test.beforeEach(() => {
  resetObjectConfidenceEngineForTests();
});

test("calculates 0-100 confidence score with explanation and reasoning", () => {
  const result = calculateObjectConfidence({
    id: "supplier-1",
    label: "Supplier 1",
    type: "supplier",
    semantic: { role: "supplier" },
    dataFreshness: 90,
    sourceReliability: 85,
    relationships: [{ confidence: 80 }, { confidence: 90 }],
  });

  assert.equal(result?.confidenceScore, 91);
  assert.equal(result?.confidenceFactors.dataQuality, 100);
  assert.equal(result?.confidenceFactors.dataFreshness, 90);
  assert.equal(result?.confidenceFactors.sourceReliability, 85);
  assert.equal(result?.confidenceFactors.relationshipCertainty, 85);
  assert.equal(result?.confidenceExplanation.includes("Confidence is 91%"), true);
  assert.equal(result?.confidenceReasoning.length, 4);
});

test("creates immutable confidence registry with diagnostics", () => {
  const registry = buildObjectConfidenceRegistry({
    sceneObjects: [
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        dataQuality: 75,
        dataFreshness: 65,
        sourceReliability: 80,
        relationshipCertainty: 70,
      },
    ],
  });

  assert.equal(registry.objectCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(OBJECT_CONFIDENCE_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_CONFIDENCE_UPDATED_DIAGNOSTIC), true);
  assert.equal(registry.confidenceByObjectId["inventory-1"]?.confidenceScore, 73);
  assert.equal(typeof registry.confidenceByObjectId["inventory-1"]?.confidenceExplanation, "string");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.objects), true);
  assert.equal(Object.isFrozen(registry.objects[0]), true);
  assert.equal(Object.isFrozen(registry.objects[0]?.confidenceReasoning), true);
  assert.equal(getObjectConfidenceRegistry().objectCount, 1);
});

test("low confidence reflects weak quality, stale data, unreliable source, and uncertain relationships", () => {
  const registry = buildObjectConfidenceRegistry({
    sceneObjects: [
      {
        id: "fragile-1",
        dataQuality: 20,
        dataFreshness: 20,
        sourceReliability: 25,
        relationships: [{ confidence: 15 }],
      },
    ],
  });

  const confidence = registry.confidenceByObjectId["fragile-1"];
  assert.equal(confidence?.confidenceScore, 20);
  assert.equal(confidence?.confidenceExplanation.includes("weakest factor"), true);
});

test("confidence computation does not mutate source objects", () => {
  const source: Record<string, unknown> = {
    id: "revenue-1",
    label: "Revenue",
    type: "revenue",
  };
  const before = JSON.stringify(source);

  const registry = ObjectConfidenceEngine.buildObjectConfidenceRegistry({ sceneObjects: [source] });

  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "confidenceScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "confidenceExplanation"), false);
  assert.equal(registry.confidenceByObjectId["revenue-1"]?.confidenceScore, 69);
});
