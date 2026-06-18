import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioValidationEngine,
  validateScenarioDraft,
  resetScenarioValidationEngineForTests,
} from "./ScenarioValidationEngine.ts";
import {
  SCENARIO_VALIDATION_ENGINE_DIAGNOSTIC,
  SCENARIO_VALIDATION_READY_DIAGNOSTIC,
  S1_VALIDATION_COMPLETE_TAG,
} from "./scenarioValidationEngineContract.ts";
import { buildScenarioDraftFromInput, resetScenarioDraftBuilderForTests } from "./ScenarioDraftBuilder.ts";
import { buildScenarioInputModel, resetScenarioInputModelForTests } from "./ScenarioInputModel.ts";
import { buildScenarioDraft } from "./scenarioAuthoringContract.ts";

const SAMPLE_SCENE = {
  scene: {
    objects: [
      { id: "supplier-1", label: "Primary Supplier", type: "supplier" },
      { id: "inventory-1", label: "Inventory", type: "inventory" },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
      },
    ],
    kpis: [{ id: "revenue", label: "Revenue", category: "Revenue", value: 80 }],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
};

test.beforeEach(() => {
  resetScenarioValidationEngineForTests();
  resetScenarioDraftBuilderForTests();
  resetScenarioInputModelForTests();
});

test("exports S1 validation completion tag", () => {
  assert.equal(S1_VALIDATION_COMPLETE_TAG, "[S1_VALIDATION_COMPLETE]");
  assert.equal(SCENARIO_VALIDATION_ENGINE_DIAGNOSTIC, "[SCENARIO_VALIDATION_ENGINE]");
  assert.equal(SCENARIO_VALIDATION_READY_DIAGNOSTIC, "[SCENARIO_VALIDATION_READY]");
});

test("rejects invalid drafts with required field and reference errors", () => {
  const invalidDraft = buildScenarioDraft({
    name: "",
    summary: "",
    scenarioType: "risk",
  });

  const inputModel = buildScenarioInputModel({
    objectChanges: [
      {
        targetId: "missing-object",
        field: "active",
        proposedValue: "false",
      },
    ],
    relationshipChanges: [
      {
        targetId: "missing-relationship",
        field: "dependency",
        proposedValue: "90",
      },
    ],
    kpiChanges: [
      {
        targetId: "missing-kpi",
        field: "value",
        proposedValue: "40",
      },
    ],
    riskChanges: [
      {
        targetId: "missing-risk",
        field: "severity",
        proposedValue: "85",
      },
    ],
  });

  const result = validateScenarioDraft({
    draft: invalidDraft,
    inputModel,
    sceneJson: SAMPLE_SCENE,
  });

  assert.equal(result.rejected, true);
  assert.equal(result.accepted, false);
  assert.equal(result.valid, false);
  assert.equal(result.validationState, "invalid");
  assert.ok(result.errors.some((entry) => entry.field === "name"));
  assert.ok(result.errors.some((entry) => entry.kind === "object_reference"));
  assert.ok(result.errors.some((entry) => entry.kind === "relationship_reference"));
  assert.ok(result.errors.some((entry) => entry.kind === "kpi_reference"));
  assert.ok(result.errors.some((entry) => entry.kind === "risk_reference"));
  assert.equal(result.simulationActive, false);
  assert.equal(result.executionActive, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.diagnostics.includes(SCENARIO_VALIDATION_ENGINE_DIAGNOSTIC), true);
  assert.equal(result.diagnostics.includes(SCENARIO_VALIDATION_READY_DIAGNOSTIC), true);
});

test("accepts valid drafts with verified references", () => {
  const inputModel = buildScenarioInputModel({
    objectChanges: [
      {
        targetId: "supplier-1",
        label: "Primary Supplier",
        field: "active",
        proposedValue: "false",
      },
    ],
    relationshipChanges: [
      {
        targetId: "rel-supply",
        field: "dependency",
        proposedValue: "95",
      },
    ],
    kpiChanges: [
      {
        targetId: "revenue",
        field: "value",
        proposedValue: "72",
      },
    ],
    riskChanges: [
      {
        targetId: "delay-risk",
        field: "severity",
        proposedValue: "85",
      },
    ],
  });

  const builderResult = buildScenarioDraftFromInput({
    inputModel,
    name: "Supplier Delay Risk",
    summary: "Model supplier outage impact on inventory and revenue.",
    description: "Executive risk scenario for supplier delay.",
    scenarioType: "risk",
  });

  const result = validateScenarioDraft({
    draft: builderResult.draft,
    inputModel,
    sceneJson: SAMPLE_SCENE,
  });

  assert.equal(result.accepted, true);
  assert.equal(result.rejected, false);
  assert.equal(result.valid, true);
  assert.equal(result.errorCount, 0);
  assert.ok(result.referenceCatalog.catalogAvailable);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.errors), true);
  assert.equal(Object.isFrozen(result.warnings), true);
});

test("does not mutate source draft during validation", () => {
  const draft = buildScenarioDraft({
    name: "Baseline Review",
    summary: "Review baseline posture.",
    scenarioType: "baseline",
    description: "Baseline draft for validation.",
    assumptions: ["Baseline reference preserved."],
  });
  const before = JSON.stringify(draft);

  ScenarioValidationEngine.validateScenarioDraft({ draft, sceneJson: SAMPLE_SCENE });

  assert.equal(JSON.stringify(draft), before);
});
