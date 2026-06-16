import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_PHASE4E_COMPLETE_TAG,
  SCENARIO_CERTIFIED_TAG,
  SCENARIO_FOUNDATION_TAG,
  SCENARIO_WORKSPACE_SECTION_ORDER,
} from "./scenario/scenarioWorkspaceContract.ts";
import { guardScenarioForbiddenAction } from "./scenario/scenarioBoundaryRuntime.ts";
import {
  resetScenarioWorkspaceContextRuntimeForTests,
  syncScenarioWorkspaceContext,
} from "./scenario/scenarioWorkspaceContextRuntime.ts";
import { syncScenarioGeneration } from "./scenario/scenarioGenerationRuntime.ts";
import { syncScenarioComparison } from "./scenario/scenarioComparisonRuntime.ts";
import { syncScenarioProjection } from "./scenario/scenarioProjectionRuntime.ts";
import { commitScenarioToWarRoom } from "./scenario/scenarioHandoffRuntime.ts";
import { MRP_SCENARIO_GENERATION_TAG } from "./scenario/scenarioGenerationContract.ts";
import { MRP_SCENARIO_COMPARISON_TAG } from "./scenario/scenarioComparisonContract.ts";
import { MRP_SCENARIO_PROJECTION_TAG } from "./scenario/scenarioProjectionContract.ts";
import { MRP_SCENARIO_HANDOFF_TAG } from "./scenario/scenarioHandoffContract.ts";
import { hydrateScenarioWorkspaceStateOnMount } from "./scenario/scenarioWorkspaceStateRuntime.ts";
import {
  buildScenarioWorkspaceView,
  resetScenarioWorkspaceRuntimeForTests,
} from "./scenario/scenarioWorkspaceRuntime.ts";
import { verifyNexoraRule11CertificationCompliance } from "./governance/nexoraRule11BoundaryRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import { getExecutiveWorkspaceEntry } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveWorkspaceIdFromDashboardMode } from "../../dashboard/executiveWorkspaceLifecycleContract.ts";

test.beforeEach(() => {
  resetScenarioWorkspaceContextRuntimeForTests();
  resetScenarioWorkspaceRuntimeForTests();
});

test("buildScenarioWorkspaceView returns four foundation sections", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  const view = buildScenarioWorkspaceView();
  assert.equal(view.workspaceId, "scenario");
  assert.equal(view.cards.length, 4);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...SCENARIO_WORKSPACE_SECTION_ORDER]
  );
});

test("scenario cards use connected placeholder copy without action claims", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  const view = buildScenarioWorkspaceView();
  assert.equal(view.phase, "ready");
  assert.equal(view.source, "scenario_workspace_runtime_state");
  assert.equal(view.exploresFuturesOnly, true);
  for (const card of view.cards) {
    assert.match(card.detail, /MRP:4E:1/);
  }
});

test("scenario generation updates summary cards with generation tag", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioWorkspaceContext({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  const view = buildScenarioWorkspaceView();
  assert.equal(view.generation.scenarios.length, 3);
  assert.equal(view.generation.question, "What could happen?");
  assert.match(view.cards[0]?.detail ?? "", /MRP_SCENARIO_GENERATION/);
});

test("scenario comparison updates comparison card with comparison tag", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioWorkspaceContext({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioComparison();
  const view = buildScenarioWorkspaceView();
  assert.equal(view.comparison.matrix.columns.length, 3);
  assert.equal(view.comparison.dashboardContext, "scenario");
  assert.match(view.cards[2]?.detail ?? "", /MRP_SCENARIO_COMPARISON/);
});

test("scenario projection updates future projection card with projection tag", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioWorkspaceContext({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioComparison();
  syncScenarioProjection();
  const view = buildScenarioWorkspaceView();
  assert.equal(view.projection.layer.trends.length, 3);
  assert.equal(view.projection.question, "What might happen next?");
  assert.match(view.cards[3]?.detail ?? "", /MRP_SCENARIO_PROJECTION/);
});

test("scenario handoff updates summary with handoff tag", () => {
  hydrateScenarioWorkspaceStateOnMount("test");
  syncScenarioWorkspaceContext({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "a",
    selectedObjectLabel: "Factory A",
  });
  commitScenarioToWarRoom({
    scenarioId: "expected_case",
    selectedObjectId: "a",
    createdAt: "2026-06-13T12:00:00.000Z",
  });
  const view = buildScenarioWorkspaceView();
  assert.equal(view.handoff.handoffReady, true);
  assert.equal(view.handoff.question, "Which future should we prepare for?");
  assert.match(view.cards[0]?.detail ?? "", /MRP_SCENARIO_HANDOFF/);
});

test("exports scenario handoff tag", () => {
  assert.equal(MRP_SCENARIO_HANDOFF_TAG, "[MRP_SCENARIO_HANDOFF]");
});

test("exports scenario comparison tag", () => {
  assert.equal(MRP_SCENARIO_COMPARISON_TAG, "[MRP_SCENARIO_COMPARISON]");
});

test("exports scenario projection tag", () => {
  assert.equal(MRP_SCENARIO_PROJECTION_TAG, "[MRP_SCENARIO_PROJECTION]");
});

test("exports scenario generation tag", () => {
  assert.equal(MRP_SCENARIO_GENERATION_TAG, "[MRP_SCENARIO_GENERATION]");
});

test("scenario context mounts scenario workspace in dynamic zone", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "scenario",
  });
  assert.equal(plan.workspaceId, "scenario");
  assert.equal(plan.mountTarget, "scenario_workspace");
  assert.ok(plan.mountKey.includes("scenario_workspace"));
});

test("scenario dashboard mode mounts scenario workspace foundation", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "scenario",
    dashboardContext: "overview",
  });
  assert.equal(plan.workspaceId, "scenario");
  assert.equal(plan.mountTarget, "scenario_workspace");
});

test("executive registry exposes available scenario workspace", () => {
  const entry = getExecutiveWorkspaceEntry("scenario");
  assert.equal(entry.availability, "available");
  assert.equal(entry.dashboardMode, "scenario");
  assert.equal(entry.shellComponent, "ScenarioWorkspace");
});

test("lifecycle resolves scenario workspace from dashboard mode", () => {
  assert.equal(resolveWorkspaceIdFromDashboardMode("scenario"), "scenario");
});

test("exports foundation tag", () => {
  assert.equal(SCENARIO_FOUNDATION_TAG, "[MRP_SCENARIO_FOUNDATION]");
});

test("exports certification freeze tags", () => {
  assert.equal(SCENARIO_CERTIFIED_TAG, "[MRP_SCENARIO_CERTIFIED]");
  assert.equal(MRP_PHASE4E_COMPLETE_TAG, "[MRP_PHASE4E_COMPLETE]");
});

test("blocks scenario forbidden actions under Rule #11", () => {
  for (const action of ["execute_action", "modify_timeline", "open_war_room_automatically"] as const) {
    const blocked = guardScenarioForbiddenAction({ action, source: "test" });
    assert.equal(blocked.allowed, false, action);
  }
});

test("scenario workspace satisfies Rule #11 certification compliance", () => {
  const result = verifyNexoraRule11CertificationCompliance("scenario");
  assert.equal(result.compliant, true);
  assert.equal(result.violations.length, 0);
});

test("loading phase maps loading copy before hydrate completes", () => {
  const view = buildScenarioWorkspaceView();
  assert.equal(view.phase, "loading");
  assert.match(view.cards[0]?.headline ?? "", /Loading/);
});
