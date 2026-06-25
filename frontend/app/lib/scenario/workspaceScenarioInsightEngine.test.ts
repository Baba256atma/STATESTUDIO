import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { resetWorkspaceObjectCreationStoreForTests } from "../workspace/workspaceObjectCreationPipeline.ts";
import {
  resetWorkspaceRelationshipCreationStoreForTests,
  type WorkspaceRelationship,
} from "../workspace/workspaceRelationshipCreationContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import { resetWorkspaceSceneSyncForTests } from "../workspace/workspaceSceneSync.ts";
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
import {
  createWorkspaceKeyResult,
  createWorkspaceObjective,
  resetWorkspaceOkrStoreForTests,
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
} from "../okr/workspaceOkrContract.ts";
import {
  calculateWorkspaceOkrProgress,
  resetWorkspaceOkrProgressProfileStoreForTests,
} from "../okr/workspaceOkrProgressEngine.ts";
import {
  evaluateWorkspaceOkrHealth,
  resetWorkspaceOkrHealthProfileStoreForTests,
} from "../okr/workspaceOkrHealthEngine.ts";
import {
  WORKSPACE_DETECTED_RISK_STORAGE_KEY,
  WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  detectWorkspaceRisks,
  resetWorkspaceDetectedRiskStoreForTests,
  type WorkspaceDetectedRisk,
} from "../risk/workspaceRiskDetectionEngine.ts";
import {
  resetWorkspaceRiskSeverityProfileStoreForTests,
  evaluateWorkspaceRiskSeverity,
} from "../risk/workspaceRiskSeverityEngine.ts";
import {
  bindRiskToObject,
  resetWorkspaceRiskObjectBindingStoreForTests,
} from "../risk/workspaceRiskObjectBinding.ts";
import { resetWorkspaceRiskStoreForTests } from "../risk/workspaceRiskContract.ts";
import {
  WORKSPACE_SCENARIO_STORAGE_KEY,
  createWorkspaceScenario,
  resetWorkspaceScenarioStoreForTests,
} from "./workspaceScenarioContract.ts";
import {
  NEXORA_SCENARIO_INSIGHT_LOG_PREFIX,
  WORKSPACE_SCENARIO_INSIGHT_ENGINE_SOURCE,
  WORKSPACE_SCENARIO_INSIGHT_ENGINE_TAGS,
  WORKSPACE_SCENARIO_INSIGHT_READ_APIS,
  WORKSPACE_SCENARIO_INSIGHT_STORAGE_KEY,
  generateWorkspaceScenarioInsight,
  getWorkspaceScenarioInsight,
  getWorkspaceScenarioInsights,
  resetWorkspaceScenarioInsightMemoryForTests,
  resetWorkspaceScenarioInsightStoreForTests,
} from "./workspaceScenarioInsightEngine.ts";

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

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
  resetWorkspaceScenarioInsightStoreForTests();
  resetWorkspaceScenarioStoreForTests();
  resetWorkspaceRiskObjectBindingStoreForTests();
  resetWorkspaceRiskSeverityProfileStoreForTests();
  resetWorkspaceDetectedRiskStoreForTests();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceOkrHealthProfileStoreForTests();
  resetWorkspaceOkrProgressProfileStoreForTests();
  resetWorkspaceOkrStoreForTests();
  resetWorkspaceKpiHealthProfileStoreForTests();
  resetWorkspaceKpiProfileStoreForTests();
  resetWorkspaceKpiStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRegistryForTests();
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
          relationshipCount: 2,
          incomingRelationshipCount: 1,
          outgoingRelationshipCount: 1,
          connectedObjectCount: 2,
          intelligenceStatus: "ready",
          createdAt: "2026-06-24T00:00:00.000Z",
          updatedAt: "2026-06-24T00:00:00.000Z",
          source: "ds-3:1-foundation",
        },
      ])
    ),
  };
  window.localStorage.setItem(OBJECT_INTELLIGENCE_STORAGE_KEY, JSON.stringify(store));
}

function seedRelationships(
  workspaceId: string,
  relationships: readonly WorkspaceRelationship[]
): void {
  window.localStorage.setItem(
    RELATIONSHIP_STORAGE_KEY,
    JSON.stringify({
      [workspaceId]: Object.fromEntries(
        relationships.map((relationship) => [relationship.relationshipId, relationship])
      ),
    })
  );
}

