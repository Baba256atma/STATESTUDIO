import assert from "node:assert/strict";
import test from "node:test";

import { resolveObjectOkrSummaryState } from "../../components/panels/object-panel/okrSummaryRuntime.ts";
import {
  NEXORA_OKR_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_OKR_CERTIFICATION_GATE_TITLES,
  WORKSPACE_OKR_CERTIFICATION_TAGS,
} from "./workspaceOkrCertificationContract.ts";
import {
  getLatestWorkspaceOkrCertificationResult,
  resetWorkspaceOkrCertificationForTests,
  runWorkspaceOkrCertification,
} from "./workspaceOkrCertification.ts";
import {
  bindObjectiveToKpi,
  resetWorkspaceOkrKpiBindingStoreForTests,
  suggestOkrKpiBindings,
} from "./workspaceOkrKpiBinding.ts";
import { bindKpiToObject } from "../kpi/workspaceKpiObjectBinding.ts";
import {
  createWorkspaceKpi,
  resetWorkspaceKpiStoreForTests,
} from "../kpi/workspaceKpiContract.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import {
  createWorkspaceKeyResult,
  createWorkspaceObjective,
  deleteWorkspaceObjective,
  getWorkspaceObjectives,
  resetWorkspaceOkrMemoryForTests,
  resetWorkspaceOkrStoreForTests,
  updateWorkspaceKeyResult,
} from "./workspaceOkrContract.ts";
import {
  calculateWorkspaceOkrProgress,
  resetWorkspaceOkrProgressProfileMemoryForTests,
  resetWorkspaceOkrProgressProfileStoreForTests,
} from "./workspaceOkrProgressEngine.ts";
import {
  evaluateWorkspaceOkrHealth,
  resetWorkspaceOkrHealthProfileMemoryForTests,
  resetWorkspaceOkrHealthProfileStoreForTests,
} from "./workspaceOkrHealthEngine.ts";
import { resetWorkspaceObjectIntelligenceStoreForTests } from "../workspace/workspaceObjectIntelligenceContract.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import { getDashboardOkrSummary } from "./okrDashboardIntegrationRuntime.ts";

