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
  resetWorkspaceOkrHealthProfileStoreForTests,
  WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY,
} from "../okr/workspaceOkrHealthEngine.ts";
import { resetWorkspaceRiskStoreForTests } from "./workspaceRiskContract.ts";
import {
  WORKSPACE_DETECTED_RISK_STORAGE_KEY,
  WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  detectWorkspaceRisks,
  getDetectedWorkspaceRisks,
  resetWorkspaceDetectedRiskMemoryForTests,
  resetWorkspaceDetectedRiskStoreForTests,
  type WorkspaceDetectedRisk,
} from "./workspaceRiskDetectionEngine.ts";
import {
  NEXORA_RISK_SEVERITY_LOG_PREFIX,
  WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE,
  WORKSPACE_RISK_SEVERITY_ENGINE_TAGS,
  WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY,
  WORKSPACE_RISK_SEVERITY_DETECTION_READ_APIS,
  applyRiskSeverityEscalations,
  buildWorkspaceRiskSeverityReason,
  calculateRiskSeverityScore,
  deriveBaseSeverityScore,
  deriveRiskPriority,
  deriveRiskSeverityLevel,
  evaluateWorkspaceRiskSeverity,
  getWorkspaceRiskSeverityProfile,
  getWorkspaceRiskSeverityProfiles,
  isStrategicDetectedRisk,
  resetWorkspaceRiskSeverityProfileMemoryForTests,
  resetWorkspaceRiskSeverityProfileStoreForTests,
} from "./workspaceRiskSeverityEngine.ts";

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
  resetWorkspaceRiskSeverityProfileStoreForTests();
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
    WORKSPACE_DETECTED_RISK_STORAGE_KEY,
    "nexora.workspaceObjects.v1",
    "nexora.workspaceRelationships.v1",
    "nexora.workspaceScenes.v1",
  ];
  return Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]));
}

function seedCriticalKpiHealth(workspaceId: string, name: string) {
  createWorkspaceKpi({
    workspaceId,
    name,
    unit: "score",
    targetValue: 100,
    currentValue: 50,
  });
  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);
}

function seedWarningOkrHealth(workspaceId: string, title: string) {
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
}

function seedCriticalOkrHealth(workspaceId: string, title: string) {
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
}

function seedDetectedRisk(
  workspaceId: string,
  detectedRisk: WorkspaceDetectedRisk
): void {
  const existingRaw = window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY);
  const existing = existingRaw ? (JSON.parse(existingRaw) as Record<string, Record<string, WorkspaceDetectedRisk>>) : {};
  const workspaceMap = existing[workspaceId] ?? {};
  workspaceMap[detectedRisk.detectionId] = detectedRisk;
  existing[workspaceId] = workspaceMap;
  window.localStorage.setItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY, JSON.stringify(existing));
  resetWorkspaceDetectedRiskMemoryForTests();
}

function buildDetectedRisk(input: {
  workspaceId: string;
  detectionId: string;
  riskId: string;
  title: string;
  confidence: number;
  riskSource: WorkspaceDetectedRisk["riskSource"];
}): WorkspaceDetectedRisk {
  return Object.freeze({
    detectionId: input.detectionId,
    workspaceId: input.workspaceId,
    riskId: input.riskId,
    title: input.title,
    description: "Test detected risk.",
    riskSource: input.riskSource,
    detectionReason: "Test detection reason.",
    confidence: input.confidence,
    detectedAt: new Date().toISOString(),
    source: WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  });
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-6:3 risk severity engine tags and storage key", () => {
  assert.equal(NEXORA_RISK_SEVERITY_LOG_PREFIX, "[NexoraRiskSeverity]");
  assert.equal(
    WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY,
    "nexora.workspaceRiskSeverityProfiles.v1"
  );
  assert.deepEqual(WORKSPACE_RISK_SEVERITY_DETECTION_READ_APIS, ["getDetectedWorkspaceRisks"]);
  assert.deepEqual(WORKSPACE_RISK_SEVERITY_ENGINE_TAGS, [
    "[DS63_RISK_SEVERITY_ENGINE]",
    "[RISK_SEVERITY_READY]",
    "[RISK_PRIORITY_READY]",
    "[RISK_SCORING_READY]",
    "[DS64_READY]",
    "[DS_6_3_COMPLETE]",
  ]);
});

