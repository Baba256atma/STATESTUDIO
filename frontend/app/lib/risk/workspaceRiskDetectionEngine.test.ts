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
  createWorkspaceKpi,
  resetWorkspaceKpiStoreForTests,
} from "../kpi/workspaceKpiContract.ts";
import {
  calculateWorkspaceKpis,
  resetWorkspaceKpiProfileStoreForTests,
  WORKSPACE_KPI_PROFILE_STORAGE_KEY,
} from "../kpi/workspaceKpiCalculationEngine.ts";
import {
  evaluateWorkspaceKpiHealth,
  getWorkspaceKpiHealthProfile,
  resetWorkspaceKpiHealthProfileMemoryForTests,
  resetWorkspaceKpiHealthProfileStoreForTests,
  WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY,
} from "../kpi/workspaceKpiHealthEngine.ts";
import {
  createWorkspaceKeyResult,
  createWorkspaceObjective,
  resetWorkspaceOkrStoreForTests,
  WORKSPACE_KEY_RESULT_STORAGE_KEY,
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
} from "../okr/workspaceOkrContract.ts";
import {
  calculateWorkspaceOkrProgress,
  resetWorkspaceOkrProgressProfileStoreForTests,
  WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
} from "../okr/workspaceOkrProgressEngine.ts";
import {
  evaluateWorkspaceOkrHealth,
  getWorkspaceOkrHealthProfile,
  resetWorkspaceOkrHealthProfileMemoryForTests,
  resetWorkspaceOkrHealthProfileStoreForTests,
  WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY,
} from "../okr/workspaceOkrHealthEngine.ts";
import {
  WORKSPACE_RISK_STORAGE_KEY,
  resetWorkspaceRiskStoreForTests,
} from "./workspaceRiskContract.ts";
import {
  NEXORA_RISK_DETECTION_LOG_PREFIX,
  WORKSPACE_DETECTED_RISK_STORAGE_KEY,
  WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  WORKSPACE_RISK_DETECTION_ENGINE_TAGS,
  WORKSPACE_RISK_DETECTION_HEALTH_READ_APIS,
  buildCombinedDetectionReason,
  buildKpiDetectionReason,
  buildOkrDetectionReason,
  detectWorkspaceRisks,
  getDetectedWorkspaceRisk,
  getDetectedWorkspaceRisks,
  resetWorkspaceDetectedRiskMemoryForTests,
  resetWorkspaceDetectedRiskStoreForTests,
} from "./workspaceRiskDetectionEngine.ts";

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
  resetWorkspaceDetectedRiskStoreForTests();
  resetWorkspaceRiskStoreForTests();
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
    WORKSPACE_KPI_STORAGE_KEY,
    WORKSPACE_KPI_PROFILE_STORAGE_KEY,
    WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY,
    WORKSPACE_OBJECTIVE_STORAGE_KEY,
    WORKSPACE_KEY_RESULT_STORAGE_KEY,
    WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
    WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY,
    WORKSPACE_RISK_STORAGE_KEY,
    "nexora.workspaceObjects.v1",
    "nexora.workspaceRelationships.v1",
    "nexora.workspaceScenes.v1",
  ];
  return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
}

