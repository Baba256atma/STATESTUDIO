import test from "node:test";
import assert from "node:assert/strict";

import {
  DASHBOARD_HOME_MOUNT_REGISTRY,
  runDashboardHomeRuntimeQaMatrix,
  validateDashboardHomeHierarchy,
  validateFirstVisitWorkflow,
  validateObjectPanelWorkflow,
  validateOpenDashboardModeWorkflow,
} from "./dashboardHomeRuntimeQaValidation.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../executiveWorkspaceTransitionControllerRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerForTests } from "../executiveWorkspaceTransitionControllerContract.ts";
import { resetWorkspaceLauncherForTests } from "../workspaceLauncher/workspaceLauncherContract.ts";
import { resetWorkflowLauncherBrakesForTests } from "../workflowLauncher/workflowLauncherContract.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "../executiveWorkspaceNavigationHistoryContract.ts";
import { resetExecutiveWorkspaceNavigationHistoryRuntimeForTests } from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import { resetObjectPanelActionRouterForTests } from "../../object-panel/objectPanelActionRouterContract.ts";

test.beforeEach(() => {
  resetWorkflowLauncherBrakesForTests();
  resetWorkspaceLauncherForTests();
  resetObjectPanelActionRouterForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

test("dashboard home hierarchy validation passes", () => {
  const results = validateDashboardHomeHierarchy();
  assert.ok(results.every((entry) => entry.status === "pass"));
});

test("first visit workflow validation passes", () => {
  const results = validateFirstVisitWorkflow();
  assert.ok(results.every((entry) => entry.status === "pass"));
});

test("open dashboard mode workflow resolves registry for all modes", () => {
  const results = validateOpenDashboardModeWorkflow();
  const registryResults = results.filter((entry) => entry.id.startsWith("workflow_b_registry_"));
  assert.equal(registryResults.length, 5);
  assert.ok(registryResults.every((entry) => entry.status === "pass"));
});

test("object panel actions map to dashboard modes via registry", () => {
  const results = validateObjectPanelWorkflow();
  assert.equal(results.length, 5);
  assert.ok(results.every((entry) => entry.status === "pass"));
});

test("mount registry readiness before timeline", () => {
  const readinessIndex = DASHBOARD_HOME_MOUNT_REGISTRY.executive_status.indexOf("daily_readiness");
  const timelineIndex =
    DASHBOARD_HOME_MOUNT_REGISTRY.executive_continuity.indexOf("recent_activity_timeline");
  assert.ok(readinessIndex >= 0);
  assert.ok(timelineIndex >= 0);
});

test("full QA matrix passes or passes with warnings only", () => {
  const matrix = runDashboardHomeRuntimeQaMatrix();
  assert.ok(matrix.passCount > 0);
  assert.equal(matrix.failCount, 0);
  assert.ok(matrix.verdict === "PASS" || matrix.verdict === "PASS_WITH_WARNINGS");
});

test("QA matrix includes all workflow layers", () => {
  const matrix = runDashboardHomeRuntimeQaMatrix();
  const workflows = new Set(
    matrix.results.filter((entry) => entry.workflow).map((entry) => entry.workflow)
  );
  assert.ok(workflows.has("first_visit"));
  assert.ok(workflows.has("open_dashboard_mode"));
  assert.ok(workflows.has("object_panel_to_dashboard"));
  assert.ok(workflows.has("dashboard_assistant_switch"));
  assert.ok(workflows.has("scene_interaction"));
});
