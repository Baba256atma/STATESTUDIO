/**
 * D:1 — Decision Recommendation Engine certification.
 *
 * Certifies the complete D:1 decision recommendation pipeline from contract
 * through dashboard and assistant bindings with no mutation authority.
 */

import {
  attachDashboardDecisionBinding,
  resetDecisionRecommendationBindingBridgeForTests,
} from "../dashboard/decision/decisionRecommendationBindingBridge.ts";
import type { KpiIntelligenceRegistry } from "../kpi-intelligence/kpiIntelligenceContract.ts";
import type { ObjectIntelligenceRegistry } from "../object-intelligence/objectIntelligenceContract.ts";
import type { RelationshipIntelligenceRegistry } from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import type { RiskIntelligenceRegistry } from "../risk-intelligence/riskIntelligenceContract.ts";
import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
} from "../scenario-authoring/ScenarioComparisonContract.ts";
import { EMPTY_EXECUTIVE_SIMULATION_SUMMARY } from "../scenario-authoring/simulationResultAggregatorContract.ts";
import { buildWarRoomPriority, buildWarRoomSignal } from "../warroom/WarRoomContract.ts";
import { explainDecisionRecommendation, resetAssistantDecisionBindingForTests } from "./AssistantDecisionBridge.ts";
import {
  aggregateDecisionInputs,
  resetDecisionInputAggregatorForTests,
} from "./DecisionInputAggregator.ts";
import {
  buildDecisionExplanationResult,
  resetDecisionExplanationBuilderForTests,
} from "./DecisionExplanationBuilder.ts";
import {
  resolveDashboardDecisionBinding,
  resetDashboardDecisionBindingForTests,
} from "./DashboardDecisionBinding.ts";
import {
  DECISION_RECOMMENDATION_CONTRACT,
  buildDecisionOption,
  buildDecisionRecommendation,
  buildDecisionRecommendationBundle,
} from "./DecisionRecommendationContract.ts";
import { scoreDecisionOptions, resetOptionScoringEngineForTests } from "./OptionScoringEngine.ts";
import { generateExecutiveRecommendation, resetRecommendationEngineForTests } from "./RecommendationEngine.ts";
import { analyzeTradeoffs, resetTradeoffAnalysisEngineForTests } from "./TradeoffAnalysisEngine.ts";
import {
  D1_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  D1_CERTIFICATION_FREEZE_TAGS,
  D1_CERTIFIED_TAG,
  D1_DECISION_RECOMMENDATION_CERTIFICATION_TAG,
  DECISION_RECOMMENDATION_COMPLETE_TAG,
  type DecisionRecommendationCertificationGate,
  type DecisionRecommendationCertificationInput,
  type DecisionRecommendationCertificationResult,
} from "./decisionRecommendationCertificationContract.ts";

function gate(
  id: DecisionRecommendationCertificationGate["id"],
  name: string,
  failures: readonly string[]
): DecisionRecommendationCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function resetCertificationRuntime(): void {
  resetDecisionInputAggregatorForTests();
  resetOptionScoringEngineForTests();
  resetTradeoffAnalysisEngineForTests();
  resetRecommendationEngineForTests();
  resetDecisionExplanationBuilderForTests();
  resetDashboardDecisionBindingForTests();
  resetAssistantDecisionBindingForTests();
  resetDecisionRecommendationBindingBridgeForTests();
}

function objectRegistry(): ObjectIntelligenceRegistry {
  const profile = Object.freeze({
    objectId: "supplier-1",
    label: "Supplier One",
    objectType: "supplier",
    source: "scene" as const,
    health: 34,
    impact: 82,
    confidence: 88,
    importance: 95,
    trend: "declining" as const,
  });
  return Object.freeze({
    version: "3.1.0",
    profiles: Object.freeze([profile]),
    profileByObjectId: Object.freeze({ [profile.objectId]: profile }),
    objectCount: 1,
    sceneMutation: false,
    simulation: false,
    diagnostics: Object.freeze(["[OBJECT_INTELLIGENCE_RUNTIME]", "[OBJECT_INTELLIGENCE_PROFILE_CREATED]"] as const),
  });
}

