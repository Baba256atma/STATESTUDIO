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
import {
  getIntelligenceConsumerDiagnostics,
  resetIntelligenceConsumerDiagnosticsForTests,
} from "./consumerDiagnosticsContract.ts";
import {
  FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES,
  assertPresentationMayNotImportDsEngine,
  resetDirectAccessProtectionForTests,
} from "./directAccessProtectionContract.ts";
import {
  getActiveIntelligenceConsumers,
  getIntelligenceConsumer,
  getPreparedIntelligenceConsumers,
  getReservedIntelligenceConsumers,
  resetIntelligenceConsumerRegistryForTests,
} from "./intelligenceConsumerRegistry.ts";
import { resetDashboardIntelligenceRuntimeForTests } from "./dashboardIntelligenceRuntime.ts";
import { resetDashboardIntelligenceRegistryForTests } from "./dashboardIntelligenceRegistry.ts";
import { resetDashboardIntelligenceDiagnosticsForTests } from "./dashboardIntelligenceDiagnostics.ts";
import { resetDashboardIntelligenceSessionForTests } from "./dashboardIntelligenceSession.ts";
import {
  RUNTIME_OWNERSHIP_CONTRACT,
  RUNTIME_OWNED_CAPABILITIES,
} from "./runtimeOwnershipContract.ts";
import {
  RUNTIME_ACCESS_POLICY_RULE,
  enforcePresentationImportPolicy,
  evaluateRuntimeAccessPolicy,
  isDirectDsImportForbidden,
} from "./runtimeAccessPolicy.ts";
import { runSingleIntelligenceSourceCertification } from "./singleIntelligenceSourceCertification.ts";
import {
  ACTIVE_INTELLIGENCE_CONSUMER_IDS,
  NEXORA_SINGLE_INTELLIGENCE_SOURCE_LOG_PREFIX,
  SINGLE_INTELLIGENCE_SOURCE_TAGS,
} from "./singleIntelligenceSourceContract.ts";
import {
  buildIntelligenceGatewayRequest,
  refreshIntelligence,
  requestIntelligence,
  resetSingleIntelligenceSourceGatewayForTests,
} from "./singleIntelligenceSourceGateway.ts";

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

test("exports INT-1.1 single source tags", () => {
  assert.equal(NEXORA_SINGLE_INTELLIGENCE_SOURCE_LOG_PREFIX, "[NexoraSingleIntelligenceSource]");
  assert.ok(SINGLE_INTELLIGENCE_SOURCE_TAGS.includes("[INT11_COMPLETE]"));
  assert.ok(SINGLE_INTELLIGENCE_SOURCE_TAGS.includes("[NO_DIRECT_DS_ACCESS]"));
});

test("registers active, prepared, and reserved intelligence consumers", () => {
  assert.equal(getActiveIntelligenceConsumers().length, 1);
  assert.equal(getPreparedIntelligenceConsumers().length, 3);
  assert.ok(getReservedIntelligenceConsumers().length >= 5);
  assert.ok(getIntelligenceConsumer("dashboard")?.lifecycle === "active");
  assert.ok(getIntelligenceConsumer("assistant")?.lifecycle === "prepared");
  assert.ok(ACTIVE_INTELLIGENCE_CONSUMER_IDS.includes("dashboard"));
});

test("runtime ownership contract assigns capabilities correctly", () => {
  assert.ok(RUNTIME_OWNED_CAPABILITIES.includes("routing"));
  assert.ok(RUNTIME_OWNED_CAPABILITIES.includes("normalization"));
  assert.ok(RUNTIME_OWNED_CAPABILITIES.includes("single_intelligence_gateway"));
  assert.ok(RUNTIME_OWNERSHIP_CONTRACT.presentationOwns.includes("rendering"));
  assert.match(RUNTIME_OWNERSHIP_CONTRACT.rule, /single source/i);
});

