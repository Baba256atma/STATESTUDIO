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
  WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY,
  createWorkspaceScenarioAssumption,
  resetWorkspaceScenarioSimulationSequencesForTests,
  resetWorkspaceScenarioSimulationStoreForTests,
  runWorkspaceScenarioSimulation,
} from "./workspaceScenarioSimulationEngine.ts";
import {
  NEXORA_SCENARIO_COMPARISON_LOG_PREFIX,
  WORKSPACE_SCENARIO_COMPARISON_ENGINE_SOURCE,
  WORKSPACE_SCENARIO_COMPARISON_ENGINE_TAGS,
  WORKSPACE_SCENARIO_COMPARISON_STORAGE_KEY,
  compareWorkspaceScenarioSimulations,
  generateWorkspaceScenarioComparison,
  getLatestWorkspaceScenarioComparison,
  getWorkspaceScenarioComparison,
  getWorkspaceScenarioComparisons,
  resetWorkspaceScenarioComparisonMemoryForTests,
  resetWorkspaceScenarioComparisonSequencesForTests,
  resetWorkspaceScenarioComparisonStoreForTests,
} from "./workspaceScenarioComparisonEngine.ts";

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
  window.localStorage.setItem(
    "nexora.workspaceRiskSeverityProfiles.v1",
    JSON.stringify({
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
    })
  );
}

function seedDetectedRisk(workspaceId: string, risk: WorkspaceDetectedRisk): void {
  window.localStorage.setItem(
    WORKSPACE_DETECTED_RISK_STORAGE_KEY,
    JSON.stringify({
      [workspaceId]: {
        [risk.detectionId]: risk,
      },
    })
  );
}

function seedComparisonDataset(workspaceId: string): void {
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

function runScenarioSimulation(
  workspaceId: string,
  scenarioId: string,
  assumptions: readonly ReturnType<typeof createWorkspaceScenarioAssumption>[]
): void {
  const result = runWorkspaceScenarioSimulation({
    workspaceId,
    scenarioId,
    assumptions: assumptions.filter(Boolean) as NonNullable<
      ReturnType<typeof createWorkspaceScenarioAssumption>
    >[],
  });
  assert.equal(result.success, true);
}

function snapshotProtectedStorage(): Record<string, string | null> {
  return Object.fromEntries(
    [
      WORKSPACE_SCENARIO_STORAGE_KEY,
      WORKSPACE_KPI_STORAGE_KEY,
      WORKSPACE_OBJECTIVE_STORAGE_KEY,
      WORKSPACE_DETECTED_RISK_STORAGE_KEY,
      OBJECT_INTELLIGENCE_STORAGE_KEY,
      WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY,
    ].map((key) => [key, window.localStorage.getItem(key)])
  );
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
  resetWorkspaceScenarioSimulationSequencesForTests();
  resetWorkspaceScenarioComparisonSequencesForTests();
});

test("exports DS-7:4 scenario comparison tags and storage key", () => {
  assert.equal(NEXORA_SCENARIO_COMPARISON_LOG_PREFIX, "[NexoraScenarioComparison]");
  assert.equal(
    WORKSPACE_SCENARIO_COMPARISON_STORAGE_KEY,
    "nexora.workspaceScenarioComparisons.v1"
  );
  assert.deepEqual(WORKSPACE_SCENARIO_COMPARISON_ENGINE_TAGS, [
    "[DS74_SCENARIO_COMPARISON]",
    "[DECISION_ANALYSIS_READY]",
    "[BUSINESS_TRADEOFF_READY]",
    "[EXECUTIVE_QUESTIONS_READY]",
    "[DS75_READY]",
    "[DS_7_4_COMPLETE]",
  ]);
});

test("compares identical scenario simulations with zero deltas", () => {
  const workspace = createWorkspace("Identical Comparison Workspace");
  seedComparisonDataset(workspace.workspaceId);

  const scenarioA = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Growth Path A",
    scenarioType: "optimistic",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Growth Path B",
    scenarioType: "optimistic",
  });

  const assumptions = [
    createWorkspaceScenarioAssumption({
      label: "Demand",
      assumptionType: "percentage",
      value: 15,
    })!,
  ];

  runScenarioSimulation(
    workspace.workspaceId,
    scenarioA.scenario?.scenarioId ?? "",
    assumptions
  );
  runScenarioSimulation(
    workspace.workspaceId,
    scenarioB.scenario?.scenarioId ?? "",
    assumptions
  );

  const result = generateWorkspaceScenarioComparison({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  assert.equal(result.success, true);
  assert.equal(result.comparison?.source, WORKSPACE_SCENARIO_COMPARISON_ENGINE_SOURCE);
  assert.ok(result.comparison?.kpiDifferences.every((item) => item.deltaPercent === 0));
});

