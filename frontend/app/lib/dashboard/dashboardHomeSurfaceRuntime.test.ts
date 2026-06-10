import test from "node:test";
import assert from "node:assert/strict";

import { buildDashboardHomeSurfaceView } from "./dashboardHomeSurfaceRuntime.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "./executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "./executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceNavigationHistoryRuntimeForTests } from "./executiveWorkspaceNavigationHistoryRuntime.ts";
import { resetExecutiveWorkspaceNavigationHistoryForTests } from "./executiveWorkspaceNavigationHistoryContract.ts";

test.beforeEach(() => {
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
});

test("dashboard home defaults to overview landing view", () => {
  const view = buildDashboardHomeSurfaceView({ dashboardMode: "overview" });
  assert.equal(view.status.isHomeMode, true);
  assert.equal(view.status.dashboardMode, "overview");
});

test("dashboard home empty object state without noisy context resolution", () => {
  const view = buildDashboardHomeSurfaceView({
    dashboardMode: "overview",
    selectedObjectId: null,
  });
  assert.equal(view.status.hasSelectedObject, false);
  assert.equal(view.status.selectedObjectLabel, null);
});

test("dashboard home status includes selected object", () => {
  const view = buildDashboardHomeSurfaceView({
    dashboardMode: "overview",
    selectedObjectId: "line-3",
    selectedObjectLabel: "Line 3",
  });
  assert.equal(view.status.hasSelectedObject, true);
  assert.equal(view.status.selectedObjectLabel, "Line 3");
});
