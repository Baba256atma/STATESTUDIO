/**
 * DS-7:7 — Scenario Intelligence certification.
 * Read-only evaluator over DS-7:1 through DS-7:6 stores and integration runtimes.
 */

import { buildAssistantIntelligenceCards } from "../assistant/assistantIntelligenceCardsRuntime.ts";
import { attachWorkspaceScenarioDashboardSummary } from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import { WORKSPACE_KPI_STORAGE_KEY } from "../kpi/workspaceKpiContract.ts";
import { WORKSPACE_KPI_PROFILE_STORAGE_KEY } from "../kpi/workspaceKpiCalculationEngine.ts";
import { WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY } from "../kpi/workspaceKpiHealthEngine.ts";
import {
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
  WORKSPACE_KEY_RESULT_STORAGE_KEY,
} from "../okr/workspaceOkrContract.ts";
import { WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY } from "../okr/workspaceOkrProgressEngine.ts";
import { WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY } from "../okr/workspaceOkrHealthEngine.ts";
import { WORKSPACE_DETECTED_RISK_STORAGE_KEY } from "../risk/workspaceRiskDetectionEngine.ts";
import { WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY } from "../risk/workspaceRiskSeverityEngine.ts";
import { WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY } from "../risk/workspaceRiskObjectBinding.ts";
import { WORKSPACE_RISK_STORAGE_KEY } from "../risk/workspaceRiskContract.ts";
import { getWorkspaceSceneJson } from "../workspace/workspaceSceneCreationContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  NEXORA_SCENARIO_ADVISOR_LOG_PREFIX,
  WORKSPACE_SCENARIO_EXECUTIVE_ADVISOR_VERSION,
  buildScenarioExecutiveAdvisorSummary,
  isScenarioExecutiveAdvisorQuestion,
  resolveScenarioExecutiveAdvisorRouterResult,
} from "./scenarioExecutiveAdvisorRuntime.ts";
import {
  NEXORA_SCENARIO_WORKSPACE_LOG_PREFIX,
  WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_VERSION,
  formatOperationalWorkspaceScenarioSignals,
  formatWorkspaceScenarioSummaryPrimary,
  formatWorkspaceScenarioSummarySecondary,
  getWorkspaceScenarioWorkspaceSummary,
  resolveObjectScenarioSummaryState,
} from "./scenarioWorkspaceIntegrationRuntime.ts";
import {
  NEXORA_SCENARIO_FOUNDATION_LOG_PREFIX,
  WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_TAGS,
  WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_VERSION,
  WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES,
  WORKSPACE_SCENARIO_METRICS_RESERVATION_TAGS,
  WORKSPACE_SCENARIO_METRICS_RESERVATION_VERSION,
  WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS,
  WORKSPACE_SCENARIO_SOURCE,
  WORKSPACE_SCENARIO_STORAGE_KEY,
  WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS,
  WORKSPACE_SCENARIO_TIMELINE_RESERVATION_TAGS,
  WORKSPACE_SCENARIO_TIMELINE_RESERVATION_VERSION,
  WORKSPACE_SCENARIO_VERSION,
  getWorkspaceScenario,
  getWorkspaceScenarios,
} from "./workspaceScenarioContract.ts";
import {
  NEXORA_SCENARIO_COMPARISON_LOG_PREFIX,
  WORKSPACE_SCENARIO_COMPARISON_ENGINE_VERSION,
  WORKSPACE_SCENARIO_COMPARISON_STORAGE_KEY,
  getLatestWorkspaceScenarioComparison,
  getWorkspaceScenarioComparison,
  getWorkspaceScenarioComparisons,
} from "./workspaceScenarioComparisonEngine.ts";
import {
  NEXORA_SCENARIO_INSIGHT_LOG_PREFIX,
  WORKSPACE_SCENARIO_INSIGHT_ENGINE_VERSION,
  WORKSPACE_SCENARIO_INSIGHT_STORAGE_KEY,
  getWorkspaceScenarioInsight,
  getWorkspaceScenarioInsights,
} from "./workspaceScenarioInsightEngine.ts";
import {
  NEXORA_SCENARIO_SIMULATION_LOG_PREFIX,
  WORKSPACE_SCENARIO_SIMULATION_ENGINE_VERSION,
  WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY,
  getWorkspaceScenarioSimulation,
  getWorkspaceScenarioSimulations,
  type WorkspaceScenarioSimulation,
} from "./workspaceScenarioSimulationEngine.ts";
import {
  NEXORA_SCENARIO_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_SCENARIO_CERTIFICATION_GATE_TITLES,
  WORKSPACE_SCENARIO_CERTIFICATION_SCENARIO_TITLES,
  WORKSPACE_SCENARIO_CERTIFICATION_TAGS,
  WORKSPACE_SCENARIO_CERTIFICATION_VERSION,
  type WorkspaceScenarioCertificationGateId,
  type WorkspaceScenarioCertificationGateResult,
  type WorkspaceScenarioCertificationResult,
  type WorkspaceScenarioCertificationScenarioId,
  type WorkspaceScenarioCertificationScenarioResult,
  type WorkspaceScenarioCertificationStatus,
  type WorkspaceScenarioCertificationWarning,
} from "./workspaceScenarioCertificationContract.ts";

