import test from "node:test";
import assert from "node:assert/strict";

import {
  ObjectHealthEngine,
  buildObjectHealthRegistry,
  calculateObjectHealth,
  getObjectHealthRegistry,
  resetObjectHealthEngineForTests,
  resolveObjectHealthState,
} from "./ObjectHealthEngine.ts";
import {
  OBJECT_HEALTH_ENGINE_DIAGNOSTIC,
  OBJECT_HEALTH_UPDATED_DIAGNOSTIC,
} from "./objectHealthContract.ts";

test.beforeEach(() => {
  resetObjectHealthEngineForTests();
});

test("calculates 0-100 health score and Healthy state from operational factors", () => {
  const result = calculateObjectHealth({
    id: "supplier-1",
    label: "Supplier 1",
    type: "supplier",
    position: [0, 0, 0],
    activityLevel: 95,
    relationshipStability: 90,
    sourceConfidence: 92,
  });

  assert.equal(result?.healthScore, 95);
  assert.equal(result?.healthState, "Healthy");
  assert.equal(result?.factors.dataCompleteness, 100);
  assert.equal(result?.factors.activityLevel, 95);
  assert.equal(result?.factors.relationshipStability, 90);
  assert.equal(result?.factors.sourceConfidence, 92);
});

test("maps health score thresholds to states", () => {
  assert.equal(resolveObjectHealthState(90), "Healthy");
  assert.equal(resolveObjectHealthState(70), "Stable");
  assert.equal(resolveObjectHealthState(45), "Warning");
  assert.equal(resolveObjectHealthState(44), "Critical");
});

test("creates immutable health registry with diagnostics", () => {
  const registry = buildObjectHealthRegistry({
    sceneObjects: [
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        confidence: 75,
        activityLevel: 68,
        relationships: [{ status: "stable", confidence: 80 }],
      },
    ],
  });

  assert.equal(registry.objectCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(OBJECT_HEALTH_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_HEALTH_UPDATED_DIAGNOSTIC), true);
  assert.equal(typeof registry.healthByObjectId["inventory-1"]?.healthScore, "number");
  assert.equal(registry.healthByObjectId["inventory-1"]?.healthState, "Stable");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.objects), true);
  assert.equal(Object.isFrozen(registry.objects[0]), true);
  assert.equal(getObjectHealthRegistry().objectCount, 1);
});

test("critical state responds to poor completeness, inactive object, unstable relationships, and low confidence", () => {
  const registry = buildObjectHealthRegistry({
    sceneObjects: [
      {
        id: "fragile-1",
        active: false,
        relationships: [{ status: "broken", confidence: 20 }],
        sourceConfidence: 15,
      },
    ],
  });

  const health = registry.healthByObjectId["fragile-1"];
  assert.equal(health?.healthState, "Critical");
  assert.equal((health?.healthScore ?? 101) < 45, true);
});

test("health computation does not mutate source objects", () => {
  const source: Record<string, unknown> = {
    id: "revenue-1",
    label: "Revenue",
    type: "revenue",
  };
  const before = JSON.stringify(source);

  const registry = ObjectHealthEngine.buildObjectHealthRegistry({ sceneObjects: [source] });

  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "healthScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "healthState"), false);
  assert.equal(registry.healthByObjectId["revenue-1"]?.healthState, "Stable");
});
