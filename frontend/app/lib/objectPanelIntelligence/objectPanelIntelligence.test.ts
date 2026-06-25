import assert from "node:assert/strict";
import test from "node:test";

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
import { resetWorkspaceDetectedRiskStoreForTests } from "../risk/workspaceRiskDetectionEngine.ts";
import { resetWorkspaceRiskObjectBindingStoreForTests } from "../risk/workspaceRiskObjectBinding.ts";
import { resetWorkspaceRiskSeverityProfileStoreForTests } from "../risk/workspaceRiskSeverityEngine.ts";
import { resetWorkspaceRiskStoreForTests } from "../risk/workspaceRiskContract.ts";
import {
  createWorkspaceScenario,
  resetWorkspaceScenarioStoreForTests,
} from "../scenario/workspaceScenarioContract.ts";
import {
  generateWorkspaceScenarioInsight,
  resetWorkspaceScenarioInsightStoreForTests,
} from "../scenario/workspaceScenarioInsightEngine.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import { resetWorkspaceScenesForTests } from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import { resetDashboardIntelligenceDiagnosticsForTests } from "../dashboardIntelligence/dashboardIntelligenceDiagnostics.ts";
import { resetDashboardIntelligenceRegistryForTests } from "../dashboardIntelligence/dashboardIntelligenceRegistry.ts";
import { resetDashboardIntelligenceRuntimeForTests } from "../dashboardIntelligence/dashboardIntelligenceRuntime.ts";
import { resetDashboardIntelligenceSessionForTests } from "../dashboardIntelligence/dashboardIntelligenceSession.ts";
import { resetIntelligenceConsumerDiagnosticsForTests } from "../dashboardIntelligence/consumerDiagnosticsContract.ts";
import {
  assertPresentationMayNotImportDsEngine,
  resetDirectAccessProtectionForTests,
} from "../dashboardIntelligence/directAccessProtectionContract.ts";
import { resetIntelligenceConsumerRegistryForTests } from "../dashboardIntelligence/intelligenceConsumerRegistry.ts";
import { resetExecutiveTimeContextBuilderForTests } from "../dashboardIntelligence/executiveTimeContextBuilder.ts";
import { resetExecutiveTimeContextDiagnosticsForTests } from "../dashboardIntelligence/executiveTimeContextDiagnostics.ts";
import { resetExecutiveTimeContextRegistryForTests } from "../dashboardIntelligence/executiveTimeContextRegistry.ts";
import {
  buildIntelligenceContext,
  resetIntelligenceContextBuilderForTests,
} from "../dashboardIntelligence/intelligenceContextBuilder.ts";
import { resetIntelligenceContextDiagnosticsForTests } from "../dashboardIntelligence/intelligenceContextDiagnostics.ts";
import { resetIntelligenceContextRegistryForTests } from "../dashboardIntelligence/intelligenceContextRegistry.ts";
import { resetIntelligenceContextSnapshotsForTests } from "../dashboardIntelligence/intelligenceContextSnapshot.ts";
import { resetSingleIntelligenceSourceGatewayForTests } from "../dashboardIntelligence/singleIntelligenceSourceGateway.ts";
import { adaptObjectPanelContext } from "./objectPanelContextAdapter.ts";
import {
  getObjectPanelDiagnosticsLog,
  getObjectPanelEvents,
  resetObjectPanelDiagnosticsForTests,
} from "./objectPanelDiagnostics.ts";
import { runObjectPanelIntelligenceCertification } from "./objectPanelIntelligenceCertification.ts";
import {
  OBJECT_PANEL_CONSUMER,
  OBJECT_PANEL_INTELLIGENCE_TAGS,
  OBJECT_PANEL_INTELLIGENCE_VERSION,
  OBJECT_PANEL_SECTIONS,
  NEXORA_OBJECT_PANEL_LOG_PREFIX,
} from "./objectPanelIntelligenceContract.ts";
import {
  buildObjectPanelIntelligenceRequest,
  resetObjectPanelRequestBuilderForTests,
} from "./objectPanelRequestBuilder.ts";
import {
  getObjectPanelRegistryState,
  getObjectPanelSelectionChangeCounter,
  resetObjectPanelRegistryForTests,
} from "./objectPanelRegistry.ts";
import { requestObjectPanelIntelligence } from "./objectPanelRuntimeAdapter.ts";

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

