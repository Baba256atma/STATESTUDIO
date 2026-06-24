import assert from "node:assert/strict";
import test from "node:test";

import {
  resetWorkspaceObjectIntelligenceStoreForTests,
} from "../workspace/workspaceObjectIntelligenceContract.ts";
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
  resetWorkspaceKpiProfileStoreForTests,
} from "./workspaceKpiCalculationEngine.ts";
import {
  resetWorkspaceKpiHealthProfileStoreForTests,
} from "./workspaceKpiHealthEngine.ts";
import {
  NEXORA_KPI_OBJECT_BINDING_LOG_PREFIX,
  WORKSPACE_KPI_OBJECT_BINDING_SOURCE,
  WORKSPACE_KPI_OBJECT_BINDING_STORAGE_KEY,
  WORKSPACE_KPI_OBJECT_BINDING_TAGS,
  bindKpiToObject,
  getKpiObjectBindings,
  getKpiObjectBindingsForKpi,
  getKpiObjectBindingsForObject,
  resetWorkspaceKpiObjectBindingMemoryForTests,
  resetWorkspaceKpiObjectBindingStoreForTests,
  resolveKpiObjectBindingMatch,
  suggestKpiObjectBindingMatches,
  suggestKpiObjectBindings,
  unbindKpiFromObject,
} from "./workspaceKpiObjectBinding.ts";

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
  resetWorkspaceKpiObjectBindingStoreForTests();
  resetWorkspaceKpiHealthProfileStoreForTests();
  resetWorkspaceKpiProfileStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
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
    "nexora.workspaceKpiHealthProfiles.v1",
    "nexora.workspaceObjectIntelligenceProfiles.v1",
    "nexora.workspaceObjects.v1",
    "nexora.workspaceScenes.v1",
  ];
  return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
}

function seedObjectProfiles(
  workspaceId: string,
  objects: readonly { objectId: string; objectName: string; objectType: string }[]
) {
  const store = {
    [workspaceId]: Object.fromEntries(
      objects.map((object) => [
        object.objectId,
        {
          contractVersion: "DS-3:1",
          objectId: object.objectId,
          workspaceId,
          objectName: object.objectName,
          objectType: object.objectType,
          originCandidateId: null,
          originWorkspaceObjectId: null,
          relationshipCount: 0,
          incomingRelationshipCount: 0,
          outgoingRelationshipCount: 0,
          connectedObjectCount: 0,
          intelligenceStatus: "ready",
          createdAt: "2026-06-24T00:00:00.000Z",
          updatedAt: "2026-06-24T00:00:00.000Z",
          source: "ds-3:1-foundation",
        },
      ])
    ),
  };
  window.localStorage.setItem(
    "nexora.workspaceObjectIntelligenceProfiles.v1",
    JSON.stringify(store)
  );
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-4:4 KPI object binding tags and storage key", () => {
  assert.equal(NEXORA_KPI_OBJECT_BINDING_LOG_PREFIX, "[NexoraKpiObjectBinding]");
  assert.equal(WORKSPACE_KPI_OBJECT_BINDING_STORAGE_KEY, "nexora.workspaceKpiObjectBindings.v1");
  assert.deepEqual(WORKSPACE_KPI_OBJECT_BINDING_TAGS, [
    "[DS44_KPI_OBJECT_BINDING]",
    "[KPI_OBJECT_BINDINGS_READY]",
    "[KPI_TO_OBJECT_TRACEABILITY]",
    "[KPI_BINDING_PERSISTED]",
    "[DS45_READY]",
    "[DS_4_4_COMPLETE]",
  ]);
});

test("matches forecast, revenue, and inventory KPIs to objects", () => {
  const forecastMatch = resolveKpiObjectBindingMatch({
    kpiName: "Forecast Accuracy",
    objectName: "Forecast",
    objectType: "forecast",
  });
  assert.equal(forecastMatch.matchKind, "strong_keyword");
  assert.ok(forecastMatch.bindingConfidence >= 0.8);

  const revenueMatch = resolveKpiObjectBindingMatch({
    kpiName: "Revenue",
    objectName: "Sales Hub",
    objectType: "sales",
  });
  assert.ok(revenueMatch.bindingConfidence >= 0.65);

  const inventoryMatch = resolveKpiObjectBindingMatch({
    kpiName: "Inventory Turnover",
    objectName: "Warehouse",
    objectType: "warehouse",
  });
  assert.equal(inventoryMatch.matchKind, "related_domain");
  assert.ok(inventoryMatch.bindingConfidence >= 0.65);
});

