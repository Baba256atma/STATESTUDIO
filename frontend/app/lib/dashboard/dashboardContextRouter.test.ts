import test from "node:test";
import assert from "node:assert/strict";

import {
  commitDashboardContextRoute,
  resetDashboardContextRouterForTests,
  routeDashboardContext,
} from "./dashboardContextRouter.ts";
import {
  getActiveDashboardContext,
  resetDashboardContextLifecycleForTests,
} from "./dashboardContextLifecycle.ts";
import { resetDashboardRuntimeLoggingForTests } from "./dashboardRuntimeLogging.ts";
import type { NexoraWorkspaceAction } from "../workspace/nexoraWorkspaceStateContract.ts";

test.beforeEach(() => {
  resetDashboardContextRouterForTests();
  resetDashboardContextLifecycleForTests();
  resetDashboardRuntimeLoggingForTests();
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
