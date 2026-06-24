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
  createWorkspaceKpi,
  resetWorkspaceKpiStoreForTests,
} from "../kpi/workspaceKpiContract.ts";
import { resetWorkspaceKpiProfileStoreForTests } from "../kpi/workspaceKpiCalculationEngine.ts";
import { resetWorkspaceKpiHealthProfileStoreForTests } from "../kpi/workspaceKpiHealthEngine.ts";
import {
  createWorkspaceObjective,
  resetWorkspaceOkrMemoryForTests,
  resetWorkspaceOkrStoreForTests,
} from "./workspaceOkrContract.ts";
import {
  WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
  resetWorkspaceOkrProgressProfileStoreForTests,
} from "./workspaceOkrProgressEngine.ts";
import {
  WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY,
  resetWorkspaceOkrHealthProfileStoreForTests,
} from "./workspaceOkrHealthEngine.ts";
import {
  NEXORA_OKR_KPI_BINDING_LOG_PREFIX,
  WORKSPACE_OKR_KPI_BINDING_SOURCE,
  WORKSPACE_OKR_KPI_BINDING_STORAGE_KEY,
  WORKSPACE_OKR_KPI_BINDING_TAGS,
  bindObjectiveToKpi,
  getOkrKpiBindings,
  getOkrKpiBindingsForKpi,
  getOkrKpiBindingsForObjective,
  resetWorkspaceOkrKpiBindingMemoryForTests,
  resetWorkspaceOkrKpiBindingStoreForTests,
  resolveOkrKpiBindingMatch,
  suggestOkrKpiBindingMatches,
  suggestOkrKpiBindings,
  unbindObjectiveFromKpi,
} from "./workspaceOkrKpiBinding.ts";

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
  resetWorkspaceOkrKpiBindingStoreForTests();
  resetWorkspaceOkrHealthProfileStoreForTests();
  resetWorkspaceOkrProgressProfileStoreForTests();
  resetWorkspaceOkrStoreForTests();
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
    "nexora.workspaceKpiHealthProfiles.v1",
    "nexora.workspaceObjectives.v1",
    "nexora.workspaceKeyResults.v1",
    WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
    WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY,
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

test("exports DS-5:4 OKR KPI binding tags and storage key", () => {
  assert.equal(NEXORA_OKR_KPI_BINDING_LOG_PREFIX, "[NexoraOkrKpiBinding]");
  assert.equal(WORKSPACE_OKR_KPI_BINDING_STORAGE_KEY, "nexora.workspaceOkrKpiBindings.v1");
  assert.deepEqual(WORKSPACE_OKR_KPI_BINDING_TAGS, [
    "[DS54_OKR_KPI_BINDING]",
    "[OKR_KPI_TRACEABILITY_READY]",
    "[OBJECTIVES_LINKED_TO_KPIS]",
    "[OKR_KPI_BINDINGS_PERSISTED]",
    "[DS55_READY]",
    "[DS_5_4_COMPLETE]",
  ]);
});

test("matches market and forecast objectives to KPIs", () => {
  const marketMatch = resolveOkrKpiBindingMatch({
    objectiveTitle: "Become Market Leader",
    kpiName: "Market Share",
  });
  assert.equal(marketMatch.matchKind, "strong_keyword");
  assert.ok(marketMatch.bindingConfidence >= 0.8);

  const revenueMatch = resolveOkrKpiBindingMatch({
    objectiveTitle: "Become Market Leader",
    kpiName: "Revenue Growth",
  });
  assert.equal(revenueMatch.matchKind, "related_domain");
  assert.ok(revenueMatch.bindingConfidence >= 0.65);

  const forecastMatch = resolveOkrKpiBindingMatch({
    objectiveTitle: "Improve Forecasting",
    kpiName: "Forecast Accuracy",
  });
  assert.equal(forecastMatch.matchKind, "strong_keyword");
  assert.ok(forecastMatch.bindingConfidence >= 0.8);
});

test("binds and unbinds objectives to KPIs manually with duplicate protection", () => {
  const workspace = createWorkspace("OKR KPI Binding Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Become Market Leader",
  });
  const kpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue Growth",
    unit: "USD",
    targetValue: 100,
    currentValue: 80,
  });

  const first = bindObjectiveToKpi(
    workspace.workspaceId,
    objective.objective?.objectiveId ?? "",
    kpi.kpi?.kpiId ?? ""
  );
  assert.equal(first.success, true);
  assert.equal(first.created, true);
  assert.equal(first.binding?.source, WORKSPACE_OKR_KPI_BINDING_SOURCE);

  const duplicate = bindObjectiveToKpi(
    workspace.workspaceId,
    objective.objective?.objectiveId ?? "",
    kpi.kpi?.kpiId ?? ""
  );
  assert.equal(duplicate.success, true);
  assert.equal(duplicate.created, false);
  assert.equal(duplicate.binding?.bindingId, first.binding?.bindingId);

  assert.equal(
    getOkrKpiBindingsForObjective(
      workspace.workspaceId,
      objective.objective?.objectiveId ?? ""
    ).length,
    1
  );
  assert.equal(
    getOkrKpiBindingsForKpi(workspace.workspaceId, kpi.kpi?.kpiId ?? "").length,
    1
  );

  const removed = unbindObjectiveFromKpi(
    workspace.workspaceId,
    first.binding?.bindingId ?? ""
  );
  assert.equal(removed.success, true);
  assert.equal(removed.deleted, true);
  assert.equal(getOkrKpiBindings(workspace.workspaceId).length, 0);
});

