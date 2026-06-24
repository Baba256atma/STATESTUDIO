import assert from "node:assert/strict";
import test from "node:test";

import {
  attachExecutiveSummaryIntelligenceFeed,
  attachWorkspaceRiskDashboardSummary,
} from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import { attachOperationalIntelligenceFeed } from "../dashboard/operationalIntelligence/operationalIntelligenceFeedBridge.ts";
import { aggregateOperationalIntelligence } from "../dashboard/operationalIntelligence/operationalIntelligenceAggregation.ts";
import {
  WORKSPACE_KPI_STORAGE_KEY,
} from "../kpi/workspaceKpiContract.ts";
import { WORKSPACE_KPI_PROFILE_STORAGE_KEY } from "../kpi/workspaceKpiCalculationEngine.ts";
import { WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY } from "../kpi/workspaceKpiHealthEngine.ts";
import {
  WORKSPACE_KEY_RESULT_STORAGE_KEY,
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
} from "../okr/workspaceOkrContract.ts";
import { resetWorkspaceObjectIntelligenceStoreForTests } from "../workspace/workspaceObjectIntelligenceContract.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import { resetWorkspaceRelationshipCreationStoreForTests } from "../workspace/workspaceRelationshipCreationContract.ts";
import { resetWorkspaceScenesForTests } from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
import { resetWorkspaceKpiStoreForTests } from "../kpi/workspaceKpiContract.ts";
import { resetWorkspaceOkrStoreForTests } from "../okr/workspaceOkrContract.ts";
import {
  WORKSPACE_DETECTED_RISK_STORAGE_KEY,
  WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  resetWorkspaceDetectedRiskMemoryForTests,
  resetWorkspaceDetectedRiskStoreForTests,
  type WorkspaceDetectedRisk,
} from "./workspaceRiskDetectionEngine.ts";
import {
  WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE,
  WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY,
  resetWorkspaceRiskSeverityProfileMemoryForTests,
  resetWorkspaceRiskSeverityProfileStoreForTests,
  type WorkspaceRiskSeverityProfile,
} from "./workspaceRiskSeverityEngine.ts";
import {
  WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY,
  bindRiskToObject,
  resetWorkspaceRiskObjectBindingStoreForTests,
} from "./workspaceRiskObjectBinding.ts";
import { resetWorkspaceRiskStoreForTests } from "./workspaceRiskContract.ts";
import {
  NEXORA_RISK_DASHBOARD_LOG_PREFIX,
  WORKSPACE_RISK_DASHBOARD_INTEGRATION_TAGS,
  getDashboardCriticalRisks,
  getDashboardExposedObjects,
  getDashboardHighRisks,
  getDashboardRiskSummary,
} from "./riskDashboardIntegrationRuntime.ts";

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
  resetWorkspaceRiskObjectBindingStoreForTests();
  resetWorkspaceRiskSeverityProfileStoreForTests();
  resetWorkspaceDetectedRiskStoreForTests();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceOkrStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function seedObjectProfiles(
  workspaceId: string,
  objects: readonly { objectId: string; objectName: string; objectType: string }[]
): void {
  const store = {
    [workspaceId]: Object.fromEntries(
      objects.map((object) => [
        object.objectId,
        {
          contractVersion: "DS-3:1",
          objectId: object.objectId,
          workspaceId,
          objectName: object.objectName,
          objectType: object.objectType,
          originCandidateId: null,
          originWorkspaceObjectId: null,
          relationshipCount: 0,
          incomingRelationshipCount: 0,
          outgoingRelationshipCount: 0,
          connectedObjectCount: 0,
          intelligenceStatus: "ready",
          createdAt: "2026-06-24T00:00:00.000Z",
          updatedAt: "2026-06-24T00:00:00.000Z",
          source: "ds-3:1-foundation",
        },
      ])
    ),
  };
  window.localStorage.setItem(
    "nexora.workspaceObjectIntelligenceProfiles.v1",
    JSON.stringify(store)
  );
}

function buildDetectedRisk(input: {
  workspaceId: string;
  detectionId: string;
  riskId: string;
  title: string;
  detectedAt?: string;
}): WorkspaceDetectedRisk {
  return Object.freeze({
    detectionId: input.detectionId,
    workspaceId: input.workspaceId,
    riskId: input.riskId,
    title: input.title,
    description: "Test detected risk.",
    riskSource: "combined",
    detectionReason: "Test detection reason.",
    confidence: 0.95,
    detectedAt: input.detectedAt ?? "2026-06-24T00:00:00.000Z",
    source: WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  });
}