function resetAllForTests(): void {
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

function seedWorkspace(workspaceId: string): void {
  createWorkspaceKpi({
    workspaceId,
    name: "Forecast Accuracy",
    unit: "score",
    targetValue: 100,
    currentValue: 60,
  });
  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);
  const scenario = createWorkspaceScenario({
    workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight(workspaceId, scenario.scenario?.scenarioId ?? "");
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllForTests();
});

test("exports INT-4 object panel tags and version", () => {
  assert.equal(NEXORA_OBJECT_PANEL_LOG_PREFIX, "[NexoraObjectPanelIntelligence]");
  assert.equal(OBJECT_PANEL_INTELLIGENCE_VERSION, "INT-4");
  assert.equal(OBJECT_PANEL_CONSUMER, "object_panel");
  assert.ok(OBJECT_PANEL_INTELLIGENCE_TAGS.includes("[INT4_COMPLETE]"));
  assert.equal(OBJECT_PANEL_SECTIONS.length, 11);
});

test("buildObjectPanelIntelligenceRequest requires object selection", () => {
  const workspace = createWorkspace("Object Panel Selection Workspace");
  const missing = buildObjectPanelIntelligenceRequest({ workspace: workspace.workspaceId });
  assert.equal(missing.success, false);
  assert.equal(missing.reason, "object_selection_required");

  const built = buildObjectPanelIntelligenceRequest({
    workspace: workspace.workspaceId,
    selectedObjectId: "obj_forecast",
  });
  assert.equal(built.success, true);
  assert.equal(built.request?.selectedObjectId, "obj_forecast");
  assert.equal(Object.isFrozen(built.request), true);
});

test("context adapter reads platform context without local copies", () => {
  const workspace = createWorkspace("Object Panel Context Workspace");
  buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "objects",
    dashboardMode: "objects",
    selectedObject: "obj_a",
    selectedKpi: "kpi_a",
  });

  const adapted = adaptObjectPanelContext({ useCurrentContext: true });
  assert.equal(adapted.intelligenceContextInput.consumer, "object_panel");
  assert.equal(adapted.intelligenceContextInput.workspace, workspace.workspaceId);
  assert.equal(adapted.selectedObjectId, "obj_a");
  assert.equal(adapted.panel, "objects");
});

test("requestObjectPanelIntelligence routes through executive intelligence platform", () => {
  const workspace = createWorkspace("Object Panel Runtime Workspace");
  seedWorkspace(workspace.workspaceId);

  const result = requestObjectPanelIntelligence({
    workspace: workspace.workspaceId,
    selectedObjectId: "obj_forecast",
    executiveTime: { timeState: "now" },
  });

  assert.equal(result.request.consumer, "object_panel");
  assert.equal(result.request.panel, "objects");
  assert.equal(result.gatewaySuccess, true);
  assert.equal(result.response.success, true);
  assert.equal(result.response.selectedObjectId, "obj_forecast");
  assert.ok(result.response.sections.length === OBJECT_PANEL_SECTIONS.length);
  assert.ok("confidence" in result.response);
  assert.ok(getObjectPanelEvents().some((entry) => entry.type === "ObjectPanelGatewayRequested"));
});

test("object selection change creates new immutable request", () => {
  const workspace = createWorkspace("Object Panel Selection Change Workspace");
  const first = requestObjectPanelIntelligence({
    workspace: workspace.workspaceId,
    selectedObjectId: "obj_a",
  });
  const second = requestObjectPanelIntelligence({
    workspace: workspace.workspaceId,
    selectedObjectId: "obj_b",
  });

  assert.equal(first.selectionChanged, false);
  assert.equal(second.selectionChanged, true);
  assert.notEqual(first.request.objectPanelRequestId, second.request.objectPanelRequestId);
  assert.ok(getObjectPanelSelectionChangeCounter() >= 1);
  assert.ok(getObjectPanelEvents().some((entry) => entry.type === "ObjectPanelSelectionChanged"));
});

test("object panel supports past, now, and future time context", () => {
  const workspace = createWorkspace("Object Panel Time Workspace");
  const past = requestObjectPanelIntelligence({
    workspace: workspace.workspaceId,
    selectedObjectId: "obj_a",
    executiveTime: {
      timeState: "past",
      timelinePosition: { index: 0, label: "Completed", reserved: false },
    },
  });
  const future = requestObjectPanelIntelligence({
    workspace: workspace.workspaceId,
    selectedObjectId: "obj_a",
    executiveTime: { timeState: "future" },
  });

  assert.equal(past.request.executiveTimeContext?.timeState, "past");
  assert.equal(future.request.executiveTimeContext?.timeState, "future");
});

test("object panel direct DS imports are forbidden", () => {
  const violation = assertPresentationMayNotImportDsEngine({
    consumer: "object_panel",
    importSpecifier: "../workspace/workspaceObjectIntelligenceContract.ts",
  });
  assert.ok(violation);
});

test("certification verifies object panel intelligence architecture", () => {
  const workspace = createWorkspace("Object Panel Certification Workspace");
  seedWorkspace(workspace.workspaceId);

  const beforeKpi = window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY);
  const beforeRegistry = window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY);
  const beforeScenes = window.localStorage.getItem("nexora.workspaceScenes.v1");

  const result = runObjectPanelIntelligenceCertification({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
    alternateObjectId: "obj_inventory",
    buildPassed: true,
  });

  assert.equal(result.certified, true);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY), beforeKpi);
  assert.equal(window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY), beforeRegistry);
  assert.equal(window.localStorage.getItem("nexora.workspaceScenes.v1"), beforeScenes);
  assert.ok(getObjectPanelDiagnosticsLog().length > 0);
  assert.ok(getObjectPanelRegistryState().currentSelectedObjectId === "obj_inventory");
});
