import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import {
  WORKSPACE_KPI_STORAGE_KEY,
  resetWorkspaceKpiStoreForTests,
} from "../kpi/workspaceKpiContract.ts";
import { resetWorkspaceKpiProfileStoreForTests } from "../kpi/workspaceKpiCalculationEngine.ts";
import {
  createWorkspaceKeyResult,
  createWorkspaceObjective,
  resetWorkspaceOkrMemoryForTests,
  resetWorkspaceOkrStoreForTests,
} from "./workspaceOkrContract.ts";
import {
  WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
  calculateWorkspaceOkrProgress,
  getWorkspaceOkrProgressProfile,
  getWorkspaceOkrProgressProfiles,
  resetWorkspaceOkrProgressProfileMemoryForTests,
  resetWorkspaceOkrProgressProfileStoreForTests,
} from "./workspaceOkrProgressEngine.ts";
import {
  NEXORA_OKR_HEALTH_LOG_PREFIX,
  WORKSPACE_OKR_HEALTH_ENGINE_SOURCE,
  WORKSPACE_OKR_HEALTH_ENGINE_TAGS,
  WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY,
  WORKSPACE_OKR_HEALTH_PROGRESS_READ_APIS,
  buildWorkspaceOkrHealthReason,
  calculateOkrHealthScore,
  deriveOkrHealthSeverity,
  deriveOkrHealthStatus,
  evaluateWorkspaceOkrHealth,
  getWorkspaceOkrHealthProfile,
  getWorkspaceOkrHealthProfiles,
  resetWorkspaceOkrHealthProfileMemoryForTests,
  resetWorkspaceOkrHealthProfileStoreForTests,
} from "./workspaceOkrHealthEngine.ts";

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
  resetWorkspaceOkrStoreForTests();
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
    WORKSPACE_KPI_STORAGE_KEY,
    "nexora.workspaceKpis.v1",
    "nexora.workspaceKpiProfiles.v1",
    "nexora.workspaceObjectives.v1",
    "nexora.workspaceKeyResults.v1",
    WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
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

test("exports DS-5:3 OKR health engine tags and storage key", () => {
  assert.equal(NEXORA_OKR_HEALTH_LOG_PREFIX, "[NexoraOkrHealth]");
  assert.equal(
    WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY,
    "nexora.workspaceOkrHealthProfiles.v1"
  );
  assert.deepEqual(WORKSPACE_OKR_HEALTH_PROGRESS_READ_APIS, [
    "getWorkspaceOkrProgressProfile",
    "getWorkspaceOkrProgressProfiles",
  ]);
  assert.deepEqual(WORKSPACE_OKR_HEALTH_ENGINE_TAGS, [
    "[DS53_OKR_HEALTH_ENGINE]",
    "[OKR_HEALTH_READY]",
    "[OBJECTIVE_HEALTH_CLASSIFIED]",
    "[OKR_SEVERITY_READY]",
    "[DS54_READY]",
    "[DS_5_3_COMPLETE]",
  ]);
});

test("derives health status and severity thresholds", () => {
  assert.equal(deriveOkrHealthStatus(102), "healthy");
  assert.equal(deriveOkrHealthStatus(95), "watch");
  assert.equal(deriveOkrHealthStatus(85), "warning");
  assert.equal(deriveOkrHealthStatus(65), "critical");
  assert.equal(deriveOkrHealthStatus(null), "unknown");

  assert.equal(deriveOkrHealthSeverity({ healthStatus: "healthy", trend: "stable" }), "none");
  assert.equal(deriveOkrHealthSeverity({ healthStatus: "watch", trend: "stable" }), "low");
  assert.equal(deriveOkrHealthSeverity({ healthStatus: "warning", trend: "stable" }), "medium");
  assert.equal(
    deriveOkrHealthSeverity({ healthStatus: "warning", trend: "declining" }),
    "high"
  );
  assert.equal(deriveOkrHealthSeverity({ healthStatus: "critical", trend: "stable" }), "high");
  assert.equal(
    deriveOkrHealthSeverity({ healthStatus: "critical", trend: "declining" }),
    "critical"
  );
  assert.equal(deriveOkrHealthSeverity({ healthStatus: "unknown", trend: "unknown" }), "medium");
});

test("adjusts health score for trend", () => {
  assert.equal(calculateOkrHealthScore(70, "declining"), 65);
  assert.equal(calculateOkrHealthScore(100, "improving"), 100);
  assert.equal(calculateOkrHealthScore(50, "unknown"), 40);
});

