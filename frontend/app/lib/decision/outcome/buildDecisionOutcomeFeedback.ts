import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type {
  DecisionOutcomeFeedback,
  ObservedOutcomeAssessment,
} from "./decisionOutcomeTypes";

type BuildDecisionOutcomeFeedbackInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  observedAssessment: ObservedOutcomeAssessment;
  memoryEntry?: DecisionMemoryEntry | null;
  responseData?: any | null;
};

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function unique(values: unknown[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

export function buildDecisionOutcomeFeedback(
  input: BuildDecisionOutcomeFeedbackInput
): DecisionOutcomeFeedback {
  const expectedSummary =
    text(input.canonicalRecommendation?.primary?.impact_summary) ||
    text(input.responseData?.decision_simulation?.impact?.summary) ||
    text(input.responseData?.decision_simulation?.summary) ||
    null;
  const observedSummary = input.observedAssessment.observed_summary ?? null;

  if (!input.observedAssessment.observation_available) {
    return {
      recommendation_id: input.canonicalRecommendation?.id ?? null,
      decision_memory_entry_id: input.memoryEntry?.id ?? null,
      created_at: Date.now(),
      expected_summary: expectedSummary,
      observed_summary: null,
      outcome_status: "insufficient_observation",
      matched_signals: [],
      diverged_signals: [],
      observed_signals: input.observedAssessment.observed_signals,
      feedback_summary:
        "No outcome feedback available yet. Nexora needs execution, replay, or saved outcome evidence to compare predictions against reality.",
      guidance: "Capture more outcome evidence before increasing trust in this class of recommendation.",
    };
  }

  const matchedSignals = unique(
    input.observedAssessment.observed_signals
      .filter((signal) => signal.status === "matched" || signal.status === "improved")
      .map((signal) => `${signal.label} ${signal.status === "improved" ? "held up better than expected" : "stayed close to expectation"}.`)
  );
  const divergedSignals = unique(
    input.observedAssessment.observed_signals
      .filter((signal) => signal.status === "degraded")
      .map((signal) => `${signal.label} came in weaker than expected.`)
  );

  const improvedCount = input.observedAssessment.observed_signals.filter((signal) => signal.status === "improved").length;
  const degradedCount = input.observedAssessment.observed_signals.filter((signal) => signal.status === "degraded").length;
  const outcomeStatus: DecisionOutcomeFeedback["outcome_status"] =
    degradedCount > improvedCount && degradedCount > 0
      ? "worse_than_expected"
      : improvedCount > degradedCount && improvedCount > 0
        ? "better_than_expected"
        : "as_expected";

  const feedbackSummary =
    outcomeStatus === "better_than_expected"
      ? "Observed evidence suggests the decision held up slightly better than the original expectation."
      : outcomeStatus === "worse_than_expected"
        ? "Observed evidence suggests the decision underperformed the original expectation in a few important areas."
        : "Observed evidence is broadly consistent with the expected direction, although the picture is still partial.";

  const guidance =
    outcomeStatus === "better_than_expected"
      ? "You can treat similar decisions with slightly more confidence, while still collecting more outcome evidence."
      : outcomeStatus === "worse_than_expected"
        ? "Re-run simulation with updated assumptions, or compare with a lower-risk alternative before escalating."
        : "Keep the current guidance flow, but capture more observed evidence before increasing trust further.";

  return {
    recommendation_id: input.canonicalRecommendation?.id ?? null,
    decision_memory_entry_id: input.memoryEntry?.id ?? null,
    created_at: Date.now(),
    expected_summary: expectedSummary,
    observed_summary: observedSummary,
    outcome_status: outcomeStatus,
    matched_signals: matchedSignals,
    diverged_signals: divergedSignals,
    observed_signals: input.observedAssessment.observed_signals.slice(0, 4),
    feedback_summary: feedbackSummary,
    guidance,
  };
}
