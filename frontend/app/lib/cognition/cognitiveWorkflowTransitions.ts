import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { StrategicDecisionGraph } from "../decisionGraph/strategicDecisionGraphTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type {
  CognitiveWorkflowEvidence,
  ExecutiveCognitiveStage,
  ExecutiveCognitiveWorkflow,
} from "./executiveCognitiveWorkflowTypes.ts";

const STAGE_WEIGHT: Record<ExecutiveCognitiveStage, number> = {
  awareness: 1,
  risk_interpretation: 2,
  strategic_framing: 3,
  comparison: 4,
  decision_focus: 5,
  confidence_review: 6,
  monitoring: 7,
};

function alertRank(level: CognitiveWorkflowEvidence["alertLevel"]): number {
  if (level === "critical") return 4;
  if (level === "urgent") return 3;
  if (level === "attention") return 2;
  if (level === "info") return 1;
  return 0;
}

function strongestAlertLevel(alerts: ExecutiveAlert[]): CognitiveWorkflowEvidence["alertLevel"] {
  return alerts.reduce<CognitiveWorkflowEvidence["alertLevel"]>((current, alert) => (
    alertRank(alert.level) > alertRank(current) ? alert.level : current
  ), "none");
}

export function buildCognitiveWorkflowEvidence(params: {
  alerts?: ExecutiveAlert[];
  compressedInsights?: StrategicCompressedInsight[];
  comparisons?: ScenarioComparison[];
  recommendations?: DecisionRecommendation[];
  confidenceSignals?: DecisionConfidence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  decisionGraph?: StrategicDecisionGraph | null;
}): CognitiveWorkflowEvidence {
  const alerts = Array.isArray(params.alerts) ? params.alerts : [];
  const monitoringSignals = Array.isArray(params.monitoringSignals) ? params.monitoringSignals : [];
  const confidenceSignals = Array.isArray(params.confidenceSignals) ? params.confidenceSignals : [];
  return {
    alertLevel: strongestAlertLevel(alerts),
    compressedInsightCount: Array.isArray(params.compressedInsights) ? params.compressedInsights.length : 0,
    comparisonCount: Array.isArray(params.comparisons) ? params.comparisons.length : 0,
    recommendationCount: Array.isArray(params.recommendations) ? params.recommendations.length : 0,
    lowConfidenceCount: confidenceSignals.filter((item) => item.confidenceLevel === "low" || item.confidenceLevel === "moderate").length,
    monitoringActive: monitoringSignals.some((item) => item.monitoringStatus === "elevated" || item.monitoringStatus === "critical"),
    graphHasPath: Boolean((params.decisionGraph?.nodes.length ?? 0) >= 3 && (params.decisionGraph?.edges.length ?? 0) >= 2),
  };
}

export function deriveCandidateCognitiveStage(evidence: CognitiveWorkflowEvidence): ExecutiveCognitiveStage {
  if (evidence.monitoringActive && evidence.recommendationCount > 0 && evidence.alertLevel !== "critical") return "monitoring";
  if (evidence.lowConfidenceCount > 0 && evidence.recommendationCount > 0) return "confidence_review";
  if (evidence.recommendationCount > 0 && evidence.graphHasPath) return "decision_focus";
  if (evidence.comparisonCount > 0) return "comparison";
  if (evidence.compressedInsightCount > 1 || evidence.graphHasPath) return "strategic_framing";
  if (alertRank(evidence.alertLevel) >= 2) return "risk_interpretation";
  return "awareness";
}

export function stabilizeCognitiveStage(params: {
  previousWorkflow?: ExecutiveCognitiveWorkflow | null;
  candidateStage: ExecutiveCognitiveStage;
  evidence: CognitiveWorkflowEvidence;
}): ExecutiveCognitiveStage {
  const previous = params.previousWorkflow?.currentStage;
  if (!previous || previous === params.candidateStage) return params.candidateStage;
  if (params.evidence.alertLevel === "critical") return "risk_interpretation";
  if (params.evidence.lowConfidenceCount > 0 && params.evidence.recommendationCount > 0) return "confidence_review";

  const previousWeight = STAGE_WEIGHT[previous];
  const candidateWeight = STAGE_WEIGHT[params.candidateStage];
  if (Math.abs(candidateWeight - previousWeight) <= 1) return previous;
  if (previous === "monitoring" && params.evidence.monitoringActive) return previous;
  return params.candidateStage;
}
