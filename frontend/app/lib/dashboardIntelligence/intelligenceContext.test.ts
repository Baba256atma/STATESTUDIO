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
  buildIntelligenceContext,
  resetIntelligenceContextBuilderForTests,
  updateIntelligenceContext,
} from "./intelligenceContextBuilder.ts";
import { runIntelligenceContextCertification } from "./intelligenceContextCertification.ts";
import {
  INTELLIGENCE_CONTEXT_RESERVED_EXTENSIONS,
  INTELLIGENCE_CONTEXT_TAGS,
  INTELLIGENCE_CONTEXT_VERSION,
  NEXORA_INTELLIGENCE_CONTEXT_LOG_PREFIX,
} from "./intelligenceContextContract.ts";
import {
  getIntelligenceContextDiagnosticsLog,
  getIntelligenceContextEvents,
  resetIntelligenceContextDiagnosticsForTests,
} from "./intelligenceContextDiagnostics.ts";
import {
  requestIntelligenceWithContext,
  restoreIntelligenceContextFromSnapshot,
} from "./intelligenceContextGateway.ts";
import {
  getCurrentIntelligenceContext,
  getIntelligenceContextChangeCounter,
  getIntelligenceContextRegistryState,
  resetIntelligenceContextRegistryForTests,
} from "./intelligenceContextRegistry.ts";
import {
  getIntelligenceContextSnapshots,
  resetIntelligenceContextSnapshotsForTests,
} from "./intelligenceContextSnapshot.ts";
import {
  isIntelligenceContextVersionCompatible,
  validateIntelligenceContextInput,
} from "./intelligenceContextValidator.ts";
import { resetSingleIntelligenceSourceGatewayForTests } from "./singleIntelligenceSourceGateway.ts";
import { resetExecutiveTimeContextBuilderForTests } from "./executiveTimeContextBuilder.ts";
import { resetExecutiveTimeContextDiagnosticsForTests } from "./executiveTimeContextDiagnostics.ts";
import { resetExecutiveTimeContextRegistryForTests } from "./executiveTimeContextRegistry.ts";

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

test("exports INT-1.2 intelligence context tags and version", () => {
  assert.equal(NEXORA_INTELLIGENCE_CONTEXT_LOG_PREFIX, "[NexoraIntelligenceContext]");
  assert.equal(INTELLIGENCE_CONTEXT_VERSION, "INT-1.2");
  assert.ok(INTELLIGENCE_CONTEXT_TAGS.includes("[INT12_COMPLETE]"));
  assert.ok(INTELLIGENCE_CONTEXT_RESERVED_EXTENSIONS.includes("executive_timeline"));
});

test("buildIntelligenceContext creates immutable unified context", () => {
  const workspace = createWorkspace("Context Builder Workspace");
  const built = buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "executive_summary",
    dashboardMode: "executive_summary",
    selectedObject: "obj_forecast",
    selectedScenario: "scenario_a",
    selectedKpi: "kpi_forecast",
    selectedRisk: "risk_inventory",
    selectedDataSource: "ds_csv",
    selectedRelationship: "rel_1",
    timelinePosition: { index: 2, label: "Step 2", reserved: false },
    selectionPath: Object.freeze(["workspace", "obj_forecast"]),
    filters: Object.freeze({ severity: "critical" }),
    viewMode: "focus",
    futureExtension: Object.freeze({ war_room: "reserved" }),
  });

  assert.equal(built.success, true);
  assert.ok(built.context);
  assert.equal(Object.isFrozen(built.context), true);
  assert.equal(Object.isFrozen(built.context!.selectionPath), true);
  assert.equal(built.context!.workspace, workspace.workspaceId);
  assert.equal(built.context!.consumer, "dashboard");
  assert.ok(built.context!.requestId.startsWith("intel_req_"));
});

test("context validator rejects selection without workspace", () => {
  const validation = validateIntelligenceContextInput({
    consumer: "dashboard",
    selectedObject: "obj_forecast",
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.code === "selection_without_workspace"));
});

