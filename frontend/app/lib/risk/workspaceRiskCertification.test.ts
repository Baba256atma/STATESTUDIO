import assert from "node:assert/strict";
import test from "node:test";

import { resolveObjectRiskSummaryState } from "../../components/panels/object-panel/riskSummaryRuntime.ts";
import {
  NEXORA_RISK_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_RISK_CERTIFICATION_GATE_TITLES,
  WORKSPACE_RISK_CERTIFICATION_TAGS,
} from "./workspaceRiskCertificationContract.ts";
import {
  getLatestWorkspaceRiskCertificationResult,
  resetWorkspaceRiskCertificationForTests,
  runWorkspaceRiskCertification,
} from "./workspaceRiskCertification.ts";
import {
  bindRiskToObject,
  resetWorkspaceRiskObjectBindingStoreForTests,
  suggestRiskObjectBindings,
} from "./workspaceRiskObjectBinding.ts";
import {
  createWorkspaceRisk,
  deleteWorkspaceRisk,
  getWorkspaceRisks,
  resetWorkspaceRiskMemoryForTests,
  resetWorkspaceRiskStoreForTests,
  updateWorkspaceRisk,
} from "./workspaceRiskContract.ts";
import {
  detectWorkspaceRisks,
  getDetectedWorkspaceRisks,
  resetWorkspaceDetectedRiskMemoryForTests,
  resetWorkspaceDetectedRiskStoreForTests,
} from "./workspaceRiskDetectionEngine.ts";
import {
  evaluateWorkspaceRiskSeverity,
  resetWorkspaceRiskSeverityProfileMemoryForTests,
  resetWorkspaceRiskSeverityProfileStoreForTests,
} from "./workspaceRiskSeverityEngine.ts";
import { getDashboardRiskSummary } from "./riskDashboardIntegrationRuntime.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import {
  createWorkspaceKpi,
  resetWorkspaceKpiStoreForTests,
} from "../kpi/workspaceKpiContract.ts";
import {
  calculateWorkspaceKpis,
  resetWorkspaceKpiProfileStoreForTests,
} from "../kpi/workspaceKpiCalculationEngine.ts";
import {
  evaluateWorkspaceKpiHealth,
  getWorkspaceKpiHealthProfile,
  resetWorkspaceKpiHealthProfileStoreForTests,
} from "../kpi/workspaceKpiHealthEngine.ts";
import {
  createWorkspaceKeyResult,
  createWorkspaceObjective,
  resetWorkspaceOkrStoreForTests,
} from "../okr/workspaceOkrContract.ts";
import {
  calculateWorkspaceOkrProgress,
  resetWorkspaceOkrProgressProfileStoreForTests,
} from "../okr/workspaceOkrProgressEngine.ts";
import {
  evaluateWorkspaceOkrHealth,
  getWorkspaceOkrHealthProfile,
  resetWorkspaceOkrHealthProfileStoreForTests,
} from "../okr/workspaceOkrHealthEngine.ts";
import { resetWorkspaceObjectIntelligenceStoreForTests } from "../workspace/workspaceObjectIntelligenceContract.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";

const RISK_STORAGE_KEY = "nexora.workspaceRisks.v1";
const DETECTED_RISK_STORAGE_KEY = "nexora.workspaceDetectedRisks.v1";
const SEVERITY_STORAGE_KEY = "nexora.workspaceRiskSeverityProfiles.v1";
const BINDING_STORAGE_KEY = "nexora.workspaceRiskObjectBindings.v1";
const KPI_STORAGE_KEY = "nexora.workspaceKpis.v1";
const KPI_PROFILE_STORAGE_KEY = "nexora.workspaceKpiProfiles.v1";
const KPI_HEALTH_STORAGE_KEY = "nexora.workspaceKpiHealthProfiles.v1";
const OBJECTIVE_STORAGE_KEY = "nexora.workspaceObjectives.v1";
const KEY_RESULT_STORAGE_KEY = "nexora.workspaceKeyResults.v1";
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
  resetWorkspaceRiskCertificationForTests();
  resetWorkspaceRiskObjectBindingStoreForTests();
  resetWorkspaceRiskSeverityProfileStoreForTests();
  resetWorkspaceDetectedRiskStoreForTests();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceOkrHealthProfileStoreForTests();
  resetWorkspaceOkrProgressProfileStoreForTests();
  resetWorkspaceOkrStoreForTests();
  resetWorkspaceKpiHealthProfileStoreForTests();
  resetWorkspaceKpiProfileStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
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
    originCandidateId: null,
    originWorkspaceObjectId: null,
    relationshipCount: 0,
    incomingRelationshipCount: 0,
    outgoingRelationshipCount: 0,
    connectedObjectCount: 0,
    intelligenceStatus: "ready",
    createdAt: timestamp,
    updatedAt: timestamp,
    source: "ds-3:1-foundation",
  };
  window.localStorage.setItem(OBJECT_INTELLIGENCE_STORAGE_KEY, JSON.stringify(store));
}

