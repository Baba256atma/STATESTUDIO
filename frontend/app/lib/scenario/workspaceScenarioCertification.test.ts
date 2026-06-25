import assert from "node:assert/strict";
import test from "node:test";

import {
  attachWorkspaceScenarioDashboardSummary,
} from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
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
  NEXORA_SCENARIO_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_SCENARIO_CERTIFICATION_GATE_TITLES,
  WORKSPACE_SCENARIO_CERTIFICATION_TAGS,
} from "./workspaceScenarioCertificationContract.ts";
import {
  getLatestWorkspaceScenarioCertificationResult,
  resetWorkspaceScenarioCertificationForTests,
  runWorkspaceScenarioCertification,
} from "./workspaceScenarioCertification.ts";
import {
  resolveObjectScenarioSummaryState,
  getWorkspaceScenarioWorkspaceSummary,
} from "./scenarioWorkspaceIntegrationRuntime.ts";
import {
  WORKSPACE_SCENARIO_STORAGE_KEY,
  createWorkspaceScenario,
  deleteWorkspaceScenario,
  resetWorkspaceScenarioMemoryForTests,
  resetWorkspaceScenarioStoreForTests,
  updateWorkspaceScenario,
} from "./workspaceScenarioContract.ts";
import {
  generateWorkspaceScenarioInsight,
  resetWorkspaceScenarioInsightMemoryForTests,
  resetWorkspaceScenarioInsightStoreForTests,
} from "./workspaceScenarioInsightEngine.ts";
import {
  createWorkspaceScenarioAssumption,
  createWorkspaceScenarioOverride,
  resetWorkspaceScenarioSimulationMemoryForTests,
  resetWorkspaceScenarioSimulationSequencesForTests,
  resetWorkspaceScenarioSimulationStoreForTests,
  runWorkspaceScenarioSimulation,
} from "./workspaceScenarioSimulationEngine.ts";
import {
  generateWorkspaceScenarioComparison,
  resetWorkspaceScenarioComparisonMemoryForTests,
  resetWorkspaceScenarioComparisonSequencesForTests,
  resetWorkspaceScenarioComparisonStoreForTests,
} from "./workspaceScenarioComparisonEngine.ts";
import {
  resolveScenarioExecutiveAdvisorQuestion,
} from "./scenarioExecutiveAdvisorRuntime.ts";

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const INSIGHT_STORAGE_KEY = "nexora.workspaceScenarioInsights.v1";
const SIMULATION_STORAGE_KEY = "nexora.workspaceScenarioSimulations.v1";
const COMPARISON_STORAGE_KEY = "nexora.workspaceScenarioComparisons.v1";

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
  resetWorkspaceScenarioCertificationForTests();
  resetWorkspaceScenarioComparisonSequencesForTests();
  resetWorkspaceScenarioComparisonStoreForTests();
  resetWorkspaceScenarioSimulationSequencesForTests();
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
  resetWorkspaceRegistryForTests();
  resetWorkspaceObjectCreationStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceSceneSyncForTests();
}

function seedSimulationDataset(workspaceId: string): void {
  window.localStorage.setItem(
    OBJECT_INTELLIGENCE_STORAGE_KEY,
    JSON.stringify({
      [workspaceId]: {
        obj_forecast: {
          contractVersion: "DS-3:1",
          objectId: "obj_forecast",
          workspaceId,
          objectName: "Forecast",
          objectType: "forecast",
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

  const risk: WorkspaceDetectedRisk = {
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
  };
  window.localStorage.setItem(
    WORKSPACE_DETECTED_RISK_STORAGE_KEY,
    JSON.stringify({ [workspaceId]: { [risk.detectionId]: risk } })
  );
  window.localStorage.setItem(
    "nexora.workspaceRiskSeverityProfiles.v1",
    JSON.stringify({
      [workspaceId]: {
        [risk.riskId]: {
          contractVersion: "DS-6:3",
          workspaceId,
          detectionId: risk.detectionId,
          riskId: risk.riskId,
          severityScore: 65,
          severityLevel: "medium",
          priority: "p2",
          severityReason: "Test severity profile.",
          evaluatedAt: "2026-06-24T00:00:00.000Z",
          source: WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE,
        },
      },
    })
  );
}

function seedCertificationDataset(workspaceId: string): {
  forecastObjectId: string;
  scenarioAId: string;
  scenarioBId: string;
} {
  seedSimulationDataset(workspaceId);

  const scenarioA = createWorkspaceScenario({
    workspaceId,
    name: "Demand-Led Growth",
    scenarioType: "optimistic",
    status: "active",
  });
  const scenarioB = createWorkspaceScenario({
    workspaceId,
    name: "Marketing-Led Growth",
    scenarioType: "realistic",
    status: "draft",
  });

  generateWorkspaceScenarioInsight(workspaceId, scenarioA.scenario?.scenarioId ?? "");
  generateWorkspaceScenarioInsight(workspaceId, scenarioB.scenario?.scenarioId ?? "");

  const override = createWorkspaceScenarioOverride({
    field: "status",
    value: "active",
    targetKind: "scenario",
    targetId: scenarioA.scenario?.scenarioId ?? "",
  });
  assert.ok(override);

  runWorkspaceScenarioSimulation({
    workspaceId,
    scenarioId: scenarioA.scenario?.scenarioId ?? "",
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 })!,
    ],
    overrides: override ? [override] : [],
  });

  runWorkspaceScenarioSimulation({
    workspaceId,
    scenarioId: scenarioB.scenario?.scenarioId ?? "",
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Marketing", assumptionType: "percentage", value: 30 })!,
    ],
  });

  generateWorkspaceScenarioComparison({
    workspaceId,
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  });

  return {
    forecastObjectId: "obj_forecast",
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  };
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetAllStoresForTests();
});

