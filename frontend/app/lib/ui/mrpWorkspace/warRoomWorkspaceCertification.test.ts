/**
 * MRP:4F:6 — War Room workspace certification gate tests.
 *
 * Certification only — validates frozen War Room workspace architecture (MRP:4F:1–4F:5).
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_WAR_ROOM_WORKSPACE_OWNER,
  MRP_PHASE4F_COMPLETE_TAG,
  WAR_ROOM_CERTIFIED_TAG,
  WAR_ROOM_FOUNDATION_TAG,
  WAR_ROOM_WORKSPACE_SECTION_ORDER,
  WAR_ROOM_WORKSPACE_VERSION,
} from "./warRoom/warRoomWorkspaceContract.ts";
import {
  guardWarRoomCommitmentOwnershipBoundary,
  guardWarRoomForbiddenAction,
} from "./warRoom/warRoomBoundaryRuntime.ts";
import {
  guardWarRoomMonitoringForbiddenAction,
  syncWarRoomMonitoring,
} from "./warRoom/warRoomMonitoringRuntime.ts";
import { syncWarRoomActionPlan } from "./warRoom/warRoomActionPlanRuntime.ts";
import {
  guardWarRoomScenarioIntakeForbiddenAction,
  intakeScenarioCommitPackage,
} from "./warRoom/warRoomScenarioIntakeRuntime.ts";
import { getWarRoomState } from "./warRoom/warRoomStateRuntime.ts";
import {
  getWarRoomWorkspaceState,
  getWarRoomWorkspaceStateServerSnapshot,
  hydrateWarRoomWorkspaceStateOnMount,
} from "./warRoom/warRoomWorkspaceStateRuntime.ts";
import {
  resetWarRoomWorkspaceContextRuntimeForTests,
  syncWarRoomWorkspaceContext,
} from "./warRoom/warRoomWorkspaceContextRuntime.ts";
import {
  buildWarRoomWorkspaceView,
  resetWarRoomWorkspaceRuntimeForTests,
} from "./warRoom/warRoomWorkspaceRuntime.ts";
import { verifyNexoraRule11CertificationCompliance } from "./governance/nexoraRule11BoundaryRuntime.ts";
import { verifyNexoraRule13CertificationCompliance } from "./governance/nexoraRule13CommitmentOwnershipRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import { getExecutiveWorkspaceEntry } from "../../dashboard/executiveWorkspaceRegistryContract.ts";
import { resolveWorkspaceIdFromDashboardMode } from "../../dashboard/executiveWorkspaceLifecycleContract.ts";

test.beforeEach(() => {
  resetWarRoomWorkspaceContextRuntimeForTests();
  resetWarRoomWorkspaceRuntimeForTests();
});

test("exports certification freeze tags and version", () => {
  assert.equal(WAR_ROOM_CERTIFIED_TAG, "[MRP_WARROOM_CERTIFIED]");
  assert.equal(MRP_PHASE4F_COMPLETE_TAG, "[MRP_PHASE4F_COMPLETE]");
  assert.equal(WAR_ROOM_WORKSPACE_VERSION, "4F.6.0");
  assert.equal(WAR_ROOM_FOUNDATION_TAG, "[MRP_WARROOM_FOUNDATION]");
});

test("Gate A — workspace rendering", () => {
  hydrateWarRoomWorkspaceStateOnMount("cert-a");
  const view = buildWarRoomWorkspaceView();
  assert.equal(view.workspaceId, "war_room");
  assert.equal(CANONICAL_WAR_ROOM_WORKSPACE_OWNER, "WarRoomWorkspace");
  assert.equal(view.cards.length, 5);
  assert.deepEqual(
    view.cards.map((card) => card.id),
    [...WAR_ROOM_WORKSPACE_SECTION_ORDER]
  );
  assert.equal(view.ownsCommitmentOnly, true);

  const contextPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "war_room",
  });
  assert.equal(contextPlan.workspaceId, "war_room");
  assert.equal(contextPlan.mountTarget, "war_room_workspace");

  const modePlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "war_room",
    dashboardContext: "overview",
  });
  assert.equal(modePlan.mountTarget, "war_room_workspace");

  const entry = getExecutiveWorkspaceEntry("war_room");
  assert.equal(entry.availability, "available");
  assert.equal(entry.shellComponent, "WarRoomWorkspace");
  assert.equal(resolveWorkspaceIdFromDashboardMode("war_room"), "war_room");
});

test("Gate B — runtime state", () => {
  hydrateWarRoomWorkspaceStateOnMount("cert-b");
  const state = getWarRoomWorkspaceState();
  assert.equal(state.phase, "ready");
  assert.ok(state.signature.length > 0);
  assert.equal(state.actionPlanExecutionOwned, true);
  assert.equal(state.monitoringExecutionTracked, true);
  assert.equal(state.revision >= 0, true);

  const warRoomState = getWarRoomState();
  assert.ok(warRoomState.signature.length > 0);

  const loadingSnapshot = getWarRoomWorkspaceStateServerSnapshot();
  assert.equal(loadingSnapshot.phase, "loading");
});

test("Gate C — object context", () => {
  hydrateWarRoomWorkspaceStateOnMount("cert-c");
  syncWarRoomWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const state = getWarRoomWorkspaceState();
  assert.equal(state.workspaceContext.selectedObjectId, "factory-a");
  assert.equal(state.workspaceContext.hasSelection, true);
  assert.equal(state.workspaceContext.strategyFocus, "Operational resilience");

  syncWarRoomWorkspaceContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const deselected = getWarRoomWorkspaceState();
  assert.equal(deselected.workspaceContext.hasSelection, false);
  assert.match(deselected.workspaceContext.selectedObject, /No object selected/i);
});

test("Gate D — MRP integration", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "war_room",
  });
  assert.equal(plan.workspaceId, "war_room");
  assert.ok(plan.mountKey.includes("war_room_workspace"));
});

test("Gate E — scene awareness boundary (read-only object context integration)", () => {
  hydrateWarRoomWorkspaceStateOnMount("cert-e");
  syncWarRoomWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncWarRoomActionPlan();
  syncWarRoomMonitoring();

  const view = buildWarRoomWorkspaceView();
  assert.equal(view.workspaceContext.hasSelection, true);
  assert.equal(view.actionPlan.executionPlanningOwned, true);
  assert.equal(view.monitoring.executionTrackingOwned, true);
  assert.match(view.monitoring.purpose, /Track execution after commitment/);
  assert.equal(
    guardWarRoomForbiddenAction({ action: "modify_timeline", source: "cert-e" }).allowed,
    false
  );
});

test("Gate F — no runtime errors (guards and dedupe)", () => {
  hydrateWarRoomWorkspaceStateOnMount("cert-f");
  syncWarRoomWorkspaceContext({ selectedObjectLabel: "Factory A" });
  syncWarRoomActionPlan();
  syncWarRoomMonitoring();
  const before = getWarRoomWorkspaceState().revision;
  syncWarRoomActionPlan();
  syncWarRoomMonitoring();
  const after = getWarRoomWorkspaceState().revision;
  assert.equal(after, before);
});

test("Gate G — no hydration errors", () => {
  const preHydrate = buildWarRoomWorkspaceView();
  assert.equal(preHydrate.phase, "loading");
  assert.match(preHydrate.cards[0]?.headline ?? "", /Loading/i);

  hydrateWarRoomWorkspaceStateOnMount("cert-g");
  syncWarRoomWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncWarRoomActionPlan();
  syncWarRoomMonitoring();

  const postHydrate = buildWarRoomWorkspaceView();
  assert.equal(postHydrate.phase, "ready");
  assert.ok(postHydrate.actionPlan);
  assert.ok(postHydrate.monitoring);
});

test("Gate H — no context loss", () => {
  hydrateWarRoomWorkspaceStateOnMount("cert-h");
  syncWarRoomWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncWarRoomActionPlan();
  syncWarRoomMonitoring();
  const withSelection = getWarRoomWorkspaceState();

  syncWarRoomWorkspaceContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const afterDeselect = getWarRoomWorkspaceState();
  assert.equal(
    afterDeselect.actionPlanLayer.sections.length,
    withSelection.actionPlanLayer.sections.length
  );
  assert.equal(
    afterDeselect.monitoringLayer.watchItems.length,
    withSelection.monitoringLayer.watchItems.length
  );
});

test("Gate I — no timeline ownership violation", () => {
  assert.equal(
    guardWarRoomForbiddenAction({ action: "modify_timeline", source: "cert-i" }).allowed,
    false
  );
  assert.equal(
    guardWarRoomMonitoringForbiddenAction({ action: "modify_timeline", source: "cert-i" })
      .allowed,
    false
  );
});

test("Gate J — no scenario ownership violation", () => {
  assert.equal(
    guardWarRoomScenarioIntakeForbiddenAction({
      action: "regenerate_scenario",
      source: "cert-j",
    }).allowed,
    false
  );
  assert.equal(
    guardWarRoomScenarioIntakeForbiddenAction({
      action: "simulate_future",
      source: "cert-j",
    }).allowed,
    false
  );
  assert.equal(
    guardWarRoomForbiddenAction({ action: "generate_simulation", source: "cert-j" }).allowed,
    false
  );
});

test("Gate K — commitment ownership verified", () => {
  hydrateWarRoomWorkspaceStateOnMount("cert-k");
  syncWarRoomWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncWarRoomActionPlan();
  syncWarRoomMonitoring();

  const view = buildWarRoomWorkspaceView();
  assert.equal(view.ownsCommitmentOnly, true);
  assert.equal(view.actionPlan.executionPlanningOwned, true);
  assert.equal(view.monitoring.executionTrackingOwned, true);
  assert.equal(getWarRoomWorkspaceState().actionPlanExecutionOwned, true);
  assert.equal(getWarRoomWorkspaceState().monitoringExecutionTracked, true);
});

test("Gate L — Rule #13 compliance", () => {
  const result = verifyNexoraRule13CertificationCompliance("war_room");
  assert.equal(result.compliant, true);
  assert.equal(result.violations.length, 0);
  assert.equal(
    verifyNexoraRule11CertificationCompliance("war_room").compliant,
    true
  );
});

test("War Room validation matrix — handoff intake action plans and execution tracking", () => {
  hydrateWarRoomWorkspaceStateOnMount("cert-matrix");
  syncWarRoomWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });

  const intake = intakeScenarioCommitPackage(
    {
      scenarioId: "expected_case",
      title: "Expected Case",
      probability: "55%",
      impact: "Medium",
      confidence: "High",
      selectedObjectId: "factory-a",
      createdAt: "2026-06-13T12:00:00.000Z",
    },
    "cert-matrix"
  );

  assert.equal(intake.ok, true);
  assert.equal(intake.regeneratedScenario, false);
  assert.equal(intake.simulatedFuture, false);
  assert.ok(intake.activeDecisionId?.includes("expected_case"));

  const workspace = getWarRoomWorkspaceState();
  assert.match(workspace.strategySummary.detail, /MRP_WARROOM_HANDOFF/);
  assert.match(workspace.actionPlan.detail, /MRP_WARROOM_ACTION_PLAN/);
  assert.match(workspace.watchList.detail, /MRP_WARROOM_MONITORING/);

  assert.equal(
    guardWarRoomForbiddenAction({ action: "modify_timeline", source: "cert-matrix" }).allowed,
    false
  );
  assert.equal(
    guardWarRoomForbiddenAction({ action: "generate_simulation", source: "cert-matrix" }).allowed,
    false
  );
  assert.equal(
    guardWarRoomForbiddenAction({ action: "own_forecasting", source: "cert-matrix" }).allowed,
    false
  );
  assert.equal(
    guardWarRoomCommitmentOwnershipBoundary({
      action: "modify_timeline",
      source: "cert-matrix",
    }).allowed,
    false
  );
});
