import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveFeedbackLearningInput,
  PilotSuccessAssessment,
  PilotSuccessEvaluation,
} from "./executiveFeedbackTypes.ts";

function clamp(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}

function evaluationFromScore(score: number): PilotSuccessEvaluation {
  if (score >= 0.82) return "highly_successful";
  if (score >= 0.66) return "successful";
  if (score >= 0.45) return "limited_success";
  return "unsuccessful";
}

export function evaluatePilotSuccess(input: ExecutiveFeedbackLearningInput): PilotSuccessAssessment {
  const items = input.registry.feedback;
  const feedbackQuality = clamp(items.length === 0 ? 0 : Math.min(items.length, 6) / 6);
  const validationOutcomeScore = clamp(
    input.validationSuite?.summary.validationPassed
      ? 0.9
      : input.validationSuite
        ? 0.35
        : 0.2
  );
  const trustIndicatorScore = clamp(
    input.dashboard?.runtimeTrust === "healthy"
      ? 0.9
      : input.dashboard?.runtimeTrust === "warning"
        ? 0.68
        : input.dashboard?.runtimeTrust === "degraded"
          ? 0.42
          : 0.25
  );
  const readinessIndicatorScore = clamp(
    input.dashboard?.launchAssessment === "production_candidate" || input.dashboard?.launchAssessment === "pilot_ready"
      ? 0.9
      : input.dashboard?.launchAssessment === "demo_ready"
        ? 0.74
        : input.dashboard?.launchAssessment === "preparation_required"
          ? 0.5
          : 0.25
  );
  const executiveSatisfactionScore = clamp(
    items.length
      ? items.reduce((sum, item) => sum + (item.dimensions.clarity + item.dimensions.decisionUsefulness + item.dimensions.trustworthiness) / 3, 0) /
          items.length
      : 0.45
  );
  const aggregate = clamp(
    feedbackQuality * 0.16 +
      validationOutcomeScore * 0.18 +
      trustIndicatorScore * 0.22 +
      readinessIndicatorScore * 0.2 +
      executiveSatisfactionScore * 0.24
  );
  const evaluation = evaluationFromScore(aggregate);

  return {
    evaluation,
    feedbackQuality,
    validationOutcomeScore,
    trustIndicatorScore,
    readinessIndicatorScore,
    executiveSatisfactionScore,
    rationale: `Pilot success is ${evaluation} based on feedback quality, validation, trust, readiness, and executive satisfaction.`,
    signature: stableSignature([
      "d10-pilot-success",
      evaluation,
      feedbackQuality,
      validationOutcomeScore,
      trustIndicatorScore,
      readinessIndicatorScore,
      executiveSatisfactionScore,
    ]),
  };
}
