/**
 * INT-5 — Platform certification harness.
 * Shared reset, seed, and protected storage snapshots for end-to-end certification.
 */

import { EXECUTIVE_REGISTRY_STORAGE_KEY } from "../executive/executiveIntelligenceRegistry.ts";
import {
  WORKSPACE_KPI_STORAGE_KEY,
  createWorkspaceKpi,
  resetWorkspaceKpiStoreForTests,
} from "../kpi/workspaceKpiContract.ts";
import {
  calculateWorkspaceKpis,
  resetWorkspaceKpiProfileStoreForTests,
} from "../kpi/workspaceKpiCalculationEngine.ts";
import {
  evaluateWorkspaceKpiHealth,
  resetWorkspaceKpiHealthProfileStoreForTests,
} from "../kpi/workspaceKpiHealthEngine.ts";
import { WORKSPACE_OBJECTIVE_STORAGE_KEY } from "../okr/workspaceOkrContract.ts";
import { WORKSPACE_DETECTED_RISK_STORAGE_KEY } from "../risk/workspaceRiskDetectionEngine.ts";
import { WORKSPACE_RISK_STORAGE_KEY } from "../risk/workspaceRiskContract.ts";
import {
  createWorkspaceScenario,
  resetWorkspaceScenarioStoreForTests,
  WORKSPACE_SCENARIO_STORAGE_KEY,
} from "../scenario/workspaceScenarioContract.ts";
import {
  generateWorkspaceScenarioInsight,
  resetWorkspaceScenarioInsightStoreForTests,
} from "../scenario/workspaceScenarioInsightEngine.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  createWorkspace,
  getWorkspaceById,
  resetWorkspaceRegistryForTests,
  upsertWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import { resetWorkspaceScenesForTests } from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import { resetAssistantIntelligenceDiagnosticsForTests } from "../assistantIntelligence/assistantDiagnostics.ts";
import { resetAssistantRequestBuilderForTests } from "../assistantIntelligence/assistantRequestBuilder.ts";
import { resetAssistantRuntimeRegistryForTests } from "../assistantIntelligence/assistantRuntimeRegistry.ts";
import { resetDashboardIntelligenceDiagnosticsForTests } from "../dashboardIntelligence/dashboardIntelligenceDiagnostics.ts";
import { resetDashboardIntelligenceRegistryForTests } from "../dashboardIntelligence/dashboardIntelligenceRegistry.ts";
import { resetDashboardIntelligenceRuntimeForTests } from "../dashboardIntelligence/dashboardIntelligenceRuntime.ts";
import { resetDashboardIntelligenceSessionForTests } from "../dashboardIntelligence/dashboardIntelligenceSession.ts";
import { resetIntelligenceConsumerDiagnosticsForTests } from "../dashboardIntelligence/consumerDiagnosticsContract.ts";
import { resetDirectAccessProtectionForTests } from "../dashboardIntelligence/directAccessProtectionContract.ts";
import { resetExecutiveTimeContextBuilderForTests } from "../dashboardIntelligence/executiveTimeContextBuilder.ts";
import { resetExecutiveTimeContextDiagnosticsForTests } from "../dashboardIntelligence/executiveTimeContextDiagnostics.ts";
import { resetExecutiveTimeContextRegistryForTests } from "../dashboardIntelligence/executiveTimeContextRegistry.ts";
import { resetIntelligenceConsumerRegistryForTests } from "../dashboardIntelligence/intelligenceConsumerRegistry.ts";
import { resetIntelligenceContextBuilderForTests } from "../dashboardIntelligence/intelligenceContextBuilder.ts";
import { resetIntelligenceContextDiagnosticsForTests } from "../dashboardIntelligence/intelligenceContextDiagnostics.ts";
import { resetIntelligenceContextRegistryForTests } from "../dashboardIntelligence/intelligenceContextRegistry.ts";
import { resetIntelligenceContextSnapshotsForTests } from "../dashboardIntelligence/intelligenceContextSnapshot.ts";
import { resetSingleIntelligenceSourceGatewayForTests } from "../dashboardIntelligence/singleIntelligenceSourceGateway.ts";
import { resetExecutiveSummaryDiagnosticsForTests } from "../executiveSummaryIntelligence/executiveSummaryDiagnostics.ts";
import { resetExecutiveSummaryRegistryForTests } from "../executiveSummaryIntelligence/executiveSummaryRegistry.ts";
import { resetExecutiveSummaryRequestBuilderForTests } from "../executiveSummaryIntelligence/executiveSummaryRequestBuilder.ts";
import { resetObjectPanelDiagnosticsForTests } from "../objectPanelIntelligence/objectPanelDiagnostics.ts";
import { resetObjectPanelRegistryForTests } from "../objectPanelIntelligence/objectPanelRegistry.ts";
import { resetObjectPanelRequestBuilderForTests } from "../objectPanelIntelligence/objectPanelRequestBuilder.ts";
import { resetWorkspaceDetectedRiskStoreForTests } from "../risk/workspaceRiskDetectionEngine.ts";
import { resetWorkspaceRiskObjectBindingStoreForTests } from "../risk/workspaceRiskObjectBinding.ts";
import { resetWorkspaceRiskSeverityProfileStoreForTests } from "../risk/workspaceRiskSeverityEngine.ts";
import { resetWorkspaceRiskStoreForTests } from "../risk/workspaceRiskContract.ts";

