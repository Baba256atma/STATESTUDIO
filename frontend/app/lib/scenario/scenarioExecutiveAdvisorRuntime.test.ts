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
import { resetWorkspaceScenesForTests } from "../workspace/workspaceSceneCreationContract.ts";
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
  generateWorkspaceScenarioComparison,
  resetWorkspaceScenarioComparisonStoreForTests,
} from "./workspaceScenarioComparisonEngine.ts";
import {
  NEXORA_SCENARIO_ADVISOR_LOG_PREFIX,
  WORKSPACE_SCENARIO_EXECUTIVE_ADVISOR_TAGS,
  buildScenarioExecutiveAdvisorSummary,
  classifyScenarioExecutiveAdvisorQuestion,
  isScenarioExecutiveAdvisorQuestion,
  resolveScenarioExecutiveAdvisorQuestion,
} from "./scenarioExecutiveAdvisorRuntime.ts";

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

function seedComparisonScenarios(workspaceId: string): {
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
  runWorkspaceScenarioSimulation({
    workspaceId,
    scenarioId: scenarioA.scenario?.scenarioId ?? "",
    assumptions: [
      createWorkspaceScenarioAssumption({ label: "Demand", assumptionType: "percentage", value: 20 })!,
    ],
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
    scenarioAId: scenarioA.scenario?.scenarioId ?? "",
    scenarioBId: scenarioB.scenario?.scenarioId ?? "",
  };
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

test("exports DS-7:6 scenario executive advisor tags", () => {
  assert.equal(NEXORA_SCENARIO_ADVISOR_LOG_PREFIX, "[NexoraScenarioAdvisor]");
  assert.deepEqual(WORKSPACE_SCENARIO_EXECUTIVE_ADVISOR_TAGS, [
    "[DS76_SCENARIO_EXECUTIVE_ADVISOR]",
    "[SCENARIO_ASSISTANT_READY]",
    "[SCENARIO_EXPLANATION_READY]",
    "[READ_ONLY_ASSISTANT]",
    "[DS77_READY]",
    "[DS_7_6_COMPLETE]",
  ]);
});

test("classifies supported scenario advisor questions", () => {
  assert.equal(classifyScenarioExecutiveAdvisorQuestion("Explain this scenario."), "scenario_overview");
  assert.equal(
    classifyScenarioExecutiveAdvisorQuestion("What changed after simulation?"),
    "simulation_explanation"
  );
  assert.equal(
    classifyScenarioExecutiveAdvisorQuestion("Why is Scenario A riskier?"),
    "comparison_explanation"
  );
  assert.equal(
    classifyScenarioExecutiveAdvisorQuestion("What are the main business trade-offs?"),
    "tradeoff_explanation"
  );
  assert.equal(
    classifyScenarioExecutiveAdvisorQuestion("Which assumptions matter most?"),
    "assumption_explanation"
  );
  assert.equal(
    classifyScenarioExecutiveAdvisorQuestion("Show the scenario timeline."),
    "timeline_explanation"
  );
  assert.ok(isScenarioExecutiveAdvisorQuestion("Which KPIs changed in the scenario simulation?"));
});

test("returns null for non-scenario questions", () => {
  assert.equal(resolveScenarioExecutiveAdvisorQuestion({ text: "Focus on Product" }), null);
});

test("explains scenario overview from existing intelligence", () => {
  const workspace = createWorkspace("Advisor Overview Workspace");
  seedSimulationDataset(workspace.workspaceId);
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
    description: "Improve forecast accuracy.",
    scenarioType: "realistic",
    status: "active",
  });
  generateWorkspaceScenarioInsight(workspace.workspaceId, scenario.scenario?.scenarioId ?? "");

  const result = resolveScenarioExecutiveAdvisorQuestion({
    text: "Explain this scenario.",
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
  });

  assert.ok(result?.matched);
  assert.equal(result?.responseType, "overview");
  assert.match(result?.assistantReply ?? "", /Forecast Improvement/);
  assert.match(result?.assistantReply ?? "", /Insight:/);
  assert.ok(result?.sourcesUsed.includes("workspaceScenarioInsightEngine"));
});