test("binds and unbinds KPIs manually with duplicate protection", () => {
  const workspace = createWorkspace("KPI Binding Workspace");
  const kpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100,
    currentValue: 80,
  });

  const first = bindKpiToObject(workspace.workspaceId, kpi.kpi?.kpiId ?? "", "obj_sales_1");
  assert.equal(first.success, true);
  assert.equal(first.created, true);
  assert.equal(first.binding?.source, WORKSPACE_KPI_OBJECT_BINDING_SOURCE);

  const duplicate = bindKpiToObject(workspace.workspaceId, kpi.kpi?.kpiId ?? "", "obj_sales_1");
  assert.equal(duplicate.success, true);
  assert.equal(duplicate.created, false);
  assert.equal(duplicate.binding?.bindingId, first.binding?.bindingId);

  assert.equal(getKpiObjectBindingsForKpi(workspace.workspaceId, kpi.kpi?.kpiId ?? "").length, 1);
  assert.equal(getKpiObjectBindingsForObject(workspace.workspaceId, "obj_sales_1").length, 1);

  const removed = unbindKpiFromObject(workspace.workspaceId, first.binding?.bindingId ?? "");
  assert.equal(removed.success, true);
  assert.equal(removed.deleted, true);
  assert.equal(getKpiObjectBindings(workspace.workspaceId).length, 0);
});

test("suggests bindings for manual walkthrough examples", () => {
  const workspace = createWorkspace("KPI Suggest Binding Workspace");
  seedObjectProfiles(workspace.workspaceId, [
    { objectId: "obj_forecast_1", objectName: "Forecast", objectType: "forecast" },
    { objectId: "obj_warehouse_1", objectName: "Warehouse", objectType: "warehouse" },
  ]);

  const forecastKpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Forecast Accuracy",
    unit: "percent",
    targetValue: 90,
    currentValue: 85,
  });
  const inventoryKpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Inventory Turnover",
    unit: "ratio",
    targetValue: 5,
    currentValue: 4,
  });

  const forecastSuggestion = suggestKpiObjectBindingMatches({
    kpiName: "Forecast Accuracy",
    objects: [
      { objectId: "obj_forecast_1", objectName: "Forecast", objectType: "forecast" },
    ],
  });
  assert.ok(forecastSuggestion);
  assert.equal(forecastSuggestion.objectId, "obj_forecast_1");
  assert.ok(forecastSuggestion.bindingConfidence >= 0.8);

  const inventorySuggestion = suggestKpiObjectBindingMatches({
    kpiName: "Inventory Turnover",
    objects: [
      { objectId: "obj_warehouse_1", objectName: "Warehouse", objectType: "warehouse" },
    ],
  });
  assert.ok(inventorySuggestion);
  assert.equal(inventorySuggestion.objectId, "obj_warehouse_1");
  assert.ok(inventorySuggestion.bindingConfidence >= 0.65);

  const result = suggestKpiObjectBindings(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.createdCount, 2);
  assert.equal(getKpiObjectBindings(workspace.workspaceId).length, 2);
  assert.equal(
    getKpiObjectBindingsForKpi(workspace.workspaceId, forecastKpi.kpi?.kpiId ?? "").length,
    1
  );
});

test("isolates bindings by workspace and persists reload", () => {
  const workspaceA = createWorkspace("KPI Binding Workspace A");
  const workspaceB = createWorkspace("KPI Binding Workspace B");
  const kpiA = createWorkspaceKpi({
    workspaceId: workspaceA.workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100,
    currentValue: 90,
  });

  bindKpiToObject(workspaceA.workspaceId, kpiA.kpi?.kpiId ?? "", "obj_a");
  assert.equal(getKpiObjectBindings(workspaceA.workspaceId).length, 1);
  assert.equal(getKpiObjectBindings(workspaceB.workspaceId).length, 0);

  const storedRaw = window.localStorage.getItem(WORKSPACE_KPI_OBJECT_BINDING_STORAGE_KEY);
  assert.ok(storedRaw);
  resetWorkspaceKpiObjectBindingMemoryForTests();
  assert.equal(getKpiObjectBindings(workspaceA.workspaceId).length, 1);
});

test("does not mutate KPI, object, health, calculation, or scene storage", () => {
  const workspace = createWorkspace("KPI Binding Safety Workspace");
  seedObjectProfiles(workspace.workspaceId, [
    { objectId: "obj_forecast_1", objectName: "Forecast", objectType: "forecast" },
  ]);
  const kpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Forecast Accuracy",
    unit: "percent",
    targetValue: 90,
    currentValue: 85,
  });
  const protectedBefore = snapshotProtectedStorageKeys();

  bindKpiToObject(workspace.workspaceId, kpi.kpi?.kpiId ?? "", "obj_forecast_1");
  suggestKpiObjectBindings(workspace.workspaceId);

  const protectedAfter = snapshotProtectedStorageKeys();
  assert.deepEqual(protectedAfter, protectedBefore);
});
