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
import {
  NEXORA_OKR_FOUNDATION_LOG_PREFIX,
  WORKSPACE_KEY_RESULT_STORAGE_KEY,
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
  WORKSPACE_OKR_SOURCE,
  WORKSPACE_OKR_TAGS,
  createWorkspaceKeyResult,
  createWorkspaceObjective,
  deleteWorkspaceKeyResult,
  deleteWorkspaceObjective,
  getWorkspaceKeyResult,
  getWorkspaceKeyResults,
  getWorkspaceKeyResultsForObjective,
  getWorkspaceObjective,
  getWorkspaceObjectives,
  resetWorkspaceOkrMemoryForTests,
  resetWorkspaceOkrStoreForTests,
  updateWorkspaceKeyResult,
  updateWorkspaceObjective,
} from "./workspaceOkrContract.ts";

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
  resetWorkspaceOkrStoreForTests();
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

test("exports DS-5:1 OKR foundation tags and storage keys", () => {
  assert.equal(NEXORA_OKR_FOUNDATION_LOG_PREFIX, "[NexoraOkrFoundation]");
  assert.equal(WORKSPACE_OBJECTIVE_STORAGE_KEY, "nexora.workspaceObjectives.v1");
  assert.equal(WORKSPACE_KEY_RESULT_STORAGE_KEY, "nexora.workspaceKeyResults.v1");
  assert.deepEqual(WORKSPACE_OKR_TAGS, [
    "[DS51_OKR_FOUNDATION]",
    "[OKR_INTELLIGENCE_FOUNDATION]",
    "[OBJECTIVES_READY]",
    "[KEY_RESULTS_READY]",
    "[OKR_STORAGE_READY]",
    "[DS52_READY]",
    "[DS_5_1_COMPLETE]",
  ]);
});

test("manual walkthrough creates objective and key results with persistence", () => {
  const workspace = createWorkspace("OKR Foundation Workspace");

  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Become Market Leader",
    description: "Expand market share and retention.",
    status: "active",
  });
  assert.equal(objective.success, true);
  assert.equal(objective.objective?.status, "active");
  assert.equal(objective.objective?.source, WORKSPACE_OKR_SOURCE);

  const objectiveId = objective.objective?.objectiveId ?? "";
  assert.ok(objectiveId);

  const revenue = createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId,
    title: "Increase Revenue",
    targetValue: 30,
    currentValue: 10,
    unit: "%",
  });
  const retention = createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId,
    title: "Increase Retention",
    targetValue: 90,
    currentValue: 82,
    unit: "%",
  });

  assert.equal(revenue.success, true);
  assert.equal(retention.success, true);
  assert.equal(getWorkspaceKeyResultsForObjective(workspace.workspaceId, objectiveId).length, 2);

  const updatedObjective = updateWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    objectiveId,
    status: "paused",
  });
  assert.equal(updatedObjective.success, true);
  assert.equal(updatedObjective.objective?.status, "paused");

  const updatedKeyResult = updateWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    keyResultId: revenue.keyResult?.keyResultId ?? "",
    currentValue: 15,
  });
  assert.equal(updatedKeyResult.success, true);
  assert.equal(updatedKeyResult.keyResult?.currentValue, 15);

  assert.ok(window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY));
  assert.ok(window.localStorage.getItem(WORKSPACE_KEY_RESULT_STORAGE_KEY));

  resetWorkspaceOkrMemoryForTests();
  assert.equal(getWorkspaceObjectives(workspace.workspaceId).length, 1);
  assert.equal(getWorkspaceKeyResults(workspace.workspaceId).length, 2);
  assert.equal(getWorkspaceObjective(workspace.workspaceId, objectiveId)?.title, "Become Market Leader");
});