const OBJECTIVE_STORAGE_KEY = "nexora.workspaceObjectives.v1";
const KEY_RESULT_STORAGE_KEY = "nexora.workspaceKeyResults.v1";
const OKR_PROGRESS_STORAGE_KEY = "nexora.workspaceOkrProgressProfiles.v1";
const OKR_HEALTH_STORAGE_KEY = "nexora.workspaceOkrHealthProfiles.v1";
const OKR_BINDING_STORAGE_KEY = "nexora.workspaceOkrKpiBindings.v1";
const KPI_STORAGE_KEY = "nexora.workspaceKpis.v1";
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
  resetWorkspaceOkrCertificationForTests();
  resetWorkspaceOkrKpiBindingStoreForTests();
  resetWorkspaceOkrHealthProfileStoreForTests();
  resetWorkspaceOkrProgressProfileStoreForTests();
  resetWorkspaceOkrStoreForTests();
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
  salesObjectId: string;
  forecastObjectId: string;
  unboundObjectId: string;
  marketLeaderObjectiveId: string;
  revenueKpiId: string;
  marketShareKpiId: string;
  forecastKpiId: string;
} {
  seedObjectIntelligenceProfile({
    workspaceId,
    objectId: "obj_sales",
    objectName: "Sales",
    objectType: "sales",
  });
  seedObjectIntelligenceProfile({
    workspaceId,
    objectId: "obj_forecast",
    objectName: "Forecast",
    objectType: "forecast",
  });

  const marketLeader = createWorkspaceObjective({
    workspaceId,
    title: "Become Market Leader",
  });
  const marketLeaderObjectiveId = marketLeader.objective?.objectiveId ?? "";
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: marketLeaderObjectiveId,
    title: "Revenue Growth",
    targetValue: 30,
    currentValue: 15,
    unit: "%",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: marketLeaderObjectiveId,
    title: "Market Share",
    targetValue: 30,
    currentValue: 21,
    unit: "%",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: marketLeaderObjectiveId,
    title: "Customer Retention",
    targetValue: 90,
    currentValue: 81,
    unit: "%",
  });

  const forecasting = createWorkspaceObjective({
    workspaceId,
    title: "Improve Forecasting",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: forecasting.objective?.objectiveId ?? "",
    title: "Forecast Accuracy",
    targetValue: 100,
    currentValue: 105,
    unit: "score",
  });

  const costReduction = createWorkspaceObjective({
    workspaceId,
    title: "Reduce Operational Cost",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: costReduction.objective?.objectiveId ?? "",
    title: "Cost Reduction",
    targetValue: 100,
    currentValue: 45,
    unit: "score",
  });

  const revenueKpi = createWorkspaceKpi({
    workspaceId,
    name: "Revenue Growth",
    unit: "USD",
    targetValue: 100,
    currentValue: 80,
  });
  const marketShareKpi = createWorkspaceKpi({
    workspaceId,
    name: "Market Share",
    unit: "percent",
    targetValue: 30,
    currentValue: 20,
  });
  const forecastKpi = createWorkspaceKpi({
    workspaceId,
    name: "Forecast Accuracy",
    unit: "score",
    targetValue: 100,
    currentValue: 95,
  });

  calculateWorkspaceOkrProgress(workspaceId);
  evaluateWorkspaceOkrHealth(workspaceId);

  bindObjectiveToKpi(workspaceId, marketLeaderObjectiveId, revenueKpi.kpi?.kpiId ?? "");
  bindObjectiveToKpi(workspaceId, marketLeaderObjectiveId, marketShareKpi.kpi?.kpiId ?? "");
  bindObjectiveToKpi(
    workspaceId,
    forecasting.objective?.objectiveId ?? "",
    forecastKpi.kpi?.kpiId ?? ""
  );

  bindKpiToObject(workspaceId, revenueKpi.kpi?.kpiId ?? "", "obj_sales");
  bindKpiToObject(workspaceId, forecastKpi.kpi?.kpiId ?? "", "obj_forecast");

  return {
    salesObjectId: "obj_sales",
    forecastObjectId: "obj_forecast",
    unboundObjectId: "obj_unbound",
    marketLeaderObjectiveId,
    revenueKpiId: revenueKpi.kpi?.kpiId ?? "",
    marketShareKpiId: marketShareKpi.kpi?.kpiId ?? "",
    forecastKpiId: forecastKpi.kpi?.kpiId ?? "",
  };
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-5:7 certification tags and gate titles", () => {
  assert.equal(NEXORA_OKR_CERTIFICATION_LOG_PREFIX, "[NexoraOkrCertification]");
  assert.ok(WORKSPACE_OKR_CERTIFICATION_TAGS.includes("[DS57_CERTIFIED]"));
  assert.equal(WORKSPACE_OKR_CERTIFICATION_GATE_TITLES.A, "OKR Contract Exists");
  assert.equal(WORKSPACE_OKR_CERTIFICATION_GATE_TITLES.AN, "Regression Pass");
});

test("certifies empty workspace with supplemental harness flags", () => {
  const workspace = createWorkspace("Empty OKR Certification Workspace");
  const isolation = createWorkspace("Isolation OKR Certification Workspace");

  const result = runWorkspaceOkrCertification({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolation.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      emptyWorkspaceValidated: true,
      objectiveCrudValidated: true,
      keyResultCrudValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      suggestedBindingsValidated: true,
      manualBindingValidated: true,
      dashboardSummaryValidated: true,
      objectPanelIntegrationValidated: true,
      objectSwitchingValidated: true,
    },
  });

  assert.equal(result.passed, true);
  assert.equal(result.certified, true);
  assert.equal(result.gateResults.length, 40);
  assert.equal(result.scenarioResults.length, 12);
  assert.ok(result.warnings.length >= 5);
});

