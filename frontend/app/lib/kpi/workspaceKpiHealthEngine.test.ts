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
  resetWorkspaceKpiStoreForTests,
} from "./workspaceKpiContract.ts";
import {
  calculateWorkspaceKpis,
  resetWorkspaceKpiProfileStoreForTests,
} from "./workspaceKpiCalculationEngine.ts";
import {
  NEXORA_KPI_HEALTH_LOG_PREFIX,
  WORKSPACE_KPI_HEALTH_ENGINE_SOURCE,
  WORKSPACE_KPI_HEALTH_ENGINE_TAGS,
  WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY,
  buildWorkspaceKpiHealthReason,
  calculateKpiHealthScore,
  deriveKpiHealthSeverity,
  deriveKpiHealthStatus,
  evaluateWorkspaceKpiHealth,
  getWorkspaceKpiHealthProfile,
  getWorkspaceKpiHealthProfiles,
  resetWorkspaceKpiHealthProfileMemoryForTests,
  resetWorkspaceKpiHealthProfileStoreForTests,
} from "./workspaceKpiHealthEngine.ts";

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
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function snapshotProtectedStorageKeys(): Record<string, string | null> {
  ensureBrowserStorage();
  const keys = [
    "nexora.workspaceKpis.v1",
    "nexora.workspaceKpiProfiles.v1",
    "nexora.workspaceObjects.v1",
    "nexora.workspaceRelationships.v1",
    "nexora.workspaceScenes.v1",
  ];
  return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-4:3 KPI health engine tags and storage key", () => {
  assert.equal(NEXORA_KPI_HEALTH_LOG_PREFIX, "[NexoraKpiHealth]");
  assert.equal(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY, "nexora.workspaceKpiHealthProfiles.v1");
  assert.deepEqual(WORKSPACE_KPI_HEALTH_ENGINE_TAGS, [
    "[DS43_KPI_HEALTH_ENGINE]",
    "[KPI_HEALTH_PROFILES_READY]",
    "[KPI_STATUS_CLASSIFIED]",
    "[KPI_SEVERITY_READY]",
    "[DS44_READY]",
    "[DS_4_3_COMPLETE]",
  ]);
});

test("derives health status and severity thresholds", () => {
  assert.equal(deriveKpiHealthStatus(102), "healthy");
  assert.equal(deriveKpiHealthStatus(95), "watch");
  assert.equal(deriveKpiHealthStatus(85), "warning");
  assert.equal(deriveKpiHealthStatus(65), "critical");
  assert.equal(deriveKpiHealthStatus(null), "unknown");

  assert.equal(
    deriveKpiHealthSeverity({ healthStatus: "healthy", trend: "stable" }),
    "none"
  );
  assert.equal(deriveKpiHealthSeverity({ healthStatus: "watch", trend: "stable" }), "low");
  assert.equal(
    deriveKpiHealthSeverity({ healthStatus: "warning", trend: "stable" }),
    "medium"
  );
  assert.equal(
    deriveKpiHealthSeverity({ healthStatus: "warning", trend: "declining" }),
    "high"
  );
  assert.equal(
    deriveKpiHealthSeverity({ healthStatus: "critical", trend: "stable" }),
    "high"
  );
  assert.equal(
    deriveKpiHealthSeverity({ healthStatus: "critical", trend: "declining" }),
    "critical"
  );
  assert.equal(deriveKpiHealthSeverity({ healthStatus: "unknown", trend: "unknown" }), "medium");
});

test("adjusts health score for trend", () => {
  assert.equal(calculateKpiHealthScore(85, "declining"), 80);
  assert.equal(calculateKpiHealthScore(100, "improving"), 100);
  assert.equal(calculateKpiHealthScore(50, "unknown"), 40);
});

test("evaluates manual walkthrough health profiles", () => {
  const workspace = createWorkspace("KPI Health Workspace");

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

  calculateWorkspaceKpis(workspace.workspaceId);
  const result = evaluateWorkspaceKpiHealth(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.profiles.length, 2);

  const revenueHealth = getWorkspaceKpiHealthProfile(
    workspace.workspaceId,
    revenue.kpi?.kpiId ?? ""
  );
  assert.ok(revenueHealth);
  assert.equal(revenueHealth.healthStatus, "warning");
  assert.equal(revenueHealth.severity, "high");
  assert.equal(revenueHealth.progressPercent, 85);
  assert.equal(revenueHealth.trend, "declining");
  assert.equal(revenueHealth.healthReason, "Revenue is at 85% of target and declining.");
  assert.equal(revenueHealth.source, WORKSPACE_KPI_HEALTH_ENGINE_SOURCE);

  const satisfactionHealth = getWorkspaceKpiHealthProfile(
    workspace.workspaceId,
    satisfaction.kpi?.kpiId ?? ""
  );
  assert.ok(satisfactionHealth);
  assert.equal(satisfactionHealth.healthStatus, "healthy");
  assert.equal(satisfactionHealth.severity, "none");
  assert.equal(satisfactionHealth.healthReason, "Customer Satisfaction exceeded target and is improving.");
});

