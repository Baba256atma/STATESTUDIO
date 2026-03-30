import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type {
  DecisionPatternCluster,
  DecisionPatternSignal,
} from "./decisionPatternTypes";

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function unique(values: string[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

function countByKeyword(values: string[], matcher: RegExp) {
  return values.filter((value) => matcher.test(value.toLowerCase())).length;
}

function strengthForFrequency(frequency: number): DecisionPatternSignal["strength"] {
  if (frequency >= 4) return "strong";
  if (frequency >= 2) return "moderate";
  return "weak";
}

function entryText(entry: DecisionMemoryEntry) {
  return [
    entry.title,
    entry.situation_summary,
    entry.recommendation_summary,
    entry.recommendation_action,
    entry.impact_summary,
    entry.compare_summary,
    ...(entry.alternative_actions ?? []),
    ...(entry.timeline_events ?? []).flatMap((event) => [event.title, event.summary, ...(event.why ?? []), ...(event.signals ?? []), ...(event.uncertainty ?? [])]),
  ]
    .map((value) => text(value))
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function buildTradeoffPatterns(entries: DecisionMemoryEntry[]) {
  const texts = entries.map((entry) => entryText(entry));
  const tradeoffs: Array<{ label: string; summary: string; frequency: number }> = [];

  const candidates = [
    {
      label: "Speed vs stability",
      matcher: /(speed|faster|throughput|delivery).*(stability|risk|fragility)|(stability|risk|fragility).*(speed|faster|throughput|delivery)/,
      summary: "Repeated trade-offs indicate execution speed often competes with stability in similar decisions.",
    },
    {
      label: "Cost vs service reliability",
      matcher: /(cost|margin|cash).*(service|delivery|reliability|delay)|(service|delivery|reliability|delay).*(cost|margin|cash)/,
      summary: "Repeated trade-offs indicate cost protection often comes at the expense of service reliability.",
    },
    {
      label: "Flexibility vs control",
      matcher: /(flexibility).*(control)|(control).*(flexibility)/,
      summary: "Repeated trade-offs indicate stronger control often reduces operational flexibility.",
    },
  ];

  candidates.forEach((candidate) => {
    const frequency = countByKeyword(texts, candidate.matcher);
    if (frequency > 0) {
      tradeoffs.push({
        label: candidate.label,
        summary: candidate.summary,
        frequency,
      });
    }
  });

  return tradeoffs;
}

function buildUncertaintySignals(entries: DecisionMemoryEntry[]) {
  const texts = entries.map((entry) => entryText(entry));
  const candidates = [
    {
      label: "Supplier reliability evidence is thin",
      matcher: /(supplier|supply).*(uncertain|variability|reliability|coverage)|(uncertain|variability|reliability|coverage).*(supplier|supply)/,
      summary: "Repeated decisions point to weak supplier-side evidence when recommendations are made under pressure.",
    },
    {
      label: "Demand volatility remains a recurring unknown",
      matcher: /(demand|customer).*(volatile|uncertain|shock|variability)|(volatile|uncertain|shock|variability).*(demand|customer)/,
      summary: "Recurring decisions continue to depend on assumptions about demand that are not fully resolved.",
    },
    {
      label: "Outcome evidence is still limited",
      matcher: /(limited|partial|insufficient).*(outcome|evidence|replay)|(outcome|evidence|replay).*(limited|partial|insufficient)/,
      summary: "Pattern coverage is still constrained by partial replay and outcome evidence.",
    },
  ];

  return candidates
    .map((candidate) => ({
      ...candidate,
      frequency: countByKeyword(texts, candidate.matcher),
    }))
    .filter((candidate) => candidate.frequency > 0);
}

export function buildDecisionPatternSignals(input: {
  memoryEntries: DecisionMemoryEntry[];
  clusters: DecisionPatternCluster[];
}): DecisionPatternSignal[] {
  const entries = input.memoryEntries;
  const clusterTexts = input.clusters.map((cluster) => `${cluster.label} ${cluster.recurring_outcomes.join(" ")} ${cluster.recurring_features.join(" ")}`.toLowerCase());
  const signals: DecisionPatternSignal[] = [];

  const positiveOutcomeCount = countByKeyword(clusterTexts, /(improv|stabil|protect|matched expectation|stronger than expected)/);
  if (positiveOutcomeCount > 0) {
    signals.push({
      id: "pattern_success_stability",
      label: "Stability-oriented decisions usually hold up well",
      type: "success_pattern",
      strength: strengthForFrequency(positiveOutcomeCount),
      frequency: positiveOutcomeCount,
      summary: "Similar decisions often improve predictability or broadly match the expected outcome when they prioritize stability early.",
    });
  }

  const overconfidenceCount = countByKeyword(clusterTexts, /overconfident|risk exposed|weaker than expected/);
  if (overconfidenceCount > 0) {
    signals.push({
      id: "pattern_failure_overconfidence",
      label: "Some similar decisions have been too optimistic",
      type: "failure_pattern",
      strength: strengthForFrequency(overconfidenceCount),
      frequency: overconfidenceCount,
      summary: "Pattern evidence suggests similar recommendations can underperform when risk remains exposed or confidence runs ahead of evidence.",
    });
  }

  const hotspotTargets = unique(
    entries
      .flatMap((entry) => entry.target_ids ?? [])
      .filter(Boolean)
      .sort()
  );
  if (hotspotTargets.length > 0) {
    signals.push({
      id: "pattern_risk_hotspots",
      label: "Certain targets keep reappearing",
      type: "risk_pattern",
      strength: strengthForFrequency(Math.min(hotspotTargets.length + 1, entries.length)),
      frequency: Math.min(hotspotTargets.length, entries.length),
      summary: `Recurring pressure is concentrating around ${hotspotTargets.slice(0, 3).join(", ")}, which suggests a repeated fragility hotspot.`,
    });
  }

  buildTradeoffPatterns(entries).forEach((tradeoff, index) => {
    signals.push({
      id: `pattern_tradeoff_${index + 1}`,
      label: tradeoff.label,
      type: "tradeoff_pattern",
      strength: strengthForFrequency(tradeoff.frequency),
      frequency: tradeoff.frequency,
      summary: tradeoff.summary,
    });
  });

  const highConfidenceEntries = entries.filter((entry) => entry.recommendation_confidence?.level === "high");
  const highConfidenceOverconfidenceCount = countByKeyword(
    highConfidenceEntries.map((entry) => entryText(entry)),
    /overconfident|weaker than expected|higher than the original expectation/
  );
  if (highConfidenceEntries.length > 0) {
    signals.push({
      id: "pattern_confidence_quality",
      label:
        highConfidenceOverconfidenceCount > 0
          ? "High-confidence calls can overstate certainty"
          : "Confidence signals are broadly holding up",
      type: "confidence_pattern",
      strength: strengthForFrequency(highConfidenceOverconfidenceCount || highConfidenceEntries.length),
      frequency: highConfidenceOverconfidenceCount || highConfidenceEntries.length,
      summary:
        highConfidenceOverconfidenceCount > 0
          ? "Some high-confidence decisions have later shown weaker outcomes, so similar recommendations deserve an extra simulation or comparison pass."
          : "Available confidence signals are mostly aligning with observed outcomes, although coverage is still limited.",
    });
  }

  buildUncertaintySignals(entries).forEach((signal, index) => {
    signals.push({
      id: `pattern_gap_${index + 1}`,
      label: signal.label,
      type: "data_gap_pattern",
      strength: strengthForFrequency(signal.frequency),
      frequency: signal.frequency,
      summary: signal.summary,
    });
  });

  return signals
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 8);
}
