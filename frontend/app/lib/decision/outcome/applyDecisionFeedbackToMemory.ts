import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type {
  DecisionCalibrationResult,
  DecisionOutcomeFeedback,
} from "./decisionOutcomeTypes";

export function applyDecisionFeedbackToMemory(input: {
  entry: DecisionMemoryEntry | null;
  outcomeFeedback: DecisionOutcomeFeedback;
  calibrationResult: DecisionCalibrationResult;
}): DecisionMemoryEntry | null {
  if (!input.entry) return null;

  return {
    ...input.entry,
    observed_outcome_summary: input.outcomeFeedback.observed_summary ?? input.entry.observed_outcome_summary ?? null,
    outcome_status: input.outcomeFeedback.outcome_status,
    feedback_summary: input.outcomeFeedback.feedback_summary,
    observed_signals: input.outcomeFeedback.observed_signals,
    calibration_result: input.calibrationResult,
  };
}