test("runs deterministic manual walkthrough comparison", () => {
  const workspace = createWorkspace("Scenario Comparison Workspace");
  seedComparisonDataset(workspace.workspaceId);

  const scenarioA = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Demand-Led Growth",
    description: "Higher demand with moderate marketing.",
    scenarioType: "optimistic",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Marketing-Led Growth",
    description: "Moderate demand with higher marketing.",
    scenarioType: "realistic",
  });

  generateWorkspaceScenarioInsight(workspace.workspaceId, scenarioA.scenario?.scenarioId ?? "");
  generateWorkspaceScenarioInsight(workspace.workspaceId, scenarioB.scenario?.scenarioId ?? "");

  runScenarioSimulation(workspace.workspaceId, scenarioA.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({
      label: "Demand",
      assumptionType: "percentage",
      value: 20,
    }),
    createWorkspaceScenarioAssumption({
      label: "Marketing",
      assumptionType: "percentage",
      value: 10,
    }),
  ]);
  runScenarioSimulation(workspace.workspaceId, scenarioB.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({
      label: "Demand",
      assumptionType: "percentage",
      value: 10,
    }),
    createWorkspaceScenarioAssumption({
      label: "Marketing",
      assumptionType: "percentage",
      value: 30,
    }),
  ]);

  const result = generateWorkspaceScenarioComparison({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  assert.equal(result.success, true);

  const forecastKpi = result.comparison?.kpiDifferences.find((item) =>
    /forecast/i.test(item.label)
  );
  assert.ok(forecastKpi);
  assert.equal(forecastKpi.strongerScenarioId, scenarioA.scenario?.scenarioId ?? null);
  assert.ok(forecastKpi.scenarioAChangePercent > forecastKpi.scenarioBChangePercent);

  const inventoryRisk = result.comparison?.riskDifferences.find((item) =>
    /inventory/i.test(item.label)
  );
  assert.ok(inventoryRisk);
  assert.equal(inventoryRisk.strongerScenarioId, scenarioB.scenario?.scenarioId ?? null);
  assert.ok(inventoryRisk.scenarioAChangePercent > inventoryRisk.scenarioBChangePercent);

  assert.ok(result.comparison?.businessTradeoffs.length ?? 0 > 0);
  assert.match(
    result.comparison?.businessTradeoffs[0]?.observation ?? "",
    /higher growth|lower operational exposure/i
  );
  assert.ok(
    result.comparison?.executiveQuestions.some((question) =>
      /inventory investment support Scenario A/i.test(question)
    )
  );
  assert.match(result.comparison?.comparisonSummary ?? "", /Scenario A/i);
});

test("identifies object, KPI, OKR, and risk differences", () => {
  const workspace = createWorkspace("Difference Coverage Workspace");
  seedComparisonDataset(workspace.workspaceId);

  const scenarioA = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Scenario A",
    scenarioType: "realistic",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Scenario B",
    scenarioType: "realistic",
  });

  runScenarioSimulation(workspace.workspaceId, scenarioA.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 }),
  ]);
  runScenarioSimulation(workspace.workspaceId, scenarioB.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({ label: "Marketing", assumptionType: "percentage", value: 30 }),
  ]);

  const result = generateWorkspaceScenarioComparison({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  assert.ok((result.comparison?.kpiDifferences.length ?? 0) > 0);
  assert.ok((result.comparison?.okrDifferences.length ?? 0) > 0);
  assert.ok((result.comparison?.riskDifferences.length ?? 0) > 0);
  assert.ok((result.comparison?.decisionObservations.length ?? 0) > 0);
  assert.equal(result.comparison?.executiveQuestions.length, 4);
});

