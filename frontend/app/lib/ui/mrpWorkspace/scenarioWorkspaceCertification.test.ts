/**
 * MRP:4E:6 — Scenario workspace certification gate tests.
 *
 * Certification only — validates frozen Scenario workspace architecture (MRP:4E:1–4E:5).
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_SCENARIO_WORKSPACE_OWNER,
  MRP_PHASE4E_COMPLETE_TAG,
  SCENARIO_CERTIFIED_TAG,
  SCENARIO_FOUNDATION_TAG,
  SCENARIO_WORKSPACE_SECTION_ORDER,
  SCENARIO_WORKSPACE_VERSION,
} from "./scenario/scenarioWorkspaceContract.ts";
import {
  guardScenarioForbiddenAction,
  guardScenarioHandoffBoundary,
} from "./scenario/scenarioBoundaryRuntime.ts";
import { guardScenarioCommitPackageExecution } from "./scenario/scenarioHandoffRuntime.ts";
import { commitScenarioToWarRoom } from "./scenario/scenarioHandoffRuntime.ts";
import { syncScenarioComparison } from "./scenario/scenarioComparisonRuntime.ts";
import { syncScenarioGeneration } from "./scenario/scenarioGenerationRuntime.ts";
import { syncScenarioProjection } from "./scenario/scenarioProjectionRuntime.ts";
import {
  getScenarioWorkspaceState,
  getScenarioWorkspaceStateServerSnapshot,
  hydrateScenarioWorkspaceStateOnMount,
  resetScenarioWorkspaceStateRuntimeForTests,
} from "./scenario/scenarioWorkspaceStateRuntime.ts";
import {
  resetScenarioWorkspaceContextRuntimeForTests,
  syncScenarioWorkspaceContext,
} from "./scenario/scenarioWorkspaceContextRuntime.ts";
import {
  buildScenarioWorkspaceView,
  resetScenarioWorkspaceRuntimeForTests,
} from "./scenario/scenarioWorkspaceRuntime.ts";
import { verifyNexoraRule11CertificationCompliance } from "./governance/nexoraRule11BoundaryRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import { getExecutiveWorkspaceEntry } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveWorkspaceIdFromDashboardMode } from "../../dashboard/executiveWorkspaceLifecycleContract.ts";
import {
  consumeWarRoomScenarioCommitPackage,
  getWarRoomScenarioHandoffState,
  resetWarRoomScenarioHandoffRuntimeForTests,
} from "./warRoom/warRoomScenarioHandoffRuntime.ts";

test.beforeEach(() => {
  resetScenarioWorkspaceContextRuntimeForTests();
  resetScenarioWorkspaceRuntimeForTests();
  resetWarRoomScenarioHandoffRuntimeForTests();
});

test("exports certification freeze tags and version", () => {
  assert.equal(SCENARIO_CERTIFIED_TAG, "[MRP_SCENARIO_CERTIFIED]");
  assert.equal(MRP_PHASE4E_COMPLETE_TAG, "[MRP_PHASE4E_COMPLETE]");
  assert.equal(SCENARIO_WORKSPACE_VERSION, "4E.6.0");
  assert.equal(SCENARIO_FOUNDATION_TAG, "[MRP_SCENARIO_FOUNDATION]");
});

test("Gate A — workspace rendering", () => {
  hydrateScenarioWorkspaceStateOnMount("cert-a");
  const view = buildScenarioWorkspaceView();
  assert.equal(view.workspaceId, "scenario");
  assert.equal(CANONICAL_SCENARIO_WORKSPACE_OWNER, "ScenarioWorkspace");
  assert.equal(view.cards.length, 4);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...SCENARIO_WORKSPACE_SECTION_ORDER]
  );
  assert.equal(view.exploresFuturesOnly, true);

  const contextPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "scenario",
  });
  assert.equal(contextPlan.workspaceId, "scenario");
  assert.equal(contextPlan.mountTarget, "scenario_workspace");

  const modePlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "scenario",
    dashboardContext: "overview",
  });
  assert.equal(modePlan.mountTarget, "scenario_workspace");

  const entry = getExecutiveWorkspaceEntry("scenario");
  assert.equal(entry.availability, "available");
  assert.equal(entry.shellComponent, "ScenarioWorkspace");
  assert.equal(resolveWorkspaceIdFromDashboardMode("scenario"), "scenario");
});

test("Gate B — runtime state", () => {
  hydrateScenarioWorkspaceStateOnMount("cert-b");
  const state = getScenarioWorkspaceState();
  assert.equal(state.phase, "ready");
  assert.ok(state.signature.length > 0);
  assert.equal(state.generationReadOnly, true);
  assert.equal(state.comparisonReadOnly, true);
  assert.equal(state.projectionReadOnly, true);
  assert.equal(state.revision >= 0, true);

  const loadingSnapshot = getScenarioWorkspaceStateServerSnapshot();
  assert.equal(loadingSnapshot.phase, "loading");
});

test("Gate C — object context", () => {
  hydrateScenarioWorkspaceStateOnMount("cert-c");
  syncScenarioWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const state = getScenarioWorkspaceState();
  assert.equal(state.workspaceContext.selectedObjectId, "factory-a");
  assert.equal(state.workspaceContext.hasSelection, true);
  assert.ok(state.workspaceContext.explorationScope.length > 0);
  assert.ok(state.workspaceContext.projectionHorizon.length > 0);

  syncScenarioWorkspaceContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const deselected = getScenarioWorkspaceState();
  assert.equal(deselected.workspaceContext.hasSelection, false);
  assert.match(deselected.workspaceContext.selectedObject, /No object selected/i);
});

test("Gate D — MRP integration", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "scenario",
  });
  assert.equal(plan.workspaceId, "scenario");
  assert.ok(plan.mountKey.includes("scenario_workspace"));
});

test("Gate E — scene awareness boundary (read-only upstream integration)", () => {
  hydrateScenarioWorkspaceStateOnMount("cert-e");
  syncScenarioWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const state = getScenarioWorkspaceState();
  assert.equal(state.generatedScenarios.length, 3);
  assert.match(state.scenarioSummary.detail, /read-only Risk and Timeline/i);
  assert.equal(
    guardScenarioForbiddenAction({ action: "modify_timeline", source: "cert-e" }).allowed,
    false
  );
});

test("Gate F — no runtime errors (guards and dedupe)", () => {
  hydrateScenarioWorkspaceStateOnMount("cert-f");
  syncScenarioWorkspaceContext({ selectedObjectLabel: "Factory A" });
  syncScenarioGeneration({ selectedObjectLabel: "Factory A" });
  syncScenarioComparison();
  syncScenarioProjection();
  const before = getScenarioWorkspaceState().revision;
  syncScenarioComparison();
  syncScenarioProjection();
  const after = getScenarioWorkspaceState().revision;
  assert.equal(after, before);
});

test("Gate G — no hydration errors", () => {
  const preHydrate = buildScenarioWorkspaceView();
  assert.equal(preHydrate.phase, "loading");
  assert.match(preHydrate.cards[0]?.headline ?? "", /Loading/i);

  hydrateScenarioWorkspaceStateOnMount("cert-g");
  const postHydrate = buildScenarioWorkspaceView();
  assert.equal(postHydrate.phase, "ready");
  assert.ok(postHydrate.generation);
  assert.ok(postHydrate.comparison);
  assert.ok(postHydrate.projection);
  assert.ok(postHydrate.handoff);
});

test("Gate H — no context loss", () => {
  hydrateScenarioWorkspaceStateOnMount("cert-h");
  syncScenarioWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const withSelection = getScenarioWorkspaceState();
  syncScenarioWorkspaceContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const afterDeselect = getScenarioWorkspaceState();
  assert.equal(afterDeselect.generatedScenarios.length, withSelection.generatedScenarios.length);
  assert.equal(afterDeselect.comparisonMatrix.columns.length, withSelection.comparisonMatrix.columns.length);
});

test("Gate I — no timeline ownership violation", () => {
  assert.equal(
    guardScenarioForbiddenAction({ action: "modify_timeline", source: "cert-i" }).allowed,
    false
  );
});

test("Gate J — no war room ownership violation", () => {
  assert.equal(
    guardScenarioForbiddenAction({ action: "execute_action", source: "cert-j" }).allowed,
    false
  );
  assert.equal(
    guardScenarioForbiddenAction({
      action: "open_war_room_automatically",
      source: "cert-j",
    }).allowed,
    false
  );
  assert.equal(
    guardScenarioCommitPackageExecution("cert-j").allowed,
    false
  );
});

test("Gate K — scenario generates futures only", () => {
  hydrateScenarioWorkspaceStateOnMount("cert-k");
  syncScenarioGeneration({ selectedObjectLabel: "Factory A" });
  const view = buildScenarioWorkspaceView();
  assert.equal(view.exploresFuturesOnly, true);
  assert.equal(view.generation.readOnly, true);
  assert.equal(view.comparison.readOnly, true);
  assert.equal(view.projection.readOnly, true);
  assert.equal(view.handoff.preparesOnly, true);
});

test("Gate L — Rule #11 compliance", () => {
  const result = verifyNexoraRule11CertificationCompliance("scenario");
  assert.equal(result.compliant, true);
  assert.equal(result.violations.length, 0);
});

test("Scenario validation matrix — forecasts compares handoffs without execution", () => {
  hydrateScenarioWorkspaceStateOnMount("cert-matrix");
  syncScenarioWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioGeneration({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncScenarioComparison();
  syncScenarioProjection();

  const view = buildScenarioWorkspaceView();
  assert.equal(view.generation.scenarios.length, 3);
  assert.equal(view.comparison.matrix.rows.length, 5);
  assert.equal(view.projection.layer.trends.length, 3);

  const handoff = commitScenarioToWarRoom({
    scenarioId: "expected_case",
    selectedObjectId: "factory-a",
    createdAt: "2026-06-13T12:00:00.000Z",
  });
  assert.equal(handoff.ok, true);
  assert.ok(consumeWarRoomScenarioCommitPackage());
  assert.equal(getWarRoomScenarioHandoffState().executionBlocked, true);
  assert.equal(
    guardScenarioHandoffBoundary({ action: "handoff_to_war_room", source: "cert-matrix" }).allowed,
    true
  );
  assert.equal(
    guardScenarioForbiddenAction({ action: "execute_action", source: "cert-matrix" }).allowed,
    false
  );
  assert.equal(
    guardScenarioForbiddenAction({ action: "modify_timeline", source: "cert-matrix" }).allowed,
    false
  );
});
