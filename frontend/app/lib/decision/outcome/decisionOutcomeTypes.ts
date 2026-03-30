export type ObservedOutcomeSignal = {
  label: string;
  expected?: string | null;
  observed?: string | null;
  status: "matched" | "improved" | "degraded" | "unknown";
};

export type ObservedOutcomeAssessment = {
  observation_available: boolean;
  observation_strength: "limited" | "moderate" | "strong";
  observed_summary?: string | null;
  observed_signals: ObservedOutcomeSignal[];
  evidence_notes: string[];
};

export type DecisionOutcomeFeedback = {
  recommendation_id?: string | null;
  decision_memory_entry_id?: string | null;
  created_at: number;
  expected_summary?: string | null;
  observed_summary?: string | null;
  outcome_status:
    | "better_than_expected"
    | "as_expected"
    | "worse_than_expected"
    | "insufficient_observation";
  matched_signals: string[];
  diverged_signals: string[];
  observed_signals: ObservedOutcomeSignal[];
  feedback_summary: string;
  guidance?: string | null;
};

export type DecisionCalibrationResult = {
  original_confidence_score?: number | null;
  original_confidence_level?: "low" | "medium" | "high" | "unknown";
  adjusted_confidence_score?: number | null;
  adjusted_confidence_level?: "low" | "medium" | "high" | "unknown";
  calibration_label:
    | "well_calibrated"
    | "overconfident"
    | "underconfident"
    | "insufficient_feedback";
  explanation: string;
};