test("evaluates manual walkthrough health profile for Become Market Leader", () => {
  const workspace = createWorkspace("OKR Health Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Become Market Leader",
  });
  const objectiveId = objective.objective?.objectiveId ?? "";

  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId,
    title: "Revenue Growth",
    targetValue: 30,
    currentValue: 15,
    unit: "%",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId,
    title: "Customer Retention",
    targetValue: 90,
    currentValue: 81,
    unit: "%",
  });

  calculateWorkspaceOkrProgress(workspace.workspaceId);
  const result = evaluateWorkspaceOkrHealth(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.profiles.length, 1);

  const health = getWorkspaceOkrHealthProfile(workspace.workspaceId, objectiveId);
  assert.ok(health);
  assert.equal(health.healthStatus, "warning");
  assert.equal(health.severity, "high");
  assert.equal(health.healthScore, 65);
  assert.equal(health.progressPercent, 70);
  assert.equal(health.trend, "declining");
  assert.equal(
    health.healthReason,
    "Become Market Leader objective reached 70% progress and is declining."
  );
  assert.equal(health.source, WORKSPACE_OKR_HEALTH_ENGINE_SOURCE);
});

test("classifies healthy, watch, warning, critical, and unknown objective health", () => {
  const workspace = createWorkspace("OKR Health Threshold Workspace");

  const healthyObjective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Customer Growth",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: healthyObjective.objective?.objectiveId ?? "",
    title: "Completed KR",
    targetValue: 100,
    currentValue: 100,
    unit: "score",
  });

  const watchObjective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Operational Excellence",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: watchObjective.objective?.objectiveId ?? "",
    title: "Near Target KR",
    targetValue: 100,
    currentValue: 95,
    unit: "score",
  });

  const warningObjective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Market Expansion",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: warningObjective.objective?.objectiveId ?? "",
    title: "Mid Progress KR",
    targetValue: 100,
    currentValue: 75,
    unit: "score",
  });

  const criticalObjective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Cost Reduction",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: criticalObjective.objective?.objectiveId ?? "",
    title: "Low Progress KR",
    targetValue: 100,
    currentValue: 50,
    unit: "score",
  });

  calculateWorkspaceOkrProgress(workspace.workspaceId);
  evaluateWorkspaceOkrHealth(workspace.workspaceId);
  const profiles = getWorkspaceOkrHealthProfiles(workspace.workspaceId);

  assert.ok(
    profiles.some(
      (profile) =>
        profile.healthStatus === "healthy" &&
        profile.healthReason.includes("exceeded expected progress")
    )
  );
  assert.ok(profiles.some((profile) => profile.healthStatus === "watch"));
  assert.ok(profiles.some((profile) => profile.healthStatus === "warning"));
  assert.ok(profiles.some((profile) => profile.healthStatus === "critical"));

  const unknownWorkspace = createWorkspace("Unknown OKR Health Workspace");
  createWorkspaceObjective({
    workspaceId: unknownWorkspace.workspaceId,
    title: "Missing Progress",
  });
  evaluateWorkspaceOkrHealth(unknownWorkspace.workspaceId);
  const unknownProfile = getWorkspaceOkrHealthProfiles(unknownWorkspace.workspaceId)[0];
  assert.equal(unknownProfile?.healthStatus, "unknown");
  assert.equal(unknownProfile?.severity, "medium");
  assert.equal(
    buildWorkspaceOkrHealthReason({
      objectiveTitle: "Missing Progress",
      progressProfile: null,
      healthStatus: "unknown",
    }),
    "Objective health is unknown because progress data is unavailable."
  );
});

test("escalates severity when warning or critical trends are declining", () => {
  const workspace = createWorkspace("OKR Trend Escalation Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Trend Objective",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: objective.objective?.objectiveId ?? "",
    title: "Declining KR",
    targetValue: 100,
    currentValue: 70,
    unit: "score",
  });

  calculateWorkspaceOkrProgress(workspace.workspaceId);
  evaluateWorkspaceOkrHealth(workspace.workspaceId);
  const profile = getWorkspaceOkrHealthProfiles(workspace.workspaceId)[0];
  assert.equal(profile?.healthStatus, "warning");
  assert.equal(profile?.trend, "declining");
  assert.equal(profile?.severity, "high");
});

