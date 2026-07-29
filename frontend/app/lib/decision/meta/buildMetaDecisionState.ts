import { buildDecisionConfidenceModel } from "../confidence/buildDecisionConfidenceModel";
import { buildDecisionPatternIntelligence } from "../patterns/buildDecisionPatternIntelligence";
import { buildStrategicLearningState } from "../learning/buildStrategicLearningState";
import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import { buildDecisionStrategyScorecard } from "./buildDecisionStrategyScorecard";
import { selectDecisionStrategy } from "./selectDecisionStrategy";
import { buildMetaDecisionExplanation } from "./buildMetaDecisionExplanation";
import type { MetaDecisionState } from "./metaDecisionTypes";

import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";

type BuildMetaDecisionStateInput = {
  reasoning?: Record<string, unknown> | null;
  simulation?: Record<string, unknown> | null;
  comparison?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  calibration?: { calibration_label?: string | null } | null;
  responseData?: Record<string, unknown> | null;
  memoryEntries?: DecisionMemoryEntry[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

export function buildMetaDecisionState(input: BuildMetaDecisionStateInput): MetaDecisionState {
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    responseData: input.responseData ?? null,
    decisionResult: asRecord(input.responseData?.decision_result),
  });
  const patternIntelligence = buildDecisionPatternIntelligence({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const strategicLearning = buildStrategicLearningState({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });

  const evidenceStrength: MetaDecisionState["evidence_strength"] =
    (input.memoryEntries?.length ?? 0) >= 6 && confidenceModel.level === "high"
      ? "strong"
      : (input.memoryEntries?.length ?? 0) >= 3 || confidenceModel.level === "medium"
        ? "moderate"
        : "weak";
  const uncertaintyLevel: MetaDecisionState["uncertainty_level"] =
    (Array.isArray(input.reasoning?.ambiguity_notes) ? input.reasoning.ambiguity_notes.length : 0) > 1 ||
    input.calibration?.calibration_label === "overconfident" ||
    strategicLearning.domain_drift.drift_detected
      ? "high"
      : confidenceModel.level === "high"
        ? "low"
        : "medium";

  const strategyScores = buildDecisionStrategyScorecard({
    reasoning: input.reasoning,
    simulation: input.simulation,
    comparison: input.comparison,
    canonicalRecommendation: input.canonicalRecommendation,
    confidenceModel,
    calibration: input.calibration,
    patternIntelligence,
    strategicLearning,
    memoryEntries: input.memoryEntries ?? [],
    responseData: input.responseData ?? null,
  });
  const selection = selectDecisionStrategy({
    strategyScores,
    evidenceStrength,
    uncertaintyLevel,
  });
  const rationale = buildMetaDecisionExplanation({
    selectedStrategy: selection.selected_strategy,
    evidenceStrength,
    uncertaintyLevel,
    topReason: selection.topStrategies[0]?.reasons[0] ?? null,
  });

  const constraints = [
    strategicLearning.domain_drift.drift_detected ? "Operating conditions appear to be shifting." : null,
    (input.memoryEntries?.length ?? 0) < 3 ? "Historical coverage is still limited." : null,
    input.calibration?.calibration_label === "overconfident" ? "Recent calibration suggests overconfidence risk." : null,
  ].filter((value): value is string => Boolean(value));

  const warnings = [
    confidenceModel.uncertainties?.[0] ? `Uncertainty: ${confidenceModel.uncertainties[0]}` : null,
    patternIntelligence.top_failure_patterns[0] ?? null,
    strategicLearning.domain_drift.summary ?? null,
  ].filter((value): value is string => Boolean(value)).slice(0, 3);

  const nextBestActions =
    selection.action_posture === "recommend_simulation"
      ? ["Run simulation before action", "Review downstream impact in the timeline", "Use safe preview if action must remain low-risk"]
      : selection.action_posture === "recommend_comparison"
        ? ["Compare the current recommendation with alternatives", "Review the main trade-offs", "Keep simulation available as a follow-up"]
        : selection.action_posture === "recommend_more_evidence"
          ? ["Gather more evidence before escalation", "Review confidence and outcome feedback", "Use safe preview instead of applying immediately"]
          : selection.action_posture === "recommend_safe_preview"
            ? ["Use safe preview first", "Capture more outcome evidence", "Escalate only after simulation or comparison"]
            : selection.selected_strategy === "memory_first"
              ? ["Review similar historical decisions", "Check whether calibration held up", "Then decide whether simulation is still needed"]
              : selection.selected_strategy === "multi_agent_review"
                ? ["Open multi-perspective review", "Stress-test the main assumptions", "Then return to simulation or compare"]
                : ["Proceed with the recommendation", "Keep simulation and compare available as checks", "Capture outcome evidence afterward"];

  return {
    generated_at: Date.now(),
    selected_strategy: selection.selected_strategy,
    strategy_scores: selection.topStrategies,
    rationale,
    evidence_strength: evidenceStrength,
    uncertainty_level: uncertaintyLevel,
    action_posture: selection.action_posture,
    constraints,
    warnings,
    next_best_actions: nextBestActions,
  };
}