test("derives base severity score, level, and priority from confidence", () => {
  assert.equal(deriveBaseSeverityScore(0.95), 95);
  assert.equal(deriveBaseSeverityScore(0.8), 80);
  assert.equal(deriveBaseSeverityScore(0.65), 65);
  assert.equal(deriveBaseSeverityScore(0.5), 50);

  assert.equal(deriveRiskSeverityLevel(100), "critical");
  assert.equal(deriveRiskSeverityLevel(95), "critical");
  assert.equal(deriveRiskSeverityLevel(85), "high");
  assert.equal(deriveRiskSeverityLevel(70), "medium");
  assert.equal(deriveRiskSeverityLevel(50), "low");

  assert.equal(deriveRiskPriority(0.95), "p1");
  assert.equal(deriveRiskPriority(0.8), "p2");
  assert.equal(deriveRiskPriority(0.65), "p3");
  assert.equal(deriveRiskPriority(0.5), "p4");
});

test("manual walkthrough evaluates severity for combined and OKR detected risks", () => {
  const workspace = createWorkspace("Risk Severity Workspace");

  seedCriticalKpiHealth(workspace.workspaceId, "Forecast Accuracy");
  seedCriticalKpiHealth(workspace.workspaceId, "Forecast");
  seedWarningOkrHealth(workspace.workspaceId, "Market Expansion");
  seedCriticalOkrHealth(workspace.workspaceId, "Improve Forecasting");

  detectWorkspaceRisks(workspace.workspaceId);
  const result = evaluateWorkspaceRiskSeverity(workspace.workspaceId);
  assert.equal(result.success, true);

  const detected = getDetectedWorkspaceRisks(workspace.workspaceId);
  const forecastFailure = detected.find(
    (risk) => risk.riskSource === "combined" && risk.title === "Forecast Failure Risk"
  );
  const growthExecution = detected.find(
    (risk) => risk.riskSource === "okr" && risk.title === "Growth Execution Risk"
  );
  assert.ok(forecastFailure);
  assert.ok(growthExecution);

  const forecastSeverity = getWorkspaceRiskSeverityProfile(
    workspace.workspaceId,
    forecastFailure.detectionId
  );
  const growthSeverity = getWorkspaceRiskSeverityProfile(
    workspace.workspaceId,
    growthExecution.detectionId
  );

  assert.ok(forecastSeverity);
  assert.equal(forecastSeverity.severityLevel, "critical");
  assert.equal(forecastSeverity.severityScore, 100);
  assert.equal(forecastSeverity.priority, "p1");
  assert.equal(
    forecastSeverity.severityReason,
    "Forecast Failure Risk has critical confidence."
  );
  assert.equal(forecastSeverity.source, WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE);

  assert.ok(growthSeverity);
  assert.equal(growthSeverity.severityLevel, "high");
  assert.equal(growthSeverity.severityScore, 80);
  assert.equal(growthSeverity.priority, "p2");
  assert.equal(
    growthSeverity.severityReason,
    "Growth Execution Risk has high confidence."
  );

  assert.ok(window.localStorage.getItem(WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY));

  resetWorkspaceRiskSeverityProfileMemoryForTests();
  assert.equal(getWorkspaceRiskSeverityProfiles(workspace.workspaceId).length, result.profiles.length);
});

test("classifies critical, high, medium, and low severity profiles", () => {
  const workspace = createWorkspace("Severity Threshold Workspace");
  const workspaceId = workspace.workspaceId;

  seedDetectedRisk(
    workspaceId,
    buildDetectedRisk({
      workspaceId,
      detectionId: "detect_critical",
      riskId: "risk_critical",
      title: "Critical Risk",
      confidence: 0.95,
      riskSource: "kpi",
    })
  );
  seedDetectedRisk(
    workspaceId,
    buildDetectedRisk({
      workspaceId,
      detectionId: "detect_high",
      riskId: "risk_high",
      title: "High Risk",
      confidence: 0.8,
      riskSource: "kpi",
    })
  );
  seedDetectedRisk(
    workspaceId,
    buildDetectedRisk({
      workspaceId,
      detectionId: "detect_medium",
      riskId: "risk_medium",
      title: "Medium Risk",
      confidence: 0.65,
      riskSource: "okr",
    })
  );
  seedDetectedRisk(
    workspaceId,
    buildDetectedRisk({
      workspaceId,
      detectionId: "detect_low",
      riskId: "risk_low",
      title: "Low Risk",
      confidence: 0.5,
      riskSource: "okr",
    })
  );

  evaluateWorkspaceRiskSeverity(workspaceId);
  const profiles = getWorkspaceRiskSeverityProfiles(workspaceId);

  assert.equal(
    profiles.find((profile) => profile.detectionId === "detect_critical")?.severityLevel,
    "critical"
  );
  assert.equal(
    profiles.find((profile) => profile.detectionId === "detect_high")?.severityLevel,
    "high"
  );
  assert.equal(
    profiles.find((profile) => profile.detectionId === "detect_medium")?.severityLevel,
    "medium"
  );
  assert.equal(
    profiles.find((profile) => profile.detectionId === "detect_low")?.severityLevel,
    "low"
  );
});

