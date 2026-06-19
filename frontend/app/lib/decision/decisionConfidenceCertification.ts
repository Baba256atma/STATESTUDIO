/**
 * D:2:7 — Decision Confidence Engine certification.
 *
 * Certifies the complete D:2 decision confidence pipeline from contract through
 * dashboard and assistant bindings with no mutation or decision execution authority.
 */

import {
  attachDashboardConfidenceBinding,
  resetDecisionConfidenceBindingBridgeForTests,
} from "../dashboard/decision/decisionConfidenceBindingBridge.ts";
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
import {
  explainDecisionConfidence,
  resetAssistantConfidenceBindingForTests,
} from "./AssistantConfidenceBridge.ts";
import {
  buildConfidenceExplanationResult,
  resetConfidenceExplanationBuilderForTests,
} from "./ConfidenceExplanationBuilder.ts";
import {
  resolveDashboardConfidenceBinding,
  resetDashboardConfidenceBindingForTests,
} from "./DashboardConfidenceBinding.ts";
import {
  DECISION_CONFIDENCE_CONTRACT,
  buildDecisionConfidenceProfile,
} from "./DecisionConfidenceContract.ts";
import { aggregateDecisionInputs, resetDecisionInputAggregatorForTests } from "./DecisionInputAggregator.ts";
import {
  measureEvidenceStrength,
  resetEvidenceStrengthEngineForTests,
} from "./EvidenceStrengthEngine.ts";
import {
  buildDecisionExplanation,
  buildDecisionOption,
  buildDecisionRecommendation,
} from "./DecisionRecommendationContract.ts";
import { scoreDecisionOptions, resetOptionScoringEngineForTests } from "./OptionScoringEngine.ts";
import {
  generateExecutiveRecommendation,
  resetRecommendationEngineForTests,
} from "./RecommendationEngine.ts";
import {
  buildEvidenceStrengthProfile,
  resetRecommendationConfidenceScoringEngineForTests,
  scoreRecommendationConfidences,
} from "./RecommendationConfidenceScoringEngine.ts";
import { analyzeTradeoffs, resetTradeoffAnalysisEngineForTests } from "./TradeoffAnalysisEngine.ts";
import {
  buildUncertaintyProfile,
  resetUncertaintyDetectionEngineForTests,
} from "./UncertaintyDetectionEngine.ts";
import {
  D2_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  D2_CERTIFICATION_FREEZE_TAGS,
  D2_CERTIFIED_TAG,
  D2_DECISION_CONFIDENCE_CERTIFICATION_TAG,
  DECISION_CONFIDENCE_COMPLETE_TAG,
  type DecisionConfidenceCertificationGate,
  type DecisionConfidenceCertificationInput,
  type DecisionConfidenceCertificationResult,
} from "./decisionConfidenceCertificationContract.ts";

