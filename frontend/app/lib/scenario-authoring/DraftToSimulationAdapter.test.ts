import test from "node:test";
import assert from "node:assert/strict";

import { buildScenarioDraft } from "./scenarioAuthoringContract.ts";
import {
  adaptDraftToSimulationRequest,
  DraftToSimulationAdapter,
  getDraftToSimulationAdapterResult,
  resetDraftToSimulationAdapterForTests,
} from "./DraftToSimulationAdapter.ts";
import {
  DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTIC,
  DRAFT_TO_SIMULATION_READY_DIAGNOSTIC,
  S2_DRAFT_ADAPTER_COMPLETE_TAG,
} from "./draftToSimulationAdapterContract.ts";
import {
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
} from "./scenarioDraftBuilderContract.ts";

function buildValidDraft() {
  return buildScenarioDraft({
    draftId: "scenario-draft:adapter",
    name: "Supplier Delay Adapter Draft",
    scenarioType: "risk",
    summary: "Convert draft to simulation request.",
    description: "Adapter fixture.",
    assumptions: ["Baseline reference preserved."],
    focusObjectIds: ["supplier-1"],
  });
}

test.beforeEach(() => {
  resetDraftToSimulationAdapterForTests();
});

test("exports S2 draft adapter tag and diagnostics", () => {
  assert.equal(S2_DRAFT_ADAPTER_COMPLETE_TAG, "[S2_DRAFT_ADAPTER_COMPLETE]");
  assert.equal(DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTIC, "[DRAFT_TO_SIMULATION_ADAPTER]");
  assert.equal(DRAFT_TO_SIMULATION_READY_DIAGNOSTIC, "[DRAFT_TO_SIMULATION_READY]");
  assert.deepEqual(DraftToSimulationAdapter.diagnostics, [
    "[DRAFT_TO_SIMULATION_ADAPTER]",
    "[DRAFT_TO_SIMULATION_READY]",
  ]);
});

test("converts a valid ScenarioDraft into a ScenarioSimulationRequest", () => {
  const draft = buildValidDraft();
  const before = JSON.stringify(draft);

  const result = adaptDraftToSimulationRequest(draft);

  assert.equal(result.status, "ready");
  assert.equal(result.request?.draftId, draft.draftId);
  assert.equal(result.request?.dryRun, true);
  assert.equal(result.request?.sceneMutation, false);
  assert.equal(result.request?.dsMutation, false);
  assert.equal(result.request?.routingMutation, false);
  assert.equal(result.simulationExecution, false);
  assert.equal(result.draftMutation, false);
  assert.equal(result.baselineReference?.baselineScenarioId, SCENARIO_DRAFT_BASELINE_SCENARIO_ID);
  assert.equal(result.baselineReference?.baselineDraftId, SCENARIO_DRAFT_BASELINE_DRAFT_ID);
  assert.equal(result.request?.baselineReference?.preserved, true);
  assert.equal(JSON.stringify(draft), before);
  assert.throws(() => {
    (result.draft?.focusObjectIds as string[]).push("mutate");
  }, TypeError);
});

test("rejects invalid ScenarioDrafts", () => {
  const invalidDraft = buildScenarioDraft({
    draftId: "scenario-draft:invalid",
    name: "",
    scenarioType: "risk",
    summary: "",
  });

  const result = adaptDraftToSimulationRequest(invalidDraft);

  assert.equal(result.status, "rejected");
  assert.equal(result.request, null);
  assert.match(result.reason, /Invalid ScenarioDraft/);
  assert.equal(result.simulationExecution, false);
});

test("rejects archived ScenarioDrafts", () => {
  const archivedDraft = Object.freeze({
    ...buildValidDraft(),
    registryStatus: "archived",
    archivedAt: "2026-06-18T00:00:00.000Z",
  }) as ReturnType<typeof buildValidDraft>;

  const result = DraftToSimulationAdapter.adaptDraftToSimulationRequest(archivedDraft);

  assert.equal(result.status, "rejected");
  assert.equal(result.request, null);
  assert.match(result.reason, /Archived ScenarioDraft/);
});

test("stores latest adapter result without executing simulation", () => {
  const result = DraftToSimulationAdapter.adaptDraftToSimulationRequest(buildValidDraft());

  assert.equal(getDraftToSimulationAdapterResult(), result);
  assert.equal(DraftToSimulationAdapter.getDraftToSimulationAdapterResult().simulationExecution, false);
});