test("applies combined and strategic escalation with score cap", () => {
  const combinedRisk = buildDetectedRisk({
    workspaceId: "workspace_a",
    detectionId: "detect_combined",
    riskId: "risk_combined",
    title: "Forecast Failure Risk",
    confidence: 1,
    riskSource: "combined",
  });
  assert.equal(calculateRiskSeverityScore(combinedRisk), 100);

  const strategicRisk = buildDetectedRisk({
    workspaceId: "workspace_a",
    detectionId: "detect_strategic",
    riskId: "risk_strategic",
    title: "Strategic Execution Risk",
    confidence: 0.8,
    riskSource: "okr",
  });
  assert.equal(isStrategicDetectedRisk(strategicRisk), true);
  assert.equal(calculateRiskSeverityScore(strategicRisk), 85);

  const escalated = applyRiskSeverityEscalations({
    detectedRisk: buildDetectedRisk({
      workspaceId: "workspace_a",
      detectionId: "detect_both",
      riskId: "risk_both",
      title: "Strategic Execution Risk",
      confidence: 0.95,
      riskSource: "combined",
    }),
    baseScore: 95,
  });
  assert.equal(escalated, 100);
});

test("builds deterministic severity reasons", () => {
  const combinedStrategic = buildDetectedRisk({
    workspaceId: "workspace_a",
    detectionId: "detect_strategic_combined",
    riskId: "risk_strategic_combined",
    title: "Strategic Execution Risk",
    confidence: 1,
    riskSource: "combined",
  });
  assert.equal(
    buildWorkspaceRiskSeverityReason({
      detectedRisk: combinedStrategic,
      severityLevel: "critical",
    }),
    "Strategic Execution Risk combines KPI and OKR failures."
  );
});

test("preserves workspace isolation for severity profiles", () => {
  const workspaceA = createWorkspace("Severity Workspace A");
  const workspaceB = createWorkspace("Severity Workspace B");

  seedDetectedRisk(
    workspaceA.workspaceId,
    buildDetectedRisk({
      workspaceId: workspaceA.workspaceId,
      detectionId: "detect_a",
      riskId: "risk_a",
      title: "Critical Risk",
      confidence: 0.95,
      riskSource: "kpi",
    })
  );
  evaluateWorkspaceRiskSeverity(workspaceA.workspaceId);

  assert.equal(getWorkspaceRiskSeverityProfiles(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceRiskSeverityProfiles(workspaceB.workspaceId).length, 0);
});

test("does not mutate detection, KPI, OKR, or scene storage during severity evaluation", () => {
  const workspace = createWorkspace("Severity Safety Workspace");
  seedCriticalKpiHealth(workspace.workspaceId, "Forecast Accuracy");
  seedWarningOkrHealth(workspace.workspaceId, "Market Expansion");
  detectWorkspaceRisks(workspace.workspaceId);

  const protectedBefore = snapshotProtectedStorageKeys();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  evaluateWorkspaceRiskSeverity(workspace.workspaceId);
  getWorkspaceRiskSeverityProfiles(workspace.workspaceId);

  assert.deepEqual(snapshotProtectedStorageKeys(), protectedBefore);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});

test("returns no profiles when detected risks are missing", () => {
  const workspace = createWorkspace("Empty Severity Workspace");
  const result = evaluateWorkspaceRiskSeverity(workspace.workspaceId);
  assert.equal(result.success, false);
  assert.equal(result.reason, "no_detected_risks");
  assert.equal(getWorkspaceRiskSeverityProfiles(workspace.workspaceId).length, 0);
});
