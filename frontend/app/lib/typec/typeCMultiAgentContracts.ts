import type { TypeCAdaptiveGuidance } from "./typeCAdaptiveGuidance.ts";
import type { TypeCDecisionRecommendation } from "./typeCDecisionRecommendation.ts";
import type { TypeCLearningSignals } from "./typeCMemory.ts";

export type TypeCMultiAgentRequest = {
  recommendation: TypeCDecisionRecommendation | null;
  adaptiveGuidance: TypeCAdaptiveGuidance | null;
  memorySummary?: TypeCLearningSignals;
};

export type TypeCAgentResponse = {
  agent: string;
  insight: string;
  concerns: string[];
  recommendations: string[];
  confidence: number;
};

export type TypeCMultiAgentSynthesis = {
  executiveSummary: string;
  keyAgreement: string;
  keyConflict: string;
  strategicRecommendation: string;
  cautionAreas: string[];
  confidence: number;
};

export type TypeCMultiAgentInsight = {
  agentResponses: TypeCAgentResponse[];
  synthesis: TypeCMultiAgentSynthesis;
  source?: "multi_agent_ai";
};