test("certifies full manual walkthrough dataset", () => {
  const workspace = createWorkspace("OKR Certification Workspace");
  const isolation = createWorkspace("OKR Certification Isolation Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const keyResults = getWorkspaceObjectives(workspace.workspaceId).flatMap((objective) =>
    objective.objectiveId === dataset.marketLeaderObjectiveId ? [objective] : []
  );
  assert.ok(keyResults.length > 0);

  const duplicate = bindObjectiveToKpi(
    workspace.workspaceId,
    dataset.marketLeaderObjectiveId,
    dataset.revenueKpiId
  );
  assert.equal(duplicate.created, false);

  const suggestBefore = suggestOkrKpiBindings(workspace.workspaceId);
  assert.ok(suggestBefore.success);

  const beforeReload = getWorkspaceObjectives(workspace.workspaceId).length;
  resetWorkspaceOkrMemoryForTests();
  resetWorkspaceOkrProgressProfileMemoryForTests();
  resetWorkspaceOkrHealthProfileMemoryForTests();
  assert.equal(getWorkspaceObjectives(workspace.workspaceId).length, beforeReload);

  const dashboardSummary = getDashboardOkrSummary(workspace.workspaceId);
  assert.equal(dashboardSummary.totalObjectives, 3);
  assert.equal(dashboardSummary.highestRiskObjectiveTitle, "Reduce Operational Cost");

  const result = runWorkspaceOkrCertification({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolation.workspaceId,
    salesObjectId: dataset.salesObjectId,
    forecastObjectId: dataset.forecastObjectId,
    unboundObjectId: dataset.unboundObjectId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      objectiveCrudValidated: true,
      keyResultCrudValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      suggestedBindingsValidated: true,
      manualBindingValidated: true,
      dashboardSummaryValidated: true,
      objectPanelIntegrationValidated: true,
      objectSwitchingValidated: true,
    },
  });

  assert.equal(result.certified, true);
  assert.equal(result.passed, true);
  assert.match(result.summary, /PASSED/);
  assert.ok(result.gateResults.every((entry) => entry.status !== "FAIL"));
  assert.ok(result.scenarioResults.every((entry) => entry.status !== "FAIL"));
  assert.equal(getLatestWorkspaceOkrCertificationResult()?.certified, true);
});

test("validates object panel OKR visibility and empty state scenarios", () => {
  const workspace = createWorkspace("Object Panel OKR Certification Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const salesSummary = resolveObjectOkrSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.salesObjectId,
  });
  assert.ok(salesSummary.items.length > 0);
  assert.equal(salesSummary.items[0]?.objectiveTitle, "Become Market Leader");

  const forecastSummary = resolveObjectOkrSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.forecastObjectId,
  });
  assert.ok(forecastSummary.items.some((item) => item.objectiveTitle === "Improve Forecasting"));

  const emptySummary = resolveObjectOkrSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.unboundObjectId,
  });
  assert.equal(emptySummary.emptyMessage, "No OKRs linked to this object.");
});

