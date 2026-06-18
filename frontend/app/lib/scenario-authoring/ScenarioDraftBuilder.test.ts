import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioDraftBuilder,
  buildScenarioDraftFromInput,
  resetScenarioDraftBuilderForTests,
} from "./ScenarioDraftBuilder.ts";
import {
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
  SCENARIO_DRAFT_BUILDER_DIAGNOSTIC,
  SCENARIO_DRAFT_READY_DIAGNOSTIC,
  S1_DRAFT_BUILDER_COMPLETE_TAG,
} from "./scenarioDraftBuilderContract.ts";
import { buildScenarioInputModel, resetScenarioInputModelForTests } from "./ScenarioInputModel.ts";

test.beforeEach(() => {
  resetScenarioDraftBuilderForTests();
  resetScenarioInputModelForTests();
});

test("exports S1 draft builder completion tag", () => {
  assert.equal(S1_DRAFT_BUILDER_COMPLETE_TAG, "[S1_DRAFT_BUILDER_COMPLETE]");
  assert.equal(SCENARIO_DRAFT_BUILDER_DIAGNOSTIC, "[SCENARIO_DRAFT_BUILDER]");
  assert.equal(SCENARIO_DRAFT_READY_DIAGNOSTIC, "[SCENARIO_DRAFT_READY]");
});

test("converts scenario input model into scenario draft", () => {
  const inputModel = buildScenarioInputModel({
    draftId: "scenario-draft:source",
    objectChanges: [
      {
        targetId: "supplier-1",
        label: "Primary Supplier",
        field: "active",
        proposedValue: "false",
        rationale: "Model supplier outage.",
      },
    ],
    relationshipChanges: [
      {
        targetId: "rel-supply",
        field: "dependency",
        proposedValue: "95",
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

  const result = buildScenarioDraftFromInput({
    inputModel,
    name: "Supplier Delay Risk",
    scenarioType: "risk",
  });

  assert.ok(result.draftId.startsWith("scenario-draft:"));
  assert.equal(result.draftName, "Supplier Delay Risk");
  assert.ok(result.draftSummary.includes("risk change"));
  assert.equal(result.draftMetadata.draftId, result.draftId);
  assert.equal(result.draft.draftId, result.draftId);
  assert.equal(result.draft.scenarioType, "risk");
  assert.equal(result.draft.changes.length, 3);
  assert.equal(result.simulationActive, false);
  assert.equal(result.executionActive, false);
  assert.equal(result.dsMutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.draft), true);
  assert.equal(result.diagnostics.includes(SCENARIO_DRAFT_BUILDER_DIAGNOSTIC), true);
  assert.equal(result.diagnostics.includes(SCENARIO_DRAFT_READY_DIAGNOSTIC), true);
});

test("preserves baseline references on built drafts", () => {
  const inputModel = buildScenarioInputModel({
    objectChanges: [
      {
        targetId: "inventory-1",
        field: "activityLevel",
        proposedValue: "40",
      },
    ],
  });

  const result = buildScenarioDraftFromInput({ inputModel });

  assert.equal(result.baselineReference.baselineScenarioId, SCENARIO_DRAFT_BASELINE_SCENARIO_ID);
  assert.equal(result.baselineReference.baselineDraftId, SCENARIO_DRAFT_BASELINE_DRAFT_ID);
  assert.equal(result.baselineReference.preserved, true);
  assert.equal(result.baselineReference.inputModelId, inputModel.inputModelId);
  assert.ok(result.draft.assumptions.some((entry) => entry.includes(SCENARIO_DRAFT_BASELINE_SCENARIO_ID)));
  assert.ok(result.draft.summary.includes(SCENARIO_DRAFT_BASELINE_SCENARIO_ID));
});

test("does not mutate source input model during draft creation", () => {
  const inputModel = buildScenarioInputModel({
    kpiChanges: [
      {
        targetId: "schedule",
        field: "value",
        proposedValue: "38",
      },
    ],
  });
  const before = JSON.stringify(inputModel);

  ScenarioDraftBuilder.buildScenarioDraftFromInput({ inputModel });

  assert.equal(JSON.stringify(inputModel), before);
});
