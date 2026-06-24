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
  NEXORA_OKR_PROGRESS_LOG_PREFIX,
  WORKSPACE_OKR_PROGRESS_CONSUMER_LAYERS,
  WORKSPACE_OKR_PROGRESS_CONSUMER_READ_APIS,
  WORKSPACE_OKR_PROGRESS_ENGINE_OWNER,
  WORKSPACE_OKR_PROGRESS_ENGINE_SOURCE,
  WORKSPACE_OKR_PROGRESS_ENGINE_TAGS,
  WORKSPACE_OKR_PROGRESS_FORBIDDEN_CONSUMER_ACTIONS,
  WORKSPACE_OKR_PROGRESS_OWNERSHIP_RULE,
  WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
  buildKeyResultProgressSnapshot,
  buildWorkspaceOkrProgressReason,
  calculateKeyResultProgressPercent,
  calculateOkrScore,
  calculateOkrVariance,
  calculateWorkspaceOkrProgress,
  deriveOkrTrend,
  getWorkspaceOkrProgressProfile,
  getWorkspaceOkrProgressProfiles,
  resetWorkspaceOkrProgressProfileMemoryForTests,
  resetWorkspaceOkrProgressProfileStoreForTests,
} from "./workspaceOkrProgressEngine.ts";

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

test("exports DS-5:2 OKR progress engine tags and storage key", () => {
  assert.equal(NEXORA_OKR_PROGRESS_LOG_PREFIX, "[NexoraOkrProgress]");
  assert.equal(
    WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
    "nexora.workspaceOkrProgressProfiles.v1"
  );
  assert.equal(WORKSPACE_OKR_PROGRESS_ENGINE_OWNER, "workspaceOkrProgressEngine");
  assert.equal(
    WORKSPACE_OKR_PROGRESS_OWNERSHIP_RULE,
    "DS-5:2 owns all OKR progress calculations."
  );
  assert.deepEqual(WORKSPACE_OKR_PROGRESS_CONSUMER_READ_APIS, [
    "getWorkspaceOkrProgressProfile",
    "getWorkspaceOkrProgressProfiles",
  ]);
  assert.deepEqual(WORKSPACE_OKR_PROGRESS_FORBIDDEN_CONSUMER_ACTIONS, [
    "recalculate_objective_progress",
    "recalculate_key_result_progress",
    "duplicate_progress_engine",
  ]);
  assert.deepEqual(WORKSPACE_OKR_PROGRESS_CONSUMER_LAYERS, [
    "OKR Health",
    "Risk",
    "Scenario",
    "Dashboard",
    "Assistant",
  ]);
  assert.deepEqual(WORKSPACE_OKR_PROGRESS_ENGINE_TAGS, [
    "[DS52_OKR_PROGRESS_ENGINE]",
    "[OKR_PROGRESS_READY]",
    "[OBJECTIVE_PROGRESS_CALCULATED]",
    "[KEY_RESULT_PROGRESS_CALCULATED]",
    "[DS53_READY]",
    "[DS_5_2_COMPLETE]",
  ]);
});

test("derives key result progress, score, variance, and trend helpers", () => {
  assert.equal(calculateKeyResultProgressPercent(15, 30), 50);
  assert.equal(calculateKeyResultProgressPercent(81, 90), 90);
  assert.equal(calculateKeyResultProgressPercent(125, 100), 125);
  assert.equal(calculateKeyResultProgressPercent(250, 100), 200);
  assert.equal(calculateOkrScore(73), 73);
  assert.equal(calculateOkrScore(125), 100);
  assert.equal(calculateOkrVariance(15, 30), -15);
  assert.equal(deriveOkrTrend(5), "improving");
  assert.equal(deriveOkrTrend(0), "stable");
  assert.equal(deriveOkrTrend(-5), "declining");
});

test("manual walkthrough calculates objective progress for Become Market Leader", () => {
  const workspace = createWorkspace("OKR Progress Workspace");
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

  const result = calculateWorkspaceOkrProgress(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.profiles.length, 1);

  const profile = getWorkspaceOkrProgressProfile(workspace.workspaceId, objectiveId);
  assert.ok(profile);
  assert.equal(profile.progressPercent, 70);
  assert.equal(profile.score, 70);
  assert.equal(profile.keyResultCount, 2);
  assert.equal(profile.completedKeyResults, 0);
  assert.equal(profile.trend, "declining");
  assert.equal(profile.reason, "Become Market Leader objective reached 70% progress.");
  assert.equal(profile.source, WORKSPACE_OKR_PROGRESS_ENGINE_SOURCE);
});

