import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import { buildDecisionPatternClusters } from "./buildDecisionPatternClusters";
import { buildDecisionPatternSignals } from "./buildDecisionPatternSignals";
import type { DecisionPatternIntelligence } from "./decisionPatternTypes";

type BuildDecisionPatternIntelligenceInput = {
  memoryEntries?: DecisionMemoryEntry[] | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
};

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function tokenize(value: unknown) {
  return text(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

function unique(values: string[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

function overlapsAction(currentAction: string, candidateAction: string) {
  const currentTokens = new Set(tokenize(currentAction));
  const candidateTokens = tokenize(candidateAction);
  return candidateTokens.some((token) => currentTokens.has(token));
}

function recommendationHintFromSignals(intelligence: {
  topSuccessPatterns: string[];
  topFailurePatterns: string[];
  repeatedTradeoffs: string[];
  repeatedUncertainties: string[];
}) {
  if (intelligence.topFailurePatterns[0]) {
    return `Pattern evidence suggests extra caution here: ${intelligence.topFailurePatterns[0].replace(/\.$/, "")}.`;
  }
  if (intelligence.topSuccessPatterns[0]) {
    return `Pattern evidence suggests a useful next move: ${intelligence.topSuccessPatterns[0].replace(/\.$/, "")}.`;
  }
  if (intelligence.repeatedTradeoffs[0]) {
    return `Repeated trade-offs suggest you should explicitly manage ${intelligence.repeatedTradeoffs[0].toLowerCase()}.`;
  }
  if (intelligence.repeatedUncertainties[0]) {
    return `Pattern coverage remains limited by ${intelligence.repeatedUncertainties[0].toLowerCase()}.`;
  }
  return null;
}

export function buildDecisionPatternIntelligence(
  input: BuildDecisionPatternIntelligenceInput
): DecisionPatternIntelligence {
  const memoryEntries = (input.memoryEntries ?? []).filter(
    (entry) =>
      Boolean(entry.recommendation_action || entry.recommendation_summary || entry.situation_summary)
  );
  const clusters = buildDecisionPatternClusters(memoryEntries);
  const patternSignals = buildDecisionPatternSignals({
    memoryEntries,
    clusters,
  });
  const topSuccessPatterns = patternSignals
    .filter((signal) => signal.type === "success_pattern" || signal.type === "confidence_pattern")
    .slice(0, 3)
    .map((signal) => signal.summary);
  const topFailurePatterns = patternSignals
    .filter((signal) => signal.type === "failure_pattern" || signal.type === "risk_pattern")
    .slice(0, 3)
    .map((signal) => signal.summary);
  const repeatedTradeoffs = unique(
    patternSignals
      .filter((signal) => signal.type === "tradeoff_pattern")
      .map((signal) => signal.label),
    3
  );
  const repeatedUncertainties = unique(
    patternSignals
      .filter((signal) => signal.type === "data_gap_pattern")
      .map((signal) => signal.label),
    3
  );
  const bestMatchingCluster =
    input.canonicalRecommendation?.primary?.action
      ? clusters.find((cluster) =>
          cluster.recurring_actions.some((action) =>
            overlapsAction(input.canonicalRecommendation?.primary?.action ?? "", action)
          )
        ) ?? null
      : null;
  const currentPatternNote = bestMatchingCluster
    ? `The current recommendation resembles ${bestMatchingCluster.label.toLowerCase()}, which has appeared in ${bestMatchingCluster.entry_ids.length} prior decision ${bestMatchingCluster.entry_ids.length === 1 ? "record" : "records"}.`
    : null;
  const recommendationHint = recommendationHintFromSignals({
    topSuccessPatterns,
    topFailurePatterns,
    repeatedTradeoffs,
    repeatedUncertainties,
  });
  const explanation =
    memoryEntries.length < 3
      ? "Current pattern coverage is limited. Nexora can surface tentative recurring signals, but it needs more replay and outcome evidence to learn reliably."
      : topFailurePatterns[0]
        ? `Pattern evidence is becoming useful. Nexora is seeing repeated strengths and weak spots across ${memoryEntries.length} decision records, especially around ${topFailurePatterns[0].toLowerCase()}.`
        : `Pattern evidence is becoming useful. Across ${memoryEntries.length} decision records, Nexora is starting to see which decision styles tend to hold up and which trade-offs keep repeating.`;

  return {
    coverage_count: memoryEntries.length,
    pattern_signals: patternSignals,
    clusters,
    top_success_patterns: topSuccessPatterns,
    top_failure_patterns: topFailurePatterns,
    repeated_tradeoffs: repeatedTradeoffs,
    repeated_uncertainties: repeatedUncertainties,
    recommendation_hint: recommendationHint,
    current_pattern_note: currentPatternNote,
    related_entry_ids: bestMatchingCluster?.entry_ids.slice(0, 3) ?? [],
    explanation,
  };
}