test("creates, updates, and deletes objectives and key results", () => {
  const workspace = createWorkspace("OKR CRUD Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Grow Revenue",
  });
  const objectiveId = objective.objective?.objectiveId ?? "";

  const keyResult = createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId,
    title: "Increase ARR",
    targetValue: 100,
    currentValue: 40,
    unit: "USD",
  });
  const keyResultId = keyResult.keyResult?.keyResultId ?? "";

  assert.equal(getWorkspaceKeyResult(workspace.workspaceId, keyResultId)?.title, "Increase ARR");

  const deletedKeyResult = deleteWorkspaceKeyResult(workspace.workspaceId, keyResultId);
  assert.equal(deletedKeyResult.deleted, true);
  assert.equal(getWorkspaceKeyResults(workspace.workspaceId).length, 0);

  const deletedObjective = deleteWorkspaceObjective(workspace.workspaceId, objectiveId);
  assert.equal(deletedObjective.deleted, true);
  assert.equal(getWorkspaceObjectives(workspace.workspaceId).length, 0);
});

test("deleting objective removes associated key results", () => {
  const workspace = createWorkspace("OKR Cascade Delete Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Improve Operations",
  });
  const objectiveId = objective.objective?.objectiveId ?? "";

  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId,
    title: "Reduce Cost",
    targetValue: 20,
    currentValue: 8,
    unit: "%",
  });

  deleteWorkspaceObjective(workspace.workspaceId, objectiveId);
  assert.equal(getWorkspaceKeyResultsForObjective(workspace.workspaceId, objectiveId).length, 0);
});

test("isolates OKRs by workspace and handles empty or invalid workspaces", () => {
  const workspaceA = createWorkspace("OKR Workspace A");
  const workspaceB = createWorkspace("OKR Workspace B");

  createWorkspaceObjective({
    workspaceId: workspaceA.workspaceId,
    title: "Objective A",
  });

  assert.equal(getWorkspaceObjectives(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceObjectives(workspaceB.workspaceId).length, 0);
  assert.equal(getWorkspaceObjectives("").length, 0);

  const invalidObjective = createWorkspaceObjective({
    workspaceId: "",
    title: "Invalid",
  });
  assert.equal(invalidObjective.success, false);
  assert.equal(invalidObjective.reason, "missing_workspace");

  const emptyWorkspace = createWorkspace("Empty OKR Workspace");
  assert.equal(getWorkspaceObjectives(emptyWorkspace.workspaceId).length, 0);
  assert.equal(getWorkspaceKeyResults(emptyWorkspace.workspaceId).length, 0);
});

test("rejects invalid key result creation and missing lookups", () => {
  const workspace = createWorkspace("OKR Validation Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Validate Objective",
  });
  const objectiveId = objective.objective?.objectiveId ?? "";

  const missingObjective = createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: "wobj_missing",
    title: "Invalid KR",
    targetValue: 10,
    currentValue: 5,
    unit: "%",
  });
  assert.equal(missingObjective.success, false);
  assert.equal(missingObjective.reason, "objective_not_found");

  const invalidKeyResult = createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId,
    title: "Invalid Target",
    targetValue: Number.NaN,
    currentValue: 5,
    unit: "%",
  });
  assert.equal(invalidKeyResult.success, false);
  assert.equal(invalidKeyResult.reason, "invalid_target_value");

  assert.equal(getWorkspaceObjective(workspace.workspaceId, "wobj_missing"), null);
  assert.equal(getWorkspaceKeyResult(workspace.workspaceId, "wkr_missing"), null);
});

test("does not mutate KPI, scene, or unrelated storage", () => {
  const workspace = createWorkspace("OKR Safety Workspace");
  const before = {
    protected: snapshotProtectedStorageKeys(),
    scene: getWorkspaceSceneJson(workspace.workspaceId),
  };

  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Safety Objective",
  });
  createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: objective.objective?.objectiveId ?? "",
    title: "Safety Key Result",
    targetValue: 100,
    currentValue: 50,
    unit: "score",
  });

  assert.deepEqual(snapshotProtectedStorageKeys(), before.protected);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), before.scene);
});
