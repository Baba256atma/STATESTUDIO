import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildComparePanelModel } from "../decision/recommendation/buildComparePanelModel";
import { buildDecisionPatternIntelligence } from "../decision/patterns/buildDecisionPatternIntelligence";
import { buildStrategicLearningState } from "../decision/learning/buildStrategicLearningState";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { buildCognitiveDecisionView } from "./buildCognitiveDecisionView";
import { selectDefaultCognitiveStyle } from "./selectDefaultCognitiveStyle";
import type { CognitiveStyle, CognitiveStyleState } from "./cognitiveStyleTypes";

import type { DecisionExecutionResult } from "../executive/decisionExecutionTypes";
import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readDecisionResult(value: DecisionExecutionResult | Record<string, unknown> | null | undefined): DecisionExecutionResult | null {
  return value && typeof value === "object" ? (value as DecisionExecutionResult) : null;
}

type BuildCognitiveStyleStateInput = {
  activeStyle?: CognitiveStyle | null;
  activeMode?: string | null;
  rightPanelView?: string | null;
  responseData?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | Record<string, unknown> | null;
  memoryEntries?: DecisionMemoryEntry[];
};

export function buildCognitiveStyleState(input: BuildCognitiveStyleStateInput): CognitiveStyleState {
  const defaultSelection = selectDefaultCognitiveStyle({
    activeMode: input.activeMode ?? null,
    rightPanelView: input.rightPanelView ?? null,
    responseData: input.responseData ?? null,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const style = input.activeStyle ?? defaultSelection.style;
  const responseData = input.responseData ?? null;
  const decisionResult = readDecisionResult(input.decisionResult);
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    responseData,
    decisionResult,
  });
  const compareModel = buildComparePanelModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    decisionResult,
    strategicAdvice: asRecord(responseData?.strategic_advice),
    responseData,
  });
  const patternIntelligence = buildDecisionPatternIntelligence({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const strategicLearning = buildStrategicLearningState({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: asRecord(responseData?.ai_reasoning),
    simulation: asRecord(responseData?.decision_simulation),
    comparison: asRecord(responseData?.decision_comparison) ?? asRecord(responseData?.comparison),
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    calibration: null,
    responseData,
    memoryEntries: input.memoryEntries ?? [],
  });

  return {
    active_style: style,
    available_styles: ["executive", "analyst", "operator", "investor"],
    selected_reason: input.activeStyle ? "Style selected manually." : defaultSelection.reason,
    defaulted: !input.activeStyle,
    view: buildCognitiveDecisionView({
      style,
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      executiveSummary: asRecord(responseData?.executive_summary_surface),
      confidenceModel,
      compareModel,
      simulation: asRecord(responseData?.decision_simulation),
      patternIntelligence,
      strategicLearning,
      metaDecision,
    }),
  };
}