test("suggests bindings for Become Market Leader manual walkthrough", () => {
  const workspace = createWorkspace("Market Leader Binding Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Become Market Leader",
  });

  const revenueKpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue Growth",
    unit: "USD",
    targetValue: 100,
    currentValue: 80,
  });
  const marketShareKpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Market Share",
    unit: "percent",
    targetValue: 30,
    currentValue: 20,
  });
  const retentionKpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Customer Retention",
    unit: "percent",
    targetValue: 90,
    currentValue: 85,
  });

  const matches = suggestOkrKpiBindingMatches({
    objectiveTitle: "Become Market Leader",
    kpis: [
      { kpiId: revenueKpi.kpi?.kpiId ?? "", kpiName: "Revenue Growth" },
      { kpiId: marketShareKpi.kpi?.kpiId ?? "", kpiName: "Market Share" },
      { kpiId: retentionKpi.kpi?.kpiId ?? "", kpiName: "Customer Retention" },
    ],
  });
  assert.equal(matches.length, 3);
  assert.ok(matches.every((match) => match.bindingConfidence >= 0.65));

  const result = suggestOkrKpiBindings(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.createdCount, 3);
  assert.equal(getOkrKpiBindings(workspace.workspaceId).length, 3);
  assert.equal(
    getOkrKpiBindingsForObjective(
      workspace.workspaceId,
      objective.objective?.objectiveId ?? ""
    ).length,
    3
  );
});

test("suggests bindings for Improve Forecasting manual walkthrough", () => {
  const workspace = createWorkspace("Forecast Binding Workspace");
  createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Improve Forecasting",
  });

  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Forecast Accuracy",
    unit: "percent",
    targetValue: 90,
    currentValue: 85,
  });
  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Forecast Delay",
    unit: "days",
    targetValue: 5,
    currentValue: 7,
  });

  const result = suggestOkrKpiBindings(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.createdCount, 2);
  assert.equal(getOkrKpiBindings(workspace.workspaceId).length, 2);
  assert.ok(
    getOkrKpiBindings(workspace.workspaceId).every(
      (binding) => binding.bindingConfidence >= 0.8
    )
  );
});

test("isolates bindings by workspace and persists reload", () => {
  const workspaceA = createWorkspace("OKR KPI Binding Workspace A");
  const workspaceB = createWorkspace("OKR KPI Binding Workspace B");

  const objectiveA = createWorkspaceObjective({
    workspaceId: workspaceA.workspaceId,
    title: "Objective A",
  });
  const kpiA = createWorkspaceKpi({
    workspaceId: workspaceA.workspaceId,
    name: "Revenue Growth",
    unit: "USD",
    targetValue: 100,
    currentValue: 90,
  });

  bindObjectiveToKpi(
    workspaceA.workspaceId,
    objectiveA.objective?.objectiveId ?? "",
    kpiA.kpi?.kpiId ?? ""
  );
  assert.equal(getOkrKpiBindings(workspaceA.workspaceId).length, 1);
  assert.equal(getOkrKpiBindings(workspaceB.workspaceId).length, 0);

  const storedRaw = window.localStorage.getItem(WORKSPACE_OKR_KPI_BINDING_STORAGE_KEY);
  assert.ok(storedRaw);
  resetWorkspaceOkrKpiBindingMemoryForTests();
  assert.equal(getOkrKpiBindings(workspaceA.workspaceId).length, 1);
});

test("does not mutate KPI, OKR, progress, health, or scene storage", () => {
  const workspace = createWorkspace("OKR KPI Binding Safety Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Become Market Leader",
  });
  const revenueKpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Revenue Growth",
    unit: "USD",
    targetValue: 100,
    currentValue: 80,
  });
  createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Market Share",
    unit: "percent",
    targetValue: 30,
    currentValue: 20,
  });

  const protectedBefore = snapshotProtectedStorageKeys();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  bindObjectiveToKpi(
    workspace.workspaceId,
    objective.objective?.objectiveId ?? "",
    revenueKpi.kpi?.kpiId ?? ""
  );
  suggestOkrKpiBindings(workspace.workspaceId);

  assert.deepEqual(snapshotProtectedStorageKeys(), protectedBefore);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);

  resetWorkspaceOkrMemoryForTests();
  assert.equal(getOkrKpiBindings(workspace.workspaceId).length, 2);
});
