import assert from "node:assert/strict";
import test from "node:test";

import { resolveObjectKpiSummaryState } from "../../components/panels/object-panel/kpiSummaryRuntime.ts";
import {
  NEXORA_KPI_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_KPI_CERTIFICATION_GATE_TITLES,
  WORKSPACE_KPI_CERTIFICATION_TAGS,
} from "./workspaceKpiCertificationContract.ts";
import {
  getLatestWorkspaceKpiCertificationResult,
  resetWorkspaceKpiCertificationForTests,
  runWorkspaceKpiCertification,
} from "./workspaceKpiCertification.ts";
import {
  bindKpiToObject,
  resetWorkspaceKpiObjectBindingStoreForTests,
  suggestKpiObjectBindings,
} from "./workspaceKpiObjectBinding.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import {
  createWorkspaceKpi,
  deleteWorkspaceKpi,
  getWorkspaceKpis,
  resetWorkspaceKpiMemoryForTests,
  resetWorkspaceKpiStoreForTests,
  updateWorkspaceKpi,
} from "./workspaceKpiContract.ts";
import {
  calculateWorkspaceKpis,
  resetWorkspaceKpiProfileMemoryForTests,
  resetWorkspaceKpiProfileStoreForTests,
} from "./workspaceKpiCalculationEngine.ts";
import {
  evaluateWorkspaceKpiHealth,
  resetWorkspaceKpiHealthProfileMemoryForTests,
  resetWorkspaceKpiHealthProfileStoreForTests,
} from "./workspaceKpiHealthEngine.ts";
import { resetWorkspaceObjectIntelligenceStoreForTests } from "../workspace/workspaceObjectIntelligenceContract.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";

const KPI_STORAGE_KEY = "nexora.workspaceKpis.v1";
const KPI_PROFILE_STORAGE_KEY = "nexora.workspaceKpiProfiles.v1";
const KPI_HEALTH_STORAGE_KEY = "nexora.workspaceKpiHealthProfiles.v1";
const KPI_BINDING_STORAGE_KEY = "nexora.workspaceKpiObjectBindings.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";

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
  resetWorkspaceKpiCertificationForTests();
  resetWorkspaceKpiObjectBindingStoreForTests();
  resetWorkspaceKpiHealthProfileStoreForTests();
  resetWorkspaceKpiProfileStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
}

function seedObjectIntelligenceProfile(input: {
  workspaceId: string;
  objectId: string;
  objectName: string;
  objectType: string;
}): void {
  const timestamp = new Date().toISOString();
  const raw = window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY);
  const store = raw ? (JSON.parse(raw) as Record<string, Record<string, unknown>>) : {};
  store[input.workspaceId] ??= {};
  store[input.workspaceId][input.objectId] = {
    contractVersion: "DS-3:1",
    objectId: input.objectId,
    workspaceId: input.workspaceId,
    objectName: input.objectName,
    objectType: input.objectType,
    originCandidateId: `candidate_${input.objectId}`,
    originWorkspaceObjectId: input.objectId,
    relationshipCount: 2,
    incomingRelationshipCount: 1,
    outgoingRelationshipCount: 1,
    connectedObjectCount: 2,
    intelligenceStatus: "ready",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: "ds-3:1-foundation",
  };
  window.localStorage.setItem(OBJECT_INTELLIGENCE_STORAGE_KEY, JSON.stringify(store));
}

function seedCertificationDataset(workspaceId: string): {
  forecastObjectId: string;
  revenueObjectId: string;
  warehouseObjectId: string;
  revenueKpiId: string;
  forecastKpiId: string;
  inventoryKpiId: string;
} {
  seedObjectIntelligenceProfile({
    workspaceId,
    objectId: "obj_forecast",
    objectName: "Forecast",
    objectType: "forecast",
  });
  seedObjectIntelligenceProfile({
    workspaceId,
    objectId: "obj_sales",
    objectName: "Sales",
    objectType: "sales",
  });
  seedObjectIntelligenceProfile({
    workspaceId,
    objectId: "obj_warehouse",
    objectName: "Warehouse",
    objectType: "warehouse",
  });

  const revenue = createWorkspaceKpi({
    workspaceId,
    name: "Revenue",
    unit: "USD",
    targetValue: 100000,
    currentValue: 105000,
  });
  const forecast = createWorkspaceKpi({
    workspaceId,
    name: "Forecast Accuracy",
    unit: "score",
    targetValue: 100,
    currentValue: 84,
  });
  const inventory = createWorkspaceKpi({
    workspaceId,
    name: "Inventory Cost",
    unit: "USD",
    targetValue: 100000,
    currentValue: 61000,
  });

  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);

  bindKpiToObject(workspaceId, revenue.kpi?.kpiId ?? "", "obj_sales");
  bindKpiToObject(workspaceId, forecast.kpi?.kpiId ?? "", "obj_forecast");
  bindKpiToObject(workspaceId, inventory.kpi?.kpiId ?? "", "obj_warehouse");

  return {
    forecastObjectId: "obj_forecast",
    revenueObjectId: "obj_sales",
    warehouseObjectId: "obj_warehouse",
    revenueKpiId: revenue.kpi?.kpiId ?? "",
    forecastKpiId: forecast.kpi?.kpiId ?? "",
    inventoryKpiId: inventory.kpi?.kpiId ?? "",
  };
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-4:7 certification tags and gate titles", () => {
  assert.equal(NEXORA_KPI_CERTIFICATION_LOG_PREFIX, "[NexoraKpiCertification]");
  assert.ok(WORKSPACE_KPI_CERTIFICATION_TAGS.includes("[DS47_CERTIFIED]"));
  assert.equal(WORKSPACE_KPI_CERTIFICATION_GATE_TITLES.A, "KPI Contract Exists");
  assert.equal(WORKSPACE_KPI_CERTIFICATION_GATE_TITLES.AE, "Regression Pass");
});

