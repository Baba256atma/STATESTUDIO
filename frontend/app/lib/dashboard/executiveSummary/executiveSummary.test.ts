import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_DASHBOARD_DEFAULT_LANDING_SURFACE,
  CANONICAL_EXECUTIVE_SUMMARY_OWNER,
  CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID,
  EXECUTIVE_SUMMARY_SURFACE_VERSION,
} from "./executiveSummaryContract.ts";
import { aggregateExecutiveSummary } from "./executiveSummaryAggregation.ts";
import {
  initializeExecutiveSummaryRuntime,
  resetExecutiveSummaryRuntimeForTests,
  resolveExecutiveSummarySurface,
} from "./executiveSummaryRuntime.ts";
import { resetExecutiveSummaryLoggingForTests } from "./executiveSummaryLogging.ts";
import {
  getDashboardSurfaceEntry,
  resolveDefaultDashboardLandingSurface as registryDefaultLanding,
  resetDashboardSurfaceRegistryForTests,
} from "../dashboardSurfaceRegistry.ts";
import { runArchitectureFreezeValidationPass } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";
import { resetArchitectureFreezeRuntimeForTests } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";

test.beforeEach(() => {
  resetExecutiveSummaryRuntimeForTests();
  resetExecutiveSummaryLoggingForTests();
  resetDashboardSurfaceRegistryForTests();
  resetArchitectureFreezeRuntimeForTests();
});

test("executive summary surface contract is canonical", () => {
  assert.equal(CANONICAL_EXECUTIVE_SUMMARY_OWNER, "executiveSummaryRuntime");
  assert.equal(CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID, "executive_summary");
  assert.equal(EXECUTIVE_SUMMARY_SURFACE_VERSION, "4.1.0");
  assert.equal(CANONICAL_DASHBOARD_DEFAULT_LANDING_SURFACE, "executive_summary");
});

test("executive summary surface is registered as active dashboard surface", () => {
  const entry = getDashboardSurfaceEntry("executive_summary");
  assert.equal(entry.status, "active");
  assert.equal(entry.surfaceComponent, "ExecutiveSummarySurface");
  assert.equal(registryDefaultLanding(), "executive_summary");
});

test("aggregation builds summary cards and attention model", () => {
  const model = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  assert.equal(model.surfaceId, "executive_summary");
  assert.equal(model.cards.length, 4);
  assert.ok(model.cards.some((card) => card.kind === "system_status"));
  assert.ok(model.cards.some((card) => card.kind === "executive_attention"));
  assert.equal(model.attention, "stable");
  assert.ok(model.aggregationSources.includes("dashboard"));
});

test("war room context elevates executive attention", () => {
  const model = resolveExecutiveSummarySurface({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  assert.equal(model.attention, "attention_required");
  assert.equal(model.systemStatus, "critical");
  assert.ok(model.aggregationSources.includes("war_room"));
});

test("object context enriches active objects card", () => {
  const model = resolveExecutiveSummarySurface({
    dashboardContext: "sources",
    normalizedContext: null,
    selectedObjectId: "obj-99",
    selectedObjectLabel: "Primary Node",
  });
  const objectsCard = model.cards.find((card) => card.kind === "active_objects");
  assert.ok(objectsCard?.primaryValue.includes("1 selected"));
  assert.ok(objectsCard?.secondaryValue.includes("Primary Node"));
  assert.ok(model.aggregationSources.includes("object"));
});

test("executive summary logging tags emit once", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeExecutiveSummaryRuntime({ dashboardContext: "overview", normalizedContext: null });
    initializeExecutiveSummaryRuntime({ dashboardContext: "overview", normalizedContext: null });
    assert.ok(logs.includes("[Nexora][ExecutiveSummary]"));
    assert.equal(logs.filter((label) => label === "[Nexora][SummaryAggregation]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][ExecutiveAttention]").length, 1);
    assert.equal(logs.filter((label) => label === "[Nexora][ExecutiveSummarySurface]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("architecture freeze includes executive summary surface contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.executive_summary_surface");
  assert.ok(check?.passed);
});