function buildRelationship(input: {
  workspaceId: string;
  relationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
}): WorkspaceRelationship {
  return Object.freeze({
    contractVersion: "DS-2:4",
    relationshipId: input.relationshipId,
    workspaceId: input.workspaceId,
    sourceObjectId: input.sourceObjectId,
    targetObjectId: input.targetObjectId,
    relationshipType: input.relationshipType,
    relationshipCategory: "dependency",
    relationshipStrength: "strong",
    confidence: 0.9,
    createdAt: "2026-06-24T00:00:00.000Z",
    originCandidateRelationshipId: input.relationshipId,
    source: "ds-2:4-creation",
  });
}

function seedCriticalKpiHealth(workspaceId: string, name: string): void {
  createWorkspaceKpi({
    workspaceId,
    name,
    unit: "score",
    targetValue: 100,
    currentValue: 50,
  });
  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);
}

function seedCriticalOkrHealth(workspaceId: string, title: string): void {
  const objective = createWorkspaceObjective({ workspaceId, title });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: objective.objective?.objectiveId ?? "",
    title: "Accuracy Target",
    targetValue: 100,
    currentValue: 40,
    unit: "score",
  });
  calculateWorkspaceOkrProgress(workspaceId);
  evaluateWorkspaceOkrHealth(workspaceId);
}

function seedManualWalkthroughIntelligence(workspaceId: string): void {
  seedObjectProfiles(workspaceId, [
    { objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" },
    { objectId: "obj_planning", objectName: "Planning", objectType: "planning" },
    { objectId: "obj_analytics", objectName: "Analytics", objectType: "analytics" },
  ]);
  seedRelationships(workspaceId, [
    buildRelationship({
      workspaceId,
      relationshipId: "rel_forecast_planning",
      sourceObjectId: "obj_forecast",
      targetObjectId: "obj_planning",
      relationshipType: "supports",
    }),
    buildRelationship({
      workspaceId,
      relationshipId: "rel_forecast_analytics",
      sourceObjectId: "obj_forecast",
      targetObjectId: "obj_analytics",
      relationshipType: "feeds",
    }),
  ]);

  seedCriticalKpiHealth(workspaceId, "Forecast Accuracy");
  seedCriticalKpiHealth(workspaceId, "Forecast");
  seedCriticalOkrHealth(workspaceId, "Improve Forecasting");

  detectWorkspaceRisks(workspaceId);
  evaluateWorkspaceRiskSeverity(workspaceId);

  const detectedRaw = window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY);
  const detectedStore = detectedRaw
    ? (JSON.parse(detectedRaw) as Record<string, Record<string, WorkspaceDetectedRisk>>)
    : {};
  const forecastRisk = Object.values(detectedStore[workspaceId] ?? {}).find((risk) =>
    risk.title.includes("Forecast Failure")
  );
  assert.ok(forecastRisk);
  bindRiskToObject(workspaceId, forecastRisk.riskId, "obj_forecast");
}

function snapshotProtectedStorage(): Record<string, string | null> {
  return Object.fromEntries(
    [
      WORKSPACE_SCENARIO_STORAGE_KEY,
      WORKSPACE_KPI_STORAGE_KEY,
      WORKSPACE_OBJECTIVE_STORAGE_KEY,
      WORKSPACE_DETECTED_RISK_STORAGE_KEY,
      OBJECT_INTELLIGENCE_STORAGE_KEY,
      RELATIONSHIP_STORAGE_KEY,
    ].map((key) => [key, window.localStorage.getItem(key)])
  );
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-7:2 scenario insight engine tags and storage key", () => {
  assert.equal(NEXORA_SCENARIO_INSIGHT_LOG_PREFIX, "[NexoraScenarioInsight]");
  assert.equal(WORKSPACE_SCENARIO_INSIGHT_STORAGE_KEY, "nexora.workspaceScenarioInsights.v1");
  assert.deepEqual(WORKSPACE_SCENARIO_INSIGHT_READ_APIS, [
    "getWorkspaceScenario",
    "getObjectIntelligenceProfiles",
    "getWorkspaceRelationships",
    "getWorkspaceKpiHealthProfiles",
    "getWorkspaceKpis",
    "getWorkspaceOkrHealthProfiles",
    "getWorkspaceObjective",
    "getWorkspaceRiskSeverityProfiles",
    "getDetectedWorkspaceRisks",
    "getRiskObjectBindings",
  ]);
  assert.deepEqual(WORKSPACE_SCENARIO_INSIGHT_ENGINE_TAGS, [
    "[DS72_SCENARIO_INSIGHT_ENGINE]",
    "[SCENARIO_EXECUTIVE_INSIGHT_READY]",
    "[SCENARIO_UNDERSTANDING_READY]",
    "[DS73_READY]",
    "[DS_7_2_COMPLETE]",
  ]);
});