function seedCriticalKpiHealth(workspaceId: string, name: string) {
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

function seedWarningOkrHealth(workspaceId: string, title: string) {
  const objective = createWorkspaceObjective({
    workspaceId,
    title,
  });
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

function seedCriticalOkrHealth(workspaceId: string, title: string) {
  const objective = createWorkspaceObjective({
    workspaceId,
    title,
  });
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

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-6:2 risk detection engine tags and storage key", () => {
  assert.equal(NEXORA_RISK_DETECTION_LOG_PREFIX, "[NexoraRiskDetection]");
  assert.equal(WORKSPACE_DETECTED_RISK_STORAGE_KEY, "nexora.workspaceDetectedRisks.v1");
  assert.deepEqual(WORKSPACE_RISK_DETECTION_HEALTH_READ_APIS, [
    "getWorkspaceKpiHealthProfiles",
    "getWorkspaceOkrHealthProfiles",
  ]);
  assert.deepEqual(WORKSPACE_RISK_DETECTION_ENGINE_TAGS, [
    "[DS62_RISK_DETECTION_ENGINE]",
    "[RISK_DETECTION_READY]",
    "[KPI_RISK_DETECTION_READY]",
    "[OKR_RISK_DETECTION_READY]",
    "[DS63_READY]",
    "[DS_6_2_COMPLETE]",
  ]);
});

test("builds deterministic detection reasons", () => {
  assert.equal(buildKpiDetectionReason("Forecast Accuracy", "critical"), "Forecast Accuracy KPI is critical.");
  assert.equal(
    buildOkrDetectionReason("Market Expansion", "warning"),
    "Market Expansion objective is warning."
  );
  assert.equal(
    buildCombinedDetectionReason("Forecast Accuracy", "Improve Forecasting"),
    "Forecast KPI and Forecasting objective are both critical."
  );
});

test("manual walkthrough detects KPI, OKR, and combined risks", () => {
  const workspace = createWorkspace("Risk Detection Workspace");

  const forecastKpiId = seedCriticalKpiHealth(workspace.workspaceId, "Forecast Accuracy");
  const marketObjectiveId = seedWarningOkrHealth(workspace.workspaceId, "Market Expansion");
  seedCriticalKpiHealth(workspace.workspaceId, "Forecast");
  seedCriticalOkrHealth(workspace.workspaceId, "Improve Forecasting");

  const forecastHealth = getWorkspaceKpiHealthProfile(workspace.workspaceId, forecastKpiId);
  const marketHealth = getWorkspaceOkrHealthProfile(workspace.workspaceId, marketObjectiveId);
  assert.equal(forecastHealth?.healthStatus, "critical");
  assert.equal(marketHealth?.healthStatus, "warning");

  const result = detectWorkspaceRisks(workspace.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.detected, true);

  const risks = getDetectedWorkspaceRisks(workspace.workspaceId);
  const kpiRisk = risks.find(
    (risk) => risk.riskSource === "kpi" && risk.title === "Forecast Quality Risk"
  );
  const okrRisk = risks.find(
    (risk) => risk.riskSource === "okr" && risk.title === "Growth Execution Risk"
  );
  const combinedRisk = risks.find(
    (risk) => risk.riskSource === "combined" && risk.title === "Forecast Failure Risk"
  );

  assert.ok(kpiRisk);
  assert.equal(kpiRisk.confidence, 0.95);
  assert.equal(kpiRisk.detectionReason, "Forecast Accuracy KPI is critical.");
  assert.equal(kpiRisk.source, WORKSPACE_RISK_DETECTION_ENGINE_SOURCE);

  assert.ok(okrRisk);
  assert.equal(okrRisk.confidence, 0.8);
  assert.equal(okrRisk.detectionReason, "Market Expansion objective is warning.");

  assert.ok(combinedRisk);
  assert.equal(combinedRisk.confidence, 1);
  assert.equal(
    combinedRisk.detectionReason,
    "Forecast KPI and Forecasting objective are both critical."
  );

  assert.ok(window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY));

  resetWorkspaceDetectedRiskMemoryForTests();
  assert.equal(getDetectedWorkspaceRisks(workspace.workspaceId).length, risks.length);
  assert.ok(getDetectedWorkspaceRisk(workspace.workspaceId, combinedRisk.detectionId));
});