function seedDetectedRisks(
  workspaceId: string,
  risks: readonly WorkspaceDetectedRisk[]
): void {
  const store = {
    [workspaceId]: Object.fromEntries(risks.map((risk) => [risk.detectionId, risk])),
  };
  window.localStorage.setItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY, JSON.stringify(store));
  resetWorkspaceDetectedRiskMemoryForTests();
}

function buildSeverityProfile(input: {
  workspaceId: string;
  detectionId: string;
  riskId: string;
  severityScore: number;
  severityLevel: WorkspaceRiskSeverityProfile["severityLevel"];
  priority: WorkspaceRiskSeverityProfile["priority"];
  evaluatedAt: string;
}): WorkspaceRiskSeverityProfile {
  return Object.freeze({
    contractVersion: "DS-6:3",
    workspaceId: input.workspaceId,
    detectionId: input.detectionId,
    riskId: input.riskId,
    severityScore: input.severityScore,
    severityLevel: input.severityLevel,
    priority: input.priority,
    severityReason: "Test severity profile.",
    evaluatedAt: input.evaluatedAt,
    source: WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE,
  });
}

function seedSeverityProfiles(
  workspaceId: string,
  profiles: readonly WorkspaceRiskSeverityProfile[]
): void {
  const store = {
    [workspaceId]: Object.fromEntries(profiles.map((profile) => [profile.riskId, profile])),
  };
  window.localStorage.setItem(WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY, JSON.stringify(store));
  resetWorkspaceRiskSeverityProfileMemoryForTests();
}

function seedManualWalkthroughRisks(workspaceId: string): void {
  seedObjectProfiles(workspaceId, [
    { objectId: "obj_forecast_1", objectName: "Forecast", objectType: "forecast" },
    { objectId: "obj_sales_1", objectName: "Sales", objectType: "sales" },
    { objectId: "obj_warehouse_1", objectName: "Warehouse", objectType: "warehouse" },
  ]);

  const forecastRisk = buildDetectedRisk({
    workspaceId,
    detectionId: "detect_forecast_failure",
    riskId: "risk_forecast_failure",
    title: "Forecast Failure Risk",
    detectedAt: "2026-06-24T10:00:00.000Z",
  });
  const growthRisk = buildDetectedRisk({
    workspaceId,
    detectionId: "detect_growth_execution",
    riskId: "risk_growth_execution",
    title: "Growth Execution Risk",
    detectedAt: "2026-06-24T11:00:00.000Z",
  });
  const supplyRisk = buildDetectedRisk({
    workspaceId,
    detectionId: "detect_supply_chain",
    riskId: "risk_supply_chain",
    title: "Supply Chain Risk",
    detectedAt: "2026-06-24T12:00:00.000Z",
  });
  seedDetectedRisks(workspaceId, [forecastRisk, growthRisk, supplyRisk]);

  seedSeverityProfiles(workspaceId, [
    buildSeverityProfile({
      workspaceId,
      detectionId: forecastRisk.detectionId,
      riskId: forecastRisk.riskId,
      severityScore: 100,
      severityLevel: "critical",
      priority: "p1",
      evaluatedAt: "2026-06-24T10:00:00.000Z",
    }),
    buildSeverityProfile({
      workspaceId,
      detectionId: growthRisk.detectionId,
      riskId: growthRisk.riskId,
      severityScore: 80,
      severityLevel: "high",
      priority: "p2",
      evaluatedAt: "2026-06-24T11:00:00.000Z",
    }),
    buildSeverityProfile({
      workspaceId,
      detectionId: supplyRisk.detectionId,
      riskId: supplyRisk.riskId,
      severityScore: 65,
      severityLevel: "medium",
      priority: "p3",
      evaluatedAt: "2026-06-24T12:00:00.000Z",
    }),
  ]);

  bindRiskToObject(workspaceId, forecastRisk.riskId, "obj_forecast_1");
  bindRiskToObject(workspaceId, growthRisk.riskId, "obj_sales_1");
  bindRiskToObject(workspaceId, supplyRisk.riskId, "obj_warehouse_1");
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-6:6 risk dashboard tags and diagnostic prefix", () => {
  assert.equal(NEXORA_RISK_DASHBOARD_LOG_PREFIX, "[NexoraRiskDashboard]");
  assert.deepEqual(WORKSPACE_RISK_DASHBOARD_INTEGRATION_TAGS, [
    "[DS66_RISK_DASHBOARD_INTEGRATION]",
    "[RISK_VISIBLE_IN_DASHBOARD]",
    "[EXECUTIVE_SUMMARY_EXTENDED]",
    "[RISK_EXPOSURE_VISIBLE]",
    "[DS67_READY]",
    "[DS_6_6_COMPLETE]",
  ]);
});