test("calculates progress for multiple objectives and key results", () => {
  const workspace = createWorkspace("OKR Multi Objective Workspace");

  const objectiveA = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Grow Revenue",
  });
  const objectiveB = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Improve Retention",
  });

  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: objectiveA.objective?.objectiveId ?? "",
    title: "Increase ARR",
    targetValue: 100,
    currentValue: 100,
    unit: "USD",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: objectiveB.objective?.objectiveId ?? "",
    title: "Reduce Churn",
    targetValue: 10,
    currentValue: 5,
    unit: "%",
  });

  calculateWorkspaceOkrProgress(workspace.workspaceId);
  const profiles = getWorkspaceOkrProgressProfiles(workspace.workspaceId);
  assert.equal(profiles.length, 2);
  assert.ok(profiles.some((profile) => profile.completedKeyResults === 1));
  assert.ok(profiles.some((profile) => profile.trend === "declining"));
});

test("handles empty objective without key results", () => {
  const workspace = createWorkspace("OKR Empty Key Results Workspace");
  createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Empty Objective",
  });

  const result = calculateWorkspaceOkrProgress(workspace.workspaceId);
  assert.equal(result.success, true);
  const profile = result.profiles[0];
  assert.equal(profile?.progressPercent, 0);
  assert.equal(profile?.keyResultCount, 0);
  assert.equal(profile?.reason, "Empty Objective objective has no key results yet.");
});

test("isolates OKR progress profiles by workspace and persists reload", () => {
  const workspaceA = createWorkspace("OKR Progress Workspace A");
  const workspaceB = createWorkspace("OKR Progress Workspace B");

  const objectiveA = createWorkspaceObjective({
    workspaceId: workspaceA.workspaceId,
    title: "Objective A",
  });
  createWorkspaceKeyResult({
    workspaceId: workspaceA.workspaceId,
    objectiveId: objectiveA.objective?.objectiveId ?? "",
    title: "KR A",
    targetValue: 100,
    currentValue: 50,
    unit: "score",
  });

  calculateWorkspaceOkrProgress(workspaceA.workspaceId);
  assert.equal(getWorkspaceOkrProgressProfiles(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceOkrProgressProfiles(workspaceB.workspaceId).length, 0);

  assert.ok(window.localStorage.getItem(WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY));
  resetWorkspaceOkrProgressProfileMemoryForTests();
  assert.equal(getWorkspaceOkrProgressProfiles(workspaceA.workspaceId).length, 1);
});

test("returns no_objectives when workspace has no objectives", () => {
  const workspace = createWorkspace("OKR No Objectives Workspace");
  const result = calculateWorkspaceOkrProgress(workspace.workspaceId);
  assert.equal(result.success, false);
  assert.equal(result.reason, "no_objectives");
});

test("builds deterministic reason strings", () => {
  assert.equal(
    buildWorkspaceOkrProgressReason({
      objectiveTitle: "Market Leader",
      progressPercent: 73,
      variance: -5,
      keyResultCount: 2,
    }),
    "Market Leader objective reached 73% progress."
  );
  assert.equal(
    buildWorkspaceOkrProgressReason({
      objectiveTitle: "Revenue Growth",
      progressPercent: 110,
      variance: 10,
      keyResultCount: 1,
    }),
    "Revenue Growth objective exceeded target."
  );
  assert.equal(
    buildWorkspaceOkrProgressReason({
      objectiveTitle: "Customer Retention",
      progressPercent: 60,
      variance: -10,
      keyResultCount: 1,
    }),
    "Customer Retention objective is below expected progress."
  );
});

test("marks completed key results at or above 100 percent progress", () => {
  const snapshot = buildKeyResultProgressSnapshot({
    contractVersion: "DS-5:1",
    keyResultId: "wkr_test",
    objectiveId: "wobj_test",
    workspaceId: "workspace_test",
    title: "Completed KR",
    description: "",
    targetValue: 100,
    currentValue: 100,
    unit: "score",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: "ds-5:1-foundation",
  });
  assert.equal(snapshot.progressPercent, 100);
  assert.equal(snapshot.completed, true);
});

test("does not mutate KPI, OKR definitions, or scene storage during calculation", () => {
  const workspace = createWorkspace("OKR Progress Safety Workspace");
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

  const before = {
    protected: snapshotProtectedStorageKeys(),
    scene: getWorkspaceSceneJson(workspace.workspaceId),
  };

  calculateWorkspaceOkrProgress(workspace.workspaceId);
  getWorkspaceOkrProgressProfiles(workspace.workspaceId);

  assert.deepEqual(snapshotProtectedStorageKeys(), before.protected);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), before.scene);

  resetWorkspaceOkrMemoryForTests();
  assert.equal(getWorkspaceOkrProgressProfiles(workspace.workspaceId).length, 1);
});
