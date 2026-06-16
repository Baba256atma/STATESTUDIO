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
  assert.ok(ids.includes("advisory"));
  assert.ok(ids.includes("risk"));
  assert.ok(ids.includes("governance"));
  assert.ok(ids.includes("forecasting"));
  assert.ok(ids.includes("optimization"));
  assert.equal(ids.length, 15);
});

test("no duplicate workspace definitions in catalog", () => {
  const duplicates = detectDuplicateExecutiveWorkspaceDefinitions();
  assert.deepEqual(duplicates, []);
});

test("resolves workspace by dashboard mode, object panel action, and assistant action", () => {
  assert.equal(resolveExecutiveWorkspaceByDashboardMode("analyze")?.id, "analyze");
  assert.equal(resolveExecutiveWorkspaceByDashboardMode("risk")?.id, "risk");
  assert.equal(resolveExecutiveWorkspaceByDashboardMode("advisory")?.id, "advisory");
  assert.equal(resolveExecutiveWorkspaceByObjectPanelAction("war_room")?.id, "war_room");
  assert.equal(resolveExecutiveWorkspaceByObjectPanelAction("advisory")?.id, "advisory");
  assert.equal(resolveExecutiveWorkspaceByAssistantAction("OPEN_SCENARIO")?.id, "scenario");
  assert.equal(resolveExecutiveWorkspaceByAssistantAction("OPEN_RISK")?.id, "risk");
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
  const forecasting = validateExecutiveWorkspaceOpenRequest({ workspaceId: "forecasting" });
  assert.equal(forecasting.valid, false);
  assert.equal(forecasting.reason, "workspace_not_available");
});

test("validates risk workspace foundation open request", () => {
  const risk = validateExecutiveWorkspaceOpenRequest({ workspaceId: "risk" });
  assert.equal(risk.valid, true);
  assert.equal(risk.entry?.shellComponent, "RiskWorkspace");
  assert.equal(risk.entry?.dashboardMode, "risk");
});

test("validates advisory workspace foundation open request", () => {
  const advisory = validateExecutiveWorkspaceOpenRequest({ workspaceId: "advisory" });
  assert.equal(advisory.valid, true);
  assert.equal(advisory.entry?.shellComponent, "AdvisoryWorkspace");
  assert.equal(advisory.entry?.dashboardMode, "advisory");
  assert.notEqual(advisory.entry?.dashboardMode, "overview");
});

test("validates timeline workspace foundation open request", () => {
  const timeline = validateExecutiveWorkspaceOpenRequest({ workspaceId: "timeline" });
  assert.equal(timeline.valid, true);
  assert.equal(timeline.entry?.shellComponent, "TimelineWorkspace");
  assert.equal(timeline.entry?.dashboardMode, "timeline");
});

test("validates scenario workspace foundation open request", () => {
  const scenario = validateExecutiveWorkspaceOpenRequest({ workspaceId: "scenario" });
  assert.equal(scenario.valid, true);
  assert.equal(scenario.entry?.shellComponent, "ScenarioWorkspace");
  assert.equal(scenario.entry?.dashboardMode, "scenario");
});

test("validates governance workspace foundation open request", () => {
  const governance = validateExecutiveWorkspaceOpenRequest({ workspaceId: "governance" });
  assert.equal(governance.valid, true);
  assert.equal(governance.entry?.shellComponent, "GovernanceWorkspace");
  assert.equal(governance.entry?.dashboardMode, "governance");
});

test("detects dedicated executive workspace modes", () => {
  assert.equal(isDedicatedExecutiveWorkspaceMode("analyze"), true);
  assert.equal(isDedicatedExecutiveWorkspaceMode("risk"), true);
  assert.equal(isDedicatedExecutiveWorkspaceMode("timeline"), true);
  assert.equal(isDedicatedExecutiveWorkspaceMode("scenario"), true);
  assert.equal(isDedicatedExecutiveWorkspaceMode("governance"), true);
  assert.equal(isDedicatedExecutiveWorkspaceMode("advisory"), true);
  assert.equal(isDedicatedExecutiveWorkspaceMode("overview"), false);
});

test("registry initializes once without duplicates", () => {
  const first = initializeExecutiveWorkspaceRegistry();
  const second = initializeExecutiveWorkspaceRegistry();
  assert.equal(first.workspaceCount, 15);
  assert.equal(second.workspaceCount, 15);
  assert.deepEqual(first.duplicates, []);
});

test("lists available and future workspaces separately", () => {
  initializeExecutiveWorkspaceRegistry();
  const available = listAvailableExecutiveWorkspaces();
  const future = listFutureExecutiveWorkspaces();
  assert.ok(available.every((e) => e.availability === "available"));
  assert.ok(future.every((e) => e.availability === "future"));
  assert.equal(available.length, 10);
  assert.equal(future.length, 5);
});

test("future entries have metadata only — no shell component", () => {
  for (const id of ["simulation", "decision_center", "recommendations", "forecasting", "optimization"] as const) {
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