test("returns empty dashboard risk summary when no risks exist", () => {
  const workspace = createWorkspace("Empty Risk Dashboard Workspace");

  const summary = getDashboardRiskSummary(workspace.workspaceId);
  assert.equal(summary.totalRisks, 0);
  assert.equal(summary.criticalCount, 0);
  assert.equal(summary.overallRiskScore, 0);
  assert.equal(summary.highestPriorityRiskId, null);
  assert.equal(summary.mostExposedObjectId, null);
});

test("aggregates manual walkthrough risk dashboard summary", () => {
  const workspace = createWorkspace("Risk Dashboard Workspace");
  seedManualWalkthroughRisks(workspace.workspaceId);

  const summary = getDashboardRiskSummary(workspace.workspaceId);
  assert.equal(summary.totalRisks, 3);
  assert.equal(summary.criticalCount, 1);
  assert.equal(summary.highCount, 1);
  assert.equal(summary.mediumCount, 1);
  assert.equal(summary.lowCount, 0);
  assert.equal(summary.overallRiskScore, 82);
  assert.equal(summary.highestPriorityRiskId, "risk_forecast_failure");
  assert.equal(summary.highestPriorityRiskTitle, "Forecast Failure Risk");
  assert.equal(summary.mostExposedObjectId, "obj_forecast_1");
  assert.equal(summary.mostExposedObjectName, "Forecast");
});

test("aggregates single risk dashboard summary", () => {
  const workspace = createWorkspace("Single Risk Dashboard Workspace");
  const detected = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_single",
    riskId: "risk_single",
    title: "Forecast Failure Risk",
  });
  seedDetectedRisks(workspace.workspaceId, [detected]);
  seedSeverityProfiles(workspace.workspaceId, [
    buildSeverityProfile({
      workspaceId: workspace.workspaceId,
      detectionId: detected.detectionId,
      riskId: detected.riskId,
      severityScore: 100,
      severityLevel: "critical",
      priority: "p1",
      evaluatedAt: "2026-06-24T10:00:00.000Z",
    }),
  ]);

  const summary = getDashboardRiskSummary(workspace.workspaceId);
  assert.equal(summary.totalRisks, 1);
  assert.equal(summary.criticalCount, 1);
  assert.equal(summary.overallRiskScore, 100);
  assert.equal(summary.highestPriorityRiskTitle, "Forecast Failure Risk");
});

test("lists critical and high risks for dashboard", () => {
  const workspace = createWorkspace("Risk Dashboard Lists Workspace");
  seedManualWalkthroughRisks(workspace.workspaceId);

  const critical = getDashboardCriticalRisks(workspace.workspaceId);
  const high = getDashboardHighRisks(workspace.workspaceId);

  assert.equal(critical.length, 1);
  assert.equal(critical[0]?.riskTitle, "Forecast Failure Risk");
  assert.equal(critical[0]?.severityScore, 100);
  assert.equal(high.length, 1);
  assert.equal(high[0]?.riskTitle, "Growth Execution Risk");
});

