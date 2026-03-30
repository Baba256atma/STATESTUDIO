import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildComparePanelModel } from "../decision/recommendation/buildComparePanelModel";
import { buildDecisionPatternIntelligence } from "../decision/patterns/buildDecisionPatternIntelligence";
import { buildStrategicLearningState } from "../decision/learning/buildStrategicLearningState";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { buildCognitiveDecisionView } from "./buildCognitiveDecisionView";
import { selectDefaultCognitiveStyle } from "./selectDefaultCognitiveStyle";
import type { CognitiveStyle, CognitiveStyleState } from "./cognitiveStyleTypes";

type BuildCognitiveStyleStateInput = {
  activeStyle?: CognitiveStyle | null;
  activeMode?: string | null;
  rightPanelView?: string | null;
  responseData?: any | null;
  canonicalRecommendation?: any | null;
  decisionResult?: any | null;
  memoryEntries?: any[];
};

export function buildCognitiveStyleState(input: BuildCognitiveStyleStateInput): CognitiveStyleState {
  const defaultSelection = selectDefaultCognitiveStyle({
    activeMode: input.activeMode ?? null,
    rightPanelView: input.rightPanelView ?? null,
    responseData: input.responseData ?? null,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const style = input.activeStyle ?? defaultSelection.style;
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    responseData: input.responseData ?? null,
    decisionResult: input.decisionResult ?? null,
  });
  const compareModel = buildComparePanelModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    decisionResult: input.decisionResult ?? null,
    strategicAdvice: input.responseData?.strategic_advice ?? null,
    responseData: input.responseData ?? null,
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
    reasoning: input.responseData?.ai_reasoning ?? null,
    simulation: input.responseData?.decision_simulation ?? null,
    comparison: input.responseData?.decision_comparison ?? input.responseData?.comparison ?? null,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    calibration: null,
    responseData: input.responseData ?? null,
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
      executiveSummary: input.responseData?.executive_summary_surface ?? null,
      confidenceModel,
      compareModel,
      simulation: input.responseData?.decision_simulation ?? null,
      patternIntelligence,
      strategicLearning,
      metaDecision,
    }),
  };
}
