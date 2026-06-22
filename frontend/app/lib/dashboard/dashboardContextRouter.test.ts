import test from "node:test";
import assert from "node:assert/strict";

import {
  commitDashboardContextRoute,
  resetDashboardContextRouterForTests,
  routeAndCommitDashboardContext,
  routeDashboardContext,
} from "./dashboardContextRouter.ts";
import {
  createDefaultNexoraWorkspaceState,
  normalizeNexoraWorkspaceState,
  type NexoraWorkspaceAction,
} from "../workspace/nexoraWorkspaceStateContract.ts";
import {
  getActiveDashboardContext,
  resetDashboardContextLifecycleForTests,
} from "./dashboardContextLifecycle.ts";
import { resetDashboardRuntimeLoggingForTests } from "./dashboardRuntimeLogging.ts";
import { resetDiagnosticIdleGateForTests } from "../runtime/diagnosticIdleGate.ts";
import { resetNexoraLoopGuardDiagnosticsForTests } from "../runtime/nexoraLoopGuardDiagnostics.ts";

test.beforeEach(() => {
  resetDashboardContextRouterForTests();
  resetDashboardContextLifecycleForTests();
  resetDashboardRuntimeLoggingForTests();
  resetDiagnosticIdleGateForTests();
  resetNexoraLoopGuardDiagnosticsForTests();
});

test("object selection routes to operational surface", () => {
  const result = routeDashboardContext({
    source: "object",
    intent: "object_selected",
    raw: {
      objectId: "obj-42",
      dashboardContext: "sources",
      reason: "object_selected",
    },
  });
  assert.equal(result.surfaceId, "operational");
  assert.equal(result.normalized.category, "operational");
  assert.equal(result.normalized.objectId, "obj-42");
  assert.equal(result.normalized.intent, "object_selected");
});

test("risk context routes to risk surface", () => {
  const result = routeDashboardContext({
    source: "scene",
    raw: {
      dashboardContext: "risk",
      reason: "risk_event",
    },
  });
  assert.equal(result.surfaceId, "risk");
  assert.equal(result.normalized.category, "risk");
  assert.equal(result.normalized.intent, "risk_event");
});

test("scenario context routes to scenario surface", () => {
  const result = routeDashboardContext({
    source: "assistant",
    raw: {
      dashboardContext: "scenario",
      scenarioId: "scenario-a",
      reason: "scenario_comparison",
    },
  });
  assert.equal(result.surfaceId, "scenario");
  assert.equal(result.normalized.scenarioId, "scenario-a");
});

test("router commit advances lifecycle and dispatches workspace actions", () => {
  const actions: NexoraWorkspaceAction["type"][] = [];
  const dispatch = (action: NexoraWorkspaceAction) => {
    actions.push(action.type);
  };
  const routeResult = routeDashboardContext({
    source: "timeline",
    raw: {
      dashboardContext: "timeline",
      reason: "timeline_activation",
    },
  });
  const committed = commitDashboardContextRoute(dispatch, routeResult);
  assert.equal(committed.lifecyclePhase, "dashboard_updated");
  assert.deepEqual(actions, ["setMRPTab", "setDashboardContext", "setTimelineState"]);
  assert.equal(getActiveDashboardContext()?.id, committed.id);
});

test("router emits required dashboard routing logs once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    routeDashboardContext({
      source: "left_nav",
      raw: { dashboardContext: "war_room", reason: "left_nav_war_room" },
    });
    routeDashboardContext({
      source: "left_nav",
      raw: { dashboardContext: "war_room", reason: "left_nav_war_room" },
    });
    assert.equal(logs.filter((label) => label === "[Nexora][DashboardRoute]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][DashboardSurfaceResolved]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][DashboardContextNormalized]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("object selection commit is blocked for workspace dispatch", () => {
  const actions: NexoraWorkspaceAction[] = [];
  routeAndCommitDashboardContext((action) => actions.push(action), {
    source: "object",
    intent: "object_selected",
    priorContext: "overview",
    raw: {
      objectId: "obj-a",
      dashboardContext: "sources",
      reason: "object_click:evt-2",
    },
  });
  assert.equal(actions.length, 0);
});

test("repeated dashboard open skips workspace dispatch when state unchanged", () => {
  const currentWorkspace = normalizeNexoraWorkspaceState({
    ...createDefaultNexoraWorkspaceState(),
    dashboardContext: "war_room",
    dashboardMode: "war_room",
    activeMRPTab: "dashboard",
  });
  const actions: NexoraWorkspaceAction[] = [];
  const dispatch = (action: NexoraWorkspaceAction) => actions.push(action);
  routeAndCommitDashboardContext(dispatch, {
    source: "left_nav",
    priorContext: "war_room",
    currentWorkspaceState: currentWorkspace,
    raw: { dashboardContext: "war_room", reason: "left_nav_war_room" },
  });
  assert.equal(actions.length, 0);
  routeAndCommitDashboardContext(dispatch, {
    source: "left_nav",
    priorContext: "war_room",
    currentWorkspaceState: currentWorkspace,
    raw: { dashboardContext: "war_room", reason: "left_nav_war_room" },
  });
  assert.equal(actions.length, 0);
});

test("workspace switch allows single meaningful commit", () => {
  const currentWorkspace = createDefaultNexoraWorkspaceState();
  const actions: NexoraWorkspaceAction[] = [];
  routeAndCommitDashboardContext((action) => actions.push(action), {
    source: "left_nav",
    priorContext: currentWorkspace.dashboardContext,
    currentWorkspaceState: currentWorkspace,
    workspaceId: "ws-target",
    raw: { dashboardContext: "scenario", reason: "left_nav_scenario" },
  });
  assert.equal(actions.length, 2);
});
