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
import { resetDashboardIntelligenceDiagnosticsForTests } from "./dashboardIntelligenceDiagnostics.ts";
import { resetDashboardIntelligenceRegistryForTests } from "./dashboardIntelligenceRegistry.ts";
import { resetDashboardIntelligenceRuntimeForTests } from "./dashboardIntelligenceRuntime.ts";
import { resetDashboardIntelligenceSessionForTests } from "./dashboardIntelligenceSession.ts";
import { resetIntelligenceConsumerDiagnosticsForTests } from "./consumerDiagnosticsContract.ts";
import { resetDirectAccessProtectionForTests } from "./directAccessProtectionContract.ts";
import { resetIntelligenceConsumerRegistryForTests } from "./intelligenceConsumerRegistry.ts";
import {
  buildExecutiveTimeContext,
  resetExecutiveTimeContextBuilderForTests,
  updateExecutiveTimeContext,
} from "./executiveTimeContextBuilder.ts";
import { runExecutiveTimeContextCertification } from "./executiveTimeContextCertification.ts";
import {
  EXECUTIVE_TIME_CONTEXT_TAGS,
  EXECUTIVE_TIME_CONTEXT_VERSION,
  EXECUTIVE_TIME_METADATA_KEYS,
  EXECUTIVE_TIME_RESERVED_EXTENSIONS,
  EXECUTIVE_TIME_STATE_MEANINGS,
  NEXORA_EXECUTIVE_TIME_CONTEXT_LOG_PREFIX,
} from "./executiveTimeContextContract.ts";
import {
  getExecutiveTimeContextDiagnosticsLog,
  getExecutiveTimeContextEvents,
  resetExecutiveTimeContextDiagnosticsForTests,
} from "./executiveTimeContextDiagnostics.ts";
import {
  attachExecutiveTimeContextToGatewayRequest,
  executiveTimeContextToMetadata,
} from "./executiveTimeContextGateway.ts";
import {
  getCurrentExecutiveTimeContext,
  getExecutiveTimeContextChangeCounter,
  getExecutiveTimeContextRegistryState,
  resetExecutiveTimeContextRegistryForTests,
} from "./executiveTimeContextRegistry.ts";
import {
  validateExecutiveTimeContext,
  validateExecutiveTimeContextInput,
} from "./executiveTimeContextValidator.ts";
import {
  buildIntelligenceContext,
  resetIntelligenceContextBuilderForTests,
} from "./intelligenceContextBuilder.ts";
import { resetIntelligenceContextDiagnosticsForTests } from "./intelligenceContextDiagnostics.ts";
import { requestIntelligenceWithContext } from "./intelligenceContextGateway.ts";
import {
  resetIntelligenceContextRegistryForTests,
} from "./intelligenceContextRegistry.ts";
import { resetIntelligenceContextSnapshotsForTests } from "./intelligenceContextSnapshot.ts";
import { buildIntelligenceGatewayRequest, resetSingleIntelligenceSourceGatewayForTests } from "./singleIntelligenceSourceGateway.ts";

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

test("exports INT-1.3 executive time context tags and version", () => {
  assert.equal(NEXORA_EXECUTIVE_TIME_CONTEXT_LOG_PREFIX, "[NexoraExecutiveTimeContext]");
  assert.equal(EXECUTIVE_TIME_CONTEXT_VERSION, "INT-1.3");
  assert.ok(EXECUTIVE_TIME_CONTEXT_TAGS.includes("[INT13_COMPLETE]"));
  assert.ok(EXECUTIVE_TIME_RESERVED_EXTENSIONS.includes("planning_horizon"));
  assert.ok(EXECUTIVE_TIME_STATE_MEANINGS.past.includes("historical"));
});

test("buildExecutiveTimeContext supports PAST, NOW, and FUTURE", () => {
  for (const timeState of ["past", "now", "future"] as const) {
    const built = buildExecutiveTimeContext({ timeState });
    assert.equal(built.success, true, `${timeState} should build`);
    assert.equal(built.timeContext?.timeState, timeState);
    assert.equal(Object.isFrozen(built.timeContext), true);
    assert.equal(built.timeContext?.confidence, null);
  }
});

