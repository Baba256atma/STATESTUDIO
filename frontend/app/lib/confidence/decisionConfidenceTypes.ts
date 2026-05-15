export type ConfidenceLevel =
  | "low"
  | "moderate"
  | "high"
  | "very_high";

export interface DecisionConfidence {
  id: string;
  relatedRecommendationId?: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  rationale: string;
  uncertaintyFactors?: string[];
  supportingSignals?: string[];
  domainId?: string;
  createdAt: number;
}

export type DecisionConfidenceOverlayState = {
  topConfidenceId?: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  uncertaintyFactors: string[];
  supportingSignals: string[];
  executiveSummary: string;
};
