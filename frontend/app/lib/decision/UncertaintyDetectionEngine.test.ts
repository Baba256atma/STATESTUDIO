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
  D2_UNCERTAINTY_COMPLETE_TAG,
  UNCERTAINTY_DETECTION_CATEGORY_LABELS,
  UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTIC,
  UNCERTAINTY_DETECTION_READY_DIAGNOSTIC,
  UncertaintyDetectionEngine,
  buildUncertaintyProfile,
  evaluateUncertainty,
  getUncertaintyDetectionResult,
  resetUncertaintyDetectionEngineForTests,
} from "./UncertaintyDetectionEngine.ts";

const evaluatedAt = "2026-06-18T05:00:00.000Z";

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

function kpiRegistry(confidence = 88, intelligenceScore = 41): KpiIntelligenceRegistry {
  const profile = Object.freeze({
    kpiId: "kpi-1",
    label: "Revenue",
    category: "Revenue" as const,
    value: 90,
    target: 100,
    intelligenceScore,
    confidence,
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

function riskRegistry(confidence = 83): RiskIntelligenceRegistry {
  const profile = Object.freeze({
    riskId: "risk-1",
    subjectId: "object-1",
    label: "Supplier continuity",
    primaryCategory: "supply" as const,
    primaryCategoryLabel: "Supply Risk" as const,
    severity: 91,
    exposure: 86,
    confidence,
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

function scenarioResult(confidence = 80): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    overallScenarioImpact: 72,
    confidence,
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

function comparisonResult(confidenceDelta = 3) {
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
    confidenceDelta,
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

function decisionInputProfile(options?: {
  kpiConfidence?: number;
  kpiIntelligenceScore?: number;
  riskConfidence?: number;
  scenarioConfidence?: number;
  compareConfidenceDelta?: number;
  warRoomSeverity?: "info" | "watch" | "warning" | "critical";
  kpiDirection?: "positive" | "negative" | "neutral";
}) {
  return aggregateDecisionInputs({
    profileId: "decision-input-uncertainty",
    generatedAt: evaluatedAt,
    objectIntelligence: objectRegistry(),
    relationshipIntelligence: relationshipRegistry(),
    kpiIntelligence: kpiRegistry(options?.kpiConfidence, options?.kpiIntelligenceScore),
    riskIntelligence: riskRegistry(options?.riskConfidence),
    scenarioResults: [
      Object.freeze({
        ...scenarioResult(options?.scenarioConfidence),
        kpiMovement: Object.freeze({
          direction: options?.kpiDirection ?? "positive",
          delta: 8,
          confidence: 76,
        }),
      }),
    ],
    compareResults: [comparisonResult(options?.compareConfidenceDelta)],
    warRoomSignals: Object.freeze([
      buildWarRoomSignal({
        signalId: "signal-critical",
        source: "risk",
        sourceId: "risk-1",
        severity: options?.warRoomSeverity ?? "critical",
        title: "Supplier risk elevated",
        detail: "Critical supplier risk signal.",
        confidence: 91,
        timestamp: evaluatedAt,
      }),
    ]),
  });
}

function stableDecisionInputProfile() {
  return decisionInputProfile({
    kpiConfidence: 88,
    kpiIntelligenceScore: 72,
    riskConfidence: 83,
    scenarioConfidence: 82,
    compareConfidenceDelta: 3,
    warRoomSeverity: "watch",
    kpiDirection: "neutral",
  });
}

function sampleRecommendation(scoreConfidence = 88) {
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
    confidence: scoreConfidence,
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
  resetUncertaintyDetectionEngineForTests();
});

test("exports D2 uncertainty detection tag diagnostics and category labels", () => {
  assert.equal(D2_UNCERTAINTY_COMPLETE_TAG, "[D2_UNCERTAINTY_COMPLETE]");
  assert.equal(UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTIC, "[UNCERTAINTY_DETECTION_ENGINE]");
  assert.equal(UNCERTAINTY_DETECTION_READY_DIAGNOSTIC, "[UNCERTAINTY_DETECTION_READY]");
  assert.deepEqual(UncertaintyDetectionEngine.diagnostics, [
    "[UNCERTAINTY_DETECTION_ENGINE]",
    "[UNCERTAINTY_DETECTION_READY]",
  ]);
  assert.equal(UNCERTAINTY_DETECTION_CATEGORY_LABELS.missingData, "Missing Data");
  assert.equal(UNCERTAINTY_DETECTION_CATEGORY_LABELS.scenarioDisagreement, "Scenario Disagreement");
});

test("detects missing data uncertainty for empty decision input profile", () => {
  const profile = buildUncertaintyProfile({
    evaluatedAt,
    inputProfile: EMPTY_DECISION_INPUT_PROFILE,
  });

  assert.equal(profile.findingCount > 0, true);
  assert.equal(profile.detectedCategories.includes("missingData"), true);
  assert.equal(profile.evidenceGapCount > 0, true);
  assert.equal(profile.readOnly, true);
  assert.equal(profile.mutation, false);
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile.findings), true);
});

test("detects weak KPI risk simulation and conflicting signal uncertainty", () => {
  const result = evaluateUncertainty({
    evaluatedAt,
    inputProfile: decisionInputProfile({
      kpiConfidence: 42,
      kpiIntelligenceScore: 22,
      riskConfidence: 48,
      scenarioConfidence: 52,
      compareConfidenceDelta: 22,
    }),
    recommendation: sampleRecommendation(95),
  });

  assert.equal(result.profileId, "decision-input-uncertainty");
  assert.equal(result.recommendationId, "recommendation-stabilize");
  assert.equal(result.sourceMutation, false);
  assert.equal(result.profile.detectedCategories.includes("weakKpiEvidence"), true);
  assert.equal(result.profile.detectedCategories.includes("weakRiskEvidence"), true);
  assert.equal(result.profile.detectedCategories.includes("lowSimulationConfidence"), true);
  assert.equal(result.profile.detectedCategories.includes("scenarioDisagreement"), true);
  assert.equal(result.profile.detectedCategories.includes("conflictingSignals"), true);
  assert.equal(result.profile.weakAreaCount > 0, true);
  assert.equal(result.profile.aggregateUncertainty > 0, true);
  assert.equal(getUncertaintyDetectionResult(), result);
});

test("stable profile produces fewer uncertainty findings than weak profile", () => {
  const stableProfile = buildUncertaintyProfile({
    evaluatedAt,
    inputProfile: stableDecisionInputProfile(),
    recommendation: sampleRecommendation(),
  });
  const weakProfile = buildUncertaintyProfile({
    evaluatedAt,
    inputProfile: decisionInputProfile({
      kpiConfidence: 40,
      kpiIntelligenceScore: 20,
      riskConfidence: 45,
      scenarioConfidence: 50,
      compareConfidenceDelta: 24,
    }),
    recommendation: sampleRecommendation(96),
  });

  assert.equal(weakProfile.findingCount > stableProfile.findingCount, true);
  assert.equal(weakProfile.aggregateUncertainty > stableProfile.aggregateUncertainty, true);
});

test("does not mutate source input profile or recommendation", () => {
  const inputProfile = decisionInputProfile();
  const recommendation = sampleRecommendation();
  const beforeProfile = JSON.stringify(inputProfile);
  const beforeRecommendation = JSON.stringify(recommendation);

  buildUncertaintyProfile({
    evaluatedAt,
    inputProfile,
    recommendation,
  });

  assert.equal(JSON.stringify(inputProfile), beforeProfile);
  assert.equal(JSON.stringify(recommendation), beforeRecommendation);
});