test("context registry tracks current, previous, and change counter", () => {
  const workspace = createWorkspace("Context Registry Workspace");
  buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "kpis",
    dashboardMode: "kpis",
  });
  const first = getCurrentIntelligenceContext();
  buildIntelligenceContext({
    consumer: "assistant",
    workspace: workspace.workspaceId,
    panel: "operational",
    dashboardMode: "operational",
  });
  const registry = getIntelligenceContextRegistryState();
  assert.ok(registry.previousContext);
  assert.equal(registry.previousContext?.contextId, first?.contextId);
  assert.ok(getIntelligenceContextChangeCounter() >= 2);
});

test("context snapshots and restore work in memory only", () => {
  const workspace = createWorkspace("Context Snapshot Workspace");
  buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "risk",
    dashboardMode: "risk",
  });
  const snapshot = getIntelligenceContextSnapshots().at(-1);
  assert.ok(snapshot);

  buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "scenario",
    dashboardMode: "scenario",
  });

  const restored = restoreIntelligenceContextFromSnapshot(snapshot!.snapshotId);
  assert.ok(restored);
  assert.equal(getCurrentIntelligenceContext()?.panel, "risk");
  assert.ok(getIntelligenceContextEvents().some((entry) => entry.type === "ContextRestored"));
});

test("requestIntelligenceWithContext routes through unified context and gateway", () => {
  const workspace = createWorkspace("Context Gateway Workspace");
  seedWorkspace(workspace.workspaceId);

  const result = requestIntelligenceWithContext({
    consumer: "dashboard",
    workspace: workspace.workspaceId,
    panel: "executive_summary",
    dashboardMode: "executive_summary",
  });

  assert.equal(result.build.success, true);
  assert.ok(result.gateway);
  assert.ok("runtimeResponse" in result.gateway!);
  assert.ok(getIntelligenceContextDiagnosticsLog().length > 0);
});

test("prepared consumers use unified context for intelligence requests", () => {
  const workspace = createWorkspace("Prepared Context Workspace");

  for (const consumer of ["assistant", "object_panel", "executive_summary"] as const) {
    const result = requestIntelligenceWithContext({
      consumer,
      workspace: workspace.workspaceId,
      panel: consumer === "executive_summary" ? "executive_summary" : "objects",
      dashboardMode: consumer === "executive_summary" ? "executive_summary" : "objects",
    });
    assert.equal(result.build.success, true, `${consumer} should build context`);
  }
});

test("updateIntelligenceContext preserves immutability of prior context", () => {
  const workspace = createWorkspace("Context Update Workspace");
  const initial = buildIntelligenceContext({
    consumer: "object_panel",
    workspace: workspace.workspaceId,
    panel: "objects",
    dashboardMode: "objects",
    selectedObject: "obj_a",
  });
  assert.ok(initial.context);
  const frozenId = initial.context!.contextId;

  const updated = updateIntelligenceContext(initial.context!, {
    consumer: "object_panel",
    selectedObject: "obj_b",
  });
  assert.equal(updated.success, true);
  assert.notEqual(updated.context?.contextId, frozenId);
  assert.equal(initial.context!.selectedObject, "obj_a");
});

test("context version compatibility is enforced", () => {
  assert.equal(isIntelligenceContextVersionCompatible("INT-1.2"), true);
  assert.equal(isIntelligenceContextVersionCompatible("INT-1.1"), false);
});

test("certification verifies unified intelligence context architecture", () => {
  const workspace = createWorkspace("Context Certification Workspace");
  seedWorkspace(workspace.workspaceId);

  const beforeKpi = window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY);
  const beforeRegistry = window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY);

  const result = runIntelligenceContextCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
  });

  assert.equal(result.certified, true);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY), beforeKpi);
  assert.equal(window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY), beforeRegistry);
});
