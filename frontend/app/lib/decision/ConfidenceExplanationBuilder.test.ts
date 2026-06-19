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
  buildConfidenceExplanationResult,
  CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTIC,
  CONFIDENCE_EXPLANATION_READY_DIAGNOSTIC,
  CONFIDENCE_EXPLANATION_TEMPLATES,
  ConfidenceExplanationBuilder,
  D2_CONFIDENCE_EXPLANATION_COMPLETE_TAG,
  getConfidenceExplanationResult,
  resetConfidenceExplanationBuilderForTests,
} from "./ConfidenceExplanationBuilder.ts";
import { aggregateDecisionInputs } from "./DecisionInputAggregator.ts";
import { EMPTY_DECISION_INPUT_PROFILE } from "./decisionInputAggregatorContract.ts";
import {
  buildDecisionExplanation,
  buildDecisionOption,
  buildDecisionRecommendation,
} from "./DecisionRecommendationContract.ts";
import { measureEvidenceStrength } from "./EvidenceStrengthEngine.ts";
import { scoreDecisionOptions } from "./OptionScoringEngine.ts";
import {
  buildEvidenceStrengthProfile,
  scoreRecommendationConfidence,
} from "./RecommendationConfidenceScoringEngine.ts";
import { analyzeTradeoffs } from "./TradeoffAnalysisEngine.ts";
import { buildUncertaintyProfile } from "./UncertaintyDetectionEngine.ts";

const generatedAt = "2026-06-18T07:00:00.000Z";

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

function stableInputProfile() {
  return aggregateDecisionInputs({
    profileId: "decision-input-confidence-explanation",
    generatedAt,
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
        timestamp: generatedAt,
      }),
    ]),
  });
}

function buildHighConfidenceContext() {
  const inputProfile = stableInputProfile();
  const option = buildDecisionOption({
    optionId: "option-stabilize",
    label: "Stabilize supplier risk",
    summary: "Reduce supplier exposure immediately.",
    category: "stabilize",
  });
  const scores = scoreDecisionOptions({
    evaluatedAt: generatedAt,
    options: Object.freeze([option]),
    inputProfile,
  }).scores;
  const decisionScore = scores[0];
  assert.ok(decisionScore);
  const tradeoff = analyzeTradeoffs({
    profileId: "tradeoff-confidence-explanation",
    evaluatedAt: generatedAt,
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
    evaluatedAt: generatedAt,
    inputProfile,
    recommendation,
    explanation: recommendation.explanation,
  });
  const evidenceStrength = buildEvidenceStrengthProfile(evidenceStrengthScore);
  const uncertainty = buildUncertaintyProfile({
    evaluatedAt: generatedAt,
    inputProfile,
    recommendation,
  });
  const confidenceScore = scoreRecommendationConfidence({
    evaluatedAt: generatedAt,
    recommendationId: recommendation.recommendationId,
    optionId: option.optionId,
    rank: 1,
    score: decisionScore,
    evidenceStrength,
    uncertainty,
    tradeoff,
  });

  return {
    recommendation,
    decisionExplanation: recommendation.explanation,
    evidenceStrength,
    evidenceStrengthScore,
    uncertainty,
    confidenceScore,
  };
}

test.beforeEach(() => {
  resetConfidenceExplanationBuilderForTests();
});

test("exports D2 confidence explanation tag diagnostics and templates", () => {
  assert.equal(D2_CONFIDENCE_EXPLANATION_COMPLETE_TAG, "[D2_CONFIDENCE_EXPLANATION_COMPLETE]");
  assert.equal(CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTIC, "[CONFIDENCE_EXPLANATION_BUILDER]");
  assert.equal(CONFIDENCE_EXPLANATION_READY_DIAGNOSTIC, "[CONFIDENCE_EXPLANATION_READY]");
  assert.deepEqual(ConfidenceExplanationBuilder.diagnostics, [
    "[CONFIDENCE_EXPLANATION_BUILDER]",
    "[CONFIDENCE_EXPLANATION_READY]",
  ]);
  assert.match(CONFIDENCE_EXPLANATION_TEMPLATES.whyHighConfidence, /Confidence is/);
  assert.match(CONFIDENCE_EXPLANATION_TEMPLATES.dataImprovement, /Confidence would improve/);
});