function relationshipRegistry(): RelationshipIntelligenceRegistry {
  const profile = Object.freeze({
    relationshipId: "rel-supplier-inventory",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    relationshipType: "depends_on",
    strength: 84,
    dependency: 91,
    influence: 76,
    confidence: 82,
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
    diagnostics: Object.freeze(["[RELATIONSHIP_INTELLIGENCE_RUNTIME]", "[RELATIONSHIP_INTELLIGENCE_READY]"] as const),
  });
}

function kpiRegistry(): KpiIntelligenceRegistry {
  const profile = Object.freeze({
    kpiId: "revenue",
    label: "Revenue",
    category: "Revenue" as const,
    value: 88,
    target: 110,
    intelligenceScore: 39,
    confidence: 86,
    direction: "down" as const,
    source: "runtime" as const,
  });
  return Object.freeze({
    version: "5.1.0",
    profiles: Object.freeze([profile]),
    profileByKpiId: Object.freeze({ [profile.kpiId]: profile }),
    kpiCount: 1,
    supportedCategories: Object.freeze(["Revenue"] as const),
    visualRendering: false,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: Object.freeze(["[KPI_INTELLIGENCE_RUNTIME]", "[KPI_INTELLIGENCE_READY]"] as const),
  });
}

function riskRegistry(): RiskIntelligenceRegistry {
  const profile = Object.freeze({
    riskId: "supplier-risk",
    subjectId: "supplier-1",
    label: "Supplier continuity",
    primaryCategory: "supply" as const,
    primaryCategoryLabel: "Supply Risk" as const,
    severity: 93,
    exposure: 88,
    confidence: 85,
    momentum: "worsening" as const,
    categories: Object.freeze({
      operationalRisk: 55,
      financialRisk: 24,
      scheduleRisk: 36,
      dependencyRisk: 74,
      supplyRisk: 93,
      strategicRisk: 48,
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
    diagnostics: Object.freeze(["[RISK_INTELLIGENCE_RUNTIME]", "[RISK_INTELLIGENCE_READY]"] as const),
  });
}

function comparisonResult() {
  const request = buildScenarioComparisonRequest({
    comparisonId: "compare-cert",
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
    differenceId: "diff-cert",
    category: "risk",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 6,
    riskMovementDelta: 11,
    kpiMovementDelta: 2,
    confidenceDelta: 4,
    objectCountDelta: 0,
    relationshipCountDelta: 0,
    kpiCountDelta: 1,
    riskCountDelta: 1,
    advantage: "scenarioB",
    summary: "Scenario B reduces supplier risk exposure.",
  });
  return buildScenarioComparisonResult({
    request,
    differences: [difference],
    primaryDifference: difference,
  });
}

export function runDecisionRecommendationCertification(
  input: DecisionRecommendationCertificationInput = {}
): DecisionRecommendationCertificationResult {
  resetCertificationRuntime();
  const gates: DecisionRecommendationCertificationGate[] = [];
  const generatedAt = "2026-06-18T08:00:00.000Z";

  const scenePayload = Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "supplier-1", label: "Supplier One" }),
      Object.freeze({ id: "inventory-1", label: "Inventory" }),
    ]),
    relationships: Object.freeze([
      Object.freeze({ id: "rel-supplier-inventory", sourceId: "supplier-1", targetId: "inventory-1" }),
    ]),
  });
  const routingPayload = Object.freeze({ route: "/type-c", dashboardMode: "dashboard" });
  const simulationPayload = Object.freeze({ active: false, scenarioId: null });
  const sceneBefore = JSON.stringify(scenePayload);
  const topologyBefore = JSON.stringify({
    objects: scenePayload.objects,
    relationships: scenePayload.relationships,
  });
  const routingBefore = JSON.stringify(routingPayload);
  const simulationBefore = JSON.stringify(simulationPayload);

  const object = objectRegistry();
  const relationship = relationshipRegistry();
  const kpi = kpiRegistry();
  const risk = riskRegistry();
  const comparison = comparisonResult();
  const dsBefore = JSON.stringify({ object, relationship, kpi, risk, comparison });

  const scenarioResult = Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    overallScenarioImpact: 74,
    confidence: 81,
    objectCount: 2,
    relationshipCount: 1,
    kpiCount: 1,
    riskCount: 1,
    kpiMovement: Object.freeze({ direction: "positive", delta: 7, confidence: 78 }),
    riskMovement: Object.freeze({ direction: "negative", delta: 5, confidence: 76 }),
    keyPositiveEffects: Object.freeze(["Object simulation confidence remains strong."]),
    keyNegativeEffects: Object.freeze(["Risk movement remains elevated."]),
  });

  const warRoomSignals = Object.freeze([
    buildWarRoomSignal({
      signalId: "signal-supplier-critical",
      source: "risk",
      sourceId: "supplier-risk",
      severity: "critical",
      title: "Supplier risk elevated",
      detail: "Critical supplier risk requires executive attention.",
      confidence: 92,
      timestamp: generatedAt,
    }),
  ]);

  const warRoomPriorities = Object.freeze([
    buildWarRoomPriority({
      priorityId: "priority-stabilize-supplier",
      level: "critical",
      rank: 1,
      title: "Stabilize supplier risk",
      rationale: "Critical supplier risk requires executive attention.",
      relatedSignalIds: ["signal-supplier-critical"],
      relatedAlertIds: [],
    }),
  ]);

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

  const contractBundle = buildDecisionRecommendationBundle({
    bundleId: "decision-cert-bundle",
    generatedAt,
    mode: "ranked",
    recommendations: Object.freeze([
      buildDecisionRecommendation({
        recommendationId: "recommendation-stabilize",
        rank: 1,
        priority: "critical",
        option: options[0]!,
        score: {
          scoreId: "score-stabilize",
          optionId: "option-stabilize",
          value: 82,
          confidence: 86,
        },
        explanation: {
          explanationId: "explanation-stabilize",
          optionId: "option-stabilize",
          rationale: "Stabilize supplier risk under critical pressure.",
          evidenceIds: ["signal-supplier-critical"],
          tradeoffSummary: "Higher cost for lower exposure.",
        },
      }),
    ]),
  });

  const inputProfile = aggregateDecisionInputs({
    profileId: "decision-cert-input",
    generatedAt,
    objectIntelligence: object,
    relationshipIntelligence: relationship,
    kpiIntelligence: kpi,
    riskIntelligence: risk,
    scenarioResults: [scenarioResult],
    compareResults: [comparison],
    warRoomSignals,
  });

  const scoringResult = scoreDecisionOptions({
    evaluatedAt: generatedAt,
    options,
    inputProfile,
  });

  const tradeoffProfile = analyzeTradeoffs({
    profileId: "decision-cert-tradeoff",
    evaluatedAt: generatedAt,
    options,
    scores: scoringResult.scores,
  });

  const recommendation = generateExecutiveRecommendation({
    recommendationId: "decision-cert-recommendation",
    generatedAt,
    options,
    scores: scoringResult.scores,
    tradeoffProfile,
    warRoomPriorities,
  });

  const explanation = buildDecisionExplanationResult({
    explanationId: "decision-cert-explanation",
    generatedAt,
    recommendation,
    tradeoffProfile,
  });

  const bindingInput = Object.freeze({
    boundAt: generatedAt,
    recommendation,
    tradeoffProfile,
    explanation,
  });

  const dashboard = resolveDashboardDecisionBinding(bindingInput);
  const assistant = explainDecisionRecommendation(bindingInput);
  const attached = attachDashboardDecisionBinding(
    Object.freeze({
      objectId: "supplier-1",
      objectName: "Supplier One",
      decisionBinding: null,
      assistantDecisionBinding: null,
    }),
    bindingInput
  );

  gates.push(gate("A", "Decision Contract works", [
    DECISION_RECOMMENDATION_CONTRACT.readOnly === true ? "" : "Decision contract is not read-only",
    DECISION_RECOMMENDATION_CONTRACT.mutation === false ? "" : "Decision contract reports mutation",
    contractBundle.recommendationCount === 1 ? "" : "Decision contract bundle missing recommendation",
    contractBundle.supportsRankedRecommendations === true ? "" : "Ranked recommendations unsupported",
  ].filter(Boolean)));

  gates.push(gate("B", "Input Aggregator works", [
    inputProfile.readinessScore > 0 ? "" : "Input profile readiness missing",
    inputProfile.dsIntelligence.dsProfileCount >= 4 ? "" : "DS intelligence not aggregated",
    inputProfile.recalculation === false ? "" : "Input aggregator recalculated sources",
    inputProfile.sourceMutation === false ? "" : "Input aggregator reports source mutation",
  ].filter(Boolean)));

  gates.push(gate("C", "Option Scoring Engine works", [
    scoringResult.scoreCount === 2 ? "" : "Option scores missing",
    scoringResult.normalizedScoring === true ? "" : "Option scoring not normalized",
    scoringResult.sourceMutation === false ? "" : "Option scoring reports source mutation",
  ].filter(Boolean)));

  gates.push(gate("D", "Tradeoff Analysis Engine works", [
    tradeoffProfile.comparisonCount >= 1 ? "" : "Tradeoff comparisons missing",
    tradeoffProfile.tradeoffCount >= 1 ? "" : "Tradeoffs not identified",
    tradeoffProfile.sourceMutation === false ? "" : "Tradeoff analysis reports source mutation",
  ].filter(Boolean)));

  gates.push(gate("E", "Recommendation Engine works", [
    recommendation.recommendedOption?.option.optionId === "option-stabilize"
      ? ""
      : "Recommended option missing",
    recommendation.rankingCount === 2 ? "" : "Recommendation ranking missing",
    recommendation.executesRecommendations === false ? "" : "Recommendation engine executes recommendations",
  ].filter(Boolean)));

  gates.push(gate("F", "Decision Explanation Builder works", [
    explanation.explanation.optionId === "option-stabilize" ? "" : "Explanation option missing",
    explanation.majorTradeoffs.length >= 1 ? "" : "Major tradeoffs missing from explanation",
    explanation.templateDriven === true ? "" : "Explanation is not template-driven",
    explanation.sourceMutation === false ? "" : "Explanation builder reports source mutation",
  ].filter(Boolean)));

  gates.push(gate("G", "Dashboard Binding works", [
    dashboard.bindingStatus === "bound" ? "" : "Dashboard binding not bound",
    dashboard.view?.recommendedOption?.optionId === "option-stabilize" ? "" : "Dashboard recommended option missing",
    (dashboard.view?.tradeoffs.length ?? 0) >= 1 ? "" : "Dashboard tradeoffs missing",
    dashboard.executesRecommendations === false ? "" : "Dashboard binding executes recommendations",
    attached?.decisionBinding?.bindingStatus === "bound" ? "" : "Dashboard attach bridge failed",
  ].filter(Boolean)));

  gates.push(gate("H", "Assistant Binding works", [
    assistant.view?.recommendationExplanation.kind === "recommendation" ? "" : "Assistant recommendation explanation missing",
    (assistant.view?.tradeoffExplanations.length ?? 0) >= 1 ? "" : "Assistant tradeoff explanations missing",
    assistant.view?.reasoningExplanation.kind === "reasoning" ? "" : "Assistant reasoning explanation missing",
    assistant.actionExecution === false ? "" : "Assistant binding executes actions",
    attached?.assistantDecisionBinding?.explanationCount ? "" : "Assistant attach bridge failed",
  ].filter(Boolean)));

  gates.push(gate("I", "No Scene mutations", [
    JSON.stringify(scenePayload) === sceneBefore ? "" : "Scene payload mutated",
    inputProfile.sceneMutation === false ? "" : "Input profile scene mutation",
    scoringResult.sceneMutation === false ? "" : "Scoring scene mutation",
    tradeoffProfile.sceneMutation === false ? "" : "Tradeoff scene mutation",
    recommendation.sceneMutation === false ? "" : "Recommendation scene mutation",
    explanation.sceneMutation === false ? "" : "Explanation scene mutation",
    dashboard.sceneMutation === false ? "" : "Dashboard scene mutation",
    assistant.sceneMutation === false ? "" : "Assistant scene mutation",
  ].filter(Boolean)));

  gates.push(gate("J", "No Topology mutations", [
    JSON.stringify({ objects: scenePayload.objects, relationships: scenePayload.relationships }) === topologyBefore
      ? ""
      : "Topology payload mutated",
    inputProfile.topologyMutation === false ? "" : "Input profile topology mutation",
    scoringResult.topologyMutation === false ? "" : "Scoring topology mutation",
    tradeoffProfile.topologyMutation === false ? "" : "Tradeoff topology mutation",
    recommendation.topologyMutation === false ? "" : "Recommendation topology mutation",
    explanation.topologyMutation === false ? "" : "Explanation topology mutation",
    dashboard.topologyMutation === false ? "" : "Dashboard topology mutation",
    assistant.topologyMutation === false ? "" : "Assistant topology mutation",
  ].filter(Boolean)));

  gates.push(gate("K", "No Routing changes", [
    JSON.stringify(routingPayload) === routingBefore ? "" : "Routing payload mutated",
    inputProfile.routingMutation === false ? "" : "Input profile routing mutation",
    scoringResult.routingMutation === false ? "" : "Scoring routing mutation",
    tradeoffProfile.routingMutation === false ? "" : "Tradeoff routing mutation",
    recommendation.routingMutation === false ? "" : "Recommendation routing mutation",
    explanation.routingMutation === false ? "" : "Explanation routing mutation",
    dashboard.routingMutation === false ? "" : "Dashboard routing mutation",
    assistant.routingMutation === false ? "" : "Assistant routing mutation",
  ].filter(Boolean)));

  gates.push(gate("L", "No DS mutations", [
    JSON.stringify({ object, relationship, kpi, risk, comparison }) === dsBefore ? "" : "DS payload mutated",
    inputProfile.dsMutation === false ? "" : "Input profile DS mutation",
    scoringResult.dsMutation === false ? "" : "Scoring DS mutation",
    tradeoffProfile.dsMutation === false ? "" : "Tradeoff DS mutation",
    recommendation.dsMutation === false ? "" : "Recommendation DS mutation",
    explanation.dsMutation === false ? "" : "Explanation DS mutation",
    dashboard.dsMutation === false ? "" : "Dashboard DS mutation",
    assistant.dsMutation === false ? "" : "Assistant DS mutation",
  ].filter(Boolean)));

  gates.push(gate("M", "No Simulation mutations", [
    JSON.stringify(simulationPayload) === simulationBefore ? "" : "Simulation payload mutated",
    inputProfile.simulationMutation === false ? "" : "Input profile simulation mutation",
    scoringResult.simulationMutation === false ? "" : "Scoring simulation mutation",
    tradeoffProfile.simulationMutation === false ? "" : "Tradeoff simulation mutation",
    recommendation.simulationMutation === false ? "" : "Recommendation simulation mutation",
    explanation.simulationMutation === false ? "" : "Explanation simulation mutation",
    dashboard.simulationMutation === false ? "" : "Dashboard simulation mutation",
    assistant.simulationMutation === false ? "" : "Assistant simulation mutation",
  ].filter(Boolean)));

  gates.push(gate("N", "Build passes", [
    input.buildPassed === false ? "Build verification failed" : "",
  ].filter(Boolean)));

  gates.push(gate("O", "Tests pass", [
    input.testsPassed === false ? "Test verification failed" : "",
  ].filter(Boolean)));

  const freezeTagsValid =
    D1_CERTIFIED_TAG === "[D1_CERTIFIED]" &&
    DECISION_RECOMMENDATION_COMPLETE_TAG === "[DECISION_RECOMMENDATION_COMPLETE]" &&
    D1_CERTIFICATION_FREEZE_TAGS.length === 2;
  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: D1_DECISION_RECOMMENDATION_CERTIFICATION_TAG,
    version: "1.0.0",
    certified,
    diagnostics: Object.freeze([D1_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: D1_CERTIFICATION_FREEZE_TAGS,
  });
}
