import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import { resetWorkspaceScenesForTests } from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import {
  createWorkspaceKpi,
  resetWorkspaceKpiMemoryForTests,
  resetWorkspaceKpiStoreForTests,
} from "./workspaceKpiContract.ts";
import {
  NEXORA_KPI_CALCULATION_ENGINE_LOG_PREFIX,
  WORKSPACE_KPI_CALCULATION_ENGINE_SOURCE,
  WORKSPACE_KPI_CALCULATION_ENGINE_TAGS,
  WORKSPACE_KPI_PROFILE_STORAGE_KEY,
  buildWorkspaceKpiProfileReason,
  calculateKpiProgressPercent,
  calculateKpiScore,
  calculateKpiVariance,
  calculateWorkspaceKpis,
  deriveKpiTrend,
  getWorkspaceKpiProfile,
  getWorkspaceKpiProfiles,
  resetWorkspaceKpiProfileMemoryForTests,
  resetWorkspaceKpiProfileStoreForTests,
} from "./workspaceKpiCalculationEngine.ts";

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
  resetWorkspaceKpiProfileStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function snapshotNonKpiStorageKeys(): Record<string, string | null> {
  ensureBrowserStorage();
  const keys = [
    "nexora.workspaceObjects.v1",
    "nexora.workspaceRelationships.v1",
    "nexora.workspaceScenes.v1",
    "nexora.workspaceObjectIntelligenceProfiles.v1",
    "nexora.workspaceImpactProfiles.v1",
    "nexora.workspaceDependencyProfiles.v1",
  ];
  return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-4:2 KPI calculation engine tags and storage key", () => {
  assert.equal(NEXORA_KPI_CALCULATION_ENGINE_LOG_PREFIX, "[NexoraKpiCalculationEngine]");
  assert.equal(WORKSPACE_KPI_PROFILE_STORAGE_KEY, "nexora.workspaceKpiProfiles.v1");
  assert.deepEqual(WORKSPACE_KPI_CALCULATION_ENGINE_TAGS, [
    "[DS42_KPI_CALCULATION_ENGINE]",
    "[KPI_PROFILES_READY]",
    "[KPI_PROGRESS_CALCULATED]",
    "[KPI_VARIANCE_CALCULATED]",
    "[KPI_TREND_READY]",
    "[DS43_READY]",
    "[DS_4_2_COMPLETE]",
  ]);
});

test("calculates progress, score, variance, and trend primitives", () => {
  assert.equal(calculateKpiProgressPercent(85000, 100000), 85);
  assert.equal(calculateKpiProgressPercent(100000, 100000), 100);
  assert.equal(calculateKpiProgressPercent(120000, 100000), 120);
  assert.equal(calculateKpiScore(85), 85);
  assert.equal(calculateKpiScore(100), 100);
  assert.equal(calculateKpiScore(120), 100);
  assert.equal(calculateKpiVariance(85000, 100000), -15000);
  assert.equal(calculateKpiVariance(100, 100), 0);
  assert.equal(calculateKpiVariance(130, 100), 30);
  assert.equal(deriveKpiTrend(-15000), "declining");
  assert.equal(deriveKpiTrend(0), "stable");
  assert.equal(deriveKpiTrend(2), "improving");
});

test("builds deterministic KPI profile reasons", () => {
  assert.equal(
    buildWorkspaceKpiProfileReason({
      name: "Revenue",
      progressPercent: 85,
      variance: -15000,
    }),
    "Revenue reached 85% of target."
  );
  assert.equal(
    buildWorkspaceKpiProfileReason({
      name: "Customer Satisfaction",
      progressPercent: 102,
      variance: 2,
    }),
    "Customer Satisfaction exceeded target."
  );
});

