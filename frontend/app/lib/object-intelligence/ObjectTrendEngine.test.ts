import test from "node:test";
import assert from "node:assert/strict";

import {
  ObjectTrendEngine,
  buildObjectTrendRegistry,
  calculateObjectTrendProfile,
  getObjectTrendRegistry,
  resetObjectTrendEngineForTests,
} from "./ObjectTrendEngine.ts";
import {
  OBJECT_TREND_ENGINE_DIAGNOSTIC,
  OBJECT_TREND_UPDATED_DIAGNOSTIC,
} from "./objectTrendContract.ts";

test.beforeEach(() => {
  resetObjectTrendEngineForTests();
});

test("detects improving trend from object health history", () => {
  const profile = calculateObjectTrendProfile("supplier-1", {
    objectHealthHistory: [
      { objectId: "supplier-1", timestamp: 1, healthScore: 55 },
      { objectId: "supplier-1", timestamp: 2, healthScore: 67 },
      { objectId: "supplier-1", timestamp: 3, healthScore: 82 },
    ],
  });

  assert.equal(profile.trendDirection, "Improving");
  assert.equal(profile.trendStrength, 59);
  assert.deepEqual(profile.trendEvidence, [55, 67, 82]);
});

test("detects declining, stable, and volatile profiles", () => {
  const declining = calculateObjectTrendProfile("risk-1", {
    historicalSnapshots: [
      { objectId: "risk-1", timestamp: 1, healthScore: 88 },
      { objectId: "risk-1", timestamp: 2, healthScore: 70 },
      { objectId: "risk-1", timestamp: 3, healthScore: 58 },
    ],
  });
  const stable = calculateObjectTrendProfile("stable-1", {
    historicalSnapshots: [
      { objectId: "stable-1", timestamp: 1, healthScore: 72 },
      { objectId: "stable-1", timestamp: 2, healthScore: 74 },
      { objectId: "stable-1", timestamp: 3, healthScore: 73 },
    ],
  });
  const volatile = calculateObjectTrendProfile("volatile-1", {
    historicalSnapshots: [
      { objectId: "volatile-1", timestamp: 1, healthScore: 35 },
      { objectId: "volatile-1", timestamp: 2, healthScore: 88 },
      { objectId: "volatile-1", timestamp: 3, healthScore: 42 },
    ],
  });

  assert.equal(declining.trendDirection, "Declining");
  assert.equal(stable.trendDirection, "Stable");
  assert.equal(volatile.trendDirection, "Volatile");
});

test("uses source updates when health history is unavailable", () => {
  const profile = calculateObjectTrendProfile("source-object-1", {
    sourceUpdates: [
      { objectId: "source-object-1", timestamp: 1, signal: "negative" },
      { objectId: "source-object-1", timestamp: 2, signal: "neutral" },
      { objectId: "source-object-1", timestamp: 3, signal: "positive" },
    ],
  });

  assert.equal(profile.trendDirection, "Improving");
  assert.deepEqual(profile.trendEvidence, [35, 55, 80]);
});

test("creates immutable trend registry with diagnostics", () => {
  const registry = buildObjectTrendRegistry({
    sceneObjects: [{ id: "inventory-1", label: "Inventory", type: "inventory" }],
    objectHealthHistory: [
      { objectId: "inventory-1", timestamp: 1, healthScore: 61 },
      { objectId: "inventory-1", timestamp: 2, healthScore: 65 },
      { objectId: "inventory-1", timestamp: 3, healthScore: 66 },
    ],
  });

  assert.equal(registry.objectCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(OBJECT_TREND_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_TREND_UPDATED_DIAGNOSTIC), true);
  assert.equal(registry.trendByObjectId["inventory-1"]?.trendDirection, "Stable");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.trendEvidence), true);
  assert.equal(Object.isFrozen(registry.profiles[0]?.trendReasoning), true);
  assert.equal(getObjectTrendRegistry().objectCount, 1);
});

test("trend computation does not mutate source objects", () => {
  const source: Record<string, unknown> = {
    id: "revenue-1",
    label: "Revenue",
    type: "revenue",
  };
  const before = JSON.stringify(source);

  const registry = ObjectTrendEngine.buildObjectTrendRegistry({ sceneObjects: [source] });

  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "trendDirection"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "trendStrength"), false);
  assert.equal(registry.trendByObjectId["revenue-1"]?.trendDirection, "Stable");
});
