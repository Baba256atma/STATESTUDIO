import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { DecisionPatternIntelligence } from "../patterns/decisionPatternTypes";
import type { StrategicLearningState } from "../learning/strategicLearningTypes";
import type { MetaDecisionState, DecisionStrategyScore, DecisionStrategyType } from "./metaDecisionTypes";

type BuildDecisionStrategyScorecardInput = {
  reasoning?: any | null;
  simulation?: any | null;
  comparison?: any | null;
  canonicalRecommendation?: any | null;
  confidenceModel?: any | null;
  calibration?: any | null;
  patternIntelligence?: DecisionPatternIntelligence | null;
  strategicLearning?: StrategicLearningState | null;
  memoryEntries?: DecisionMemoryEntry[];
  responseData?: any | null;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function baseScores(): Record<DecisionStrategyType, number> {
  return {
    direct_recommendation: 0.28,
    simulation_first: 0.34,
    compare_first: 0.3,
    memory_first: 0.24,
    multi_agent_review: 0.22,
    evidence_first: 0.26,
    safe_mode_only: 0.2,
  };
}

function pushReason(reasons: Record<DecisionStrategyType, string[]>, strategy: DecisionStrategyType, note: string) {
  reasons[strategy].push(note);
}

export function buildDecisionStrategyScorecard(
  input: BuildDecisionStrategyScorecardInput
): DecisionStrategyScore[] {
  const scores = baseScores();
  const reasons: Record<DecisionStrategyType, string[]> = {
    direct_recommendation: [],
    simulation_first: [],
    compare_first: [],
    memory_first: [],
    multi_agent_review: [],
    evidence_first: [],
    safe_mode_only: [],
  };

  const reasoningConfidence = Number(input.reasoning?.confidence?.score ?? 0.6);
  const ambiguityCount = (input.reasoning?.ambiguity_notes?.length ?? 0) + (input.reasoning?.trace?.detected_signals?.length ? 0 : 1);
  const simulationConfidence = Number(input.simulation?.confidence ?? input.simulation?.impact?.confidence ?? 0.55);
  const tradeoffCount =
    (input.comparison?.tradeoffs?.length ?? 0) +
    (input.responseData?.decision_comparison?.tradeoffs?.length ?? 0) +
    (input.canonicalRecommendation?.alternatives?.length ?? 0);
  const memoryCoverage = input.memoryEntries?.length ?? 0;
  const calibratedCoverage = (input.memoryEntries ?? []).filter((entry) => entry.calibration_result).length;
  const overconfidenceSeen = (input.memoryEntries ?? []).some(
    (entry) => entry.calibration_result?.calibration_label === "overconfident"
  );
  const weakObservedCoverage = (input.memoryEntries ?? []).filter(
    (entry) => !entry.feedback_summary && !entry.observed_outcome_summary
  ).length;
  const driftDetected = Boolean(input.strategicLearning?.domain_drift?.drift_detected);
  const patternWarning = Boolean(input.patternIntelligence?.top_failure_patterns?.length);
  const patternStrength = input.patternIntelligence?.coverage_count ?? 0;
  const confidenceLevel = String(input.confidenceModel?.level ?? "medium");

  if (reasoningConfidence >= 0.72 && confidenceLevel === "high" && !overconfidenceSeen) {
    scores.direct_recommendation += 0.24;
    pushReason(reasons, "direct_recommendation", "Confidence is solid and no strong recent overconfidence pattern is visible.");
  }
  if (simulationConfidence < 0.68 || ambiguityCount > 0 || driftDetected) {
    scores.simulation_first += 0.26;
    pushReason(reasons, "simulation_first", "Downstream uncertainty remains meaningful enough to justify scenario testing first.");
  }
  if (tradeoffCount >= 2) {
    scores.compare_first += 0.28;
    pushReason(reasons, "compare_first", "Several viable options or material trade-offs are visible.");
  }
  if (memoryCoverage >= 4 && patternStrength >= 3) {
    scores.memory_first += 0.22;
    pushReason(reasons, "memory_first", "Similar historical decisions are available and informative.");
  }
  if (ambiguityCount > 1 || driftDetected || patternWarning) {
    scores.multi_agent_review += 0.24;
    pushReason(reasons, "multi_agent_review", "Signals are mixed enough that multiple perspectives should be considered.");
  }
  if (weakObservedCoverage >= Math.max(2, Math.round(memoryCoverage / 2)) || reasoningConfidence < 0.5) {
    scores.evidence_first += 0.3;
    pushReason(reasons, "evidence_first", "Evidence coverage is still weak enough that stronger guidance would risk overstating certainty.");
  }
  if (overconfidenceSeen || String(input.calibration?.calibration_label ?? "") === "overconfident") {
    scores.safe_mode_only += 0.28;
    pushReason(reasons, "safe_mode_only", "Recent feedback suggests action should remain low-risk or preview-first.");
  }
  if (calibratedCoverage >= 3 && !overconfidenceSeen) {
    scores.direct_recommendation += 0.1;
    scores.memory_first += 0.08;
    pushReason(reasons, "memory_first", "Calibration coverage makes past decisions more trustworthy as a guide.");
  }
  if (input.strategicLearning?.strategic_guidance?.toLowerCase().includes("simulation-first")) {
    scores.simulation_first += 0.12;
    pushReason(reasons, "simulation_first", "Long-term learning currently favors simulation-first handling.");
  }
  if (input.strategicLearning?.strategic_guidance?.toLowerCase().includes("compare")) {
    scores.compare_first += 0.1;
    pushReason(reasons, "compare_first", "Long-term learning suggests stronger comparison before commitment.");
  }

  return (Object.keys(scores) as DecisionStrategyType[])
    .map((strategy) => ({
      strategy,
      score: clamp01(scores[strategy]),
      reasons: reasons[strategy].slice(0, 3),
    }))
    .sort((a, b) => b.score - a.score);
}
