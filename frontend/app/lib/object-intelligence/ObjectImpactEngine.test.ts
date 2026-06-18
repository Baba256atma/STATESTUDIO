import test from "node:test";
import assert from "node:assert/strict";

import {
  ObjectImpactEngine,
  buildObjectImpactRegistry,
  calculateObjectImpact,
  getObjectImpactRegistry,
  resetObjectImpactEngineForTests,
  resolveObjectImpactLevel,
} from "./ObjectImpactEngine.ts";
import {
  OBJECT_IMPACT_ENGINE_DIAGNOSTIC,
  OBJECT_IMPACT_UPDATED_DIAGNOSTIC,
} from "./objectImpactContract.ts";

test.beforeEach(() => {
  resetObjectImpactEngineForTests();
});

test("calculates 0-100 impact score and Critical level from business factors", () => {
  const result = calculateObjectImpact({
    id: "supplier-1",
    relationships: [{}, {}, {}, {}, {}],
    kpis: ["margin", "delivery", "quality", "revenue"],
    risks: ["supplier_failure", "delivery_slip", "quality_escape"],
    businessDependency: 95,
  });

  assert.equal(result?.impactScore, 94);
  assert.equal(result?.impactLevel, "Critical");
  assert.equal(result?.impactFactors.relationshipCount, 90);
  assert.equal(result?.impactFactors.connectedKpis, 100);
  assert.equal(result?.impactFactors.connectedRisks, 90);
  assert.equal(result?.impactFactors.businessDependency, 95);
});

test("maps impact score thresholds to levels", () => {
  assert.equal(resolveObjectImpactLevel(90), "Critical");
  assert.equal(resolveObjectImpactLevel(65), "High");
  assert.equal(resolveObjectImpactLevel(40), "Medium");
  assert.equal(resolveObjectImpactLevel(39), "Low");
});

test("creates immutable impact registry with diagnostics", () => {
  const registry = buildObjectImpactRegistry({
    sceneObjects: [
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        dependencies: ["supplier-1", "production-1"],
        connectedKpis: 75,
        connectedRisks: 55,
        businessDependency: 65,
      },
    ],
  });

  assert.equal(registry.objectCount, 1);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(OBJECT_IMPACT_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_IMPACT_UPDATED_DIAGNOSTIC), true);
  assert.equal(registry.impactByObjectId["inventory-1"]?.impactScore, 58);
  assert.equal(registry.impactByObjectId["inventory-1"]?.impactLevel, "Medium");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.objects), true);
  assert.equal(Object.isFrozen(registry.objects[0]), true);
  assert.equal(getObjectImpactRegistry().objectCount, 1);
});

test("low impact object remains low when disconnected from KPIs, risks, and dependencies", () => {
  const registry = buildObjectImpactRegistry({
    sceneObjects: [{ id: "note-1", label: "Reference Note", type: "annotation" }],
  });

  const impact = registry.impactByObjectId["note-1"];
  assert.equal(impact?.impactLevel, "Low");
  assert.equal((impact?.impactScore ?? 101) < 40, true);
});

test("impact computation does not mutate source objects", () => {
  const source: Record<string, unknown> = {
    id: "revenue-1",
    label: "Revenue",
    type: "revenue",
    kpis: ["revenue"],
  };
  const before = JSON.stringify(source);

  const registry = ObjectImpactEngine.buildObjectImpactRegistry({ sceneObjects: [source] });

  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "impactScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "impactLevel"), false);
  assert.equal(registry.impactByObjectId["revenue-1"]?.impactLevel, "Low");
});