test("persists health profiles and isolates workspaces", () => {
  const workspaceA = createWorkspace("OKR Health Workspace A");
  const workspaceB = createWorkspace("OKR Health Workspace B");

  const objectiveA = createWorkspaceObjective({
    workspaceId: workspaceA.workspaceId,
    title: "Objective A",
  });
  createWorkspaceKeyResult({
    workspaceId: workspaceA.workspaceId,
    objectiveId: objectiveA.objective?.objectiveId ?? "",
    title: "KR A",
    targetValue: 100,
    currentValue: 100,
    unit: "score",
  });

  calculateWorkspaceOkrProgress(workspaceA.workspaceId);
  evaluateWorkspaceOkrHealth(workspaceA.workspaceId);

  assert.equal(getWorkspaceOkrHealthProfiles(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceOkrHealthProfiles(workspaceB.workspaceId).length, 0);

  const storedRaw = window.localStorage.getItem(WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY);
  assert.ok(storedRaw);
  resetWorkspaceOkrHealthProfileMemoryForTests();
  assert.equal(getWorkspaceOkrHealthProfiles(workspaceA.workspaceId).length, 1);
});

test("does not mutate OKR progress profiles, KPI, OKR definitions, or scene storage", () => {
  const workspace = createWorkspace("OKR Health Safety Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Safety Objective",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: objective.objective?.objectiveId ?? "",
    title: "Safety KR",
    targetValue: 100,
    currentValue: 50,
    unit: "score",
  });

  calculateWorkspaceOkrProgress(workspace.workspaceId);
  const progressBefore = JSON.stringify(getWorkspaceOkrProgressProfiles(workspace.workspaceId));
  const protectedBefore = snapshotProtectedStorageKeys();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  evaluateWorkspaceOkrHealth(workspace.workspaceId);

  const progressAfter = JSON.stringify(getWorkspaceOkrProgressProfiles(workspace.workspaceId));
  assert.equal(progressAfter, progressBefore);
  assert.deepEqual(snapshotProtectedStorageKeys(), protectedBefore);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});

test("preserves DS-5:2 ownership by reading progress profiles only", () => {
  const workspace = createWorkspace("OKR Ownership Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Ownership Objective",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: objective.objective?.objectiveId ?? "",
    title: "Ownership KR",
    targetValue: 100,
    currentValue: 80,
    unit: "score",
  });

  calculateWorkspaceOkrProgress(workspace.workspaceId);
  const progressProfile = getWorkspaceOkrProgressProfile(
    workspace.workspaceId,
    objective.objective?.objectiveId ?? ""
  );
  assert.ok(progressProfile);

  evaluateWorkspaceOkrHealth(workspace.workspaceId);
  const healthProfile = getWorkspaceOkrHealthProfile(
    workspace.workspaceId,
    objective.objective?.objectiveId ?? ""
  );
  assert.ok(healthProfile);
  assert.equal(healthProfile.progressPercent, progressProfile.progressPercent);
  assert.equal(healthProfile.variance, progressProfile.variance);
  assert.equal(healthProfile.trend, progressProfile.trend);
});

test("handles empty workspace and invalid workspace", () => {
  const emptyWorkspace = createWorkspace("Empty OKR Health Workspace");
  const emptyResult = evaluateWorkspaceOkrHealth(emptyWorkspace.workspaceId);
  assert.equal(emptyResult.success, false);
  assert.equal(emptyResult.reason, "no_objectives");

  const invalidResult = evaluateWorkspaceOkrHealth("");
  assert.equal(invalidResult.success, false);
  assert.equal(invalidResult.reason, "missing_workspace");
});

test("builds deterministic reason strings", () => {
  assert.equal(
    buildWorkspaceOkrHealthReason({
      objectiveTitle: "Customer Growth",
      progressProfile: {
        contractVersion: "DS-5:2",
        workspaceId: "workspace_test",
        objectiveId: "wobj_test",
        progressPercent: 110,
        score: 100,
        keyResultCount: 1,
        completedKeyResults: 1,
        variance: 10,
        trend: "improving",
        reason: "",
        calculatedAt: new Date().toISOString(),
        source: "ds-5:2-okr-progress",
      },
      healthStatus: "healthy",
    }),
    "Customer Growth objective exceeded expected progress."
  );
  assert.equal(
    buildWorkspaceOkrHealthReason({
      objectiveTitle: "Operational Excellence",
      progressProfile: {
        contractVersion: "DS-5:2",
        workspaceId: "workspace_test",
        objectiveId: "wobj_test",
        progressPercent: 65,
        score: 65,
        keyResultCount: 1,
        completedKeyResults: 0,
        variance: -10,
        trend: "declining",
        reason: "",
        calculatedAt: new Date().toISOString(),
        source: "ds-5:2-okr-progress",
      },
      healthStatus: "critical",
    }),
    "Operational Excellence objective reached 65% progress and is declining."
  );
});
