import test from "node:test";
import assert from "node:assert/strict";

import type { KpiIntelligenceRegistry } from "../kpi-intelligence/kpiIntelligenceContract.ts";
import type { ObjectIntelligenceRegistry } from "../object-intelligence/objectIntelligenceContract.ts";
import type { RelationshipIntelligenceRegistry } from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import type { RiskIntelligenceRegistry } from "../risk-intelligence/riskIntelligenceContract.ts";
import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
} from "../scenario-authoring/ScenarioComparisonContract.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  type ExecutiveSimulationSummary,
} from "../scenario-authoring/simulationResultAggregatorContract.ts";
import { buildWarRoomPriority, buildWarRoomSignal } from "../warroom/WarRoomContract.ts";
import {
  attachDashboardDecisionBinding,
  resetDecisionRecommendationBindingBridgeForTests,
} from "../dashboard/decision/decisionRecommendationBindingBridge.ts";
import {
  explainDecisionRecommendation,
  AssistantDecisionBridge,
  getAssistantDecisionBindingResult,
  resetAssistantDecisionBindingForTests,
} from "./AssistantDecisionBridge.ts";
import { aggregateDecisionInputs } from "./DecisionInputAggregator.ts";
import {
  buildDecisionExplanationResult,
  resetDecisionExplanationBuilderForTests,
} from "./DecisionExplanationBuilder.ts";
import {
  D1_BINDING_COMPLETE_TAG,
  DASHBOARD_DECISION_BINDING_DIAGNOSTIC,
  ASSISTANT_DECISION_BINDING_DIAGNOSTIC,
  type DecisionBindingBuildInput,
} from "./decisionBindingContract.ts";
import {
  DashboardDecisionBinding,
  getDashboardDecisionBindingResult,
  resolveDashboardDecisionBinding,
  resetDashboardDecisionBindingForTests,
} from "./DashboardDecisionBinding.ts";
import { buildDecisionOption } from "./DecisionRecommendationContract.ts";
import { scoreDecisionOptions, resetOptionScoringEngineForTests } from "./OptionScoringEngine.ts";
import { generateExecutiveRecommendation, resetRecommendationEngineForTests } from "./RecommendationEngine.ts";
import { analyzeTradeoffs, resetTradeoffAnalysisEngineForTests } from "./TradeoffAnalysisEngine.ts";

const boundAt = "2026-06-18T07:00:00.000Z";

function objectRegistry(): ObjectIntelligenceRegistry {
  const profile = Object.freeze({
    objectId: "object-1",
    label: "Supplier",
    objectType: "supplier",
    source: "scene" as const,
    health: 42,
    impact: 77,
    confidence: 81,
    importance: 90,
    trend: "declining" as const,
  });
  return Object.freeze({
    version: "3.1.0",
    profiles: Object.freeze([profile]),
    profileByObjectId: Object.freeze({ [profile.objectId]: profile }),
    objectCount: 1,
    sceneMutation: false,
    simulation: false,
    diagnostics: Object.freeze(["[OBJECT_INTELLIGENCE_RUNTIME]", "[OBJECT_INTELLIGENCE_PROFILE_CREATED]"]),
  });
}

function relationshipRegistry(): RelationshipIntelligenceRegistry {
  const profile = Object.freeze({
    relationshipId: "rel-1",
    sourceId: "object-1",
    targetId: "object-2",
    relationshipType: "depends_on",
    strength: 80,
    dependency: 84,
    influence: 72,
    confidence: 78,
    riskExposure: 73,
  });
  return Object.freeze({
    version: "4.1.0",
    profiles: Object.freeze([profile]),
    profileByRelationshipId: Object.freeze({ [profile.relationshipId]: profile }),
    relationshipCount: 1,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: Object.freeze(["[RELATIONSHIP_INTELLIGENCE_RUNTIME]", "[RELATIONSHIP_INTELLIGENCE_READY]"]),
  });
}

function kpiRegistry(): KpiIntelligenceRegistry {
  const profile = Object.freeze({
    kpiId: "kpi-1",
    label: "Revenue",
    category: "Revenue" as const,
    value: 90,
    target: 100,
    intelligenceScore: 41,
    confidence: 88,
    direction: "down" as const,
    source: "runtime" as const,
  });
  return Object.freeze({
    version: "5.1.0",
    profiles: Object.freeze([profile]),
    profileByKpiId: Object.freeze({ [profile.kpiId]: profile }),
    kpiCount: 1,
    supportedCategories: Object.freeze(["Revenue"]),
    visualRendering: false,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: Object.freeze(["[KPI_INTELLIGENCE_RUNTIME]", "[KPI_INTELLIGENCE_READY]"]),
  });
}