test("selects highest priority risk by severity score and evaluatedAt tie-break", () => {
  const workspace = createWorkspace("Highest Priority Risk Workspace");
  const older = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_older",
    riskId: "risk_older",
    title: "Older Critical",
  });
  const newer = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_newer",
    riskId: "risk_newer",
    title: "Newer Critical",
  });
  seedDetectedRisks(workspace.workspaceId, [older, newer]);
  seedSeverityProfiles(workspace.workspaceId, [
    buildSeverityProfile({
      workspaceId: workspace.workspaceId,
      detectionId: older.detectionId,
      riskId: older.riskId,
      severityScore: 100,
      severityLevel: "critical",
      priority: "p1",
      evaluatedAt: "2026-06-24T09:00:00.000Z",
    }),
    buildSeverityProfile({
      workspaceId: workspace.workspaceId,
      detectionId: newer.detectionId,
      riskId: newer.riskId,
      severityScore: 100,
      severityLevel: "critical",
      priority: "p1",
      evaluatedAt: "2026-06-24T12:00:00.000Z",
    }),
  ]);

  const summary = getDashboardRiskSummary(workspace.workspaceId);
  assert.equal(summary.highestPriorityRiskId, newer.riskId);
  assert.equal(summary.highestPriorityRiskTitle, "Newer Critical");
});

test("selects most exposed object by binding count and combined risk score tie-break", () => {
  const workspace = createWorkspace("Most Exposed Object Workspace");
  seedObjectProfiles(workspace.workspaceId, [
    { objectId: "obj_a", objectName: "Object A", objectType: "forecast" },
    { objectId: "obj_b", objectName: "Object B", objectType: "sales" },
  ]);

  const riskA = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_a",
    riskId: "risk_a",
    title: "Risk A",
  });
  const riskB = buildDetectedRisk({
    workspaceId: workspace.workspaceId,
    detectionId: "detect_b",
    riskId: "risk_b",
    title: "Risk B",
  });
  seedDetectedRisks(workspace.workspaceId, [riskA, riskB]);
  seedSeverityProfiles(workspace.workspaceId, [
    buildSeverityProfile({
      workspaceId: workspace.workspaceId,
      detectionId: riskA.detectionId,
      riskId: riskA.riskId,
      severityScore: 50,
      severityLevel: "low",
      priority: "p4",
      evaluatedAt: "2026-06-24T10:00:00.000Z",
    }),
    buildSeverityProfile({
      workspaceId: workspace.workspaceId,
      detectionId: riskB.detectionId,
      riskId: riskB.riskId,
      severityScore: 90,
      severityLevel: "high",
      priority: "p2",
      evaluatedAt: "2026-06-24T11:00:00.000Z",
    }),
  ]);

  bindRiskToObject(workspace.workspaceId, riskA.riskId, "obj_a");
  bindRiskToObject(workspace.workspaceId, riskB.riskId, "obj_a");
  bindRiskToObject(workspace.workspaceId, riskB.riskId, "obj_b");

  const summary = getDashboardRiskSummary(workspace.workspaceId);
  assert.equal(summary.mostExposedObjectId, "obj_a");
  assert.equal(summary.mostExposedObjectName, "Object A");

  const exposed = getDashboardExposedObjects(workspace.workspaceId);
  assert.equal(exposed[0]?.objectId, "obj_a");
  assert.equal(exposed[0]?.bindingCount, 2);
  assert.equal(exposed[0]?.combinedRiskScore, 140);
});

test("preserves workspace isolation for dashboard risk summary", () => {
  const workspaceA = createWorkspace("Dashboard Risk Workspace A");
  const workspaceB = createWorkspace("Dashboard Risk Workspace B");
  seedManualWalkthroughRisks(workspaceA.workspaceId);

  const isolated = getDashboardRiskSummary(workspaceB.workspaceId);
  assert.equal(isolated.totalRisks, 0);
  assert.equal(getDashboardCriticalRisks(workspaceB.workspaceId).length, 0);
});

test("reloads dashboard risk summary from persisted storage", () => {
  const workspace = createWorkspace("Dashboard Risk Persistence Workspace");
  seedManualWalkthroughRisks(workspace.workspaceId);

  const before = getDashboardRiskSummary(workspace.workspaceId);
  resetWorkspaceDetectedRiskMemoryForTests();
  resetWorkspaceRiskSeverityProfileMemoryForTests();

  const reloaded = getDashboardRiskSummary(workspace.workspaceId);
  assert.equal(reloaded.totalRisks, before.totalRisks);
  assert.equal(reloaded.criticalCount, before.criticalCount);
  assert.equal(reloaded.highestPriorityRiskTitle, before.highestPriorityRiskTitle);
  assert.equal(reloaded.mostExposedObjectName, before.mostExposedObjectName);
});

