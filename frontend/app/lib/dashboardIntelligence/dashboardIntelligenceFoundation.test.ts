import assert from "node:assert/strict";
import test from "node:test";

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
import { EXECUTIVE_REGISTRY_STORAGE_KEY } from "../executive/executiveIntelligenceRegistry.ts";
import { resetWorkspaceDetectedRiskStoreForTests } from "../risk/workspaceRiskDetectionEngine.ts";
import { resetWorkspaceRiskObjectBindingStoreForTests } from "../risk/workspaceRiskObjectBinding.ts";
import { resetWorkspaceRiskSeverityProfileStoreForTests } from "../risk/workspaceRiskSeverityEngine.ts";
import { resetWorkspaceRiskStoreForTests } from "../risk/workspaceRiskContract.ts";
import {
  WORKSPACE_SCENARIO_STORAGE_KEY,
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
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import { runDashboardIntelligenceCertification } from "./dashboardIntelligenceCertification.ts";
import {
  DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
  DASHBOARD_INTELLIGENCE_MODES,
  NEXORA_DASHBOARD_INTELLIGENCE_LOG_PREFIX,
} from "./dashboardIntelligenceContract.ts";
import {
  buildDashboardIntelligenceCacheKey,
  createInMemoryDashboardIntelligenceCacheStore,
} from "./dashboardIntelligenceCacheContract.ts";
import {
  getDashboardIntelligenceEvents,
  resetDashboardIntelligenceDiagnosticsForTests,
} from "./dashboardIntelligenceDiagnostics.ts";
import {
  getDashboardIntelligencePanelRegistrations,
  getDashboardIntelligenceRegistryState,
  registerDashboardIntelligencePanel,
  resetDashboardIntelligenceRegistryForTests,
  unregisterDashboardIntelligencePanel,
} from "./dashboardIntelligenceRegistry.ts";
import {
  normalizeDashboardIntelligencePayload,
} from "./dashboardIntelligenceNormalization.ts";
import { routeDashboardIntelligenceRequest } from "./dashboardIntelligenceRouter.ts";
import {
  buildDashboardIntelligencePanelContext,
  openDashboardIntelligenceSession,
  resetDashboardIntelligenceSessionForTests,
  updateDashboardIntelligenceSession,
} from "./dashboardIntelligenceSession.ts";
import {
  closeDashboardIntelligence,
  openDashboardIntelligence,
  refreshDashboardIntelligence,
  requestDashboardIntelligence,
  resetDashboardIntelligenceRuntimeForTests,
} from "./dashboardIntelligenceRuntime.ts";

const PROTECTED_STORAGE_KEYS = [
  WORKSPACE_SCENARIO_STORAGE_KEY,
  WORKSPACE_KPI_STORAGE_KEY,
  EXECUTIVE_REGISTRY_STORAGE_KEY,
  "nexora.workspaceScenes.v1",
];

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
  resetDashboardIntelligenceRuntimeForTests();
  resetDashboardIntelligenceRegistryForTests();
  resetDashboardIntelligenceSessionForTests();
  resetDashboardIntelligenceDiagnosticsForTests();
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

function seedWorkspaceDataset(workspaceId: string): void {
  createWorkspaceKpi({
    workspaceId,
    name: "Forecast Accuracy",
    unit: "score",
    targetValue: 100,
    currentValue: 55,
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

test("exports INT-1 foundation tags and modes", () => {
  assert.equal(NEXORA_DASHBOARD_INTELLIGENCE_LOG_PREFIX, "[NexoraDashboardIntelligence]");
  assert.ok(DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS.includes("[INT1_COMPLETE]"));
  assert.equal(DASHBOARD_INTELLIGENCE_MODES.length, 10);
});

test("registers default dashboard intelligence panels", () => {
  const panels = getDashboardIntelligencePanelRegistrations();
  assert.equal(panels.length, 10);
  assert.ok(panels.some((entry) => entry.panel === "executive_summary"));
  assert.ok(panels.some((entry) => entry.panel === "scenario"));
  assert.equal(getDashboardIntelligenceRegistryState().panelCount, 10);
});

test("routes panel requests through certified DS engines", () => {
  const workspace = createWorkspace("Dashboard Intelligence Workspace");
  seedWorkspaceDataset(workspace.workspaceId);

  const context = buildDashboardIntelligencePanelContext({
    panel: "kpis",
    workspaceId: workspace.workspaceId,
  });
  const payload = routeDashboardIntelligenceRequest(context);
  assert.equal(payload.engineId, "ds4_kpi");

  const normalized = normalizeDashboardIntelligencePayload(payload);
  assert.equal(normalized.source, "ds4_kpi");
  assert.equal(normalized.panel, "kpis");
  assert.ok(normalized.metrics.some((entry) => entry.metricId === "total_kpis"));
});

test("requestDashboardIntelligence returns normalized response", () => {
  const workspace = createWorkspace("Dashboard Request Workspace");
  seedWorkspaceDataset(workspace.workspaceId);

  const response = requestDashboardIntelligence({
    panel: "executive_summary",
    workspaceId: workspace.workspaceId,
  });

  assert.equal(response.success, true);
  assert.equal(response.panel, "executive_summary");
  assert.equal(response.engineId, "ds_composite_executive");
  assert.ok(response.snapshot?.payload.summary);
  assert.ok(response.snapshot?.payload.metrics.length > 0);
  assert.equal(response.snapshot?.payload.confidence, null);
});

test("refreshDashboardIntelligence supports workspace and object triggers", () => {
  const workspace = createWorkspace("Dashboard Refresh Workspace");
  openDashboardIntelligenceSession({ workspaceId: workspace.workspaceId, panel: "operational" });

  refreshDashboardIntelligence({
    trigger: "object_selected",
    panel: "objects",
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
    bypassCache: true,
  });

  const session = updateDashboardIntelligenceSession({});
  assert.equal(session.objectId, "obj_forecast");

  const events = getDashboardIntelligenceEvents();
  assert.ok(events.some((entry) => entry.type === "DashboardRefreshRequested"));
  assert.ok(events.some((entry) => entry.type === "DashboardRefreshCompleted"));
});

test("uses in-memory cache contract without persistence", () => {
  const cache = createInMemoryDashboardIntelligenceCacheStore();
  const key = buildDashboardIntelligenceCacheKey({
    panel: "risk",
    workspaceId: "workspace_a",
  });

  assert.equal(cache.size(), 0);
  cache.set(
    Object.freeze({
      key,
      snapshot: Object.freeze({
        panel: "risk",
        engineId: "ds6_risk",
        workspaceId: "workspace_a",
        payload: Object.freeze({
          status: "empty",
          confidence: null,
          summary: "test",
          metrics: Object.freeze([]),
          warnings: Object.freeze([]),
          recommendations: Object.freeze([]),
          timestamp: "2026-06-25T00:00:00.000Z",
          source: "ds6_risk",
          panel: "risk",
        }),
        capturedAt: "2026-06-25T00:00:00.000Z",
      }),
      storedAt: "2026-06-25T00:00:00.000Z",
    })
  );
  assert.equal(cache.size(), 1);
  assert.ok(cache.get(key));
  assert.equal(window.localStorage.getItem("nexora.dashboardIntelligenceCache.v1"), null);
});

test("records dashboard lifecycle events", () => {
  const workspace = createWorkspace("Dashboard Events Workspace");
  openDashboardIntelligence({ workspaceId: workspace.workspaceId, panel: "workspace" });
  requestDashboardIntelligence({ panel: "workspace", workspaceId: workspace.workspaceId });
  closeDashboardIntelligence();

  const events = getDashboardIntelligenceEvents();
  assert.ok(events.some((entry) => entry.type === "DashboardOpened"));
  assert.ok(events.some((entry) => entry.type === "PanelRequested"));
  assert.ok(events.some((entry) => entry.type === "PanelLoaded"));
  assert.ok(events.some((entry) => entry.type === "DashboardClosed"));
});

test("supports custom panel registration and unregistration", () => {
  unregisterDashboardIntelligencePanel("timeline");
  assert.equal(
    getDashboardIntelligencePanelRegistrations().some((entry) => entry.panel === "timeline"),
    false
  );

  registerDashboardIntelligencePanel(
    Object.freeze({
      panel: "timeline",
      mode: "timeline",
      engineId: "reserved_timeline",
      title: "Timeline Intelligence",
      description: "Re-registered timeline panel.",
      enabled: true,
    })
  );
  assert.ok(
    getDashboardIntelligencePanelRegistrations().some((entry) => entry.panel === "timeline")
  );
});

test("certification verifies runtime isolation and no DS mutation", () => {
  const workspace = createWorkspace("Dashboard Certification Workspace");
  seedWorkspaceDataset(workspace.workspaceId);

  const before = Object.fromEntries(
    PROTECTED_STORAGE_KEYS.map((key) => [key, window.localStorage.getItem(key)])
  );
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  const result = runDashboardIntelligenceCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
  });

  assert.equal(result.certified, true);
  assert.ok(result.checks.every((entry) => entry.passed));

  for (const key of PROTECTED_STORAGE_KEYS) {
    assert.equal(window.localStorage.getItem(key), before[key]);
  }
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});

test("timeline panel returns reserved normalized status", () => {
  const workspace = createWorkspace("Timeline Reserved Workspace");
  const response = requestDashboardIntelligence({
    panel: "timeline",
    workspaceId: workspace.workspaceId,
    bypassCache: true,
  });

  assert.equal(response.engineId, "reserved_timeline");
  assert.equal(response.snapshot?.payload.status, "reserved");
});
