import test from "node:test";
import assert from "node:assert/strict";

import { DASHBOARD_PERFORMANCE_BUDGETS, isWithinDashboardBudget } from "./dashboardPerformanceBudget.ts";
import {
  measureDashboardOperation,
  resetDashboardPerformanceMetricsForTests,
} from "./dashboardPerformanceMetrics.ts";
import {
  recordDashboardAccordionUpdateFrequency,
  recordDashboardRoutingFrequency,
  recordDashboardTraceComputeFrequency,
  resetDashboardPerformanceRegressionForTests,
} from "./dashboardPerformanceRegression.ts";
import {
  buildAccordionPanelsFromContext,
  resetDashboardAccordionPanelCacheForTests,
} from "./dashboardAccordionContextPanels.ts";
import {
  resetDashboardContextRouterForTests,
  routeAndCommitDashboardContext,
  routeDashboardContext,
} from "./dashboardContextRouter.ts";
import { resetDashboardAccordionRegistryForTests } from "./dashboardAccordionRegistry.ts";
import { resetDashboardAccordionRuntimeForTests } from "./dashboardAccordionRuntime.ts";
import { resetDashboardSurfaceRegistryForTests } from "./dashboardSurfaceRegistry.ts";
import { resetDashboardAccordionLoggingForTests } from "./dashboardAccordionLogging.ts";
import { resetDashboardRuntimeLoggingForTests } from "./dashboardRuntimeLogging.ts";
import { resetDashboardContextLifecycleForTests } from "./dashboardContextLifecycle.ts";
import type { NexoraWorkspaceAction } from "../workspace/nexoraWorkspaceStateContract.ts";

test.beforeEach(() => {
  resetDashboardPerformanceMetricsForTests();
  resetDashboardPerformanceRegressionForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardContextRouterForTests();
  resetDashboardAccordionRegistryForTests();
  resetDashboardAccordionRuntimeForTests();
  resetDashboardSurfaceRegistryForTests();
  resetDashboardAccordionLoggingForTests();
  resetDashboardRuntimeLoggingForTests();
  resetDashboardContextLifecycleForTests();
});

test("performance budgets are defined for phase 3.4 targets", () => {
  assert.equal(DASHBOARD_PERFORMANCE_BUDGETS.contextRoutingMs, 10);
  assert.equal(DASHBOARD_PERFORMANCE_BUDGETS.surfaceResolutionMs, 10);
  assert.equal(DASHBOARD_PERFORMANCE_BUDGETS.accordionUpdateMs, 16);
  assert.equal(DASHBOARD_PERFORMANCE_BUDGETS.dashboardTraceMs, 50);
  assert.equal(isWithinDashboardBudget("dashboardTrace", 49), true);
  assert.equal(isWithinDashboardBudget("dashboardTrace", 51), false);
});

test("duplicate dashboard route commits are deduped", () => {
  const actions: NexoraWorkspaceAction["type"][] = [];
  const dispatch = (action: NexoraWorkspaceAction) => {
    actions.push(action.type);
  };
  const input = {
    source: "left_nav" as const,
    raw: { dashboardContext: "risk", reason: "test_dedupe" },
  };
  routeAndCommitDashboardContext(dispatch, input);
  const firstActionCount = actions.length;
  routeAndCommitDashboardContext(dispatch, input);
  assert.equal(actions.length, firstActionCount);
});

test("accordion panel structure cache avoids repeated panel registration work", () => {
  const first = buildAccordionPanelsFromContext({
    dashboardContext: "war_room",
    normalizedContext: null,
    persistedExpansion: {},
    contextSignature: "war_room:default",
  });
  const second = buildAccordionPanelsFromContext({
    dashboardContext: "war_room",
    normalizedContext: null,
    persistedExpansion: {},
    contextSignature: "war_room:default",
  });
  assert.equal(first.length, second.length);
  assert.equal(first[0]?.panelId, second[0]?.panelId);
});

test("dashboard metrics emit required performance tags once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    measureDashboardOperation("contextRouting", () => routeDashboardContext({
      source: "system",
      raw: { dashboardContext: "overview", reason: "metrics_test" },
    }));
    measureDashboardOperation("contextRouting", () => routeDashboardContext({
      source: "system",
      raw: { dashboardContext: "overview", reason: "metrics_test" },
    }));
    assert.ok(logs.includes("[Nexora][DashboardContextCost]"));
    assert.ok(logs.includes("[Nexora][DashboardSurfaceCost]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("regression guard warns on routing frequency storms", () => {
  const warnings: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") warnings.push(args[0]);
  };
  try {
    for (let index = 0; index < DASHBOARD_PERFORMANCE_BUDGETS.routingStormMaxPerWindow + 2; index += 1) {
      recordDashboardRoutingFrequency({ index });
    }
    assert.ok(warnings.includes("[Nexora][DashboardPerformance]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("trace compute frequency guard warns without crashing", () => {
  const warnings: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") warnings.push(args[0]);
  };
  try {
    for (let index = 0; index < DASHBOARD_PERFORMANCE_BUDGETS.traceStormMaxPerWindow + 2; index += 1) {
      recordDashboardTraceComputeFrequency({ index });
    }
    assert.ok(warnings.includes("[Nexora][DashboardPerformance]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("accordion update frequency guard warns without crashing", () => {
  const warnings: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") warnings.push(args[0]);
  };
  try {
    for (let index = 0; index < DASHBOARD_PERFORMANCE_BUDGETS.accordionUpdateStormMaxPerWindow + 2; index += 1) {
      recordDashboardAccordionUpdateFrequency({
        source: "dashboardAccordionRuntime.test",
        updateCount: index,
      });
    }
    assert.ok(warnings.includes("[Nexora][DashboardPerformance]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});
