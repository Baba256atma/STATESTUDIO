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
import { aggregateDecisionInputs } from "./DecisionInputAggregator.ts";
import { buildDecisionOption } from "./DecisionRecommendationContract.ts";
import { scoreDecisionOptions } from "./OptionScoringEngine.ts";
import {
  D1_RECOMMENDATION_COMPLETE_TAG,
  generateExecutiveRecommendation,
  getExecutiveRecommendation,
  RECOMMENDATION_ENGINE_DIAGNOSTIC,
  RECOMMENDATION_READY_DIAGNOSTIC,
  RecommendationEngine,
  resetRecommendationEngineForTests,
} from "./RecommendationEngine.ts";
import { analyzeTradeoffs } from "./TradeoffAnalysisEngine.ts";

const generatedAt = "2026-06-18T05:00:00.000Z";

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

function warRoomPriorities() {
  return Object.freeze([
    buildWarRoomPriority({
      priorityId: "priority-critical",
      level: "critical",
      rank: 1,
      title: "Stabilize supplier risk",
      rationale: "Critical supplier risk requires executive attention.",
      relatedSignalIds: ["signal-critical"],
      relatedAlertIds: [],
    }),
  ]);
}

function buildRecommendationInputs() {
  const inputProfile = aggregateDecisionInputs({
    profileId: "decision-input-recommendation",
    generatedAt,
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
        timestamp: generatedAt,
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
    evaluatedAt: generatedAt,
    options,
    inputProfile,
  });

  const tradeoffProfile = analyzeTradeoffs({
    profileId: "tradeoff-profile-recommendation",
    evaluatedAt: generatedAt,
    options,
    scores: scoringResult.scores,
  });

  return { options, scoringResult, tradeoffProfile };
}

test.beforeEach(() => {
  resetRecommendationEngineForTests();
});

test("exports D1 recommendation engine tag and diagnostics", () => {
  assert.equal(D1_RECOMMENDATION_COMPLETE_TAG, "[D1_RECOMMENDATION_COMPLETE]");
  assert.equal(RECOMMENDATION_ENGINE_DIAGNOSTIC, "[RECOMMENDATION_ENGINE]");
  assert.equal(RECOMMENDATION_READY_DIAGNOSTIC, "[RECOMMENDATION_READY]");
  assert.deepEqual(RecommendationEngine.diagnostics, [
    "[RECOMMENDATION_ENGINE]",
    "[RECOMMENDATION_READY]",
  ]);
});

test("generates recommended option alternative options and ranking", () => {
  const { options, scoringResult, tradeoffProfile } = buildRecommendationInputs();
  const recommendation = generateExecutiveRecommendation({
    recommendationId: "recommendation-1",
    generatedAt,
    options,
    scores: scoringResult.scores,
    tradeoffProfile,
    warRoomPriorities: warRoomPriorities(),
  });

  assert.equal(recommendation.recommendationId, "recommendation-1");
  assert.equal(recommendation.executesRecommendations, false);
  assert.equal(recommendation.readOnly, true);
  assert.equal(recommendation.sourceMutation, false);
  assert.equal(recommendation.rankingCount, 2);
  assert.equal(recommendation.recommendedOption?.rank, 1);
  assert.equal(recommendation.recommendedOption?.option.optionId, "option-stabilize");
  assert.equal(recommendation.recommendedOption?.executesActions, false);
  assert.equal(recommendation.alternativeOptions.length, 1);
  assert.equal(recommendation.alternativeOptions[0]?.option.optionId, "option-monitor");
  assert.equal(recommendation.alternativeOptions[0]?.rank, 2);
  assert.deepEqual(
    recommendation.ranking.map((entry) => entry.optionId),
    ["option-stabilize", "option-monitor"]
  );
  assert.equal(recommendation.ranking[0]?.rank, 1);
  assert.equal(recommendation.ranking[1]?.rank, 2);
  assert.equal(
    (recommendation.ranking[0]?.compositeScore ?? 0) >
      (recommendation.ranking[1]?.compositeScore ?? 0),
    true
  );
  assert.equal(Object.isFrozen(recommendation), true);
  assert.equal(Object.isFrozen(recommendation.ranking), true);
  assert.equal(Object.isFrozen(recommendation.alternativeOptions), true);
  assert.equal(getExecutiveRecommendation(), recommendation);
});

test("does not mutate source scores tradeoff profile or war room priorities", () => {
  const { options, scoringResult, tradeoffProfile } = buildRecommendationInputs();
  const priorities = warRoomPriorities();
  const before = JSON.stringify({
    options,
    scores: scoringResult.scores,
    tradeoffProfile,
    priorities,
  });

  generateExecutiveRecommendation({
    recommendationId: "recommendation-2",
    generatedAt,
    options,
    scores: scoringResult.scores,
    tradeoffProfile,
    warRoomPriorities: priorities,
  });

  assert.equal(
    JSON.stringify({ options, scores: scoringResult.scores, tradeoffProfile, priorities }),
    before
  );
});