test("time context validator rejects unsupported state and invalid timestamps", () => {
  const invalidState = validateExecutiveTimeContextInput({
    timeState: "yesterday" as "past",
  });
  assert.equal(invalidState.valid, false);

  const invalidTimestamp = validateExecutiveTimeContextInput({
    timeState: "now",
    referenceTimestamp: "not-a-date",
  });
  assert.equal(invalidTimestamp.valid, false);
});

test("time context registry tracks current, previous, and change counter", () => {
  buildExecutiveTimeContext({ timeState: "now" });
  const first = getCurrentExecutiveTimeContext();
  buildExecutiveTimeContext({ timeState: "future" });
  const registry = getExecutiveTimeContextRegistryState();
  assert.ok(registry.previousTimeContext);
  assert.equal(registry.previousTimeContext?.timeContextId, first?.timeContextId);
  assert.ok(getExecutiveTimeContextChangeCounter() >= 2);
});

test("updateExecutiveTimeContext emits change events", () => {
  const initial = buildExecutiveTimeContext({ timeState: "now" });
  assert.ok(initial.timeContext);
  updateExecutiveTimeContext(initial.timeContext, { timeState: "future" });
  const events = getExecutiveTimeContextEvents();
  assert.ok(events.some((entry) => entry.type === "TimeContextUpdated"));
  assert.ok(events.some((entry) => entry.type === "TimeContextChanged"));
});

test("unified intelligence context always includes executive time context", () => {
  const workspace = createWorkspace("Time Context Integration Workspace");
  const built = buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "executive_summary",
    dashboardMode: "executive_summary",
    executiveTime: { timeState: "past", requestedTime: "last quarter" },
  });
  assert.equal(built.success, true);
  assert.equal(built.context?.executiveTimeContext.timeState, "past");
  assert.equal(
    validateExecutiveTimeContext(built.context!.executiveTimeContext).valid,
    true
  );
});

test("gateway attaches executive time metadata for runtime routing", () => {
  const workspace = createWorkspace("Time Gateway Workspace");
  seedWorkspace(workspace.workspaceId);

  const result = requestIntelligenceWithContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "scenario",
    dashboardMode: "scenario",
    executiveTime: { timeState: "future", requestedTime: "what-if" },
  });

  assert.equal(result.build.success, true);
  assert.equal(result.build.context?.executiveTimeContext.timeState, "future");

  const metadata = executiveTimeContextToMetadata(result.build.context!.executiveTimeContext);
  assert.equal(metadata[EXECUTIVE_TIME_METADATA_KEYS.timeState], "future");

  const gatewayRequest = attachExecutiveTimeContextToGatewayRequest(
    buildIntelligenceGatewayRequest({
      consumer: "dashboard",
      panel: "scenario",
      mode: "scenario",
      workspaceId: workspace.workspaceId,
    }),
    result.build.context!.executiveTimeContext
  );
  assert.equal(
    gatewayRequest.context?.metadata?.[EXECUTIVE_TIME_METADATA_KEYS.timeState],
    "future"
  );
  assert.ok(result.gateway);
  assert.ok("runtimeResponse" in result.gateway!);
  assert.ok(getExecutiveTimeContextDiagnosticsLog().length > 0);
});

test("defaults to NOW when executive time is omitted", () => {
  const workspace = createWorkspace("Time Default Workspace");
  const built = buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "kpis",
    dashboardMode: "kpis",
  });
  assert.equal(built.context?.executiveTimeContext.timeState, "now");
});

test("certification verifies executive time context architecture", () => {
  const workspace = createWorkspace("Time Certification Workspace");
  seedWorkspace(workspace.workspaceId);

  const beforeKpi = window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY);
  const beforeRegistry = window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY);

  const result = runExecutiveTimeContextCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
  });

  assert.equal(result.certified, true);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY), beforeKpi);
  assert.equal(window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY), beforeRegistry);
});
