import test from "node:test";
import assert from "node:assert/strict";

import {
  RiskScenarioFoundation,
  buildRiskScenarioFoundationRegistry,
  getRiskScenarioFoundationRegistry,
  resetRiskScenarioFoundationForTests,
} from "./RiskScenarioFoundation.ts";
import {
  RISK_SCENARIO_FOUNDATION_DIAGNOSTIC,
  RISK_SCENARIO_READY_DIAGNOSTIC,
} from "./riskScenarioFoundationContract.ts";

const SCENE_FIXTURE = {
  scene: {
    objects: [
      {
        id: "supplier-1",
        label: "Primary Supplier",
        type: "supplier",
        active: false,
        sourceConfidence: 15,
        relationships: [{ status: "broken", confidence: 20 }],
      },
      { id: "inventory-1", label: "Inventory", type: "inventory", activityLevel: 55 },
      {
        id: "production-1",
        label: "Production",
        type: "production",
        role: "executive",
        importance: 90,
        active: false,
        sourceConfidence: 20,
      },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
        direction: "uni",
        metadata: { supplyRisk: 85, dependency: 88, strength: 0.9, redundancy: 6 },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "rel-dependency",
        sourceId: "inventory-1",
        targetId: "production-1",
        type: "dependency",
        direction: "uni",
        metadata: { operationalRisk: 90, dependency: 92, redundancy: 8 },
        createdAt: "2026-01-02T00:00:00.000Z",
      },
    ],
    kpis: [
      {
        id: "schedule",
        label: "Schedule",
        objectId: "production-1",
        value: 42,
        target: 60,
        category: "Schedule",
        confidence: 55,
      },
    ],
    kpiSnapshots: [
      { kpiId: "schedule", value: 58, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "schedule", value: 50, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "schedule", value: 42, capturedAt: "2026-03-01T00:00:00.000Z" },
    ],
  },
};

test.beforeEach(() => {
  resetRiskScenarioFoundationForTests();
});

test("exports canonical risk scenario foundation diagnostics", () => {
  assert.equal(RISK_SCENARIO_FOUNDATION_DIAGNOSTIC, "[RISK_SCENARIO_FOUNDATION]");
  assert.equal(RISK_SCENARIO_READY_DIAGNOSTIC, "[RISK_SCENARIO_READY]");
});

test("returns empty scenario foundation registry for an empty graph", () => {
  const registry = buildRiskScenarioFoundationRegistry();

  assert.equal(registry.scenarioCount, 0);
  assert.equal(registry.foundationOnly, true);
  assert.equal(registry.simulationActive, false);
  assert.equal(Object.isFrozen(registry), true);
});

test("builds scenario-ready risk structures with what-if and alternative path slots", () => {
  const registry = buildRiskScenarioFoundationRegistry({ sceneJson: SCENE_FIXTURE });

  assert.equal(registry.scenarioCount > 0, true);
  assert.equal(registry.foundationOnly, true);
  assert.equal(registry.simulationActive, false);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.diagnostics.includes(RISK_SCENARIO_FOUNDATION_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RISK_SCENARIO_READY_DIAGNOSTIC), true);

  const baseline = registry.scenarioById.baseline;
  assert.equal(baseline?.foundationOnly, true);
  assert.equal(baseline?.simulationActive, false);
  assert.equal(baseline?.whatIfEvaluations.length > 0, true);
  assert.equal(baseline?.whatIfEvaluations.every((slot) => slot.evaluationReady === true), true);
  assert.equal(
    baseline?.whatIfEvaluations.every((slot) => slot.projectedRiskScore === null),
    true
  );

  const alternativeScenario = registry.scenarios.find((scenario) =>
    scenario.scenarioId.startsWith("alternative-path")
  );
  assert.equal(alternativeScenario != null, true);
  assert.equal(alternativeScenario?.alternativePaths.length > 0, true);
  assert.equal(
    alternativeScenario?.alternativePaths.every((path) => path.pathReady === true),
    true
  );
  assert.equal(
    alternativeScenario?.alternativePaths.every((path) => path.alternativePropagationScore === null),
    true
  );
  assert.equal(Object.isFrozen(registry.scenarios), true);
  assert.equal(getRiskScenarioFoundationRegistry().scenarioCount, registry.scenarioCount);
});

test("supports explicit scenario inputs for what-if evaluation", () => {
  const registry = buildRiskScenarioFoundationRegistry({
    sceneJson: SCENE_FIXTURE,
    scenarioInputs: [
      {
        scenarioId: "custom-what-if",
        label: "Supplier disruption",
        description: "Evaluate supplier disruption risk without executing simulation.",
        assumptions: { mode: "what_if", trigger: "supplier_outage" },
        focusNodeIds: ["supplier-1", "inventory-1"],
      },
    ],
  });

  const scenario = registry.scenarioById["custom-what-if"];
  assert.equal(scenario?.label, "Supplier disruption");
  assert.equal(scenario?.whatIfEvaluations.length, 2);
  assert.equal(scenario?.whatIfEvaluations.some((slot) => slot.nodeId === "supplier-1"), true);
  assert.equal(scenario?.whatIfEvaluations.some((slot) => slot.nodeId === "inventory-1"), true);
  assert.equal(scenario?.scenarioInputs.length, 1);
});

test("risk scenario foundation does not mutate source graph records", () => {
  const object: Record<string, unknown> = {
    id: "source-1",
    label: "Source",
    type: "supplier",
    active: false,
    sourceConfidence: 10,
  };
  const before = JSON.stringify(object);

  RiskScenarioFoundation.buildRiskScenarioFoundationRegistry({
    objects: [object, { id: "target-1", label: "Target" }],
    relationships: [
      {
        id: "rel-1",
        sourceId: "source-1",
        targetId: "target-1",
        type: "dependency",
        metadata: { dependency: 90 },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  });

  assert.equal(JSON.stringify(object), before);
  assert.equal(Object.prototype.hasOwnProperty.call(object, "simulationActive"), false);
});