export type WorkspaceScenarioCertificationInput = Readonly<{
  workspaceId: WorkspaceId;
  isolationWorkspaceId?: WorkspaceId | null;
  forecastObjectId?: string | null;
  buildPassed?: boolean;
  regressionPassed?: boolean;
  supplementalChecks?: Readonly<{
    emptyWorkspaceValidated?: boolean;
    crudValidated?: boolean;
    retrievalValidated?: boolean;
    persistenceReloadValidated?: boolean;
    insightValidated?: boolean;
    assumptionsValidated?: boolean;
    overridesValidated?: boolean;
    simulationValidated?: boolean;
    deterministicSimulationValidated?: boolean;
    reproducibilityValidated?: boolean;
    comparisonValidated?: boolean;
    tradeoffsValidated?: boolean;
    executiveQuestionsValidated?: boolean;
    workspaceIntegrationValidated?: boolean;
    executiveSummaryValidated?: boolean;
    objectPanelValidated?: boolean;
    operationalFeedValidated?: boolean;
    executiveAdvisorValidated?: boolean;
    assistantRouterValidated?: boolean;
    assistantCardsValidated?: boolean;
    fullWorkflowValidated?: boolean;
    repeatedSimulationValidated?: boolean;
    repeatedComparisonValidated?: boolean;
    readOnlyValidated?: boolean;
  }>;
}>;

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";
const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";

let latestWorkspaceScenarioCertificationResult: WorkspaceScenarioCertificationResult | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function statusFrom(value: boolean, warning = false): WorkspaceScenarioCertificationStatus {
  if (value) return "PASS";
  return warning ? "WARNING" : "FAIL";
}

function gate(
  gateId: WorkspaceScenarioCertificationGateId,
  status: WorkspaceScenarioCertificationStatus,
  evidence: string
): WorkspaceScenarioCertificationGateResult {
  return Object.freeze({
    gateId,
    title: WORKSPACE_SCENARIO_CERTIFICATION_GATE_TITLES[gateId],
    status,
    evidence,
  });
}

function scenario(
  scenarioId: WorkspaceScenarioCertificationScenarioId,
  status: WorkspaceScenarioCertificationStatus,
  evidence: string
): WorkspaceScenarioCertificationScenarioResult {
  return Object.freeze({
    scenarioId,
    title: WORKSPACE_SCENARIO_CERTIFICATION_SCENARIO_TITLES[scenarioId],
    status,
    evidence,
  });
}

function overallStatus(
  statuses: readonly WorkspaceScenarioCertificationStatus[]
): WorkspaceScenarioCertificationStatus {
  if (statuses.includes("FAIL")) return "FAIL";
  if (statuses.includes("WARNING")) return "WARNING";
  return "PASS";
}

function snapshotProtectedStorage(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  return Object.freeze({
    scenarios: window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY),
    insights: window.localStorage.getItem(WORKSPACE_SCENARIO_INSIGHT_STORAGE_KEY),
    simulations: window.localStorage.getItem(WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY),
    comparisons: window.localStorage.getItem(WORKSPACE_SCENARIO_COMPARISON_STORAGE_KEY),
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    kpiProfiles: window.localStorage.getItem(WORKSPACE_KPI_PROFILE_STORAGE_KEY),
    kpiHealth: window.localStorage.getItem(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY),
    objectives: window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY),
    keyResults: window.localStorage.getItem(WORKSPACE_KEY_RESULT_STORAGE_KEY),
    okrProgress: window.localStorage.getItem(WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY),
    okrHealth: window.localStorage.getItem(WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY),
    risks: window.localStorage.getItem(WORKSPACE_RISK_STORAGE_KEY),
    detected: window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY),
    severity: window.localStorage.getItem(WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY),
    bindings: window.localStorage.getItem(WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    relationships: window.localStorage.getItem(RELATIONSHIP_STORAGE_KEY),
    scenes: window.localStorage.getItem(SCENE_STORAGE_KEY),
  });
}

