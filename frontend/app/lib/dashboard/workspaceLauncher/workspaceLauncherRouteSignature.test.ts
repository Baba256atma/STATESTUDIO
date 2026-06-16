import test from "node:test";
import assert from "node:assert/strict";

import {
  WORKSPACE_LAUNCHER_FULL_ROUTE_SIGNATURE_FIXED_TAG,
  areWorkspaceLauncherRouteSignaturesEqual,
  buildWorkspaceLauncherRouteSignature,
  serializeWorkspaceLauncherRouteSignature,
} from "./workspaceLauncherRouteSignatureContract.ts";

test("exports workspace launcher full route signature fixed tag", () => {
  assert.equal(
    WORKSPACE_LAUNCHER_FULL_ROUTE_SIGNATURE_FIXED_TAG,
    "[WORKSPACE_LAUNCHER_FULL_ROUTE_SIGNATURE_FIXED]"
  );
});

test("route signatures differ when selectedObjectId changes for same workspace", () => {
  const base = buildWorkspaceLauncherRouteSignature({
    workspaceId: "advisory",
    dashboardMode: "advisory",
    selectedObjectId: "obj-a",
    objectPanelAction: "advisory",
    source: "object_panel",
  });
  const next = buildWorkspaceLauncherRouteSignature({
    workspaceId: "advisory",
    dashboardMode: "advisory",
    selectedObjectId: "obj-b",
    objectPanelAction: "advisory",
    source: "object_panel",
  });

  assert.equal(areWorkspaceLauncherRouteSignaturesEqual(base, next), false);
});

test("route signatures differ when objectPanelAction changes for same workspaceId", () => {
  const advisory = buildWorkspaceLauncherRouteSignature({
    workspaceId: "advisory",
    dashboardMode: "advisory",
    selectedObjectId: "obj-a",
    objectPanelAction: "advisory",
    source: "object_panel",
  });
  const focus = buildWorkspaceLauncherRouteSignature({
    workspaceId: "focus",
    dashboardMode: "focus",
    selectedObjectId: "obj-a",
    objectPanelAction: "focus",
    source: "object_panel",
  });

  assert.equal(areWorkspaceLauncherRouteSignaturesEqual(advisory, focus), false);
});

test("route signatures match only when full identity is identical", () => {
  const left = buildWorkspaceLauncherRouteSignature({
    workspaceId: "advisory",
    dashboardMode: "advisory",
    selectedObjectId: "obj-a",
    objectPanelAction: "advisory",
    source: "object_panel",
    routeGeneration: 3,
  });
  const right = buildWorkspaceLauncherRouteSignature({
    workspaceId: "advisory",
    dashboardMode: "advisory",
    selectedObjectId: "obj-a",
    objectPanelAction: "advisory",
    source: "object_panel",
    routeGeneration: 9,
  });

  assert.equal(areWorkspaceLauncherRouteSignaturesEqual(left, right), true);
  assert.ok(serializeWorkspaceLauncherRouteSignature(left).includes("advisory"));
});

test("compare and scenario route signatures stay distinct", () => {
  const compare = buildWorkspaceLauncherRouteSignature({
    workspaceId: "compare",
    dashboardMode: "compare",
    selectedObjectId: "obj-a",
    objectPanelAction: "compare",
    source: "object_panel",
  });
  const scenario = buildWorkspaceLauncherRouteSignature({
    workspaceId: "scenario",
    dashboardMode: "scenario",
    selectedObjectId: "obj-a",
    objectPanelAction: "scenario",
    source: "object_panel",
  });
  const overview = buildWorkspaceLauncherRouteSignature({
    workspaceId: "overview",
    dashboardMode: "overview",
    dashboardContext: "overview",
    selectedObjectId: "obj-a",
    objectPanelAction: null,
    source: "dashboard_control",
  });

  assert.equal(compare.dashboardContext, "compare");
  assert.equal(scenario.dashboardContext, "scenario");
  assert.equal(overview.dashboardContext, "overview");
  assert.equal(areWorkspaceLauncherRouteSignaturesEqual(compare, scenario), false);
  assert.equal(areWorkspaceLauncherRouteSignaturesEqual(compare, overview), false);
});