test("produces identical outputs for repeated comparison with same inputs", () => {
  const workspace = createWorkspace("Deterministic Comparison Workspace");
  seedComparisonDataset(workspace.workspaceId);

  const scenarioA = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Scenario A",
    scenarioType: "realistic",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Scenario B",
    scenarioType: "realistic",
  });

  runScenarioSimulation(workspace.workspaceId, scenarioA.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 }),
  ]);
  runScenarioSimulation(workspace.workspaceId, scenarioB.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 10 }),
  ]);

  const first = generateWorkspaceScenarioComparison({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  const pure = compareWorkspaceScenarioSimulations({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
    simulationA: first.comparison
      ? {
          ...first.comparison,
          simulationId: first.comparison.simulationAId,
          assumptions: [],
          overrides: [],
          simulationStatus: "completed",
          predictedObjectChanges: [],
          predictedKpiChanges: first.comparison.kpiDifferences.map((item) => ({
            id: item.id,
            label: item.label,
            baselineValue: 50,
            predictedValue: 50 + item.scenarioAChangePercent,
            changePercent: item.scenarioAChangePercent,
            changeReason: item.observation,
          })),
          predictedOkrChanges: [],
          predictedRiskChanges: first.comparison.riskDifferences.map((item) => ({
            id: item.id,
            label: item.label,
            baselineValue: 65,
            predictedValue: 65 + item.scenarioAChangePercent,
            changePercent: item.scenarioAChangePercent,
            changeReason: item.observation,
          })),
          simulationSummary: "",
          executiveQuestions: [],
          simulatedAt: "2026-06-24T00:00:00.000Z",
          source: "ds-7:3-simulation",
          contractVersion: "DS-7:3",
          workspaceId: workspace.workspaceId,
          scenarioId: scenarioA.scenario?.scenarioId ?? "",
        }
      : (null as never),
    simulationB: first.comparison
      ? {
          ...first.comparison,
          simulationId: first.comparison.simulationBId,
          assumptions: [],
          overrides: [],
          simulationStatus: "completed",
          predictedObjectChanges: [],
          predictedKpiChanges: first.comparison.kpiDifferences.map((item) => ({
            id: item.id,
            label: item.label,
            baselineValue: 50,
            predictedValue: 50 + item.scenarioBChangePercent,
            changePercent: item.scenarioBChangePercent,
            changeReason: item.observation,
          })),
          predictedOkrChanges: [],
          predictedRiskChanges: first.comparison.riskDifferences.map((item) => ({
            id: item.id,
            label: item.label,
            baselineValue: 65,
            predictedValue: 65 + item.scenarioBChangePercent,
            changePercent: item.scenarioBChangePercent,
            changeReason: item.observation,
          })),
          simulationSummary: "",
          executiveQuestions: [],
          simulatedAt: "2026-06-24T00:00:00.000Z",
          source: "ds-7:3-simulation",
          contractVersion: "DS-7:3",
          workspaceId: workspace.workspaceId,
          scenarioId: scenarioB.scenario?.scenarioId ?? "",
        }
      : (null as never),
  });

  resetWorkspaceScenarioComparisonSequencesForTests();
  const second = generateWorkspaceScenarioComparison({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  assert.deepEqual(
    first.comparison?.kpiDifferences.map((item) => item.deltaPercent),
    second.comparison?.kpiDifferences.map((item) => item.deltaPercent)
  );
  assert.deepEqual(
    pure.kpiDifferences.map((item) => item.deltaPercent),
    second.comparison?.kpiDifferences.map((item) => item.deltaPercent)
  );
});

test("persists comparison with workspace isolation", () => {
  const workspaceA = createWorkspace("Comparison Workspace A");
  const workspaceB = createWorkspace("Comparison Workspace B");
  seedComparisonDataset(workspaceA.workspaceId);

  const scenarioA = createWorkspaceScenario({
    workspaceId: workspaceA.workspaceId,
    name: "Scenario A",
    scenarioType: "realistic",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId: workspaceA.workspaceId,
    name: "Scenario B",
    scenarioType: "realistic",
  });

  runScenarioSimulation(workspaceA.workspaceId, scenarioA.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 }),
  ]);
  runScenarioSimulation(workspaceA.workspaceId, scenarioB.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 10 }),
  ]);

  const result = generateWorkspaceScenarioComparison({
    workspaceId: workspaceA.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  assert.ok(window.localStorage.getItem(WORKSPACE_SCENARIO_COMPARISON_STORAGE_KEY));

  resetWorkspaceScenarioComparisonMemoryForTests();
  const reloaded = getWorkspaceScenarioComparison(
    workspaceA.workspaceId,
    result.comparison?.comparisonId ?? ""
  );
  assert.ok(reloaded);
  assert.equal(getWorkspaceScenarioComparisons(workspaceB.workspaceId).length, 0);
  assert.ok(
    getLatestWorkspaceScenarioComparison(
      workspaceA.workspaceId,
      scenarioA.scenario?.scenarioId ?? "",
      scenarioB.scenario?.scenarioId ?? ""
    )
  );
});

test("does not mutate scenario, KPI, OKR, risk, object, simulation, or scene storage", () => {
  const workspace = createWorkspace("Comparison Safety Workspace");
  seedComparisonDataset(workspace.workspaceId);

  const scenarioA = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Scenario A",
    scenarioType: "realistic",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Scenario B",
    scenarioType: "realistic",
  });

  runScenarioSimulation(workspace.workspaceId, scenarioA.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 }),
  ]);
  runScenarioSimulation(workspace.workspaceId, scenarioB.scenario?.scenarioId ?? "", [
    createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 10 }),
  ]);

  const before = snapshotProtectedStorage();
  const sceneBefore = getWorkspaceSceneJson(workspace.workspaceId);

  generateWorkspaceScenarioComparison({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  assert.deepEqual(snapshotProtectedStorage(), before);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), sceneBefore);
});

test("returns simulation_missing when comparison lacks completed simulations", () => {
  const workspace = createWorkspace("Missing Simulation Workspace");
  const scenarioA = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Scenario A",
    scenarioType: "realistic",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Scenario B",
    scenarioType: "realistic",
  });

  const result = generateWorkspaceScenarioComparison({
    workspaceId: workspace.workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  assert.equal(result.success, false);
  assert.equal(result.reason, "simulation_a_missing");
});
