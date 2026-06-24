import assert from "node:assert/strict";
import test from "node:test";

import {
  attachExecutiveSummaryIntelligenceFeed,
  attachWorkspaceKpiDashboardSummary,
} from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import {
  NEXORA_KPI_DASHBOARD_LOG_PREFIX,
  WORKSPACE_KPI_DASHBOARD_INTEGRATION_TAGS,
  getDashboardCriticalKpis,
  getDashboardKpiSummary,
  getDashboardWarningKpis,
} from "./kpiDashboardIntegrationRuntime.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import {
  createWorkspaceKpi,
  resetWorkspaceKpiMemoryForTests,
  resetWorkspaceKpiStoreForTests,
} from "./workspaceKpiContract.ts";
import {
  calculateWorkspaceKpis,
  resetWorkspaceKpiProfileStoreForTests,
} from "./workspaceKpiCalculationEngine.ts";
import {
  evaluateWorkspaceKpiHealth,
  resetWorkspaceKpiHealthProfileMemoryForTests,
  resetWorkspaceKpiHealthProfileStoreForTests,
} from "./workspaceKpiHealthEngine.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceScenesForTests } from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";

const KPI_STORAGE_KEY = "nexora.workspaceKpis.v1";
const KPI_HEALTH_STORAGE_KEY = "nexora.workspaceKpiHealthProfiles.v1";

function ensureBrowserStorage(): void {
  if (typeof globalThis.window !== "undefined") return;
  const store: Record<string, string> = {};
  (globalThis as typeof globalThis & { window: Window }).window = {
    localStorage: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) delete store[key];
      },
    },
  } as unknown as Window;
}

function resetAllStoresForTests(): void {
  resetWorkspaceKpiHealthProfileStoreForTests();
  resetWorkspaceKpiProfileStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function seedManualWalkthroughKpis(workspaceId: string): void {
  createWorkspaceKpi({
    workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100000,
    currentValue: 105000,
  });
  createWorkspaceKpi({
    workspaceId,
    name: "Forecast Accuracy",
    unit: "score",
    targetValue: 100,
    currentValue: 84,
  });
  createWorkspaceKpi({
    workspaceId,
    name: "Inventory Cost",
    unit: "USD",
    targetValue: 100000,
    currentValue: 61000,
  });
  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-4:6 KPI dashboard tags and diagnostic prefix", () => {
  assert.equal(NEXORA_KPI_DASHBOARD_LOG_PREFIX, "[NexoraKpiDashboard]");
  assert.deepEqual(WORKSPACE_KPI_DASHBOARD_INTEGRATION_TAGS, [
    "[DS46_KPI_DASHBOARD_INTEGRATION]",
    "[KPI_VISIBLE_IN_DASHBOARD]",
    "[EXECUTIVE_SUMMARY_EXTENDED]",
    "[NO_NEW_DASHBOARD_CREATED]",
    "[DS47_READY]",
    "[DS_4_6_COMPLETE]",
  ]);
});

test("returns empty dashboard KPI summary when no KPIs exist", () => {
  const workspace = createWorkspace("Empty KPI Dashboard Workspace");

  const summary = getDashboardKpiSummary(workspace.workspaceId);
  assert.equal(summary.totalKpis, 0);
  assert.equal(summary.overallHealthScore, 0);
  assert.equal(summary.highestRiskKpiId, null);
});

test("aggregates manual walkthrough KPI dashboard summary", () => {
  const workspace = createWorkspace("KPI Dashboard Workspace");
  seedManualWalkthroughKpis(workspace.workspaceId);

  const summary = getDashboardKpiSummary(workspace.workspaceId);
  assert.equal(summary.totalKpis, 3);
  assert.equal(summary.healthyCount, 1);
  assert.equal(summary.warningCount, 1);
  assert.equal(summary.criticalCount, 1);
  assert.ok(summary.overallHealthScore > 0);
  assert.equal(summary.highestRiskKpiName, "Inventory Cost");
});

test("lists critical and warning KPIs for dashboard", () => {
  const workspace = createWorkspace("KPI Dashboard Lists Workspace");
  seedManualWalkthroughKpis(workspace.workspaceId);

  const critical = getDashboardCriticalKpis(workspace.workspaceId);
  const warning = getDashboardWarningKpis(workspace.workspaceId);

  assert.equal(critical.length, 1);
  assert.equal(critical[0]?.kpiName, "Inventory Cost");
  assert.equal(warning.length, 1);
  assert.equal(warning[0]?.kpiName, "Forecast Accuracy");
});

