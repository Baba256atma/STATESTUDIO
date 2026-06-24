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
  NEXORA_WORKSPACE_KPI_LOG_PREFIX,
  WORKSPACE_KPI_SOURCE,
  WORKSPACE_KPI_STORAGE_KEY,
  WORKSPACE_KPI_TAGS,
  createWorkspaceKpi,
  deleteWorkspaceKpi,
  deriveWorkspaceKpiStatus,
  getWorkspaceKpi,
  getWorkspaceKpis,
  resetWorkspaceKpiStoreForTests,
  resetWorkspaceKpiMemoryForTests,
  updateWorkspaceKpi,
} from "./workspaceKpiContract.ts";

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
  ];
  return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-4:1 KPI foundation tags and storage key", () => {
  assert.equal(NEXORA_WORKSPACE_KPI_LOG_PREFIX, "[NexoraWorkspaceKpi]");
  assert.equal(WORKSPACE_KPI_STORAGE_KEY, "nexora.workspaceKpis.v1");
  assert.deepEqual(WORKSPACE_KPI_TAGS, [
    "[DS41_KPI_FOUNDATION]",
    "[KPI_INTELLIGENCE_FOUNDATION]",
    "[KPI_STORAGE_READY]",
    "[DS42_READY]",
    "[DS_4_1_COMPLETE]",
  ]);
});

test("derives KPI status for manual walkthrough examples", () => {
  assert.equal(deriveWorkspaceKpiStatus(85000, 100000), "warning");
  assert.equal(deriveWorkspaceKpiStatus(92, 90), "healthy");
  assert.equal(deriveWorkspaceKpiStatus(70000, 100000), "critical");
  assert.equal(deriveWorkspaceKpiStatus(Number.NaN, 100), "unknown");
});

test("creates, updates, deletes, and persists workspace KPIs", () => {
  const workspace = createWorkspace("KPI Foundation Workspace");
  const created = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue",
    description: "Monthly revenue target",
    unit: "USD",
    targetValue: 100000,
    currentValue: 85000,
  });
  assert.equal(created.success, true);
  assert.equal(created.kpi?.status, "warning");
  assert.equal(created.kpi?.source, WORKSPACE_KPI_SOURCE);

  const kpiId = created.kpi?.kpiId ?? "";
  assert.ok(kpiId);

  const updated = updateWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    kpiId,
    currentValue: 100000,
  });
  assert.equal(updated.success, true);
  assert.equal(updated.kpi?.status, "healthy");

  const storedRaw = window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY);
  assert.ok(storedRaw);
  resetWorkspaceKpiMemoryForTests();
  const reloaded = getWorkspaceKpis(workspace.workspaceId);
  assert.equal(reloaded.length, 1);
  assert.equal(reloaded[0]?.kpiId, kpiId);
  assert.equal(reloaded[0]?.status, "healthy");

  const deleted = deleteWorkspaceKpi(workspace.workspaceId, kpiId);
  assert.equal(deleted.success, true);
  assert.equal(deleted.deleted, true);
  assert.equal(getWorkspaceKpis(workspace.workspaceId).length, 0);
});

test("isolates KPIs by workspace and handles empty or invalid workspaces", () => {
  const workspaceA = createWorkspace("KPI Workspace A");
  const workspaceB = createWorkspace("KPI Workspace B");

  createWorkspaceKpi({
    workspaceId: workspaceA.workspaceId,
    name: "Customer Satisfaction",
    unit: "score",
    targetValue: 90,
    currentValue: 92,
  });

  assert.equal(getWorkspaceKpis(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceKpis(workspaceB.workspaceId).length, 0);
  assert.equal(getWorkspaceKpis("").length, 0);

  const invalidCreate = createWorkspaceKpi({
    workspaceId: "",
    name: "Invalid",
    unit: "score",
    targetValue: 1,
    currentValue: 1,
  });
  assert.equal(invalidCreate.success, false);
  assert.equal(invalidCreate.reason, "missing_workspace");

  const emptyWorkspace = createWorkspace("Empty KPI Workspace");
  assert.equal(getWorkspaceKpis(emptyWorkspace.workspaceId).length, 0);
});

test("does not mutate scene, topology, or object storage", () => {
  const workspace = createWorkspace("KPI Safety Workspace");
  const before = snapshotNonKpiStorageKeys();

  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100000,
    currentValue: 85000,
  });
  updateWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    kpiId: getWorkspaceKpis(workspace.workspaceId)[0]?.kpiId ?? "",
    currentValue: 95000,
  });
  deleteWorkspaceKpi(
    workspace.workspaceId,
    getWorkspaceKpis(workspace.workspaceId)[0]?.kpiId ?? "missing"
  );
  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Customer Satisfaction",
    unit: "score",
    targetValue: 90,
    currentValue: 92,
  });

  const after = snapshotNonKpiStorageKeys();
  assert.deepEqual(after, before);
});

test("rejects invalid KPI updates and missing KPI lookups", () => {
  const workspace = createWorkspace("KPI Validation Workspace");
  const created = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100000,
    currentValue: 85000,
  });
  const kpiId = created.kpi?.kpiId ?? "";

  const missingUpdate = updateWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    kpiId: "wkpi_missing",
    currentValue: 90000,
  });
  assert.equal(missingUpdate.success, false);
  assert.equal(missingUpdate.reason, "kpi_not_found");

  const invalidUpdate = updateWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    kpiId,
    targetValue: Number.NaN,
  });
  assert.equal(invalidUpdate.success, false);
  assert.equal(invalidUpdate.reason, "invalid_target_value");

  assert.equal(getWorkspaceKpi(workspace.workspaceId, "wkpi_missing"), null);
  assert.equal(getWorkspaceKpi("", kpiId), null);
});