test("detects critical and warning KPI risks with confidence thresholds", () => {
  const workspace = createWorkspace("KPI Detection Workspace");
  seedCriticalKpiHealth(workspace.workspaceId, "Critical KPI");
  const warningKpi = createWorkspaceKpi({
    workspaceId: workspace.workspaceId,
    name: "Warning KPI",
    unit: "score",
    targetValue: 100,
    currentValue: 85,
  });
  calculateWorkspaceKpis(workspace.workspaceId);
  evaluateWorkspaceKpiHealth(workspace.workspaceId);

  detectWorkspaceRisks(workspace.workspaceId);
  const risks = getDetectedWorkspaceRisks(workspace.workspaceId).filter(
    (risk) => risk.riskSource === "kpi"
  );
  assert.equal(risks.length, 2);

  const critical = risks.find((risk) => risk.confidence === 0.95);
  const warning = risks.find((risk) => risk.confidence === 0.8);
  assert.ok(critical);
  assert.ok(warning);
  assert.equal(
    getWorkspaceKpiHealthProfile(
      workspace.workspaceId,
      warningKpi.kpi?.kpiId ?? ""
    )?.healthStatus,
    "warning"
  );
});

test("detects critical and warning OKR risks", () => {
  const workspace = createWorkspace("OKR Detection Workspace");
  seedWarningOkrHealth(workspace.workspaceId, "Warning Objective");
  seedCriticalOkrHealth(workspace.workspaceId, "Critical Objective");

  detectWorkspaceRisks(workspace.workspaceId);
  const risks = getDetectedWorkspaceRisks(workspace.workspaceId).filter(
    (risk) => risk.riskSource === "okr"
  );
  assert.equal(risks.length, 2);
  assert.ok(risks.some((risk) => risk.confidence === 0.95));
  assert.ok(risks.some((risk) => risk.confidence === 0.8));
});

test("prevents duplicate detections on repeated runs", () => {
  const workspace = createWorkspace("Duplicate Detection Workspace");
  seedCriticalKpiHealth(workspace.workspaceId, "Forecast Accuracy");

  detectWorkspaceRisks(workspace.workspaceId);
  const firstCount = getDetectedWorkspaceRisks(workspace.workspaceId).length;
  detectWorkspaceRisks(workspace.workspaceId);
  const secondCount = getDetectedWorkspaceRisks(workspace.workspaceId).length;

  assert.equal(firstCount, secondCount);
  assert.equal(firstCount, 1);
});

test("preserves workspace isolation for detected risks", () => {
  const workspaceA = createWorkspace("Risk Detection A");
  const workspaceB = createWorkspace("Risk Detection B");

  seedCriticalKpiHealth(workspaceA.workspaceId, "Forecast Accuracy");
  detectWorkspaceRisks(workspaceA.workspaceId);

  assert.equal(getDetectedWorkspaceRisks(workspaceA.workspaceId).length, 1);
  assert.equal(getDetectedWorkspaceRisks(workspaceB.workspaceId).length, 0);
});

test("returns empty detections for invalid workspace", () => {
  const result = detectWorkspaceRisks("");
  assert.equal(result.success, false);
  assert.equal(result.reason, "missing_workspace");
  assert.equal(getDetectedWorkspaceRisks("").length, 0);
});

test("does not mutate KPI, OKR, scene, or foundation risk storage during detection", () => {
  const workspace = createWorkspace("Risk Detection Safety Workspace");
  seedCriticalKpiHealth(workspace.workspaceId, "Forecast Accuracy");
  seedWarningOkrHealth(workspace.workspaceId, "Market Expansion");

  const protectedBefore = snapshotProtectedStorageKeys();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  detectWorkspaceRisks(workspace.workspaceId);
  getDetectedWorkspaceRisks(workspace.workspaceId);

  assert.deepEqual(snapshotProtectedStorageKeys(), protectedBefore);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});

test("does not recalculate KPI or OKR health profiles during detection", () => {
  const workspace = createWorkspace("Risk Detection Readonly Workspace");
  seedCriticalKpiHealth(workspace.workspaceId, "Forecast Accuracy");
  seedWarningOkrHealth(workspace.workspaceId, "Market Expansion");

  const kpiHealthBefore = window.localStorage.getItem(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY);
  const okrHealthBefore = window.localStorage.getItem(WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY);

  detectWorkspaceRisks(workspace.workspaceId);

  assert.equal(
    window.localStorage.getItem(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY),
    kpiHealthBefore
  );
  assert.equal(
    window.localStorage.getItem(WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY),
    okrHealthBefore
  );
});