test("selects highest risk KPI by lowest health score and updatedAt tie-break", () => {
  const workspace = createWorkspace("Highest Risk KPI Workspace");
  const older = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Older Critical",
    unit: "score",
    targetValue: 100,
    currentValue: 50,
  });
  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Newer Critical",
    unit: "score",
    targetValue: 100,
    currentValue: 52,
  });
  calculateWorkspaceKpis(workspace.workspaceId);
  evaluateWorkspaceKpiHealth(workspace.workspaceId);

  const summary = getDashboardKpiSummary(workspace.workspaceId);
  const critical = getDashboardCriticalKpis(workspace.workspaceId);
  assert.equal(critical.length, 2);
  assert.equal(summary.highestRiskKpiId, older.kpi?.kpiId ?? null);
});

test("preserves workspace isolation for dashboard KPI summary", () => {
  const workspaceA = createWorkspace("Dashboard KPI Workspace A");
  const workspaceB = createWorkspace("Dashboard KPI Workspace B");
  seedManualWalkthroughKpis(workspaceA.workspaceId);

  const isolated = getDashboardKpiSummary(workspaceB.workspaceId);
  assert.equal(isolated.totalKpis, 0);
  assert.equal(getDashboardCriticalKpis(workspaceB.workspaceId).length, 0);
});

test("reloads dashboard KPI summary from persisted storage", () => {
  const workspace = createWorkspace("Dashboard KPI Persistence Workspace");
  seedManualWalkthroughKpis(workspace.workspaceId);

  const before = getDashboardKpiSummary(workspace.workspaceId);
  resetWorkspaceKpiHealthProfileMemoryForTests();
  resetWorkspaceKpiMemoryForTests();

  const reloaded = getDashboardKpiSummary(workspace.workspaceId);
  assert.equal(reloaded.totalKpis, before.totalKpis);
  assert.equal(reloaded.criticalCount, before.criticalCount);
  assert.equal(reloaded.highestRiskKpiName, before.highestRiskKpiName);
});

test("extends executive summary with workspace KPI dashboard summary", () => {
  const workspace = createWorkspace("Executive Summary KPI Workspace");
  seedManualWalkthroughKpis(workspace.workspaceId);

  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const enriched = attachWorkspaceKpiDashboardSummary(baseModel);
  const kpiCard = enriched.cards.find((card) => card.kind === "active_signals");

  assert.ok(kpiCard);
  assert.equal(kpiCard.title, "KPI Intelligence");
  assert.equal(kpiCard.primaryValue, "KPIs: 3");
  assert.match(kpiCard.secondaryValue, /Healthy: 1/);
  assert.match(kpiCard.secondaryValue, /Warning: 1/);
  assert.match(kpiCard.secondaryValue, /Critical: 1/);
  assert.match(kpiCard.secondaryValue, /Highest Risk: Inventory Cost/);
});

test("attachExecutiveSummaryIntelligenceFeed keeps workspace KPI summary when feed is empty", () => {
  const workspace = createWorkspace("Executive Summary Feed KPI Workspace");
  seedManualWalkthroughKpis(workspace.workspaceId);

  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const enriched = attachExecutiveSummaryIntelligenceFeed(baseModel);
  const kpiCard = enriched.cards.find((card) => card.kind === "active_signals");

  assert.equal(kpiCard?.primaryValue, "KPIs: 3");
});

test("does not mutate KPI, object, or scene storage during dashboard aggregation", () => {
  const workspace = createWorkspace("Dashboard KPI Safety Workspace");
  seedManualWalkthroughKpis(workspace.workspaceId);

  const before = {
    kpis: window.localStorage.getItem(KPI_STORAGE_KEY),
    health: window.localStorage.getItem(KPI_HEALTH_STORAGE_KEY),
  };

  getDashboardKpiSummary(workspace.workspaceId);
  getDashboardCriticalKpis(workspace.workspaceId);
  getDashboardWarningKpis(workspace.workspaceId);
  attachExecutiveSummaryIntelligenceFeed(
    aggregateExecutiveSummary({
      dashboardContext: "overview",
      normalizedContext: null,
    })
  );

  assert.equal(window.localStorage.getItem(KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(KPI_HEALTH_STORAGE_KEY), before.health);
});