test("exports DS-7:7 certification tags and gate titles", () => {
  assert.equal(NEXORA_SCENARIO_CERTIFICATION_LOG_PREFIX, "[NexoraScenarioCertification]");
  assert.ok(WORKSPACE_SCENARIO_CERTIFICATION_TAGS.includes("[DS77_CERTIFIED]"));
  assert.ok(WORKSPACE_SCENARIO_CERTIFICATION_TAGS.includes("[SCENARIO_MVP_COMPLETE]"));
  assert.equal(WORKSPACE_SCENARIO_CERTIFICATION_GATE_TITLES.A, "Scenario Foundation Exists");
  assert.equal(WORKSPACE_SCENARIO_CERTIFICATION_GATE_TITLES.AK, "Full Workflow");
});

test("certifies empty workspace with supplemental harness flags", () => {
  const workspace = createWorkspace("Empty Scenario Certification Workspace");
  const isolation = createWorkspace("Isolation Scenario Certification Workspace");

  const result = runWorkspaceScenarioCertification({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolation.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      emptyWorkspaceValidated: true,
      crudValidated: true,
      retrievalValidated: true,
      persistenceReloadValidated: true,
      insightValidated: true,
      assumptionsValidated: true,
      overridesValidated: true,
      simulationValidated: true,
      deterministicSimulationValidated: true,
      reproducibilityValidated: true,
      comparisonValidated: true,
      tradeoffsValidated: true,
      executiveQuestionsValidated: true,
      workspaceIntegrationValidated: true,
      executiveSummaryValidated: true,
      objectPanelValidated: true,
      operationalFeedValidated: true,
      executiveAdvisorValidated: true,
      assistantRouterValidated: true,
      assistantCardsValidated: true,
      fullWorkflowValidated: true,
      repeatedSimulationValidated: true,
      repeatedComparisonValidated: true,
      readOnlyValidated: true,
    },
  });

  assert.equal(result.passed, true);
  assert.equal(result.certified, true);
  assert.equal(result.gateResults.length, 37);
  assert.equal(result.scenarioResults.length, 12);
  assert.ok(result.warnings.length >= 7);
  assert.ok(result.tags.includes("[DS_7_COMPLETE]"));
});

test("certifies full manual walkthrough dataset", () => {
  const workspace = createWorkspace("Scenario Certification Workspace");
  const isolation = createWorkspace("Scenario Certification Isolation Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const updateResult = updateWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    scenarioId: dataset.scenarioAId,
    description: "Certification walkthrough scenario.",
  });
  assert.equal(updateResult.success, true);

  const beforeReload = window.localStorage.getItem(SIMULATION_STORAGE_KEY);
  resetWorkspaceScenarioMemoryForTests();
  resetWorkspaceScenarioInsightMemoryForTests();
  resetWorkspaceScenarioSimulationMemoryForTests();
  resetWorkspaceScenarioComparisonMemoryForTests();
  assert.ok(window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY));
  assert.equal(window.localStorage.getItem(SIMULATION_STORAGE_KEY), beforeReload);

  const enriched = attachWorkspaceScenarioDashboardSummary(
    aggregateExecutiveSummary({
      dashboardContext: "overview",
      normalizedContext: null,
    })
  );
  const summary = getWorkspaceScenarioWorkspaceSummary(workspace.workspaceId);
  assert.ok(summary.totalScenarios >= 2);
  assert.ok(enriched.cards.length > 0);

  const panelState = resolveObjectScenarioSummaryState({
    workspaceId: workspace.workspaceId,
    objectId: dataset.forecastObjectId,
  });
  assert.ok(panelState.visible);

  const advisor = resolveScenarioExecutiveAdvisorQuestion({
    workspaceId: workspace.workspaceId,
    text: "Explain this scenario.",
  });
  assert.ok(advisor?.assistantReply);

  const result = runWorkspaceScenarioCertification({
    workspaceId: workspace.workspaceId,
    isolationWorkspaceId: isolation.workspaceId,
    forecastObjectId: dataset.forecastObjectId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      crudValidated: true,
      retrievalValidated: true,
      persistenceReloadValidated: true,
      insightValidated: true,
      assumptionsValidated: true,
      overridesValidated: true,
      simulationValidated: true,
      deterministicSimulationValidated: true,
      reproducibilityValidated: true,
      comparisonValidated: true,
      tradeoffsValidated: true,
      executiveQuestionsValidated: true,
      workspaceIntegrationValidated: true,
      executiveSummaryValidated: true,
      objectPanelValidated: true,
      operationalFeedValidated: true,
      executiveAdvisorValidated: true,
      assistantRouterValidated: true,
      assistantCardsValidated: true,
      fullWorkflowValidated: true,
      repeatedSimulationValidated: true,
      repeatedComparisonValidated: true,
    },
  });

  assert.equal(result.certified, true);
  assert.equal(result.passed, true);
  assert.match(result.summary, /PASSED/);
  assert.ok(result.gateResults.every((entry) => entry.status !== "FAIL"));
  assert.ok(result.scenarioResults.every((entry) => entry.status !== "FAIL"));
  assert.equal(getLatestWorkspaceScenarioCertificationResult()?.certified, true);
});

