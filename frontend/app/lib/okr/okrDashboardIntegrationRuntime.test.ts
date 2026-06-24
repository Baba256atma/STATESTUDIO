import assert from "node:assert/strict";
import test from "node:test";

import {
  attachExecutiveSummaryIntelligenceFeed,
  attachWorkspaceOkrDashboardSummary,
} from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import {
  NEXORA_OKR_DASHBOARD_LOG_PREFIX,
  WORKSPACE_OKR_DASHBOARD_INTEGRATION_TAGS,
  getDashboardCriticalObjectives,
  getDashboardOkrSummary,
  getDashboardWarningObjectives,
} from "./okrDashboardIntegrationRuntime.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import {
  createWorkspaceKeyResult,
  createWorkspaceObjective,
  resetWorkspaceOkrMemoryForTests,
  resetWorkspaceOkrStoreForTests,
} from "./workspaceOkrContract.ts";
import {
  calculateWorkspaceOkrProgress,
  resetWorkspaceOkrProgressProfileMemoryForTests,
  resetWorkspaceOkrProgressProfileStoreForTests,
} from "./workspaceOkrProgressEngine.ts";
import {
  evaluateWorkspaceOkrHealth,
  resetWorkspaceOkrHealthProfileMemoryForTests,
  resetWorkspaceOkrHealthProfileStoreForTests,
} from "./workspaceOkrHealthEngine.ts";
import { resetWorkspaceOkrKpiBindingStoreForTests } from "./workspaceOkrKpiBinding.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceScenesForTests } from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import { resetWorkspaceKpiStoreForTests } from "../kpi/workspaceKpiContract.ts";

const OBJECTIVE_STORAGE_KEY = "nexora.workspaceObjectives.v1";
const OKR_HEALTH_STORAGE_KEY = "nexora.workspaceOkrHealthProfiles.v1";
const OKR_PROGRESS_STORAGE_KEY = "nexora.workspaceOkrProgressProfiles.v1";

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
  resetWorkspaceOkrHealthProfileStoreForTests();
  resetWorkspaceOkrProgressProfileStoreForTests();
  resetWorkspaceOkrKpiBindingStoreForTests();
  resetWorkspaceOkrStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function seedManualWalkthroughObjectives(workspaceId: string): void {
  const marketLeader = createWorkspaceObjective({
    workspaceId,
    title: "Become Market Leader",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: marketLeader.objective?.objectiveId ?? "",
    title: "Revenue Growth",
    targetValue: 30,
    currentValue: 15,
    unit: "%",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: marketLeader.objective?.objectiveId ?? "",
    title: "Customer Retention",
    targetValue: 90,
    currentValue: 81,
    unit: "%",
  });

  const forecasting = createWorkspaceObjective({
    workspaceId,
    title: "Improve Forecasting",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: forecasting.objective?.objectiveId ?? "",
    title: "Forecast Accuracy",
    targetValue: 100,
    currentValue: 105,
    unit: "score",
  });

  const costReduction = createWorkspaceObjective({
    workspaceId,
    title: "Reduce Operational Cost",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: costReduction.objective?.objectiveId ?? "",
    title: "Cost Reduction",
    targetValue: 100,
    currentValue: 45,
    unit: "score",
  });

  calculateWorkspaceOkrProgress(workspaceId);
  evaluateWorkspaceOkrHealth(workspaceId);
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-5:6 OKR dashboard tags and diagnostic prefix", () => {
  assert.equal(NEXORA_OKR_DASHBOARD_LOG_PREFIX, "[NexoraOkrDashboard]");
  assert.deepEqual(WORKSPACE_OKR_DASHBOARD_INTEGRATION_TAGS, [
    "[DS56_OKR_DASHBOARD_INTEGRATION]",
    "[OKR_VISIBLE_IN_DASHBOARD]",
    "[EXECUTIVE_SUMMARY_EXTENDED]",
    "[STRATEGIC_HEALTH_VISIBLE]",
    "[DS57_READY]",
    "[DS_5_6_COMPLETE]",
  ]);
});

test("returns empty dashboard OKR summary when no objectives exist", () => {
  const workspace = createWorkspace("Empty OKR Dashboard Workspace");

  const summary = getDashboardOkrSummary(workspace.workspaceId);
  assert.equal(summary.totalObjectives, 0);
  assert.equal(summary.overallHealthScore, 0);
  assert.equal(summary.highestRiskObjectiveId, null);
});

test("aggregates manual walkthrough OKR dashboard summary", () => {
  const workspace = createWorkspace("OKR Dashboard Workspace");
  seedManualWalkthroughObjectives(workspace.workspaceId);

  const summary = getDashboardOkrSummary(workspace.workspaceId);
  assert.equal(summary.totalObjectives, 3);
  assert.equal(summary.healthyCount, 1);
  assert.equal(summary.warningCount, 1);
  assert.equal(summary.criticalCount, 1);
  assert.ok(summary.overallHealthScore > 0);
  assert.equal(summary.highestRiskObjectiveTitle, "Reduce Operational Cost");
});

test("lists critical and warning objectives for dashboard", () => {
  const workspace = createWorkspace("OKR Dashboard Lists Workspace");
  seedManualWalkthroughObjectives(workspace.workspaceId);

  const critical = getDashboardCriticalObjectives(workspace.workspaceId);
  const warning = getDashboardWarningObjectives(workspace.workspaceId);

  assert.equal(critical.length, 1);
  assert.equal(critical[0]?.objectiveTitle, "Reduce Operational Cost");
  assert.equal(warning.length, 1);
  assert.equal(warning[0]?.objectiveTitle, "Become Market Leader");
});