test("certifies empty workspace with supplemental harness flags", () => {
  const workspace = createWorkspace("Empty KPI Certification Workspace");
  const isolation = createWorkspace("Isolation KPI Certification Workspace");

  const result = runWorkspaceKpiCertification({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolation.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      emptyWorkspaceValidated: true,
      crudValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      suggestedBindingsValidated: true,
      dashboardSummaryValidated: true,
      objectPanelIntegrationValidated: true,
    },
  });

  assert.equal(result.passed, true);
  assert.equal(result.certified, true);
  assert.equal(result.gateResults.length, 31);
  assert.equal(result.scenarioResults.length, 12);
  assert.ok(result.warnings.length >= 5);
});

test("certifies full manual walkthrough dataset", () => {
  const workspace = createWorkspace("KPI Certification Workspace");
  const isolation = createWorkspace("KPI Certification Isolation Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const updateResult = updateWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    kpiId: dataset.revenueKpiId,
    currentValue: 106000,
  });
  assert.equal(updateResult.success, true);
  calculateWorkspaceKpis(workspace.workspaceId);
  evaluateWorkspaceKpiHealth(workspace.workspaceId);

  const duplicate = bindKpiToObject(workspace.workspaceId, dataset.forecastKpiId, dataset.forecastObjectId);
  assert.equal(duplicate.created, false);

  const suggestBefore = suggestKpiObjectBindings(workspace.workspaceId);
  assert.ok(suggestBefore.success);

  const beforeReload = getWorkspaceKpis(workspace.workspaceId).length;
  resetWorkspaceKpiMemoryForTests();
  resetWorkspaceKpiProfileMemoryForTests();
  resetWorkspaceKpiHealthProfileMemoryForTests();
  assert.equal(getWorkspaceKpis(workspace.workspaceId).length, beforeReload);

  const result = runWorkspaceKpiCertification({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolation.workspaceId,
    forecastObjectId: dataset.forecastObjectId,
    revenueObjectId: dataset.revenueObjectId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      crudValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      suggestedBindingsValidated: true,
      dashboardSummaryValidated: true,
      objectPanelIntegrationValidated: true,
    },
  });

  assert.equal(result.certified, true);
  assert.equal(result.passed, true);
  assert.match(result.summary, /PASSED/);
  assert.ok(result.gateResults.every((entry) => entry.status !== "FAIL"));
  assert.ok(result.scenarioResults.every((entry) => entry.status !== "FAIL"));
  assert.equal(getLatestWorkspaceKpiCertificationResult()?.certified, true);
});

test("validates object panel KPI visibility and empty state scenarios", () => {
  const workspace = createWorkspace("Object Panel KPI Certification Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const forecastSummary = resolveObjectKpiSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.forecastObjectId,
  });
  assert.ok(forecastSummary.items.length > 0);

  const emptySummary = resolveObjectKpiSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: "obj_unbound",
  });
  assert.equal(emptySummary.emptyMessage, "No KPIs linked to this object.");
});

test("certification runner does not mutate KPI, object, or scene storage", () => {
  const workspace = createWorkspace("KPI Certification Safety Workspace");
  seedCertificationDataset(workspace.workspaceId);

  const before = {
    kpis: window.localStorage.getItem(KPI_STORAGE_KEY),
    profiles: window.localStorage.getItem(KPI_PROFILE_STORAGE_KEY),
    health: window.localStorage.getItem(KPI_HEALTH_STORAGE_KEY),
    bindings: window.localStorage.getItem(KPI_BINDING_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    scene: getWorkspaceSceneJson(workspace.workspaceId),
  };

  runWorkspaceKpiCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      crudValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      suggestedBindingsValidated: true,
      dashboardSummaryValidated: true,
      objectPanelIntegrationValidated: true,
    },
  });

  assert.equal(window.localStorage.getItem(KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(KPI_PROFILE_STORAGE_KEY), before.profiles);
  assert.equal(window.localStorage.getItem(KPI_HEALTH_STORAGE_KEY), before.health);
  assert.equal(window.localStorage.getItem(KPI_BINDING_STORAGE_KEY), before.bindings);
  assert.equal(window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY), before.objects);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), before.scene);
});

test("CRUD gate fails when supplemental CRUD validation is false and no KPIs exist", () => {
  const workspace = createWorkspace("CRUD Gate Failure Workspace");

  const created = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Temporary KPI",
    unit: "score",
    targetValue: 100,
    currentValue: 90,
  });
  deleteWorkspaceKpi(workspace.workspaceId, created.kpi?.kpiId ?? "");

  const result = runWorkspaceKpiCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      crudValidated: false,
    },
  });

  const crudGate = result.gateResults.find((entry) => entry.gateId === "B");
  assert.equal(crudGate?.status, "FAIL");
  assert.equal(result.certified, false);
});
