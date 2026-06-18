import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioBuilderEngine,
  buildScenarioBlueprintRegistry,
  getScenarioBlueprintRegistry,
  resetScenarioBuilderEngineForTests,
} from "./ScenarioBuilderEngine.ts";
import { resetScenarioGenerationRuntimeForTests } from "./ScenarioGenerationRuntime.ts";
import {
  SCENARIO_BUILDER_DIAGNOSTIC,
  SCENARIO_BUILDER_READY_DIAGNOSTIC,
} from "./scenarioBuilderContract.ts";

test.beforeEach(() => {
  resetScenarioBuilderEngineForTests();
  resetScenarioGenerationRuntimeForTests();
});

test("builds immutable scenario blueprint registry with all change kinds", () => {
  const registry = buildScenarioBlueprintRegistry({
    objects: [
      { id: "supplier-1", label: "Supplier", status: "active", health: 70 },
      { id: "inventory-1", label: "Inventory", status: "idle", health: 55 },
    ],
    relationships: [
      { id: "rel-1", sourceId: "supplier-1", targetId: "inventory-1", status: "healthy", confidence: 70 },
    ],
    kpis: [{ id: "revenue", label: "Revenue", value: 100, target: 100 }],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 70 }],
    selectedObjectId: "supplier-1",
  });

  assert.equal(registry.blueprintCount, 4);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.executionActive, false);
  assert.equal(registry.diagnostics.includes(SCENARIO_BUILDER_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(SCENARIO_BUILDER_READY_DIAGNOSTIC), true);

  const baselineBlueprint = registry.blueprintByScenarioId["scenario:baseline"];
  assert.ok(baselineBlueprint);
  assert.equal(baselineBlueprint.changeCount, 0);
  assert.equal(baselineBlueprint.baselineState.preserved, true);
  assert.equal(baselineBlueprint.baselineState.objectCount, 2);
  assert.equal(baselineBlueprint.baselineState.relationshipCount, 1);
  assert.equal(baselineBlueprint.baselineState.kpiCount, 1);
  assert.equal(baselineBlueprint.baselineState.riskCount, 1);
  assert.deepEqual(
    baselineBlueprint.baselineState.objectSnapshots["supplier-1"],
    Object.freeze({ id: "supplier-1", label: "Supplier", status: "active", health: 70 })
  );

  const riskBlueprint = registry.blueprintByScenarioId["scenario:risk"];
  assert.ok(riskBlueprint);
  assert.ok(riskBlueprint.objectChanges.length > 0);
  assert.ok(riskBlueprint.relationshipChanges.length > 0);
  assert.ok(riskBlueprint.kpiChanges.length > 0);
  assert.ok(riskBlueprint.riskChanges.length > 0);
  assert.equal(riskBlueprint.objectChanges[0]?.applied, false);
  assert.equal(riskBlueprint.objectChanges[0]?.executable, true);
  assert.equal(riskBlueprint.executionActive, false);
  assert.equal(riskBlueprint.sceneMutation, false);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.blueprints), true);
  assert.equal(Object.isFrozen(registry.blueprints[0]), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = {
    scene: {
      objects: [{ id: "line-1", label: "Line", status: "running", health: 62 }],
      relationships: [{ id: "rel-1", sourceId: "line-1", targetId: "line-2", confidence: 65 }],
      kpis: [{ id: "throughput", label: "Throughput", value: 88 }],
      risks: [{ id: "risk-1", severity: 80 }],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = ScenarioBuilderEngine.buildScenarioBlueprintRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.blueprintCount, 4);
  assert.equal(getScenarioBlueprintRegistry().blueprintCount, 4);
});

test("preserves baseline snapshots while generating executable alternative changes", () => {
  const registry = buildScenarioBlueprintRegistry({
    objects: [{ id: "supplier-1", status: "active", health: 80 }],
    relationships: [{ id: "rel-1", sourceId: "supplier-1", targetId: "inventory-1", confidence: 60 }],
    kpis: [{ id: "margin", value: 40, target: 45 }],
    risks: [{ id: "supply-risk", severity: 55 }],
  });

  const alternative = registry.blueprintByScenarioId["scenario:alternative"];
  const opportunity = registry.blueprintByScenarioId["scenario:opportunity"];

  assert.ok(alternative);
  assert.ok(opportunity);
  assert.equal(alternative.objectChanges[0]?.baselineState.status, "active");
  assert.equal(alternative.objectChanges[0]?.proposedState.status, "paused");
  assert.equal(opportunity.kpiChanges[0]?.proposedState.direction, "up");
  assert.equal(alternative.baselineState.objectSnapshots["supplier-1"]?.status, "active");
  assert.notDeepEqual(
    alternative.objectChanges[0]?.baselineState,
    alternative.objectChanges[0]?.proposedState
  );
});