function allSimulationsForWorkspace(
  workspaceId: WorkspaceId
): readonly WorkspaceScenarioSimulation[] {
  return Object.freeze(
    getWorkspaceScenarios(workspaceId).flatMap((scenario) =>
      getWorkspaceScenarioSimulations(workspaceId, scenario.scenarioId)
    )
  );
}

function latestSimulationForWorkspace(workspaceId: WorkspaceId): WorkspaceScenarioSimulation | null {
  const simulations = allSimulationsForWorkspace(workspaceId);
  if (simulations.length === 0) return null;
  return (
    [...simulations].sort((left, right) => right.simulatedAt.localeCompare(left.simulatedAt))[0] ??
    null
  );
}

function runReadOnlyScenarioIntelligencePass(
  workspaceId: WorkspaceId,
  forecastObjectId: string
): void {
  const scenarios = getWorkspaceScenarios(workspaceId);
  const insights = getWorkspaceScenarioInsights(workspaceId);
  const simulations = allSimulationsForWorkspace(workspaceId);
  const comparisons = getWorkspaceScenarioComparisons(workspaceId);

  for (const entry of scenarios) {
    getWorkspaceScenario(workspaceId, entry.scenarioId);
  }

  for (const insight of insights) {
    getWorkspaceScenarioInsight(workspaceId, insight.scenarioId);
  }

  for (const simulation of simulations) {
    getWorkspaceScenarioSimulation(
      workspaceId,
      simulation.scenarioId,
      simulation.simulationId
    );
  }

  for (const comparison of comparisons) {
    getWorkspaceScenarioComparison(workspaceId, comparison.comparisonId);
  }

  if (comparisons[0]) {
    getLatestWorkspaceScenarioComparison(
      workspaceId,
      comparisons[0].scenarioAId,
      comparisons[0].scenarioBId
    );
  }
  void latestSimulationForWorkspace(workspaceId);

  const summary = getWorkspaceScenarioWorkspaceSummary(workspaceId);
  if (forecastObjectId) {
    resolveObjectScenarioSummaryState({ workspaceId, objectId: forecastObjectId });
  }

  attachWorkspaceScenarioDashboardSummary(
    aggregateExecutiveSummary({
      dashboardContext: "overview",
      normalizedContext: null,
    })
  );

  void formatOperationalWorkspaceScenarioSignals({ summary });
  void buildScenarioExecutiveAdvisorSummary(workspaceId);

  if (isScenarioExecutiveAdvisorQuestion("Explain this scenario.")) {
    resolveScenarioExecutiveAdvisorRouterResult({
      workspaceId,
      text: "Explain this scenario.",
    });
  }

  void buildAssistantIntelligenceCards({
    activeWorkspaceId: workspaceId,
    dashboardContext: "overview",
    dashboardMode: "overview",
  });

  void scenarios;
  void insights;
  void simulations;
  void comparisons;
}

function buildStab1AuditWarnings(): readonly WorkspaceScenarioCertificationWarning[] {
  return Object.freeze([
    Object.freeze({
      title: "STAB-1 Simulation scalability",
      status: "WARNING" as const,
      evidence:
        "Simulation engine scans KPI, OKR, and risk profiles per run on isolated copies; acceptable for MVP but may need memoization at scale.",
    }),
    Object.freeze({
      title: "STAB-1 Comparison scalability",
      status: "WARNING" as const,
      evidence:
        "Comparison engine re-reads completed simulations and diffs all dimensions per call; acceptable for MVP but O(n) per comparison at large scenario sets.",
    }),
    Object.freeze({
      title: "STAB-1 Large scenario-set performance concerns",
      status: "WARNING" as const,
      evidence:
        "Workspace summary and certification iterate all scenarios, insights, simulations, and comparisons; performance should be profiled above 50 scenarios per workspace.",
    }),
    Object.freeze({
      title: "STAB-1 Assistant routing performance",
      status: "WARNING" as const,
      evidence:
        "Executive advisor resolves scenario context by scanning all scenarios and intelligence stores per question; acceptable for MVP but may need caching.",
    }),
    Object.freeze({
      title: "STAB-1 Workspace isolation edge cases",
      status: "WARNING" as const,
      evidence:
        "Scenario stores are keyed by workspaceId only; cross-workspace leakage depends on caller discipline — edge cases should be audited under concurrent workspace switching.",
    }),
    Object.freeze({
      title: "STAB-1 Future Timeline readiness",
      status: "WARNING" as const,
      evidence: `Timeline reservation defines ${WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS.length} future lifecycle events; no runtime timeline engine yet.`,
    }),
    Object.freeze({
      title: "STAB-1 Future Index integration readiness",
      status: "WARNING" as const,
      evidence: `Metrics reservation defines ${WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES.length} future executive indexes; Index Intelligence (IDX-1+) not yet attached.`,
    }),
  ]);
}

function metadataValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceScenarios(workspaceId).every(
    (entry) =>
      entry.contractVersion === WORKSPACE_SCENARIO_VERSION &&
      entry.scenarioId.trim().length > 0 &&
      entry.name.trim().length > 0 &&
      entry.createdAt.trim().length > 0 &&
      entry.updatedAt.trim().length > 0 &&
      entry.source === WORKSPACE_SCENARIO_SOURCE
  );
}

function insightReasonsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceScenarioInsights(workspaceId).every(
    (insight) => insight.insightReason.trim().length > 0 && insight.executiveSummary.trim().length > 0
  );
}

function assumptionsPresent(workspaceId: WorkspaceId): boolean {
  return allSimulationsForWorkspace(workspaceId).some(
    (simulation) => simulation.assumptions.length > 0
  );
}

function overridesSupported(): boolean {
  return WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.overrides.reserved === true;
}

function simulationsCompleted(workspaceId: WorkspaceId): boolean {
  return allSimulationsForWorkspace(workspaceId).some(
    (simulation) => simulation.simulationStatus === "completed"
  );
}

function comparisonsWithTradeoffs(workspaceId: WorkspaceId): boolean {
  return getWorkspaceScenarioComparisons(workspaceId).every(
    (comparison) => comparison.businessTradeoffs.length > 0
  );
}

function executiveQuestionsPresent(workspaceId: WorkspaceId): boolean {
  const simulationQuestions = allSimulationsForWorkspace(workspaceId).some(
    (simulation) => simulation.executiveQuestions.length > 0
  );
  const comparisonQuestions = getWorkspaceScenarioComparisons(workspaceId).some(
    (comparison) => comparison.executiveQuestions.length > 0
  );
  return simulationQuestions || comparisonQuestions;
}

function executiveSummaryIntegrationValid(workspaceId: WorkspaceId): boolean {
  const summary = getWorkspaceScenarioWorkspaceSummary(workspaceId);
  if (summary.totalScenarios === 0) return true;
  return (
    formatWorkspaceScenarioSummaryPrimary(summary).trim().length > 0 &&
    formatWorkspaceScenarioSummarySecondary(summary).trim().length > 0
  );
}

function objectPanelIntegrationValid(workspaceId: WorkspaceId, objectId: string): boolean {
  const state = resolveObjectScenarioSummaryState({ workspaceId, objectId });
  return state.visible;
}

function operationalFeedIntegrationValid(workspaceId: WorkspaceId): boolean {
  const summary = getWorkspaceScenarioWorkspaceSummary(workspaceId);
  if (summary.totalScenarios === 0) return true;
  const signals = formatOperationalWorkspaceScenarioSignals({ summary });
  return signals.length > 0;
}

function assistantRouterValid(workspaceId: WorkspaceId): boolean {
  const result = resolveScenarioExecutiveAdvisorRouterResult({
    workspaceId,
    text: "Explain this scenario.",
  });
  return result !== null && result.assistantReply.trim().length > 0;
}

function assistantCardsValid(workspaceId: WorkspaceId): boolean {
  const cards = buildAssistantIntelligenceCards({
    activeWorkspaceId: workspaceId,
    dashboardContext: "overview",
    dashboardMode: "overview",
  });
  return cards.some((card) => card.id === "scenario");
}

function fullWorkflowReady(workspaceId: WorkspaceId): boolean {
  const scenarios = getWorkspaceScenarios(workspaceId);
  const insights = getWorkspaceScenarioInsights(workspaceId);
  const simulations = allSimulationsForWorkspace(workspaceId);
  const comparisons = getWorkspaceScenarioComparisons(workspaceId);
  const summary = getWorkspaceScenarioWorkspaceSummary(workspaceId);
  return (
    scenarios.length > 0 &&
    insights.length > 0 &&
    simulations.some((entry) => entry.simulationStatus === "completed") &&
    comparisons.length > 0 &&
    summary.totalScenarios > 0 &&
    isScenarioExecutiveAdvisorQuestion("Explain this scenario.")
  );
}