test("explains simulation and KPI changes without executing simulation", () => {
  const workspace = createWorkspace("Advisor Simulation Workspace");
  seedSimulationDataset(workspace.workspaceId);
  const scenario = createWorkspaceScenario({
    workspaceId: workspace.workspaceId,
    name: "Forecast Improvement",
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
  const before = snapshotProtectedStorage();

  const result = resolveScenarioExecutiveAdvisorQuestion({
    text: "Which KPIs changed after simulation?",
    workspaceId: workspace.workspaceId,
    scenarioId: scenario.scenario?.scenarioId ?? "",
  });

  assert.equal(result?.responseType, "simulation");
  assert.match(result?.assistantReply ?? "", /Forecast Accuracy/);
  assert.deepEqual(snapshotProtectedStorage(), before);
});

test("explains comparison and tradeoffs from existing comparison intelligence", () => {
  const workspace = createWorkspace("Advisor Comparison Workspace");
  const { scenarioAId } = seedComparisonScenarios(workspace.workspaceId);

  const comparisonResult = resolveScenarioExecutiveAdvisorQuestion({
    text: "Why is Scenario A riskier?",
    workspaceId: workspace.workspaceId,
    scenarioId: scenarioAId,
  });
  assert.equal(comparisonResult?.responseType, "comparison");
  assert.match(comparisonResult?.assistantReply ?? "", /Comparison|projects higher|risk/i);

  const tradeoffResult = resolveScenarioExecutiveAdvisorQuestion({
    text: "What are the main business trade-offs?",
    workspaceId: workspace.workspaceId,
    scenarioId: scenarioAId,
  });
  assert.equal(tradeoffResult?.responseType, "tradeoff");
  assert.match(tradeoffResult?.assistantReply ?? "", /vs/);
});

test("explains assumptions and executive questions", () => {
  const workspace = createWorkspace("Advisor Assumption Workspace");
  const { scenarioAId } = seedComparisonScenarios(workspace.workspaceId);

  const assumptionResult = resolveScenarioExecutiveAdvisorQuestion({
    text: "Which assumptions matter most?",
    workspaceId: workspace.workspaceId,
    scenarioId: scenarioAId,
  });
  assert.equal(assumptionResult?.responseType, "assumption");
  assert.match(assumptionResult?.assistantReply ?? "", /Demand/);

  const questionsResult = resolveScenarioExecutiveAdvisorQuestion({
    text: "What executive questions should I review?",
    workspaceId: workspace.workspaceId,
    scenarioId: scenarioAId,
  });
  assert.equal(questionsResult?.responseType, "executive_questions");
  assert.match(questionsResult?.assistantReply ?? "", /1\./);
});

test("handles empty scenario workspace", () => {
  const workspace = createWorkspace("Empty Advisor Workspace");
  const result = resolveScenarioExecutiveAdvisorQuestion({
    text: "Explain this scenario.",
    workspaceId: workspace.workspaceId,
  });
  assert.ok(result?.matched);
  assert.equal(result?.responseType, "unavailable");
  assert.match(result?.assistantReply ?? "", /No workspace scenarios/);
  assert.equal(buildScenarioExecutiveAdvisorSummary(workspace.workspaceId), "No workspace scenarios available.");
});

test("preserves workspace isolation", () => {
  const workspaceA = createWorkspace("Advisor Workspace A");
  seedComparisonScenarios(workspaceA.workspaceId);

  const result = resolveScenarioExecutiveAdvisorQuestion({
    text: "Explain this scenario.",
    workspaceId: "missing_workspace",
  });
  assert.ok(result?.matched);
  assert.equal(result?.responseType, "unavailable");
});

test("does not mutate scenario, KPI, OKR, or risk storage", () => {
  const workspace = createWorkspace("Advisor Safety Workspace");
  const { scenarioAId } = seedComparisonScenarios(workspace.workspaceId);
  const before = snapshotProtectedStorage();

  resolveScenarioExecutiveAdvisorQuestion({
    text: "Explain Forecast Improvement scenario simulation comparison tradeoffs assumptions timeline executive questions",
    workspaceId: workspace.workspaceId,
    scenarioId: scenarioAId,
  });

  assert.deepEqual(snapshotProtectedStorage(), before);
});