function riskRegistry(): RiskIntelligenceRegistry {
  const profile = Object.freeze({
    riskId: "risk-1",
    subjectId: "object-1",
    label: "Supplier continuity",
    primaryCategory: "supply" as const,
    primaryCategoryLabel: "Supply Risk" as const,
    severity: 91,
    exposure: 86,
    confidence: 83,
    momentum: "worsening" as const,
    categories: Object.freeze({
      operationalRisk: 50,
      financialRisk: 20,
      scheduleRisk: 30,
      dependencyRisk: 70,
      supplyRisk: 91,
      strategicRisk: 42,
    }),
  });
  return Object.freeze({
    version: "6.1.0",
    profiles: Object.freeze([profile]),
    profileByRiskId: Object.freeze({ [profile.riskId]: profile }),
    profileBySubjectId: Object.freeze({ [profile.subjectId]: profile }),
    riskCount: 1,
    sceneMutation: false,
    routingMutation: false,
    simulation: false,
    diagnostics: Object.freeze(["[RISK_INTELLIGENCE_RUNTIME]", "[RISK_INTELLIGENCE_READY]"]),
  });
}

function scenarioResult(): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    overallScenarioImpact: 72,
    confidence: 80,
    objectCount: 2,
    relationshipCount: 1,
    kpiCount: 1,
    riskCount: 1,
    kpiMovement: Object.freeze({ direction: "positive", delta: 8, confidence: 76 }),
    riskMovement: Object.freeze({ direction: "negative", delta: 6, confidence: 74 }),
    keyPositiveEffects: Object.freeze(["Object simulation confidence remains strong."]),
    keyNegativeEffects: Object.freeze(["Risk movement remains elevated."]),
  });
}

function comparisonResult() {
  const request = buildScenarioComparisonRequest({
    comparisonId: "compare-1",
    mode: "scenario_vs_scenario",
    scenarioA: {
      scenarioId: "scenario-a",
      label: "Scenario A",
      summary: EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
      baseline: false,
    },
    scenarioB: {
      scenarioId: "scenario-b",
      label: "Scenario B",
      summary: EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
      baseline: false,
    },
  });
  const difference = buildScenarioDifferenceProfile({
    differenceId: "diff-1",
    category: "risk",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 4,
    riskMovementDelta: 9,
    kpiMovementDelta: 0,
    confidenceDelta: 3,
    objectCountDelta: 0,
    relationshipCountDelta: 0,
    kpiCountDelta: 0,
    riskCountDelta: 1,
    advantage: "scenarioB",
    summary: "Scenario B reduces risk exposure.",
  });
  return buildScenarioComparisonResult({
    request,
    differences: [difference],
    primaryDifference: difference,
  });
}

function buildBindingInput(): DecisionBindingBuildInput {
  const inputProfile = aggregateDecisionInputs({
    profileId: "decision-input-binding",
    generatedAt: boundAt,
    objectIntelligence: objectRegistry(),
    relationshipIntelligence: relationshipRegistry(),
    kpiIntelligence: kpiRegistry(),
    riskIntelligence: riskRegistry(),
    scenarioResults: [scenarioResult()],
    compareResults: [comparisonResult()],
    warRoomSignals: Object.freeze([
      buildWarRoomSignal({
        signalId: "signal-critical",
        source: "risk",
        sourceId: "risk-1",
        severity: "critical",
        title: "Supplier risk elevated",
        detail: "Critical supplier risk signal.",
        confidence: 91,
        timestamp: boundAt,
      }),
    ]),
  });

  const options = Object.freeze([
    buildDecisionOption({
      optionId: "option-stabilize",
      label: "Stabilize supplier risk",
      summary: "Reduce supplier exposure immediately.",
      category: "stabilize",
    }),
    buildDecisionOption({
      optionId: "option-monitor",
      label: "Monitor supplier risk",
      summary: "Continue monitoring without immediate action.",
      category: "monitor",
    }),
  ]);

  const scoringResult = scoreDecisionOptions({
    evaluatedAt: boundAt,
    options,
    inputProfile,
  });

  const tradeoffProfile = analyzeTradeoffs({
    profileId: "tradeoff-profile-binding",
    evaluatedAt: boundAt,
    options,
    scores: scoringResult.scores,
  });

  const recommendation = generateExecutiveRecommendation({
    recommendationId: "recommendation-binding",
    generatedAt: boundAt,
    options,
    scores: scoringResult.scores,
    tradeoffProfile,
    warRoomPriorities: Object.freeze([
      buildWarRoomPriority({
        priorityId: "priority-critical",
        level: "critical",
        rank: 1,
        title: "Stabilize supplier risk",
        rationale: "Critical supplier risk requires executive attention.",
        relatedSignalIds: ["signal-critical"],
        relatedAlertIds: [],
      }),
    ]),
  });

  const explanation = buildDecisionExplanationResult({
    explanationId: "explanation-binding",
    generatedAt: boundAt,
    recommendation,
    tradeoffProfile,
  });

  return Object.freeze({
    boundAt,
    recommendation,
    tradeoffProfile,
    explanation,
  });
}

