import test from "node:test";
import assert from "node:assert/strict";

import { calculateObjectHealth } from "../object-intelligence/ObjectHealthEngine.ts";
import { calculateObjectImpact } from "../object-intelligence/ObjectImpactEngine.ts";
import { calculateObjectImportance } from "../object-intelligence/ObjectImportanceEngine.ts";
import { calculateObjectTrendProfile } from "../object-intelligence/ObjectTrendEngine.ts";
import {
  ObjectRiskEngine,
  buildObjectRiskRegistry,
  calculateObjectRiskProfile,
  calculateObjectRiskProfileFromIntelligence,
  getObjectRiskRegistry,
  resetObjectRiskEngineForTests,
  resolveObjectRiskLevel,
} from "./ObjectRiskEngine.ts";
import {
  OBJECT_RISK_ENGINE_DIAGNOSTIC,
  OBJECT_RISK_UPDATED_DIAGNOSTIC,
} from "./objectRiskContract.ts";

test.beforeEach(() => {
  resetObjectRiskEngineForTests();
});

test("exports canonical object risk diagnostics", () => {
  assert.equal(OBJECT_RISK_ENGINE_DIAGNOSTIC, "[OBJECT_RISK_ENGINE]");
  assert.equal(OBJECT_RISK_UPDATED_DIAGNOSTIC, "[OBJECT_RISK_UPDATED]");
});

test("maps risk score thresholds to Low Medium High Critical", () => {
  assert.equal(resolveObjectRiskLevel(20), "Low");
  assert.equal(resolveObjectRiskLevel(40), "Medium");
  assert.equal(resolveObjectRiskLevel(65), "High");
  assert.equal(resolveObjectRiskLevel(85), "Critical");
});

test("generates 0-100 risk score from object health trend impact and importance", () => {
  const object = {
    id: "supplier-1",
    label: "Supplier 1",
    type: "supplier",
    position: [0, 0, 0],
    activityLevel: 95,
    relationshipStability: 90,
    sourceConfidence: 92,
    impactScore: 45,
    importanceScore: 50,
  };

  const profile = calculateObjectRiskProfile(object);

  assert.equal(profile?.objectId, "supplier-1");
  assert.equal(typeof profile?.riskScore, "number");
  assert.equal((profile?.riskScore ?? -1) >= 0 && (profile?.riskScore ?? 101) <= 100, true);
  assert.equal(profile?.riskLevel, "Low");
  assert.equal(profile?.riskFactors.healthScore, 95);
  assert.equal(profile?.riskFactors.trendDirection, "Stable");
  assert.equal(typeof profile?.riskFactors.impactScore, "number");
  assert.equal(typeof profile?.riskFactors.importanceScore, "number");
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile?.riskFactors), true);
});

test("elevates risk when health declines and trend worsens", () => {
  const health = calculateObjectHealth({
    id: "fragile-1",
    active: false,
    relationships: [{ status: "broken", confidence: 20 }],
    sourceConfidence: 15,
  })!;
  const impact = calculateObjectImpact({
    id: "fragile-1",
    connectedRisks: 4,
    businessDependency: 90,
    relationships: [{}, {}, {}],
  })!;
  const importance = calculateObjectImportance({
    id: "fragile-1",
    role: "executive",
    importance: 92,
  })!;
  const trend = calculateObjectTrendProfile("fragile-1", {
    objectHealthHistory: [
      { objectId: "fragile-1", healthScore: 72 },
      { objectId: "fragile-1", healthScore: 54 },
      { objectId: "fragile-1", healthScore: 36 },
    ],
  });

  const profile = calculateObjectRiskProfileFromIntelligence(health, trend, impact, importance);

  assert.equal(profile.riskLevel, "High");
  assert.equal(profile.riskFactors.trendDirection, "Declining");
  assert.equal((profile.riskScore ?? 0) >= 65, true);
});

test("creates immutable object risk registry with diagnostics", () => {
  const registry = buildObjectRiskRegistry({
    sceneObjects: [
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        confidence: 75,
        activityLevel: 68,
        relationships: [{ status: "stable", confidence: 80 }],
      },
      {
        id: "revenue-1",
        label: "Revenue",
        type: "revenue",
        role: "executive",
        importance: 90,
        active: false,
        sourceConfidence: 20,
      },
    ],
  });

  assert.equal(registry.objectCount, 2);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(OBJECT_RISK_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_RISK_UPDATED_DIAGNOSTIC), true);
  assert.equal(typeof registry.riskByObjectId["inventory-1"]?.riskScore, "number");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(getObjectRiskRegistry().objectCount, 2);
});

test("object risk computation does not mutate source objects", () => {
  const source: Record<string, unknown> = {
    id: "production-1",
    label: "Production",
    type: "production",
  };
  const before = JSON.stringify(source);

  const registry = ObjectRiskEngine.buildObjectRiskRegistry({ sceneObjects: [source] });

  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "riskScore"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "riskLevel"), false);
  assert.equal(typeof registry.riskByObjectId["production-1"]?.riskScore, "number");
});
