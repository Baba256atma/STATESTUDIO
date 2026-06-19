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
  D2_RECOMMENDATION_CONFIDENCE_COMPLETE_TAG,
  RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTIC,
  RECOMMENDATION_CONFIDENCE_READY_DIAGNOSTIC,
  RECOMMENDATION_CONFIDENCE_WEIGHTS,
  RecommendationConfidenceScoringEngine,
  getRecommendationConfidenceResult,
  resetRecommendationConfidenceScoringEngineForTests,
  scoreRecommendationConfidence,
  scoreRecommendationConfidences,
} from "./RecommendationConfidenceScoringEngine.ts";
import { analyzeTradeoffs } from "./TradeoffAnalysisEngine.ts";
import { buildUncertaintyProfile } from "./UncertaintyDetectionEngine.ts";

const evaluatedAt = "2026-06-18T06:00:00.000Z";

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
    profileId: "decision-input-confidence",
    generatedAt: evaluatedAt,
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
        timestamp: evaluatedAt,
      }),
    ]),
  });
}

function buildRecommendationBundle() {
  const inputProfile = stableInputProfile();
  const stabilizeOption = buildDecisionOption({
    optionId: "option-stabilize",
    label: "Stabilize supplier risk",
    summary: "Reduce supplier exposure immediately.",
    category: "stabilize",
  });
  const monitorOption = buildDecisionOption({
    optionId: "option-monitor",
    label: "Monitor supplier risk",
    summary: "Continue monitoring without immediate action.",
    category: "monitor",
  });
  const options = Object.freeze([stabilizeOption, monitorOption]);
  const scores = scoreDecisionOptions({
    evaluatedAt,
    options,
    inputProfile,
  }).scores;
  const tradeoff = analyzeTradeoffs({
    profileId: "tradeoff-confidence",
    evaluatedAt,
    options,
    scores,
  });

  const stabilizeScore = scores.find((entry) => entry.optionId === "option-stabilize");
  const monitorScore = scores.find((entry) => entry.optionId === "option-monitor");
  assert.ok(stabilizeScore);
  assert.ok(monitorScore);

  const stabilizeRecommendation = buildDecisionRecommendation({
    recommendationId: "recommendation-stabilize",
    rank: 1,
    priority: "critical",
    option: stabilizeOption,
    score: stabilizeScore,
    explanation: buildDecisionExplanation({
      explanationId: "explanation-stabilize",
      optionId: stabilizeOption.optionId,
      rationale: "Supplier risk crossed executive threshold.",
      evidenceIds: ["risk-1", "signal-watch", "object-1"],
      tradeoffSummary: "Short-term cost for long-term stability.",
    }),
  });
  const monitorRecommendation = buildDecisionRecommendation({
    recommendationId: "recommendation-monitor",
    rank: 2,
    priority: "medium",
    option: monitorOption,
    score: monitorScore,
    explanation: buildDecisionExplanation({
      explanationId: "explanation-monitor",
      optionId: monitorOption.optionId,
      rationale: "Monitoring remains viable while evidence stabilizes.",
      evidenceIds: ["risk-1", "object-1"],
      tradeoffSummary: "Lower immediate cost with residual exposure.",
    }),
  });

  return {
    inputProfile,
    tradeoff,
    stabilizeRecommendation,
    monitorRecommendation,
    stabilizeScore,
    monitorScore,
  };
}

test.beforeEach(() => {
  resetRecommendationConfidenceScoringEngineForTests();
});

test("exports D2 recommendation confidence tag diagnostics and weights", () => {
  assert.equal(D2_RECOMMENDATION_CONFIDENCE_COMPLETE_TAG, "[D2_RECOMMENDATION_CONFIDENCE_COMPLETE]");
  assert.equal(RECOMMENDATION_CONFIDENCE_ENGINE_DIAGNOSTIC, "[RECOMMENDATION_CONFIDENCE_ENGINE]");
  assert.equal(RECOMMENDATION_CONFIDENCE_READY_DIAGNOSTIC, "[RECOMMENDATION_CONFIDENCE_READY]");
  assert.deepEqual(RecommendationConfidenceScoringEngine.diagnostics, [
    "[RECOMMENDATION_CONFIDENCE_ENGINE]",
    "[RECOMMENDATION_CONFIDENCE_READY]",
  ]);
  assert.equal(
    RECOMMENDATION_CONFIDENCE_WEIGHTS.decisionScore +
      RECOMMENDATION_CONFIDENCE_WEIGHTS.evidenceStrength +
      RECOMMENDATION_CONFIDENCE_WEIGHTS.uncertaintyInverse +
      RECOMMENDATION_CONFIDENCE_WEIGHTS.tradeoffClarity,
    100
  );
});

