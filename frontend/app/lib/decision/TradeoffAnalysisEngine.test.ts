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
import { scoreDecisionOptions } from "./OptionScoringEngine.ts";
import {
  analyzeTradeoffs,
  D1_TRADEOFF_ANALYSIS_COMPLETE_TAG,
  getTradeoffProfile,
  resetTradeoffAnalysisEngineForTests,
  TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTIC,
  TRADEOFF_ANALYSIS_READY_DIAGNOSTIC,
  TradeoffAnalysisEngine,
} from "./TradeoffAnalysisEngine.ts";

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

function buildScoredOptions() {
  const inputProfile = aggregateDecisionInputs({
    profileId: "decision-input-tradeoff",
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
    evaluatedAt,
    options,
    inputProfile,
  });

  return { inputProfile, options, scoringResult };
}

test.beforeEach(() => {
  resetTradeoffAnalysisEngineForTests();
});

test("exports D1 tradeoff analysis tag and diagnostics", () => {
  assert.equal(D1_TRADEOFF_ANALYSIS_COMPLETE_TAG, "[D1_TRADEOFF_ANALYSIS_COMPLETE]");
  assert.equal(TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTIC, "[TRADEOFF_ANALYSIS_ENGINE]");
  assert.equal(TRADEOFF_ANALYSIS_READY_DIAGNOSTIC, "[TRADEOFF_ANALYSIS_READY]");
  assert.deepEqual(TradeoffAnalysisEngine.diagnostics, [
    "[TRADEOFF_ANALYSIS_ENGINE]",
    "[TRADEOFF_ANALYSIS_READY]",
  ]);
});

test("identifies tradeoffs across benefit risk cost pressure reduction and kpi impact", () => {
  const { options, scoringResult } = buildScoredOptions();
  const profile = analyzeTradeoffs({
    profileId: "tradeoff-profile-1",
    evaluatedAt,
    options,
    scores: scoringResult.scores,
  });

  assert.equal(profile.optionCount, 2);
  assert.equal(profile.comparisonCount, 1);
  assert.equal(profile.tradeoffCount >= 1, true);
  assert.equal(profile.readOnly, true);
  assert.equal(profile.sourceMutation, false);
  assert.equal(profile.primaryComparison?.optionAId, "option-stabilize");
  assert.equal(profile.primaryComparison?.optionBId, "option-monitor");
  assert.deepEqual(
    profile.primaryComparison?.dimensions.map((dimension) => dimension.dimensionId),
    ["benefit", "risk", "cost", "pressureReduction", "kpiImpact"]
  );

  const costDimension = profile.primaryComparison?.dimensions.find(
    (dimension) => dimension.dimensionId === "cost"
  );
  assert.equal(costDimension?.favoredOptionId, "option-monitor");
  assert.equal(costDimension?.optionAValue > (costDimension?.optionBValue ?? 0), true);

  const pressureDimension = profile.primaryComparison?.dimensions.find(
    (dimension) => dimension.dimensionId === "pressureReduction"
  );
  assert.equal(pressureDimension?.favoredOptionId, "option-stabilize");

  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile.comparisons), true);
  assert.equal(Object.isFrozen(profile.optionProfiles), true);
  assert.equal(getTradeoffProfile(), profile);
});

test("does not mutate source options scores or input profile", () => {
  const { inputProfile, options, scoringResult } = buildScoredOptions();
  const before = JSON.stringify({ inputProfile, options, scores: scoringResult.scores });

  analyzeTradeoffs({
    profileId: "tradeoff-profile-2",
    evaluatedAt,
    options,
    scores: scoringResult.scores,
  });

  assert.equal(JSON.stringify({ inputProfile, options, scores: scoringResult.scores }), before);
  assert.throws(() => {
    (options as unknown as object[]).push({});
  }, TypeError);
});
