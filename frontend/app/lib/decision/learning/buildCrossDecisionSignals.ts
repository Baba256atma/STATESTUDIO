import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { DecisionPatternIntelligence } from "../patterns/decisionPatternTypes";
import type { StrategicLearningSignal } from "./strategicLearningTypes";

function strength(coverage: number): StrategicLearningSignal["strength"] {
  if (coverage >= 6) return "strong";
  if (coverage >= 3) return "moderate";
  return "weak";
}

function unique(values: string[], limit = 3) {
  return Array.from(new Set(values.filter(Boolean))).slice(0, limit);
}

export function buildCrossDecisionSignals(params: {
  memoryEntries: DecisionMemoryEntry[];
  patternIntelligence?: DecisionPatternIntelligence | null;
}): StrategicLearningSignal[] {
  const entries = params.memoryEntries;
  const signals: StrategicLearningSignal[] = [];

  const successCount = entries.filter((entry) => entry.outcome_status === "as_expected" || entry.outcome_status === "better_than_expected").length;
  if (successCount > 0) {
    signals.push({
      id: "learning_success",
      label: "Some recommendation families are holding up better over time",
      category: "pattern",
      strength: strength(successCount),
      coverage_count: successCount,
      summary:
        params.patternIntelligence?.top_success_patterns[0] ??
        "Repeated evidence suggests some recommendation classes are increasingly matching expected outcomes.",
    });
  }

  const failureCount = entries.filter(
    (entry) =>
      entry.outcome_status === "worse_than_expected" ||
      entry.calibration_result?.calibration_label === "overconfident"
  ).length;
  if (failureCount > 0) {
    signals.push({
      id: "learning_failure",
      label: "Some recommendation families still underperform",
      category: "calibration",
      strength: strength(failureCount),
      coverage_count: failureCount,
      summary:
        params.patternIntelligence?.top_failure_patterns[0] ??
        "Repeated evidence suggests some high-confidence or weakly observed decisions are still under-calibrating.",
    });
  }

  const recurringRiskTargets = unique(entries.flatMap((entry) => entry.target_ids ?? []));
  if (recurringRiskTargets.length > 0) {
    signals.push({
      id: "learning_risk_recurrence",
      label: "Certain risk hotspots keep returning",
      category: "risk_recurrence",
      strength: strength(recurringRiskTargets.length + 1),
      coverage_count: recurringRiskTargets.length,
      summary: `Across multiple decisions, pressure keeps concentrating around ${recurringRiskTargets.join(", ")}.`,
    });
  }

  const tradeoffSignals = unique(
    entries
      .map((entry) => entry.compare_summary ?? "")
      .filter((value) => /(cost|speed|stability|flexibility|service|risk)/i.test(value))
  );
  if (tradeoffSignals.length > 0) {
    signals.push({
      id: "learning_tradeoff",
      label: "The same trade-offs keep dominating decisions",
      category: "tradeoff_recurrence",
      strength: strength(tradeoffSignals.length + 1),
      coverage_count: tradeoffSignals.length,
      summary:
        params.patternIntelligence?.repeated_tradeoffs[0]
          ? `Repeated trade-offs still center on ${params.patternIntelligence.repeated_tradeoffs.join(", ")}.`
          : "Cross-decision evidence shows the same trade-offs repeating in similar operating conditions.",
    });
  }

  const limitedCoverageCount = entries.filter(
    (entry) =>
      !entry.calibration_result &&
      !entry.feedback_summary &&
      !entry.observed_outcome_summary
  ).length;
  if (limitedCoverageCount > 0) {
    signals.push({
      id: "learning_gap",
      label: "Long-term learning is still limited by weak observation",
      category: "learning_gap",
      strength: strength(limitedCoverageCount),
      coverage_count: limitedCoverageCount,
      summary: "A meaningful share of decision memory still lacks replay-backed or calibrated outcome evidence.",
    });
  }

  return signals.sort((a, b) => b.coverage_count - a.coverage_count).slice(0, 6);
}
