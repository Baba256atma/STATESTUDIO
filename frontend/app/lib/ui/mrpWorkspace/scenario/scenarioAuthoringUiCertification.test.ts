import test from "node:test";
import assert from "node:assert/strict";

import { buildScenarioDraft } from "../../../scenario-authoring/scenarioAuthoringContract.ts";
import {
  createScenarioDraftRegistryEntry,
  resetScenarioDraftRegistryForTests,
} from "../../../scenario-authoring/ScenarioDraftRegistry.ts";
import {
  SCENARIO_AUTHORING_UI_DIAGNOSTIC,
  SCENARIO_AUTHORING_UI_READY_DIAGNOSTIC,
  S1_UI_BINDING_COMPLETE_TAG,
} from "./scenarioAuthoringUiContract.ts";
import {
  getScenarioAuthoringUiView,
  hydrateScenarioAuthoringUiOnMount,
  resetScenarioAuthoringUiRuntimeForTests,
  syncScenarioAuthoringUi,
} from "./scenarioAuthoringUiRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "../mrpWorkspaceResolver.ts";

test.beforeEach(() => {
  resetScenarioAuthoringUiRuntimeForTests();
  resetScenarioDraftRegistryForTests();
});

test("exports S1 UI binding completion tag", () => {
  assert.equal(S1_UI_BINDING_COMPLETE_TAG, "[S1_UI_BINDING_COMPLETE]");
  assert.equal(SCENARIO_AUTHORING_UI_DIAGNOSTIC, "[SCENARIO_AUTHORING_UI]");
  assert.equal(SCENARIO_AUTHORING_UI_READY_DIAGNOSTIC, "[SCENARIO_AUTHORING_UI_READY]");
});

test("displays persisted draft fields in authoring UI view", () => {
  const draft = buildScenarioDraft({
    draftId: "scenario-draft:ui-1",
    name: "Supplier Delay Risk",
    summary: "Model supplier outage impact.",
    description: "Executive risk scenario draft.",
    scenarioType: "risk",
    assumptions: ["Baseline reference preserved."],
    focusObjectIds: ["supplier-1"],
  });

  createScenarioDraftRegistryEntry({ draft });
  syncScenarioAuthoringUi({ selectedObjectId: "supplier-1" });

  const view = getScenarioAuthoringUiView();
  assert.equal(view.phase, "ready");
  assert.equal(view.draft.hasDraft, true);
  assert.equal(view.draft.draftName, "Supplier Delay Risk");
  assert.equal(view.draft.draftType, "Risk Scenario");
  assert.equal(view.draft.draftSummary, "Model supplier outage impact.");
  assert.equal(view.draft.validationState, "valid");
  assert.equal(view.draft.validationLabel, "Valid");
  assert.equal(view.simulationActive, false);
  assert.equal(view.draftsOnly, true);
  assert.equal(view.diagnostics.includes(SCENARIO_AUTHORING_UI_DIAGNOSTIC), true);
});

test("preserves existing scenario workspace mount without new routes", () => {
  hydrateScenarioAuthoringUiOnMount("binding-cert");

  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "scenario",
    dashboardContext: "overview",
  });
  assert.equal(plan.mountTarget, "scenario_workspace");
  assert.equal(plan.workspaceId, "scenario");

  const emptyView = syncScenarioAuthoringUi({});
  assert.equal(emptyView.phase, "empty");
  assert.equal(emptyView.draft.hasDraft, false);
  assert.equal(emptyView.routingMutation, false);
  assert.equal(emptyView.topologyMutation, false);
});
