import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioGenerationRuntime,
  buildScenarioRegistry,
  getScenarioRegistry,
  resetScenarioGenerationRuntimeForTests,
} from "./ScenarioGenerationRuntime.ts";
import {
  SCENARIO_RUNTIME_DIAGNOSTIC,
  SCENARIO_RUNTIME_READY_DIAGNOSTIC,
  SCENARIO_SUPPORTED_TYPES,
  SCENARIO_TYPE_LABELS,
} from "./scenarioGenerationContract.ts";

test.beforeEach(() => {
  resetScenarioGenerationRuntimeForTests();
});

test("builds immutable scenario registry with supported scenario types", () => {
  const registry = buildScenarioRegistry({
    objects: [
      { id: "supplier-1", label: "Supplier", risk: 80, confidence: 70 },
      { id: "inventory-1", label: "Inventory", risk: 45, opportunity: 75 },
    ],
    kpis: [
      { id: "revenue", label: "Revenue" },
      { id: "margin", label: "Margin" },
    ],
    relationships: [{ id: "rel-1", sourceId: "supplier-1", targetId: "inventory-1" }],
    risks: [{ id: "risk-1", severity: 85 }],
    selectedObjectId: "supplier-1",
  });

  assert.equal(registry.scenarioCount, 4);
  assert.deepEqual(registry.supportedScenarioTypes, SCENARIO_SUPPORTED_TYPES);
  assert.equal(registry.definitionById["scenario:baseline"]?.label, SCENARIO_TYPE_LABELS.baseline);
  assert.equal(registry.definitionById["scenario:alternative"]?.scenarioType, "alternative");
  assert.equal(registry.definitionById["scenario:risk"]?.scenarioType, "risk");
  assert.equal(registry.definitionById["scenario:opportunity"]?.scenarioType, "opportunity");
  assert.equal(registry.definitionById["scenario:baseline"]?.focusObjectIds[0], "supplier-1");
  assert.equal(registry.resultById["scenario:risk"]?.impact.projectedScore, null);
  assert.equal(registry.resultById["scenario:opportunity"]?.outcomeScore, null);
  assert.equal(registry.resultById["scenario:risk"]?.simulationActive, false);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.visualRendering, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.generationActive, false);
  assert.equal(registry.diagnostics.includes(SCENARIO_RUNTIME_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(SCENARIO_RUNTIME_READY_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.definitions), true);
  assert.equal(Object.isFrozen(registry.definitions[0]), true);
  assert.equal(Object.isFrozen(registry.impacts), true);
  assert.equal(Object.isFrozen(registry.results), true);
  assert.equal(Object.isFrozen(registry.definitionById), true);
  assert.equal(Object.isFrozen(registry.resultById), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = {
    scene: {
      objects: [
        { id: "line-1", label: "Production Line", health: 0.62, risk: "medium" },
      ],
      kpis: [{ id: "throughput", label: "Throughput", value: 88 }],
      relationships: [{ id: "rel-1", sourceId: "line-1", targetId: "line-2" }],
      risks: [{ id: "delay-risk", severity: "high" }],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = ScenarioGenerationRuntime.buildScenarioRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.scenarioCount, 4);
  assert.equal(registry.definitionById["scenario:baseline"]?.focusObjectIds[0], "line-1");
  assert.equal(registry.impacts[2]?.impactAreas.includes("risk"), true);
  assert.equal(getScenarioRegistry().scenarioCount, 4);
});

test("risk scenario prioritizes higher-risk objects and keeps foundation read-only", () => {
  const registry = buildScenarioRegistry({
    objects: [
      { id: "supplier-1", risk: 90 },
      { id: "inventory-1", risk: 35 },
      { id: "production-1", risk: 72 },
    ],
    kpis: [{ id: "delivery", label: "Delivery" }],
  });

  const riskImpact = registry.resultById["scenario:risk"]?.impact;
  assert.ok(riskImpact);
  assert.equal(riskImpact.impactedObjectIds.includes("supplier-1"), true);
  assert.equal(riskImpact.impactReady, true);
  assert.equal(riskImpact.projectedScore, null);
  assert.equal(registry.results.every((result) => result.evaluationReady), true);
  assert.equal(registry.definitions.every((definition) => definition.foundationOnly), true);
  assert.equal(registry.definitions.every((definition) => definition.generationActive), false);
});