test("certification runner does not mutate OKR, KPI, object, or scene storage", () => {
  const workspace = createWorkspace("OKR Certification Safety Workspace");
  seedCertificationDataset(workspace.workspaceId);

  const before = {
    objectives: window.localStorage.getItem(OBJECTIVE_STORAGE_KEY),
    keyResults: window.localStorage.getItem(KEY_RESULT_STORAGE_KEY),
    progress: window.localStorage.getItem(OKR_PROGRESS_STORAGE_KEY),
    health: window.localStorage.getItem(OKR_HEALTH_STORAGE_KEY),
    okrBindings: window.localStorage.getItem(OKR_BINDING_STORAGE_KEY),
    kpis: window.localStorage.getItem(KPI_STORAGE_KEY),
    kpiBindings: window.localStorage.getItem(KPI_BINDING_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    scene: getWorkspaceSceneJson(workspace.workspaceId),
  };

  runWorkspaceOkrCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      objectiveCrudValidated: true,
      keyResultCrudValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      suggestedBindingsValidated: true,
      manualBindingValidated: true,
      dashboardSummaryValidated: true,
      objectPanelIntegrationValidated: true,
      objectSwitchingValidated: true,
    },
  });

  assert.equal(window.localStorage.getItem(OBJECTIVE_STORAGE_KEY), before.objectives);
  assert.equal(window.localStorage.getItem(KEY_RESULT_STORAGE_KEY), before.keyResults);
  assert.equal(window.localStorage.getItem(OKR_PROGRESS_STORAGE_KEY), before.progress);
  assert.equal(window.localStorage.getItem(OKR_HEALTH_STORAGE_KEY), before.health);
  assert.equal(window.localStorage.getItem(OKR_BINDING_STORAGE_KEY), before.okrBindings);
  assert.equal(window.localStorage.getItem(KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(KPI_BINDING_STORAGE_KEY), before.kpiBindings);
  assert.equal(window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY), before.objects);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), before.scene);
});

test("objective CRUD gate fails when supplemental validation is false and no objectives exist", () => {
  const workspace = createWorkspace("CRUD Gate Failure Workspace");

  const created = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Temporary Objective",
  });
  deleteWorkspaceObjective(workspace.workspaceId, created.objective?.objectiveId ?? "");

  const result = runWorkspaceOkrCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      objectiveCrudValidated: false,
    },
  });

  const crudGate = result.gateResults.find((entry) => entry.gateId === "B");
  assert.equal(crudGate?.status, "FAIL");
  assert.equal(result.certified, false);
});

test("object switching scenario validates different object OKR summaries", () => {
  const workspace = createWorkspace("Object Switch OKR Certification Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const salesSummary = resolveObjectOkrSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.salesObjectId,
  });
  const forecastSummary = resolveObjectOkrSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.forecastObjectId,
  });

  assert.notEqual(salesSummary.items[0]?.objectiveTitle, forecastSummary.items[0]?.objectiveTitle);

  const result = runWorkspaceOkrCertification({
    workspaceId: workspace.workspaceId,
    salesObjectId: dataset.salesObjectId,
    forecastObjectId: dataset.forecastObjectId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      objectiveCrudValidated: true,
      keyResultCrudValidated: true,
      objectSwitchingValidated: true,
      objectPanelIntegrationValidated: true,
    },
  });

  const switchingGate = result.gateResults.find((entry) => entry.gateId === "Z");
  assert.equal(switchingGate?.status, "PASS");
});

test("key result update does not break certification when progress is recalculated in harness only", () => {
  const workspace = createWorkspace("Key Result Update Certification Workspace");
  const objective = createWorkspaceObjective({
    workspaceId: workspace.workspaceId,
    title: "Improve Forecasting",
  });
  const keyResult = createWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    objectiveId: objective.objective?.objectiveId ?? "",
    title: "Forecast Accuracy",
    targetValue: 100,
    currentValue: 90,
    unit: "score",
  });
  calculateWorkspaceOkrProgress(workspace.workspaceId);
  evaluateWorkspaceOkrHealth(workspace.workspaceId);

  updateWorkspaceKeyResult({
    workspaceId: workspace.workspaceId,
    keyResultId: keyResult.keyResult?.keyResultId ?? "",
    currentValue: 95,
  });
  calculateWorkspaceOkrProgress(workspace.workspaceId);
  evaluateWorkspaceOkrHealth(workspace.workspaceId);

  const result = runWorkspaceOkrCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      objectiveCrudValidated: true,
      keyResultCrudValidated: true,
    },
  });

  assert.equal(result.gateResults.find((entry) => entry.gateId === "J")?.status, "PASS");
});
