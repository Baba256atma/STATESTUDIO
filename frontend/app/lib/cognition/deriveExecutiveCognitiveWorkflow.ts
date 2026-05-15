import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { StrategicDecisionGraph } from "../decisionGraph/strategicDecisionGraphTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ExecutiveNarrative } from "../narrative/narrativeSynthesisTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import {
  buildCognitiveWorkflowEvidence,
  deriveCandidateCognitiveStage,
  stabilizeCognitiveStage,
} from "./cognitiveWorkflowTransitions.ts";
import {
  buildCognitiveStageSummary,
  labelForCognitiveStage,
} from "./cognitiveWorkflowNarratives.ts";
import { deriveExecutiveFocusGuidance } from "./deriveExecutiveFocusGuidance.ts";
import type {
  CognitiveWorkflowOverlayState,
  ExecutiveCognitiveWorkflow,
} from "./executiveCognitiveWorkflowTypes.ts";

const DETERMINISTIC_UPDATED_AT = 0;

function unique(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }
  return result;
}

function averageConfidence(values: unknown[]): number | undefined {
  const numbers = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!numbers.length) return undefined;
  return Math.round((numbers.reduce((sum, value) => sum + Math.min(1, Math.max(0, value)), 0) / numbers.length) * 100) / 100;
}

function primaryDomain(params: {
  alerts?: ExecutiveAlert[];
  compressedInsights?: StrategicCompressedInsight[];
  recommendations?: DecisionRecommendation[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  narratives?: ExecutiveNarrative[];
}): string | undefined {
  return params.alerts?.[0]?.domainId ??
    params.compressedInsights?.[0]?.domainId ??
    params.recommendations?.[0]?.domainId ??
    params.monitoringSignals?.[0]?.domainId ??
    params.narratives?.[0]?.domainId;
}

function logWorkflow(params: {
  workflow: ExecutiveCognitiveWorkflow;
  previousWorkflow?: ExecutiveCognitiveWorkflow | null;
  debug?: boolean;
}): void {
  if (!params.debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][ExecutiveCognitiveWorkflow]", {
    currentStage: params.workflow.currentStage,
    recommendedFocus: params.workflow.recommendedFocus ?? null,
    workflowTransition: params.previousWorkflow?.currentStage && params.previousWorkflow.currentStage !== params.workflow.currentStage
      ? `${params.previousWorkflow.currentStage}->${params.workflow.currentStage}`
      : "stable",
    confidence: params.workflow.confidence ?? null,
    relatedSignals: params.workflow.relatedInsightIds ?? [],
  });
}

export function deriveExecutiveCognitiveWorkflow(params: {
  alerts?: ExecutiveAlert[];
  compressedInsights?: StrategicCompressedInsight[];
  decisionGraph?: StrategicDecisionGraph | null;
  comparisons?: ScenarioComparison[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  confidenceSignals?: DecisionConfidence[];
  recommendations?: DecisionRecommendation[];
  narratives?: ExecutiveNarrative[];
  previousWorkflow?: ExecutiveCognitiveWorkflow | null;
  now?: number;
  debug?: boolean;
}): ExecutiveCognitiveWorkflow {
  const evidence = buildCognitiveWorkflowEvidence(params);
  const candidateStage = deriveCandidateCognitiveStage(evidence);
  const currentStage = stabilizeCognitiveStage({
    previousWorkflow: params.previousWorkflow,
    candidateStage,
    evidence,
  });
  const recommendedFocus = deriveExecutiveFocusGuidance(params);
  const stageHeadline = labelForCognitiveStage(currentStage);
  const stageSummary = buildCognitiveStageSummary({
    stage: currentStage,
    focus: recommendedFocus,
  });
  const relatedInsightIds = unique([
    ...(params.alerts ?? []).flatMap((alert) => alert.relatedInsightIds ?? [alert.id]),
    ...(params.compressedInsights ?? []).flatMap((insight) => insight.supportingInsightIds),
    ...(params.narratives ?? []).flatMap((narrative) => narrative.relatedInsightIds),
  ]);
  const relatedScenarioIds = unique([
    ...(params.alerts ?? []).flatMap((alert) => alert.relatedScenarioIds ?? []),
    ...(params.compressedInsights ?? []).flatMap((insight) => insight.supportingScenarioIds ?? []),
    ...(params.comparisons ?? []).flatMap((comparison) => [comparison.scenarioAId, comparison.scenarioBId, comparison.recommendedScenarioId]),
    ...(params.recommendations ?? []).flatMap((recommendation) => recommendation.relatedScenarioIds ?? []),
  ]);
  const relatedRecommendationIds = unique([
    ...(params.recommendations ?? []).map((recommendation) => recommendation.id),
    ...(params.confidenceSignals ?? []).map((confidence) => confidence.relatedRecommendationId),
  ]);
  const confidence = averageConfidence([
    ...(params.alerts ?? []).map((alert) => alert.confidence),
    ...(params.recommendations ?? []).map((recommendation) => recommendation.confidence),
    ...(params.monitoringSignals ?? []).map((signal) => signal.confidence),
    ...(params.confidenceSignals ?? []).map((signal) => signal.confidenceScore),
    ...(params.narratives ?? []).map((narrative) => narrative.confidence),
  ]);

  const workflow: ExecutiveCognitiveWorkflow = {
    id: "executive_cognitive_workflow_v1",
    currentStage,
    stageHeadline,
    stageSummary,
    recommendedFocus,
    ...(relatedInsightIds.length ? { relatedInsightIds } : {}),
    ...(relatedScenarioIds.length ? { relatedScenarioIds } : {}),
    ...(relatedRecommendationIds.length ? { relatedRecommendationIds } : {}),
    ...(typeof confidence === "number" ? { confidence } : {}),
    ...(primaryDomain(params) ? { domainId: primaryDomain(params) } : {}),
    updatedAt: typeof params.now === "number" ? params.now : DETERMINISTIC_UPDATED_AT,
  };

  logWorkflow({
    workflow,
    previousWorkflow: params.previousWorkflow,
    debug: params.debug,
  });
  return workflow;
}

export function buildCognitiveWorkflowOverlayState(params: {
  workflow: ExecutiveCognitiveWorkflow;
}): CognitiveWorkflowOverlayState {
  return {
    currentStage: params.workflow.currentStage,
    stageHeadline: params.workflow.stageHeadline,
    stageSummary: params.workflow.stageSummary ?? "Maintain executive orientation around current operating signals.",
    recommendedFocus: params.workflow.recommendedFocus ?? "Maintain executive awareness of current strategic signals.",
    confidence: params.workflow.confidence ?? 0,
  };
}
