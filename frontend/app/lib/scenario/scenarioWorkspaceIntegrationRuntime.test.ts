import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  attachExecutiveSummaryIntelligenceFeed,
  attachWorkspaceScenarioDashboardSummary,
} from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import {
  WORKSPACE_KPI_STORAGE_KEY,
  resetWorkspaceKpiStoreForTests,
} from "../kpi/workspaceKpiContract.ts";
import {
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
  resetWorkspaceOkrStoreForTests,
} from "../okr/workspaceOkrContract.ts";
import {
  WORKSPACE_DETECTED_RISK_STORAGE_KEY,
  resetWorkspaceDetectedRiskStoreForTests,
} from "../risk/workspaceRiskDetectionEngine.ts";
import { resetWorkspaceRiskObjectBindingStoreForTests } from "../risk/workspaceRiskObjectBinding.ts";
import { resetWorkspaceRiskSeverityProfileStoreForTests } from "../risk/workspaceRiskSeverityEngine.ts";
import { resetWorkspaceRiskStoreForTests } from "../risk/workspaceRiskContract.ts";
import { resetWorkspaceObjectIntelligenceStoreForTests } from "../workspace/workspaceObjectIntelligenceContract.ts";
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
  WORKSPACE_SCENARIO_STORAGE_KEY,
  createWorkspaceScenario,
  resetWorkspaceScenarioStoreForTests,
} from "./workspaceScenarioContract.ts";
import {
  generateWorkspaceScenarioInsight,
  resetWorkspaceScenarioInsightStoreForTests,
} from "./workspaceScenarioInsightEngine.ts";
import {
  createWorkspaceScenarioAssumption,
  resetWorkspaceScenarioSimulationStoreForTests,
  runWorkspaceScenarioSimulation,
} from "./workspaceScenarioSimulationEngine.ts";
import {
  resetWorkspaceScenarioComparisonStoreForTests,
  generateWorkspaceScenarioComparison,
} from "./workspaceScenarioComparisonEngine.ts";
import {
  NEXORA_SCENARIO_WORKSPACE_LOG_PREFIX,
  WORKSPACE_SCENARIO_PANEL_TAGS,
  WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_TAGS,
  formatWorkspaceScenarioSummaryPrimary,
  formatWorkspaceScenarioSummarySecondary,
  getWorkspaceScenarioWorkspaceSummary,
  resolveObjectScenarioSummaryState,
} from "./scenarioWorkspaceIntegrationRuntime.ts";

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";

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
  resetWorkspaceScenarioComparisonStoreForTests();
  resetWorkspaceScenarioSimulationStoreForTests();
  resetWorkspaceScenarioInsightStoreForTests();
  resetWorkspaceScenarioStoreForTests();
  resetWorkspaceRiskObjectBindingStoreForTests();
  resetWorkspaceRiskSeverityProfileStoreForTests();
  resetWorkspaceDetectedRiskStoreForTests();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceOkrStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceObjectIntelligenceStoreForTests();
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function seedObjectProfile(input: {
  workspaceId: string;
  objectId: string;
  objectName: string;
  objectType?: string;
}): void {
  window.localStorage.setItem(
    OBJECT_INTELLIGENCE_STORAGE_KEY,
    JSON.stringify({
      [input.workspaceId]: {
        [input.objectId]: {
          contractVersion: "DS-3:1",
          objectId: input.objectId,
          workspaceId: input.workspaceId,
          objectName: input.objectName,
          objectType: input.objectType ?? "forecast",
          originCandidateId: null,
          originWorkspaceObjectId: null,
          relationshipCount: 2,
          incomingRelationshipCount: 1,
          outgoingRelationshipCount: 1,
          connectedObjectCount: 2,
          intelligenceStatus: "ready",
          createdAt: "2026-06-24T00:00:00.000Z",
          updatedAt: "2026-06-24T00:00:00.000Z",
          source: "ds-3:1-foundation",
        },
      },
    })
  );
}

