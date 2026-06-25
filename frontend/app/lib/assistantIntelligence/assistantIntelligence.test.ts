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
import {
  ASSISTANT_EXECUTIVE_REQUEST_TYPES,
  ASSISTANT_INTELLIGENCE_CONSUMER,
  ASSISTANT_INTELLIGENCE_TAGS,
  ASSISTANT_INTELLIGENCE_VERSION,
  NEXORA_ASSISTANT_INTELLIGENCE_LOG_PREFIX,
} from "./assistantIntelligenceContract.ts";
import { runAssistantIntelligenceCertification } from "./assistantIntelligenceCertification.ts";
import {
  getAssistantIntelligenceDiagnosticsLog,
  getAssistantIntelligenceEvents,
  resetAssistantIntelligenceDiagnosticsForTests,
} from "./assistantDiagnostics.ts";
import { adaptAssistantContext } from "./assistantContextAdapter.ts";
import {
  buildAssistantIntelligenceRequest,
  inferExecutiveTimeStateFromManagerPhrase,
  resetAssistantRequestBuilderForTests,
} from "./assistantRequestBuilder.ts";
import { requestAssistantIntelligence } from "./assistantRuntimeAdapter.ts";
import {
  getAssistantRuntimeChangeCounter,
  getAssistantRuntimeRegistryState,
  resetAssistantRuntimeRegistryForTests,
} from "./assistantRuntimeRegistry.ts";

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
  resetAssistantRequestBuilderForTests();
  resetAssistantRuntimeRegistryForTests();
  resetAssistantIntelligenceDiagnosticsForTests();
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

test("exports INT-2 assistant intelligence tags and version", () => {
  assert.equal(NEXORA_ASSISTANT_INTELLIGENCE_LOG_PREFIX, "[NexoraAssistantIntelligence]");
  assert.equal(ASSISTANT_INTELLIGENCE_VERSION, "INT-2");
  assert.equal(ASSISTANT_INTELLIGENCE_CONSUMER, "assistant");
  assert.ok(ASSISTANT_INTELLIGENCE_TAGS.includes("[INT2_COMPLETE]"));
  assert.equal(ASSISTANT_EXECUTIVE_REQUEST_TYPES.length, 9);
});

test("inferExecutiveTimeStateFromManagerPhrase maps past, now, and future", () => {
  assert.equal(inferExecutiveTimeStateFromManagerPhrase("Delivery was late"), "past");
  assert.equal(inferExecutiveTimeStateFromManagerPhrase("Delivery is late"), "now");
  assert.equal(inferExecutiveTimeStateFromManagerPhrase("If delivery is late"), "future");
});

test("buildAssistantIntelligenceRequest creates immutable assistant request", () => {
  const workspace = createWorkspace("Assistant Request Workspace");
  const built = buildAssistantIntelligenceRequest({
    requestType: "explain_kpi",
    workspace: workspace.workspaceId,
    managerPhrase: "Explain KPI health",
    conversationId: "conv_1",
  });

  assert.equal(built.success, true);
  assert.ok(built.request);
  assert.equal(Object.isFrozen(built.request), true);
  assert.equal(built.request!.consumer, "assistant");
  assert.equal(built.request!.panel, "kpis");
  assert.ok(built.request!.intelligenceContext);
  assert.ok(built.request!.executiveTimeContext);
});

test("context adapter reads platform context without local copies", () => {
  const workspace = createWorkspace("Assistant Context Adapter Workspace");
  buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "risk",
    dashboardMode: "risk",
    selectedRisk: "risk_a",
  });

  const adapted = adaptAssistantContext({
    requestType: "explain_risk",
    useCurrentContext: true,
  });

  assert.equal(adapted.intelligenceContextInput.consumer, "assistant");
  assert.equal(adapted.intelligenceContextInput.workspace, workspace.workspaceId);
  assert.equal(adapted.intelligenceContextInput.selectedRisk, "risk_a");
  assert.equal(adapted.panel, "risk");
});

test("requestAssistantIntelligence routes through executive intelligence platform", () => {
  const workspace = createWorkspace("Assistant Runtime Workspace");
  seedWorkspace(workspace.workspaceId);

  const result = requestAssistantIntelligence({
    requestType: "explain_executive_summary",
    workspace: workspace.workspaceId,
    managerPhrase: "What is the executive summary?",
    conversationId: "conv_runtime",
  });

  assert.equal(result.request.consumer, "assistant");
  assert.equal(result.gatewaySuccess, true);
  assert.equal(result.response.success, true);
  assert.ok(result.response.summary.length > 0);
  assert.ok("confidence" in result.response);
  assert.ok(result.response.sources.length > 0 || result.response.normalized !== null);
  assert.ok(getAssistantIntelligenceEvents().some((entry) => entry.type === "AssistantGatewayRequested"));
});

test("assistant response builder transforms normalized intelligence only", () => {
  const workspace = createWorkspace("Assistant Response Workspace");
  const runtime = requestAssistantIntelligence({
    requestType: "explain_workspace",
    workspace: workspace.workspaceId,
    managerPhrase: "Explain this workspace",
  });

  assert.ok(runtime.response.explanation.length > 0);
  assert.ok("confidence" in runtime.response);
  assert.equal(runtime.response.source, "int-2-assistant-intelligence");
});

test("assistant runtime registry tracks current and previous requests", () => {
  const workspace = createWorkspace("Assistant Registry Workspace");
  requestAssistantIntelligence({
    requestType: "explain_kpi",
    workspace: workspace.workspaceId,
    conversationId: "conv_a",
  });
  const first = getAssistantRuntimeRegistryState().currentRequest;
  requestAssistantIntelligence({
    requestType: "explain_risk",
    workspace: workspace.workspaceId,
    conversationId: "conv_b",
  });
  const registry = getAssistantRuntimeRegistryState();
  assert.ok(registry.previousRequest);
  assert.equal(registry.previousRequest?.assistantRequestId, first?.assistantRequestId);
  assert.ok(getAssistantRuntimeChangeCounter() >= 2);
});

test("assistant direct DS imports are forbidden", () => {
  const violation = assertPresentationMayNotImportDsEngine({
    consumer: "assistant",
    importSpecifier: "../kpi/workspaceKpiContract.ts",
  });
  assert.ok(violation);
});

test("certification verifies assistant intelligence architecture", () => {
  const workspace = createWorkspace("Assistant Certification Workspace");
  seedWorkspace(workspace.workspaceId);

  const beforeKpi = window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY);
  const beforeRegistry = window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY);

  const result = runAssistantIntelligenceCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
  });

  assert.equal(result.certified, true);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY), beforeKpi);
  assert.equal(window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY), beforeRegistry);
  assert.ok(getAssistantIntelligenceDiagnosticsLog().length > 0);
});
