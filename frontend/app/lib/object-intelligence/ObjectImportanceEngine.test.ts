import test from "node:test";
import assert from "node:assert/strict";

import {
  ObjectImportanceEngine,
  buildObjectImportanceRegistry,
  calculateObjectImportance,
  getObjectImportanceRegistry,
  resetObjectImportanceEngineForTests,
  resolveObjectImportanceLevel,
} from "./ObjectImportanceEngine.ts";
import {
  OBJECT_IMPORTANCE_ENGINE_DIAGNOSTIC,
  OBJECT_IMPORTANCE_UPDATED_DIAGNOSTIC,
} from "./objectImportanceContract.ts";

test.beforeEach(() => {
  resetObjectImportanceEngineForTests();
});

test("calculates strategic importance profile from business and topology factors", () => {
  const profile = calculateObjectImportance({
    id: "supplier-1",
    businessInfluence: 92,
    executiveRelevance: 95,
    dependencyWeight: 88,
    topologyCentrality: 90,
  });

  assert.equal(profile?.importanceScore, 91);
  assert.equal(profile?.importanceLevel, "Strategic");
  assert.equal(profile?.importanceFactors.businessInfluence, 92);
  assert.equal(profile?.importanceFactors.executiveRelevance, 95);
  assert.equal(profile?.importanceFactors.dependencyWeight, 88);
  assert.equal(profile?.importanceFactors.topologyCentrality, 90);
  assert.equal(profile?.importanceReasoning.length, 3);
});

test("maps importance score thresholds to levels", () => {
  assert.equal(resolveObjectImportanceLevel(90), "Strategic");
  assert.equal(resolveObjectImportanceLevel(65), "Important");
  assert.equal(resolveObjectImportanceLevel(40), "Relevant");
  assert.equal(resolveObjectImportanceLevel(39), "Minor");
});

test("derives factors from object metadata when explicit scores are absent", () => {
  const profile = calculateObjectImportance({
    id: "hub-1",
    role: "Executive Hub",
    business_meaning: "Coordinates enterprise recovery.",
    kpis: ["revenue", "margin"],
    dependencies: ["supplier-1", "inventory-1"],
    dependents: ["production-1"],
    connections: [{}, {}],
  });

  assert.equal(profile?.importanceLevel, "Important");
  assert.equal(profile?.importanceFactors.businessInfluence, 85);
  assert.equal(profile?.importanceFactors.executiveRelevance, 95);
  assert.equal(profile?.importanceFactors.dependencyWeight, 66);
  assert.equal(profile?.importanceFactors.topologyCentrality, 66);
});

test("creates immutable importance registry with diagnostics", () => {
  const registry = buildObjectImportanceRegistry({
    sceneObjects: [
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        businessInfluence: 70,
        executiveRelevance: 55,
        dependencyWeight: 75,
        topologyCentrality: 60,
      },
    ],
  });

  assert.equal(registry.objectCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(OBJECT_IMPORTANCE_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_IMPORTANCE_UPDATED_DIAGNOSTIC), true);
  assert.equal(registry.importanceByObjectId["inventory-1"]?.importanceScore, 66);
  assert.equal(registry.importanceByObjectId["inventory-1"]?.importanceLevel, "Important");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.importanceReasoning), true);
  assert.equal(getObjectImportanceRegistry().objectCount, 1);
});

test("minor object remains minor when disconnected and low relevance", () => {
  const registry = buildObjectImportanceRegistry({
    sceneObjects: [{ id: "note-1", label: "Reference Note", type: "annotation" }],
  });

  const importance = registry.importanceByObjectId["note-1"];
  assert.equal(importance?.importanceLevel, "Minor");
  assert.equal((importance?.importanceScore ?? 101) < 40, true);
});

test("importance computation does not mutate source objects", () => {
  const source: Record<string, unknown> = {
    id: "revenue-1",
    label: "Revenue",
    type: "revenue",
    businessInfluence: 80,
  };
  const before = JSON.stringify(source);

  const registry = ObjectImportanceEngine.buildObjectImportanceRegistry({ sceneObjects: [source] });

  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "importanceScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "importanceLevel"), false);
  assert.equal(registry.importanceByObjectId["revenue-1"]?.importanceLevel, "Minor");
});