test("calculates manual walkthrough KPI profiles", () => {
  const workspace = createWorkspace("KPI Calculation Workspace");

  const revenue = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100000,
    currentValue: 85000,
  });
  const satisfaction = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Customer Satisfaction",
    unit: "score",
    targetValue: 90,
    currentValue: 92,
  });

  const result = calculateWorkspaceKpis(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.profiles.length, 2);
  assert.ok(result.intelligenceContext);

  const revenueProfile = getWorkspaceKpiProfile(
    workspace.workspaceId,
    revenue.kpi?.kpiId ?? ""
  );
  assert.ok(revenueProfile);
  assert.equal(revenueProfile.progressPercent, 85);
  assert.equal(revenueProfile.variance, -15000);
  assert.equal(revenueProfile.trend, "declining");
  assert.equal(revenueProfile.score, 85);
  assert.equal(revenueProfile.reason, "Revenue reached 85% of target.");
  assert.equal(revenueProfile.source, WORKSPACE_KPI_CALCULATION_ENGINE_SOURCE);

  const satisfactionProfile = getWorkspaceKpiProfile(
    workspace.workspaceId,
    satisfaction.kpi?.kpiId ?? ""
  );
  assert.ok(satisfactionProfile);
  assert.equal(satisfactionProfile.progressPercent, 102);
  assert.equal(satisfactionProfile.variance, 2);
  assert.equal(satisfactionProfile.trend, "improving");
  assert.equal(satisfactionProfile.score, 100);
  assert.equal(satisfactionProfile.reason, "Customer Satisfaction exceeded target.");
});

test("persists KPI profiles and isolates workspaces", () => {
  const workspaceA = createWorkspace("KPI Profile Workspace A");
  const workspaceB = createWorkspace("KPI Profile Workspace B");

  createWorkspaceKpi({
    workspaceId: workspaceA.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100,
    currentValue: 100,
  });
  calculateWorkspaceKpis(workspaceA.workspaceId);

  assert.equal(getWorkspaceKpiProfiles(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceKpiProfiles(workspaceB.workspaceId).length, 0);

  const storedRaw = window.localStorage.getItem(WORKSPACE_KPI_PROFILE_STORAGE_KEY);
  assert.ok(storedRaw);
  resetWorkspaceKpiProfileMemoryForTests();
  assert.equal(getWorkspaceKpiProfiles(workspaceA.workspaceId).length, 1);
});

test("handles empty workspace, missing KPI, and invalid workspace", () => {
  const emptyWorkspace = createWorkspace("Empty KPI Calculation Workspace");
  const emptyResult = calculateWorkspaceKpis(emptyWorkspace.workspaceId);
  assert.equal(emptyResult.success, false);
  assert.equal(emptyResult.reason, "no_kpis");

  const invalidResult = calculateWorkspaceKpis("");
  assert.equal(invalidResult.success, false);
  assert.equal(invalidResult.reason, "missing_workspace");

  const workspace = createWorkspace("Missing KPI Workspace");
  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100,
    currentValue: 80,
  });
  calculateWorkspaceKpis(workspace.workspaceId);
  assert.equal(getWorkspaceKpiProfile(workspace.workspaceId, "wkpi_missing"), null);
});

test("does not mutate scene, topology, object, or KPI definition storage", () => {
  const workspace = createWorkspace("KPI Safety Workspace");
  const nonKpiBefore = snapshotNonKpiStorageKeys();

  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100000,
    currentValue: 130000,
  });
  const kpiStorageBefore = window.localStorage.getItem("nexora.workspaceKpis.v1");

  calculateWorkspaceKpis(workspace.workspaceId);

  assert.equal(window.localStorage.getItem("nexora.workspaceKpis.v1"), kpiStorageBefore);
  assert.deepEqual(snapshotNonKpiStorageKeys(), nonKpiBefore);

  resetWorkspaceKpiMemoryForTests();
  const profiles = getWorkspaceKpiProfiles(workspace.workspaceId);
  assert.equal(profiles.length, 1);
  assert.equal(profiles[0]?.progressPercent, 130);
  assert.equal(profiles[0]?.score, 100);
  assert.equal(profiles[0]?.trend, "improving");
});
