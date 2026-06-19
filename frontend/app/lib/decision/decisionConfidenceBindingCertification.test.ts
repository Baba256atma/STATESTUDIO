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
import { buildWarRoomSignal } from "../warroom/WarRoomContract.ts";
import {
  attachDashboardConfidenceBinding,
  resetDecisionConfidenceBindingBridgeForTests,
} from "../dashboard/decision/decisionConfidenceBindingBridge.ts";
import {
  explainDecisionConfidence,
  AssistantConfidenceBridge,
  getAssistantConfidenceBindingResult,
  resetAssistantConfidenceBindingForTests,
} from "./AssistantConfidenceBridge.ts";
import { aggregateDecisionInputs } from "./DecisionInputAggregator.ts";
import {
  buildConfidenceExplanationResult,
  resetConfidenceExplanationBuilderForTests,
} from "./ConfidenceExplanationBuilder.ts";
import {
  D2_CONFIDENCE_BINDING_COMPLETE_TAG,
  ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC,
  DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC,
  type DecisionConfidenceBindingBuildInput,
} from "./decisionConfidenceBindingContract.ts";
import {
  DashboardConfidenceBinding,
  getDashboardConfidenceBindingResult,
  resolveDashboardConfidenceBinding,
  resetDashboardConfidenceBindingForTests,
} from "./DashboardConfidenceBinding.ts";
import {
  buildDecisionExplanation,
  buildDecisionOption,
  buildDecisionRecommendation,
} from "./DecisionRecommendationContract.ts";
import { measureEvidenceStrength, resetEvidenceStrengthEngineForTests } from "./EvidenceStrengthEngine.ts";
import { scoreDecisionOptions, resetOptionScoringEngineForTests } from "./OptionScoringEngine.ts";
import {
  buildEvidenceStrengthProfile,
  resetRecommendationConfidenceScoringEngineForTests,
  scoreRecommendationConfidence,
} from "./RecommendationConfidenceScoringEngine.ts";
import { analyzeTradeoffs, resetTradeoffAnalysisEngineForTests } from "./TradeoffAnalysisEngine.ts";
import {
  buildUncertaintyProfile,
  resetUncertaintyDetectionEngineForTests,
} from "./UncertaintyDetectionEngine.ts";

const boundAt = "2026-06-18T08:00:00.000Z";

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
    intelligenceScore: 72,
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
    confidence: 82,
    objectCount: 2,
    relationshipCount: 1,
    kpiCount: 1,
    riskCount: 1,
    kpiMovement: Object.freeze({ direction: "neutral", delta: 0, confidence: 76 }),
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

function buildConfidenceBindingInput(): DecisionConfidenceBindingBuildInput {
  const inputProfile = aggregateDecisionInputs({
    profileId: "decision-input-confidence-binding",
    generatedAt: boundAt,
    objectIntelligence: objectRegistry(),
    relationshipIntelligence: relationshipRegistry(),
    kpiIntelligence: kpiRegistry(),
    riskIntelligence: riskRegistry(),
    scenarioResults: [scenarioResult()],
    compareResults: [comparisonResult()],
    warRoomSignals: Object.freeze([
      buildWarRoomSignal({
        signalId: "signal-watch",
        source: "risk",
        sourceId: "risk-1",
        severity: "watch",
        title: "Supplier risk elevated",
        detail: "Watch supplier risk signal.",
        confidence: 78,
        timestamp: boundAt,
      }),
    ]),
  });
  const option = buildDecisionOption({
    optionId: "option-stabilize",
    label: "Stabilize supplier risk",
    summary: "Reduce supplier exposure immediately.",
    category: "stabilize",
  });
  const scores = scoreDecisionOptions({
    evaluatedAt: boundAt,
    options: Object.freeze([option]),
    inputProfile,
  }).scores;
  const decisionScore = scores[0];
  assert.ok(decisionScore);
  const tradeoff = analyzeTradeoffs({
    profileId: "tradeoff-confidence-binding",
    evaluatedAt: boundAt,
    options: Object.freeze([option]),
    scores,
  });
  const recommendation = buildDecisionRecommendation({
    recommendationId: "recommendation-stabilize",
    rank: 1,
    priority: "critical",
    option,
    score: decisionScore,
    explanation: buildDecisionExplanation({
      explanationId: "explanation-stabilize",
      optionId: option.optionId,
      rationale: "Supplier risk crossed executive threshold.",
      evidenceIds: ["risk-1", "signal-watch", "object-1"],
      tradeoffSummary: "Short-term cost for long-term stability.",
    }),
  });
  const evidenceStrengthScore = measureEvidenceStrength({
    evaluatedAt: boundAt,
    inputProfile,
    recommendation,
    explanation: recommendation.explanation,
  });
  const evidenceStrength = buildEvidenceStrengthProfile(evidenceStrengthScore);
  const uncertainty = buildUncertaintyProfile({
    evaluatedAt: boundAt,
    inputProfile,
    recommendation,
  });
  const confidenceScore = scoreRecommendationConfidence({
    evaluatedAt: boundAt,
    recommendationId: recommendation.recommendationId,
    optionId: option.optionId,
    rank: 1,
    score: decisionScore,
    evidenceStrength,
    uncertainty,
    tradeoff,
  });
  const explanation = buildConfidenceExplanationResult({
    explanationId: "confidence-explanation-binding",
    generatedAt: boundAt,
    recommendationId: recommendation.recommendationId,
    optionLabel: option.label,
    confidenceScore,
    evidenceStrength,
    evidenceStrengthScore,
    uncertainty,
    decisionExplanation: recommendation.explanation,
  });

  return Object.freeze({
    boundAt,
    recommendationId: recommendation.recommendationId,
    optionId: option.optionId,
    optionLabel: option.label,
    confidenceScore,
    evidenceStrength,
    uncertainty,
    explanation,
  });
}

