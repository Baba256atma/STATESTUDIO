import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { MemoryEvolutionSummary } from "./strategicLearningTypes";

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function countRecurringClusters(entries: DecisionMemoryEntry[]) {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    const key = String(entry.recommendation_action ?? entry.title ?? "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    if (!key) return;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return Array.from(counts.values()).filter((count) => count > 1).length;
}

function trendFromCalibration(entries: DecisionMemoryEntry[]): MemoryEvolutionSummary["confidence_trend"] {
  const calibrated = entries.filter((entry) => entry.calibration_result);
  if (calibrated.length < 3) return "unknown";

  const recent = calibrated.slice(0, Math.min(4, calibrated.length));
  const older = calibrated.slice(Math.min(4, calibrated.length));
  if (!older.length) return "unknown";

  const score = (group: DecisionMemoryEntry[]) =>
    group.reduce((sum, entry) => {
      const label = entry.calibration_result?.calibration_label;
      if (label === "well_calibrated") return sum + 1;
      if (label === "underconfident") return sum + 0.5;
      if (label === "overconfident") return sum - 1;
      return sum;
    }, 0) / group.length;

  const recentScore = score(recent);
  const olderScore = score(older);
  if (recentScore > olderScore + 0.2) return "improving";
  if (recentScore < olderScore - 0.2) return "weakening";
  return "stable";
}

export function buildMemoryEvolutionSummary(memoryEntries: DecisionMemoryEntry[]): MemoryEvolutionSummary {
  const totalDecisions = memoryEntries.length;
  const calibratedDecisions = memoryEntries.filter((entry) => entry.calibration_result).length;
  const replayBackedDecisions = memoryEntries.filter(
    (entry) =>
      Boolean(entry.snapshot_ref?.replay_id) ||
      Boolean(entry.observed_outcome_summary) ||
      entry.outcome_status === "as_expected" ||
      entry.outcome_status === "better_than_expected" ||
      entry.outcome_status === "worse_than_expected"
  ).length;
  const recurringClusters = countRecurringClusters(memoryEntries);
  const confidenceTrend = trendFromCalibration(memoryEntries);

  const summary =
    totalDecisions < 3
      ? "Decision memory is still early. Nexora needs more replay-backed and calibrated decisions before long-term learning becomes reliable."
      : replayBackedDecisions < Math.max(2, Math.round(totalDecisions / 3))
        ? "Decision memory is growing, but only part of it is replay-backed. Long-term guidance is still constrained by limited observed outcome evidence."
        : confidenceTrend === "improving"
          ? "Decision memory quality appears to be improving as more outcomes become replay-backed and calibration coverage grows."
          : confidenceTrend === "weakening"
            ? "Decision memory is growing, but recent calibration quality is weakening in some decision classes and deserves closer review."
            : "Decision memory is becoming more useful, although calibration and replay coverage remain uneven across decision types.";

  return {
    total_decisions: totalDecisions,
    calibrated_decisions: calibratedDecisions,
    replay_backed_decisions: replayBackedDecisions,
    recurring_clusters: recurringClusters,
    confidence_trend: confidenceTrend,
    summary,
  };
}
