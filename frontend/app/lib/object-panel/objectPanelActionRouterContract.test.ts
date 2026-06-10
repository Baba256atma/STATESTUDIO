import test from "node:test";
import assert from "node:assert/strict";

import {
  buildObjectPanelActionPayload,
  isObjectPanelDashboardAction,
  normalizeObjectPanelDashboardAction,
  OBJECT_PANEL_DASHBOARD_ACTIONS,
  resetObjectPanelActionRouterForTests,
  shouldRouteExecutiveActionToDashboard,
} from "./objectPanelActionRouterContract.ts";
import {
  buildDashboardModeActionFromRoute,
  resolveDashboardModeFromObjectPanelAction,
  routeObjectPanelActionRequest,
} from "./objectPanelActionRouterRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../dashboard/executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";

test.beforeEach(() => {
  resetObjectPanelActionRouterForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
});

test("accepts only the five dashboard actions", () => {
  assert.deepEqual(OBJECT_PANEL_DASHBOARD_ACTIONS, [
    "focus",
    "analyze",
    "compare",
    "scenario",
    "war_room",
  ]);
  assert.equal(isObjectPanelDashboardAction("analyze"), true);
  assert.equal(isObjectPanelDashboardAction("timeline"), false);
});

test("builds normalized payload contract", () => {
  const payload = buildObjectPanelActionPayload({
    action: "analyze",
    objectId: " machine-a ",
    objectName: " Machine A ",
    timestamp: 123,
  });
  assert.deepEqual(payload, {
    objectId: "machine-a",
    objectName: "Machine A",
    action: "analyze",
    timestamp: 123,
  });
});

test("maps primary legacy executive actions to dashboard modes", () => {
  assert.equal(normalizeObjectPanelDashboardAction("focus_object"), "focus");
  assert.equal(normalizeObjectPanelDashboardAction("run_scenario"), "scenario");
  assert.equal(normalizeObjectPanelDashboardAction("open_war_room"), "war_room");
  assert.equal(normalizeObjectPanelDashboardAction("explain_object"), null);
  assert.equal(normalizeObjectPanelDashboardAction("show_risks"), null);
});

test("routes only whitelisted legacy executive actions to dashboard", () => {
  assert.equal(shouldRouteExecutiveActionToDashboard("focus_object"), true);
  assert.equal(shouldRouteExecutiveActionToDashboard("compare_scenarios"), true);
  assert.equal(shouldRouteExecutiveActionToDashboard("explain_object"), false);
  assert.equal(shouldRouteExecutiveActionToDashboard("show_risks"), false);
});

test("rejects missing object and invalid action", () => {
  assert.equal(routeObjectPanelActionRequest({ action: "analyze", objectId: "" }).success, false);
  assert.equal(routeObjectPanelActionRequest({ action: "timeline", objectId: "obj-1" }).success, false);
});

test("routes valid requests to dashboard mode actions", () => {
  const route = routeObjectPanelActionRequest({
    action: "analyze",
    objectId: "machine-a",
    objectName: "Machine A",
  });
  assert.equal(route.success, true);
  assert.equal(route.mode, "analyze");
  assert.equal(route.payload?.objectName, "Machine A");

  const dashboardAction = buildDashboardModeActionFromRoute(route);
  assert.deepEqual(dashboardAction, {
    mode: "analyze",
    routeObject: { objectId: "machine-a", objectName: "Machine A" },
  });
});

test("maps each object panel action to a dashboard mode", () => {
  assert.equal(resolveDashboardModeFromObjectPanelAction("focus"), "focus");
  assert.equal(resolveDashboardModeFromObjectPanelAction("war_room"), "war_room");
});