function snapshotProtectedStorage(): Record<string, string | null> {
  return Object.fromEntries(
    [
      WORKSPACE_SCENARIO_STORAGE_KEY,
      WORKSPACE_KPI_STORAGE_KEY,
      WORKSPACE_OBJECTIVE_STORAGE_KEY,
      WORKSPACE_DETECTED_RISK_STORAGE_KEY,
      OBJECT_INTELLIGENCE_STORAGE_KEY,
    ].map((key) => [key, window.localStorage.getItem(key)])
  );
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-7:5 scenario workspace integration tags", () => {
  assert.equal(NEXORA_SCENARIO_WORKSPACE_LOG_PREFIX, "[NexoraScenarioWorkspace]");
  assert.deepEqual(WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_TAGS, [
    "[DS75_SCENARIO_WORKSPACE_INTEGRATION]",
    "[SCENARIO_VISIBLE_IN_WORKSPACE]",
    "[EXECUTIVE_SUMMARY_EXTENDED]",
    "[OBJECT_PANEL_EXTENDED]",
    "[NO_NEW_UI_CREATED]",
    "[DS76_READY]",
    "[DS_7_5_COMPLETE]",
  ]);
  assert.ok(WORKSPACE_SCENARIO_PANEL_TAGS.includes("[DS75_SCENARIO_PANEL]"));
});

test("returns empty workspace summary when no scenarios exist", () => {
  const workspace = createWorkspace("No Scenario Workspace");
  const summary = getWorkspaceScenarioWorkspaceSummary(workspace.workspaceId);
  assert.equal(summary.totalScenarios, 0);
  assert.equal(summary.activeCount, 0);
  assert.equal(summary.timelineStatus, "reserved");
});

test("aggregates one scenario with insight and simulation", () => {
  const workspace = createWorkspace("Single Scenario Workspace");
  seedObjectProfile({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
    objectName: "Forecast",
  });

  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    description: "Improve forecast accuracy.",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight(workspace.workspaceId, scenario.scenario?.scenarioId ?? "");
  runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
    assumptions: [
      createWorkspaceScenarioAssumption({
        label: "Demand",
        assumptionType: "percentage",
        value: 20,
      })!,
    ],
  });

  const summary = getWorkspaceScenarioWorkspaceSummary(workspace.workspaceId);
  assert.equal(summary.totalScenarios, 1);
  assert.equal(summary.activeCount, 1);
  assert.equal(summary.activeScenarioName, "Forecast Improvement");
  assert.equal(summary.latestSimulationScenarioName, "Forecast Improvement");
  assert.equal(summary.latestSimulationStatus, "Completed");
  assert.ok(summary.latestInsightSummary);
});

test("aggregates multiple scenarios with latest comparison", () => {
  const workspace = createWorkspace("Multiple Scenario Workspace");
  const scenarioA = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Demand-Led Growth",
    scenarioType: "optimistic",
    status: "active",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Marketing-Led Growth",
    scenarioType: "realistic",
    status: "draft",
  });

  generateWorkspaceScenarioInsight(workspace.workspaceId, scenarioA.scenario?.scenarioId ?? "");
  generateWorkspaceScenarioInsight(workspace.workspaceId, scenarioB.scenario?.scenarioId ?? "");

  runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenarioA.scenario?.scenarioId ?? "",
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 })!,
    ],
  });
  runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenarioB.scenario?.scenarioId ?? "",
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Marketing", assumptionType: "percentage", value: 30 })!,
    ],
  });
  generateWorkspaceScenarioComparison({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  const summary = getWorkspaceScenarioWorkspaceSummary(workspace.workspaceId);
  assert.equal(summary.totalScenarios, 2);
  assert.equal(summary.activeCount, 1);
  assert.equal(summary.draftCount, 1);
  assert.ok(summary.latestComparisonSummary);
  assert.match(formatWorkspaceScenarioSummaryPrimary(summary), /Scenarios: 2/);
  assert.match(formatWorkspaceScenarioSummarySecondary(summary), /Active: 1/);
  assert.match(formatWorkspaceScenarioSummarySecondary(summary), /Draft: 1/);
});