test("generates manual walkthrough forecast improvement insight", () => {
  const workspace = createWorkspace("Scenario Insight Workspace");
  seedManualWalkthroughIntelligence(workspace.workspaceId);

  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    description: "Improve forecasting performance across planning and analytics.",
    scenarioType: "realistic",
    status: "active",
  });
  assert.equal(scenario.success, true);

  const result = generateWorkspaceScenarioInsight(
    workspace.workspaceId,
    scenario.scenario?.scenarioId ?? ""
  );
  assert.equal(result.success, true);
  assert.equal(result.generated, true);
  assert.equal(result.insight?.source, WORKSPACE_SCENARIO_INSIGHT_ENGINE_SOURCE);
  assert.equal(
    result.insight?.executiveSummary,
    "Forecasting performance is the primary business focus."
  );

  const objectNames = result.insight?.affectedObjects.map((item) => item.label) ?? [];
  assert.ok(objectNames.includes("Forecast"));
  assert.ok(objectNames.includes("Planning"));
  assert.ok(objectNames.includes("Analytics"));

  assert.ok(result.insight?.relatedKpis.some((item) => item.label === "Forecast Accuracy"));
  assert.ok(result.insight?.relatedOkrs.some((item) => item.label.includes("Improve Forecasting")));
  assert.ok(
    result.insight?.relatedRisks.some((item) => item.label.includes("Forecast Failure Risk"))
  );
  assert.ok(result.insight?.attentionObjects.some((item) => item.label === "Forecast"));
  assert.match(result.insight?.insightReason ?? "", /forecasting operations/i);
  assert.match(result.insight?.insightReason ?? "", /forecast accuracy/i);
});

test("persists and reloads scenario insight with workspace isolation", () => {
  const workspaceA = createWorkspace("Scenario Insight Workspace A");
  const workspaceB = createWorkspace("Scenario Insight Workspace B");
  seedManualWalkthroughIntelligence(workspaceA.workspaceId);

  const scenario = createWorkspaceScenario({
    workspaceId: workspaceA.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
  });

  generateWorkspaceScenarioInsight(workspaceA.workspaceId, scenario.scenario?.scenarioId ?? "");
  assert.ok(window.localStorage.getItem(WORKSPACE_SCENARIO_INSIGHT_STORAGE_KEY));

  resetWorkspaceScenarioInsightMemoryForTests();
  const reloaded = getWorkspaceScenarioInsight(
    workspaceA.workspaceId,
    scenario.scenario?.scenarioId ?? ""
  );
  assert.ok(reloaded);
  assert.equal(reloaded.executiveSummary, "Forecasting performance is the primary business focus.");
  assert.equal(getWorkspaceScenarioInsights(workspaceB.workspaceId).length, 0);
});

test("generates empty intelligence insight for scenario without linked data", () => {
  const workspace = createWorkspace("Empty Scenario Insight Workspace");
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Baseline",
    scenarioType: "baseline",
  });

  const result = generateWorkspaceScenarioInsight(
    workspace.workspaceId,
    scenario.scenario?.scenarioId ?? ""
  );
  assert.equal(result.success, true);
  assert.equal(result.insight?.relatedKpis.length, 0);
  assert.equal(result.insight?.relatedOkrs.length, 0);
  assert.equal(result.insight?.relatedRisks.length, 0);
  assert.equal(result.insight?.affectedObjects.length, 0);
});

test("returns scenario_not_found for missing scenario", () => {
  const workspace = createWorkspace("Missing Scenario Insight Workspace");
  const result = generateWorkspaceScenarioInsight(workspace.workspaceId, "missing_scenario");
  assert.equal(result.success, false);
  assert.equal(result.reason, "scenario_not_found");
});

test("does not mutate scenario, KPI, OKR, risk, object, or relationship storage", () => {
  const workspace = createWorkspace("Scenario Insight Safety Workspace");
  seedManualWalkthroughIntelligence(workspace.workspaceId);
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
  });

  const before = snapshotProtectedStorage();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  generateWorkspaceScenarioInsight(workspace.workspaceId, scenario.scenario?.scenarioId ?? "");
  getWorkspaceScenarioInsights(workspace.workspaceId);

  assert.deepEqual(snapshotProtectedStorage(), before);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});
