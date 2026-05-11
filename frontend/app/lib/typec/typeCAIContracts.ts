import type { TypeCAdaptiveGuidance } from "./typeCAdaptiveGuidance.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCLearningSignals } from "./typeCMemory.ts";

export type TypeCAIInsightRequest = {
  decisionRecommendation: TypeCDecisionRecommendation | null;
  adaptiveGuidance: TypeCAdaptiveGuidance | null;
  memorySummary?: TypeCLearningSignals;
};

export type TypeCAIInsightResponse = {
  executiveSummary: string;
  strategicInsight: string;
  cautionNote: string;
  suggestedQuestions: string[];
  confidence: number;
  source?: "ai_assisted";
};
