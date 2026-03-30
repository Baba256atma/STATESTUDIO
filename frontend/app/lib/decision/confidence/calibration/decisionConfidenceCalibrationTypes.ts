export type DecisionOutcomeAssessment = {
  outcome_available: boolean;
  outcome_quality: "better_than_expected" | "as_expected" | "worse_than_expected" | "unknown";
  summary: string;
  matched_signals: string[];
  mismatched_signals: string[];
};

export type DecisionConfidenceCalibration = {
  recommendation_id?: string | null;
  predicted_confidence_score: number | null;
  predicted_confidence_level: "low" | "medium" | "high" | "unknown";
  outcome_assessment: DecisionOutcomeAssessment;
  calibration_delta: number | null;
  calibrated_confidence_score: number | null;
  calibrated_confidence_level: "low" | "medium" | "high" | "unknown";
  calibration_label:
    | "well_calibrated"
    | "overconfident"
    | "underconfident"
    | "insufficient_outcome_data";
  explanation: string;
  guidance?: string | null;
};