test("extends executive summary with workspace risk dashboard summary", () => {
  const workspace = createWorkspace("Executive Summary Risk Workspace");
  seedManualWalkthroughRisks(workspace.workspaceId);

  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const enriched = attachWorkspaceRiskDashboardSummary(baseModel);
  const riskCard = enriched.cards.find((card) => card.title === "Risk Intelligence");

  assert.ok(riskCard);
  assert.equal(riskCard.kind, "active_objects");
  assert.equal(riskCard.primaryValue, "Total Risks: 3");
  assert.match(riskCard.secondaryValue, /Critical: 1/);
  assert.match(riskCard.secondaryValue, /High: 1/);
  assert.match(riskCard.secondaryValue, /Overall Risk Score: 82/);
  assert.match(riskCard.secondaryValue, /Highest Priority Risk: Forecast Failure Risk/);
  assert.match(riskCard.secondaryValue, /Most Exposed Object: Forecast/);
});

test("attachExecutiveSummaryIntelligenceFeed keeps workspace risk summary when feed is empty", () => {
  const workspace = createWorkspace("Executive Summary Feed Risk Workspace");
  seedManualWalkthroughRisks(workspace.workspaceId);

  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const enriched = attachExecutiveSummaryIntelligenceFeed(baseModel);
  const riskCard = enriched.cards.find((card) => card.title === "Risk Intelligence");

  assert.equal(riskCard?.primaryValue, "Total Risks: 3");
});

test("extends operational dashboard with workspace risk signals", () => {
  const workspace = createWorkspace("Operational Risk Workspace");
  seedManualWalkthroughRisks(workspace.workspaceId);

  const baseModel = aggregateOperationalIntelligence({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const sceneJson = {
    scene: {
      objects: [{ id: "obj-1", label: "Test", type: "forecast" }],
      relationships: [],
      kpis: [],
    },
  };
  const enriched = attachOperationalIntelligenceFeed(baseModel, { sceneJson });

  assert.match(enriched.snapshot.signals.recentSummary, /Top Critical Risks: Forecast Failure Risk/);
  assert.match(enriched.snapshot.signals.recentSummary, /Top Exposed Objects: Forecast/);
  assert.match(enriched.snapshot.signals.recentSummary, /Top Emerging Risks: Growth Execution Risk/);
});

test("does not mutate risk, KPI, OKR, or scene storage during dashboard aggregation", () => {
  const workspace = createWorkspace("Dashboard Risk Safety Workspace");
  seedManualWalkthroughRisks(workspace.workspaceId);

  const before = {
    detected: window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY),
    severity: window.localStorage.getItem(WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY),
    bindings: window.localStorage.getItem(WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY),
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    kpiProfiles: window.localStorage.getItem(WORKSPACE_KPI_PROFILE_STORAGE_KEY),
    kpiHealth: window.localStorage.getItem(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY),
    objectives: window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY),
    keyResults: window.localStorage.getItem(WORKSPACE_KEY_RESULT_STORAGE_KEY),
  };

  getDashboardRiskSummary(workspace.workspaceId);
  getDashboardCriticalRisks(workspace.workspaceId);
  getDashboardHighRisks(workspace.workspaceId);
  getDashboardExposedObjects(workspace.workspaceId);
  attachExecutiveSummaryIntelligenceFeed(
    aggregateExecutiveSummary({
      dashboardContext: "overview",
      normalizedContext: null,
    })
  );
  attachOperationalIntelligenceFeed(
    aggregateOperationalIntelligence({
      dashboardContext: "overview",
      normalizedContext: null,
    }),
    {
      sceneJson: {
        scene: {
          objects: [{ id: "obj-1", label: "Test", type: "forecast" }],
          relationships: [],
          kpis: [],
        },
      },
    }
  );

  assert.equal(window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY), before.detected);
  assert.equal(
    window.localStorage.getItem(WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY),
    before.severity
  );
  assert.equal(
    window.localStorage.getItem(WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY),
    before.bindings
  );
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_PROFILE_STORAGE_KEY), before.kpiProfiles);
  assert.equal(
    window.localStorage.getItem(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY),
    before.kpiHealth
  );
  assert.equal(window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY), before.objectives);
  assert.equal(window.localStorage.getItem(WORKSPACE_KEY_RESULT_STORAGE_KEY), before.keyResults);
});
