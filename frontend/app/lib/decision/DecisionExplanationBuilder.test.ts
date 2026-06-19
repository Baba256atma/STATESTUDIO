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
import {
  buildDecisionExplanationResult,
  D1_EXPLANATION_COMPLETE_TAG,
  DECISION_EXPLANATION_DIAGNOSTIC,
  DECISION_EXPLANATION_READY_DIAGNOSTIC,
  DECISION_EXPLANATION_TEMPLATES,
  DecisionExplanationBuilder,
  getDecisionExplanationResult,
  resetDecisionExplanationBuilderForTests,
} from "./DecisionExplanationBuilder.ts";
import { buildDecisionOption } from "./DecisionRecommendationContract.ts";
import { scoreDecisionOptions } from "./OptionScoringEngine.ts";
import { generateExecutiveRecommendation } from "./RecommendationEngine.ts";
import { analyzeTradeoffs } from "./TradeoffAnalysisEngine.ts";

const generatedAt = "2026-06-18T06:00:00.000Z";

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

function buildRecommendationBundle() {
  const inputProfile = aggregateDecisionInputs({
    profileId: "decision-input-explanation",
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
    profileId: "tradeoff-profile-explanation",
    evaluatedAt: generatedAt,
    options,
    scores: scoringResult.scores,
  });

  const recommendation = generateExecutiveRecommendation({
    recommendationId: "recommendation-explanation",
    generatedAt,
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

  return { recommendation, tradeoffProfile };
}

test.beforeEach(() => {
  resetDecisionExplanationBuilderForTests();
});

test("exports D1 explanation builder tag diagnostics and templates", () => {
  assert.equal(D1_EXPLANATION_COMPLETE_TAG, "[D1_EXPLANATION_COMPLETE]");
  assert.equal(DECISION_EXPLANATION_DIAGNOSTIC, "[DECISION_EXPLANATION]");
  assert.equal(DECISION_EXPLANATION_READY_DIAGNOSTIC, "[DECISION_EXPLANATION_READY]");
  assert.deepEqual(DecisionExplanationBuilder.diagnostics, [
    "[DECISION_EXPLANATION]",
    "[DECISION_EXPLANATION_READY]",
  ]);
  assert.equal(
    DECISION_EXPLANATION_TEMPLATES.whyRankedFirst.includes("{{optionLabel}}"),
    true
  );
});

test("generates template-driven DecisionExplanation with ranking tradeoff risk and benefit sections", () => {
  const { recommendation, tradeoffProfile } = buildRecommendationBundle();
  const result = buildDecisionExplanationResult({
    explanationId: "explanation-1",
    generatedAt,
    recommendation,
    tradeoffProfile,
  });

  assert.equal(result.templateDriven, true);
  assert.equal(result.readOnly, true);
  assert.equal(result.sourceMutation, false);
  assert.equal(result.explanation.explanationId, "explanation-1");
  assert.equal(result.explanation.optionId, "option-stabilize");
  assert.equal(result.explanation.rationale.includes("Stabilize supplier risk"), true);
  assert.equal(result.explanation.tradeoffSummary?.includes("Cost"), true);
  assert.equal(result.whyRankedFirst.includes("ranks first"), true);
  assert.equal(result.whyAlternativesLower.length, 1);
  assert.equal(result.whyAlternativesLower[0]?.includes("Monitor supplier risk"), true);
  assert.equal(result.majorTradeoffs.length >= 1, true);
  assert.equal(result.majorRisks.length >= 1, true);
  assert.equal(result.expectedBenefits.length >= 1, true);
  assert.equal(result.explanation.evidenceIds.includes("rank:1"), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.explanation), true);
  assert.equal(Object.isFrozen(result.explanation.evidenceIds), true);
  assert.equal(getDecisionExplanationResult(), result);
});

test("does not mutate source recommendation or tradeoff profile", () => {
  const { recommendation, tradeoffProfile } = buildRecommendationBundle();
  const before = JSON.stringify({ recommendation, tradeoffProfile });

  buildDecisionExplanationResult({
    explanationId: "explanation-2",
    generatedAt,
    recommendation,
    tradeoffProfile,
  });

  assert.equal(JSON.stringify({ recommendation, tradeoffProfile }), before);
  assert.throws(() => {
    (recommendation.ranking as unknown as object[]).push({});
  }, TypeError);
});
