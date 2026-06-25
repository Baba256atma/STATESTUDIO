import assert from "node:assert/strict";
import test from "node:test";

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
  resetWorkspaceDetectedRiskStoreForTests,
  type WorkspaceDetectedRisk,
  WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
} from "../risk/workspaceRiskDetectionEngine.ts";
import {
  resetWorkspaceRiskSeverityProfileStoreForTests,
  WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE,
} from "../risk/workspaceRiskSeverityEngine.ts";
import { resetWorkspaceRiskObjectBindingStoreForTests } from "../risk/workspaceRiskObjectBinding.ts";
import { resetWorkspaceRiskStoreForTests } from "../risk/workspaceRiskContract.ts";
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
  NEXORA_SCENARIO_SIMULATION_LOG_PREFIX,
  WORKSPACE_SCENARIO_SIMULATION_ENGINE_SOURCE,
  WORKSPACE_SCENARIO_SIMULATION_ENGINE_TAGS,
  WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY,
  createWorkspaceScenarioAssumption,
  createWorkspaceScenarioOverride,
  getLatestWorkspaceScenarioSimulation,
  getWorkspaceScenarioSimulation,
  getWorkspaceScenarioSimulations,
  resetWorkspaceScenarioSimulationMemoryForTests,
  resetWorkspaceScenarioSimulationSequencesForTests,
  resetWorkspaceScenarioSimulationStoreForTests,
  runWorkspaceScenarioSimulation,
} from "./workspaceScenarioSimulationEngine.ts";

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
  resetWorkspaceScenarioSimulationStoreForTests();
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
  window.localStorage.setItem(
    OBJECT_INTELLIGENCE_STORAGE_KEY,
    JSON.stringify({
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
    })
  );
}

function seedSeverityProfile(input: {
  workspaceId: string;
  riskId: string;
  detectionId: string;
  severityScore: number;
  severityLevel: "medium" | "high" | "critical";
}): void {
  const store = {
    [input.workspaceId]: {
      [input.riskId]: {
        contractVersion: "DS-6:3",
        workspaceId: input.workspaceId,
        detectionId: input.detectionId,
        riskId: input.riskId,
        severityScore: input.severityScore,
        severityLevel: input.severityLevel,
        priority: "p2",
        severityReason: "Test severity profile.",
        evaluatedAt: "2026-06-24T00:00:00.000Z",
        source: WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE,
      },
    },
  };
  window.localStorage.setItem(
    "nexora.workspaceRiskSeverityProfiles.v1",
    JSON.stringify(store)
  );
}

function seedDetectedRisk(
  workspaceId: string,
  risk: WorkspaceDetectedRisk
): void {
  window.localStorage.setItem(
    WORKSPACE_DETECTED_RISK_STORAGE_KEY,
    JSON.stringify({
      [workspaceId]: {
        [risk.detectionId]: risk,
      },
    })
  );
}

function seedSimulationDataset(workspaceId: string): void {
  seedObjectProfiles(workspaceId, [
    { objectId: "obj_forecast", objectName: "Forecast", objectType: "forecast" },
    { objectId: "obj_inventory", objectName: "Inventory", objectType: "inventory" },
  ]);

  createWorkspaceKpi({
    workspaceId,
    name: "Forecast Accuracy",
    unit: "score",
    targetValue: 100,
    currentValue: 50,
  });
  calculateWorkspaceKpis(workspaceId);
  evaluateWorkspaceKpiHealth(workspaceId);

  const salesObjective = createWorkspaceObjective({
    workspaceId,
    title: "Sales Growth",
  });
  createWorkspaceKeyResult({
    workspaceId,
    objectiveId: salesObjective.objective?.objectiveId ?? "",
    title: "Sales Revenue",
    targetValue: 100,
    currentValue: 60,
    unit: "score",
  });
  calculateWorkspaceOkrProgress(workspaceId);
  evaluateWorkspaceOkrHealth(workspaceId);

  seedDetectedRisk(workspaceId, {
    detectionId: "detect_inventory_risk",
    workspaceId,
    riskId: "risk_inventory",
    title: "Inventory Risk",
    description: "Inventory exposure risk.",
    riskSource: "combined",
    detectionReason: "Inventory risk detected.",
    confidence: 0.9,
    detectedAt: "2026-06-24T00:00:00.000Z",
    source: WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
  });
  seedSeverityProfile({
    workspaceId,
    riskId: "risk_inventory",
    detectionId: "detect_inventory_risk",
    severityScore: 65,
    severityLevel: "medium",
  });
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
  resetWorkspaceScenarioSimulationSequencesForTests();
});

test("exports DS-7:3 scenario simulation tags and storage key", () => {
  assert.equal(NEXORA_SCENARIO_SIMULATION_LOG_PREFIX, "[NexoraScenarioSimulation]");
  assert.equal(
    WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY,
    "nexora.workspaceScenarioSimulations.v1"
  );
  assert.deepEqual(WORKSPACE_SCENARIO_SIMULATION_ENGINE_TAGS, [
    "[DS73_SCENARIO_SIMULATION]",
    "[SCENARIO_ASSUMPTIONS_READY]",
    "[SCENARIO_SIMULATION_READY]",
    "[DETERMINISTIC_SIMULATION]",
    "[DS74_READY]",
    "[DS_7_3_COMPLETE]",
  ]);
});

