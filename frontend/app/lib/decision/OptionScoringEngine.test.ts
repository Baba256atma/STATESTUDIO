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
import { buildDecisionOption } from "./DecisionRecommendationContract.ts";
import {
  D1_OPTION_SCORING_COMPLETE_TAG,
  getOptionScoringResult,
  OPTION_SCORING_DIMENSION_WEIGHTS,
  OPTION_SCORING_ENGINE_DIAGNOSTIC,
  OPTION_SCORING_READY_DIAGNOSTIC,
  OptionScoringEngine,
  resetOptionScoringEngineForTests,
  scoreDecisionOption,
  scoreDecisionOptions,
} from "./OptionScoringEngine.ts";

const evaluatedAt = "2026-06-18T03:00:00.000Z";

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
    profileId: "decision-input-scoring",
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

test.beforeEach(() => {
  resetOptionScoringEngineForTests();
});

test("exports D1 option scoring tag diagnostics and dimension weights", () => {
  assert.equal(D1_OPTION_SCORING_COMPLETE_TAG, "[D1_OPTION_SCORING_COMPLETE]");
  assert.equal(OPTION_SCORING_ENGINE_DIAGNOSTIC, "[OPTION_SCORING_ENGINE]");
  assert.equal(OPTION_SCORING_READY_DIAGNOSTIC, "[OPTION_SCORING_READY]");
  assert.deepEqual(OptionScoringEngine.diagnostics, [
    "[OPTION_SCORING_ENGINE]",
    "[OPTION_SCORING_READY]",
  ]);
  assert.equal(
    OPTION_SCORING_DIMENSION_WEIGHTS.impact +
      OPTION_SCORING_DIMENSION_WEIGHTS.risk +
      OPTION_SCORING_DIMENSION_WEIGHTS.kpiEffect +
      OPTION_SCORING_DIMENSION_WEIGHTS.scenarioOutcome +
      OPTION_SCORING_DIMENSION_WEIGHTS.warRoomPressure,
    100
  );
});

test("generates normalized DecisionScore dimensions for decision alternatives", () => {
  const profile = decisionInputProfile();
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

  const result = scoreDecisionOptions({
    evaluatedAt,
    options: [stabilizeOption, monitorOption],
    inputProfile: profile,
  });

  assert.equal(result.scoreCount, 2);
  assert.equal(result.normalizedScoring, true);
  assert.equal(result.readOnly, true);
  assert.equal(result.sourceMutation, false);
  assert.equal(result.profileId, "decision-input-scoring");

  const stabilizeScore = result.scores[0];
  const monitorScore = result.scores[1];
  assert.equal(stabilizeScore?.optionId, "option-stabilize");
  assert.equal(stabilizeScore?.dimensions.length, 5);
  assert.deepEqual(
    stabilizeScore?.dimensions.map((dimension) => dimension.dimensionId),
    ["impact", "risk", "kpiEffect", "scenarioOutcome", "warRoomPressure"]
  );
  assert.equal(stabilizeScore?.value >= 0 && stabilizeScore.value <= 100, true);
  assert.equal(stabilizeScore?.confidence >= 0 && stabilizeScore.confidence <= 100, true);
  assert.equal(Object.isFrozen(stabilizeScore), true);
  assert.equal(Object.isFrozen(stabilizeScore?.dimensions), true);
  assert.equal((stabilizeScore?.value ?? 0) > (monitorScore?.value ?? 0), true);
  assert.equal(getOptionScoringResult(), result);
});

test("does not mutate source input profile or options", () => {
  const profile = decisionInputProfile();
  const option = buildDecisionOption({
    optionId: "option-reduce-risk",
    label: "Reduce supplier risk",
    summary: "Apply mitigation to supplier exposure.",
    category: "reduce_risk",
  });
  const beforeProfile = JSON.stringify(profile);
  const beforeOption = JSON.stringify(option);

  const score = scoreDecisionOption({
    option,
    inputProfile: profile,
    evaluatedAt,
  });

  assert.equal(JSON.stringify(profile), beforeProfile);
  assert.equal(JSON.stringify(option), beforeOption);
  assert.equal(score.optionId, "option-reduce-risk");
  assert.throws(() => {
    (score.dimensions as unknown as object[]).push({});
  }, TypeError);
});