test("aggregates single objective dashboard summary", () => {
  const workspace = createWorkspace("Single Objective Dashboard Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Improve Forecasting",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: objective.objective?.objectiveId ?? "",
    title: "Forecast Accuracy",
    targetValue: 100,
    currentValue: 105,
    unit: "score",
  });
  calculateWorkspaceOkrProgress(workspace.workspaceId);
  evaluateWorkspaceOkrHealth(workspace.workspaceId);

  const summary = getDashboardOkrSummary(workspace.workspaceId);
  assert.equal(summary.totalObjectives, 1);
  assert.equal(summary.healthyCount, 1);
  assert.equal(summary.highestRiskObjectiveTitle, "Improve Forecasting");
});

test("selects highest risk objective by lowest health score and updatedAt tie-break", () => {
  const workspace = createWorkspace("Highest Risk Objective Workspace");
  const older = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Older Critical",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: older.objective?.objectiveId ?? "",
    title: "Older KR",
    targetValue: 100,
    currentValue: 40,
    unit: "score",
  });
  const newer = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Newer Critical",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: newer.objective?.objectiveId ?? "",
    title: "Newer KR",
    targetValue: 100,
    currentValue: 42,
    unit: "score",
  });
  calculateWorkspaceOkrProgress(workspace.workspaceId);
  evaluateWorkspaceOkrHealth(workspace.workspaceId);

  const summary = getDashboardOkrSummary(workspace.workspaceId);
  const critical = getDashboardCriticalObjectives(workspace.workspaceId);
  assert.equal(critical.length, 2);
  assert.equal(summary.highestRiskObjectiveId, older.objective?.objectiveId ?? null);
});

test("preserves workspace isolation for dashboard OKR summary", () => {
  const workspaceA = createWorkspace("Dashboard OKR Workspace A");
  const workspaceB = createWorkspace("Dashboard OKR Workspace B");
  seedManualWalkthroughObjectives(workspaceA.workspaceId);

  const isolated = getDashboardOkrSummary(workspaceB.workspaceId);
  assert.equal(isolated.totalObjectives, 0);
  assert.equal(getDashboardCriticalObjectives(workspaceB.workspaceId).length, 0);
});

test("reloads dashboard OKR summary from persisted storage", () => {
  const workspace = createWorkspace("Dashboard OKR Persistence Workspace");
  seedManualWalkthroughObjectives(workspace.workspaceId);

  const before = getDashboardOkrSummary(workspace.workspaceId);
  resetWorkspaceOkrHealthProfileMemoryForTests();
  resetWorkspaceOkrProgressProfileMemoryForTests();
  resetWorkspaceOkrMemoryForTests();

  const reloaded = getDashboardOkrSummary(workspace.workspaceId);
  assert.equal(reloaded.totalObjectives, before.totalObjectives);
  assert.equal(reloaded.criticalCount, before.criticalCount);
  assert.equal(reloaded.highestRiskObjectiveTitle, before.highestRiskObjectiveTitle);
});

test("extends executive summary with workspace OKR dashboard summary", () => {
  const workspace = createWorkspace("Executive Summary OKR Workspace");
  seedManualWalkthroughObjectives(workspace.workspaceId);

  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const enriched = attachWorkspaceOkrDashboardSummary(baseModel);
  const okrCard = enriched.cards.find((card) => card.kind === "executive_attention");

  assert.ok(okrCard);
  assert.equal(okrCard.title, "OKR Intelligence");
  assert.equal(okrCard.primaryValue, "Objectives: 3");
  assert.match(okrCard.secondaryValue, /Healthy: 1/);
  assert.match(okrCard.secondaryValue, /Warning: 1/);
  assert.match(okrCard.secondaryValue, /Critical: 1/);
  assert.match(okrCard.secondaryValue, /Highest Risk Objective: Reduce Operational Cost/);
});

test("attachExecutiveSummaryIntelligenceFeed keeps workspace OKR summary when feed is empty", () => {
  const workspace = createWorkspace("Executive Summary Feed OKR Workspace");
  seedManualWalkthroughObjectives(workspace.workspaceId);

  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const enriched = attachExecutiveSummaryIntelligenceFeed(baseModel);
  const okrCard = enriched.cards.find((card) => card.kind === "executive_attention");

  assert.equal(okrCard?.primaryValue, "Objectives: 3");
});

test("does not mutate OKR, KPI, or scene storage during dashboard aggregation", () => {
  const workspace = createWorkspace("Dashboard OKR Safety Workspace");
  seedManualWalkthroughObjectives(workspace.workspaceId);

  const before = {
    objectives: window.localStorage.getItem(OBJECTIVE_STORAGE_KEY),
    health: window.localStorage.getItem(OKR_HEALTH_STORAGE_KEY),
    progress: window.localStorage.getItem(OKR_PROGRESS_STORAGE_KEY),
  };

  getDashboardOkrSummary(workspace.workspaceId);
  getDashboardCriticalObjectives(workspace.workspaceId);
  getDashboardWarningObjectives(workspace.workspaceId);
  attachExecutiveSummaryIntelligenceFeed(
    aggregateExecutiveSummary({
      dashboardContext: "overview",
      normalizedContext: null,
    })
  );

  assert.equal(window.localStorage.getItem(OBJECTIVE_STORAGE_KEY), before.objectives);
  assert.equal(window.localStorage.getItem(OKR_HEALTH_STORAGE_KEY), before.health);
  assert.equal(window.localStorage.getItem(OKR_PROGRESS_STORAGE_KEY), before.progress);
});