test.beforeEach(() => {
  resetDecisionConfidenceBindingBridgeForTests();
  resetDashboardConfidenceBindingForTests();
  resetAssistantConfidenceBindingForTests();
  resetConfidenceExplanationBuilderForTests();
  resetRecommendationConfidenceScoringEngineForTests();
  resetUncertaintyDetectionEngineForTests();
  resetEvidenceStrengthEngineForTests();
  resetTradeoffAnalysisEngineForTests();
  resetOptionScoringEngineForTests();
});

test("exports D2 confidence binding tag and diagnostics", () => {
  assert.equal(D2_CONFIDENCE_BINDING_COMPLETE_TAG, "[D2_CONFIDENCE_BINDING_COMPLETE]");
  assert.equal(DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC, "[DASHBOARD_CONFIDENCE_BINDING]");
  assert.equal(ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC, "[ASSISTANT_CONFIDENCE_BINDING]");
  assert.equal(DashboardConfidenceBinding.diagnostic, "[DASHBOARD_CONFIDENCE_BINDING]");
  assert.equal(AssistantConfidenceBridge.diagnostic, "[ASSISTANT_CONFIDENCE_BINDING]");
});

test("binds dashboard confidence score level evidence strength and uncertainty warnings", () => {
  const input = buildConfidenceBindingInput();
  const dashboard = resolveDashboardConfidenceBinding(input);

  assert.equal(dashboard.bindingStatus, "bound");
  assert.equal(dashboard.executesDecisions, false);
  assert.equal(dashboard.sourceMutation, false);
  assert.equal(dashboard.view?.confidenceScore, input.confidenceScore.confidenceScore);
  assert.equal(dashboard.view?.confidenceLevel, input.confidenceScore.confidenceLevel);
  assert.equal(dashboard.view?.evidenceStrength, input.evidenceStrength.strengthScore);
  assert.equal(dashboard.view?.uncertaintyWarningCount >= 0, true);
  assert.equal(Object.isFrozen(dashboard), true);
  assert.equal(Object.isFrozen(dashboard.view), true);
  assert.equal(getDashboardConfidenceBindingResult(), dashboard);
});

test("binds assistant confidence level evidence and remaining uncertainty explanations", () => {
  const input = buildConfidenceBindingInput();
  const assistant = explainDecisionConfidence(input);

  assert.equal(assistant.actionExecution, false);
  assert.equal(assistant.sourceMutation, false);
  assert.equal(assistant.view?.confidenceLevelExplanation.kind, "confidence_level");
  assert.equal(assistant.view?.supportingEvidenceExplanations.length >= 1, true);
  assert.equal(assistant.view?.supportingEvidenceExplanations[0]?.kind, "supporting_evidence");
  assert.equal(assistant.view?.remainingUncertaintyExplanation.kind, "remaining_uncertainty");
  assert.equal(assistant.view?.explanationCount >= 3, true);
  assert.equal(Object.isFrozen(assistant), true);
  assert.equal(getAssistantConfidenceBindingResult(), assistant);
});

test("attaches dashboard and assistant confidence bindings without mutating source inputs", () => {
  const input = buildConfidenceBindingInput();
  const context = Object.freeze({
    objectId: "object-1",
    objectName: "Supplier",
    confidenceBinding: null,
    assistantConfidenceBinding: null,
  });
  const before = JSON.stringify({ input, context });

  const attached = attachDashboardConfidenceBinding(context, input);

  assert.equal(JSON.stringify({ input, context }), before);
  assert.equal(attached?.confidenceBinding?.recommendationId, "recommendation-stabilize");
  assert.equal(attached?.assistantConfidenceBinding?.recommendationId, "recommendation-stabilize");
  assert.equal(attached?.confidenceBinding?.executesDecisions, false);
  assert.equal(attached?.assistantConfidenceBinding?.actionExecution, false);
});
