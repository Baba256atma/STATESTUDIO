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
  buildDecisionScore,
} from "./DecisionRecommendationContract.ts";
import {
  D2_EVIDENCE_STRENGTH_COMPLETE_TAG,
  EVIDENCE_STRENGTH_DIMENSION_WEIGHTS,
  EVIDENCE_STRENGTH_ENGINE_DIAGNOSTIC,
  EVIDENCE_STRENGTH_READY_DIAGNOSTIC,
  EvidenceStrengthEngine,
  evaluateEvidenceStrength,
  getEvidenceStrengthResult,
  measureEvidenceStrength,
  resetEvidenceStrengthEngineForTests,
} from "./EvidenceStrengthEngine.ts";

const evaluatedAt = "2026-06-18T04:00:00.000Z";

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

function decisionInputProfile() {
  return aggregateDecisionInputs({
    profileId: "decision-input-evidence",
    generatedAt: evaluatedAt,
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
        timestamp: evaluatedAt,
      }),
    ]),
  });
}

function sampleRecommendation() {
  const option = buildDecisionOption({
    optionId: "option-stabilize",
    label: "Stabilize supplier risk",
    summary: "Reduce supplier exposure immediately.",
    category: "stabilize",
  });
  const score = buildDecisionScore({
    scoreId: "score-stabilize",
    optionId: option.optionId,
    value: 84,
    confidence: 88,
    dimensions: [
      { dimensionId: "impact", label: "Impact", value: 82, weight: 25 },
      { dimensionId: "risk", label: "Risk", value: 79, weight: 25 },
      { dimensionId: "kpiEffect", label: "KPI Effect", value: 76, weight: 20 },
      { dimensionId: "scenarioOutcome", label: "Scenario Outcome", value: 81, weight: 20 },
      { dimensionId: "warRoomPressure", label: "War Room Pressure", value: 90, weight: 10 },
    ],
  });
  const explanation = buildDecisionExplanation({
    explanationId: "explanation-stabilize",
    optionId: option.optionId,
    rationale: "Supplier risk crossed executive threshold.",
    evidenceIds: ["risk-1", "signal-critical", "object-1"],
    tradeoffSummary: "Short-term cost for long-term stability.",
  });
  return buildDecisionRecommendation({
    recommendationId: "recommendation-stabilize",
    rank: 1,
    priority: "critical",
    option,
    score,
    explanation,
  });
}

test.beforeEach(() => {
  resetEvidenceStrengthEngineForTests();
});

test("exports D2 evidence strength tag diagnostics and dimension weights", () => {
  assert.equal(D2_EVIDENCE_STRENGTH_COMPLETE_TAG, "[D2_EVIDENCE_STRENGTH_COMPLETE]");
  assert.equal(EVIDENCE_STRENGTH_ENGINE_DIAGNOSTIC, "[EVIDENCE_STRENGTH_ENGINE]");
  assert.equal(EVIDENCE_STRENGTH_READY_DIAGNOSTIC, "[EVIDENCE_STRENGTH_READY]");
  assert.deepEqual(EvidenceStrengthEngine.diagnostics, [
    "[EVIDENCE_STRENGTH_ENGINE]",
    "[EVIDENCE_STRENGTH_READY]",
  ]);
  assert.equal(
    EVIDENCE_STRENGTH_DIMENSION_WEIGHTS.dataCompleteness +
      EVIDENCE_STRENGTH_DIMENSION_WEIGHTS.signalConsistency +
      EVIDENCE_STRENGTH_DIMENSION_WEIGHTS.simulationCoverage +
      EVIDENCE_STRENGTH_DIMENSION_WEIGHTS.compareCoverage +
      EVIDENCE_STRENGTH_DIMENSION_WEIGHTS.warRoomSignalStrength,
    100
  );
});

test("produces normalized EvidenceStrengthScore for D-1 recommendation evidence", () => {
  const profile = decisionInputProfile();
  const recommendation = sampleRecommendation();
  const explanation = recommendation.explanation;

  const result = evaluateEvidenceStrength({
    evaluatedAt,
    inputProfile: profile,
    recommendation,
    explanation,
  });

  assert.equal(result.profileId, "decision-input-evidence");
  assert.equal(result.recommendationId, "recommendation-stabilize");
  assert.equal(result.readOnly, true);
  assert.equal(result.sourceMutation, false);
  assert.equal(result.score.optionId, "option-stabilize");
  assert.equal(result.score.evidenceCount, 3);
  assert.equal(result.score.dimensions.length, 5);
  assert.deepEqual(
    result.score.dimensions.map((dimension) => dimension.dimensionId),
    [
      "dataCompleteness",
      "signalConsistency",
      "simulationCoverage",
      "compareCoverage",
      "warRoomSignalStrength",
    ]
  );
  assert.equal(result.score.value >= 0 && result.score.value <= 100, true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.score), true);
  assert.equal(Object.isFrozen(result.score.dimensions), true);
  assert.equal(getEvidenceStrengthResult(), result);
});

test("returns low evidence strength for empty decision input profile", () => {
  const recommendation = sampleRecommendation();
  const score = measureEvidenceStrength({
    evaluatedAt,
    inputProfile: EMPTY_DECISION_INPUT_PROFILE,
    recommendation,
    explanation: recommendation.explanation,
  });

  assert.equal(score.value >= 0 && score.value <= 100, true);
  assert.equal(score.value < 40, true);
  assert.equal(score.dimensions.find((dimension) => dimension.dimensionId === "simulationCoverage")?.value, 0);
  assert.equal(score.dimensions.find((dimension) => dimension.dimensionId === "compareCoverage")?.value, 0);
  assert.equal(
    score.dimensions.find((dimension) => dimension.dimensionId === "warRoomSignalStrength")?.value,
    0
  );
});

test("full input profile scores higher than empty profile", () => {
  const recommendation = sampleRecommendation();
  const explanation = recommendation.explanation;
  const emptyScore = measureEvidenceStrength({
    evaluatedAt,
    inputProfile: EMPTY_DECISION_INPUT_PROFILE,
    recommendation,
    explanation,
  });
  const fullScore = measureEvidenceStrength({
    evaluatedAt,
    inputProfile: decisionInputProfile(),
    recommendation,
    explanation,
  });

  assert.equal(fullScore.value > emptyScore.value, true);
});

test("does not mutate source input profile recommendation or explanation", () => {
  const profile = decisionInputProfile();
  const recommendation = sampleRecommendation();
  const explanation = buildDecisionExplanation({
    explanationId: recommendation.explanation.explanationId,
    optionId: recommendation.option.optionId,
    rationale: recommendation.explanation.rationale,
    evidenceIds: [...recommendation.explanation.evidenceIds],
    tradeoffSummary: recommendation.explanation.tradeoffSummary,
  });
  const beforeProfile = JSON.stringify(profile);
  const beforeRecommendation = JSON.stringify(recommendation);
  const beforeExplanation = JSON.stringify(explanation);

  const score = measureEvidenceStrength({
    evaluatedAt,
    inputProfile: profile,
    recommendation,
    explanation,
  });

  assert.equal(JSON.stringify(profile), beforeProfile);
  assert.equal(JSON.stringify(recommendation), beforeRecommendation);
  assert.equal(JSON.stringify(explanation), beforeExplanation);
  assert.equal(score.recommendationId, "recommendation-stabilize");
  assert.throws(() => {
    (score.dimensions as unknown as object[]).push({});
  }, TypeError);
});
