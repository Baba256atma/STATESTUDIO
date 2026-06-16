import test from "node:test";
import assert from "node:assert/strict";

import type { ScenarioCommitPackage } from "./scenario/scenarioHandoffContract.ts";
import {
  WAR_ROOM_SCENARIO_INTAKE_TAG,
  WAR_ROOM_SCENARIO_INTAKE_VERSION,
} from "./warRoom/warRoomScenarioIntakeContract.ts";
import {
  buildActiveDecisionIdFromPackage,
  buildWarRoomIntakeStrategySummarySnapshot,
  validateScenarioCommitPackage,
} from "./warRoom/warRoomScenarioIntakeResolver.ts";
import {
  getWarRoomScenarioHandoffState,
  resetWarRoomScenarioHandoffRuntimeForTests,
} from "./warRoom/warRoomScenarioHandoffRuntime.ts";
import {
  guardWarRoomScenarioIntakeForbiddenAction,
  intakeScenarioCommitPackage,
  resetWarRoomScenarioIntakeRuntimeForTests,
} from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomActionPlanRuntimeForTests } from "./warRoom/warRoomActionPlanRuntime.ts";
import {
  getWarRoomState,
  resetWarRoomStateRuntimeForTests,
} from "./warRoom/warRoomStateRuntime.ts";
import {
  getWarRoomWorkspaceState,
  hydrateWarRoomWorkspaceStateOnMount,
  resetWarRoomWorkspaceStateRuntimeForTests,
} from "./warRoom/warRoomWorkspaceStateRuntime.ts";
import { syncWarRoomWorkspaceContext } from "./warRoom/warRoomWorkspaceContextRuntime.ts";
import { commitScenarioToWarRoom } from "./scenario/scenarioHandoffRuntime.ts";
import { resetScenarioHandoffRuntimeForTests } from "./scenario/scenarioHandoffRuntime.ts";
import {
  hydrateScenarioWorkspaceStateOnMount,
  resetScenarioWorkspaceStateRuntimeForTests,
} from "./scenario/scenarioWorkspaceStateRuntime.ts";
import { syncScenarioGeneration } from "./scenario/scenarioGenerationRuntime.ts";
import { syncScenarioWorkspaceContext } from "./scenario/scenarioWorkspaceContextRuntime.ts";

const VALID_PACKAGE: ScenarioCommitPackage = Object.freeze({
  scenarioId: "expected_case",
  title: "Expected Case",
  probability: "55%",
  impact: "Medium",
  confidence: "High",
  selectedObjectId: "obj-1",
  createdAt: "2026-06-13T12:00:00.000Z",
});

test.beforeEach(() => {
  resetWarRoomScenarioIntakeRuntimeForTests();
  resetWarRoomScenarioHandoffRuntimeForTests();
  resetWarRoomActionPlanRuntimeForTests();
  resetWarRoomStateRuntimeForTests();
  resetWarRoomWorkspaceStateRuntimeForTests();
  resetScenarioHandoffRuntimeForTests();
  resetScenarioWorkspaceStateRuntimeForTests();
});

test("exports handoff intake freeze tag", () => {
  assert.equal(WAR_ROOM_SCENARIO_INTAKE_TAG, "[MRP_WARROOM_HANDOFF]");
  assert.equal(WAR_ROOM_SCENARIO_INTAKE_VERSION, "4F.3.0");
});

test("validateScenarioCommitPackage requires all commit package fields", () => {
  const valid = validateScenarioCommitPackage(VALID_PACKAGE);
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, []);

  const invalid = validateScenarioCommitPackage({
    ...VALID_PACKAGE,
    title: "  ",
    probability: "",
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.some((error) => error.includes("title")));
  assert.ok(invalid.errors.some((error) => error.includes("probability")));
});

