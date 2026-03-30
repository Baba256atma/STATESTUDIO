import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type {
  DecisionCalibrationResult,
  DecisionOutcomeFeedback,
} from "./decisionOutcomeTypes";

type BuildDecisionFeedbackSignalInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  outcomeFeedback: DecisionOutcomeFeedback;
  priorAdjustedScore?: number | null;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function levelFromScore(value: number | null | undefined): DecisionCalibrationResult["adjusted_confidence_level"] {
  if (typeof value !== "number" || !Number.isFinite(value)) return "unknown";
  if (value > 0.75) return "high";
  if (value >= 0.45) return "medium";
  return "low";
}

export function buildDecisionFeedbackSignal(
  input: BuildDecisionFeedbackSignalInput
): DecisionCalibrationResult {
  const originalScore =
    typeof input.priorAdjustedScore === "number"
      ? input.priorAdjustedScore
      : typeof input.canonicalRecommendation?.confidence?.score === "number"
        ? input.canonicalRecommendation.confidence.score
        : null;
  const originalLevel =
    input.canonicalRecommendation?.confidence?.level ??
    levelFromScore(originalScore) ??
    "unknown";

  if (input.outcomeFeedback.outcome_status === "insufficient_observation" || originalScore === null) {
    return {
      original_confidence_score: originalScore,
      original_confidence_level: originalLevel,
      adjusted_confidence_score: originalScore,
      adjusted_confidence_level: levelFromScore(originalScore),
      calibration_label: "insufficient_feedback",
      explanation:
        "Outcome evidence is still too limited to adjust confidence responsibly. Nexora is keeping the original trust level in place for now.",
    };
  }

  let delta = 0;
  let calibrationLabel: DecisionCalibrationResult["calibration_label"] = "well_calibrated";

  if (input.outcomeFeedback.outcome_status === "worse_than_expected") {
    delta = originalScore >= 0.75 ? -0.14 : -0.08;
    calibrationLabel = "overconfident";
  } else if (input.outcomeFeedback.outcome_status === "better_than_expected") {
    delta = originalScore <= 0.45 ? 0.12 : 0.06;
    calibrationLabel = "underconfident";
  }

  const adjustedScore = clamp01(originalScore + delta);
  const adjustedLevel = levelFromScore(adjustedScore);
  const explanation =
    calibrationLabel === "overconfident"
      ? "The original recommendation carried more confidence than the observed outcome supports, so Nexora is lowering trust slightly for similar decisions."
      : calibrationLabel === "underconfident"
        ? "The observed outcome held up better than the original confidence implied, so Nexora can treat similar decisions with slightly more confidence."
        : "Observed outcome evidence stayed close to expectation, so the original confidence still looks reasonable.";

  return {
    original_confidence_score: originalScore,
    original_confidence_level: originalLevel,
    adjusted_confidence_score: adjustedScore,
    adjusted_confidence_level: adjustedLevel,
    calibration_label: calibrationLabel,
    explanation,
  };
}