test("produces confidenceScore confidenceLevel and confidenceDrivers for a recommendation", () => {
  const bundle = buildRecommendationBundle();
  const evidenceStrength = buildEvidenceStrengthProfile(
    measureEvidenceStrength({
      evaluatedAt,
      inputProfile: bundle.inputProfile,
      recommendation: bundle.stabilizeRecommendation,
      explanation: bundle.stabilizeRecommendation.explanation,
    })
  );
  const uncertainty = buildUncertaintyProfile({
    evaluatedAt,
    inputProfile: bundle.inputProfile,
    recommendation: bundle.stabilizeRecommendation,
  });

  const result = scoreRecommendationConfidence({
    evaluatedAt,
    recommendationId: bundle.stabilizeRecommendation.recommendationId,
    optionId: bundle.stabilizeRecommendation.option.optionId,
    rank: bundle.stabilizeRecommendation.rank,
    score: bundle.stabilizeScore,
    evidenceStrength,
    uncertainty,
    tradeoff: bundle.tradeoff,
  });

  assert.equal(result.recommendationId, "recommendation-stabilize");
  assert.equal(result.rank, 1);
  assert.equal(result.rankingPreserved, true);
  assert.equal(result.confidenceScore >= 0 && result.confidenceScore <= 100, true);
  assert.equal(result.confidenceLevel, "high");
  assert.equal(result.confidenceLabel, "High Confidence");
  assert.equal(result.confidenceDrivers.length, 4);
  assert.equal(result.readOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.confidenceDrivers), true);
});

test("preserves recommendation ranking without reordering scored recommendations", () => {
  const bundle = buildRecommendationBundle();
  const weakUncertainty = buildUncertaintyProfile({
    evaluatedAt,
    inputProfile: EMPTY_DECISION_INPUT_PROFILE,
  });
  const strongUncertainty = buildUncertaintyProfile({
    evaluatedAt,
    inputProfile: bundle.inputProfile,
    recommendation: bundle.stabilizeRecommendation,
  });

  const stabilizeEvidence = buildEvidenceStrengthProfile(
    measureEvidenceStrength({
      evaluatedAt,
      inputProfile: EMPTY_DECISION_INPUT_PROFILE,
      recommendation: bundle.stabilizeRecommendation,
      explanation: bundle.stabilizeRecommendation.explanation,
    })
  );
  const monitorEvidence = buildEvidenceStrengthProfile(
    measureEvidenceStrength({
      evaluatedAt,
      inputProfile: bundle.inputProfile,
      recommendation: bundle.monitorRecommendation,
      explanation: bundle.monitorRecommendation.explanation,
    })
  );

  const batch = scoreRecommendationConfidences({
    evaluatedAt,
    entries: Object.freeze([
      {
        evaluatedAt,
        recommendationId: bundle.stabilizeRecommendation.recommendationId,
        optionId: bundle.stabilizeRecommendation.option.optionId,
        rank: 1,
        score: bundle.stabilizeScore,
        evidenceStrength: stabilizeEvidence,
        uncertainty: weakUncertainty,
        tradeoff: bundle.tradeoff,
      },
      {
        evaluatedAt,
        recommendationId: bundle.monitorRecommendation.recommendationId,
        optionId: bundle.monitorRecommendation.option.optionId,
        rank: 2,
        score: bundle.monitorScore,
        evidenceStrength: monitorEvidence,
        uncertainty: strongUncertainty,
        tradeoff: bundle.tradeoff,
      },
    ]),
  });

  assert.equal(batch.scoreCount, 2);
  assert.equal(batch.rankingPreserved, true);
  assert.deepEqual(
    batch.scores.map((entry) => entry.rank),
    [1, 2]
  );
  assert.deepEqual(
    batch.scores.map((entry) => entry.recommendationId),
    ["recommendation-stabilize", "recommendation-monitor"]
  );
  assert.equal(getRecommendationConfidenceResult(), batch);
});

test("does not mutate source score tradeoff uncertainty or evidence inputs", () => {
  const bundle = buildRecommendationBundle();
  const evidenceStrength = buildEvidenceStrengthProfile(
    measureEvidenceStrength({
      evaluatedAt,
      inputProfile: bundle.inputProfile,
      recommendation: bundle.stabilizeRecommendation,
      explanation: bundle.stabilizeRecommendation.explanation,
    })
  );
  const uncertainty = buildUncertaintyProfile({
    evaluatedAt,
    inputProfile: bundle.inputProfile,
    recommendation: bundle.stabilizeRecommendation,
  });
  const beforeScore = JSON.stringify(bundle.stabilizeScore);
  const beforeTradeoff = JSON.stringify(bundle.tradeoff);
  const beforeUncertainty = JSON.stringify(uncertainty);
  const beforeEvidence = JSON.stringify(evidenceStrength);

  scoreRecommendationConfidence({
    evaluatedAt,
    recommendationId: bundle.stabilizeRecommendation.recommendationId,
    optionId: bundle.stabilizeRecommendation.option.optionId,
    rank: 1,
    score: bundle.stabilizeScore,
    evidenceStrength,
    uncertainty,
    tradeoff: bundle.tradeoff,
  });

  assert.equal(JSON.stringify(bundle.stabilizeScore), beforeScore);
  assert.equal(JSON.stringify(bundle.tradeoff), beforeTradeoff);
  assert.equal(JSON.stringify(uncertainty), beforeUncertainty);
  assert.equal(JSON.stringify(evidenceStrength), beforeEvidence);
});
