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
  EXECUTIVE_SUMMARY_CONSUMER,
  EXECUTIVE_SUMMARY_INTELLIGENCE_TAGS,
  EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
  EXECUTIVE_SUMMARY_SECTIONS,
  NEXORA_EXECUTIVE_SUMMARY_LOG_PREFIX,
} from "./executiveSummaryIntelligenceContract.ts";
import { runExecutiveSummaryIntelligenceCertification } from "./executiveSummaryIntelligenceCertification.ts";
import { adaptExecutiveSummaryContext } from "./executiveSummaryContextAdapter.ts";
import {
  getExecutiveSummaryDiagnosticsLog,
  getExecutiveSummaryEvents,
  resetExecutiveSummaryDiagnosticsForTests,
} from "./executiveSummaryDiagnostics.ts";
import {
  buildExecutiveSummaryIntelligenceRequest,
  resetExecutiveSummaryRequestBuilderForTests,
} from "./executiveSummaryRequestBuilder.ts";
import { requestExecutiveSummaryIntelligence } from "./executiveSummaryRuntimeAdapter.ts";
import {
  getExecutiveSummaryChangeCounter,
  getExecutiveSummaryRegistryState,
  resetExecutiveSummaryRegistryForTests,
} from "./executiveSummaryRegistry.ts";

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
  resetExecutiveSummaryRequestBuilderForTests();
  resetExecutiveSummaryRegistryForTests();
  resetExecutiveSummaryDiagnosticsForTests();
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

test("exports INT-3 executive summary tags and version", () => {
  assert.equal(NEXORA_EXECUTIVE_SUMMARY_LOG_PREFIX, "[NexoraExecutiveSummaryIntelligence]");
  assert.equal(EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION, "INT-3");
  assert.equal(EXECUTIVE_SUMMARY_CONSUMER, "executive_summary");
  assert.ok(EXECUTIVE_SUMMARY_INTELLIGENCE_TAGS.includes("[INT3_COMPLETE]"));
  assert.equal(EXECUTIVE_SUMMARY_SECTIONS.length, 9);
});

test("buildExecutiveSummaryIntelligenceRequest creates immutable request", () => {
  const workspace = createWorkspace("Executive Summary Request Workspace");
  const built = buildExecutiveSummaryIntelligenceRequest({
    workspace: workspace.workspaceId,
    executiveTime: { timeState: "now" },
  });

  assert.equal(built.success, true);
  assert.ok(built.request);
  assert.equal(Object.isFrozen(built.request), true);
  assert.equal(built.request!.consumer, "executive_summary");
  assert.equal(built.request!.panel, "executive_summary");
  assert.ok(built.request!.intelligenceContext);
  assert.ok(built.request!.executiveTimeContext);
});

test("context adapter reads platform context without local copies", () => {
  const workspace = createWorkspace("Executive Summary Context Workspace");
  buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "kpis",
    dashboardMode: "kpis",
    selectedKpi: "kpi_a",
  });

  const adapted = adaptExecutiveSummaryContext({ useCurrentContext: true });
  assert.equal(adapted.intelligenceContextInput.consumer, "executive_summary");
  assert.equal(adapted.intelligenceContextInput.workspace, workspace.workspaceId);
  assert.equal(adapted.intelligenceContextInput.selectedKpi, "kpi_a");
});

test("requestExecutiveSummaryIntelligence routes through executive intelligence platform", () => {
  const workspace = createWorkspace("Executive Summary Runtime Workspace");
  seedWorkspace(workspace.workspaceId);

  const result = requestExecutiveSummaryIntelligence({
    workspace: workspace.workspaceId,
    executiveTime: { timeState: "now" },
  });

  assert.equal(result.request.consumer, "executive_summary");
  assert.equal(result.gatewaySuccess, true);
  assert.equal(result.response.success, true);
  assert.ok(result.response.headline.length > 0);
  assert.ok(result.response.sections.length === EXECUTIVE_SUMMARY_SECTIONS.length);
  assert.ok("confidence" in result.response);
  assert.ok(getExecutiveSummaryEvents().some((entry) => entry.type === "ExecutiveSummaryGatewayRequested"));
});

test("executive summary response includes all supported sections", () => {
  const workspace = createWorkspace("Executive Summary Sections Workspace");
  seedWorkspace(workspace.workspaceId);

  const result = requestExecutiveSummaryIntelligence({
    workspace: workspace.workspaceId,
    executiveTime: { timeState: "past", requestedTime: "last quarter" },
  });

  const sectionIds = result.response.sections.map((entry) => entry.sectionId);
  for (const sectionId of EXECUTIVE_SUMMARY_SECTIONS) {
    assert.ok(sectionIds.includes(sectionId), `Missing section ${sectionId}`);
  }
  assert.equal(result.request.executiveTimeContext?.timeState, "past");
});

test("executive summary registry tracks current and previous requests", () => {
  const workspace = createWorkspace("Executive Summary Registry Workspace");
  requestExecutiveSummaryIntelligence({ workspace: workspace.workspaceId });
  const first = getExecutiveSummaryRegistryState().currentRequest;
  requestExecutiveSummaryIntelligence({
    workspace: workspace.workspaceId,
    executiveTime: { timeState: "future" },
  });
  const registry = getExecutiveSummaryRegistryState();
  assert.ok(registry.previousRequest);
  assert.equal(registry.previousRequest?.summaryRequestId, first?.summaryRequestId);
  assert.ok(getExecutiveSummaryChangeCounter() >= 2);
});

test("executive summary direct DS imports are forbidden", () => {
  const violation = assertPresentationMayNotImportDsEngine({
    consumer: "executive_summary",
    importSpecifier: "../scenario/workspaceScenarioContract.ts",
  });
  assert.ok(violation);
});

test("certification verifies executive summary intelligence architecture", () => {
  const workspace = createWorkspace("Executive Summary Certification Workspace");
  seedWorkspace(workspace.workspaceId);

  const beforeKpi = window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY);
  const beforeRegistry = window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY);

  const result = runExecutiveSummaryIntelligenceCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
  });

  assert.equal(result.certified, true);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY), beforeKpi);
  assert.equal(window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY), beforeRegistry);
  assert.ok(getExecutiveSummaryDiagnosticsLog().length > 0);
});