test("creates assumptions and overrides", () => {
  const demand = createWorkspaceScenarioAssumption({
    label: "Demand",
    assumptionType: "percentage",
    value: 20,
    unit: "%",
  });
  const marketing = createWorkspaceScenarioAssumption({
    label: "Marketing Budget",
    assumptionType: "percentage",
    value: -10,
    unit: "%",
  });
  const hiring = createWorkspaceScenarioAssumption({
    label: "Hiring",
    assumptionType: "boolean",
    value: "freeze",
  });

  assert.ok(demand);
  assert.equal(demand?.assumptionType, "percentage");
  assert.ok(marketing);
  assert.equal(marketing?.value, -10);
  assert.ok(hiring);
  assert.equal(hiring?.assumptionType, "boolean");

  const override = createWorkspaceScenarioOverride({
    field: "description",
    value: "Simulated forecast improvement path.",
    targetKind: "scenario",
    targetId: "scenario_1",
  });
  assert.ok(override);
  assert.equal(override?.field, "description");
});

test("runs deterministic manual walkthrough simulation", () => {
  const workspace = createWorkspace("Scenario Simulation Workspace");
  seedSimulationDataset(workspace.workspaceId);

  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    description: "Improve forecast accuracy under demand growth.",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight(workspace.workspaceId, scenario.scenario?.scenarioId ?? "");

  const demand = createWorkspaceScenarioAssumption({
    label: "Demand",
    assumptionType: "percentage",
    value: 20,
    unit: "%",
  });
  const marketing = createWorkspaceScenarioAssumption({
    label: "Marketing",
    assumptionType: "percentage",
    value: 10,
    unit: "%",
  });
  assert.ok(demand);
  assert.ok(marketing);

  const result = runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
    assumptions: [demand!, marketing!],
    overrides: [
      createWorkspaceScenarioOverride({
        field: "description",
        value: "Temporary simulation copy.",
        targetKind: "scenario",
        targetId: scenario.scenario?.scenarioId ?? "",
      })!,
    ],
  });

  assert.equal(result.success, true);
  assert.equal(result.simulation?.simulationStatus, "completed");
  assert.equal(result.simulation?.source, WORKSPACE_SCENARIO_SIMULATION_ENGINE_SOURCE);

  const forecastKpi = result.simulation?.predictedKpiChanges.find((item) =>
    item.label.includes("Forecast")
  );
  assert.ok(forecastKpi);
  assert.equal(forecastKpi.changePercent, 8);

  const inventoryRisk = result.simulation?.predictedRiskChanges.find((item) =>
    item.label.includes("Inventory")
  );
  assert.ok(inventoryRisk);
  assert.equal(inventoryRisk.changePercent, 12);

  const salesOkr = result.simulation?.predictedOkrChanges.find((item) =>
    item.label.includes("Sales")
  );
  assert.ok(salesOkr);
  assert.equal(salesOkr.changePercent, 6);

  assert.match(result.simulation?.simulationSummary ?? "", /increases/i);
  assert.equal(result.simulation?.executiveQuestions.length, 4);
});

test("produces identical outputs for repeated simulation with same inputs", () => {
  const workspace = createWorkspace("Deterministic Simulation Workspace");
  seedSimulationDataset(workspace.workspaceId);
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
  });

  const assumptions = [
    createWorkspaceScenarioAssumption({
      label: "Demand",
      assumptionType: "percentage",
      value: 20,
    })!,
    createWorkspaceScenarioAssumption({
      label: "Marketing",
      assumptionType: "percentage",
      value: 10,
    })!,
  ];

  const first = runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
    assumptions,
  });
  resetWorkspaceScenarioSimulationSequencesForTests();
  const second = runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
    assumptions,
  });

  assert.deepEqual(
    first.simulation?.predictedKpiChanges.map((item) => ({
      id: item.id,
      changePercent: item.changePercent,
    })),
    second.simulation?.predictedKpiChanges.map((item) => ({
      id: item.id,
      changePercent: item.changePercent,
    }))
  );
  assert.deepEqual(
    first.simulation?.predictedRiskChanges.map((item) => item.changePercent),
    second.simulation?.predictedRiskChanges.map((item) => item.changePercent)
  );
});

test("persists simulation with workspace isolation", () => {
  const workspaceA = createWorkspace("Simulation Workspace A");
  const workspaceB = createWorkspace("Simulation Workspace B");
  seedSimulationDataset(workspaceA.workspaceId);

  const scenario = createWorkspaceScenario({
    workspaceId: workspaceA.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
  });
  const demand = createWorkspaceScenarioAssumption({
    label: "Demand",
    assumptionType: "percentage",
    value: 20,
  });

  const result = runWorkspaceScenarioSimulation({
    workspaceId: workspaceA.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
    assumptions: [demand!],
  });
  assert.ok(window.localStorage.getItem(WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY));

  resetWorkspaceScenarioSimulationMemoryForTests();
  const reloaded = getWorkspaceScenarioSimulation(
    workspaceA.workspaceId,
    scenario.scenario?.scenarioId ?? "",
    result.simulation?.simulationId ?? ""
  );
  assert.ok(reloaded);
  assert.equal(getWorkspaceScenarioSimulations(workspaceB.workspaceId, "any").length, 0);
  assert.ok(getLatestWorkspaceScenarioSimulation(workspaceA.workspaceId, scenario.scenario?.scenarioId ?? ""));
});

test("does not mutate scenario, KPI, OKR, risk, object, or scene storage", () => {
  const workspace = createWorkspace("Simulation Safety Workspace");
  seedSimulationDataset(workspace.workspaceId);
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    scenarioType: "realistic",
  });

  const before = snapshotProtectedStorage();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

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

  assert.deepEqual(snapshotProtectedStorage(), before);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});

test("returns missing_assumptions when simulation has no assumptions", () => {
  const workspace = createWorkspace("Missing Assumptions Workspace");
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Baseline",
    scenarioType: "baseline",
  });

  const result = runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
    assumptions: [],
  });
  assert.equal(result.success, false);
  assert.equal(result.reason, "missing_assumptions");
});