function seedCriticalKpiHealth(workspaceId: string, name: string): string {
  const kpi = createWorkspaceKpi({
    workspaceId,
    name,
    unit: "score",
    targetValue: 100,
    currentValue: 50,
  });
  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);
  return kpi.kpi?.kpiId ?? "";
}

function seedWarningOkrHealth(workspaceId: string, title: string): string {
  const objective = createWorkspaceObjective({ workspaceId, title });
  const objectiveId = objective.objective?.objectiveId ?? "";
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId,
    title: "Revenue Growth",
    targetValue: 30,
    currentValue: 15,
    unit: "%",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId,
    title: "Customer Retention",
    targetValue: 90,
    currentValue: 81,
    unit: "%",
  });
  calculateWorkspaceOkrProgress(workspaceId);
  evaluateWorkspaceOkrHealth(workspaceId);
  return objectiveId;
}

function seedCriticalOkrHealth(workspaceId: string, title: string): string {
  const objective = createWorkspaceObjective({ workspaceId, title });
  const objectiveId = objective.objective?.objectiveId ?? "";
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId,
    title: "Accuracy Target",
    targetValue: 100,
    currentValue: 40,
    unit: "score",
  });
  calculateWorkspaceOkrProgress(workspaceId);
  evaluateWorkspaceOkrHealth(workspaceId);
  return objectiveId;
}

function seedCertificationDataset(workspaceId: string): {
  forecastObjectId: string;
  unboundObjectId: string;
  foundationRiskId: string;
  combinedRiskId: string;
} {
  const foundation = createWorkspaceRisk({
    workspaceId,
    title: "Forecast Quality Risk",
    category: "operational",
  });
  assert.equal(foundation.success, true);

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

  const forecastKpiId = seedCriticalKpiHealth(workspaceId, "Forecast Accuracy");
  createWorkspaceKpi({
    workspaceId,
    name: "Warning KPI",
    unit: "score",
    targetValue: 100,
    currentValue: 85,
  });
  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);
  seedCriticalKpiHealth(workspaceId, "Forecast");
  const marketObjectiveId = seedWarningOkrHealth(workspaceId, "Market Expansion");
  seedCriticalOkrHealth(workspaceId, "Improve Forecasting");

  assert.equal(getWorkspaceKpiHealthProfile(workspaceId, forecastKpiId)?.healthStatus, "critical");
  assert.equal(getWorkspaceOkrHealthProfile(workspaceId, marketObjectiveId)?.healthStatus, "warning");

  detectWorkspaceRisks(workspaceId);
  evaluateWorkspaceRiskSeverity(workspaceId);

  const combinedRisk = getDetectedWorkspaceRisks(workspaceId).find(
    (risk) => risk.riskSource === "combined" && risk.title === "Forecast Failure Risk"
  );
  assert.ok(combinedRisk);

  const suggestResult = suggestRiskObjectBindings(workspaceId);
  assert.ok(suggestResult.success);

  return {
    forecastObjectId: "obj_forecast",
    unboundObjectId: "obj_unbound",
    foundationRiskId: foundation.risk?.riskId ?? "",
    combinedRiskId: combinedRisk.riskId,
  };
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-6:7 certification tags and gate titles", () => {
  assert.equal(NEXORA_RISK_CERTIFICATION_LOG_PREFIX, "[NexoraRiskCertification]");
  assert.ok(WORKSPACE_RISK_CERTIFICATION_TAGS.includes("[DS67_CERTIFIED]"));
  assert.equal(WORKSPACE_RISK_CERTIFICATION_GATE_TITLES.A, "Risk Contract Exists");
  assert.equal(WORKSPACE_RISK_CERTIFICATION_GATE_TITLES.AO, "Regression Pass");
});

test("certifies empty workspace with supplemental harness flags", () => {
  const workspace = createWorkspace("Empty Risk Certification Workspace");
  const isolation = createWorkspace("Isolation Risk Certification Workspace");

  const result = runWorkspaceRiskCertification({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolation.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      emptyWorkspaceValidated: true,
      crudValidated: true,
      retrievalValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      manualBindingValidated: true,
      suggestedBindingsValidated: true,
      dashboardSummaryValidated: true,
      objectPanelIntegrationValidated: true,
      objectSwitchingValidated: true,
    },
  });

  assert.equal(result.passed, true);
  assert.equal(result.certified, true);
  assert.equal(result.gateResults.length, 41);
  assert.equal(result.scenarioResults.length, 12);
  assert.ok(result.warnings.length >= 5);
  assert.ok(result.tags.includes("[RISK_MVP_COMPLETE]"));
});

