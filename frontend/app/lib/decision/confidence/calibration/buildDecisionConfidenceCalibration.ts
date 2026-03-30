import type { DecisionMemoryEntry } from "../../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../recommendation/recommendationTypes";
import type { DecisionConfidenceModel } from "../buildDecisionConfidenceModel";
import type {
  DecisionConfidenceCalibration,
  DecisionOutcomeAssessment,
} from "./decisionConfidenceCalibrationTypes";

type BuildDecisionConfidenceCalibrationInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  confidenceModel?: DecisionConfidenceModel | null;
  outcomeAssessment: DecisionOutcomeAssessment;
  memoryEntries?: DecisionMemoryEntry[];
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function scoreToLevel(value: number | null | undefined): DecisionConfidenceCalibration["calibrated_confidence_level"] {
  if (typeof value !== "number" || !Number.isFinite(value)) return "unknown";
  if (value > 0.75) return "high";
  if (value >= 0.45) return "medium";
  return "low";
}

export function buildDecisionConfidenceCalibration(
  input: BuildDecisionConfidenceCalibrationInput
): DecisionConfidenceCalibration {
  const predictedScore =
    typeof input.canonicalRecommendation?.confidence?.score === "number"
      ? input.canonicalRecommendation.confidence.score
      : typeof input.confidenceModel?.overall_score === "number"
        ? input.confidenceModel.overall_score
        : null;
  const predictedLevel =
    input.canonicalRecommendation?.confidence?.level ??
    input.confidenceModel?.level ??
    "unknown";
  const outcome = input.outcomeAssessment;

  if (!outcome.outcome_available || predictedScore === null) {
    return {
      recommendation_id: input.canonicalRecommendation?.id ?? null,
      predicted_confidence_score: predictedScore,
      predicted_confidence_level: predictedLevel,
      outcome_assessment: outcome,
      calibration_delta: null,
      calibrated_confidence_score: predictedScore,
      calibrated_confidence_level: scoreToLevel(predictedScore),
      calibration_label: "insufficient_outcome_data",
      explanation:
        "Nexora does not yet have enough replay or observed outcome evidence to judge whether the original confidence was well calibrated.",
      guidance: "Capture more outcome evidence, or revisit this decision after more replay history is available.",
    };
  }

  let calibrationDelta = 0;
  let calibrationLabel: DecisionConfidenceCalibration["calibration_label"] = "well_calibrated";

  if (outcome.outcome_quality === "worse_than_expected") {
    calibrationDelta = predictedScore >= 0.75 ? -0.14 : -0.08;
    calibrationLabel = "overconfident";
  } else if (outcome.outcome_quality === "better_than_expected") {
    calibrationDelta = predictedScore <= 0.45 ? 0.12 : 0.06;
    calibrationLabel = "underconfident";
  } else {
    calibrationDelta = 0;
    calibrationLabel = "well_calibrated";
  }

  const calibratedScore = clamp01(predictedScore + calibrationDelta);
  const calibratedLevel = scoreToLevel(calibratedScore);
  const explanation =
    calibrationLabel === "overconfident"
      ? "The original recommendation carried more confidence than the replayed outcome supports. Nexora is reducing trust slightly for similar decisions until stronger evidence appears."
      : calibrationLabel === "underconfident"
        ? "The observed outcome held up better than the original confidence implied. Nexora can treat similar decisions with slightly more confidence when the same signals appear again."
        : "The observed outcome broadly matched the original confidence. Nexora can keep treating similar decisions with roughly the same trust level."
  ;
  const guidance =
    calibrationLabel === "overconfident"
      ? "Re-run simulation with updated assumptions, or compare with a lower-risk alternative before escalating."
      : calibrationLabel === "underconfident"
        ? "Keep the current option set, but note that similar decisions may deserve a stronger confidence signal next time."
        : "Use the current recommendation flow as-is, and keep collecting outcome evidence to preserve calibration quality.";

  return {
    recommendation_id: input.canonicalRecommendation?.id ?? null,
    predicted_confidence_score: predictedScore,
    predicted_confidence_level: predictedLevel,
    outcome_assessment: outcome,
    calibration_delta: calibrationDelta,
    calibrated_confidence_score: calibratedScore,
    calibrated_confidence_level: calibratedLevel,
    calibration_label: calibrationLabel,
    explanation,
    guidance,
  };
}
