import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type {
  ObservedOutcomeAssessment,
  ObservedOutcomeSignal,
} from "./decisionOutcomeTypes";

type BuildObservedOutcomeAssessmentInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  responseData?: any | null;
  decisionResult?: any | null;
  memoryEntries?: DecisionMemoryEntry[];
};

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function unique(values: unknown[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

function statusFromRiskChange(value: number | null): ObservedOutcomeSignal["status"] {
  if (value === null) return "unknown";
  if (value < -0.04) return "improved";
  if (value <= 0.02) return "matched";
  return "degraded";
}

function statusFromImpact(value: number | null): ObservedOutcomeSignal["status"] {
  if (value === null) return "unknown";
  if (value >= 0.72) return "improved";
  if (value >= 0.5) return "matched";
  return "degraded";
}

export function buildObservedOutcomeAssessment(
  input: BuildObservedOutcomeAssessmentInput
): ObservedOutcomeAssessment {
  const latestMemory = input.memoryEntries?.[0] ?? null;
  const responseData = input.responseData ?? null;
  const replaySummary =
    text(responseData?.decision_replay?.summary) ||
    text(responseData?.replay?.summary) ||
    "";
  const memoryObservedSummary =
    text(latestMemory?.observed_outcome_summary) ||
    text(latestMemory?.feedback_summary) ||
    "";
  const executionObservedSummary =
    text(input.decisionResult?.observed_summary) ||
    text(responseData?.decision_execution_result?.observed_summary) ||
    "";
  const kpiObservedSummary =
    text(responseData?.strategy_kpi?.follow_up_summary) ||
    text(responseData?.strategy_kpi?.summary) ||
    "";

  const observedSummary =
    memoryObservedSummary ||
    replaySummary ||
    executionObservedSummary ||
    kpiObservedSummary ||
    "";

  const observedRiskChange =
    typeof input.decisionResult?.simulation_result?.risk_change === "number"
      ? input.decisionResult.simulation_result.risk_change
      : typeof responseData?.decision_result?.simulation_result?.risk_change === "number"
        ? responseData.decision_result.simulation_result.risk_change
        : null;
  const observedImpactScore =
    typeof input.decisionResult?.simulation_result?.impact_score === "number"
      ? input.decisionResult.simulation_result.impact_score
      : typeof responseData?.decision_result?.simulation_result?.impact_score === "number"
        ? responseData.decision_result.simulation_result.impact_score
        : null;
  const targetCoverage = unique([
    ...(latestMemory?.target_ids ?? []),
    ...(Array.isArray(input.decisionResult?.simulation_result?.affected_objects)
      ? input.decisionResult.simulation_result.affected_objects
      : []),
    ...(Array.isArray(responseData?.decision_simulation?.affected_objects)
      ? responseData.decision_simulation.affected_objects
      : []),
  ], 4);

  const observedSignalCandidates: ObservedOutcomeSignal[] = [
    {
      label: "Risk pressure",
      expected: "Should ease after the decision",
      observed:
        observedRiskChange === null
          ? memoryObservedSummary || replaySummary || null
          : observedRiskChange <= 0
            ? `Risk change ${Math.round(Math.abs(observedRiskChange) * 100)}% lower`
            : `Risk change ${Math.round(observedRiskChange * 100)}% higher`,
      status: statusFromRiskChange(observedRiskChange),
    },
    {
      label: "Execution impact",
      expected: "Should remain close to the recommended path",
      observed:
        observedImpactScore === null
          ? executionObservedSummary || observedSummary || null
          : `Impact score ${Math.round(observedImpactScore * 100)}%`,
      status: statusFromImpact(observedImpactScore),
    },
    {
      label: "Affected scope",
      expected:
        input.canonicalRecommendation?.primary?.target_ids?.length
          ? `${input.canonicalRecommendation.primary.target_ids.length} target${input.canonicalRecommendation.primary.target_ids.length === 1 ? "" : "s"}`
          : "Expected target scope recorded",
      observed: targetCoverage.length ? targetCoverage.join(", ") : null,
      status: targetCoverage.length ? "matched" : "unknown",
    },
  ];
  const observedSignals = observedSignalCandidates.filter((signal) => signal.observed || signal.expected);

  const evidenceNotes = unique([
    latestMemory?.feedback_summary,
    replaySummary,
    kpiObservedSummary,
    executionObservedSummary,
    input.decisionResult?.scene_actions?.highlight?.length
      ? `Execution preview touched ${input.decisionResult.scene_actions.highlight.length} node${input.decisionResult.scene_actions.highlight.length === 1 ? "" : "s"}.`
      : null,
  ]);

  const evidenceCount =
    Number(Boolean(memoryObservedSummary)) +
    Number(Boolean(replaySummary)) +
    Number(Boolean(executionObservedSummary)) +
    Number(Boolean(kpiObservedSummary)) +
    Number(observedSignals.some((signal) => signal.observed));
  const observationAvailable = Boolean(observedSummary || evidenceCount > 0);
  const observationStrength =
    evidenceCount >= 3 ? "strong" : evidenceCount >= 2 ? "moderate" : "limited";

  return {
    observation_available: observationAvailable,
    observation_strength: observationAvailable ? observationStrength : "limited",
    observed_summary:
      observedSummary ||
      (observationAvailable
        ? "Partial replay or execution evidence is available, but the observed outcome is still incomplete."
        : null),
    observed_signals: observedSignals,
    evidence_notes: evidenceNotes,
  };
}
