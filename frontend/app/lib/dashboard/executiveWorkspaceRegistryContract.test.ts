import test from "node:test";
import assert from "node:assert/strict";

import {
  detectDuplicateExecutiveWorkspaceDefinitions,
  EXECUTIVE_WORKSPACE_CATALOG,
  getExecutiveWorkspaceEntry,
  isDedicatedExecutiveWorkspaceMode,
  isExecutiveWorkspaceOpenable,
  listExecutiveWorkspaceIds,
  resetExecutiveWorkspaceRegistryForTests,
  resolveExecutiveWorkspaceByAssistantAction,
  resolveExecutiveWorkspaceByDashboardMode,
  resolveExecutiveWorkspaceByObjectPanelAction,
  validateExecutiveWorkspaceOpenRequest,
} from "./executiveWorkspaceRegistryContract.ts";
import {
  initializeExecutiveWorkspaceRegistry,
  listAvailableExecutiveWorkspaces,
  listFutureExecutiveWorkspaces,
  resetExecutiveWorkspaceRegistryRuntimeForTests,
} from "./executiveWorkspaceRegistryRuntime.ts";

test.beforeEach(() => {
  resetExecutiveWorkspaceRegistryForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
});

test("catalog contains all required active and future workspaces", () => {
  const ids = listExecutiveWorkspaceIds();
  assert.ok(ids.includes("focus"));
  assert.ok(ids.includes("analyze"));
  assert.ok(ids.includes("compare"));
  assert.ok(ids.includes("scenario"));
  assert.ok(ids.includes("war_room"));
  assert.ok(ids.includes("risk"));
  assert.ok(ids.includes("governance"));
  assert.ok(ids.includes("forecasting"));
  assert.ok(ids.includes("optimization"));
  assert.equal(ids.length, 14);
});

test("no duplicate workspace definitions in catalog", () => {
  const duplicates = detectDuplicateExecutiveWorkspaceDefinitions();
  assert.deepEqual(duplicates, []);
});

test("resolves workspace by dashboard mode, object panel action, and assistant action", () => {
  assert.equal(resolveExecutiveWorkspaceByDashboardMode("analyze")?.id, "analyze");
  assert.equal(resolveExecutiveWorkspaceByObjectPanelAction("war_room")?.id, "war_room");
  assert.equal(resolveExecutiveWorkspaceByAssistantAction("OPEN_SCENARIO")?.id, "scenario");
});

test("validates openable workspaces", () => {
  const analyze = validateExecutiveWorkspaceOpenRequest({ dashboardMode: "analyze" });
  assert.equal(analyze.valid, true);
  assert.equal(analyze.entry?.shellComponent, "AnalyzeWorkspaceShell");

  const overview = validateExecutiveWorkspaceOpenRequest({ dashboardMode: "overview" });
  assert.equal(overview.valid, true);
  assert.equal(overview.entry?.id, "overview");
  assert.equal(isExecutiveWorkspaceOpenable(overview.entry!), false);
});

test("rejects future workspace opens", () => {
  const risk = validateExecutiveWorkspaceOpenRequest({ workspaceId: "risk" });
  assert.equal(risk.valid, false);
  assert.equal(risk.reason, "workspace_not_available");

  const governance = validateExecutiveWorkspaceOpenRequest({ workspaceId: "governance" });
  assert.equal(governance.valid, false);
});

test("detects dedicated executive workspace modes", () => {
  assert.equal(isDedicatedExecutiveWorkspaceMode("analyze"), true);
  assert.equal(isDedicatedExecutiveWorkspaceMode("overview"), false);
});

test("registry initializes once without duplicates", () => {
  const first = initializeExecutiveWorkspaceRegistry();
  const second = initializeExecutiveWorkspaceRegistry();
  assert.equal(first.workspaceCount, 14);
  assert.equal(second.workspaceCount, 14);
  assert.deepEqual(first.duplicates, []);
});

test("lists available and future workspaces separately", () => {
  initializeExecutiveWorkspaceRegistry();
  const available = listAvailableExecutiveWorkspaces();
  const future = listFutureExecutiveWorkspaces();
  assert.ok(available.every((e) => e.availability === "available"));
  assert.ok(future.every((e) => e.availability === "future"));
  assert.equal(available.length, 6);
  assert.equal(future.length, 8);
});

test("future entries have metadata only — no shell component", () => {
  for (const id of ["risk", "timeline", "simulation", "decision_center", "recommendations", "governance", "forecasting", "optimization"] as const) {
    const entry = getExecutiveWorkspaceEntry(id);
    assert.equal(entry.availability, "future");
    assert.equal(entry.shellComponent, null);
    assert.equal(entry.dashboardMode, null);
    assert.ok(entry.futureCapabilityFlags.length > 0);
  }
});

test("active entries reference route contracts", () => {
  assert.equal(EXECUTIVE_WORKSPACE_CATALOG.focus.routeContract, "focus/focusModeContract.ts");
  assert.equal(isExecutiveWorkspaceOpenable(EXECUTIVE_WORKSPACE_CATALOG.war_room), true);
});