test("intakeScenarioCommitPackage accepts valid package and stores handoff", () => {
  const result = intakeScenarioCommitPackage(VALID_PACKAGE, "test");

  assert.equal(result.ok, true);
  assert.equal(result.regeneratedScenario, false);
  assert.equal(result.simulatedFuture, false);
  assert.equal(result.activeDecisionId, "decision:obj-1:expected_case");
  assert.equal(getWarRoomScenarioHandoffState().commitPackage?.title, "Expected Case");
});

test("intakeScenarioCommitPackage creates active decision in war room state", () => {
  intakeScenarioCommitPackage(VALID_PACKAGE, "test");
  const state = getWarRoomState();

  assert.equal(state.activeDecisionId, "decision:obj-1:expected_case");
  assert.equal(state.activeScenarioId, "expected_case");
  assert.equal(state.selectedStrategy, "Expected Case");
  assert.equal(state.status, "review");
  assert.equal(state.actionPlanIds.length, 1);
  assert.equal(state.watchListIds.length, 1);
});

test("intakeScenarioCommitPackage populates strategy summary with handoff tag", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-1",
    selectedObjectLabel: "Factory A",
  });
  intakeScenarioCommitPackage(VALID_PACKAGE, "test");

  const workspace = getWarRoomWorkspaceState();
  assert.match(workspace.strategySummary.headline, /Prepared strategy: Expected Case/);
  assert.match(workspace.strategySummary.detail, /MRP_WARROOM_HANDOFF/);
  assert.match(workspace.strategySummary.detail, /no scenario regeneration/);
  assert.match(workspace.activeDecision.detail, /Active decision created/);
});

test("intakeScenarioCommitPackage rejects invalid packages", () => {
  const result = intakeScenarioCommitPackage(
    {
      ...VALID_PACKAGE,
      scenarioId: "invalid" as ScenarioCommitPackage["scenarioId"],
    },
    "test"
  );

  assert.equal(result.ok, false);
  assert.match(result.reason ?? "", /scenarioId/);
});

test("intake guards block regenerate scenario and simulate future actions", () => {
  assert.equal(
    guardWarRoomScenarioIntakeForbiddenAction({
      action: "regenerate_scenario",
      source: "test",
    }).allowed,
    false
  );
  assert.equal(
    guardWarRoomScenarioIntakeForbiddenAction({
      action: "simulate_future",
      source: "test",
    }).allowed,
    false
  );
});

test("commitScenarioToWarRoom routes through war room scenario intake", () => {
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
  assert.equal(getWarRoomState().activeScenarioId, "worst_case");
  assert.equal(getWarRoomState().status, "review");
  assert.match(getWarRoomWorkspaceState().strategySummary.detail, /MRP_WARROOM_HANDOFF/);
});

test("buildActiveDecisionIdFromPackage uses object and scenario segments", () => {
  assert.equal(
    buildActiveDecisionIdFromPackage(VALID_PACKAGE),
    "decision:obj-1:expected_case"
  );
  assert.equal(
    buildActiveDecisionIdFromPackage({
      ...VALID_PACKAGE,
      selectedObjectId: null,
    }),
    "decision:objectless:expected_case"
  );
});

test("buildWarRoomIntakeStrategySummarySnapshot includes probability impact confidence", () => {
  const snapshot = buildWarRoomIntakeStrategySummarySnapshot(VALID_PACKAGE);
  assert.match(snapshot.detail, /55%/);
  assert.match(snapshot.detail, /Medium/);
  assert.match(snapshot.detail, /High/);
});

test("hydrated war room workspace reflects prior intake on mount", () => {
  syncWarRoomWorkspaceContext({
    selectedObjectId: "obj-1",
    selectedObjectLabel: "Factory A",
  });
  intakeScenarioCommitPackage(VALID_PACKAGE, "test");
  hydrateWarRoomWorkspaceStateOnMount("mount");

  assert.match(getWarRoomWorkspaceState().strategySummary.detail, /MRP_WARROOM_HANDOFF/);
  assert.equal(getWarRoomState().activeDecisionId, "decision:obj-1:expected_case");
});
