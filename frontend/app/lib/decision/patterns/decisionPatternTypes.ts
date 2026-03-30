export type DecisionPatternSignal = {
  id: string;
  label: string;
  type:
    | "success_pattern"
    | "failure_pattern"
    | "risk_pattern"
    | "tradeoff_pattern"
    | "confidence_pattern"
    | "data_gap_pattern";
  strength: "weak" | "moderate" | "strong";
  frequency: number;
  summary: string;
};

export type DecisionPatternCluster = {
  id: string;
  label: string;
  entry_ids: string[];
  recurring_features: string[];
  recurring_actions: string[];
  recurring_outcomes: string[];
};

export type DecisionPatternIntelligence = {
  coverage_count: number;
  pattern_signals: DecisionPatternSignal[];
  clusters: DecisionPatternCluster[];
  top_success_patterns: string[];
  top_failure_patterns: string[];
  repeated_tradeoffs: string[];
  repeated_uncertainties: string[];
  recommendation_hint?: string | null;
  current_pattern_note?: string | null;
  related_entry_ids?: string[];
  explanation: string;
};