test("classifies healthy, watch, critical, and unknown KPI health", () => {
  const workspace = createWorkspace("KPI Health Threshold Workspace");

  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "On Target",
    unit: "score",
    targetValue: 100,
    currentValue: 100,
  });
  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Near Target",
    unit: "score",
    targetValue: 100,
    currentValue: 95,
  });
  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Low KPI",
    unit: "score",
    targetValue: 100,
    currentValue: 60,
  });

  calculateWorkspaceKpis(workspace.workspaceId);
  evaluateWorkspaceKpiHealth(workspace.workspaceId);
  const profiles = getWorkspaceKpiHealthProfiles(workspace.workspaceId);

  assert.ok(profiles.some((profile) => profile.healthStatus === "healthy" && profile.progressPercent === 100));
  assert.ok(profiles.some((profile) => profile.healthStatus === "watch" && profile.progressPercent === 95));
  assert.ok(profiles.some((profile) => profile.healthStatus === "critical" && profile.progressPercent === 60));

  const unknownWorkspace = createWorkspace("Unknown KPI Health Workspace");
  createWorkspaceKpi({
    workspaceId: unknownWorkspace.workspaceId,
    name: "Missing Calculation",
    unit: "score",
    targetValue: 100,
    currentValue: 80,
  });
  evaluateWorkspaceKpiHealth(unknownWorkspace.workspaceId);
  const unknownProfile = getWorkspaceKpiHealthProfiles(unknownWorkspace.workspaceId)[0];
  assert.equal(unknownProfile?.healthStatus, "unknown");
  assert.equal(unknownProfile?.severity, "medium");
  assert.equal(
    buildWorkspaceKpiHealthReason({
      kpiName: "Forecast Accuracy",
      calculationProfile: null,
      healthStatus: "unknown",
    }),
    "KPI health is unknown because calculation data is missing."
  );
});

test("persists health profiles and isolates workspaces", () => {
  const workspaceA = createWorkspace("KPI Health Workspace A");
  const workspaceB = createWorkspace("KPI Health Workspace B");

  createWorkspaceKpi({
    workspaceId: workspaceA.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100,
    currentValue: 100,
  });
  calculateWorkspaceKpis(workspaceA.workspaceId);
  evaluateWorkspaceKpiHealth(workspaceA.workspaceId);

  assert.equal(getWorkspaceKpiHealthProfiles(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceKpiHealthProfiles(workspaceB.workspaceId).length, 0);

  const storedRaw = window.localStorage.getItem(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY);
  assert.ok(storedRaw);
  resetWorkspaceKpiHealthProfileMemoryForTests();
  assert.equal(getWorkspaceKpiHealthProfiles(workspaceA.workspaceId).length, 1);
});

test("does not mutate KPI definitions, calculation profiles, scene, or topology storage", () => {
  const workspace = createWorkspace("KPI Health Safety Workspace");

  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100000,
    currentValue: 85000,
  });
  calculateWorkspaceKpis(workspace.workspaceId);
  const protectedBefore = snapshotProtectedStorageKeys();

  evaluateWorkspaceKpiHealth(workspace.workspaceId);
  const protectedAfter = snapshotProtectedStorageKeys();

  assert.deepEqual(protectedAfter["nexora.workspaceKpis.v1"], protectedBefore["nexora.workspaceKpis.v1"]);
  assert.deepEqual(
    protectedAfter["nexora.workspaceKpiProfiles.v1"],
    protectedBefore["nexora.workspaceKpiProfiles.v1"]
  );
  assert.deepEqual(protectedAfter["nexora.workspaceObjects.v1"], protectedBefore["nexora.workspaceObjects.v1"]);
  assert.deepEqual(
    protectedAfter["nexora.workspaceRelationships.v1"],
    protectedBefore["nexora.workspaceRelationships.v1"]
  );
  assert.deepEqual(protectedAfter["nexora.workspaceScenes.v1"], protectedBefore["nexora.workspaceScenes.v1"]);
});

test("handles empty workspace and invalid workspace", () => {
  const emptyWorkspace = createWorkspace("Empty KPI Health Workspace");
  const emptyResult = evaluateWorkspaceKpiHealth(emptyWorkspace.workspaceId);
  assert.equal(emptyResult.success, false);
  assert.equal(emptyResult.reason, "no_kpis");

  const invalidResult = evaluateWorkspaceKpiHealth("");
  assert.equal(invalidResult.success, false);
  assert.equal(invalidResult.reason, "missing_workspace");
});
