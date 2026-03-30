import type { DecisionMemoryEntry } from "../../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../recommendation/recommendationTypes";
import type { DecisionOutcomeAssessment } from "./decisionConfidenceCalibrationTypes";

type BuildDecisionOutcomeAssessmentInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  responseData?: any | null;
  decisionResult?: any | null;
  memoryEntries?: DecisionMemoryEntry[];
};

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function uniqueStrings(values: unknown[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

function hasActionEvidence(memoryEntry: DecisionMemoryEntry | null, responseData: any, decisionResult: any) {
  return Boolean(
    memoryEntry?.impact_summary ||
      memoryEntry?.timeline_events?.length ||
      responseData?.decision_simulation ||
      decisionResult?.simulation_result
  );
}

export function buildDecisionOutcomeAssessment(
  input: BuildDecisionOutcomeAssessmentInput
): DecisionOutcomeAssessment {
  const recommendation = input.canonicalRecommendation ?? null;
  const responseData = input.responseData ?? null;
  const memoryEntry = input.memoryEntries?.[0] ?? null;
  const predictedScore =
    typeof recommendation?.confidence?.score === "number"
      ? recommendation.confidence.score
      : typeof responseData?.canonical_recommendation?.confidence?.score === "number"
        ? responseData.canonical_recommendation.confidence.score
        : null;

  const observedImpactScore =
    typeof input.decisionResult?.simulation_result?.impact_score === "number"
      ? input.decisionResult.simulation_result.impact_score
      : typeof responseData?.decision_simulation?.confidence === "number"
        ? responseData.decision_simulation.confidence
        : null;
  const observedRiskChange =
    typeof input.decisionResult?.simulation_result?.risk_change === "number"
      ? input.decisionResult.simulation_result.risk_change
      : typeof responseData?.decision_result?.simulation_result?.risk_change === "number"
        ? responseData.decision_result.simulation_result.risk_change
        : null;

  const outcomeAvailable = hasActionEvidence(memoryEntry, responseData, input.decisionResult);
  if (!outcomeAvailable) {
    return {
      outcome_available: false,
      outcome_quality: "unknown",
      summary: "No calibration available yet. Nexora needs replay, memory, or observed outcome evidence to compare confidence against reality.",
      matched_signals: [],
      mismatched_signals: [],
    };
  }

  const matchedSignals = uniqueStrings([
    observedRiskChange !== null && observedRiskChange <= 0
      ? "Observed risk did not worsen after execution."
      : null,
    observedImpactScore !== null && predictedScore !== null && observedImpactScore >= Math.max(0.45, predictedScore - 0.1)
      ? "Observed impact stayed close to the original expectation."
      : null,
    memoryEntry?.impact_summary,
    responseData?.decision_simulation?.impact?.summary,
  ]);

  const mismatchedSignals = uniqueStrings([
    observedRiskChange !== null && observedRiskChange > 0
      ? "Observed risk pressure was higher than the original expectation."
      : null,
    observedImpactScore !== null && predictedScore !== null && observedImpactScore < predictedScore - 0.15
      ? "Observed impact came in weaker than the original confidence implied."
      : null,
    memoryEntry?.compare_summary,
    responseData?.comparison?.summary,
  ]);

  let outcomeQuality: DecisionOutcomeAssessment["outcome_quality"] = "as_expected";
  if (predictedScore !== null && observedImpactScore !== null) {
    if (observedImpactScore >= predictedScore + 0.12 && predictedScore <= 0.7) {
      outcomeQuality = "better_than_expected";
    } else if (observedImpactScore < predictedScore - 0.15 || (observedRiskChange !== null && observedRiskChange > 0.02)) {
      outcomeQuality = "worse_than_expected";
    }
  } else if (observedRiskChange !== null) {
    outcomeQuality = observedRiskChange > 0.02 ? "worse_than_expected" : "as_expected";
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