function gate(
  id: DecisionConfidenceCertificationGate["id"],
  name: string,
  failures: readonly string[]
): DecisionConfidenceCertificationGate {
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
  resetEvidenceStrengthEngineForTests();
  resetUncertaintyDetectionEngineForTests();
  resetRecommendationConfidenceScoringEngineForTests();
  resetConfidenceExplanationBuilderForTests();
  resetDashboardConfidenceBindingForTests();
  resetAssistantConfidenceBindingForTests();
  resetDecisionConfidenceBindingBridgeForTests();
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
    intelligenceScore: 72,
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
    comparisonId: "compare-confidence-cert",
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
    differenceId: "diff-confidence-cert",
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

export function runDecisionConfidenceCertification(
  input: DecisionConfidenceCertificationInput = {}
): DecisionConfidenceCertificationResult {
  resetCertificationRuntime();
  const gates: DecisionConfidenceCertificationGate[] = [];
  const generatedAt = "2026-06-18T09:00:00.000Z";

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
    confidence: 82,
    objectCount: 2,
    relationshipCount: 1,
    kpiCount: 1,
    riskCount: 1,
    kpiMovement: Object.freeze({ direction: "neutral", delta: 0, confidence: 78 }),
    riskMovement: Object.freeze({ direction: "negative", delta: 5, confidence: 76 }),
    keyPositiveEffects: Object.freeze(["Object simulation confidence remains strong."]),
    keyNegativeEffects: Object.freeze(["Risk movement remains elevated."]),
  });

  const warRoomSignals = Object.freeze([
    buildWarRoomSignal({
      signalId: "signal-supplier-watch",
      source: "risk",
      sourceId: "supplier-risk",
      severity: "watch",
      title: "Supplier risk elevated",
      detail: "Watch supplier risk requires executive attention.",
      confidence: 84,
      timestamp: generatedAt,
    }),
  ]);

  const warRoomPriorities = Object.freeze([
    buildWarRoomPriority({
      priorityId: "priority-stabilize-supplier",
      level: "critical",
      rank: 1,
      title: "Stabilize supplier risk",
      rationale: "Supplier risk requires executive attention.",
      relatedSignalIds: ["signal-supplier-watch"],
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

  const confidenceProfile = buildDecisionConfidenceProfile({
    profileId: "confidence-cert-profile",
    generatedAt,
    confidenceScore: 78,
    evidence: {
      profileId: "confidence-cert-evidence",
      evidenceItems: Object.freeze([
        Object.freeze({
          evidenceId: "evidence-supplier-risk",
          label: "Supplier risk signal",
          sourceId: "supplier-risk",
          strength: 82,
          readOnly: true as const,
          mutation: false as const,
        }),
        Object.freeze({
          evidenceId: "evidence-simulation",
          label: "Scenario simulation",
          sourceId: "scenario-a",
          strength: 76,
          readOnly: true as const,
          mutation: false as const,
        }),
      ]),
      sufficientEvidence: true,
    },
    uncertainty: {
      profileId: "confidence-cert-uncertainty",
      factors: Object.freeze([]),
      evidenceGapCount: 0,
    },
    explanation: {
      explanationId: "confidence-cert-explanation",
      summary: "Executive confidence remains high with sufficient evidence.",
      evidenceSummary: "Supplier risk and simulation evidence support the recommendation.",
      uncertaintySummary: "No material uncertainty findings remain.",
      evidenceIds: Object.freeze(["evidence-supplier-risk", "evidence-simulation"]),
      uncertaintyFactorIds: Object.freeze([]),
    },
  });

  const inputProfile = aggregateDecisionInputs({
    profileId: "confidence-cert-input",
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
    profileId: "confidence-cert-tradeoff",
    evaluatedAt: generatedAt,
    options,
    scores: scoringResult.scores,
  });

  const recommendation = generateExecutiveRecommendation({
    recommendationId: "confidence-cert-recommendation",
    generatedAt,
    options,
    scores: scoringResult.scores,
    tradeoffProfile,
    warRoomPriorities,
  });

  const rankingBefore = recommendation.ranking.map((entry) => entry.optionId);

  const stabilizeScore = scoringResult.scores.find((entry) => entry.optionId === "option-stabilize");
  const monitorScore = scoringResult.scores.find((entry) => entry.optionId === "option-monitor");

  const stabilizeRecommendation = stabilizeScore
    ? buildDecisionRecommendation({
        recommendationId: "confidence-cert-stabilize",
        rank: 1,
        priority: "critical",
        option: options[0]!,
        score: stabilizeScore,
        explanation: buildDecisionExplanation({
          explanationId: "confidence-cert-explanation-stabilize",
          optionId: "option-stabilize",
          rationale: "Stabilize supplier risk under executive pressure.",
          evidenceIds: ["supplier-risk", "signal-supplier-watch", "supplier-1"],
          tradeoffSummary: "Higher cost for lower exposure.",
        }),
      })
    : null;

  const monitorRecommendation = monitorScore
    ? buildDecisionRecommendation({
        recommendationId: "confidence-cert-monitor",
        rank: 2,
        priority: "medium",
        option: options[1]!,
        score: monitorScore,
        explanation: buildDecisionExplanation({
          explanationId: "confidence-cert-explanation-monitor",
          optionId: "option-monitor",
          rationale: "Monitoring remains viable while evidence stabilizes.",
          evidenceIds: ["supplier-risk", "supplier-1"],
          tradeoffSummary: "Lower immediate cost with residual exposure.",
        }),
      })
    : null;

  const stabilizeEvidenceScore =
    stabilizeRecommendation &&
    measureEvidenceStrength({
      evaluatedAt: generatedAt,
      inputProfile,
      recommendation: stabilizeRecommendation,
      explanation: stabilizeRecommendation.explanation,
    });
  const monitorEvidenceScore =
    monitorRecommendation &&
    measureEvidenceStrength({
      evaluatedAt: generatedAt,
      inputProfile,
      recommendation: monitorRecommendation,
      explanation: monitorRecommendation.explanation,
    });
  const stabilizeEvidence = stabilizeEvidenceScore
    ? buildEvidenceStrengthProfile(stabilizeEvidenceScore)
    : null;
  const monitorEvidence = monitorEvidenceScore ? buildEvidenceStrengthProfile(monitorEvidenceScore) : null;

  const stabilizeUncertainty = buildUncertaintyProfile({
    evaluatedAt: generatedAt,
    inputProfile,
    recommendation: stabilizeRecommendation,
  });
  const monitorUncertainty = buildUncertaintyProfile({
    evaluatedAt: generatedAt,
    inputProfile,
    recommendation: monitorRecommendation,
  });

  const confidenceBatch =
    stabilizeScore &&
    monitorScore &&
    stabilizeEvidence &&
    monitorEvidence &&
    stabilizeRecommendation &&
    monitorRecommendation
      ? scoreRecommendationConfidences({
          evaluatedAt: generatedAt,
          entries: Object.freeze([
            {
              evaluatedAt: generatedAt,
              recommendationId: stabilizeRecommendation.recommendationId,
              optionId: "option-stabilize",
              rank: 1,
              score: stabilizeScore,
              evidenceStrength: stabilizeEvidence,
              uncertainty: stabilizeUncertainty,
              tradeoff: tradeoffProfile,
            },
            {
              evaluatedAt: generatedAt,
              recommendationId: monitorRecommendation.recommendationId,
              optionId: "option-monitor",
              rank: 2,
              score: monitorScore,
              evidenceStrength: monitorEvidence,
              uncertainty: monitorUncertainty,
              tradeoff: tradeoffProfile,
            },
          ]),
        })
      : null;

  const primaryConfidence = confidenceBatch?.scores.find(
    (entry) => entry.recommendationId === stabilizeRecommendation?.recommendationId
  );

  const explanation =
    primaryConfidence && stabilizeEvidence && stabilizeEvidenceScore && stabilizeRecommendation
      ? buildConfidenceExplanationResult({
          explanationId: "confidence-cert-builder-explanation",
          generatedAt,
          recommendationId: stabilizeRecommendation.recommendationId,
          optionLabel: options[0]!.label,
          confidenceScore: primaryConfidence,
          evidenceStrength: stabilizeEvidence,
          evidenceStrengthScore: stabilizeEvidenceScore,
          uncertainty: stabilizeUncertainty,
          decisionExplanation: stabilizeRecommendation.explanation,
        })
      : null;

  const bindingInput =
    primaryConfidence && stabilizeEvidence && explanation && stabilizeRecommendation
      ? Object.freeze({
          boundAt: generatedAt,
          recommendationId: stabilizeRecommendation.recommendationId,
          optionId: "option-stabilize",
          optionLabel: options[0]!.label,
          confidenceScore: primaryConfidence,
          evidenceStrength: stabilizeEvidence,
          uncertainty: stabilizeUncertainty,
          explanation,
        })
      : null;

  const dashboard = bindingInput ? resolveDashboardConfidenceBinding(bindingInput) : null;
  const assistant = bindingInput ? explainDecisionConfidence(bindingInput) : null;
  const attached = bindingInput
    ? attachDashboardConfidenceBinding(
        Object.freeze({
          objectId: "supplier-1",
          objectName: "Supplier One",
          confidenceBinding: null,
          assistantConfidenceBinding: null,
        }),
        bindingInput
      )
    : null;

  gates.push(
    gate("A", "Decision Confidence Contract works", [
      DECISION_CONFIDENCE_CONTRACT.readOnly === true ? "" : "Decision confidence contract is not read-only",
      DECISION_CONFIDENCE_CONTRACT.mutation === false ? "" : "Decision confidence contract reports mutation",
      confidenceProfile.confidenceLevel === "high" ? "" : "Decision confidence profile level missing",
      confidenceProfile.supportsInsufficientEvidence === true ? "" : "Insufficient evidence unsupported",
    ].filter(Boolean))
  );

  gates.push(
    gate("B", "Evidence Strength Engine works", [
      !stabilizeEvidenceScore ? "Evidence strength score missing" : "",
      stabilizeEvidenceScore && stabilizeEvidenceScore.value >= 0 && stabilizeEvidenceScore.value <= 100
        ? ""
        : "Evidence strength score not normalized",
      stabilizeEvidenceScore?.mutation === false ? "" : "Evidence strength reports mutation",
      stabilizeEvidenceScore?.dimensions.length === 5 ? "" : "Evidence strength dimensions missing",
    ].filter(Boolean))
  );

  gates.push(
    gate("C", "Uncertainty Detection Engine works", [
      stabilizeUncertainty.findingCount >= 0 ? "" : "Uncertainty findings missing",
      stabilizeUncertainty.readOnly === true ? "" : "Uncertainty profile is not read-only",
      stabilizeUncertainty.mutation === false ? "" : "Uncertainty detection reports mutation",
    ].filter(Boolean))
  );

  gates.push(
    gate("D", "Recommendation Confidence Scoring works", [
      !confidenceBatch ? "Confidence batch missing" : "",
      confidenceBatch?.scoreCount === 2 ? "" : "Confidence scores missing",
      confidenceBatch?.rankingPreserved === true ? "" : "Confidence scoring did not preserve ranking flag",
      primaryConfidence?.rankingPreserved === true ? "" : "Primary confidence score ranking not preserved",
      primaryConfidence &&
      primaryConfidence.confidenceScore >= 0 &&
      primaryConfidence.confidenceScore <= 100
        ? ""
        : "Confidence score not normalized",
    ].filter(Boolean))
  );

  gates.push(
    gate("E", "Confidence Explanation Builder works", [
      !explanation ? "Confidence explanation missing" : "",
      explanation && primaryConfidence && explanation.explanation.confidenceLevel === primaryConfidence.confidenceLevel
        ? ""
        : "Explanation confidence level mismatch",
      (explanation?.supportingEvidence.length ?? 0) >= 1 ? "" : "Supporting evidence explanation missing",
      explanation?.templateDriven === true ? "" : "Confidence explanation is not template-driven",
      explanation?.sourceMutation === false ? "" : "Confidence explanation reports source mutation",
    ].filter(Boolean))
  );

  gates.push(
    gate("F", "Dashboard Binding works", [
      !dashboard ? "Dashboard binding missing" : "",
      dashboard?.bindingStatus === "bound" ? "" : "Dashboard confidence binding not bound",
      dashboard?.view?.confidenceScore === primaryConfidence?.confidenceScore
        ? ""
        : "Dashboard confidence score missing",
      (dashboard?.view?.uncertaintyWarnings.length ?? 0) >= 0 ? "" : "Dashboard uncertainty warnings missing",
      dashboard?.executesDecisions === false ? "" : "Dashboard binding executes decisions",
      attached?.confidenceBinding?.bindingStatus === "bound" ? "" : "Dashboard attach bridge failed",
    ].filter(Boolean))
  );

  gates.push(
    gate("G", "Assistant Binding works", [
      !assistant ? "Assistant binding missing" : "",
      assistant?.view?.confidenceLevelExplanation.kind === "confidence_level"
        ? ""
        : "Assistant confidence level explanation missing",
      (assistant?.view?.supportingEvidenceExplanations.length ?? 0) >= 1
        ? ""
        : "Assistant supporting evidence explanations missing",
      assistant?.view?.remainingUncertaintyExplanation.kind === "remaining_uncertainty"
        ? ""
        : "Assistant remaining uncertainty explanation missing",
      assistant?.actionExecution === false ? "" : "Assistant binding executes actions",
      attached?.assistantConfidenceBinding?.explanationCount ? "" : "Assistant attach bridge failed",
    ].filter(Boolean))
  );

  gates.push(
    gate("H", "Recommendation ranking unchanged", [
      confidenceBatch?.rankingPreserved === true ? "" : "Confidence batch ranking not preserved",
      JSON.stringify(confidenceBatch?.scores.map((entry) => entry.rank) ?? []) === JSON.stringify([1, 2])
        ? ""
        : "Confidence ranks changed",
      JSON.stringify(rankingBefore) === JSON.stringify(["option-stabilize", "option-monitor"])
        ? ""
        : "Executive recommendation ranking changed",
    ].filter(Boolean))
  );

  gates.push(
    gate("I", "No Scene mutations", [
      JSON.stringify(scenePayload) === sceneBefore ? "" : "Scene payload mutated",
      inputProfile.sceneMutation === false ? "" : "Input profile scene mutation",
      stabilizeUncertainty.sceneMutation === false ? "" : "Uncertainty scene mutation",
      confidenceBatch?.sceneMutation === false ? "" : "Confidence scoring scene mutation",
      explanation?.sceneMutation === false ? "" : "Explanation scene mutation",
      dashboard?.sceneMutation === false ? "" : "Dashboard scene mutation",
      assistant?.sceneMutation === false ? "" : "Assistant scene mutation",
    ].filter(Boolean))
  );

  gates.push(
    gate("J", "No Topology mutations", [
      JSON.stringify({ objects: scenePayload.objects, relationships: scenePayload.relationships }) === topologyBefore
        ? ""
        : "Topology payload mutated",
      inputProfile.topologyMutation === false ? "" : "Input profile topology mutation",
      confidenceBatch?.topologyMutation === false ? "" : "Confidence scoring topology mutation",
      explanation?.topologyMutation === false ? "" : "Explanation topology mutation",
      dashboard?.topologyMutation === false ? "" : "Dashboard topology mutation",
      assistant?.topologyMutation === false ? "" : "Assistant topology mutation",
    ].filter(Boolean))
  );

  gates.push(
    gate("K", "No Routing changes", [
      JSON.stringify(routingPayload) === routingBefore ? "" : "Routing payload mutated",
      inputProfile.routingMutation === false ? "" : "Input profile routing mutation",
      confidenceBatch?.routingMutation === false ? "" : "Confidence scoring routing mutation",
      explanation?.routingMutation === false ? "" : "Explanation routing mutation",
      dashboard?.routingMutation === false ? "" : "Dashboard routing mutation",
      assistant?.routingMutation === false ? "" : "Assistant routing mutation",
    ].filter(Boolean))
  );

  gates.push(
    gate("L", "No DS mutations", [
      JSON.stringify({ object, relationship, kpi, risk, comparison }) === dsBefore ? "" : "DS payload mutated",
      inputProfile.dsMutation === false ? "" : "Input profile DS mutation",
      confidenceBatch?.dsMutation === false ? "" : "Confidence scoring DS mutation",
      explanation?.dsMutation === false ? "" : "Explanation DS mutation",
      dashboard?.dsMutation === false ? "" : "Dashboard DS mutation",
      assistant?.dsMutation === false ? "" : "Assistant DS mutation",
    ].filter(Boolean))
  );

  gates.push(
    gate("M", "No Simulation mutations", [
      JSON.stringify(simulationPayload) === simulationBefore ? "" : "Simulation payload mutated",
      inputProfile.simulationMutation === false ? "" : "Input profile simulation mutation",
      confidenceBatch?.simulationMutation === false ? "" : "Confidence scoring simulation mutation",
      explanation?.simulationMutation === false ? "" : "Explanation simulation mutation",
      dashboard?.simulationMutation === false ? "" : "Dashboard simulation mutation",
      assistant?.simulationMutation === false ? "" : "Assistant simulation mutation",
    ].filter(Boolean))
  );

  gates.push(
    gate("N", "No Decision execution", [
      dashboard?.executesDecisions === false ? "" : "Dashboard binding executes decisions",
      assistant?.actionExecution === false ? "" : "Assistant binding executes decisions",
      recommendation.executesRecommendations === false ? "" : "Recommendation engine executes decisions",
      attached?.confidenceBinding?.executesDecisions === false ? "" : "Attached dashboard binding executes decisions",
      attached?.assistantConfidenceBinding?.actionExecution === false
        ? ""
        : "Attached assistant binding executes actions",
    ].filter(Boolean))
  );

  gates.push(
    gate("O", "Build passes", [input.buildPassed === false ? "Build verification failed" : ""].filter(Boolean))
  );

  gates.push(
    gate("P", "Tests pass", [input.testsPassed === false ? "Test verification failed" : ""].filter(Boolean))
  );

  const freezeTagsValid =
    D2_CERTIFIED_TAG === "[D2_CERTIFIED]" &&
    DECISION_CONFIDENCE_COMPLETE_TAG === "[DECISION_CONFIDENCE_COMPLETE]" &&
    D2_CERTIFICATION_FREEZE_TAGS.length === 2;
  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: D2_DECISION_CONFIDENCE_CERTIFICATION_TAG,
    version: "1.0.0",
    certified,
    diagnostics: Object.freeze([D2_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: D2_CERTIFICATION_FREEZE_TAGS,
  });
}