test("builds high confidence explanation with supporting evidence sections", () => {
  const context = buildHighConfidenceContext();
  const result = buildConfidenceExplanationResult({
    explanationId: "confidence-explanation-stabilize",
    generatedAt,
    recommendationId: context.recommendation.recommendationId,
    optionLabel: context.recommendation.option.label,
    confidenceScore: context.confidenceScore,
    evidenceStrength: context.evidenceStrength,
    evidenceStrengthScore: context.evidenceStrengthScore,
    uncertainty: context.uncertainty,
    decisionExplanation: context.decisionExplanation,
  });

  assert.equal(result.recommendationId, "recommendation-stabilize");
  assert.equal(result.templateDriven, true);
  assert.equal(result.explanation.confidenceLevel, "high");
  assert.match(result.whyConfidenceHigh, /High Confidence/);
  assert.equal(result.supportingEvidence.length > 0, true);
  assert.match(result.supportingEvidence[0] ?? "", /supports confidence/);
  assert.equal(result.dataImprovements.length >= 0, true);
  assert.equal(result.readOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.supportingEvidence), true);
  assert.equal(getConfidenceExplanationResult(), result);
});

test("builds limited confidence explanation with uncertainty and data improvements", () => {
  const context = buildHighConfidenceContext();
  const weakUncertainty = buildUncertaintyProfile({
    evaluatedAt: generatedAt,
    inputProfile: EMPTY_DECISION_INPUT_PROFILE,
  });
  const limitedConfidenceScore = scoreRecommendationConfidence({
    evaluatedAt: generatedAt,
    recommendationId: context.recommendation.recommendationId,
    optionId: context.recommendation.option.optionId,
    rank: 1,
    score: context.recommendation.score,
    evidenceStrength: buildEvidenceStrengthProfile(
      measureEvidenceStrength({
        evaluatedAt: generatedAt,
        inputProfile: EMPTY_DECISION_INPUT_PROFILE,
        recommendation: context.recommendation,
        explanation: context.decisionExplanation,
      })
    ),
    uncertainty: weakUncertainty,
    tradeoff: analyzeTradeoffs({
      profileId: "tradeoff-empty",
      evaluatedAt: generatedAt,
      options: Object.freeze([context.recommendation.option]),
      scores: Object.freeze([context.recommendation.score]),
    }),
  });

  const result = buildConfidenceExplanationResult({
    explanationId: "confidence-explanation-limited",
    generatedAt,
    recommendationId: context.recommendation.recommendationId,
    optionLabel: context.recommendation.option.label,
    confidenceScore: limitedConfidenceScore,
    evidenceStrength: buildEvidenceStrengthProfile(
      measureEvidenceStrength({
        evaluatedAt: generatedAt,
        inputProfile: EMPTY_DECISION_INPUT_PROFILE,
        recommendation: context.recommendation,
        explanation: context.decisionExplanation,
      })
    ),
    uncertainty: weakUncertainty,
    decisionExplanation: context.decisionExplanation,
  });

  assert.equal(limitedConfidenceScore.confidenceLevel, "insufficient_evidence");
  assert.match(result.whyConfidenceLimited, /insufficient/i);
  assert.equal(result.weakeningUncertainty.length > 0, true);
  assert.equal(result.dataImprovements.length > 0, true);
  assert.match(result.dataImprovements[0] ?? "", /Confidence would improve/);
  assert.equal(result.explanation.uncertaintyFactorIds.length > 0, true);
});

test("does not mutate source confidence uncertainty or evidence inputs", () => {
  const context = buildHighConfidenceContext();
  const beforeConfidence = JSON.stringify(context.confidenceScore);
  const beforeUncertainty = JSON.stringify(context.uncertainty);
  const beforeEvidence = JSON.stringify(context.evidenceStrength);
  const beforeExplanation = JSON.stringify(context.decisionExplanation);

  buildConfidenceExplanationResult({
    explanationId: "confidence-explanation-immutable",
    generatedAt,
    recommendationId: context.recommendation.recommendationId,
    optionLabel: context.recommendation.option.label,
    confidenceScore: context.confidenceScore,
    evidenceStrength: context.evidenceStrength,
    evidenceStrengthScore: context.evidenceStrengthScore,
    uncertainty: context.uncertainty,
    decisionExplanation: context.decisionExplanation,
  });

  assert.equal(JSON.stringify(context.confidenceScore), beforeConfidence);
  assert.equal(JSON.stringify(context.uncertainty), beforeUncertainty);
  assert.equal(JSON.stringify(context.evidenceStrength), beforeEvidence);
  assert.equal(JSON.stringify(context.decisionExplanation), beforeExplanation);
});
