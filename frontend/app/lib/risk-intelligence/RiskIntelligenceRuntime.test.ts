import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRiskIntelligenceRegistry,
  createRiskIntelligenceProfile,
  getRiskIntelligenceRegistry,
  resetRiskIntelligenceRuntimeForTests,
} from "./RiskIntelligenceRuntime.ts";
import {
  RISK_INTELLIGENCE_READY_DIAGNOSTIC,
  RISK_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
  type RiskIntelligenceProfile,
} from "./riskIntelligenceContract.ts";

test.beforeEach(() => {
  resetRiskIntelligenceRuntimeForTests();
});

test("exports canonical risk intelligence diagnostics", () => {
  assert.equal(RISK_INTELLIGENCE_RUNTIME_DIAGNOSTIC, "[RISK_INTELLIGENCE_RUNTIME]");
  assert.equal(RISK_INTELLIGENCE_READY_DIAGNOSTIC, "[RISK_INTELLIGENCE_READY]");
});

test("creates immutable risk intelligence profile with all supported categories", () => {
  const profile = createRiskIntelligenceProfile({
    riskId: "risk-supplier-1",
    subjectId: "supplier-1",
    label: "Supplier Delay Risk",
    category: "Supply Risk",
    severity: 82,
    exposure: 76,
    confidence: 88,
    momentum: "worsening",
    operationalRisk: 55,
    financialRisk: 48,
    scheduleRisk: 70,
    dependencyRisk: 62,
    supplyRisk: 82,
    strategicRisk: 40,
  });

  assert.equal(profile?.riskId, "risk-supplier-1");
  assert.equal(profile?.subjectId, "supplier-1");
  assert.equal(profile?.primaryCategory, "supply");
  assert.equal(profile?.primaryCategoryLabel, "Supply Risk");
  assert.equal(profile?.severity, 82);
  assert.equal(profile?.exposure, 76);
  assert.equal(profile?.confidence, 88);
  assert.equal(profile?.momentum, "worsening");
  assert.equal(profile?.categories.operationalRisk, 55);
  assert.equal(profile?.categories.financialRisk, 48);
  assert.equal(profile?.categories.scheduleRisk, 70);
  assert.equal(profile?.categories.dependencyRisk, 62);
  assert.equal(profile?.categories.supplyRisk, 82);
  assert.equal(profile?.categories.strategicRisk, 40);
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile?.categories), true);
});

test("builds immutable risk intelligence registry from scene objects and explicit risks", () => {
  const registry = buildRiskIntelligenceRegistry({
    sceneJson: {
      scene: {
        objects: [
          {
            id: "supplier-1",
            label: "Primary Supplier",
            type: "supplier",
            risk_kind: "supply",
            scanner_severity: "high",
            confidence: 84,
          },
          {
            id: "revenue-1",
            label: "Revenue",
            type: "revenue",
            role: "executive",
            importance: 90,
          },
        ],
        relationships: [
          {
            id: "rel-1",
            sourceId: "supplier-1",
            targetId: "revenue-1",
            type: "dependency",
          },
        ],
        risks: [
          {
            id: "risk-schedule-1",
            subjectId: "revenue-1",
            label: "Schedule Risk",
            category: "Schedule Risk",
            severity: 74,
            confidence: 79,
          },
        ],
      },
    },
  });

  assert.equal(registry.riskCount, 3);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.routingMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(RISK_INTELLIGENCE_RUNTIME_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RISK_INTELLIGENCE_READY_DIAGNOSTIC), true);
  assert.equal(registry.profileBySubjectId["supplier-1"]?.primaryCategory, "supply");
  assert.equal(registry.profileByRiskId["risk-schedule-1"]?.primaryCategoryLabel, "Schedule Risk");
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profiles), true);
  assert.equal(Object.isFrozen(registry.profiles[0]), true);
  assert.equal(getRiskIntelligenceRegistry().riskCount, 3);
});

test("risk intelligence is read-only and does not mutate source records", () => {
  const object: Record<string, unknown> = {
    id: "inventory-1",
    label: "Inventory",
    type: "inventory",
  };
  const scene = { scene: { objects: [object] } };
  const beforeObject = JSON.stringify(object);
  const beforeScene = JSON.stringify(scene);

  const registry = buildRiskIntelligenceRegistry({ sceneJson: scene });

  assert.equal(JSON.stringify(object), beforeObject);
  assert.equal(JSON.stringify(scene), beforeScene);
  assert.equal(Object.prototype.hasOwnProperty.call(object, "operationalRisk"), false);
  assert.equal(registry.profileBySubjectId["inventory-1"]?.categories.operationalRisk >= 35, true);
});

test("supports all six canonical risk categories", () => {
  const categories = [
    ["Operational Risk", "operationalRisk"],
    ["Financial Risk", "financialRisk"],
    ["Schedule Risk", "scheduleRisk"],
    ["Dependency Risk", "dependencyRisk"],
    ["Supply Risk", "supplyRisk"],
    ["Strategic Risk", "strategicRisk"],
  ] as const;

  for (const [label, key] of categories) {
    const profile = createRiskIntelligenceProfile({
      id: `risk-${key}`,
      subjectId: `subject-${key}`,
      label,
      category: label,
      severity: 88,
      [key]: 88,
    }) as RiskIntelligenceProfile;

    assert.equal(profile.primaryCategoryLabel, label);
    assert.equal(profile.categories[key], 88);
  }
});