test.beforeEach(() => {
  resetDecisionRecommendationBindingBridgeForTests();
  resetDashboardDecisionBindingForTests();
  resetAssistantDecisionBindingForTests();
  resetDecisionExplanationBuilderForTests();
  resetRecommendationEngineForTests();
  resetTradeoffAnalysisEngineForTests();
  resetOptionScoringEngineForTests();
});

test("exports D1 binding tag and diagnostics", () => {
  assert.equal(D1_BINDING_COMPLETE_TAG, "[D1_BINDING_COMPLETE]");
  assert.equal(DASHBOARD_DECISION_BINDING_DIAGNOSTIC, "[DASHBOARD_DECISION_BINDING]");
  assert.equal(ASSISTANT_DECISION_BINDING_DIAGNOSTIC, "[ASSISTANT_DECISION_BINDING]");
  assert.equal(DashboardDecisionBinding.diagnostic, "[DASHBOARD_DECISION_BINDING]");
  assert.equal(AssistantDecisionBridge.diagnostic, "[ASSISTANT_DECISION_BINDING]");
});

test("binds dashboard recommended option alternatives scores tradeoffs and ranking", () => {
  const input = buildBindingInput();
  const dashboard = resolveDashboardDecisionBinding(input);

  assert.equal(dashboard.bindingStatus, "bound");
  assert.equal(dashboard.executesRecommendations, false);
  assert.equal(dashboard.sourceMutation, false);
  assert.equal(dashboard.view?.recommendedOption?.optionId, "option-stabilize");
  assert.equal(dashboard.view?.alternativeOptions.length, 1);
  assert.equal(dashboard.view?.scores.length, 2);
  assert.equal(dashboard.view?.tradeoffs.length >= 1, true);
  assert.equal(dashboard.view?.ranking.length, 2);
  assert.equal(dashboard.view?.ranking[0]?.rank, 1);
  assert.equal(Object.isFrozen(dashboard), true);
  assert.equal(Object.isFrozen(dashboard.view), true);
  assert.equal(getDashboardDecisionBindingResult(), dashboard);
});

test("binds assistant recommendation tradeoff and reasoning explanations", () => {
  const input = buildBindingInput();
  const assistant = explainDecisionRecommendation(input);

  assert.equal(assistant.actionExecution, false);
  assert.equal(assistant.sourceMutation, false);
  assert.equal(assistant.view?.recommendationExplanation.kind, "recommendation");
  assert.equal(assistant.view?.tradeoffExplanations.length >= 1, true);
  assert.equal(assistant.view?.tradeoffExplanations[0]?.kind, "tradeoff");
  assert.equal(assistant.view?.reasoningExplanation.kind, "reasoning");
  assert.equal(assistant.view?.explanationCount >= 3, true);
  assert.equal(Object.isFrozen(assistant), true);
  assert.equal(getAssistantDecisionBindingResult(), assistant);
});

test("attaches dashboard and assistant bindings without mutating source inputs", () => {
  const input = buildBindingInput();
  const context = Object.freeze({
    objectId: "object-1",
    objectName: "Supplier",
    decisionBinding: null,
    assistantDecisionBinding: null,
  });
  const before = JSON.stringify({ input, context });

  const attached = attachDashboardDecisionBinding(context, input);

  assert.equal(attached?.decisionBinding?.recommendedOption?.optionId, "option-stabilize");
  assert.equal(attached?.assistantDecisionBinding?.recommendationExplanation.kind, "recommendation");
  assert.equal(attached?.decisionBinding?.executesRecommendations, false);
  assert.equal(attached?.assistantDecisionBinding?.actionExecution, false);
  assert.equal(JSON.stringify({ input, context }), before);
  assert.equal(Object.isFrozen(attached), true);
});
