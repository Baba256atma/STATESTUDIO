import test from "node:test";
import assert from "node:assert/strict";

import {
  OBJECT_PANEL_FOCUS_LOCK_FIXED_TAG,
  resetObjectPanelActionRouterForTests,
} from "./objectPanelActionRouterContract.ts";
import {
  launchObjectPanelActionRequest,
  routeObjectPanelActionRequest,
} from "./objectPanelActionRouterRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
} from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../dashboard/executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import { resetWorkspaceLauncherForTests } from "../dashboard/workspaceLauncher/workspaceLauncherContract.ts";
import { resetWorkspaceLauncherRouteSignatureForTests } from "../dashboard/workspaceLauncher/workspaceLauncherRuntime.ts";
import { getActiveWorkspaceLifecycleState } from "../dashboard/executiveWorkspaceLifecycleRuntime.ts";

test.beforeEach(() => {
  resetObjectPanelActionRouterForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetWorkspaceLauncherForTests();
  resetWorkspaceLauncherRouteSignatureForTests();
});

function applyObjectPanelAction(action: string, objectId = "machine-a"): boolean {
  const { resolved, launch } = launchObjectPanelActionRequest({
    action,
    objectId,
    objectName: "Machine A",
  });
  if (!resolved.ok || !launch?.approved || !launch.workspaceId) {
    return false;
  }
  const commit = commitExecutiveWorkspaceTransition(launch.workspaceId);
  return commit.approved;
}

test("focus lock hotfix tag is exported", () => {
  assert.equal(OBJECT_PANEL_FOCUS_LOCK_FIXED_TAG, "[OBJECT_PANEL_FOCUS_LOCK_FIXED]");
});

test("each object panel action resolves to its own workspace launch", () => {
  const cases: Array<{ action: string; workspaceId: string }> = [
    { action: "focus", workspaceId: "focus" },
    { action: "analyze", workspaceId: "analyze" },
    { action: "compare", workspaceId: "compare" },
    { action: "scenario", workspaceId: "scenario" },
    { action: "war_room", workspaceId: "war_room" },
    { action: "advisory", workspaceId: "advisory" },
  ];

  for (const entry of cases) {
    const { resolved, launch } = launchObjectPanelActionRequest({
      action: entry.action,
      objectId: "machine-a",
      objectName: "Machine A",
    });
    assert.equal(resolved.ok, true, entry.action);
    if (resolved.ok) {
      assert.equal(resolved.action, entry.action);
    }
    assert.equal(launch?.workspaceId, entry.workspaceId, entry.action);
    if (entry.action === "advisory") {
      assert.equal(launch?.dashboardMode, "advisory", entry.action);
    }
  }
});

test("acceptance: focus then analyze scenario war room switch chain", () => {
  assert.equal(applyObjectPanelAction("focus"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "focus");

  const repeatFocus = launchObjectPanelActionRequest({
    action: "focus",
    objectId: "machine-a",
    objectName: "Machine A",
  });
  assert.equal(repeatFocus.launch?.approved, false);
  assert.equal(repeatFocus.launch?.reason, "already_active");
  assert.equal(repeatFocus.launch?.workspaceId, "focus");

  assert.equal(applyObjectPanelAction("analyze"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "analyze");

  assert.equal(applyObjectPanelAction("scenario"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "scenario");

  assert.equal(applyObjectPanelAction("war_room"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "war_room");
});

test("route result preserves explicit action identity", () => {
  const route = routeObjectPanelActionRequest({
    action: "compare",
    objectId: "machine-a",
    objectName: "Machine A",
  });
  assert.equal(route.success, true);
  assert.equal(route.action, "compare");
  assert.equal(route.payload?.action, "compare");
  assert.equal(route.launch?.objectPanelAction, "compare");
  assert.equal(route.launch?.workspaceId, "compare");
  assert.equal(route.launch?.dashboardMode, "compare");
  assert.equal(route.launch?.source, "object_panel");
});

test("compare remains routable through scene compare scenario compare war room compare sequence", () => {
  assert.equal(applyObjectPanelAction("compare"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "compare");

  assert.equal(applyObjectPanelAction("scenario"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "scenario");

  assert.equal(applyObjectPanelAction("compare"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "compare");

  assert.equal(applyObjectPanelAction("war_room"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "war_room");

  assert.equal(applyObjectPanelAction("compare"), true);
  assert.equal(getActiveWorkspaceLifecycleState()?.workspaceId, "compare");
});

test("duplicate compare click brakes only for identical object route", () => {
  assert.equal(applyObjectPanelAction("compare", "machine-a"), true);

  const duplicate = launchObjectPanelActionRequest({
    action: "compare",
    objectId: "machine-a",
    objectName: "Machine A",
  });
  assert.equal(duplicate.launch?.approved, false);
  assert.equal(duplicate.launch?.reason, "already_active");

  const differentObject = launchObjectPanelActionRequest({
    action: "compare",
    objectId: "machine-b",
    objectName: "Machine B",
  });
  assert.equal(differentObject.launch?.approved, true);
  assert.equal(differentObject.launch?.workspaceId, "compare");
  assert.equal(differentObject.launch?.routeObject?.objectId, "machine-b");
});

test("legacy focus_object maps to focus workspace without stale action reuse", () => {
  const route = routeObjectPanelActionRequest({
    action: "focus_object",
    objectId: "machine-a",
  });
  assert.equal(route.success, true);
  assert.equal(route.action, "focus");
  assert.equal(route.launch?.workspaceId, "focus");
});
