import test from "node:test";
import assert from "node:assert/strict";

import {
  CANONICAL_DASHBOARD_RUNTIME_OWNER,
  DASHBOARD_RUNTIME_CONTRACT,
  resetDashboardRuntimeContractForTests,
} from "./dashboardRuntimeContract.ts";
import {
  initializeDashboardSurfaceRegistry,
  listDashboardSurfaceIds,
  resolveDashboardSurfaceForContext,
  resolveDefaultDashboardLandingSurface,
  resetDashboardSurfaceRegistryForTests,
} from "./dashboardSurfaceRegistry.ts";
import { getNexoraLeftNavItem, resolveNexoraLeftNavMode } from "../ui/nexoraLeftNavContract.ts";
import { resetDashboardRuntimeLoggingForTests } from "./dashboardRuntimeLogging.ts";

test.beforeEach(() => {
  resetDashboardRuntimeContractForTests();
  resetDashboardSurfaceRegistryForTests();
  resetDashboardRuntimeLoggingForTests();
});

test("dashboard runtime contract declares single canonical owner", () => {
  assert.equal(DASHBOARD_RUNTIME_CONTRACT.owner, CANONICAL_DASHBOARD_RUNTIME_OWNER);
  assert.equal(DASHBOARD_RUNTIME_CONTRACT.allowedContexts.length, 7);
  assert.ok(DASHBOARD_RUNTIME_CONTRACT.prohibitedOwners.includes("rightPanelRouter"));
});

test("surface registry exposes intelligence surfaces with executive summary as default landing", () => {
  const surfaces = listDashboardSurfaceIds();
  assert.ok(surfaces.includes("operational"));
  assert.ok(surfaces.includes("risk"));
  assert.ok(surfaces.includes("scenario"));
  assert.ok(surfaces.includes("timeline"));
  assert.ok(surfaces.includes("war_room"));
  assert.ok(surfaces.includes("decision"));
  assert.ok(surfaces.includes("executive_summary"));
  assert.equal(resolveDashboardSurfaceForContext("overview"), "executive_summary");
  assert.equal(resolveDefaultDashboardLandingSurface(), "executive_summary");
  assert.equal(resolveDashboardSurfaceForContext("risk"), "risk");
});

test("left-nav seed mapping derives dashboard context from preferred tab", () => {
  const leftNavMode = resolveNexoraLeftNavMode("risk_view", { warn: false });
  const item = getNexoraLeftNavItem(leftNavMode);
  assert.equal(item.dashboardContext, "risk");
});

test("dashboard surface registry logs once on initialize", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeDashboardSurfaceRegistry();
    initializeDashboardSurfaceRegistry();
    assert.equal(logs.filter((label) => label === "[Nexora][DashboardRegistry]").length, 1);
  } finally {
    globalThis.console.info = originalInfo;
  }
});