const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

export type PlatformProtectedStorageSnapshot = Readonly<Record<string, string | null>>;

export function ensurePlatformCertificationBrowserStorage(): void {
  if (typeof globalThis.window !== "undefined") return;
  const store: Record<string, string> = {};
  (globalThis as unknown as { window: Window }).window = {
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

export function resetExecutiveIntelligencePlatformForCertification(): void {
  resetAssistantRequestBuilderForTests();
  resetAssistantRuntimeRegistryForTests();
  resetAssistantIntelligenceDiagnosticsForTests();
  resetExecutiveSummaryRequestBuilderForTests();
  resetExecutiveSummaryRegistryForTests();
  resetExecutiveSummaryDiagnosticsForTests();
  resetObjectPanelRequestBuilderForTests();
  resetObjectPanelRegistryForTests();
  resetObjectPanelDiagnosticsForTests();
  resetExecutiveTimeContextBuilderForTests();
  resetExecutiveTimeContextRegistryForTests();
  resetExecutiveTimeContextDiagnosticsForTests();
  resetIntelligenceContextBuilderForTests();
  resetIntelligenceContextSnapshotsForTests();
  resetIntelligenceContextRegistryForTests();
  resetIntelligenceContextDiagnosticsForTests();
  resetSingleIntelligenceSourceGatewayForTests();
  resetIntelligenceConsumerDiagnosticsForTests();
  resetDirectAccessProtectionForTests();
  resetIntelligenceConsumerRegistryForTests();
  resetDashboardIntelligenceRuntimeForTests();
  resetDashboardIntelligenceRegistryForTests();
  resetDashboardIntelligenceDiagnosticsForTests();
  resetDashboardIntelligenceSessionForTests();
  resetWorkspaceScenarioInsightStoreForTests();
  resetWorkspaceScenarioStoreForTests();
  resetWorkspaceRiskObjectBindingStoreForTests();
  resetWorkspaceRiskSeverityProfileStoreForTests();
  resetWorkspaceDetectedRiskStoreForTests();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceKpiHealthProfileStoreForTests();
  resetWorkspaceKpiProfileStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

export function snapshotPlatformProtectedStorage(): PlatformProtectedStorageSnapshot {
  if (typeof window === "undefined") return Object.freeze({});
  return Object.freeze({
    scenarios: window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY),
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    objectives: window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY),
    risks: window.localStorage.getItem(WORKSPACE_RISK_STORAGE_KEY),
    detected: window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY),
    executiveRegistry: window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    relationships: window.localStorage.getItem(RELATIONSHIP_STORAGE_KEY),
    scenes: window.localStorage.getItem(SCENE_STORAGE_KEY),
  });
}

export function protectedStorageUnchanged(
  before: PlatformProtectedStorageSnapshot,
  after: PlatformProtectedStorageSnapshot
): boolean {
  return Object.keys(before).every((key) => before[key] === after[key]);
}

export function ensurePlatformCertificationWorkspace(
  workspaceId: WorkspaceId,
  workspaceName = "Platform Certification Workspace"
): WorkspaceId {
  const trimmed = workspaceId.trim();
  if (!getWorkspaceById(trimmed)) {
    const timestamp = new Date().toISOString();
    upsertWorkspace(
      Object.freeze({
        workspaceId: trimmed,
        workspaceName: workspaceName.trim() || "Platform Certification Workspace",
        status: "active",
        createdAt: timestamp,
        updatedAt: timestamp,
        lastOpenedAt: timestamp,
        domain: null,
        objectCount: 0,
        dataSourceCount: 0,
        metadata: Object.freeze({
          lifecycle: "empty_workspace",
          phase: "INT-5",
        }),
      })
    );
  }
  return trimmed;
}

export function seedPlatformCertificationWorkspace(workspaceId: WorkspaceId): void {
  ensurePlatformCertificationWorkspace(workspaceId);
  createWorkspaceKpi({
    workspaceId,
    name: "Delivery Performance",
    unit: "score",
    targetValue: 100,
    currentValue: 55,
  });
  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);
  const scenario = createWorkspaceScenario({
    workspaceId,
    name: "Delivery Delay Scenario",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight(workspaceId, scenario.scenario?.scenarioId ?? "");
}

export function createPlatformCertificationWorkspace(name = "Platform Certification Workspace"): WorkspaceId {
  return createWorkspace(name).workspaceId;
}
