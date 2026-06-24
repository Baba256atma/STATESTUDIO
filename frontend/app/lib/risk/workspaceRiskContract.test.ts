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
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
  WORKSPACE_KEY_RESULT_STORAGE_KEY,
  resetWorkspaceOkrStoreForTests,
} from "../okr/workspaceOkrContract.ts";
import {
  NEXORA_RISK_FOUNDATION_LOG_PREFIX,
  WORKSPACE_RISK_SOURCE,
  WORKSPACE_RISK_STORAGE_KEY,
  WORKSPACE_RISK_TAGS,
  createWorkspaceRisk,
  deleteWorkspaceRisk,
  getWorkspaceRisk,
  getWorkspaceRisks,
  resetWorkspaceRiskMemoryForTests,
  resetWorkspaceRiskStoreForTests,
  updateWorkspaceRisk,
} from "./workspaceRiskContract.ts";

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
  resetWorkspaceRiskStoreForTests();
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
    WORKSPACE_OBJECTIVE_STORAGE_KEY,
    WORKSPACE_KEY_RESULT_STORAGE_KEY,
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

test("exports DS-6:1 risk foundation tags and storage key", () => {
  assert.equal(NEXORA_RISK_FOUNDATION_LOG_PREFIX, "[NexoraRiskFoundation]");
  assert.equal(WORKSPACE_RISK_STORAGE_KEY, "nexora.workspaceRisks.v1");
  assert.deepEqual(WORKSPACE_RISK_TAGS, [
    "[DS61_RISK_FOUNDATION]",
    "[RISK_INTELLIGENCE_FOUNDATION]",
    "[RISK_STORAGE_READY]",
    "[RISK_CRUD_READY]",
    "[DS62_READY]",
    "[DS_6_1_COMPLETE]",
  ]);
});

test("manual walkthrough creates risks with persistence", () => {
  const workspace = createWorkspace("Risk Foundation Workspace");

  const forecastQuality = createWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    title: "Forecast Quality Risk",
    description: "Forecast accuracy may degrade under demand volatility.",
    category: "operational",
    status: "active",
  });
  assert.equal(forecastQuality.success, true);
  assert.equal(forecastQuality.risk?.category, "operational");
  assert.equal(forecastQuality.risk?.status, "active");
  assert.equal(forecastQuality.risk?.source, WORKSPACE_RISK_SOURCE);

  const marketExpansion = createWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    title: "Market Expansion Risk",
    description: "Expansion into new regions may exceed capacity.",
    category: "strategic",
    status: "monitoring",
  });
  assert.equal(marketExpansion.success, true);
  assert.equal(marketExpansion.risk?.category, "strategic");
  assert.equal(marketExpansion.risk?.status, "monitoring");

  assert.equal(getWorkspaceRisks(workspace.workspaceId).length, 2);

  const updated = updateWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    riskId: forecastQuality.risk?.riskId ?? "",
    status: "monitoring",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.risk?.status, "monitoring");

  assert.ok(window.localStorage.getItem(WORKSPACE_RISK_STORAGE_KEY));

  resetWorkspaceRiskMemoryForTests();
  assert.equal(getWorkspaceRisks(workspace.workspaceId).length, 2);
  assert.equal(
    getWorkspaceRisk(workspace.workspaceId, forecastQuality.risk?.riskId ?? "")?.title,
    "Forecast Quality Risk"
  );
});

test("creates, updates, and deletes risks", () => {
  const workspace = createWorkspace("Risk CRUD Workspace");
  const created = createWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    title: "Supply Chain Risk",
    category: "operational",
  });
  const riskId = created.risk?.riskId ?? "";

  assert.equal(getWorkspaceRisk(workspace.workspaceId, riskId)?.title, "Supply Chain Risk");

  const deleted = deleteWorkspaceRisk(workspace.workspaceId, riskId);
  assert.equal(deleted.deleted, true);
  assert.equal(getWorkspaceRisks(workspace.workspaceId).length, 0);
});

test("returns empty risks for invalid or empty workspace", () => {
  const workspace = createWorkspace("Empty Risk Workspace");
  assert.equal(getWorkspaceRisks("").length, 0);
  assert.equal(getWorkspaceRisks(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceRisk(workspace.workspaceId, "missing"), null);

  const invalidCreate = createWorkspaceRisk({
    workspaceId: "",
    title: "Invalid Workspace Risk",
  });
  assert.equal(invalidCreate.success, false);
  assert.equal(invalidCreate.reason, "missing_workspace");
});

test("preserves workspace isolation", () => {
  const workspaceA = createWorkspace("Risk Workspace A");
  const workspaceB = createWorkspace("Risk Workspace B");

  createWorkspaceRisk({
    workspaceId: workspaceA.workspaceId,
    title: "Forecast Quality Risk",
    category: "operational",
  });

  assert.equal(getWorkspaceRisks(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceRisks(workspaceB.workspaceId).length, 0);
});

test("rejects invalid status and category on create", () => {
  const workspace = createWorkspace("Risk Validation Workspace");

  const invalidStatus = createWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    title: "Invalid Status Risk",
    status: "invalid" as "active",
  });
  assert.equal(invalidStatus.success, false);
  assert.equal(invalidStatus.reason, "invalid_status");

  const invalidCategory = createWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    title: "Invalid Category Risk",
    category: "invalid" as "operational",
  });
  assert.equal(invalidCategory.success, false);
  assert.equal(invalidCategory.reason, "invalid_category");

  const missingTitle = createWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    title: "   ",
  });
  assert.equal(missingTitle.success, false);
  assert.equal(missingTitle.reason, "missing_title");
});

test("does not mutate KPI, OKR, or scene storage during risk CRUD", () => {
  const workspace = createWorkspace("Risk Safety Workspace");
  const protectedBefore = snapshotProtectedStorageKeys();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  const created = createWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    title: "Forecast Quality Risk",
    category: "operational",
  });
  updateWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    riskId: created.risk?.riskId ?? "",
    status: "monitoring",
  });
  getWorkspaceRisks(workspace.workspaceId);

  assert.deepEqual(snapshotProtectedStorageKeys(), protectedBefore);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});
