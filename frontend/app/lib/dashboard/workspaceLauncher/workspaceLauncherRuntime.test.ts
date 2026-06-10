import test from "node:test";
import assert from "node:assert/strict";

import {
  buildWorkspaceLauncherState,
  listLauncherCatalogEntries,
  requestWorkspaceLaunch,
} from "./workspaceLauncherRuntime.ts";
import { resetWorkspaceLauncherForTests } from "./workspaceLauncherContract.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "../executiveWorkspaceNavigationHistoryContract.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
} from "../executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceTransitionControllerForTests,
} from "../executiveWorkspaceTransitionControllerContract.ts";
import {
  initializeExecutiveWorkspaceNavigationHistory,
  recordForwardNavigationAfterCommit,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";

test.beforeEach(() => {
  resetWorkspaceLauncherForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

function launchAndCommit(
  workspace: "analyze" | "compare" | "scenario" | "war_room",
  objectId = "line-1"
): void {
  const request = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: workspace,
    objectId,
    objectName: "Line 1",
  });
  assert.equal(request.approved, true, workspace);
  const commit = commitExecutiveWorkspaceTransition(workspace);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: workspace,
  });
}

test("launcher catalog is registry-driven with analyze, compare, scenario, war room", () => {
  const entries = listLauncherCatalogEntries();
  const ids = entries.map((entry) => entry.id);
  assert.ok(ids.includes("analyze"));
  assert.ok(ids.includes("compare"));
  assert.ok(ids.includes("scenario"));
  assert.ok(ids.includes("war_room"));
  assert.ok(ids.includes("risk"));
  assert.equal(ids.includes("overview"), false);
});

test("buildWorkspaceLauncherState exposes active and recent workspace", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchAndCommit("analyze");
  launchAndCommit("compare");

  const state = buildWorkspaceLauncherState("compare");
  assert.equal(state.activeWorkspaceId, "compare");
  assert.equal(state.recentWorkspaceId, "analyze");
  assert.ok(state.cards.some((card) => card.workspaceId === "war_room"));
});

test("validation matrix: launch analyze, compare, scenario, war room", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchAndCommit("analyze");
  launchAndCommit("compare");
  launchAndCommit("scenario");
  launchAndCommit("war_room");
  launchAndCommit("analyze");

  const state = buildWorkspaceLauncherState("analyze");
  const activeCard = state.cards.find((card) => card.workspaceId === "analyze");
  assert.equal(activeCard?.isActive, true);
});

test("rejects launching currently active workspace", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchAndCommit("analyze");

  const repeat = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "analyze",
    objectId: "line-1",
  });
  assert.equal(repeat.approved, false);
  assert.equal(repeat.reason, "already_active");
});

test("rejects invalid launch requests", () => {
  const missingObject = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "analyze",
  });
  assert.equal(missingObject.approved, false);
  assert.equal(missingObject.reason, "missing_object");

  const future = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "risk",
    objectId: "line-1",
  });
  assert.equal(future.approved, false);
});

test("rejects concurrent transition requests", () => {
  requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "analyze",
    objectId: "line-1",
  });
  const concurrent = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "compare",
    objectId: "line-1",
  });
  assert.equal(concurrent.approved, false);
  assert.equal(concurrent.reason, "concurrent_transition_detected");
});

test("object panel source resolves through requestWorkspaceLaunch", () => {
  const launch = requestWorkspaceLaunch({
    source: "object_panel",
    objectPanelAction: "war_room",
    objectId: "machine-a",
    objectName: "Machine A",
  });
  assert.equal(launch.approved, true);
  assert.equal(launch.workspaceId, "war_room");
  assert.equal(launch.objectPanelAction, "war_room");
});

test("future workspaces appear in launcher cards as non-launchable", () => {
  const state = buildWorkspaceLauncherState(null);
  const risk = state.cards.find((card) => card.workspaceId === "risk");
  assert.ok(risk);
  assert.equal(risk.launchable, false);
  assert.equal(risk.status, "future");
});