test("access policy rejects reserved consumers and forbidden imports", () => {
  const reserved = evaluateRuntimeAccessPolicy({
    consumer: "war_room",
    panel: "operational",
    mode: "operational",
  });
  assert.equal(reserved.allowed, false);
  assert.equal(reserved.reason, "consumer_not_prepared");

  const importDecision = enforcePresentationImportPolicy({
    consumer: "assistant",
    importSpecifier: "../kpi/workspaceKpiContract.ts",
  });
  assert.equal(importDecision.allowed, false);
  assert.equal(importDecision.reason, "direct_access_forbidden");
  assert.ok(isDirectDsImportForbidden("../scenario/workspaceScenarioInsightEngine.ts"));
  assert.ok(FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES.length >= 10);
});

test("gateway request includes consumer identity fields", () => {
  const request = buildIntelligenceGatewayRequest({
    consumer: "dashboard",
    panel: "risk",
    workspaceId: "workspace_a",
    context: { contextLabel: "overview" },
    selection: { objectId: "obj_forecast" },
  });

  assert.equal(request.consumer, "dashboard");
  assert.equal(request.panel, "risk");
  assert.equal(request.workspaceId, "workspace_a");
  assert.equal(request.selection.objectId, "obj_forecast");
  assert.ok(request.requestId.startsWith("intel_req_"));
  assert.ok(request.timestamp);
});

test("requestIntelligence routes dashboard consumer through runtime gateway", () => {
  const workspace = createWorkspace("Gateway Dashboard Workspace");
  seedWorkspace(workspace.workspaceId);

  const result = requestIntelligence(
    buildIntelligenceGatewayRequest({
      consumer: "dashboard",
      panel: "executive_summary",
      workspaceId: workspace.workspaceId,
    })
  );

  assert.ok("runtimeResponse" in result);
  assert.equal(result.consumer, "dashboard");
  assert.equal(result.runtimeResponse.panel, "executive_summary");
  assert.ok(result.runtimeResponse.snapshot?.payload.summary);

  const diagnostics = getIntelligenceConsumerDiagnostics();
  assert.ok(diagnostics.some((entry) => entry.consumer === "dashboard"));
});

test("prepared consumers can request allowed intelligence modes", () => {
  const workspace = createWorkspace("Prepared Consumer Workspace");

  for (const consumer of ["assistant", "object_panel", "executive_summary"] as const) {
    const result = requestIntelligence(
      buildIntelligenceGatewayRequest({
        consumer,
        panel: consumer === "executive_summary" ? "executive_summary" : "objects",
        workspaceId: workspace.workspaceId,
      })
    );
    assert.ok("runtimeResponse" in result, `${consumer} should receive runtime response`);
  }
});

test("refreshIntelligence coordinates consumer refresh through runtime", () => {
  const workspace = createWorkspace("Gateway Refresh Workspace");
  const result = refreshIntelligence({
    consumer: "dashboard",
    panel: "kpis",
    workspaceId: workspace.workspaceId,
    trigger: "manual",
  });

  assert.ok("runtimeResponse" in result);
  assert.equal(result.runtimeResponse.panel, "kpis");
});

test("direct access protection records rejected presentation imports", () => {
  const violation = assertPresentationMayNotImportDsEngine({
    consumer: "object_panel",
    importSpecifier: "../risk/riskDashboardIntegrationRuntime.ts",
  });
  assert.ok(violation);
  assert.match(violation.reason, /gateway/i);
});

test("certification verifies single source architecture lock", () => {
  const workspace = createWorkspace("Single Source Certification Workspace");
  seedWorkspace(workspace.workspaceId);

  const beforeKpi = window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY);
  const beforeRegistry = window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY);

  const result = runSingleIntelligenceSourceCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
  });

  assert.equal(result.certified, true);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.match(RUNTIME_ACCESS_POLICY_RULE, /No exceptions/);
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY), beforeKpi);
  assert.equal(window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY), beforeRegistry);
});
