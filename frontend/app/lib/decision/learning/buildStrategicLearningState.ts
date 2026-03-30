import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import { buildDecisionPatternIntelligence } from "../patterns/buildDecisionPatternIntelligence";
import { buildCrossDecisionSignals } from "./buildCrossDecisionSignals";
import { buildDecisionDomainDriftSummary } from "./buildDecisionDomainDriftSummary";
import { buildMemoryEvolutionSummary } from "./buildMemoryEvolutionSummary";
import { buildStrategicLearningGuidance } from "./buildStrategicLearningGuidance";
import type { StrategicLearningState } from "./strategicLearningTypes";

type BuildStrategicLearningStateInput = {
  memoryEntries?: DecisionMemoryEntry[] | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
};

export function buildStrategicLearningState(
  input: BuildStrategicLearningStateInput
): StrategicLearningState {
  const memoryEntries = (input.memoryEntries ?? []).filter(
    (entry) => entry.recommendation_action || entry.recommendation_summary || entry.situation_summary
  );
  const patternIntelligence = buildDecisionPatternIntelligence({
    memoryEntries,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const memoryEvolution = buildMemoryEvolutionSummary(memoryEntries);
  const domainDrift = buildDecisionDomainDriftSummary(memoryEntries);
  const learningSignals = buildCrossDecisionSignals({
    memoryEntries,
    patternIntelligence,
  });
  const recurringSuccesses = patternIntelligence.top_success_patterns.slice(0, 3);
  const recurringFailures = patternIntelligence.top_failure_patterns.slice(0, 3);
  const recurringTradeoffs = patternIntelligence.repeated_tradeoffs.slice(0, 3);
  const recurringUncertainties = patternIntelligence.repeated_uncertainties.slice(0, 3);
  const strategicGuidance = buildStrategicLearningGuidance({
    recurringSuccesses,
    recurringFailures,
    recurringTradeoffs,
    recurringUncertainties,
    confidenceTrend: memoryEvolution.confidence_trend,
    driftDetected: domainDrift.drift_detected,
  });
  const currentRecommendationNote =
    input.canonicalRecommendation?.primary?.action && patternIntelligence.current_pattern_note
      ? `${patternIntelligence.current_pattern_note} ${strategicGuidance ?? ""}`.trim()
      : null;
  const explanation =
    memoryEntries.length < 4
      ? "Strategic learning is still limited. Nexora needs more replay-backed decisions, calibrated outcomes, and recurring evidence to build stronger long-term guidance."
      : domainDrift.drift_detected
        ? "Long-term learning is becoming useful, but recent evidence suggests operating conditions are shifting enough that older guidance should be treated more cautiously."
        : "Long-term learning is becoming useful. Nexora can now compare how memory quality, calibration, and repeated outcomes evolve across many decisions.";

  return {
    generated_at: Date.now(),
    coverage_count: memoryEntries.length,
    learning_signals: learningSignals,
    memory_evolution: memoryEvolution,
    domain_drift: domainDrift,
    recurring_successes: recurringSuccesses,
    recurring_failures: recurringFailures,
    recurring_tradeoffs: recurringTradeoffs,
    recurring_uncertainties: recurringUncertainties,
    strategic_guidance: strategicGuidance,
    current_recommendation_note: currentRecommendationNote,
    explanation,
  };
}
