import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { OrgMemorySignal, OrgMemoryState } from "./orgMemoryTypes";

type SelectRelevantOrgMemoryInput = {
  orgMemory: OrgMemoryState;
  canonicalRecommendation?: CanonicalRecommendation | null;
};

function tokenize(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

function overlapCount(a: string[], b: string[]) {
  const set = new Set(a);
  return b.filter((value) => set.has(value)).length;
}

export function selectRelevantOrgMemory(input: SelectRelevantOrgMemoryInput): {
  relevantSignals: OrgMemorySignal[];
  relatedRefs: OrgMemoryState["related_refs"];
  currentDecisionNote: string | null;
} {
  const actionTokens = tokenize(input.canonicalRecommendation?.primary?.action ?? "");
  const rankedSignals = [...input.orgMemory.signals]
    .map((signal) => ({
      signal,
      score: overlapCount(actionTokens, tokenize(`${signal.label} ${signal.summary}`)),
    }))
    .sort((a, b) => b.score - a.score || b.signal.coverage_count - a.signal.coverage_count);
  const relevantSignals = rankedSignals.slice(0, 3).map((item) => item.signal);
  const relatedRefs = Array.from(
    new Map(
      relevantSignals.flatMap((signal) => signal.supporting_refs).map((ref) => [ref.id, ref])
    ).values()
  ).slice(0, 5);

  const currentDecisionNote = relevantSignals[0]
    ? `Organization memory suggests the current recommendation resembles a cross-project pattern: ${relevantSignals[0].summary.replace(/\.$/, "")}.`
    : null;

  return {
    relevantSignals,
    relatedRefs,
    currentDecisionNote,
  };
}
