import type { DecisionMemoryEntry } from "../../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../recommendation/recommendationTypes";
import type { DecisionOutcomeAssessment } from "./decisionConfidenceCalibrationTypes";

type BuildDecisionOutcomeAssessmentInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  responseData?: Record<string, any> | null;
  decisionResult?: Record<string, any> | null;
  memoryEntries?: DecisionMemoryEntry[];
};

const MIN_OBSERVED_IMPACT_FLOOR = 0.45;
const IMPACT_MATCH_TOLERANCE = 0.1;
const BETTER_THAN_EXPECTED_DELTA = 0.12;
const WORSE_THAN_EXPECTED_DELTA = 0.15;
const RISK_WORSE_THRESHOLD = 0.02;
const LOW_CONFIDENCE_UPPER_BOUND = 0.7;
const UNIQUE_SIGNAL_LIMIT = 4;

function normalizeText(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function collectUniqueStrings(values: unknown[], limit = UNIQUE_SIGNAL_LIMIT) {
  return Array.from(new Set(values.map((value) => normalizeText(value)).filter(Boolean))).slice(0, limit);
}

function hasActionEvidence(
  primaryMemoryEntry: DecisionMemoryEntry | null,
  responseData: Record<string, any> | null,
  decisionResult: Record<string, any> | null
) {
  return Boolean(
    primaryMemoryEntry?.impact_summary ||
      primaryMemoryEntry?.timeline_events?.length ||
      responseData?.decision_simulation ||
      decisionResult?.simulation_result
  );
}

export function buildDecisionOutcomeAssessment(
  input: BuildDecisionOutcomeAssessmentInput
): DecisionOutcomeAssessment {
  const recommendation = input.canonicalRecommendation ?? null;
  const responseData = input.responseData ?? null;
  const decisionResult = input.decisionResult ?? null;
  // Use the first available memory entry as the primary observed outcome anchor for calibration.
  const primaryMemoryEntry = input.memoryEntries?.[0] ?? null;
  const simulationResult = decisionResult?.simulation_result ?? null;
  const responseSimulation = responseData?.decision_simulation ?? null;
  const responseCanonicalRecommendation = responseData?.canonical_recommendation ?? null;
  const predictedScore =
    typeof recommendation?.confidence?.score === "number"
      ? recommendation.confidence.score
      : typeof responseCanonicalRecommendation?.confidence?.score === "number"
        ? responseCanonicalRecommendation.confidence.score
        : null;

  const observedImpactScore =
    typeof simulationResult?.impact_score === "number"
      ? simulationResult.impact_score
      : typeof responseSimulation?.confidence === "number"
        ? responseSimulation.confidence
        : null;
  const observedRiskChange =
    typeof simulationResult?.risk_change === "number"
      ? simulationResult.risk_change
      : typeof responseData?.decision_result?.simulation_result?.risk_change === "number"
        ? responseData.decision_result.simulation_result.risk_change
        : null;

  const outcomeAvailable = hasActionEvidence(primaryMemoryEntry, responseData, decisionResult);
  if (!outcomeAvailable) {
    return {
      outcome_available: false,
      outcome_quality: "unknown",
      summary: "No calibration available yet. Nexora needs replay, memory, or observed outcome evidence to compare confidence against reality.",
      matched_signals: [],
      mismatched_signals: [],
    };
  }

  const matchedSignals = collectUniqueStrings([
    observedRiskChange !== null && observedRiskChange <= 0
      ? "Observed risk did not worsen after execution."
      : null,
    observedImpactScore !== null &&
    predictedScore !== null &&
    observedImpactScore >= Math.max(MIN_OBSERVED_IMPACT_FLOOR, predictedScore - IMPACT_MATCH_TOLERANCE)
      ? "Observed impact stayed close to the original expectation."
      : null,
    primaryMemoryEntry?.impact_summary,
    responseSimulation?.impact?.summary,
  ]);

  const mismatchedSignals = collectUniqueStrings([
    observedRiskChange !== null && observedRiskChange > 0
      ? "Observed risk pressure was higher than the original expectation."
      : null,
    observedImpactScore !== null &&
    predictedScore !== null &&
    observedImpactScore < predictedScore - WORSE_THAN_EXPECTED_DELTA
      ? "Observed impact came in weaker than the original confidence implied."
      : null,
    primaryMemoryEntry?.compare_summary,
    responseData?.comparison?.summary,
  ]);

  let outcomeQuality: DecisionOutcomeAssessment["outcome_quality"] = "as_expected";
  if (predictedScore !== null && observedImpactScore !== null) {
    if (
      observedImpactScore >= predictedScore + BETTER_THAN_EXPECTED_DELTA &&
      predictedScore <= LOW_CONFIDENCE_UPPER_BOUND
    ) {
      outcomeQuality = "better_than_expected";
    } else if (
      observedImpactScore < predictedScore - WORSE_THAN_EXPECTED_DELTA ||
      (observedRiskChange !== null && observedRiskChange > RISK_WORSE_THRESHOLD)
    ) {
      outcomeQuality = "worse_than_expected";
    }
  } else if (observedRiskChange !== null) {
    outcomeQuality = observedRiskChange > RISK_WORSE_THRESHOLD ? "worse_than_expected" : "as_expected";
  }

  const summary =
    outcomeQuality === "better_than_expected"
      ? "Replay and execution evidence suggest the outcome held up better than the original confidence implied."
      : outcomeQuality === "worse_than_expected"
        ? "Replay and execution evidence suggest the outcome was weaker than the original recommendation implied."
        : "Observed evidence is broadly consistent with the original expectation, although the outcome picture remains partial.";

  return {
    outcome_available: true,
    outcome_quality: outcomeQuality,
    summary,
    matched_signals: matchedSignals,
    mismatched_signals: mismatchedSignals,
  };
}
