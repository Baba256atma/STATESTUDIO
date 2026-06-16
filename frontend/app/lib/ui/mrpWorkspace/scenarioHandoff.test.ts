import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_SCENARIO_HANDOFF_TAG,
  SCENARIO_HANDOFF_CONTEXT,
  SCENARIO_HANDOFF_QUESTION,
} from "./scenario/scenarioHandoffContract.ts";
import {
  buildScenarioCommitPackage,
  buildScenarioCommitPackageSignature,
  findGeneratedScenarioById,
} from "./scenario/scenarioHandoffResolver.ts";
import {
  commitScenarioToWarRoom,
  guardScenarioCommitPackageExecution,
  resetScenarioHandoffRuntimeForTests,
} from "./scenario/scenarioHandoffRuntime.ts";
import {
  guardScenarioForbiddenAction,
  guardScenarioHandoffBoundary,
} from "./scenario/scenarioBoundaryRuntime.ts";
import { deriveExecutiveScenarios } from "./scenario/scenarioGenerationResolver.ts";
import { buildScenarioGenerationInput } from "./scenario/scenarioGenerationResolver.ts";
import { syncScenarioGeneration } from "./scenario/scenarioGenerationRuntime.ts";
import { syncScenarioWorkspaceContext } from "./scenario/scenarioWorkspaceContextRuntime.ts";
import {
  getScenarioWorkspaceState,
  hydrateScenarioWorkspaceStateOnMount,
  resetScenarioWorkspaceStateRuntimeForTests,
} from "./scenario/scenarioWorkspaceStateRuntime.ts";
import { buildScenarioWorkspaceViewFromState } from "./scenario/scenarioWorkspaceStateViewMapper.ts";
import {
  consumeWarRoomScenarioCommitPackage,
  getWarRoomScenarioHandoffState,
  resetWarRoomScenarioHandoffRuntimeForTests,
} from "./warRoom/warRoomScenarioHandoffRuntime.ts";

test.beforeEach(() => {
  resetScenarioHandoffRuntimeForTests();
  resetWarRoomScenarioHandoffRuntimeForTests();
  resetScenarioWorkspaceStateRuntimeForTests();
});

test("exports scenario handoff tag and question", () => {
  assert.equal(MRP_SCENARIO_HANDOFF_TAG, "[MRP_SCENARIO_HANDOFF]");
  assert.equal(SCENARIO_HANDOFF_CONTEXT, "scenario");
  assert.equal(SCENARIO_HANDOFF_QUESTION, "Which future should we prepare for?");
});

test("buildScenarioCommitPackage includes all required fields", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({
      selectedObjectId: "obj-a",
      selectedObjectLabel: "Factory A",
    })
  );
  const scenario = scenarios.find((row) => row.id === "expected_case");
  assert.ok(scenario);
  const commitPackage = buildScenarioCommitPackage(scenario!, {
    scenarioId: "expected_case",
    selectedObjectId: "obj-a",
    createdAt: "2026-06-13T12:00:00.000Z",
  });
  assert.equal(commitPackage.scenarioId, "expected_case");
  assert.equal(commitPackage.title, "Expected Case");
  assert.match(commitPackage.probability, /%$/);
  assert.ok(commitPackage.impact);
  assert.ok(commitPackage.confidence);
  assert.equal(commitPackage.selectedObjectId, "obj-a");
  assert.equal(commitPackage.createdAt, "2026-06-13T12:00:00.000Z");
});

test("commitScenarioToWarRoom sets active scenario and transfers package", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioWorkspaceContext({
    selectedObjectId: "obj-a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "obj-a",
    selectedObjectLabel: "Factory A",
  });

  const result = commitScenarioToWarRoom({
    scenarioId: "worst_case",
    selectedObjectId: "obj-a",
    createdAt: "2026-06-13T12:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.equal(result.commitPackage?.scenarioId, "worst_case");

  const scenarioState = getScenarioWorkspaceState();
  assert.equal(scenarioState.activeScenarioId, "worst_case");
  assert.equal(scenarioState.selectedScenarioId, "worst_case");
  assert.equal(scenarioState.handoffReady, true);
  assert.ok(scenarioState.pendingCommitPackage);
  assert.match(scenarioState.scenarioSummary.detail, /MRP_SCENARIO_HANDOFF/);

  const warRoomState = getWarRoomScenarioHandoffState();
  assert.equal(warRoomState.activeScenarioId, "worst_case");
  assert.equal(warRoomState.commitPackage?.title, "Worst Case");
  assert.equal(warRoomState.executionBlocked, true);
});

test("war room may consume scenario commit package", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioGeneration({
    selectedObjectId: "obj-a",
    selectedObjectLabel: "Factory A",
  });
  commitScenarioToWarRoom({
    scenarioId: "best_case",
    selectedObjectId: "obj-a",
    createdAt: "2026-06-13T12:00:00.000Z",
  });

  const consumed = consumeWarRoomScenarioCommitPackage();
  assert.equal(consumed?.scenarioId, "best_case");
  assert.equal(consumed?.title, "Best Case");
});

test("handoff does not execute or auto-open war room", () => {
  assert.equal(
    guardScenarioForbiddenAction({ action: "execute_action", source: "handoff" }).allowed,
    false
  );
  assert.equal(
    guardScenarioForbiddenAction({
      action: "open_war_room_automatically",
      source: "handoff",
    }).allowed,
    false
  );
  assert.equal(
    guardScenarioHandoffBoundary({ action: "handoff_to_war_room", source: "commit_to_action" })
      .allowed,
    true
  );
});

test("scenario may not execute commit package", () => {
  const blocked = guardScenarioCommitPackageExecution("scenario_workspace");
  assert.equal(blocked.allowed, false);
});

test("handoff view exposes dashboardContext scenario", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioGeneration({ selectedObjectLabel: "Factory A" });
  commitScenarioToWarRoom({
    scenarioId: "expected_case",
    createdAt: "2026-06-13T12:00:00.000Z",
  });
  const view = buildScenarioWorkspaceViewFromState(getScenarioWorkspaceState());
  assert.equal(view.handoff.dashboardContext, "scenario");
  assert.equal(view.handoff.question, SCENARIO_HANDOFF_QUESTION);
  assert.equal(view.handoff.handoffReady, true);
  assert.equal(view.handoff.preparesOnly, true);
});

test("commit package signature is stable", () => {
  const scenarios = deriveExecutiveScenarios(
    buildScenarioGenerationInput({ selectedObjectLabel: "Factory A" })
  );
  const scenario = findGeneratedScenarioById(scenarios, "expected_case");
  assert.ok(scenario);
  const commitPackage = buildScenarioCommitPackage(scenario, {
    scenarioId: "expected_case",
    selectedObjectId: "obj-a",
    createdAt: "2026-06-13T12:00:00.000Z",
  });
  assert.equal(
    buildScenarioCommitPackageSignature(commitPackage),
    buildScenarioCommitPackageSignature(commitPackage)
  );
});
