import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type {
  ObservedOutcomeAssessment,
  ObservedOutcomeSignal,
} from "./decisionOutcomeTypes";

type BuildObservedOutcomeAssessmentInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  responseData?: Record<string, unknown> | null;
  decisionResult?: Record<string, unknown> | null;
  memoryEntries?: DecisionMemoryEntry[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

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
    text(asRecord(responseData?.decision_replay)?.summary) ||
    text(asRecord(responseData?.replay)?.summary) ||
    "";
  const memoryObservedSummary =
    text(latestMemory?.observed_outcome_summary) ||
    text(latestMemory?.feedback_summary) ||
    "";
  const decisionResultRecord = asRecord(input.decisionResult);
  const executionObservedSummary =
    text(decisionResultRecord?.observed_summary) ||
    text(asRecord(responseData?.decision_execution_result)?.observed_summary) ||
    "";
  const strategyKpi = asRecord(responseData?.strategy_kpi);
  const kpiObservedSummary =
    text(strategyKpi?.follow_up_summary) ||
    text(strategyKpi?.summary) ||
    "";

  const observedSummary =
    memoryObservedSummary ||
    replaySummary ||
    executionObservedSummary ||
    kpiObservedSummary ||
    "";

  const simulationResult = asRecord(decisionResultRecord?.simulation_result);
  const responseDecisionResult = asRecord(responseData?.decision_result);
  const responseSimulationResult = asRecord(responseDecisionResult?.simulation_result);
  const responseDecisionSimulation = asRecord(responseData?.decision_simulation);
  const sceneActions = asRecord(decisionResultRecord?.scene_actions);
  const sceneHighlight = Array.isArray(sceneActions?.highlight) ? sceneActions.highlight : [];

  const observedRiskChange =
    typeof simulationResult?.risk_change === "number"
      ? simulationResult.risk_change
      : typeof responseSimulationResult?.risk_change === "number"
        ? responseSimulationResult.risk_change
        : null;
  const observedImpactScore =
    typeof simulationResult?.impact_score === "number"
      ? simulationResult.impact_score
      : typeof responseSimulationResult?.impact_score === "number"
        ? responseSimulationResult.impact_score
        : null;
  const targetCoverage = unique([
    ...(latestMemory?.target_ids ?? []),
    ...(Array.isArray(simulationResult?.affected_objects)
      ? (simulationResult.affected_objects as string[])
      : []),
    ...(Array.isArray(responseDecisionSimulation?.affected_objects)
      ? (responseDecisionSimulation.affected_objects as string[])
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
    sceneHighlight.length
      ? `Execution preview touched ${sceneHighlight.length} node${sceneHighlight.length === 1 ? "" : "s"}.`
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
