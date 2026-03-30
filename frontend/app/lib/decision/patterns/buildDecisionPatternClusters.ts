import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { DecisionPatternCluster } from "./decisionPatternTypes";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "your",
  "their",
  "over",
  "under",
  "will",
  "have",
  "been",
  "were",
  "more",
  "less",
  "than",
  "then",
  "when",
  "what",
  "where",
  "which",
  "across",
  "through",
  "while",
  "current",
  "decision",
  "recommended",
  "recommendation",
  "option",
  "path",
]);

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function tokenize(value: unknown) {
  return text(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function unique(values: string[], limit = 4) {
  return Array.from(new Set(values.filter(Boolean))).slice(0, limit);
}

function topKeywords(values: string[], limit = 4) {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    tokenize(value).forEach((token) => {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([token]) => token.replace(/\b\w/g, (match) => match.toUpperCase()));
}

function deriveOutcomeLabel(entry: DecisionMemoryEntry) {
  const timelineText = (entry.timeline_events ?? [])
    .map((event) => `${event.title} ${event.summary}`)
    .join(" ")
    .toLowerCase();
  const calibrationText = timelineText.includes("overconfident")
    ? "Overconfident outcome pattern"
    : timelineText.includes("underconfident")
      ? "Stronger than expected outcome"
      : timelineText.includes("well calibrated")
        ? "Outcome broadly matched expectation"
        : "";

  if (calibrationText) return calibrationText;

  const impactText = `${entry.impact_summary ?? ""} ${entry.compare_summary ?? ""}`.toLowerCase();
  if (/(improv|stabiliz|reduc|protect|predictab|contain)/.test(impactText)) {
    return "Outcome usually improved stability";
  }
  if (/(worse|fragil|delay|higher risk|underperform|unresolved)/.test(impactText)) {
    return "Outcome often left risk exposed";
  }
  return "Outcome evidence remains partial";
}

function buildClusterKey(entry: DecisionMemoryEntry) {
  const actionTokens = tokenize(entry.recommendation_action).slice(0, 3);
  const targetTokens = (entry.target_ids ?? []).slice(0, 2).map((value) => value.toLowerCase());
  const situationTokens = tokenize(entry.situation_summary).slice(0, 2);
  const signature = [...actionTokens, ...targetTokens, ...situationTokens].slice(0, 5);
  return signature.join("|") || `entry:${entry.id}`;
}

export function buildDecisionPatternClusters(memoryEntries: DecisionMemoryEntry[]): DecisionPatternCluster[] {
  const groups = new Map<string, DecisionMemoryEntry[]>();

  memoryEntries.forEach((entry) => {
    const key = buildClusterKey(entry);
    const current = groups.get(key) ?? [];
    current.push(entry);
    groups.set(key, current);
  });

  return Array.from(groups.entries())
    .map(([key, entries], index) => {
      const recurringActions = unique(entries.map((entry) => text(entry.recommendation_action || entry.title)));
      const recurringFeatures = topKeywords(
        entries.flatMap((entry) => [
          text(entry.situation_summary),
          text(entry.impact_summary),
          text(entry.compare_summary),
        ])
      );
      const recurringOutcomes = unique(entries.map((entry) => deriveOutcomeLabel(entry)));
      const fallbackLabel = recurringActions[0] || recurringFeatures[0] || `Pattern ${index + 1}`;

      return {
        id: `pattern_cluster_${index + 1}`,
        label: fallbackLabel,
        entry_ids: entries.map((entry) => entry.id),
        recurring_features: recurringFeatures,
        recurring_actions: recurringActions,
        recurring_outcomes: recurringOutcomes,
      };
    })
    .filter((cluster) => cluster.entry_ids.length > 0)
    .sort((a, b) => b.entry_ids.length - a.entry_ids.length);
}