test("resolves object scenario summary for related scenarios", () => {
  const workspace = createWorkspace("Object Scenario Workspace");
  seedObjectProfile({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
    objectName: "Forecast",
  });

  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    description: "Improve forecasting performance.",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight(workspace.workspaceId, scenario.scenario?.scenarioId ?? "");
  runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 })!,
    ],
  });

  const summary = resolveObjectScenarioSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
  });

  assert.equal(summary.visible, true);
  assert.equal(summary.relatedScenarioCount, 1);
  assert.equal(summary.items[0]?.scenarioName, "Forecast Improvement");
  assert.equal(summary.items[0]?.simulationStatus, "Completed");
  assert.equal(summary.timelineStatus, "reserved");
});

test("shows empty object scenario summary when object has no related scenarios", () => {
  const workspace = createWorkspace("Unrelated Object Workspace");
  seedObjectProfile({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
    objectName: "Forecast",
  });
  createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Unrelated Scenario",
    description: "Warehouse optimization only.",
    scenarioType: "baseline",
  });

  const summary = resolveObjectScenarioSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
  });

  assert.equal(summary.emptyMessage, "No scenarios linked to this object.");
  assert.equal(summary.items.length, 0);
});

test("extends executive summary when scenarios exist and hides when none", () => {
  const workspace = createWorkspace("Executive Summary Scenario Workspace");
  createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
    status: "active",
  });

  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });

  const enriched = attachWorkspaceScenarioDashboardSummary(baseModel);
  const card = enriched.cards.find((item) => item.kind === "executive_attention");
  assert.ok(card);
  assert.equal(card?.title, "Scenario Intelligence");
  assert.match(card?.primaryValue ?? "", /Scenarios: 1/);
  assert.match(card?.secondaryValue ?? "", /Active: 1/);

  const emptyWorkspace = createWorkspace("Empty Scenario Workspace");
  const emptyModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });
  const unchanged = attachWorkspaceScenarioDashboardSummary(emptyModel);
  assert.deepEqual(
    unchanged.cards.find((item) => item.kind === "executive_attention"),
    emptyModel.cards.find((item) => item.kind === "executive_attention")
  );
});

test("chains scenario summary through executive summary intelligence feed", () => {
  const workspace = createWorkspace("Feed Scenario Workspace");
  createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
    status: "active",
  });

  const baseModel = aggregateExecutiveSummary({
    dashboardContext: "overview",
    normalizedContext: null,
  });

  const enriched = attachExecutiveSummaryIntelligenceFeed(baseModel);
  const card = enriched.cards.find((item) => item.kind === "executive_attention");
  assert.equal(card?.title, "Scenario Intelligence");
});

test("preserves workspace isolation", () => {
  const workspaceA = createWorkspace("Scenario Workspace A");
  createWorkspaceScenario({
    workspaceId: workspaceA.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
    status: "active",
  });

  const summary = getWorkspaceScenarioWorkspaceSummary("workspace_b_missing");
  assert.equal(summary.totalScenarios, 0);
});

test("does not mutate scenario, KPI, OKR, risk, or scene storage during integration reads", () => {
  const workspace = createWorkspace("Integration Safety Workspace");
  seedObjectProfile({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
    objectName: "Forecast",
  });
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight(workspace.workspaceId, scenario.scenario?.scenarioId ?? "");

  const before = snapshotProtectedStorage();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  getWorkspaceScenarioWorkspaceSummary(workspace.workspaceId);
  resolveObjectScenarioSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: "obj_forecast",
  });

  assert.deepEqual(snapshotProtectedStorage(), before);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});

test("extends existing object panel after risk summary without creating a new panel", () => {
  const panelSource = readFileSync(
    new URL("../../components/panels/object-panel/WorkspaceObjectIntelligencePanel.tsx", import.meta.url),
    "utf8"
  );
  const actionPanelSource = readFileSync(
    new URL("../../components/panels/ExecutiveActionPanel.tsx", import.meta.url),
    "utf8"
  );

  assert.match(panelSource, /ScenarioSummarySection/);
  assert.match(panelSource, /RiskSummarySection/);
  assert.ok(panelSource.indexOf("RiskSummarySection") < panelSource.indexOf("ScenarioSummarySection"));
  assert.match(actionPanelSource, /WorkspaceObjectIntelligencePanel/);
  assert.doesNotMatch(actionPanelSource, /ScenarioPanel/);
});
