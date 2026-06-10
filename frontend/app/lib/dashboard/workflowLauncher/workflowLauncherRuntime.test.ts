import test from "node:test";
import assert from "node:assert/strict";

import {
  WORKFLOW_LAUNCHER_ACTION_DEFINITIONS,
  resetWorkflowLauncherBrakesForTests,
} from "./workflowLauncherContract.ts";
import {
  WORKFLOW_LAUNCHER_APPROVED_DESTINATIONS,
  WORKFLOW_LAUNCHER_LEGACY_ISOLATION,
} from "./workflowLauncherLegacyFindings.ts";
import {
  buildRecentWorkflowSessions,
  buildWorkflowLauncherView,
  getWorkflowLauncherActionTargetWorkspace,
  resolveReturnToWorkspaceTarget,
} from "./workflowLauncherRuntime.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../executiveWorkspaceLifecycleRuntime.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "../executiveWorkspaceNavigationHistoryContract.ts";
import {
  initializeExecutiveWorkspaceNavigationHistory,
  recordForwardNavigationAfterCommit,
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
} from "../executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceTransitionControllerForTests,
} from "../executiveWorkspaceTransitionControllerContract.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../executiveWorkspaceTransitionControllerRuntime.ts";
import { requestWorkspaceLaunch } from "../workspaceLauncher/workspaceLauncherRuntime.ts";
import { resetWorkspaceLauncherForTests } from "../workspaceLauncher/workspaceLauncherContract.ts";

test.beforeEach(() => {
  resetWorkflowLauncherBrakesForTests();
  resetWorkspaceLauncherForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

function seedNavigation(to: "analyze" | "compare" | "scenario" | "war_room", objectId = "line-1"): void {
  initializeExecutiveWorkspaceNavigationHistory();
  const request = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: to,
    objectId,
    objectName: "Line 1",
  });
  assert.equal(request.approved, true, to);
  const commit = commitExecutiveWorkspaceTransition(to);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: to,
  });
}

test("launcher contract defines six static quick actions", () => {
  assert.equal(WORKFLOW_LAUNCHER_ACTION_DEFINITIONS.length, 6);
  const ids = WORKFLOW_LAUNCHER_ACTION_DEFINITIONS.map((entry) => entry.id);
  assert.ok(ids.includes("analyze_system"));
  assert.ok(ids.includes("compare_scenarios"));
  assert.ok(ids.includes("run_scenario"));
  assert.ok(ids.includes("open_war_room"));
  assert.ok(ids.includes("review_recommendations"));
  assert.ok(ids.includes("return_to_workspace"));
});

test("workspace launch actions require selected object", () => {
  const view = buildWorkflowLauncherView({
    activeWorkspaceId: "overview",
    selectedObjectId: null,
  });

  const analyze = view.actions.find((entry) => entry.id === "analyze_system");
  assert.equal(analyze?.enabled, false);
  assert.match(analyze?.disabledReason ?? "", /Select a scene object/i);
});

test("workspace launch actions enable with selected object", () => {
  const view = buildWorkflowLauncherView({
    activeWorkspaceId: "overview",
    selectedObjectId: "line-1",
  });

  const analyze = view.actions.find((entry) => entry.id === "analyze_system");
  assert.equal(analyze?.enabled, true);
  assert.equal(analyze?.handler, "workspace_launch");
  assert.equal(analyze?.targetWorkspaceId, "analyze");
});

test("review recommendations is always enabled without routing target", () => {
  const view = buildWorkflowLauncherView({
    activeWorkspaceId: "overview",
    selectedObjectId: null,
  });
  const review = view.actions.find((entry) => entry.id === "review_recommendations");
  assert.equal(review?.enabled, true);
  assert.equal(review?.handler, "focus_recommendations");
  assert.equal(review?.targetWorkspaceId, null);
});

test("return to workspace disabled without navigation history", () => {
  const view = buildWorkflowLauncherView({
    activeWorkspaceId: "overview",
    selectedObjectId: "line-1",
  });
  const returnAction = view.actions.find((entry) => entry.id === "return_to_workspace");
  assert.equal(returnAction?.enabled, false);
});

test("recent workflow sessions empty without history", () => {
  const sessions = buildRecentWorkflowSessions({
    activeWorkspaceId: "overview",
    selectedObjectId: "line-1",
  });
  assert.equal(sessions.length, 0);
});

test("recent workflow sessions project dedicated workspace history", () => {
  seedNavigation("analyze");
  seedNavigation("war_room");

  const sessions = buildRecentWorkflowSessions({
    activeWorkspaceId: "overview",
    selectedObjectId: "line-1",
  });

  assert.ok(sessions.length >= 2);
  assert.ok(sessions.some((entry) => entry.workspaceId === "analyze"));
  assert.ok(sessions.some((entry) => entry.workspaceId === "war_room"));
  assert.match(sessions[0]?.sessionLabel ?? "", /Last .* Session/);
});

test("resolveReturnToWorkspaceTarget uses navigation history on overview", () => {
  seedNavigation("analyze");
  seedNavigation("war_room");

  const target = resolveReturnToWorkspaceTarget({
    activeWorkspaceId: "overview",
    selectedObjectId: "line-1",
  });

  assert.ok(target);
  assert.equal(target.workspaceId, "analyze");
});

test("workspace launch disabled when already active", () => {
  const view = buildWorkflowLauncherView({
    activeWorkspaceId: "analyze",
    selectedObjectId: "line-1",
  });
  const analyze = view.actions.find((entry) => entry.id === "analyze_system");
  assert.equal(analyze?.enabled, false);
  assert.match(analyze?.disabledReason ?? "", /Already in this workspace/i);
});

test("getWorkflowLauncherActionTargetWorkspace maps analyze action", () => {
  assert.equal(getWorkflowLauncherActionTargetWorkspace("analyze_system"), "analyze");
  assert.equal(getWorkflowLauncherActionTargetWorkspace("review_recommendations"), null);
});

test("legacy isolation documents approved routing only", () => {
  assert.equal(WORKFLOW_LAUNCHER_LEGACY_ISOLATION.dashboardContextRouter.status, "not_used_by_workflow_launcher");
  assert.equal(WORKFLOW_LAUNCHER_LEGACY_ISOLATION.rightPanelRouter.status, "not_used_by_workflow_launcher");
  assert.ok(WORKFLOW_LAUNCHER_APPROVED_DESTINATIONS.includes("analyze"));
  assert.ok(WORKFLOW_LAUNCHER_APPROVED_DESTINATIONS.includes("dashboard_home_recommendations_section"));
});
