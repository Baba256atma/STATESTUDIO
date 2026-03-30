import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import { buildOrgMemoryGuidance } from "./buildOrgMemoryGuidance";
import { buildOrgMemoryIndex } from "./buildOrgMemoryIndex";
import { buildOrgMemorySignals } from "./buildOrgMemorySignals";
import { selectRelevantOrgMemory } from "./selectRelevantOrgMemory";
import type { OrgMemoryState } from "./orgMemoryTypes";

type BuildOrgMemoryStateInput = {
  memoryEntries?: DecisionMemoryEntry[] | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
};

function unique(values: string[], limit = 4) {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))).slice(0, limit);
}

export function buildOrgMemoryState(input: BuildOrgMemoryStateInput): OrgMemoryState {
  const memoryEntries = (input.memoryEntries ?? []).filter((entry) =>
    Boolean(entry.recommendation_action || entry.recommendation_summary || entry.situation_summary)
  );
  const index = buildOrgMemoryIndex(memoryEntries);
  const signals = buildOrgMemorySignals({ memoryEntries });
  const recurringSuccesses = signals
    .filter((signal) => signal.category === "org_success_pattern")
    .map((signal) => signal.summary)
    .slice(0, 3);
  const recurringFailures = signals
    .filter((signal) => signal.category === "org_failure_pattern" || signal.category === "org_confidence_pattern")
    .map((signal) => signal.summary)
    .slice(0, 3);
  const recurringTradeoffs = unique(
    signals
      .filter((signal) => signal.category === "org_tradeoff_pattern")
      .map((signal) => signal.label),
    3
  );
  const recurringUncertainties = unique(
    signals
      .filter((signal) => signal.category === "org_risk_pattern" || signal.category === "org_learning_gap")
      .map((signal) => signal.label),
    3
  );

  const baseState: OrgMemoryState = {
    generated_at: Date.now(),
    coverage_count: memoryEntries.length,
    signals,
    clusters: index.clusters,
    recurring_successes: recurringSuccesses,
    recurring_failures: recurringFailures,
    recurring_tradeoffs: recurringTradeoffs,
    recurring_uncertainties: recurringUncertainties,
    relevant_signals: [],
    related_refs: [],
    org_guidance: null,
    current_decision_note: null,
    explanation:
      memoryEntries.length < 4
        ? "Organization memory is still limited. Nexora can surface tentative cross-project signals, but it needs more decision history and replay-backed outcomes before stronger organizational guidance is justified."
        : `Across ${memoryEntries.length} organization decision records, Nexora is starting to surface cross-project patterns, repeated trade-offs, and broader calibration signals.`,
  };

  const relevant = selectRelevantOrgMemory({
    orgMemory: baseState,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });

  return {
    ...baseState,
    relevant_signals: relevant.relevantSignals,
    related_refs: relevant.relatedRefs,
    org_guidance: buildOrgMemoryGuidance({
      signals: relevant.relevantSignals.length ? relevant.relevantSignals : signals,
      currentAction: input.canonicalRecommendation?.primary?.action ?? null,
    }),
    current_decision_note: relevant.currentDecisionNote,
  };
}