test("validates repeated simulation determinism in certification harness", () => {
  const workspace = createWorkspace("Repeated Simulation Certification Workspace");
  const dataset = seedCertificationDataset(workspace.workspaceId);

  const first = runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: dataset.scenarioAId,
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 })!,
    ],
  });
  const second = runWorkspaceScenarioSimulation({
    workspaceId: workspace.workspaceId,
    scenarioId: dataset.scenarioAId,
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 })!,
    ],
  });

  assert.equal(first.success, true);
  assert.equal(second.success, true);
  assert.equal(
    first.simulation?.predictedKpiChanges.length,
    second.simulation?.predictedKpiChanges.length
  );
});

test("certification runner does not mutate scenario, KPI, OKR, or scene storage", () => {
  const workspace = createWorkspace("Scenario Certification Safety Workspace");
  seedCertificationDataset(workspace.workspaceId);

  const before = {
    scenarios: window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY),
    insights: window.localStorage.getItem(INSIGHT_STORAGE_KEY),
    simulations: window.localStorage.getItem(SIMULATION_STORAGE_KEY),
    comparisons: window.localStorage.getItem(COMPARISON_STORAGE_KEY),
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    objectives: window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    scene: getWorkspaceSceneJson(workspace.workspaceId),
  };

  runWorkspaceScenarioCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      crudValidated: true,
      retrievalValidated: true,
      persistenceReloadValidated: true,
      insightValidated: true,
      assumptionsValidated: true,
      overridesValidated: true,
      simulationValidated: true,
      deterministicSimulationValidated: true,
      reproducibilityValidated: true,
      comparisonValidated: true,
      tradeoffsValidated: true,
      executiveQuestionsValidated: true,
      workspaceIntegrationValidated: true,
      executiveSummaryValidated: true,
      objectPanelValidated: true,
      operationalFeedValidated: true,
      executiveAdvisorValidated: true,
      assistantRouterValidated: true,
      assistantCardsValidated: true,
      fullWorkflowValidated: true,
      repeatedSimulationValidated: true,
      repeatedComparisonValidated: true,
    },
  });

  assert.equal(window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY), before.scenarios);
  assert.equal(window.localStorage.getItem(INSIGHT_STORAGE_KEY), before.insights);
  assert.equal(window.localStorage.getItem(SIMULATION_STORAGE_KEY), before.simulations);
  assert.equal(window.localStorage.getItem(COMPARISON_STORAGE_KEY), before.comparisons);
  assert.equal(window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY), before.kpis);
  assert.equal(window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY), before.objectives);
  assert.equal(window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY), before.objects);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId), before.scene);
});

test("CRUD gate fails when supplemental CRUD validation is false and no scenarios exist", () => {
  const workspace = createWorkspace("CRUD Gate Failure Workspace");

  const created = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Temporary Scenario",
    scenarioType: "baseline",
    status: "draft",
  });
  deleteWorkspaceScenario(workspace.workspaceId, created.scenario?.scenarioId ?? "");

  const result = runWorkspaceScenarioCertification({
    workspaceId: workspace.workspaceId,
    buildPassed: true,
    regressionPassed: true,
    supplementalChecks: {
      crudValidated: false,
    },
  });

  const crudGate = result.gateResults.find((entry) => entry.gateId === "B");
  assert.equal(crudGate?.status, "FAIL");
  assert.equal(result.certified, false);
});