test("certifies full manual walkthrough dataset", () => {
  const workspace = createWorkspace("Risk Certification Workspace");
  const isolation = createWorkspace("Risk Certification Isolation Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const updateResult = updateWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    riskId: dataset.foundationRiskId,
    description: "Certification walkthrough risk.",
  });
  assert.equal(updateResult.success, true);

  const firstBind = bindRiskToObject(
    workspace.workspaceId,
    dataset.combinedRiskId,
    dataset.forecastObjectId
  );
  assert.equal(firstBind.success, true);

  const duplicate = bindRiskToObject(
    workspace.workspaceId,
    dataset.combinedRiskId,
    dataset.forecastObjectId
  );
  assert.equal(duplicate.created, false);

  const beforeReload = getDetectedWorkspaceRisks(workspace.workspaceId).length;
  resetWorkspaceRiskMemoryForTests();
  resetWorkspaceDetectedRiskMemoryForTests();
  resetWorkspaceRiskSeverityProfileMemoryForTests();
  assert.equal(getWorkspaceRisks(workspace.workspaceId).length, 1);
  assert.equal(getDetectedWorkspaceRisks(workspace.workspaceId).length, beforeReload);

  const dashboardSummary = getDashboardRiskSummary(workspace.workspaceId);
  assert.ok(dashboardSummary.totalRisks >= 3);
  assert.ok(dashboardSummary.highestPriorityRiskTitle);

  const result = runWorkspaceRiskCertification({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolation.workspaceId,
    forecastObjectId: dataset.forecastObjectId,
    unboundObjectId: dataset.unboundObjectId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      crudValidated: true,
      retrievalValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      manualBindingValidated: true,
      suggestedBindingsValidated: true,
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
  assert.equal(getLatestWorkspaceRiskCertificationResult()?.certified, true);
});

test("validates risk panel visibility and empty state scenarios", () => {
  const workspace = createWorkspace("Risk Panel Certification Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const forecastSummary = resolveObjectRiskSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.forecastObjectId,
  });
  assert.ok(forecastSummary.items.length > 0);
  assert.ok(forecastSummary.items.some((item) => item.riskTitle.includes("Forecast")));

  const emptySummary = resolveObjectRiskSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.unboundObjectId,
  });
  assert.equal(emptySummary.emptyMessage, "No risks linked to this object.");
});

test("certification runner does not mutate risk, KPI, OKR, or scene storage", () => {
  const workspace = createWorkspace("Risk Certification Safety Workspace");
  seedCertificationDataset(workspace.workspaceId);

  const before = {
    risks: window.localStorage.getItem(RISK_STORAGE_KEY),
    detected: window.localStorage.getItem(DETECTED_RISK_STORAGE_KEY),
    severity: window.localStorage.getItem(SEVERITY_STORAGE_KEY),
    bindings: window.localStorage.getItem(BINDING_STORAGE_KEY),
    kpis: window.localStorage.getItem(KPI_STORAGE_KEY),
    kpiProfiles: window.localStorage.getItem(KPI_PROFILE_STORAGE_KEY),
    kpiHealth: window.localStorage.getItem(KPI_HEALTH_STORAGE_KEY),
    objectives: window.localStorage.getItem(OBJECTIVE_STORAGE_KEY),
    keyResults: window.localStorage.getItem(KEY_RESULT_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    scene: getWorkspaceSceneJson(workspace.workspaceId),
  };

  runWorkspaceRiskCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      crudValidated: true,
      retrievalValidated: true,
      persistenceReloadValidated: true,
      duplicateProtectionValidated: true,
      manualBindingValidated: true,
      suggestedBindingsValidated: true,
      dashboardSummaryValidated: true,
      objectPanelIntegrationValidated: true,
      objectSwitchingValidated: true,
    },
  });

  assert.equal(window.localStorage.getItem(RISK_STORAGE_KEY), before.risks);
  assert.equal(window.localStorage.getItem(DETECTED_RISK_STORAGE_KEY), before.detected);
  assert.equal(window.localStorage.getItem(SEVERITY_STORAGE_KEY), before.severity);
  assert.equal(window.localStorage.getItem(BINDING_STORAGE_KEY), before.bindings);
  assert.equal(window.localStorage.getItem(KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(KPI_PROFILE_STORAGE_KEY), before.kpiProfiles);
  assert.equal(window.localStorage.getItem(KPI_HEALTH_STORAGE_KEY), before.kpiHealth);
  assert.equal(window.localStorage.getItem(OBJECTIVE_STORAGE_KEY), before.objectives);
  assert.equal(window.localStorage.getItem(KEY_RESULT_STORAGE_KEY), before.keyResults);
  assert.equal(window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY), before.objects);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), before.scene);
});

test("CRUD gate fails when supplemental CRUD validation is false and no risks exist", () => {
  const workspace = createWorkspace("CRUD Gate Failure Workspace");

  const created = createWorkspaceRisk({
    workspaceId: workspace.workspaceId,
    title: "Temporary Risk",
    category: "operational",
  });
  deleteWorkspaceRisk(workspace.workspaceId, created.risk?.riskId ?? "");

  const result = runWorkspaceRiskCertification({
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