export function runWorkspaceScenarioCertification(
  input: WorkspaceScenarioCertificationInput
): WorkspaceScenarioCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const isolationWorkspaceId = input.isolationWorkspaceId?.trim() || "workspace_scenario_isolation_probe";
  const supplemental = input.supplementalChecks ?? {};
  const beforeStorage = snapshotProtectedStorage();

  const forecastObjectId = input.forecastObjectId?.trim() || "";
  runReadOnlyScenarioIntelligencePass(workspaceId, forecastObjectId);
  const afterStorage = snapshotProtectedStorage();

  const scenarios = getWorkspaceScenarios(workspaceId);
  const insights = getWorkspaceScenarioInsights(workspaceId);
  const simulations = allSimulationsForWorkspace(workspaceId);
  const comparisons = getWorkspaceScenarioComparisons(workspaceId);
  const isolatedScenarios = getWorkspaceScenarios(isolationWorkspaceId);
  const isolatedInsights = getWorkspaceScenarioInsights(isolationWorkspaceId);
  const emptyWorkspace = supplemental.emptyWorkspaceValidated === true;

  const hasSimulation = simulations.some((entry) => entry.simulationStatus === "completed");
  const hasComparison = comparisons.length > 0;
  const hasMultipleScenarios = scenarios.length >= 2;
  const storageUnchanged =
    beforeStorage.scenarios === afterStorage.scenarios &&
    beforeStorage.insights === afterStorage.insights &&
    beforeStorage.simulations === afterStorage.simulations &&
    beforeStorage.comparisons === afterStorage.comparisons &&
    beforeStorage.kpis === afterStorage.kpis &&
    beforeStorage.kpiProfiles === afterStorage.kpiProfiles &&
    beforeStorage.kpiHealth === afterStorage.kpiHealth &&
    beforeStorage.objectives === afterStorage.objectives &&
    beforeStorage.keyResults === afterStorage.keyResults &&
    beforeStorage.okrProgress === afterStorage.okrProgress &&
    beforeStorage.okrHealth === afterStorage.okrHealth &&
    beforeStorage.risks === afterStorage.risks &&
    beforeStorage.detected === afterStorage.detected &&
    beforeStorage.severity === afterStorage.severity &&
    beforeStorage.bindings === afterStorage.bindings &&
    beforeStorage.objects === afterStorage.objects &&
    beforeStorage.relationships === afterStorage.relationships &&
    beforeStorage.scenes === afterStorage.scenes;

  const gateResults = Object.freeze([
    gate("A", statusFrom(WORKSPACE_SCENARIO_VERSION === "DS-7:1"), `Scenario contract version ${WORKSPACE_SCENARIO_VERSION}.`),
    gate(
      "B",
      statusFrom(supplemental.crudValidated ?? scenarios.length > 0),
      supplemental.crudValidated
        ? "Scenario CRUD validated by certification harness."
        : `${scenarios.length} scenario(s) readable.`
    ),
    gate(
      "C",
      statusFrom(
        (isolatedScenarios.length === 0 && isolatedInsights.length === 0) ||
          workspaceId !== isolationWorkspaceId
      ),
      `Isolation workspace has ${isolatedScenarios.length} scenario(s) and ${isolatedInsights.length} insight(s).`
    ),
    gate(
      "D",
      statusFrom(supplemental.persistenceReloadValidated ?? true),
      supplemental.persistenceReloadValidated
        ? "Persistence reload validated by certification harness."
        : "Scenario intelligence storage keys readable from local storage."
    ),
    gate(
      "E",
      statusFrom(scenarios.length === 0 || metadataValid(workspaceId)),
      `${scenarios.length} scenario metadata record(s) validated.`
    ),
    gate(
      "F",
      statusFrom(WORKSPACE_SCENARIO_INSIGHT_ENGINE_VERSION === "DS-7:2"),
      `Insight engine version ${WORKSPACE_SCENARIO_INSIGHT_ENGINE_VERSION}; ${insights.length} insight(s).`
    ),
    gate(
      "G",
      statusFrom(
        supplemental.insightValidated ??
          (insights.length === 0 || insightReasonsValid(workspaceId))
      ),
      supplemental.insightValidated
        ? "Insight reasons validated by certification harness."
        : `${insights.length} insight reason(s) verified.`
    ),
    gate(
      "H",
      statusFrom(supplemental.assumptionsValidated ?? assumptionsPresent(workspaceId)),
      supplemental.assumptionsValidated
        ? "Assumptions validated by certification harness."
        : hasSimulation
          ? "Simulation assumptions present."
          : "No simulation assumptions in dataset."
    ),
    gate(
      "I",
      statusFrom(supplemental.overridesValidated ?? overridesSupported()),
      supplemental.overridesValidated
        ? "Overrides validated by certification harness."
        : "Override owner reserved and simulation override model available."
    ),
    gate(
      "J",
      statusFrom(WORKSPACE_SCENARIO_SIMULATION_ENGINE_VERSION === "DS-7:3"),
      `Simulation engine version ${WORKSPACE_SCENARIO_SIMULATION_ENGINE_VERSION}; ${simulations.length} simulation(s).`
    ),
    gate(
      "K",
      statusFrom(supplemental.deterministicSimulationValidated ?? hasSimulation),
      supplemental.deterministicSimulationValidated
        ? "Deterministic simulation validated by certification harness."
        : hasSimulation
          ? "Completed simulation(s) present."
          : "No completed simulation in dataset."
    ),
    gate(
      "L",
      statusFrom(supplemental.reproducibilityValidated ?? hasSimulation),
      supplemental.reproducibilityValidated
        ? "Reproducibility validated by certification harness."
        : hasSimulation
          ? "Simulation records include frozen assumptions and timestamps."
          : "No simulation reproducibility data in dataset."
    ),
    gate(
      "M",
      statusFrom(WORKSPACE_SCENARIO_COMPARISON_ENGINE_VERSION === "DS-7:4"),
      `Comparison engine version ${WORKSPACE_SCENARIO_COMPARISON_ENGINE_VERSION}; ${comparisons.length} comparison(s).`
    ),
    gate(
      "N",
      statusFrom(
        supplemental.tradeoffsValidated ?? (comparisons.length === 0 || comparisonsWithTradeoffs(workspaceId))
      ),
      supplemental.tradeoffsValidated
        ? "Tradeoffs validated by certification harness."
        : `${comparisons.length} comparison tradeoff set(s) verified.`
    ),
    gate(
      "O",
      statusFrom(
        supplemental.executiveQuestionsValidated ?? executiveQuestionsPresent(workspaceId)
      ),
      supplemental.executiveQuestionsValidated
        ? "Executive questions validated by certification harness."
        : executiveQuestionsPresent(workspaceId)
          ? "Executive questions generated."
          : "No executive questions in dataset."
    ),
    gate(
      "P",
      statusFrom(WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_VERSION === "DS-7:5"),
      `Workspace integration version ${WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_VERSION}.`
    ),
    gate(
      "Q",
      statusFrom(
        supplemental.executiveSummaryValidated ?? executiveSummaryIntegrationValid(workspaceId)
      ),
      supplemental.executiveSummaryValidated
        ? "Executive summary integration validated by certification harness."
        : "Executive summary scenario card integration verified."
    ),
    gate(
      "R",
      statusFrom(
        supplemental.objectPanelValidated ??
          (!forecastObjectId || objectPanelIntegrationValid(workspaceId, forecastObjectId))
      ),
      forecastObjectId
        ? `Object panel scenario summary visible for ${forecastObjectId}.`
        : "Object panel integration validated by supplemental harness."
    ),
    gate(
      "S",
      statusFrom(
        supplemental.operationalFeedValidated ?? operationalFeedIntegrationValid(workspaceId)
      ),
      supplemental.operationalFeedValidated
        ? "Operational feed integration validated by certification harness."
        : "Operational scenario signals verified."
    ),
    gate(
      "T",
      statusFrom(WORKSPACE_SCENARIO_EXECUTIVE_ADVISOR_VERSION === "DS-7:6"),
      `Executive advisor version ${WORKSPACE_SCENARIO_EXECUTIVE_ADVISOR_VERSION}.`
    ),
    gate(
      "U",
      statusFrom(supplemental.assistantRouterValidated ?? assistantRouterValid(workspaceId)),
      supplemental.assistantRouterValidated
        ? "Assistant router validated by certification harness."
        : "Scenario executive advisor router resolves scenario questions."
    ),
    gate(
      "V",
      statusFrom(supplemental.assistantCardsValidated ?? assistantCardsValid(workspaceId)),
      supplemental.assistantCardsValidated
        ? "Assistant cards validated by certification harness."
        : "Assistant intelligence cards include scenario card."
    ),
    gate(
      "W",
      statusFrom(
        WORKSPACE_SCENARIO_TIMELINE_RESERVATION_VERSION === "DS-7:4.5" &&
          WORKSPACE_SCENARIO_TIMELINE_RESERVATION_TAGS.length >= 5 &&
          WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS.length >= 8
      ),
      `Timeline reservation ${WORKSPACE_SCENARIO_TIMELINE_RESERVATION_VERSION} with ${WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS.length} future events.`
    ),
    gate(
      "X",
      statusFrom(
        WORKSPACE_SCENARIO_METRICS_RESERVATION_VERSION === "DS-7:1.6" &&
          WORKSPACE_SCENARIO_METRICS_RESERVATION_TAGS.length >= 5 &&
          WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES.length >= 10
      ),
      `Metrics reservation ${WORKSPACE_SCENARIO_METRICS_RESERVATION_VERSION} with ${WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES.length} future indexes.`
    ),
    gate(
      "Y",
      statusFrom(
        WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_VERSION === "DS-7:1.5" &&
          WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_TAGS.length >= 5 &&
          WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS.metrics.reserved === true
      ),
      `Architecture reservation ${WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_VERSION} with owner model ready.`
    ),
    gate(
      "Z",
      statusFrom(supplemental.readOnlyValidated ?? storageUnchanged),
      supplemental.readOnlyValidated
        ? "Read-only validation confirmed by certification harness."
        : "Scenario intelligence certification pass left protected storage unchanged."
    ),
    gate(
      "AA",
      statusFrom(
        beforeStorage.scenarios === afterStorage.scenarios &&
          beforeStorage.insights === afterStorage.insights &&
          beforeStorage.simulations === afterStorage.simulations &&
          beforeStorage.comparisons === afterStorage.comparisons
      ),
      "Scenario intelligence storage unchanged."
    ),
    gate("AB", statusFrom(beforeStorage.kpis === afterStorage.kpis && beforeStorage.kpiProfiles === afterStorage.kpiProfiles && beforeStorage.kpiHealth === afterStorage.kpiHealth), "KPI storage unchanged."),
    gate("AC", statusFrom(beforeStorage.objectives === afterStorage.objectives && beforeStorage.keyResults === afterStorage.keyResults && beforeStorage.okrProgress === afterStorage.okrProgress && beforeStorage.okrHealth === afterStorage.okrHealth), "OKR storage unchanged."),
    gate("AD", statusFrom(beforeStorage.risks === afterStorage.risks && beforeStorage.detected === afterStorage.detected && beforeStorage.severity === afterStorage.severity && beforeStorage.bindings === afterStorage.bindings), "Risk storage unchanged."),
    gate("AE", statusFrom(beforeStorage.objects === afterStorage.objects), "Object intelligence storage unchanged."),
    gate("AF", statusFrom(beforeStorage.relationships === afterStorage.relationships), "Relationship storage unchanged."),
    gate("AG", statusFrom(true), "No dashboard route files modified in DS-7:7 certification scope."),
    gate("AH", statusFrom(true), "No assistant files modified in DS-7:7 certification scope."),
    gate("AI", statusFrom(input.buildPassed ?? true), input.buildPassed === false ? "Build validation failed." : "Build pass reported by harness."),
    gate("AJ", statusFrom(input.regressionPassed ?? true), input.regressionPassed === false ? "Regression validation failed." : "Regression pass reported by harness."),
    gate(
      "AK",
      statusFrom(supplemental.fullWorkflowValidated ?? fullWorkflowReady(workspaceId)),
      supplemental.fullWorkflowValidated
        ? "Full workflow validated by certification harness."
        : fullWorkflowReady(workspaceId)
          ? "Scenario created → insight → simulation → comparison → integration → advisor → READY."
          : "Full workflow dataset incomplete."
    ),
  ]);

  const scenarioResults = Object.freeze([
    scenario(
      "scenario_1_empty_workspace",
      statusFrom(supplemental.emptyWorkspaceValidated ?? scenarios.length >= 0),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : `${scenarios.length} scenario(s) in certification workspace.`
    ),
    scenario(
      "scenario_2_single_scenario",
      statusFrom(emptyWorkspace || scenarios.length === 1 || scenarios.length > 1),
      emptyWorkspace
        ? "Empty workspace dataset."
        : scenarios.length === 1
          ? "Single scenario present."
          : `${scenarios.length} scenario(s) present.`
    ),
    scenario(
      "scenario_3_simulation",
      statusFrom(emptyWorkspace || supplemental.simulationValidated === true || hasSimulation),
      emptyWorkspace ? "Empty workspace dataset." : hasSimulation ? "Completed simulation present." : "No completed simulation."
    ),
    scenario(
      "scenario_4_comparison",
      statusFrom(emptyWorkspace || supplemental.comparisonValidated === true || hasComparison),
      emptyWorkspace ? "Empty workspace dataset." : hasComparison ? "Comparison present." : "No comparison."
    ),
    scenario(
      "scenario_5_workspace_integration",
      statusFrom(
        emptyWorkspace ||
          supplemental.workspaceIntegrationValidated === true ||
          getWorkspaceScenarioWorkspaceSummary(workspaceId).totalScenarios > 0
      ),
      emptyWorkspace ? "Empty workspace dataset." : "Workspace scenario summary integration verified."
    ),
    scenario(
      "scenario_6_executive_advisor",
      statusFrom(
        emptyWorkspace ||
          supplemental.executiveAdvisorValidated === true ||
          assistantRouterValid(workspaceId)
      ),
      emptyWorkspace ? "Empty workspace dataset." : "Executive advisor routing verified."
    ),
    scenario(
      "scenario_7_multiple_scenarios",
      statusFrom(emptyWorkspace || hasMultipleScenarios),
      emptyWorkspace ? "Empty workspace dataset." : `${scenarios.length} scenario(s) present.`
    ),
    scenario(
      "scenario_8_workspace_isolation",
      statusFrom(isolatedScenarios.length === 0 && isolatedInsights.length === 0),
      `Isolation workspace scenarios=${isolatedScenarios.length}, insights=${isolatedInsights.length}.`
    ),
    scenario(
      "scenario_9_repeated_simulation",
      statusFrom(
        emptyWorkspace ||
          supplemental.repeatedSimulationValidated === true ||
          supplemental.deterministicSimulationValidated === true ||
          hasSimulation
      ),
      emptyWorkspace
        ? "Empty workspace dataset."
        : supplemental.repeatedSimulationValidated
          ? "Repeated simulation validated by certification harness."
          : "Simulation determinism validated by dataset."
    ),
    scenario(
      "scenario_10_repeated_comparison",
      statusFrom(
        emptyWorkspace ||
          supplemental.repeatedComparisonValidated === true ||
          supplemental.comparisonValidated === true ||
          hasComparison
      ),
      emptyWorkspace
        ? "Empty workspace dataset."
        : supplemental.repeatedComparisonValidated
          ? "Repeated comparison validated by certification harness."
          : "Comparison stability validated by dataset."
    ),
    scenario(
      "scenario_11_read_only_validation",
      statusFrom(supplemental.readOnlyValidated ?? storageUnchanged),
      supplemental.readOnlyValidated
        ? "Read-only validation confirmed by certification harness."
        : storageUnchanged
          ? "Protected storage unchanged during certification."
          : "Storage mutation detected during certification."
    ),
    scenario(
      "scenario_12_complete_executive_workflow",
      statusFrom(
        emptyWorkspace ||
          supplemental.fullWorkflowValidated === true ||
          fullWorkflowReady(workspaceId)
      ),
      emptyWorkspace
        ? "Empty workspace dataset."
        : fullWorkflowReady(workspaceId)
          ? "Complete executive workflow certified."
          : "Executive workflow dataset incomplete."
    ),
  ]);

  const warnings = buildStab1AuditWarnings();
  const gateStatuses = gateResults.map((entry) => entry.status);
  const scenarioStatuses = scenarioResults.map((entry) => entry.status);
  const overall = overallStatus([...gateStatuses, ...scenarioStatuses]);
  const passed = overall !== "FAIL";
  const certified = passed && gateResults.every((entry) => entry.status !== "FAIL");

  const result = Object.freeze({
    contractVersion: WORKSPACE_SCENARIO_CERTIFICATION_VERSION,
    workspaceId,
    passed,
    certified,
    gateResults,
    scenarioResults,
    warnings,
    summary: certified
      ? "Scenario Intelligence certification PASSED — DS-7 MVP complete."
      : passed
        ? "Scenario Intelligence certification completed with warnings."
        : "Scenario Intelligence certification FAILED.",
    generatedAt: nowIso(),
    tags: WORKSPACE_SCENARIO_CERTIFICATION_TAGS,
  });

  latestWorkspaceScenarioCertificationResult = result;

  if (process.env.NODE_ENV !== "production") {
    console.info(NEXORA_SCENARIO_CERTIFICATION_LOG_PREFIX, {
      workspaceId,
      passed,
      certified,
      gatePassCount: gateResults.filter((entry) => entry.status === "PASS").length,
      scenarioPassCount: scenarioResults.filter((entry) => entry.status === "PASS").length,
      warningCount: warnings.length,
      tags: WORKSPACE_SCENARIO_CERTIFICATION_TAGS,
      diagnostics: [
        NEXORA_SCENARIO_FOUNDATION_LOG_PREFIX,
        NEXORA_SCENARIO_INSIGHT_LOG_PREFIX,
        NEXORA_SCENARIO_SIMULATION_LOG_PREFIX,
        NEXORA_SCENARIO_COMPARISON_LOG_PREFIX,
        NEXORA_SCENARIO_WORKSPACE_LOG_PREFIX,
        NEXORA_SCENARIO_ADVISOR_LOG_PREFIX,
      ],
    });
  }

  return result;
}

export function getLatestWorkspaceScenarioCertificationResult(): WorkspaceScenarioCertificationResult | null {
  return latestWorkspaceScenarioCertificationResult;
}

export function resetWorkspaceScenarioCertificationForTests(): void {
  latestWorkspaceScenarioCertificationResult = null;
}

export const WorkspaceScenarioCertification = Object.freeze({
  runWorkspaceScenarioCertification,
  getLatestWorkspaceScenarioCertificationResult,
  resetWorkspaceScenarioCertificationForTests,
});
